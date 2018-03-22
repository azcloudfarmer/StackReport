import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { EndpointService } from './endpoint.service';

@Injectable()
export class PredictionService {

    url: string;
    
    constructor(private http:Http, public endpointService: EndpointService) { 
        this.url = this.endpointService.base + '/api/f';
    }
    
    getPredictions(fund_id:string): Promise<any> {
    	return new Promise((resolve, reject)=>{
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });

            this.http.get(this.url + '/' + fund_id + '/p/', options).toPromise()
            .then(res=>{
                var resJson = res.json();
                return resolve(resJson);
            })
            .catch(this.handleErrorPromise);
        })
    }

    private handleErrorPromise (error: Response | any) {
        console.error(error.message || error);
        return Promise.reject(error.message || error);
    }    

}
