import { Injectable } from 'angular2/core';
import { Http, Response, Headers } from 'angular2/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';
import {Router} from 'angular2/router';

@Injectable()
export class SecurityService {

    private actionUrl: string;
    private headers: Headers;
    private storage: any;
    private redirect_uri = 'http://localhost:3000';

    constructor(private _http: Http, private _configuration: Configuration, private _router: Router) {

        this.actionUrl = _configuration.Server + 'api/DataEventRecords/';

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.storage = localStorage;

        if (this.retrieve("IsAuthorized") !== "") {
            this.HasAdminRole = this.retrieve("HasAdminRole");
            this.IsAuthorized = this.retrieve("IsAuthorized");
        }
    }

    public IsAuthorized: boolean;
    public HasAdminRole: boolean;

    public GetToken(): any {
        return this.retrieve("authorizationData");
    }

    public ResetAuthorizationData() {
        this.store("authorizationData", "");
        this.store("authorizationDataIdToken", "");

        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.store("HasAdminRole", false);
        this.store("IsAuthorized", false);
    }

    public SetAuthorizationData(token: any, id_token:any) {
        if (this.retrieve("authorizationData") !== "") {
            this.store("authorizationData", "");
        }

        this.store("authorizationData", token);
        this.store("authorizationDataIdToken", id_token);
        this.IsAuthorized = true;
        this.store("IsAuthorized", true);

        var data: any = this.getDataFromToken(token);
        for (var i = 0; i < (data.role || '').length; i++) {
            if (data.role[i] === "dataEventRecords.admin") {
                this.HasAdminRole = true;
                this.store("HasAdminRole", true)
            }
        }
    }

    public Authorize() {
        this.ResetAuthorizationData();

        console.log("BEGIN Authorize, no auth data");

        var authorizationUrl = 'https://login.microsoftonline.com/77d753ab-8f58-4369-8b10-d07fecdb54db/oauth2/authorize';
        var client_id = 'c7b8265f-780f-4fb7-b681-53f095faa23f';
       
        var response_type = "id_token token";
        var scope = "dataEventRecords securedFiles openid";
        var nonce = "N" + Math.random() + "" + Date.now();
        var state = Date.now() + "" + Math.random();
        var resource = 'https://oauth-spike.azurewebsites.net';
        
        this.store("authStateControl", state);
        this.store("authNonce", nonce);
        console.log("AuthorizedController created. adding myautostate: " + this.retrieve("authStateControl"));

        var url =
            authorizationUrl + "?" +
            "response_type=" + encodeURI(response_type) + "&" +
            "client_id=" + encodeURI(client_id) + "&" +
            "redirect_uri=" + encodeURI(this.redirect_uri) + "&" +
            "resource=" + encodeURI(resource) + "&" +
            //"scope=" + encodeURI(scope) + "&" +
            "nonce=" + encodeURI(nonce) + "&" +
            "state=" + encodeURI(state);

        window.location.href = url;
    }

    public AuthorizedCallback() {
        console.log("BEGIN AuthorizedCallback, no auth data");
        this.ResetAuthorizationData();

        var hash = window.location.hash.substr(1);

        var result: any = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        console.log(result);
        console.log("AuthorizedCallback created, begin token validation");

        var token = "";
        var id_token = "";
        var authResponseIsValid = false;
        if (!result.error) {

            if (result.state !== this.retrieve("authStateControl")) {
                console.log("AuthorizedCallback incorrect state");
            } else {

                token = result.access_token;
                id_token = result.id_token

                var dataIdToken: any = this.getDataFromToken(id_token);
                console.log(dataIdToken);

                // validate nonce
                if (dataIdToken.nonce !== this.retrieve("authNonce")) {
                    console.log("AuthorizedCallback incorrect nonce");
                } else {
                    this.store("authNonce", "");
                    this.store("authStateControl", "");

                    authResponseIsValid = true;
                    console.log("AuthorizedCallback state and nonce validated, returning access token");
                }
            }
        }

        if (authResponseIsValid) {
            this.SetAuthorizationData(token, id_token);
            console.log(this.retrieve("authorizationData"));

            this._router.navigate(['Overviewindex']);
        }
        else {
            this.ResetAuthorizationData();
            this._router.navigate(['Unauthorized']);
        }
    }

    public Logoff() {
        this.ResetAuthorizationData();

        var logOffUri = 'https://login.microsoftonline.com/77d753ab-8f58-4369-8b10-d07fecdb54db/oauth2/lgoout';
        var url = logOffUri + '?' + 'post_logout_redirect_uri=' + encodeURI(this.redirect_uri);
    }

    public HandleError(error: any) {
        console.log(error);
        if (error.status == 403) {
            this._router.navigate(['Forbidden'])
        }
        else if (error.status == 401) {
            this.ResetAuthorizationData();
            this._router.navigate(['Unauthorized'])
        }
    }

    private urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }

        return window.atob(output);
    }

    private getDataFromToken(token) {
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }

    private retrieve(key: string): any {
        var item = this.storage.getItem(key);

        if (item && item !== 'undefined') {
            return JSON.parse(this.storage.getItem(key));
        }

        return;
    }

    private store(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }

}