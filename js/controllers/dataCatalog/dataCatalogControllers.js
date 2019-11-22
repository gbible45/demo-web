'use strict';
angular.module('common.controllers')
    .controller('dataCatalogCtrl', function ($scope, $location, $timeout, $translate, $q, common, portalService, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("dataCatalogControllers.js : dataCatalogCtrl");
        var contents = this;

        console.log("test");
    })
    .controller('dataCatalogCtrl1', function ($scope, $location, $timeout, $translate, $q, common, portalService, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("dataCatalogControllers.js : dataCatalogCtrl1");
        var contents = this;

        console.log("test menu1");
    })
    .controller('dataCatalogCtrl2', function ($scope, $location, $timeout, $translate, $q, common, portalService, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("dataCatalogControllers.js : dataCatalogCtrl2");
        var contents = this;

        console.log("test menu2");
    })
    .controller('dataCatalogCtrl3', function ($scope, $location, $timeout, $translate, $q, common, portalService, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("dataCatalogControllers.js : dataCatalogCtrl3");
        var contents = this;

        console.log("test menu3");
    })
;
