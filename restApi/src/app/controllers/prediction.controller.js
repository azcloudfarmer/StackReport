import { Prediction as PredictionSql, PredictionMeta as PredictionMetaSql } from '../sql/';
import { RestHelpers } from '../lib/';

export default (db, config) => {
    
    function list(){
        function helper(page=0, size=10){
            return new Promise((resolve, reject)=>{
                db.any(PredictionMetaSql.list,{
                    limit: size,
                    offset: page*size
                })
                .then(prediction_metas=>{
                    var predictionPromises = [];
                    prediction_metas.forEach(prediction_meta=>{
                        predictionPromises.push(
                            new Promise((resolve2, reject2)=>{
                                return db.any(PredictionSql.list,{
                                    prediction_meta_id: prediction_meta.prediction_meta_id
                                })
                                .then(res=>{
                                    return resolve2(res)
                                })
                                .catch(err=>{
                                    return reject2(err);
                                })
                            })
                        )
                    })

                    return Promise.all(predictionPromises)
                    .then(predictions=>{
                        return new Promise((resolve3)=>{
                            var response = [];
                            var i = 0;
                            predictions.forEach(prediction=>{
                                //Find correct prediction meta
                                response.push({
                                    meta: prediction_metas[i],
                                    prediction: prediction
                                });
                                i+=1;
                            })
                            return resolve3(response);
                        });
                    })
                    .catch(err=>{
                        return reject(err);
                    })
                })
                .then(res=>{
                    console.log(res);
                    return resolve(res);
                })
                .catch(err=>{
                    reject(err);
                });
            });
        }
        return {
            helper: helper,
            rest: RestHelpers.BasicListRequest(helper)
        }
    }


    function create(){
        /* 
            Create a Prediction 
            Input: A fund_id and an array of securities that are predicted
        */
		function helper(payload){
			return new Promise((resolve, reject)=>{
                
                if( !payload || !payload.fund_id || !payload.securities
                ){
					return reject({
						err: 'Missing required Field.',
						code: 400
					})
                }
                console.log(payload);
                return db.one(PredictionMetaSql.create,{
                    fund_id: payload.fund_id
                })
                .then(predictionMetaResponse =>{
                    if(!predictionMetaResponse && !predictionMetaResponse.prediction_meta_id){
                        return reject({
                            err: 'Unable to insert',
                            code: 5000
                        });
                    }
                    var prediction_meta_id = predictionMetaResponse.prediction_meta_id
                    return db.tx(t => {
                        var queries = [];
                        
                        payload.securities.forEach(security_id => {
                            queries.push(
                                t.none(PredictionSql.create, {
                                    prediction_meta_id: prediction_meta_id,
                                    security_id: security_id
                                })
                            );
                        });
                        return t.batch(queries);
                    })
                })
                .then(res => {
                    return resolve(true);
                })
                .catch(err => {
                    if(err && err.code == "23505"){
                        reject({
                            err: 'Prediction already in database',
                            code: 409
                        })
                    }else{
                        reject(err);
                    }
                });
			})
        }

        function rest(req, res, next){
			helper(req.body)
				.then(data => {
					if(data){
						res.status(201).json({message: 'Prediction successfully created', code: 201});
					}else{
						res.status(400).json({err: 'Prediction not created', code: 400});
					}
				})
				.catch(err => res.json(err));
		}
		return {
			rest: rest,
			helper: helper
		}
    }

    return {
        rest: {
            list: list().rest,
            create: create().rest
        },
        list: list().helper,
        create: create().helper
    }
}