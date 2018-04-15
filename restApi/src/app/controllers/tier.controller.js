import { Tier as TierSql } from '../sql/';

export default (db, config) => {
    var cache = {};

    function get(){
        function helper(tier_type){
            console.log("In Tier Helper");
            if(tier_type && cache[tier_type]){
                console.log("Was cached");
                return Promise.resolve(cache[tier_type]);
            }

            return new Promise((resolve, reject)=>{
                if(!tier_type){
                    return reject({
                        code: 400,
                        err: 'No tier_type provided'
                    })
                }
                db.one(TierSql.get,{
                    tier_type: tier_type
                })
                .then(res=>{
                    cache[tier_type] = res;
                    return resolve(res);
                })
                .catch(err => reject(err));
            })
        }
        function rest(req, res, next){
            helper(req.params.tier_type)
            .then(data=>{
                return res.json(data);
            })
            .catch(err=>{
                return res.json(err);
            })
        }
        return {
            helper: helper,
            rest: rest
        }
    }

    function list(){
        function helper(){
            return db.any(TierSql.list)
            .then(res=>{
                return Promise.resolve(res);
            })
            .catch(err=>{
                return Promise.reject(err);
            })
        }
        function rest(req, res, next){
            helper()
            .then(data=>{
                return res.status(200).json(data);
            })
            .catch(err=> res.status(500).json(err));
        }
        return {
            rest: rest,
            helper: helper
        }
    }

    return {
        rest: {
           get: get().rest,
           list: list().rest
        },
        get: get().helper,
        list: list().helper
    }
}