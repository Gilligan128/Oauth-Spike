"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var http_1 = require('angular2/http');
var SecurityService_1 = require('../services/SecurityService');
var ValuesComponent = (function () {
    function ValuesComponent(_securityService, _http) {
        this._securityService = _securityService;
        this._http = _http;
    }
    ValuesComponent.prototype.ngOnInit = function () {
        this.GetValues();
    };
    ValuesComponent.prototype.GetValues = function () {
        var _this = this;
        var jwt = this._securityService.GetToken();
        var authHeader = new http_1.Headers();
        if (jwt) {
            authHeader.append('Authorization', 'Bearer ' + jwt);
        }
        this._http.get("https://oauth-spike.azurewebsites.net/api/values", { headers: authHeader })
            .map(function (res) { return res.json(); })
            .subscribe(function (values) { return _this.Values = values; });
    };
    ValuesComponent = __decorate([
        core_1.Component({
            selector: 'values',
            templateUrl: 'app/values/values.component.html',
            directives: [common_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [SecurityService_1.SecurityService, http_1.Http])
    ], ValuesComponent);
    return ValuesComponent;
}());
exports.ValuesComponent = ValuesComponent;
//# sourceMappingURL=values.component.js.map