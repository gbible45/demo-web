'use strict';

angular.module('common.controllers', [])
    .controller('mainCtrl', function ($scope, $location, $state, $translate, $templateCache, $window, $timeout, $interval, $cookies, $stateParams, cache, cookies, portalService, common, FileUploader, SITEMAP, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log('commonControllers.js : mainCtrl Start, path : ' + $location.path());

        var main = this;

        main.multLanguage = _MULT_LANGUAGE_;

        main.frameMainTemplateUrl = "";
        main.topLogoIcon = "images/top_logo.png";

        main.pageLoadCount = 0;

        // 기본 셋팅
        if (!common.getLanguageKey()) {
            common.setLanguageKey(_DEFAULT_LANGUAGE_);
        }

        main.sltLanguageKey = common.getLanguageKey();

        main.sltDataTimePickerOptions = CONSTANTS.dataTimePickerLanguages[common.getLanguageKey()];

        main.uploader = new FileUploader();

        main.loadingMain = true;
        main.loadingMainBody = false;
        $scope.main.loadingMainBody = true;

        //	mainContentsLayout Resize 이벤트 셋팅 여부
        main.contentsLayoutResizeEvent	= false;

        main.loadingProgressBar = CONSTANTS.loadingProgressBar;

        main.languages = [];

        main.sltLanguage = {};

        main.reloadTimmer = {};
        main.refreshInterval = {};

        main.mainBodyLoaded = false;
        main.isLoginPage = false;

        main.ansibleEdit = false;

        main.mainLoadTime = new Date().getTime();

        main.commMenuContentTempeUrl = _VIEWS_ + '/menu/commAllMenuContent.html' + _VERSION_TAIL_;

        main.mainLayoutClass = "one_page";

        main.leftOpenMap = {};

        // 로그 아웃
        main.logout = function () {
            portalService.logoutAction();
            $scope.main.userInfoLoad = false;
        };

        // 데모 페이지 이동
        main.goToSampleDemoPage = function (path) {
            main.goToPage('/sample/demo/'+ path);
        };

        // 페이지 이동
        main.goToPage = function (path) {
            common.locationPath(path);
        };

        // 페이지 이동 (state)
        main.goToState = function (stateKey) {
            common.goToState(stateKey);
        };

        // 이전 페이지로 이동
        main.goToHistoryBack = function () {
            $window.history.back();
        };

        main.reloadPage = function () {
            $state.reload();
        };

        main.showDialogAlert = function(title, subject){
            common.showDialogAlert(title, subject);
        };

        // 언어 선택에 따른 값 세팅
        main.setMainLanguage = function (languageKey) {
            main.languages = CONSTANTS.languages[languageKey];
            main.sltLanguage = common.objectsFindCopyByField(main.languages, "key", languageKey);
            main.sltDataTimePickerOptions = CONSTANTS.dataTimePickerLanguages[languageKey];
            main.admDtpCalTypeOptions = { gregorianDic : main.sltDataTimePickerOptions };
            main.bodyLayout = languageKey;
        };

        // 언어 변경 처리
        main.changeLanguage = function (languageKey) {
            // 언어 변경
            $translate.use(languageKey);
            // 언어 key 캐쉬 저장
            common.changeLanguageKey(languageKey);
            main.sltLanguageKey = languageKey;
            // 언어 값 셋팅
            main.setMainLanguage(languageKey);
        };

        // 로그 아웃 초기화
        main.resetInit = function () {

            // 로그인 여부
            main.isAuthenticated	= false;
            main.navigationTreeTitle	= "";

            main.leftMenuOn	= false;
            main.mainTopOn	= false;

            main.navigationTemplateUrl	= "";
            main.leftMenuTemplateUrl		= "";
            main.mainTopTemplateUrl		= "";

            main.leftMenuParams			= {};
            main.commLeftMenuParams       = null;
            main.selectSiteMap			= {};

            // 사용자 정보
            main.userInfo = {};

            main.moveParentUrl = "";

            main.mainLayoutClass = "one_page";

            $scope.main.mainBodyLoaded = false;
        };

        // 로그인 후 초기화
        main.loginSetingInit = function () {
            main.isAuthenticated	= true;
            // 사용자 정보
            main.userInfo = common.getUserInfo();
            main.userAuth = common.getUserAuth();
            main.mainLayoutClass = "main";
        };

        // file Uploader 초기화
        common.initFileUploader($scope, main.uploader);

        // 초기화
        main.replaceSeting = function () {
            common.replaceFileUploader(main.uploader);
        };

        main.navigationLinkHtml = "";

        // left 메뉴 객체 셋팅
        main.setSelectSiteMap = function (stateKey) {
            main.selectSiteMap = common.getStateKeyBySelectSietMap(stateKey);
            main.navigationLinkHtml = common.getNavigationLinkHtml(main.selectSiteMap);
        };

        // file 찾기 버튼 클릭 처리(공통)
        main.fileSelectBtnClick = function (evt) {
            var targetInput = $(evt.currentTarget.parentNode).find('input[type="file"]');
            targetInput.trigger("click");
        };

        main.toggleAccordion = function (accordionGroup, targetAccordion) {
            var accordionGroup = $('#' +accordionGroup);
            accordionGroup.find('.panel-collapse.collapse:not(#'+targetAccordion+')').collapse('hide');
            accordionGroup.find('#' + targetAccordion).collapse('toggle');
        };

        main.reloadTimmerStart = function (key, fun, time) {
            main.reloadTimmerStopByKey(key);
            $scope.main.reloadTimmer[key] = $timeout(fun, time);
        };

        main.reloadTimmerStop = function () {
            if (angular.isObject(main.reloadTimmer)) {
                angular.forEach(main.reloadTimmer, function (timmer, key) {
                    try {
                        if (timmer) {
                            $timeout.cancel(timmer);
                        }
                    } catch (e) {
                    } finally {
                        main.reloadTimmer[key] = null;
                    }
                });
            }
        };

        main.reloadTimmerStopByKey = function (key) {
            if (main.reloadTimmer[key]) {
                $timeout.cancel(main.reloadTimmer[key]);
                main.reloadTimmer[key] = null;
            }
        };

        main.refreshIntervalStart = function (key, fun, time) {
            main.refreshIntervalStopByKey(key);
            $timeout(function () {
                $scope.main.refreshInterval[key] = $interval(fun, time);
            }, 0);
        };
        main.refreshIntervalStop = function () {
            if (angular.isObject(main.refreshInterval)) {
                angular.forEach(main.refreshInterval, function (interval, key) {
                    try {
                        if (interval) {
                            $interval.cancel(interval);
                        }
                    } catch (e) {
                    } finally {
                        main.refreshInterval[key] = null;
                    }
                });
            }
        };

        main.refreshIntervalStopByKey = function (key) {
            if (main.refreshInterval[key]) {
                $interval.cancel(main.refreshInterval[key]);
                main.refreshInterval[key] = null;
            }
        };

        /** 샘플 메뉴 **/
        main.sidebarMenu = {};
        main.sidebarMenu.selectedMenu = 'sample-dashboard';
        main.sidebarMenu.collapseVar = 0;
        main.sidebarMenu.multiCollapseVar = 0;

        main.sidebarMenu.check = function(x){
            if(x==main.sidebarMenu.collapseVar)
                main.sidebarMenu.collapseVar = 0;
            else
                main.sidebarMenu.collapseVar = x;
        };
        main.sidebarMenu.multiCheck = function(y){
            if(y==main.sidebarMenu.multiCollapseVar)
                main.sidebarMenu.multiCollapseVar = 0;
            else
                main.sidebarMenu.multiCollapseVar = y;
        };
        /** 샘플 메뉴 **/

// select2 사용자 정의 옵션(html 사용)
        main.usSelectTwoOptions = {
            templateResult: function (state) {
                var option = $(state.element);
                var optionHtml = option.attr("option-html");
                if (!state.id || !optionHtml) {
                    return state.text;
                }
                if (optionHtml) {
                    optionHtml = optionHtml.replace(new RegExp("{value}", "gim"), state.id);
                    optionHtml = optionHtml.replace(new RegExp("{text}", "gim"), state.text);
                    return $(optionHtml);
                }
            },
            minimumResultsForSearch: Infinity
        };

        main.showRightSliderContents = function(evt, title, templateUrl, data, sliderWidth) {
            if (evt && evt.currentTarget) {
                $(evt.currentTarget).blur();
            }
            templateUrl = _VIEWS_ + templateUrl;
            common.showRightSliderContents($scope, title, templateUrl, data, {sliderWidth : sliderWidth});
        };

        main.targetScrollTop = function (id) {
            $('#' + id)[0].scrollTop = 0
        };

        main.copyToClipboard = function (clipboard, message) {
            common.copyToClipboard(clipboard);
            if (message) {
                common.showAlertInfo(message);
            }
        };

        main.mainBodyPageLoad = function (selectSiteMap, contentsTemplateUrl) {
            if (selectSiteMap && selectSiteMap.contentsView) {
                var contentsTemplateHtml = $templateCache.get(contentsTemplateUrl);
                main.mainTopOn = selectSiteMap.mainTop ? true : false;
                main.leftMenuOn = selectSiteMap.leftMenu ? true : false;
                if (!contentsTemplateHtml || _MODE_ == "DEBUG") {
                    contentsTemplateHtml = "";
                    var controllerHtml = "";
                    if (selectSiteMap.mainContentsClass) {
                        controllerHtml = ' ng-class="{' + selectSiteMap.mainContentsClass + ': true}"';
                    }
                    if (selectSiteMap.contentsView.controller) {
                        controllerHtml += ' ng-controller="' + selectSiteMap.contentsView.controller + ' as ' + selectSiteMap.contentsView.controllerAs + '"';
                    }
                    if ((selectSiteMap.key == "demo") && $stateParams.demoPage) {
                        selectSiteMap.contentsView.templateUrl = "/demo/" + $stateParams.demoPage + ".html";
                    }
                    if (selectSiteMap.contentsView.templateUrl) {
                        common.getTemplateHtml(selectSiteMap.contentsView.templateUrl + _VersionTail(), function (templateHtml) {
                            contentsTemplateHtml += '<div class="content" id="mainContents"' + controllerHtml + '>\n' + templateHtml + '\n</div>';
                            $templateCache.put(contentsTemplateUrl, contentsTemplateHtml);
                            main.mainContentsTemplateUrl = contentsTemplateUrl;
                        }, function (res) {
                            contentsTemplateHtml += '<div class="content" id="mainContents"' + controllerHtml + '>\nNot Found: ' + selectSiteMap.contentsView.templateUrl + '\n</div>';
                            $templateCache.put(contentsTemplateUrl, contentsTemplateHtml);
                            main.mainContentsTemplateUrl = contentsTemplateUrl;
                        });
                    } else {
                        contentsTemplateHtml += '<div class="content" id="mainContents"' + controllerHtml + '> Not templateUrl </div>';
                        $templateCache.put(contentsTemplateUrl, contentsTemplateHtml);
                        main.mainContentsTemplateUrl = contentsTemplateUrl;
                    }
                } else {
                    main.mainContentsTemplateUrl = contentsTemplateUrl;
                }
            } else {
                main.mainContentsTemplateUrl = contentsTemplateUrl;
            }
        };

        main.mainBodyPageTimeoutLoad = function (selectSiteMap, contentsTemplateUrl) {
            $timeout(function () {
                main.mainBodyPageLoad(selectSiteMap, contentsTemplateUrl);
            }, 0);
        };

        main.loadingFrameSet = function () {
            if (main.mainLayoutFile != CONSTANTS.layoutTemplateUrl.noAccessLayout) {
                main.mainContentsTemplateUrl = "";
                main.frameMainTemplateUrl = CONSTANTS.layoutTemplateUrl.noAccessLayout + _VERSION_TAIL_;
                main.mainLayoutFile = CONSTANTS.layoutTemplateUrl.noAccessLayout;
            }
            main.mainBodyPageTimeoutLoad(SITEMAP.pages.loading, "mainLoadingTemplate");
        };

        main.pageViewAuthCheck = function() {
            if (main.selectSiteMap.pageViewAuth == "goodAdmin") {
                return main.userInfo.goodAdmin;
            } else if (main.selectSiteMap.pageViewAuth == "goodDeveloper") {
                return main.userInfo.goodDeveloper;
            } else if (main.selectSiteMap.pageViewAuth == "goodAuditor") {
                return main.userInfo.goodAuditor;
            } else if (main.selectSiteMap.pageViewAuth == "goodMonitor") {
                return main.userInfo.goodMonitor;
            }
            return true;
        };

        main.accessFrameSet = function () {
            if (main.selectSiteMap.frameMainTemplateUrl) {
                if (main.mainLayoutFile != main.selectSiteMap.frameMainTemplateUrl) {
                    main.mainContentsTemplateUrl = "";
                    main.frameMainTemplateUrl = main.selectSiteMap.frameMainTemplateUrl + _VERSION_TAIL_;
                    main.mainLayoutFile = main.selectSiteMap.frameMainTemplateUrl;
                }
            } else {
                if (main.mainLayoutFile != CONSTANTS.layoutTemplateUrl.accessLayout) {
                    main.mainContentsTemplateUrl = "";
                    main.frameMainTemplateUrl = CONSTANTS.layoutTemplateUrl.accessLayout + _VERSION_TAIL_;
                    main.mainLayoutFile = CONSTANTS.layoutTemplateUrl.accessLayout;
                }
            }

            if (main.selectSiteMap.navigationTemplateUrl) {
                if (main.navigationFile != main.selectSiteMap.navigationTemplateUrl) {
                    main.navigationTemplateUrl = main.selectSiteMap.navigationTemplateUrl + _VERSION_TAIL_;
                    main.navigationFile = main.selectSiteMap.navigationTemplateUrl;
                }
            } else {
                if (main.navigationFile != CONSTANTS.layoutTemplateUrl.navigation) {
                    main.navigationTemplateUrl = CONSTANTS.layoutTemplateUrl.navigation + _VERSION_TAIL_;
                    main.navigationFile = CONSTANTS.layoutTemplateUrl.navigation;
                }
            }

            if (main.selectSiteMap.mainTopTemplateUrl) {
                if (main.mainTopFile != main.selectSiteMap.mainTopTemplateUrl) {
                    main.mainTopTemplateUrl = main.selectSiteMap.mainTopTemplateUrl + _VERSION_TAIL_;
                    main.mainTopFile = main.selectSiteMap.mainTopTemplateUrl;
                }
            } else {
                if (main.mainTopFile != CONSTANTS.layoutTemplateUrl.mainTop) {
                    main.mainTopTemplateUrl = CONSTANTS.layoutTemplateUrl.mainTop + _VERSION_TAIL_;
                    main.mainTopFile = CONSTANTS.layoutTemplateUrl.mainTop;
                }
            }

            if (main.selectSiteMap.leftMenu) {
                if (main.selectSiteMap.leftMenuTemplateUrl) {
                    if (main.leftMenuFile != main.selectSiteMap.leftMenuTemplateUrl) {
                        main.leftMenuTemplateUrl = main.selectSiteMap.leftMenuTemplateUrl + _VERSION_TAIL_;
                        main.leftMenuFile = main.selectSiteMap.leftMenuTemplateUrl;
                    }
                } else {
                    if (main.leftMenuFile != CONSTANTS.layoutTemplateUrl.leftMenu) {
                        main.leftMenuTemplateUrl = CONSTANTS.layoutTemplateUrl.leftMenu + _VERSION_TAIL_;
                        main.leftMenuFile = CONSTANTS.layoutTemplateUrl.leftMenu;
                    }
                }
            }

            if (common.isLoginNoAcceptPage($location.path())) {
                $timeout(function () {
                    common.moveHomePage();
                }, 0);
            } else {
                // 페이지 뷰 권한 체크
                if (!main.pageViewAuthCheck()) {
                    $timeout(function () {
                        common.moveHomePage();
                    }, 0);
                } else {
                    if ($location.path().indexOf("/sample") > -1 || $location.path().indexOf("/demo") > -1 ) {
                        main.mainBodyPageTimeoutLoad(main.selectSiteMap, "mainContentsTemplate_" + main.selectSiteMap.stateKey + "_" + $stateParams.demoPage);
                    } else {
                        main.mainBodyPageTimeoutLoad(main.selectSiteMap, "mainContentsTemplate_" + main.selectSiteMap.stateKey);
                    }
                }
            }
        };

        main.noAccessFrameSet = function (type) {
            if ($location.path().indexOf("/sample") > -1 || $location.path().indexOf("/demo") > -1 ) {
                main.accessFrameSet(type);
                return;
            }
            if (main.mainLayoutFile != CONSTANTS.layoutTemplateUrl.noAccessLayout) {
                main.mainContentsTemplateUrl = "";
                main.frameMainTemplateUrl = CONSTANTS.layoutTemplateUrl.noAccessLayout + _VERSION_TAIL_;
                main.mainLayoutFile = CONSTANTS.layoutTemplateUrl.noAccessLayout;
            }
            main.navigationTemplateUrl = "";
            main.navigationFile = "";
            main.mainTopTemplateUrl = "";
            main.mainTopFile = "";
            main.leftMenuTemplateUrl = "";
            main.leftMenuFile = "";
            if (type == "server_err") {
                main.mainBodyPageTimeoutLoad(SITEMAP.pages.serverErr, "mainServerErrTemplate");
            } else {
                if (common.isNotLoginAcceptPage($location.path())) {
                    main.mainBodyPageTimeoutLoad(main.selectSiteMap, "mainLoginTemplate");
                } else {
                    main.mainBodyPageTimeoutLoad(SITEMAP.pages.login, "mainLoginTemplate");
                }
            }
        };

        main.accessCheckError = function (data, status) {
            if (status == -1) {
                main.noAccessFrameSet("server_err");
            } else {
                main.noAccessFrameSet();
                common.clearUser();
            }
        };

        main.setAccessInfo = function () {
            var promise = portalService.accessInfo();
            promise.success(function (data, status, response) {
                if (status == 200 && angular.isObject(data) && data.email) {
                    common.setUserInfo(data);
                    if (data.changePasswordYn == 'N') {
                        main.updateUserPassword(null, 'first');
                    }
                    /*
                    common.stompConnect();
                    common.stompSubscribe('/process/1', function (body) {
                        console.log("message: " + body.message)
                    });
                    */
                    main.accessFrameSet();
                } else {
                    common.clearUser();
                    main.noAccessFrameSet();
                }
                main.userInfoLoad = true;
            });
            promise.error(function (data, status, response) {
                main.accessCheckError(data, status);
                main.userInfoLoad = true;
            });
        };

        main.accessCheck = function () {
            var promise = portalService.accessCheck(main.userInfo.email);
            promise.success(function (data, status, response) {
                if (status == 200 && angular.isObject(data) && data.email) {
                    var userInfo = common.getUserInfo();
                    userInfo.roles = data.roles;
                    common.setUserInfo(userInfo);
                    if (data.changePasswordYn == 'N') {
                        main.updateUserPassword(null, 'first');
                    }
                    main.accessFrameSet();
                } else {
                    common.clearUser();
                    main.noAccessFrameSet();
                }
            });
            promise.error(function (data, status, response) {
                main.accessCheckError(data, status);
                main.userInfoLoad = false;
            });
        };

        main.apiServerUrlToAccessChecking = function() {
            var promise = portalService.getServerHostUrl();
            promise.success(function (data, status, response) {
                main.refreshIntervalStopByKey('serverErrCheckInterval');
                if (data && data.apiServerUrl) {
                    if (data.apiServerUrl.indexOf("http") == -1) {
                        common.apiServerUrl = "http://" + _DOMAIN_ + ":" + data.apiServerUrl;
                    } else {
                        common.apiServerUrl = data.apiServerUrl;
                    }
                }
                main.userInfoLoadChecking();
            });
            promise.error(function (data, status, response) {
                main.accessCheckError(data, status);
            });
        };

        main.checkAnsibleEdit = function () {
            var ansibleEdit = common.getAnsibleEdit();
            if (ansibleEdit == "Y") {
                main.ansibleEdit = true;
            } else {
                main.ansibleEdit = false;
            }
        };

        main.changeAnsibleEdit = function () {
            var ansibleEdit = common.getAnsibleEdit();
            if (ansibleEdit == "Y") {
                common.clearAnsibleEdit();
                main.ansibleEdit = false;
            } else {
                common.setAnsibleEdit("Y");
                main.ansibleEdit = true;
            }
        };

        main.userInfoLoadChecking = function() {
            if (!main.userInfoLoad) {
                main.setAccessInfo();
            } else {
                //main.accessCheck();
                main.accessFrameSet();
            }
        };

        main.showUserInfo = function($event) {
            $scope.dialogOptions = {
                controller : 'userInfoPopCtrl',
                formName : 'userInfoPopForm',
                okBtnHide : true
            };
            common.showDialog($scope, $event, $scope.dialogOptions);
        };

        main.updateUserPassword = function($event, mode) {
            $scope.dialogOptions = {
                controller : 'updateUserPasswordPopCtrl',
                formName : 'updateUserPasswordPopForm',
                mode : mode
            };
            common.showDialog($scope, $event, $scope.dialogOptions);
        };

        main.setBroadcastDashboardMonintConfigData = function (data) {
            $scope.$broadcast('setBroadcastDashboardMonintConfigData', data);
        };

        main.openDashboardConfig = function($event) {
            $scope.dialogOptions = {
                controller: 'dashboardMinitConfigPopCtrl',
                formName: "dashboardMinitConfigForm",
                collbackFunction: main.setBroadcastDashboardMonintConfigData,
            };
            common.showDialog($scope, $event, $scope.dialogOptions);
        };

        main.resetInit();
        main.changeLanguage(common.getLanguageKey());
        main.checkAnsibleEdit();
        main.displayHistoryBtn = false;
        main.displayParentBtn = false;

        main.userInfoLoad = false;

        main.loadingFrameSet();

        main.showDataCatalogDepth2 = false;

        main.showLeftProjectMenu = function($event) {
            var target = $($event.currentTarget);
            var parentTarget = target.closest('div.gnb-in');

            if (target.hasClass("open")) {
                parentTarget.find('ul.dept2').hide(200);
                parentTarget.find('a.dept1').removeClass("open on");

            } else {
                parentTarget.find('ul.dept2').hide(200);
                parentTarget.find('a.dept1').removeClass("open on");

                target.addClass("open on");
                $(target).closest("li.dept1").find("ul.dept2").toggle(200);
            }
        };

        main.showLeftMenu = function($event) {
            /*var mainCtrlScope = angular.element(document.getElementById('mainCtrl')).scope();

            //작업 공간 선택 여부 확인
            if(!mainCtrlScope.main.sltPortalOrgId){
                mainCtrlScope.main.showDialogAlert('알림','작업 공간을 선택해주세요.');
                return false;
            }*/

            var target = $($event.currentTarget);

            var parentTarget = target.closest('div.gnbMenu');

            if (target.hasClass("open")) {
                target.closest('li.dept1').find('ul.dept2').hide(200);
                target.removeClass("open on");

                main.showDataCatalogDepth2 = false;

            } else {
                parentTarget.find('ul.dept2').hide(200);
                parentTarget.find('a.dept1').removeClass("open on");

                target.addClass("open on");
                $(target).closest("li.dept1").find("ul.dept2").toggle(200);

                main.showDataCatalogDepth2 = true;
            }
        };

        main.mouseoverLeftMenuDepth2 = function($event,depth) {
            var target = $($event.currentTarget);

            if(target.hasClass("open")){
                $("#leftMenu").find('ul.dept3').hide();
                $(target).parent().find("ul.dept3").show();
            }else{
                $("#leftMenu").find('a.dept2').removeClass("open on");
                $("#leftMenu").find('ul.dept3').hide();
                $(target).parent().find("ul.dept3").show();

                if(depth != 'no'){
                    target.addClass("open on");
                }
            }
        };

        if (_MODE_ == "DEBUG") console.log('commonControllers.js : mainCtrl End, path : ' + $location.path());
    })
    .controller('mainBodyCtrl', function ($scope, $location, $templateCache, $state, $stateParams, $timeout, $window, $translate, $ocLazyLoad, portalService, common, CONSTANTS) {
        if (_MODE_ == "DEBUG") console.log("commonControllers.js : mainBodyCtrl Start, path : " + $location.path());

        var mainBody = this;

        // timmer 중지
        $scope.main.reloadTimmerStop();

        // interval 중지
        $scope.main.refreshIntervalStop();

        $scope.main.stateKey = $state.current.name;
        $scope.main.stateParams = $stateParams;

        $scope.main.loadingMain = false;
        $scope.main.loadingMainBody = false;

        $scope.main.pageLoadCount++;

        $scope.main.mainLayoutClass = "main";

        $scope.main.pageStage = $scope.$resolve.pageStage ? $scope.$resolve.pageStage : "comm";

        if (_MODE_ == "DEBUG") console.log("pageStage :", $scope.main.pageStage);

        $scope.main.replaceSeting();

        $scope.main.displayHistoryBtn = false;

        $scope.main.setSelectSiteMap($state.current.name);

        if ($scope.main.selectSiteMap && $scope.main.selectSiteMap.parentSiteMap) {
            if ($scope.main.selectSiteMap.parentSiteMap.defaultUrl) {
                $scope.main.moveParentPath = $scope.main.selectSiteMap.parentSiteMap.defaultUrl;
                $scope.main.displayParentBtn = true;
            } else if ($scope.main.selectSiteMap.parentSiteMap.parentSiteMap && $scope.main.selectSiteMap.parentSiteMap.parentSiteMap.defaultUrl) {
                $scope.main.moveParentPath = $scope.main.selectSiteMap.parentSiteMap.parentSiteMap.defaultUrl;
                $scope.main.displayParentBtn = true;
            } else {
                $scope.main.moveParentPath = "";
                $scope.main.displayParentBtn = false;
            }
        } else {
            $scope.main.moveParentPath = "";
            $scope.main.displayParentBtn = false;
        }

        // 페이지 두번 호출를 막기 위한 초기화 처리
        $scope.main.mainContentsTemplateUrl = "";

        if (!common.apiServerUrl) {
            $scope.main.apiServerUrlToAccessChecking();
        } else {
            $scope.main.userInfoLoadChecking();
        }
        /*
        if (!$scope.main.contentsLayoutResizeEvent) {
            $scope.main.contentsLayoutResizeEvent	= true;
        }
        */

        // csrf token 을 받기 위한 ping
        common.apiPing();

        if (_MODE_ == "DEBUG") console.log("commonControllers.js : mainBodyCtrl End, path : " + $location.path());
    })
;
