//'use strict';

angular.module('common.services')
    .factory('memberService', function (common, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("memberService.js : memberService");

        var memberService = {};

        /* 사용자관리 조회 */
        memberService.listAllMembers = function (param) {
            return common.retrieveResourcePromiseJson(CONSTANTS.portalApiContextUrl + '/users/', 'GET', param);
        };

        /* 회원정보 조회 */
        memberService.getUserInfo = function (email) {
            return common.retrieveResourcePromiseJson(CONSTANTS.commApiContextUrl + '/users/' + email + "/", 'GET');
        };

        /* 비밀번호 초기화 */
        memberService.resetPassword = function(email) {
            return common.retrieveResourcePromiseJson(CONSTANTS.portalApiContextUrl + '/users/' + email + '/reset_password/', 'POST', param);
        };

        /* 회원정보 조회 : 추가할 운영자 조회 */
        memberService.getUserSearch = function (email) {
            return common.retrieveResourcePromiseJson(CONSTANTS.portalApiContextUrl + '/users/'+email+'/', 'GET');
        };

        /* 사용자 등록 */
        memberService.createMember = function (param) {
            return common.retrieveResourcePromiseJson(CONSTANTS.portalApiContextUrl + '/users/', 'POST', param);
        };

        /* 사용자 정보 변경 */
        memberService.updateMember = function (email, param) {
            return common.retrieveResourcePromiseJson(CONSTANTS.portalApiContextUrl + '/users/' + email + '/', 'PUT', param);
        };

        /* 사용자 비밀번호 수정 */
        memberService.updateMemberPassword = function (email, newPassword) {
            var param = {
                "newPassword": newPassword
            };
            return common.retrieveResourcePromiseJson(CONSTANTS.portalApiContextUrl + '/users/' + email + '/change_password/', 'PUT', param);
        };

        /* 사용자 비밀번호 초기화 */
        memberService.resetMemberPassword = function (email, resetPassword) {
            var param = {
                "newPassword": resetPassword
            };
            return common.retrieveResourcePromiseJson(CONSTANTS.portalApiContextUrl + '/users/' + email + '/reset_password/', 'PUT', param);
        };

        /* 사용자 삭제 */
        memberService.deleteMember = function (email) {
            return common.retrieveResourcePromiseJson(CONSTANTS.portalApiContextUrl + '/users/' + email + '/', 'DELETE');
        };

        return memberService;

    })
;
