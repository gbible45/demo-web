'use strict';

angular.module('common.controllers')
    .controller('memberUsersCtrl', function ($scope, $location, $state, $stateParams, $translate, common, memberService, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("memberControllers.js : memberUsersCtrl");
        var contents = this;
        // delUserYn 구분 없는 사용자 리스트
        contents.allMemberList = [];
        // delUserYn이 'N'인 사용자 리스트
        contents.memberList = [];

        contents.listAllMembers = function() {
            var rtnPromise = memberService.listAllMembers();
            rtnPromise.success(function (data, status, response) {
                if (angular.isArray(data)) {
                    contents.allMemberList =  angular.copy(data);
                    for (var i = contents.allMemberList.length - 1 ; i >= 0 ; i--) {
                        if (data[i].delUserYn == 'Y') {
                            data.splice(i, 1);
                        }
                    }
                    contents.memberList = data;
                }
            });
            rtnPromise.error(function (data, status, response) {

            });
        };

        contents.createMember = function($event) {
            $scope.dialogOptions = {
                controller : "memberAddPopCtrl",
                formName : 'memberAddPopForm',
                mode : "create"
            };
            common.showDialog($scope, $event, $scope.dialogOptions);
        };

        contents.updateMember = function($event, member) {
            $scope.dialogOptions = {
                controller : "memberAddPopCtrl",
                formName : 'memberAddPopForm',
                mode : "update",
                member : member
            };
            common.showDialog($scope, $event, $scope.dialogOptions);
        };

        contents.deleteMember = function(member) {
            common.showConfirm($translate.instant('label.delete_user'), $translate.instant('confirm_message.delete_selected_users'), $translate.instant('label.delete')).then(function(){
                if (angular.isObject(member)) {
                    var rtnPromise = memberService.deleteMember(member.email);
                    rtnPromise.success(function (data, status, headers) {
                        common.showAlertSuccess($translate.instant('message.deleted'));
                        contents.listAllMembers();
                    });
                    rtnPromise.error(function (data, status, headers) {
                        common.showAlertError(data.message);
                    });
                }
            });
        };

        contents.resetMemberPassword = function(member) {
            common.showConfirm($translate.instant('label.reset_user_password'), $translate.instant('confirm_message.reset_password_selected_user'), $translate.instant('label.reset')).then(function(){
                if (angular.isObject(member)) {
                    var resetPassword = member.email + CONSTANTS.userPasswordTail;
                    var rtnPromise = memberService.resetMemberPassword(member.email, resetPassword);
                    rtnPromise.success(function (data, status, headers) {
                        common.showAlertSuccess($translate.instant('message.initialization_password_reset'));
                        contents.listAllMembers();
                    });
                    rtnPromise.error(function (data, status, headers) {
                        common.showAlertError(data.message);
                    });
                }
            });
        };


        contents.updateMemberPassword = function($event, member) {
            $scope.dialogOptions = {
                controller : "memberUpdatePasswordPopCtrl",
                formName : 'memberUpdatePasswordPopForm',
                member : member
            };
            common.showDialog($scope, $event, $scope.dialogOptions);
        };

        contents.listAllMembers();

    })
    .controller('memberAddPopCtrl', function ($scope, $location, $state, $stateParams, $translate, $mdDialog, common, memberService, ValidationService, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("memberControllers.js : memberAddPopCtrl");
        var pop = this;
        pop.vs	= new ValidationService({controllerAs: pop});
        pop.mode = $scope.dialogOptions.mode;
        pop.formName = $scope.dialogOptions.formName;
        pop.data = {};

        pop.userPasswordTail = CONSTANTS.userPasswordTail;

        if (pop.mode == "update") {
            pop.data = angular.copy($scope.dialogOptions.member);
            $scope.dialogOptions.title = $translate.instant('label.edit_user');
            $scope.dialogOptions.okName = $translate.instant('label.modified');
            pop.data.defaultRole = pop.data.roles[0];
        } else {
            $scope.dialogOptions.title = $translate.instant('label.add_user');
            $scope.dialogOptions.okName = "추가";
            pop.data.defaultRole = "MONITOR";
        }
        $scope.dialogOptions.dialogClassName =  "modal-dialog";
        $scope.dialogOptions.cancelName = $translate.instant('label.cancel');

        $scope.dialogOptions.templateUrl = _VIEWS_ + "/member/popAddMember.html" + _VersionTail();

        // Dialog ok 버튼 클릭 시 액션 정의
        pop.okAction = false;
        $scope.dialogOptions.popDialogOk = function () {
            if (pop.okAction) return;
            pop.okAction = true;
            if (!pop.vs.checkFormValidity(pop[pop.formName])) {
                pop.okAction = false;
                return;
            }
            var roles = [];
            roles.push(pop.data.defaultRole);
            var param = {
                "name": pop.data.name,
                "roles": roles
            };
            if (pop.mode == "create") {
                param.password = pop.data.email + CONSTANTS.userPasswordTail;
            }
            var rtnPromise = {};
            if (pop.mode == "update") {
                rtnPromise = memberService.updateMember(pop.data.email, param);
            } else {
                rtnPromise = memberService.createMember(param);
            }
            rtnPromise.success(function (data, status, headers) {
                if (pop.mode == "update") {
                    common.showAlertSuccess($translate.instant('message.it_is_changed'));
                } else {
                    common.showAlertSuccess($translate.instant('message.registered'));
                }
                $scope.contents.listAllMembers();
            });
            rtnPromise.error(function (data, status, headers) {
                common.showAlertError(data.message);
            });

            $mdDialog.hide();
        };

        $scope.dialogOptions.popCancel = function () {
            $mdDialog.cancel();
        };

        pop.checkIdValidation = function(email) {
            var memberList = angular.copy($scope.contents.allMemberList);
            angular.forEach(memberList, function(member, key) {
                if (member.email === email) {
                    return {isValid: false, message: $translate.instant('message.an_id_that_already_exists')};
                }
            });
            return {isValid: true};
        };
    })
    .controller('memberUpdatePasswordPopCtrl', function ($scope, $location, $state, $stateParams, $translate, $mdDialog, common, memberService, ValidationService) {
        if (_MODE_ == "DEBUG") console.log("memberControllers.js : memberUpdatePasswordPopCtrl");
        var pop = this;
        pop.vs	= new ValidationService({controllerAs: pop});
        pop.mode = $scope.dialogOptions.mode;
        pop.formName = $scope.dialogOptions.formName;
        pop.data = {};

        pop.data = angular.copy($scope.dialogOptions.member);
        $scope.dialogOptions.dialogClassName =  "modal-dialog";
        $scope.dialogOptions.title = $translate.instant('label.change_password');
        $scope.dialogOptions.okName = $translate.instant('label.modified');
        $scope.dialogOptions.cancelName = $translate.instant('label.cancel');

        $scope.dialogOptions.templateUrl = _VIEWS_ + "/member/popUpdateMemberPassword.html" + _VersionTail();

        // Dialog ok 버튼 클릭 시 액션 정의
        pop.okAction = false;
        $scope.dialogOptions.popDialogOk = function () {
            if (pop.okAction) return;
            pop.okAction = true;
            if (!pop.vs.checkFormValidity(pop[pop.formName])) {
                pop.okAction = false;
                return;
            }

            var rtnPromise = memberService.updateMemberPassword(pop.data.email, pop.data.password);
            rtnPromise.success(function (data, status, headers) {
                common.showAlertSuccess($translate.instant('message.it_is_changed'));
                $scope.contents.listAllMembers();
            });
            rtnPromise.error(function (data, status, headers) {
                common.showAlertError(data.message);
            });
            $mdDialog.hide();
        };

        $scope.dialogOptions.popCancel = function () {
            $mdDialog.cancel();
        };

        pop.checkPasswordValidation = function(newPassword, confirmNewPassword) {
            var passwordCheck = false;
            if (newPassword !== confirmNewPassword) {
                passwordCheck = true;
            }
            if (passwordCheck) {
                return {isValid: false, message: $translate.instant('message.new_password_password_verification_not_same')};
            } else {
                return {isValid: true};
            }
        };
    })

;
