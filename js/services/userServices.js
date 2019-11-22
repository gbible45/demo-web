'use strict';

angular.module('common.services')
    .factory('userService', function (common, cache, cookies, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("userService.js : userService");

        var userService = {};

        userService.userLogin = function (params) {
            return common.retrieveResourcePromiseJson(CONSTANTS.commApiContextUrl + '/login/', 'POST', params);
        };

        /* 비밀번호 수정 자기 자신 */
        userService.updateUserPassword = function(param) {
            return common.retrieveResourcePromiseJson(CONSTANTS.portalApiContextUrl + '/users/change_password/', 'PUT', param);
        };

        return userService;

    })
;
