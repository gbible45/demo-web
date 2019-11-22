//'use strict';

angular.module('common.services')
    .factory('portalService', function (common, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("portalService.js : portalService");

        var portalService = {};

        portalService.pingCheck = function () {
            return common.noMsgRetrieveResourcePromiseJson(CONSTANTS.coreApiContextUrl + '/ping/', 'GET', null, null, null, _SERVER_CHECK_TIMEOUT_);
        };

        portalService.getServerHostUrl = function () {
            return common.noMsgRetrieveResourcePromiseJson(CONSTANTS.coreApiContextUrl + "/server_host_url/", 'GET', null, null, null, _SERVER_CHECK_TIMEOUT_);
        };

        portalService.accessCheck = function (email) {
            return common.noMsgRetrieveResourcePromiseJson(CONSTANTS.commApiContextUrl + '/auth_check/', 'GET', {"email": email});
        };

        portalService.accessInfo = function () {
            return common.noMsgRetrieveResourcePromiseJson(CONSTANTS.commApiContextUrl + '/auth_info/', 'GET');
        };

        portalService.logoutAction = function () {
            var scope = common.getMainCtrlScope();
            scope.main.loadingMainBody = true;
            var logoutPromise = common.retrieveResourcePromiseJson(CONSTANTS.commApiContextUrl + '/logout/', 'DELETE');
            logoutPromise.success(function (data, status, headers) {
                scope.main.loadingMainBody = false;
                common.logout();
            });
            logoutPromise.error(function (data, status, headers) {
                scope.main.loadingMainBody = false;
                common.logout();
            });
        };

        return portalService;
    })
;


