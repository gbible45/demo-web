'use strict';

angular.module('common.controllers')
    .controller('loginCtrl', function ($scope, $location, $timeout, $translate, common, userService, ValidationService, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("userControllers.js : loginCtrl");

        var contents = this;

        $scope.main.mainLayoutClass = "one_page";
        $scope.main.reloadTimmerStop();

        contents.vs = new ValidationService({controllerAs: contents});

        contents.firstPassword = $translate.instant('label.id') + CONSTANTS.userPasswordTail;

        contents.loginInfo = {};

        contents.isLoginAction = false;
        contents.loginAction = function (evt) {
            contents.isLoginAction = true;
            if (! contents.vs.checkFormValidity(contents.loginForm)) {
                contents.isLoginAction = false;
                return;
            }
            var params = {};
            params.email    = contents.loginInfo.email;
            params.password  = contents.loginInfo.password;
            var userLoginPromise = userService.userLogin(params);
            userLoginPromise.success(function (data, status, response) {
                contents.isLoginAction = false;
                if (angular.isObject(data) && data.email) {
                    common.setUserInfo(data);
                    if (data.changePasswordYn == 'N') {
                        $scope.main.updateUserPassword(null, 'first');
                    }
                    $scope.main.mainLayoutClass = "main";
                    $scope.main.userInfoLoad = true;
                    if (common.isLoginNoAcceptPage($location.path())) {
                        common.moveHomeState();
                    } else {
                        $scope.main.accessFrameSet();
                    }
                } else {
                    common.showAlertError($translate.instant('label.login_error'), $translate.instant('message.please_check_id_and_password'));
                }
            });
            userLoginPromise.error(function (data, status, response) {
                contents.isLoginAction = false;
                common.showAlertError($translate.instant('label.login_error'), $translate.instant('message.please_check_id_and_password'));
            });
        };
    })

    .controller('userInfoPopCtrl', function ($scope, $location, $state, $stateParams, $translate, $mdDialog, common, userService, ValidationService) {
        if (_MODE_ == "DEBUG") console.log("userControllers.js : userInfoPopCtrl");
        var pop = this;
        pop.vs	= new ValidationService({controllerAs: pop});
        pop.data = {};

        pop.data = angular.copy($scope.main.userInfo);
        pop.data.defaultRole = pop.data.roles[0];
        $scope.dialogOptions.dialogClassName =  "modal-dialog";
        $scope.dialogOptions.title = $translate.instant('label.profile');
        $scope.dialogOptions.okBtnHide = true;
        $scope.dialogOptions.cancelName = $translate.instant('label.confirm');

        $scope.dialogOptions.templateUrl = _VIEWS_ + "/user/popUserInfo.html" + _VersionTail();

    })

    .controller('updateUserPasswordPopCtrl', function ($scope, $location, $state, $stateParams, $translate, $mdDialog, common, userService, ValidationService, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("userControllers.js : updateUserPasswordPopCtrl");
        var pop = this;
        pop.vs	= new ValidationService({controllerAs: pop});
        pop.mode = $scope.dialogOptions.mode;
        pop.formName = $scope.dialogOptions.formName;
        pop.data = {};

        pop.data = angular.copy($scope.main.userInfo);
        $scope.dialogOptions.dialogClassName =  "modal-dialog";
        if (pop.mode == "first") {
            $scope.dialogOptions.title = $translate.instant('label.change_initial_password');
        } else {
            $scope.dialogOptions.title = $translate.instant('label.change_password');
        }
        $scope.dialogOptions.okName = $translate.instant('label.modified');
        $scope.dialogOptions.cancelName =  $translate.instant('label.cancel');

        $scope.dialogOptions.templateUrl = _VIEWS_ + "/user/popChangePassword.html" + _VersionTail();

        // Dialog ok 버튼 클릭 시 액션 정의
        pop.okAction = false;
        $scope.dialogOptions.popDialogOk = function () {
            if (pop.okAction) return;
            pop.okAction = true;
            if (!pop.vs.checkFormValidity(pop[pop.formName])) {
                pop.okAction = false;
                return;
            }
            if (pop.mode != "first") {
                if (pop.data.oldPassword == pop.data.newPassword) {
                    common.showAlertError($translate.instant('message.old_password_and_new_password_are_same'));
                    pop.okAction = false;
                    return;
                }
                var param = {
                    "oldPassword": pop.data.oldPassword,
                    "newPassword": pop.data.newPassword
                };
            } else {
                var param = {
                    "newPassword": pop.data.newPassword
                };
            }

            var rtnPromise = userService.updateUserPassword(param);
            rtnPromise.success(function (data, status, headers) {
                if (angular.isObject(data) && data.email) {
                    common.setUserInfo(data);
                }
                common.showAlertSuccess($translate.instant('message.it_is_changed'));
            });
            rtnPromise.error(function (data, status, headers) {
                common.showAlertError(data.message);
            });
            $mdDialog.hide();
        };

        $scope.dialogOptions.popCancel = function () {
            $mdDialog.cancel();
        };

        pop.checkNewPasswordValidation = function(oldPassword, newPassword) {
            if (oldPassword && newPassword && oldPassword == newPassword) {
                return {isValid: false, message: $translate.instant('message.old_password_and_new_password_are_same')};
            }
            var regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{9,20}$/;
            if(!regExp.test(newPassword)) {
                return {isValid: false, message: $translate.instant('message.passwords_must_characters')};
            }
            return {isValid: true};
        };

        pop.checkPasswordValidation = function(newPassword, confirmNewPassword) {
            if (newPassword !== confirmNewPassword) {
                return {isValid: false, message: $translate.instant('message.new_password_password_verification_not_same')};
            }
            return {isValid: true};
        };
    })

;
