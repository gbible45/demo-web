'use strict';

angular.module('common.controllers')
    .controller('sampleDashboardCtrl', function ($scope) {
        if (_MODE_ == "DEBUG") console.log("sampleControllers.js : sampleDashboardCtrl");

    })
    .controller('sampleChartsCtrl', function ($scope, $timeout, $translate) {
        if (_MODE_ == "DEBUG") console.log("sampleControllers.js : sampleChartsCtrl");
        var contents = this;

        contents.line = {};
        contents.line.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        contents.line.series = ['Series A', 'Series B'];
        contents.line.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        contents.line.onClick = function (points, evt) {
            console.log(points, evt);
        };
        contents.line.onHover = function (points) {
            if (points.length > 0) {
                console.log('Point', points[0].value);
            } else {
                console.log('No point');
            }
        };
        contents.line.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];

        contents.line.colors = [
            {
                backgroundColor: "rgba(159,204,0, 0.2)",
                pointBackgroundColor: "rgba(159,204,0, 1)",
                pointHoverBackgroundColor: "rgba(159,204,0, 0.8)",
                borderColor: "rgba(159,204,0, 1)",
                pointBorderColor: '#fff',
                pointHoverBorderColor: "rgba(159,204,0, 1)"
            },"rgba(250,109,33,0.5)","#9a9a9a","rgb(233,177,69)"
        ];

        contents.line.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                ]
            }
        };


        contents.bar = {};
        contents.bar.options = { legend: { display: true } };
        contents.bar.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        contents.bar.series = ['Series A', 'Series B'];
        contents.bar.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];


        contents.doughnut = {};
        contents.doughnut.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
        contents.doughnut.data = [0, 0, 0];

        $timeout(function () {
            contents.doughnut.data = [350, 450, 100];
        }, 500);


        contents.pie = {};
        contents.pie.labels = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
        contents.pie.data = [300, 500, 100];
        contents.pie.options = { legend: { display: false } };

    })
    .controller('samplePopCtrl', function ($scope, $translate, common) {
        if (_MODE_ == "DEBUG") console.log("sampleControllers.js : samplePopCtrl");
        var contents = this;

        contents.showAlertSuccess = function (message) {
            // 기본 3초 후 닫기
            common.showAlertSuccess(message);
        };

        contents.showAlertError = function (message) {
            // 기본 3초 후 닫기
            common.showAlertError(message);
        };

        contents.showAlertWarning = function (message) {
            // 2초 후 닫기
            common.showAlertWarning(2000, message);
        };

        contents.showAlertInfo = function (message) {
            // 5초 후 닫기
            common.showAlertInfo(5000, message);
        };

        contents.showDialogAlert = function (title, message) {
            common.showDialogAlert(title, message);
        };

        contents.showConfirm = function (title, message) {
            common.showConfirm(title, message).then(function () {
                common.showAlertInfo("확인 하였습니다.");
            });
        };

        contents.popCallBackFunction = function ($event) {
            common.showAlertInfo($translate.instant('message.registered'));
        };

        contents.popDialog = null;
        contents.showDialog = function ($event) {
            var dialogOptions = {
                controller : "samplePopFormCtrl",
                projectId : contents.sltProjectId,
                instance : contents.sltInstance,
                callBackFunction : contents.popCallBackFunction
            };
            contents.popDialog = common.showDialog($scope, $event, dialogOptions);
        };

        contents.rightDialog = null;
        contents.showSimpleDialog = function ($event) {
            var dialogOptions = {
                controller : "sampleSimplePopFormCtrl",
                callBackFunction : contents.popCallBackFunction
            };
            contents.rightDialog = common.showSimpleDialog($scope, $event, dialogOptions);
        };

        contents.popData = {};
        contents.showRightDialog = function () {
            var dialogOptions = {
                controller : "sampleRightPopFormCtrl",
                controllerAs : "rpop", // default pop
                callBackFunction : contents.moveNextPage
            };
            contents.rightDialog = common.showRightDialog($scope, dialogOptions);
        };

        contents.rightPopCallBackFunction = function ($event) {
            common.showAlertInfo($translate.instant('message.registered'));
        };

        contents.moveNextPage = function() {
            $scope.contents.popData = {name: "다음"};
            var dialogOptions = {
                controller : "sampleRightNextPopFormCtrl",
                controllerAs : "rpop", // default pop
                callBackFunction : contents.rightPopCallBackFunction
            };
            contents.rightDialog = common.showRightDialog($scope, dialogOptions);
        };

    })
    .controller('samplePopFormCtrl', function ($scope, $location, $state, $translate, $filter, $mdDialog, ValidationService) {
        if (_MODE_ == "DEBUG") console.log("sampleControllers.js : samplePopFormCtrl");

        var pop = this;
        $scope.dialogOptions.dialogClassName =  "modal-dialog";
        $scope.dialogOptions.title = $translate.instant("label.add");
        $scope.dialogOptions.okName =  $translate.instant("label.add");
        $scope.dialogOptions.cancelName =  $translate.instant("label.cancel");

        pop.sltProjectId = $scope.dialogOptions.sltProjectId;
        pop.sltInstance = angular.copy($scope.dialogOptions.sltInstance);

        $scope.dialogOptions.templateUrl = _VIEWS_ + "/sample/samplePopForm.html" + _VersionTail();

        // Dialog ok 버튼 클릭 시 액션 정의

        $scope.dialogOptions.popDialogOk = function () {
            if (angular.isFunction($scope.dialogOptions.callBackFunction)) {
                $scope.dialogOptions.callBackFunction();
            }
            $mdDialog.hide();
        };

        $scope.dialogOptions.popCancel = function () {
            $mdDialog.cancel();
        }

    })
    .controller('sampleSimplePopFormCtrl', function ($scope, $location, $state, $translate, $filter, $mdDialog, ValidationService) {
        if (_MODE_ == "DEBUG") console.log("sampleControllers.js : samplePopFormCtrl");

        var pop = this;
        $scope.dialogOptions.dialogClassName =  "modal-dialog";
        $scope.dialogOptions.title = "label.add";
        $scope.dialogOptions.okName =  "label.add";
        $scope.dialogOptions.cancelName =  "label.cancel";

        $scope.dialogOptions.templateUrl = _VIEWS_ + "/sample/samplePopForm.html" + _VersionTail();

        // Dialog ok 버튼 클릭 시 액션 정의
        $scope.dialogOptions.popDialogOk = function () {
            if (angular.isFunction($scope.dialogOptions.callBackFunction)) {
                $scope.dialogOptions.callBackFunction();
            }
            $mdDialog.hide();
        };

        $scope.dialogOptions.popCancel = function () {
            $mdDialog.cancel();
        }

    })
;
