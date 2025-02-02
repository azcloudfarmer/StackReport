import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { EndpointService } from './endpoint.service';
import { User } from '../models/user';

@Injectable()
export class UserService {
    /*url: string;
    constructor(private http:Http, private endpointService: EndpointService) { 
        this.url = this.endpointService.getBase() + this.endpointService.getUser();
    }*/
    url: string;
    constructor(private http:Http, public endpointService: EndpointService) { 
        this.url = this.endpointService.base + '/api/u/';
    }

    public getUsers(page:Number = 0, size:Number = 10): Promise<User[]> {
        return new Promise((resolve, reject)=>{
            let options = new RequestOptions({
                params: {
                    page: page,
                    size: size
                  }
            })
            console.log("this.url");
            console.log(this.url);
            this.http.get(this.url, options).toPromise()
            .then(res=>{
                return resolve(this.extractData(res))
            })
	        .catch(this.handleErrorPromise);
        })
    }

    private extractData(res: Response) {
	    let body = res.json();
        return body.data || [];
    }

    private handleErrorPromise (error: Response | any) {
        console.error(error.message || error);
        return Promise.reject(error.message || error);
    }	

} 