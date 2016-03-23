import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Http, Response, Headers } from 'angular2/http';
import { SecurityService } from '../services/SecurityService';

@Component({
    selector: 'values',
    templateUrl: 'app/values/values.component.html',
    directives: [CORE_DIRECTIVES]
})

export class ValuesComponent implements OnInit {

    public Values: string[];
    
    constructor(private _securityService: SecurityService, private _http: Http) {
    }
    
    ngOnInit() {
       this.GetValues();
    }
    
    private  GetValues(){
        var jwt = this._securityService.GetToken();
        var authHeader = new Headers();
        if(jwt) {
            authHeader.append('Authorization', 'Bearer ' + jwt);  
        }
         this._http.get("https://oauth-spike.azurewebsites.net/api/values", { headers: authHeader})
         .map(res => res.json())
         .subscribe(values =>  this.Values = values);
         
    }
}