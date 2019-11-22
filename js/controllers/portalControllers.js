'use strict';

angular.module('common.controllers')
    .controller('loadingCtrl', function ($scope) {
        if (_MODE_ == "DEBUG") console.log("portalControllers.js : loadingCtrl");
        var contents = this;
    })
    .controller('serverErrCtrl', function ($scope, $location, $translate, $timeout, common, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("portalControllers.js : serverErrCtrl");
        var contents = this;

        $scope.main.refreshIntervalStart('serverErrCheckInterval', function () {
            $scope.main.apiServerUrlToAccessChecking();
        }, CONSTANTS.refreshInterval);
    })
;
