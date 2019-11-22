'use strict';

angular.module('common.services', ['LocalStorageModule'])
    .factory('common', function ($http, $location, $route, $state, $window, $timeout, $q, $templateCache, $translate, cache, cookies, CONSTANTS, SITEMAP, $mdDialog, growl) {
        if (_MODE_ == "DEBUG") console.log("common.services common");

        var common = {};

        // contentsMenus setting
        common.contentsMenus		= {};
        common.siteMapList		= [];
        common.selectSiteMap	= null;
        var siteMapidx		= 0;
        angular.forEach(SITEMAP.pages, function (option, key) {
            common.siteMapList[siteMapidx++]	= {
                level : 0,
                key : key,
                pageViewAuth : option.pageViewAuth,
                pageEditAuth : option.pageEditAuth,
                rootName : option.name,
                topName : option.name,
                name : option.name,
                orgNameView : option.orgNameView,
                categoryView : option.categoryView,
                menuNoLink : option.menuNoLink,
                regionChang : option.regionChang,
                stateKey : option.stateKey ? option.stateKey : key,
                url : option.url,
                defaultUrl : option.defaultUrl ? option.defaultUrl : option.url,
                mainTop : option.mainTop,
                leftMenu : option.leftMenu,
                title : option.title,
                pageStage : option.pageStage ? option.pageStage : "comm",
                mainContentsClass : option.mainContentsClass,
                frameMainTemplateUrl : option.frameMainTemplateUrl ? option.frameMainTemplateUrl : null,
                mainBodyTemplateUrl : option.mainBodyTemplateUrl ? option.mainBodyTemplateUrl : null,
                navigationTemplateUrl : option.navigationTemplateUrl ? option.navigationTemplateUrl : null,
                mainTopTemplateUrl : option.mainTopTemplateUrl ? option.mainTopTemplateUrl : null,
                leftMenuTemplateUrl : option.leftMenuTemplateUrl ? option.leftMenuTemplateUrl : null,
                contentsView : option.contentsView
            };
        });

        angular.forEach(SITEMAP.contentsMenus, function (mainOption, mainKey) {
            common.contentsMenus[mainKey]	= [];
            var cidx	= 0;
            mainOption.level = 0;
            angular.forEach(mainOption.menus, function (option, key) {
                if (_DOMAIN_ != "localhost" && key == "sample") return;
                option.mainTop	= angular.isUndefined(option.mainTop) ? mainOption.mainTop : option.mainTop;
                option.leftMenu	= angular.isUndefined(option.leftMenu) ? mainOption.leftMenu : option.leftMenu;
                option.orgType	= angular.isUndefined(option.orgType) ? mainOption.orgType : option.orgType;
                option.orgNameView	= angular.isUndefined(option.orgNameView) ? mainOption.orgNameView : option.orgNameView;
                option.categoryView	= angular.isUndefined(option.categoryView) ? mainOption.categoryView : option.categoryView;
                option.pageStage	= angular.isUndefined(option.pageStage) ? mainOption.pageStage : option.pageStage;

                var pageViewAuth	= (mainOption.pageViewAuth) ? mainOption.pageViewAuth : "";
                var pageEditAuth	= (mainOption.pageEditAuth) ? mainOption.pageEditAuth : "";

                pageViewAuth	+= (option.pageViewAuth) ? option.pageViewAuth : "";
                pageEditAuth	+= (option.pageEditAuth) ? option.pageEditAuth : "";

                var topSiteMap = {
                    level : 1,
                    mainKey : mainKey,
                    parentSiteMap: mainOption,
                    middleMenu : true,
                    key : key,
                    orgType : option.orgType,
                    pageViewAuth : pageViewAuth,
                    pageEditAuth : pageEditAuth,
                    rootName : mainOption.name,
                    topName : option.name,
                    name : option.name,
                    orgNameView : option.orgNameView,
                    categoryView : option.categoryView,
                    menuDisplayNo : option.menuDisplayNo,
                    icon : option.icon,
                    menuNoLink : option.menuNoLink,
                    regionChang : option.regionChang,
                    stateKey : option.stateKey ? option.stateKey : key,
                    url : option.url,
                    defaultUrl : option.defaultUrl ? option.defaultUrl : option.url,
                    path : option.path,
                    target : option.target,
                    link : option.link,
                    mainTop : option.mainTop,
                    leftMenu : option.leftMenu,
                    title : option.title,
                    pageStage : option.pageStage,
                    contentsView : option.contentsView,
                    mainContentsClass : option.mainContentsClass,
                    frameMainTemplateUrl : option.frameMainTemplateUrl ? option.frameMainTemplateUrl : mainOption.frameMainTemplateUrl,
                    mainBodyTemplateUrl : option.mainBodyTemplateUrl ? option.mainBodyTemplateUrl : mainOption.mainBodyTemplateUrl,
                    navigationTemplateUrl : option.navigationTemplateUrl ? option.navigationTemplateUrl : mainOption.navigationTemplateUrl,
                    mainTopTemplateUrl : option.mainTopTemplateUrl ? option.mainTopTemplateUrl : mainOption.mainTopTemplateUrl,
                    leftMenuTemplateUrl : option.leftMenuTemplateUrl ? option.leftMenuTemplateUrl : mainOption.leftMenuTemplateUrl,
                    ngClick : option.ngClick
                };

                common.contentsMenus[mainKey][cidx++]	= topSiteMap;
                common.siteMapList[siteMapidx++]	= topSiteMap;

                angular.forEach(option.subMenus, function (subMenuOption, subMenuKey) {
                    subMenuOption.mainTop	= angular.isUndefined(subMenuOption.mainTop) ? mainOption.mainTop : subMenuOption.mainTop;
                    subMenuOption.leftMenu	= angular.isUndefined(subMenuOption.leftMenu) ? mainOption.leftMenu : subMenuOption.leftMenu;
                    subMenuOption.orgType	= angular.isUndefined(subMenuOption.orgType) ? option.orgType : subMenuOption.orgType;
                    subMenuOption.orgNameView	= angular.isUndefined(subMenuOption.orgNameView) ? option.orgNameView : subMenuOption.orgNameView;
                    subMenuOption.categoryView	= angular.isUndefined(subMenuOption.categoryView) ? option.categoryView : subMenuOption.categoryView;
                    subMenuOption.pageStage	= angular.isUndefined(subMenuOption.pageStage) ? option.pageStage : subMenuOption.pageStage;
                    subMenuOption.menuDisplayNo	= (option.menuDisplayNo == true) ? option.menuDisplayNo : subMenuOption.menuDisplayNo;

                    var subMenuPageViewAuth		= pageViewAuth;
                    var subMenuPageEditAuth	= pageEditAuth;

                    subMenuPageViewAuth		+= (subMenuOption.pageViewAuth) ? subMenuOption.pageViewAuth : "";
                    subMenuPageEditAuth	+= (subMenuOption.pageEditAuth) ? subMenuOption.pageEditAuth : "";

                    var subMenuSiteMap = {
                        level : 2,
                        mainKey : mainKey,
                        parentSiteMap: topSiteMap,
                        subMenu : true,
                        key : subMenuKey,
                        menuKey : key,
                        orgType: subMenuOption.orgType,
                        pageViewAuth : subMenuPageViewAuth,
                        pageEditAuth : subMenuPageEditAuth,
                        rootName : mainOption.name,
                        topName : option.name,
                        name : subMenuOption.name,
                        orgNameView : subMenuOption.orgNameView,
                        categoryView : subMenuOption.categoryView,
                        menuDisplayNo : subMenuOption.menuDisplayNo,
                        mainTop : subMenuOption.mainTop,
                        leftMenu : subMenuOption.leftMenu,
                        menuNoLink : subMenuOption.menuNoLink,
                        regionChang : subMenuOption.regionChang,
                        stateKey : subMenuOption.stateKey ? subMenuOption.stateKey : subMenuKey,
                        url : subMenuOption.url,
                        defaultUrl : subMenuOption.defaultUrl ? subMenuOption.defaultUrl : subMenuOption.url,
                        target : subMenuOption.target,
                        path : subMenuOption.path,
                        link : subMenuOption.link,
                        title : subMenuOption.title,
                        pageStage : subMenuOption.pageStage,
                        contentsView : subMenuOption.contentsView,
                        mainContentsClass : subMenuOption.mainContentsClass,
                        frameMainTemplateUrl : subMenuOption.frameMainTemplateUrl ? subMenuOption.frameMainTemplateUrl : option.frameMainTemplateUrl,
                        mainBodyTemplateUrl : subMenuOption.mainBodyTemplateUrl ? subMenuOption.mainBodyTemplateUrl : option.mainBodyTemplateUrl,
                        navigationTemplateUrl : subMenuOption.navigationTemplateUrl ? subMenuOption.navigationTemplateUrl : option.navigationTemplateUrl,
                        mainTopTemplateUrl : subMenuOption.mainTopTemplateUrl ? subMenuOption.mainTopTemplateUrl : option.mainTopTemplateUrl,
                        leftMenuTemplateUrl : subMenuOption.leftMenuTemplateUrl ? subMenuOption.leftMenuTemplateUrl : option.leftMenuTemplateUrl,
                        ngClick : subMenuOption.ngClick,
                    };

                    common.contentsMenus[mainKey][cidx++]	= subMenuSiteMap;
                    common.siteMapList[siteMapidx++] = subMenuSiteMap;

                    angular.forEach(subMenuOption.subPages, function (subPageOption, subPageKey) {
                        subPageOption.mainTop	= angular.isUndefined(subPageOption.mainTop) ? subMenuOption.mainTop : subPageOption.mainTop;
                        subPageOption.leftMenu	= angular.isUndefined(subPageOption.leftMenu) ? subMenuOption.leftMenu : subPageOption.leftMenu;
                        subPageOption.orgType	= angular.isUndefined(subPageOption.orgType) ? subMenuOption.orgType : subPageOption.orgType;
                        subPageOption.orgNameView	= angular.isUndefined(subPageOption.orgNameView) ? subMenuOption.orgNameView : subPageOption.orgNameView;
                        subPageOption.categoryView	= angular.isUndefined(subPageOption.categoryView) ? subMenuOption.categoryView : subPageOption.categoryView;
                        subPageOption.pageStage	= angular.isUndefined(subPageOption.pageStage) ? subMenuOption.pageStage : subPageOption.pageStage;

                        var subPagePageViewAuth		= pageViewAuth;
                        var subPagePageEditAuth	= pageEditAuth;

                        subPagePageViewAuth		+= (subPageOption.pageViewAuth) ? subPageOption.pageViewAuth : "";
                        subPagePageEditAuth	+= (subPageOption.pageEditAuth) ? subPageOption.pageEditAuth : "";

                        common.siteMapList[siteMapidx++] = {
                            level : 3,
                            mainKey : mainKey,
                            parentSiteMap: subMenuSiteMap,
                            subPage : true,
                            key : subPageKey,
                            menuKey : key,
                            subMenuKey : subMenuKey,
                            orgType: subPageOption.orgType,
                            pageViewAuth : subPagePageViewAuth,
                            pageEditAuth : subPagePageEditAuth,
                            rootName : mainOption.name,
                            topName : option.name,
                            name : subPageOption.name,
                            orgNameView : subPageOption.orgNameView,
                            categoryView : subPageOption.categoryView,
                            menuDisplayNo : subPageOption.menuDisplayNo,
                            mainTop : subPageOption.mainTop,
                            leftMenu : subPageOption.leftMenu,
                            menuNoLink : subPageOption.menuNoLink,
                            regionChang : subPageOption.regionChang,
                            stateKey : subPageOption.stateKey ? subPageOption.stateKey : subPageKey,
                            url : subPageOption.url,
                            defaultUrl : subPageOption.defaultUrl ? subPageOption.defaultUrl : subPageOption.url,
                            title : subPageOption.title,
                            pageStage : subPageOption.pageStage,
                            contentsView : subPageOption.contentsView,
                            mainContentsClass : subPageOption.mainContentsClass,
                            frameMainTemplateUrl : subPageOption.frameMainTemplateUrl ? subPageOption.frameMainTemplateUrl : subMenuOption.frameMainTemplateUrl,
                            mainBodyTemplateUrl : subPageOption.mainBodyTemplateUrl ? subPageOption.mainBodyTemplateUrl : subMenuOption.mainBodyTemplateUrl,
                            navigationTemplateUrl : subPageOption.navigationTemplateUrl ? subPageOption.navigationTemplateUrl : subMenuOption.navigationTemplateUrl,
                            mainTopTemplateUrl : subPageOption.mainTopTemplateUrl ? subPageOption.mainTopTemplateUrl : subMenuOption.mainTopTemplateUrl,
                            leftMenuTemplateUrl : subPageOption.leftMenuTemplateUrl ? subPageOption.leftMenuTemplateUrl : subMenuOption.leftMenuTemplateUrl,
                            ngClick : subPageOption.ngClick,
                        };
                    });
                });
                angular.forEach(option.subPages, function (subPageOption, subPageKey) {
                    subPageOption.mainTop	= angular.isUndefined(subPageOption.mainTop) ? option.mainTop : subPageOption.mainTop;
                    subPageOption.leftMenu	= angular.isUndefined(subPageOption.leftMenu) ? option.leftMenu : subPageOption.leftMenu;
                    subPageOption.orgType	= angular.isUndefined(subPageOption.orgType) ? option.orgType : subPageOption.orgType;
                    subPageOption.orgNameView	= angular.isUndefined(subPageOption.orgNameView) ? option.orgNameView : subPageOption.orgNameView;
                    subPageOption.categoryView	= angular.isUndefined(subPageOption.categoryView) ? option.categoryView : subPageOption.categoryView;
                    subPageOption.pageStage	= angular.isUndefined(subPageOption.pageStage) ? option.pageStage : subPageOption.pageStage;

                    var subPagePageViewAuth		= pageViewAuth;
                    var subPagePageEditAuth	= pageEditAuth;

                    subPagePageViewAuth		+= (subPageOption.pageViewAuth) ? subPageOption.pageViewAuth : "";
                    subPagePageEditAuth	+= (subPageOption.pageEditAuth) ? subPageOption.pageEditAuth : "";

                    common.siteMapList[siteMapidx++] = {
                        level : 2,
                        mainKey : mainKey,
                        parentSiteMap: topSiteMap,
                        subPage : true,
                        key : subPageKey,
                        menuKey : key,
                        orgType: subPageOption.orgType,
                        pageViewAuth : subPagePageViewAuth,
                        pageEditAuth : subPagePageEditAuth,
                        rootName : mainOption.name,
                        topName : option.name,
                        name : subPageOption.name,
                        orgNameView : subPageOption.orgNameView,
                        categoryView : subPageOption.categoryView,
                        menuDisplayNo : subPageOption.menuDisplayNo,
                        mainTop : subPageOption.mainTop,
                        leftMenu : subPageOption.leftMenu,
                        menuNoLink : subPageOption.menuNoLink,
                        regionChang : subPageOption.regionChang,
                        stateKey : subPageOption.stateKey ? subPageOption.stateKey : subPageKey,
                        url : subPageOption.url,
                        defaultUrl : subPageOption.defaultUrl ? subPageOption.defaultUrl : subPageOption.url,
                        title : subPageOption.title,
                        pageStage : subPageOption.pageStage,
                        contentsView : subPageOption.contentsView,
                        mainContentsClass : subPageOption.mainContentsClass,
                        frameMainTemplateUrl : subPageOption.frameMainTemplateUrl ? subPageOption.frameMainTemplateUrl : option.frameMainTemplateUrl,
                        mainBodyTemplateUrl : subPageOption.mainBodyTemplateUrl ? subPageOption.mainBodyTemplateUrl : option.mainBodyTemplateUrl,
                        navigationTemplateUrl : subPageOption.navigationTemplateUrl ? subPageOption.navigationTemplateUrl : option.navigationTemplateUrl,
                        mainTopTemplateUrl : subPageOption.mainTopTemplateUrl ? subPageOption.mainTopTemplateUrl : option.mainTopTemplateUrl,
                        leftMenuTemplateUrl : subPageOption.leftMenuTemplateUrl ? subPageOption.leftMenuTemplateUrl : option.leftMenuTemplateUrl,
                        ngClick : subPageOption.ngClick,
                    };
                });
            });
        });

        // StateName으로 siteMap 가져오기
        common.getStateKeyBySelectSietMap = function (stateKey) {
            for (var i=0; i<common.siteMapList.length; i++) {
                if (common.siteMapList[i].stateKey == stateKey) {
                    return common.siteMapList[i];
                }
            }
            return null;
        };

        common.getNavigationLinkHtml = function (sltSitMap) {
            if (sltSitMap && sltSitMap.mainTop && sltSitMap.stateKey != "dashboard") {
                var navigationLinkHtml = '<li ui-sref="dashboard"><a href="">Home</a></li>';
                if (sltSitMap.parentSiteMap && sltSitMap.parentSiteMap.name) {
                    if (sltSitMap.parentSiteMap.parentSiteMap && sltSitMap.parentSiteMap.parentSiteMap.name) {
                        if (sltSitMap.parentSiteMap.stateKey) {
                            navigationLinkHtml += '\n<li ui-sref="' + sltSitMap.parentSiteMap.parentSiteMap.stateKey + '"><a href="">{{\'menu.' + sltSitMap.parentSiteMap.parentSiteMap.name + '\' | translate }}</a></li>';
                        } else {
                            navigationLinkHtml += '\n<li>{{\'menu.' + sltSitMap.parentSiteMap.parentSiteMap.name + '\' | translate }}</li>';
                        }
                    }
                    if (sltSitMap.parentSiteMap.stateKey) {
                        navigationLinkHtml += '\n<li ui-sref="' + sltSitMap.parentSiteMap.stateKey + '"><a href="">{{\'menu.' + sltSitMap.parentSiteMap.name + '\' | translate }}</a></li>';
                    } else {
                        navigationLinkHtml += '\n<li>{{\'menu.' + sltSitMap.parentSiteMap.name + '\' | translate }}</li>';
                    }
                }
                navigationLinkHtml += '\n<li class="active">{{\'menu.' + sltSitMap.name + '\' | translate }}</li>';
                return navigationLinkHtml;
            } else {
                return '<li class="active" ui-sref="dashboard"><a href="">Home</a></li>';
            }
        };

        // url로 siteMap 가져오기
        common.getPathUrlBySelectSietMap = function (pathUrl) {
            pathUrl	= pathUrl.trim();
            var pathUrls = pathUrl.split("/");
            var pSltLen = 0;
            var siteMap	= null;
            for (var i=0; i<common.siteMapList.length; i++) {
                if (common.siteMapList[i].url) {
                    var siteUrls	= common.siteMapList[i].url.trim().split("/");
                    if (pathUrls.length == siteUrls.length) {
                        var pSiteSlt = true;
                        var pSiteSltLen = 0;
                        var isSiteUrl 	= true;
                        for (var j=0;  j<siteUrls.length; j++) {
                            if (siteUrls[j].substring(0, 1) != ":") {
                                if (siteUrls[j] == pathUrls[j]) {
                                    if (pSiteSlt) {
                                        pSiteSltLen++;
                                    }
                                } else {
                                    isSiteUrl = false;
                                    break;
                                }
                            } else {
                                pSiteSlt = false;
                            }
                        }
                        if (isSiteUrl && pSiteSltLen > pSltLen) {
                            siteMap = common.siteMapList[i];
                            pSltLen = pSiteSltLen;
                        }
                    }
                }
            }
            return siteMap;
        };

        // language
        common.getLanguageKey = function () {
            return cache.getLanguageKey();
        };

        common.setLanguageKey = function (languageKey) {
            cache.setLanguageKey(languageKey);
        };

        common.changeLanguageKey = function (languageKey) {
            cache.setLanguageKey(languageKey);
        };

        // leftMenu 펼치기 여부
        common.isLeftMenuShow = function () {
            if (cookies.getLeftMenuShow() == "N") {
                return false;
            } else {
                return true;
            }
        };

        common.replaceUrlPath = function (url, params) {
            if (angular.isObject(params)) {
                for (var key in params) {
                    url = common.replaceAll(url, "{" + key + "}", params);
                }
            }
            return url;
        };

        /*
                common.syncPing = function() {
                    common.noMsgSyncHttpResponse(CONSTANTS.coreApiContextUrl + "/ping/", "GET");
                };
        */

        common.setRequestConfig = function (pathUrl, method, params, args, contentType, accept, timeout) {
            var config = {
                method: method,
                url: common.replaceUrlPath(pathUrl, args),
            };

            if (angular.isUndefined(config.method)) {
                config.method = "GET";
            }

            /*  사용 안함
                        if (config.method.toUpperCase() != "GET") {
                            common.syncPing();
                        }
            */

            if (timeout) {
                config.timeout = timeout;
            } else {
                if (config.method.toUpperCase() == "GET") {
                    config.timeout = _DEFAULT_GET_TIMEOUT_;
                } else {
                    if (_DEFAULT_POST_TIMEOUT_) {
                        config.timeout = _DEFAULT_POST_TIMEOUT_;
                    }
                }
            }

            var appendCharset = ";charset=UTF-8";

            config.headers = {};
            config.headers['Accept'] = (accept ? accept : "application/json") + appendCharset;
            config.headers['Content-Type'] = (contentType ? contentType : "application/json") + appendCharset;
            if (common.xsrfToken) {
                config.headers[_CSRF_TOKEN_HEADER_NAME_] = common.xsrfToken;
            }

            if ((config.method.toUpperCase() == "GET" || config.method.toUpperCase() == "DELETE") && params && $.param(params)) {
                if (config.url.indexOf('?') > 0) {
                    config.url += "&" + $.param(params);
                } else {
                    config.url += "?" + $.param(params);
                }
            }

            if (config.url.indexOf('?') > 0) {
                config.url += "&vt=v" + new Date().getTime();
            } else {
                config.url += "?vt=v" + new Date().getTime();
            }

            $http.defaults.useXDomain = true;
            $http.defaults.withCredentials = true;
            config.data = {};
            config.xhrFields = {};
            config.xhrFields.crossDomain = true;
            config.xhrFields.withCredentials = true;

            if (method.toUpperCase() != "GET" && method.toUpperCase() != "DELETE" && angular.isObject(params)) {
                if (config.headers["Content-Type"].indexOf('application/json') > -1) {
                    config.data = JSON.stringify(params);
                } else if (config.headers["Content-Type"].indexOf('application/x-www-form-urlencoded') > -1) {
                    config.data = $.param(params);
                } else {
                    config.data = params;
                }
            }
            return config;
        };

        // apiServerUrl
        common.apiServerUrl = "";
        common.requestGetApiServerUrl = CONSTANTS.coreApiContextUrl + "/server_host_url/";
        common.getApiServerUrl = function () {
            return common.apiServerUrl;
        };

        // csrf token
        common.xsrfToken = null;

        common.resourcePromise = function (pathUrl, method, params, args, contentType, accept, timeout) {
            var config = common.setRequestConfig(pathUrl, method, params, args, contentType, accept, timeout);

            if (method.toUpperCase() != "GET" && method.toUpperCase() != "DELETE" && angular.isObject(params) && config.headers["Content-Type"].indexOf("multipart/form-data") > -1) {
                config.headers["Content-Type"] = undefined;
//                config.url = common.getApiServerUrl() + config.url;
                config.transformRequest = function (data, headersGetter) {
                    var formData = new FormData();
                    var isFile = false;
                    var totalSize = 0;
                    angular.forEach(data, function (value, key) {
                        if (angular.isArray(value)) {
                            for (var i=0; i<value.length; i++) {
                                if(angular.isObject(value[i]) && value[i] instanceof $window.File) {
                                    formData.append(key, value[i], value[i].name);
                                    isFile = true;
                                    totalSize += value.size;
                                } else {
                                    formData.append(key, value[i]);
                                }
                            }
                        } else if(angular.isObject(value) && value instanceof $window.File) {
                            formData.append(key, value, value.name);
                            isFile = true;
                            totalSize += value.size;
                        } else {
                            formData.append(key, value);
                        }
                    });
                    return formData;
                };
                var defer = $q.defer();
                config.uploadEventHandlers = {
                    progress: function (evt) {
                        evt.percent = ((evt.loaded * 100) / evt.total);
                        defer.notify(evt);
                    }
                };
                $http(config).then(defer.resolve.bind(defer), defer.reject.bind(defer));
                return defer.promise;
            } else {
                // 서버 URL 정보를 가져오는 콜은 web server 를 통해서 받아 온다.
/*
                if (_PROTOCOL_ == "http:" && config.url.indexOf("http") != 0 && config.url != common.requestGetApiServerUrl) {
                    config.url = common.getApiServerUrl() + config.url;
                }
*/
                return $http(config);
            }
        };

        common.resourcePromiseJson = function (pathUrl, method, params, args, accept, timeout) {
            return common.resourcePromise(pathUrl, method, params, args, "application/json", accept, timeout);
        };

        common.resourcePromiseMultipart = function (pathUrl, method, params, args, accept, timeout) {
            return common.resourcePromise(pathUrl, method, params, "multipart/form-data", args, accept, timeout);
        };

        // promise 받기 success, error
        common.retrieveResource = function (promise, finallyFn) {
            promise.success = function (fn) {
                promise.then(function (data, statusText, response) {
                    if (angular.isUndefined(response) || angular.isString(response)) {
                        response = data;
                        data = response.data ? response.data : (response.responseJSON ? response.responseJSON : {});
                    }
                    var newXsrfToken;
                    if (angular.isFunction(response.getResponseHeader)) {
                        newXsrfToken = response.getResponseHeader(_CSRF_TOKEN_HEADER_NAME_);
                    } else if (angular.isFunction(response.headers)) {
                        newXsrfToken = response.headers(_CSRF_TOKEN_HEADER_NAME_);
                    }
                    if (newXsrfToken) {
                        common.xsrfToken = newXsrfToken;
                    }
                    response.data = data;
                    fn(data, response.status, response);
                });
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, function (response, statusText, errorMessage) {
                    var data = {};
                    if(angular.isUndefined(response) || angular.isString(response)) {
                        response = {};
                    }
                    data = response.data ? response.data : (response.responseJSON ? response.responseJSON : {});
                    try {
                        if (response.config && response.config.method && response.config.method.toUpperCase() == "GET" && response.status == -1) {
                            var mainCtrlScope = common.getMainCtrlScope();
                            mainCtrlScope.main.noAccessFrameSet("server_err");
                        } else if (response.status == 403) {
                            if (data && data.message) {
                                if (data.message == "mi_not_login") {
                                    common.clearUser();
                                    common.showAlertError($translate.instant("label.login"), $translate.instant("message.mi_not_login"));
                                    var mainCtrlScope = common.getMainCtrlScope();
                                    if (angular.isObject(mainCtrlScope) && angular.isObject(mainCtrlScope.main)  && angular.isFunction(mainCtrlScope.main.noAccessFrameSet)) {
                                        mainCtrlScope.main.noAccessFrameSet();
                                    }
                                } else {
                                    common.showAlertError($translate.instant("label.login"), $translate.instant("message." + data.message));
                                    common.moveHomeState();
                                }
                            } else {
                                if (errorMessage && data.exception) {
                                    common.showAlertError($translate.instant("label.error"), errorMessage + ": " + data.exception);
                                }
                            }
                        } else {
                            if (data && data.message) {
                                var errTitle = "";
                                var errMessage = "";
                                if (angular.isString(data.status)) {
                                    errTitle = data.status;
                                } else {
                                    if (data.exception) {
                                        errTitle = data.exception;
                                    } else {
                                        errTitle = data.error ? data.error : $translate.instant("label.error");
                                    }
                                }
                                errMessage = data.message;
                                $timeout(function () {
                                    common.showAlertError(errTitle, $translate.instant("message." + errMessage));
                                }, 100);
                            } else {
                                if (errorMessage || data.exception) {
                                    errorMessage = errorMessage ? errorMessage + (data.exception ? ": " + data.exception : "") : data.exception;
                                    $timeout(function () {
                                        common.showAlertError($translate.instant("label.error"), errorMessage);
                                    }, 100);
                                }
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    } finally {
                    }
                    var scope = common.getMainCtrlScope();
                    fn(data, response.status, response);
                });
                return promise;
            };
            promise.progress = function (fn) {
                promise.then(null, null, function (progress) {
                    fn(progress);
                });
                return promise;
            };
            promise.finally = function () {
                if (angular.isFunction(finallyFn)) {
                    finallyFn();
                }
            };
            return promise;
        };

        common.retrieveResourcePromise = function (pathUrl, method, params, args, contentType, accept, timeout, finallyFn) {
            return common.retrieveResource(common.resourcePromise(pathUrl, method, params, args, contentType, accept, timeout), finallyFn);
        };

        common.retrieveResourcePromiseJson = function (pathUrl, method, params, args, accept, timeout, finallyFn) {
            return common.retrieveResource(common.resourcePromiseJson(pathUrl, method, params, args, accept, timeout), finallyFn);
        };

        common.retrieveResourcePromiseMultipart = function (pathUrl, method, params, args, accept, timeout, finallyFn) {
            return common.retrieveResource(common.resourcePromiseMultipart(pathUrl, method, params, args, accept, timeout), finallyFn);
        };

        // promise 받기 success, error
        common.noMsgRetrieveResource = function (promise, finallyFn) {
            promise.success = function (fn) {
                promise.then(function (data, statusText, response) {
                    if (angular.isUndefined(response) || angular.isString(response)) {
                        response = data;
                        data = response.data ? response.data : (response.responseJSON ? response.responseJSON : {});
                    }
                    var newXsrfToken;
                    if (angular.isFunction(response.getResponseHeader)) {
                        newXsrfToken = response.getResponseHeader(_CSRF_TOKEN_HEADER_NAME_);
                    } else if (angular.isFunction(response.headers)) {
                        newXsrfToken = response.headers(_CSRF_TOKEN_HEADER_NAME_);
                    }
                    if (newXsrfToken) {
                        common.xsrfToken = newXsrfToken;
                    }
                    response.data = data;
                    fn(data, response.status, response);
                });
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, function (response, statusText, errorMessage) {
                    var data;
                    if(angular.isUndefined(response) || angular.isString(response)) {
                        response = {};
                    }
                    data = response.data ? response.data : (response.responseJSON ? response.responseJSON : {});
                    if (response.config && response.config.method && response.config.method.toUpperCase() == "GET" && response.status == -1) {
                        var mainCtrlScope = common.getMainCtrlScope();
                        mainCtrlScope.main.noAccessFrameSet("server_err");
                    } else if (response.status == 403) {
                        if (data && data.message) {
                            if (data.message == "mi_not_login") {
                                common.clearUser();
                                common.showAlertError($translate.instant("label.login"), $translate.instant("message.mi_not_login"));
                                var mainCtrlScope = common.getMainCtrlScope();
                                if (angular.isObject(mainCtrlScope) && angular.isObject(mainCtrlScope.main)  && angular.isFunction(mainCtrlScope.main.noAccessFrameSet)) {
                                    mainCtrlScope.main.noAccessFrameSet();
                                }
                            } else {
                                common.showAlertError($translate.instant("label.login"), $translate.instant("message." + data.message));
                                common.moveHomeState();
                            }
                        }
                    }
                    fn(data, response.status, response);
                });
                return promise;
            };
            promise.progress = function (fn) {
                promise.then(null, null, function (progress) {
                    fn(progress);
                });
                return promise;
            };
            promise.finally = function () {
                if (angular.isFunction(finallyFn)) {
                    finallyFn();
                }
            };
            return promise;
        };

        common.noMsgRetrieveResourcePromise = function (pathUrl, method, params, args, contentType, accept, timeout, finallyFn) {
            return common.noMsgRetrieveResource(common.resourcePromise(pathUrl, method, params, args, contentType, accept, timeout), finallyFn);
        };

        common.noMsgRetrieveResourcePromiseJson = function (pathUrl, method, params, args, accept, timeout, finallyFn) {
            return common.noMsgRetrieveResource(common.resourcePromiseJson(pathUrl, method, params, args, accept, timeout), finallyFn);
        };

        common.noMsgRetrieveResourcePromiseMultipart = function (pathUrl, method, params, args, accept, timeout, finallyFn) {
            return common.noMsgRetrieveResource(common.resourcePromiseMultipart(pathUrl, method, params, args, accept, timeout), finallyFn);
        };

        // 동기 방식
        common.syncHttpResponseJson = function (pathUrl, method, params, args, accept) {
            var contentType = "application/json";
            return common.syncHttpResponse(pathUrl, method, params, args, contentType, accept);
        };

        // 동기 방식
        common.syncHttpResponseMultipart = function (pathUrl, method, params, args, accept) {
            var contentType = "multipart/form-data";
            return common.syncHttpResponse(pathUrl, method, params, args, contentType, accept);
        };

        // 동기 방식
        common.syncHttpResponse = function (pathUrl, method, params, args, contentType, accept) {
            var config = common.setRequestConfig(pathUrl, method, params, args, contentType, accept);
            config.async = false;

            var responseData	= null;
            config.success = function (data, statusText, response) {
                if (angular.isUndefined(response) || angular.isString(response)) {
                    response = data;
                    data = response.data ? response.data : (response.responseJSON ? response.responseJSON : {});
                }
                var newXsrfToken;
                if (angular.isFunction(response.getResponseHeader)) {
                    newXsrfToken = response.getResponseHeader(_CSRF_TOKEN_HEADER_NAME_);
                } else if (angular.isFunction(response.headers)) {
                    newXsrfToken = response.headers(_CSRF_TOKEN_HEADER_NAME_);
                }
                if (newXsrfToken) {
                    common.xsrfToken = newXsrfToken;
                }
                response.data = data;
                responseData = response;
            };
            config.error = function (response, statusText, errorMessage) {
                var data;
                if(angular.isUndefined(response) || angular.isString(response)) {
                    response = {};
                }
                data = response.data ? response.data : (response.responseJSON ? response.responseJSON : {});
                try {
                    if (response.status == 403) {
                        if (data.message == "mi_not_login") {
                            common.clearUser();
                            common.showAlertError($translate.instant("label.login"), $translate.instant("message.mi_not_login"));
                            var mainCtrlScope = common.getMainCtrlScope();
                            if (angular.isObject(mainCtrlScope) && angular.isObject(mainCtrlScope.main)  && angular.isFunction(mainCtrlScope.main.noAccessFrameSet)) {
                                mainCtrlScope.main.noAccessFrameSet();
                            }
                        } else {
                            common.showAlertError($translate.instant("label.login"), $translate.instant("message." + data.message));
                            var mainCtrlScope = common.getMainCtrlScope();
                            if (angular.isObject(mainCtrlScope) && angular.isObject(mainCtrlScope.main)  && angular.isFunction(mainCtrlScope.main.noAccessFrameSet)) {
                                mainCtrlScope.scope().main.accessCheck();
                            }
                        }
                    } else {
                        if (data && data.message) {
                            var errTitle = "";
                            var errMessage = "";
                            if (angular.isString(data.status)) {
                                errTitle = data.status;
                            } else {
                                if (data.exception) {
                                    errTitle = data.exception;
                                } else {
                                    errTitle = data.error ? data.error : $translate.instant("label.error");
                                }
                            }
                            errMessage = data.message;
                            $timeout(function () {
                                common.showAlertError(errTitle, $translate.instant("message." + errMessage));
                            }, 100);
                        } else {
                            if (errorMessage || data.exception) {
                                errorMessage = errorMessage ? errorMessage + (data.exception ? ": " + data.exception : "") : data.exception;
                                $timeout(function () {
                                    common.showAlertError($translate.instant("label.error"), errorMessage);
                                }, 100);
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                } finally {
                }
                responseData = response;
            };
            var ajax = $.ajax(config);
            return responseData;
        };

        common.syncRetrieveResourcePromise = function (pathUrl, method, params, args, contentType, accept, finallyFn) {
            return common.noMsgSyncHttpResponse(common.syncHttpResponse(pathUrl, method, params, args, contentType, accept), finallyFn);
        };

        common.syncRetrieveResourcePromiseJson = function (pathUrl, method, params, args, accept, finallyFn) {
            return common.noMsgSyncHttpResponseJson(common.syncHttpResponseJson(pathUrl, method, params, args, accept), finallyFn);
        };

        common.syncRetrieveResourcePromiseMultipart = function (pathUrl, method, params, args, accept, finallyFn) {
            return common.noMsgSyncHttpResponseJson(common.syncHttpResponseMultipart(pathUrl, method, params, args, accept), finallyFn);
        };

        // 동기 방식
        common.noMsgSyncHttpResponseJson = function (pathUrl, method, params, args, accept) {
            var contentType = "application/json";
            return common.noMsgSyncHttpResponse(pathUrl, method, params, args, contentType, accept);
        };

        // 동기 방식
        common.noMsgSyncHttpResponseMultipart = function (pathUrl, method, params, args, accept) {
            var contentType = "multipart/form-data";
            return common.noMsgSyncHttpResponse(pathUrl, method, params, args, contentType, accept);
        };

        // 동기 방식
        common.noMsgSyncHttpResponse = function (pathUrl, method, params, args, contentType, accept) {

            var config = common.setRequestConfig(pathUrl, method, params, args, contentType, accept);
            config.async = false;

            var responseData	= null;
            config.success = function (data, statusText, response) {
                if (angular.isUndefined(response) || angular.isString(response)) {
                    response = data;
                    data = response.data ? response.data : (response.responseJSON ? response.responseJSON : {});
                }
                var newXsrfToken;
                if (angular.isFunction(response.getResponseHeader)) {
                    newXsrfToken = response.getResponseHeader(_CSRF_TOKEN_HEADER_NAME_);
                } else if (angular.isFunction(response.headers)) {
                    newXsrfToken = response.headers(_CSRF_TOKEN_HEADER_NAME_);
                }
                if (newXsrfToken) {
                    common.xsrfToken = newXsrfToken;
                }
                response.data = data;
                responseData = response;
            };
            config.error = function (data, statusText, response) {
                var data;
                if(angular.isUndefined(response) || angular.isString(response)) {
                    response = {};
                }
                data = response.data ? response.data : (response.responseJSON ? response.responseJSON : {});
                responseData = response;
                responseData.data = data;
            };

            var ajax = $.ajax(config);
            return responseData;
        };

        common.noMsgSyncRetrieveResourcePromise = function (pathUrl, method, params, args, contentType, accept, finallyFn) {
            return common.noMsgSyncHttpResponse(common.noMsgSyncHttpResponse(pathUrl, method, params, args, contentType, accept), finallyFn);
        };

        common.noMsgSyncRetrieveResourcePromiseJson = function (pathUrl, method, params, args, accept, finallyFn) {
            return common.noMsgSyncHttpResponseJson(common.noMsgSyncHttpResponseJson(pathUrl, method, params, args, accept), finallyFn);
        };

        common.noMsgSyncRetrieveResourcePromiseMultipart = function (pathUrl, method, params, args, accept, finallyFn) {
            return common.noMsgSyncHttpResponseJson(common.noMsgSyncHttpResponseMultipart(pathUrl, method, params, args, accept), finallyFn);
        };

        common.apiPing = function() {
            return common.noMsgRetrieveResourcePromiseJson(CONSTANTS.coreApiContextUrl + '/ping/', 'GET', {}, null, null, 2000);
        };

        common.getElementById = function (id) {
            return document.getElementById(id);
        };

        common.querySelector = function (query) {
            return document.querySelector(query);
        };

        common.getElementByIdCtrlElement = function (id) {
            return angular.element(common.getElementById(id));
        };

        common.getQuerySelectorCtrlElement = function (query) {
            return angular.element(common.querySelector(query));
        };

        // id로 scope 가져오기
        common.getElementByIdCtrlScope = function (id) {
            return common.getElementByIdCtrlElement(id).scope();
        };

        // querySelector로 scope 가져오기
        common.getQuerySelectorCtrlScope = function (query) {
            return common.getQuerySelectorCtrlElement(query).scope();
        };

        // main scope 가져오기
        common.getMainCtrlScope = function () {
            return common.getElementByIdCtrlScope("mainCtrl");
        };

        // mainBody scope 가져오기
        common.getMainBodyCtrlScope = function () {
            return common.getElementByIdCtrlScope("mainBody");
        };

        // MainContents scope 가져오기
        common.getMainContentsCtrlScope = function () {
            return common.getElementByIdCtrlScope("mainContents");
        };

        common.goHomePath = function () {
            common.locationPath(CONSTANTS.homePath);
        };

        common.moveHomeState = function () {
            common.goToState(CONSTANTS.homeState);
        };

        common.moveHomePage = function () {
            common.locationHref(CONSTANTS.homeUrl);
        };

        common.moveLoginPage = function () {
            common.locationHref(CONSTANTS.loginUrl);
        };

        common.moveLoginState = function () {
            common.goToState(CONSTANTS.loginState);
        };

        common.goLoginPath = function () {
            common.locationPath(CONSTANTS.loginPath);
        };

        common.locationUrl = function (pathUrl) {
            $location.url(pathUrl).replace();
        };

        common.stateReload = function () {
            $state.reload();
        };

        common.locationReload = function () {
            $window.location.reload();
        };

        common.locationHref = function (url) {
            $window.location.href = url;
        };

        common.locationPathReplace = function (pathUrl) {
            $location.path(pathUrl).replace();
        };

        common.locationPath = function (pathUrl) {
            $location.path(pathUrl);
        };

        common.goToState = function (stateKey) {
            return $state.go(stateKey);
        };

        common.getJSONParse = function (jsonStr) {
            var jsonData = jsonStr;
            try {
                jsonData = JSON.parse(jsonStr);
            } catch (e) {
            }
            return jsonData;
        };

        common.getJSONStringify = function (jsonData) {
            var jsonStr = jsonData;
            try {
                jsonStr = JSON.stringify(jsonData);
            } catch (e) {
            }
            return jsonStr;
        };

        common.isLoginNoAcceptPage = function (path) {
            return ($.inArray(path, CONSTANTS.loginNoAcceptPages) !== -1);
        };

        common.isNotLoginAcceptPage = function (path) {
            return ($.inArray(path, CONSTANTS.notLoginAcceptPages) !== -1);
        };

        common.makeKeyAndValueMap = function (mapList, keyField, valueField) {
            var paramMap = {};
            $.each(mapList, function (idx, sMap) {
                if (sMap[keyField]) {
                    paramMap[sMap[keyField]] = sMap[valueField];
                }
            });
            return paramMap;
        };

        // alert
        common.showAlertSuccess = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                args.push("success");
                common.showAlertMessage(args);
            }
        };

        // alert
        common.showAlertError = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                args.push("error");
                common.showAlertMessage(args);
            }
        };

        // alert
        common.showAlertWarning = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                args.push("warn");
                common.showAlertMessage(args);
            }
        };

        // alert
        common.showAlertInfo = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                args.push("info");
                common.showAlertMessage(args);
            }
        };

        // alert
        common.showAlert = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                common.showAlertMessage(args);
            }
        };

        // alert
        common.showAlertMessage = function (args) {
            var time = 3000;
            var start = 0;
            if (args.length > 0 && angular.isNumber(args[0])) {
                time = args[0];
                start = 1;
            }
            if (args.length > start) {
                var alertType = "info";
                var textContent = "message";
                if (args.length == start + 1) {
                    textContent = args[start];
                } else if (args.length == start + 2) {
                    if ("|success|warn|error|info|".indexOf(args[start + 1]) >= 0) {
                        textContent = args[start];
                        alertType = args[start + 1];
                    } else {
                        textContent = args[start + 1];
                    }
                } else if (args.length >= start + 3) {
                    textContent = args[start + 1];
                    alertType = args[start + 2];
                }
                if (_MODE_ == "DEBUG") console.log("showAlertMessage : " + textContent);
                if (_DOMAIN_ != 'localhost') {
                    if (!textContent) return;
                    if (textContent == "Unauthorized") return;
                    if (textContent == "Not Found") return;
                    if (textContent == "Bad Gateway") return;
                    if (textContent == "No message available") return;
                    if (textContent == "Error") return;
                    if (textContent == "403") return;
                    if (textContent == "-1") return;
                }
                $timeout(function () {
                    if (alertType == "success") {
                        growl.addSuccessMessage(textContent, {ttl: time, enableHtml: false});
                    } else if (alertType == "warn") {
                        growl.addWarnMessage(textContent, {ttl: time, enableHtml: false});
                    } else if (alertType == "error") {
                        growl.addErrorMessage(textContent, {ttl: time, enableHtml: false});
                    } else {
                        growl.addInfoMessage(textContent, {ttl: time, enableHtml: false});
                    }
                }, 10);
            }
        };

        // alert
        common.showAlertSuccessHtml = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                args.push("success");
                common.showAlertMessageHtml(args);
            }
        };

        // alert
        common.showAlertErrorHtml = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                args.push("error");
                common.showAlertMessageHtml(args);
            }
        };

        // alert
        common.showAlertWarningHtml = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                args.push("warn");
                common.showAlertMessageHtml(args);
            }
        };

        // alert
        common.showAlertInfoHtml = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                args.push("info");
                common.showAlertMessageHtml(args);
            }
        };

        // alert
        common.showAlertHtml = function () {
            if (arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                common.showAlertMessageHtml(args);
            }
        };

        // alert
        common.showAlertMessageHtml = function (args) {
            var time = 3000;
            var start = 0;
            if (args.length > 0 && angular.isNumber(args[0])) {
                time = args[0];
                start = 1;
            }
            if (args.length > start) {
                var alertType = "info";
                var htmlContent = "message";
                if (args.length == start + 1) {
                    htmlContent = args[start];
                } else if (args.length == start + 2) {
                    if ("|success|warn|error|info|".indexOf(args[start + 1]) >= 0) {
                        htmlContent = args[start];
                        alertType = args[start + 1];
                    } else {
                        htmlContent = args[start + 1];
                    }
                } else if (args.length >= start + 3) {
                    htmlContent = args[start + 1];
                    alertType = args[start + 2];
                }
                if (_MODE_ == "DEBUG") console.log("showAlertMessageHtml : " + htmlContent);
                if (_DOMAIN_ != 'localhost') {
                    if (!htmlContent) return;
                    if (htmlContent == "Unauthorized") return;
                    if (htmlContent == "Not Found") return;
                    if (htmlContent == "Bad Gateway") return;
                    if (htmlContent == "No message available") return;
                    if (htmlContent == "Error") return;
                    if (htmlContent == "403") return;
                    if (htmlContent == "-1") return;
                }
                $timeout(function () {
                    if (alertType == "success") {
                        growl.addSuccessMessage(htmlContent, {ttl: time, enableHtml: true});
                    } else if (alertType == "warn") {
                        growl.addWarnMessage(htmlContent, {ttl: time, enableHtml: true});
                    } else if (alertType == "error") {
                        growl.addErrorMessage(htmlContent, {ttl: time, enableHtml: true});
                    } else {
                        growl.addInfoMessage(htmlContent, {ttl: time, enableHtml: true});
                    }
                }, 10);
            }
        };

        // alert
        common.showDialogAlertError = function (title, textContent) {
            return common.showDialogAlert(title, textContent, "error");
        };

        // alert
        common.showDialogAlertWarning = function (title, textContent) {
            return common.showDialogAlert(title, textContent, "warning");
        };

        // alert
        common.showDialogAlert = function (title, textContent, alertType) {
            var rootScope = common.getMainCtrlScope();
            rootScope.main.loadingMain = false;
            rootScope.main.loadingMainBody = false;
            var optionsOrPreset = $mdDialog.alert({skipHide: true, clickOutsideToClose: true}).title(title).textContent(textContent).ok($translate.instant("label.confirm"));
            if (alertType != "info"){
                optionsOrPreset._options.templateUrl = CONSTANTS.popAlertInfoFormUrl + _VersionTail();
            } else {
                optionsOrPreset._options.templateUrl = CONSTANTS.popAlertFormUrl + _VersionTail();
            }
            if (angular.isDefined(alertType) && alertType != "info") {
                optionsOrPreset._options.alertType = alertType;
                optionsOrPreset._options.ariaLabel = $translate.instant("label." + alertType);
            } else {
                optionsOrPreset._options.alertType = "info";
                optionsOrPreset._options.ariaLabel = $translate.instant("label.confirm");
            }
            optionsOrPreset.fullscreen = false;
            optionsOrPreset.multiple = true;
            return $mdDialog.show(optionsOrPreset);
        };

        // alert
        common.showDialogAlertErrorHtml = function (title, textContent) {
            return common.showDialogAlertHtml(title, textContent, "error");
        };

        // alert
        common.showDialogAlertWarningHtml = function (title, textContent) {
            return common.showDialogAlertHtml(title, textContent, "warning");
        };

        // alert
        common.showDialogAlertHtml = function (title, htmlContent, alertType) {
            var rootScope = common.getMainCtrlScope();
            rootScope.main.loadingMain = false;
            rootScope.main.loadingMainBody = false;
            var optionsOrPreset = $mdDialog.alert({skipHide: true, clickOutsideToClose: true}).title(title).htmlContent(htmlContent).ok($translate.instant("label.confirm"));
            if (alertType == "info"){
                optionsOrPreset._options.templateUrl = CONSTANTS.popAlertInfoFormUrl + _VersionTail();
            } else {
                optionsOrPreset._options.templateUrl = CONSTANTS.popAlertFormUrl + _VersionTail();
            }
            if (angular.isDefined(alertType) && alertType != "info") {
                optionsOrPreset._options.alertType = alertType;
                optionsOrPreset._options.ariaLabel = $translate.instant("label." + alertType);
            } else {
                optionsOrPreset._options.alertType = "info";
                optionsOrPreset._options.ariaLabel = $translate.instant("label.confirm");
            }
            optionsOrPreset.fullscreen = false;
            optionsOrPreset.multiple = true;
            return $mdDialog.show(optionsOrPreset);
        };

        // confirm
        common.showConfirmWarning = function (title, textContent) {
            return common.showConfirm(title, textContent, "warning");
        };

        // confirm
        common.showConfirm = function (title, textContent, okBtnName, cancelBtnName) {
            if (!okBtnName) okBtnName = $translate.instant("label.ok");
            if (!cancelBtnName) cancelBtnName = $translate.instant("label.cancel");
            var optionsOrPreset = $mdDialog.confirm({skipHide: true, clickOutsideToClose: true}).title(title).textContent(textContent).ok(okBtnName).cancel(cancelBtnName);
            optionsOrPreset._options.templateUrl = CONSTANTS.popAlertFormUrl + _VersionTail();
            optionsOrPreset._options.alertType = "info";
            optionsOrPreset._options.ariaLabel = $translate.instant("label.confirm");
            optionsOrPreset.fullscreen = false;
            optionsOrPreset.multiple = true;
            return $mdDialog.show(optionsOrPreset);
        };

        // confirm
        common.showConfirmWarningHtml = function (title, textContent) {
            return common.showConfirmHtml(title, textContent, "warning");
        };

        // confirm
        common.showConfirmHtml = function (title, htmlContent, okBtnName, cancelBtnName) {
            if (!okBtnName) okBtnName = $translate.instant("label.ok");
            if (!cancelBtnName) cancelBtnName = $translate.instant("label.cancel");
            var optionsOrPreset = $mdDialog.confirm({skipHide: true, clickOutsideToClose: true}).title(title).htmlContent(htmlContent).ok(okBtnName).cancel(cancelBtnName);
            optionsOrPreset._options.templateUrl = CONSTANTS.popAlertFormUrl + _VersionTail();
            optionsOrPreset._options.alertType = "info";
            optionsOrPreset._options.ariaLabel = $translate.instant("label.confirm");
            optionsOrPreset.fullscreen = false;
            optionsOrPreset.multiple = true;
            return $mdDialog.show(optionsOrPreset);
        };

        common.mdDialogHide = function () {
            $mdDialog.hide();
        };

        common.mdDialogCancel = function () {
            $mdDialog.cancel();
        };

        common.showDialog = function ($scope, $event, dialogOptions, subName) {
            if (!subName) subName = "";
            var dialogOptionsName = "dialogOptions";
            if (subName != "") {
                dialogOptionsName += subName;
            }

            if (!angular.isUndefined(dialogOptions)) {
                if (angular.isString(dialogOptions)) {
                    dialogOptions	= { controller : dialogOptions };
                }
                if (!dialogOptions.dialogClassName) {
                    dialogOptions.dialogClassName = "modal-dialog";
                }
                if (!dialogOptions.btnTemplateUrl) {
                    if (!dialogOptions.btnTemplate) {
                        if (dialogOptions.buttons) {
                            var btnTemplate	= '<p ng-show="dialogOptions.bottomLeftMessage" class="pull-left">{{ dialogOptions.bottomLeftMessage }}</p>\n';
                            angular.forEach(dialogOptions.buttons, function (value, key) {
                                var btnName		= (value.btnName) ? value.btnName : "Btn(" + key + ')';
                                var className	= (value.className) ? ' ' + value.className : "";
                                var extOption	= (value.extOption) ? ' ' + value.extOption : "";
                                if (btnTemplate)	btnTemplate	+= "\n";
                                btnTemplate += '<button ng-hide="actionBtnHied" class="btn'+ className +'"' + extOption + '>' + btnName + '</button>';
                            });
                            dialogOptions.btnTemplate= btnTemplate
                        } else {
                            if (dialogOptions.leftBtnTemplate) {
                                if (angular.isUndefined(dialogOptions.leftBtnHide)) {
                                    dialogOptions.leftBtnHide = true;
                                }
                                dialogOptions.btnTemplate = '<div ng-hide="' + dialogOptionsName + '.leftBtnHide" class="pull-left" >' + dialogOptions.leftBtnTemplate + '</div>\n';
                            } else {
                                dialogOptions.btnTemplate = '<p ng-show="' + dialogOptionsName + '.bottomLeftMessage" class="pull-left">{{ dialogOptions.bottomLeftMessage }}</p>\n';
                            }
                            if (dialogOptions.okBtnHide != true) {
                                if (dialogOptions.btnOkTemplate) {
                                    dialogOptions.btnTemplate += dialogOptions.btnOkTemplate + '\n';
                                } else {
                                    dialogOptions.btnTemplate += '<button ng-hide="' + dialogOptionsName + '.actionBtnHied" class="btn btn-color1" ng-click="' + dialogOptionsName + '.popDialogOk()" ng-hide="'+ dialogOptionsName + '.error || '+ dialogOptionsName + '.success" ng-disabled="' + dialogOptionsName + '.authenticate">{{ dialogOptions.okName }}</button>\n';
                                }
                            }
                            if (dialogOptions.cancelBtnHide != true) {
                                if (dialogOptions.btnCancelTemplate) {
                                    dialogOptions.btnTemplate += dialogOptions.btnCancelTemplate + '\n';
                                } else {
                                    dialogOptions.btnTemplate += '<button ng-hide="' + dialogOptionsName + '.actionBtnHied" class="btn btn-color2" data-dismiss="modal" ng-click="'+ dialogOptionsName + '.popCancel()">{{ dialogOptions.closeName }}</button>\n';
                                }
                            }
                        }
                    }
                }
                if (!dialogOptions.okName) {
                    dialogOptions.okName = $translate.instant("label.save");
                }
                if (!dialogOptions.closeName) {
                    dialogOptions.closeName = $translate.instant("label.close");
                }
                if (!dialogOptions.resultReturnName) {
                    dialogOptions.resultReturnName = $translate.instant("label.confirm");
                }
            }

            if (!dialogOptions.controller) {
                dialogOptions.controller = function ($scope, ValidationService) {
                    if (_MODE_ == "DEBUG") console.log("popCommFormCtrl");
                    var vm = this;
                    vm.validationService = new ValidationService({controllerAs: vm});
                };
            }
            if (!dialogOptions.controllerAs) {
                dialogOptions.controllerAs = "pop" + subName;
            }

            $scope[dialogOptionsName] = dialogOptions;

            $scope.error	= null;
            $scope.success	= null;

            var popTemplateFile = CONSTANTS.popCommFormUrl + _VersionTimeTail();
            var popTemplateUrl = popTemplateFile;
            if (subName) {
                popTemplateUrl = "pop_" + subName + "Template.html";
            }

            var optionsOrPreset = {
                controller: dialogOptions.controller,
                controllerAs: dialogOptions.controllerAs,
                templateUrl: popTemplateUrl,
                parent: angular.element(document.body),
                autoWrap: true,
                targetEvent: $event,
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: false,
                escapeToClose: true,
                fullscreen: false,
                multiple: false,
                skipHide: true
            };

            var dialog	= null;
            if (subName) {
                var popTemplateHtml = $templateCache.get(popTemplateFile);
                if (popTemplateHtml) {
                    dialog	= $mdDialog.show(optionsOrPreset);
                } else {
                    common.getTemplateHtml(popTemplateFile, function (templateHtml) {
                        $templateCache.put(popTemplateUrl, templateHtml.replace(/dialogOptions/gi, dialogOptionsName));
                        dialog	= $mdDialog.show(optionsOrPreset);
                    }, function (res) {
                        console.log("Not Load File: " + CONSTANTS.popCommFormUrl);
                    });
                }
            } else {
                dialog	= $mdDialog.show(optionsOrPreset);
            }

            $scope[dialogOptionsName].actionLoading = false;
            $scope[dialogOptionsName].dialogClose	= false;

            if (!$scope[dialogOptionsName].popDialogOk) {
                $scope[dialogOptionsName].popDialogOk = function () {
                    $mdDialog.hide();
                };
            }

            if (!$scope[dialogOptionsName].popCancel) {
                $scope[dialogOptionsName].popCancel = function () {
                    $scope[dialogOptionsName].dialogClose	= true;
                    $scope[dialogOptionsName].actionBtnHied = false;
                    $mdDialog.cancel();
                };
            }

            $scope[dialogOptionsName].popHide = function () {
                $scope[dialogOptionsName].dialogClose	= true;
                $scope[dialogOptionsName].actionBtnHied = false;
                $mdDialog.hide();
            };

            $scope[dialogOptionsName].popAnswer = function (answer) {
                $mdDialog.hide(answer);
            };
            $scope[dialogOptionsName].popResultReturn = function () {
                $scope[dialogOptionsName].error = null;
                $scope[dialogOptionsName].success = null;
            };

            $scope[dialogOptionsName].actionBtnHied = false;

            // csrf token 을 받기 위한 ping
            common.apiPing();
            return dialog;
        };

        common.showSimpleDialog = function ($scope, $event, dialogOptions, subName) {
            if (!subName) subName = "";
            var dialogOptionsName = "dialogOptions";
            if (subName != "") {
                dialogOptionsName += subName;
            }

            if (!angular.isUndefined(dialogOptions)) {
                if (angular.isString(dialogOptions)) {
                    dialogOptions	= { controller : dialogOptions };
                }
                if (!dialogOptions.dialogClassName) {
                    dialogOptions.dialogClassName = "modal-dialog";
                }
            }

            var optionsOrPreset = {
                controller: dialogOptions.controller,
                controllerAs: dialogOptions.controllerAs,
                templateUrl: _VIEWS_+'/common/popSimpleCommForm.html' + _VersionTimeTail(),
                parent: angular.element(document.body),
                scope: $scope,
                preserveScope: true,
                autoWrap: true,
                targetEvent: $event,
                clickOutsideToClose: false,
                escapeToClose: true,
                fullscreen: false,
                multiple: true,
                skipHide: true
            };

            if (dialogOptions.controller) {
                optionsOrPreset.controller = dialogOptions.controller;
            }

            if (dialogOptions.controllerAs) {
                optionsOrPreset.controller = dialogOptions.controllerAs;
            }

            $scope[dialogOptionsName] = dialogOptions;

            var dialog	= $mdDialog.show(optionsOrPreset);

            $scope[dialogOptionsName].popDialogOk = function () {
                $scope[dialogOptionsName].actionBtnHied = false;
                $mdDialog.hide();
            };

            $scope[dialogOptionsName].popCancel = function () {
                $scope[dialogOptionsName].actionBtnHied = false;
                $mdDialog.cancel();
            };

            $scope[dialogOptionsName].popHide = function () {
                $scope[dialogOptionsName].actionBtnHied = false;
                $mdDialog.hide();
            };

            $scope[dialogOptionsName].actionBtnHied = false;
            // csrf token 을 받기 위한 ping
            common.apiPing();
            return dialog;
        };

        common.showRightSliderContents = function ($scope, title, templateUrl, data, options) {

            var dialogOptions	= {};
            if (options) {
                dialogOptions = options;
            }
            dialogOptions.title = title;
            if (!dialogOptions.dialogClassName) {
                dialogOptions.dialogClassName = "modal-right-dialog";
            }
            if (!dialogOptions.controllerAs) {
                dialogOptions.controllerAs = "spop";
            }
            dialogOptions.controller = function ($scope) {
                if (_MODE_ == "DEBUG") console.log("rightSliderContentsCtrl");
                var vm = this;
                vm.data = (data) ? data : {};
            };

            if (!dialogOptions.dialogId) {
                dialogOptions.dialogId = "slider-contents";
            }

            if (!dialogOptions.sliderWidth) {
                dialogOptions.sliderWidth = 1000;
            }

            $('#' + dialogOptions.dialogId).css('width', dialogOptions.sliderWidth);
            $('body').addClass('body_fixed');
            $('html').addClass('html_hidden_scroll');
            $("#slider-contents-container").css('display', 'block');
            if (!dialogOptions.dialogTemplateUrl) {
                dialogOptions.dialogTemplateUrl = _VIEWS_ + '/common/rightCommSliderContents.html' + _VersionTimeTail();
            }
            dialogOptions.templateUrl = templateUrl ? templateUrl + _VersionTimeTail() : "";

            // csrf token 을 받기 위한 ping
            common.apiPing();
            return common.showRightDialog($scope, dialogOptions);
        };

        common.showRightDialog = function ($scope, dialogOptions) {
            if (!angular.isUndefined(dialogOptions)) {
                if (angular.isString(dialogOptions)) {
                    dialogOptions	= { controller : dialogOptions };
                }
                if (!dialogOptions.dialogClassName) {
                    dialogOptions.dialogClassName = "modal-right-dialog";
                }
            }

            if (!dialogOptions.controllerAs) {
                dialogOptions.controllerAs = "pop";
            }

            if (!dialogOptions.controller) {
                dialogOptions.controller = function ($scope, ValidationService) {
                    var vm = this;
                    vm.validationService = new ValidationService({controllerAs: vm});
                    if (_MODE_ == "DEBUG") console.log("rightPopFormCtrl");
                };
            }

            var dialogId = (dialogOptions.dialogId) ? "#" + dialogOptions.dialogId : "#aside-md";
            dialogOptions.sliderWidth = (dialogOptions.sliderWidth) ? dialogOptions.sliderWidth : 360;
            var onShowing = function($scope, element) {
                $(dialogId).stop().animate({"right": "-" + dialogOptions.sliderWidth + "px"}, 400);
                $(dialogId).stop().animate({"right": "0"}, 500);
            };
            var onRemoving = function($scope, element) {
                $(dialogId).stop().animate({"right":"-" + dialogOptions.sliderWidth + "px"}, 400);
                $timeout(function () {
                    $(dialogId).find('> dev').remove();
                    $("#slider-contents-container").css('display', 'none');
                    $('body').removeClass('body_fixed');
                    $('html').removeClass('html_hidden_scroll');
                }, 400);
            };

            dialogOptions.dialogTemplateUrl = (dialogOptions.dialogTemplateUrl) ? dialogOptions.dialogTemplateUrl : _VIEWS_+'/common/rightPopCommForm.html' + _VersionTimeTail();

            $scope.dialogOptions = dialogOptions;

            var optionsOrPreset = {
                controller: dialogOptions.controller,
                controllerAs: dialogOptions.controllerAs,
                templateUrl: dialogOptions.dialogTemplateUrl + _VersionTimeTail(),
                parent: $(dialogId),
                scope: $scope,
                locals: { popType: 'pop' },
                disableParentScroll: false,
                hasBackdrop: false,
                preserveScope: true,
                autoWrap: true,
                clickOutsideToClose: false,
                escapeToClose: true,
                fullscreen: false,
                focusOnOpen: false,
                multiple: true,
                onShowing: onShowing,
                onRemoving: onRemoving
            };

            var dialog	= $mdDialog.show(optionsOrPreset);

            $scope.dialogOptions.popHide = function () {
                $scope.actionBtnHied = false;
                $mdDialog.hide();
            };

            $scope.dialogOptions.popCancel = function () {
                $scope.actionBtnHied = false;
                $mdDialog.cancel();
            };

            $scope.dialogOptions.popDialogOk = function () {
                $scope.actionBtnHied = false;
                $mdDialog.hide();
            };

            $scope.actionBtnHied = false;
            // csrf token 을 받기 위한 ping
            common.apiPing();
            return dialog;
        };

        common.showRightChildDialog = function ($scope, dialogOptions) {
            if (!angular.isUndefined(dialogOptions)) {
                if (angular.isString(dialogOptions)) {
                    dialogOptions	= { controller : dialogOptions };
                }
                if (!dialogOptions.dialogClassName) {
                    dialogOptions.dialogClassName = "modal-right-dialog";
                }
            }

            if (!dialogOptions.controllerAs) {
                dialogOptions.controllerAs = "pop";
            }

            if (!dialogOptions.controller) {
                dialogOptions.controller = function ($scope, ValidationService) {
                    var vm = this;
                    vm.validationService = new ValidationService({controllerAs: vm});
                    if (_MODE_ == "DEBUG") console.log("rightPopFormCtrl");
                };
            }

            var dialogId = "#aside-md-child";

            var onShowing = function($scope, element) {
                $(dialogId).stop().animate({"right":"-360px"}, 400);
                $(dialogId).stop().animate({"right":"0"}, 500);
            };

            var onRemoving = function($scope, element) {
                $(dialogId).find('> dev').remove();
                $(dialogId).stop().animate({"right":"-360px"}, 400);
            };

            $scope.childDialogOptions = dialogOptions;

            var optionsOrPreset = {
                controller: dialogOptions.controller,
                controllerAs: dialogOptions.controllerAs,
                templateUrl: _VIEWS_+'/common/rightChildPopCommForm.html' + _VersionTimeTail(),
                parent: $(dialogId),
                scope: $scope,
                locals: { popType: 'child' },
                disableParentScroll: false,
                hasBackdrop: false,
                preserveScope: true,
                autoWrap: true,
                clickOutsideToClose: false,
                escapeToClose: true,
                fullscreen: false,
                focusOnOpen: false,
                multiple: true,
                skipHide: true,
                onShowing: onShowing,
                onRemoving: onRemoving
            };

            var dialog	= $mdDialog.show(optionsOrPreset);

            $scope.childDialogOptions.popHide = function () {
                $scope.actionBtnHied = false;
                $mdDialog.hide();
            };

            $scope.childDialogOptions.popCancel = function () {
                $scope.actionBtnHied = false;
                $mdDialog.cancel();
            };

            $scope.childDialogOptions.popDialogOk = function () {
                $scope.actionBtnHied = false;
                $mdDialog.hide();
            };

            $scope.actionBtnHied = false;
            // csrf token 을 받기 위한 ping
            common.apiPing();
            return dialog;
        };

        common.showCustomDialog = function ($scope, $event, dialogOptions) {
            $scope.error	= null;
            $scope.success	= null;

            if (!dialogOptions.dialogClassName) {
                dialogOptions.dialogClassName = "modal-dialog";
            }

            if (!dialogOptions.controller) {
                dialogOptions.controller = function ($scope, ValidationService) {
                    var vm = this;
                    vm.validationService = new ValidationService({controllerAs: vm});
                    if (_MODE_ == "DEBUG") console.log("popCommFormCtrl");
                };
            }

            if (!dialogOptions.controllerAs) {
                dialogOptions.controllerAs = "pop";
            }

            if (!dialogOptions.formName) {
                dialogOptions.formName = "dialogForm";
            }

            $scope.dialogOptions = dialogOptions;

            var optionsOrPreset = {
                controller: dialogOptions.controller,
                controllerAs: dialogOptions.controllerAs,
                templateUrl: dialogOptions.templateUrl + _VersionTimeTail(),
                parent: angular.element(document.body),
                autoWrap: true,
                targetEvent: $event,
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: false,
                escapeToClose: true,
                fullscreen: false,
                multiple: false,
                skipHide: true
            };

            var dialog	= $mdDialog.show(optionsOrPreset);

            if (!$scope.dialogOptions.popDialogOk) {
                $scope.dialogOptions.popDialogOk = function () {
                    $mdDialog.hide();
                };
            }

            if (!$scope.dialogOptions.popCancel) {
                $scope.dialogOptions.popCancel = function () {
                    $scope.actionBtnHied = false;
                    $mdDialog.cancel();
                };
            }

            if (!$scope.dialogOptions.popHide) {
                $scope.dialogOptions.popHide = function () {
                    $scope.actionBtnHied = false;
                    $mdDialog.hide();
                };
            }

            if (!$scope.dialogOptions.popAnswer) {
                $scope.dialogOptions.popAnswer = function (answer) {
                    $scope.actionBtnHied = false;
                    $mdDialog.hide(answer);
                };
            }

            $scope.actionBtnHied = false;
            // csrf token 을 받기 위한 ping
            common.apiPing();
            return dialog;
        };

        common.showLocalsDialog = function ($event, dialogOptions) {
            var optionsOrPreset = {
                controller: dialogOptions.controller,
                templateUrl: dialogOptions.templateUrl,
                parent: angular.element(document.body),
                autoWrap: true,
                targetEvent: $event,
                clickOutsideToClose: false,
                escapeToClose: true,
                fullscreen: false,
                multiple: true,
            };

            if (dialogOptions.locals) {
                optionsOrPreset.locals = dialogOptions.locals;
            }

            // csrf token 을 받기 위한 ping
            common.apiPing();
            return $mdDialog.show(optionsOrPreset);
        };

        /*공지사항 팝업 : 임시*/
        common.notice = function (obj, index){
            var noticeId = obj.id;
            var noticeTitle = obj.title;
            var noticeContent = obj.content.replace(/\n/g, "<br />");

            common.getTemplateHtml("views/common/popNotice.html" + _VersionTail(), function (templateHtml) {
                var width = 600;
                var height = 600;
                var left = screen.availLeft + index*40;    //(screen.width-width)/2;
                var top = screen.availTop + index*40;    //(screen.height-height)/2;
                var option = 'toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=no, top='+top+', left='+left+', width='+width+', height='+height;

                var objWin = window.open("", "notice"+noticeId, option);

                if(objWin == null){
                    if (!common.isLoginShowAlert) {
                        common.isLoginShowAlert	= true;
                        common.showAlertErrorHtml("팝업차단", "공지사항이 있습니다. <br>팝업차단을 해제해 주시기 바랍니다.").then(function () {
                            common.isLoginShowAlert = false;
                        });
                    }
                } else {
                    //이미 팝업창 띄워져 있는 경우 append 생략
                    if(objWin.document.body.innerText == "") {
                        templateHtml = templateHtml.replace("{{noticeTitle}}", noticeTitle);
                        templateHtml = templateHtml.replace("{{noticeContent}}", noticeContent);
                        templateHtml = templateHtml.replace(/{{noticeId}}/g, noticeId);
                        objWin.document.writeln(templateHtml);
                    }
                    objWin.focus();
                }
            });
        };

        // 파일 업로드 객체 생성
        common.initFileUploader = function (scope, uploader) {
            uploader.withCredentials = true;
            // CALLBACKS
            uploader.onWhenAddingFileFailed = function (item, filter, options) {
                if (_MODE_ == "DEBUG") console.log('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {
                if (_MODE_ == "DEBUG") console.log('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                if (_MODE_ == "DEBUG") console.log('onAfterAddingAll', addedFileItems);
            };

            uploader.onBeforeUploadItem = function (fileItem) {
                if (_MODE_ == "DEBUG") console.log('onBeforeUploadItem', fileItem);
                fileItem.percent = 0;
                fileItem.total = fileItem.file.size;
                fileItem.loaded = 0;
                scope.$broadcast('onBeforeUploadItem', fileItem);
            };
            uploader.onProgressItem = function (fileItem, percent, event) {
                if (_MODE_ == "DEBUG") console.log('onProgressItem', fileItem, percent, event);
                fileItem.percent = percent;
                fileItem.total = event.total;
                fileItem.loaded = event.loaded;
                scope.$broadcast('onProgressItem', fileItem);
            };
            uploader.onProgressAll = function (percent) {
                if (_MODE_ == "DEBUG") console.log('onProgressAll', percent);
                scope.$broadcast('onProgressAll', percent);
            };
            uploader.onSuccessItem = function (fileItem, data, status, headers) {
                if (_MODE_ == "DEBUG") console.log('onSuccessItem', fileItem, data, status, headers);
                fileItem.percent = 100;
                fileItem.total = fileItem.file.size;
                fileItem.loaded = fileItem.file.size;
                scope.$broadcast('onSuccessItem', fileItem, data, status, headers);
            };
            uploader.onErrorItem = function (fileItem, data, status, headers) {
                if (_MODE_ == "DEBUG") console.log('onErrorItem', fileItem, data, status, headers);
                scope.$broadcast('onErrorItem', fileItem, data, status, headers);
            };
            uploader.onCancelItem = function (fileItem, data, status, headers) {
                if (_MODE_ == "DEBUG") console.log('onCancelItem', fileItem, data, status, headers);
                scope.$broadcast('onCancelItem', fileItem, data, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, data, status, headers) {
                if (_MODE_ == "DEBUG") console.log('onCompleteItem', fileItem, data, status, headers);
                scope.$broadcast('onCompleteItem', fileItem, data, status, headers);
            };
            uploader.onCompleteAll = function () {
                if (_MODE_ == "DEBUG") console.log('onCompleteAll');
                scope.$broadcast('onCompleteAll');
            };
        };

        // 파일 업로드 객체 생성
        common.replaceFileUploader = function (uploader) {
            uploader.alias = "file";
            uploader.url	= "";
            uploader.withCredentials = true;

            uploader.filters	= [];
            // FILTERS
            // a sync filter
            uploader.filters.push({
                name: 'syncFilter',
                fn: function (item, options) {
                    return false;
                }
            });

            uploader.formData		= [];
            if (angular.isArray(uploader.queue) && uploader.queue.length > 0) {
                for (var i=uploader.queue.length-1; i >= 0; i--) {
                    if (!uploader.queue[i].isUploading) {
                        uploader.queue[i].remove();
                    }
                }
            }
        };

        common.setDefaultFileUploader = function ($scope, options) {
            var uploader = $scope.main.uploader;

            if (angular.isUndefined(options)) {
                options = {};
            }

            if (angular.isDefined(options.headers) && options.headers.length) {
                for(var key in options.headers) {
                    uploader.headers[key] = options.headers[key];
                }
            }
            if (angular.isDefined(options.formData)) {
                uploader.formData	= options.formData;
            }
            if (angular.isDefined(options.withCredentials)) {
                uploader.withCredentials = true;
            }
            uploader.filters    = [];

            if (options.filters && options.filters.length) {
                for (var i=0; i<options.filters.length; i++) {
                    uploader.filters.push(options.filters[i]);
                }
            }
            return uploader;
        };

        common.setSingleFileUploader = function ($scope, options) {
            var uploader = $scope.main.uploader;

            if (!angular.isUndefined(options)) {
                if (options.headers && options.headers.length) {
                    for(var key in options.headers) {
                        uploader.headers[key] = options.headers[key];
                    }
                }
                if (!angular.isUndefined(options.formData)) {
                    uploader.formData	= options.formData;
                }
                if (!angular.isUndefined(options.withCredentials)) {
                    uploader.withCredentials = true;
                }
            }

            uploader.filters    = [];

            // a sync filter
            uploader.filters.push({
                name: 'syncSingleFilter',
                fn: function (item) {
                    if (angular.isArray(uploader.queue) && uploader.queue.length > 0) {
                        for (var i=uploader.queue.length-1; i >= 0; i--) {
                            if (!uploader.queue[i].isUploading) {
                                uploader.queue[i].remove();
                            }
                        }
                    }
                    if (_MODE_ == "DEBUG") console.log("syncSingleFilter:", item);
                    return true;
                }
            });

            if (options.filters && options.filters.length) {
                for (var i=0; i<options.filters.length; i++) {
                    uploader.filters.push(options.filters[i]);
                }
            }

            return uploader;
        };

        common.uploadingItems = [];

        common.getUploadingItems = function () {
            return common.uploadingItems;
        };

        common.removeUploadingItem = function (fileItem) {
            var index = -1;
            for (var i=0; i<common.uploadingItems.length; i++) {
                if (common.uploadingItems[i].prefix == fileItem.prefix && common.uploadingItems[i].parentId == fileItem.parentId && common.uploadingItems[i].alias == fileItem.alias) {
                    index = i;
                    break;
                }
            };
            if (index > -1) {
                common.uploadingItems.splice(index, 1);
            }
            if (fileItem._input) fileItem._input.remove();
            if (fileItem._form) fileItem._form.remove();
            delete fileItem._form;
            delete fileItem._input;
        };

        common.fileUploadPush = function (fileItem) {
            var scope = common.getMainCtrlScope();
            fileItem.percent = 0;
            fileItem.total = fileItem.file.size;
            fileItem.loaded = 0;
            scope.$broadcast('onBeforeUploadItem', fileItem);
            common.uploadingItems.push(fileItem);
            var returnPromise = common.retrieveResourcePromise(fileItem.url, fileItem.method, {osImageFile: fileItem._file}, null, "multipart/form-data", null, _UPLOAD_POST_TIMEOUT_);
            returnPromise.success(function (data, status, headers) {
                if (_MODE_ == "DEBUG") console.log('onSuccessItem', fileItem, data, status, headers);
                fileItem.percent = 100;
                fileItem.total = fileItem.file.size;
                fileItem.loaded = fileItem.file.size;
                scope.$broadcast('onSuccessItem', fileItem, data, status, headers);
                common.removeUploadingItem(fileItem);
            });
            returnPromise.progress(function (progress) {
                if (_MODE_ == "DEBUG") console.log('onProgressItem', fileItem, progress);
                fileItem.percent = progress.percent;
                fileItem.total = progress.total;
                fileItem.loaded = progress.loaded;
                scope.$broadcast('onProgressItem', fileItem);
                if (progress.percent == 100) {
                    scope.$broadcast('onPushedItem', fileItem);
                }
            });
            returnPromise.error(function (data, status, headers) {
                if (_MODE_ == "DEBUG") console.log('onErrorItem', fileItem, data, status, headers);
                fileItem.percent = 0;
                fileItem.total = fileItem.file.size;
                fileItem.loaded = 0;
                scope.$broadcast('onErrorItem', fileItem, data, status, headers);
                common.removeUploadingItem(fileItem);
            });
        };

        common.singlefileUploadCancel = function (fileItem) {
            fileItem.cancel();
        };

        common.singleFileUploadPush = function (fileItem) {
            //common.syncPing();
            //fileItem.url = common.getApiServerUrl() + fileItem.url;
            if (common.xsrfToken) {
                fileItem.headers[_CSRF_TOKEN_HEADER_NAME_] = common.xsrfToken;
            }
            fileItem.timeout = 3600000;
            fileItem.withCredentials = true;
            fileItem.upload();
        };

        common.multFileUploadPush = function (uploader, options) {
            uploader.url = options.url;
            if (common.xsrfToken) {
                uploader.headers[_CSRF_TOKEN_HEADER_NAME_] = common.xsrfToken;
            }
            uploader.withCredentials = true;
            uploader.formData = [];
            if (!angular.isUndefined(options)) {
                if (!angular.isUndefined(options.formData)) {
                    uploader.formData.push(options.formData);
                }
            }

            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                if (angular.isFunction(options.callbackFun)) {
                    options.callbackFun(fileItem, response, status, headers);
                }
            };

            if (angular.isArray(uploader.queue) && uploader.queue.length > 0) {
                angular.forEach(uploader.queue, function (item) {
                    item.url = uploader.url;
                    item.headers = uploader.headers;
                    item.formData = uploader.formData;
                    item.timeout = _UPLOAD_POST_TIMEOUT_;
                    item.withCredentials = uploader.withCredentials;
                });
                uploader.uploadAll();
            }
        };

        common.multipartFileUpload = function(uploadUrl, method, file){
            var formData = new FormData();
            formData.append('file', file);
            var config = {
                method: method,
                url: uploadUrl,
                formData: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                transformRequest: angular.identity
            };
            if (common.xsrfToken) {
                config.headers[_CSRF_TOKEN_HEADER_NAME_] = common.xsrfToken;
            }
            return $http(config);
        };

        // TemplateHtml 가저오기
        common.getTemplateHtml = function (templateUrl, callBackFunc, errCallBackFunc) {
            $http.get(templateUrl).success(function (data, status, headers, config) {
                if (angular.isFunction(callBackFunc)) {
                    callBackFunc(data);
                }
            }).error(function (data, status, headers, config) {
                if (angular.isFunction(errCallBackFunc)) {
                    errCallBackFunc(data);
                }
            });
        };

        common.getFileMinType = function (type) {
            if (CONSTANTS.minTypes[type]) {
                return CONSTANTS.minTypes[type]
            } else {
                return CONSTANTS.defaultMinType
            }
        };

        common.removeTag = function removeTag(str) {
            return str.replace(/(<([^>]+)>)/gi, "");
        };

        common.setUserInfo = function (userInfo) {
            cache.setUser(userInfo);
            common.getMainCtrlScope().main.userInfo = userInfo;
        };

        common.clearUser = function () {
            cache.clearUser();
            common.getMainCtrlScope().main.userInfo = {};
        };

        common.getUserInfo = function () {
            return cache.getUser();
        };

        /*권한조회(A/B/M/O/U : 관리자/마케팅관리자/기업관리자/조직관리자/일반사용자*/
        common.getUserAuth = function () {
            var sAuth = "U";
            var userInfo = common.getUserInfo();
            if(userInfo){
                if (userInfo.uaaAdmin) {
                    sAuth = "A";
                } else if (userInfo.companyAdmin) {
                    sAuth = "B";
                } else if (userInfo.manager) {
                    sAuth = "M";
                }
                if(userInfo.scope){
                    if(userInfo.scope.indexOf("company.admin") > -1){
                        sAuth = "A";
                    }else if (userInfo.scope.indexOf("uaaXpert.admin") > -1) {
                        sAuth = "B";
                    }else if(userInfo.scope.indexOf("company.manager") > -1){
                        sAuth = "M";
                    }
                }
            } else {
                sAuth = "";
            }
            return sAuth;
        };

        common.clearAccessInfo = function () {
            cookies.clearUser();
        };

        common.getAnsibleEdit = function () {
            return cookies.getAnsibleEdit();
        };

        common.setAnsibleEdit = function (ansibleEdit) {
            cookies.setAnsibleEdit(ansibleEdit);
        };

        common.clearAnsibleEdit = function () {
            cookies.clearAnsibleEdit();
        };

        common.isAuthenticated = function () {
            return (cookies.getUser() != null && cookies.getUser().email != "");
        };

        common.logout = function () {
            common.clearUserAll();
            // 부모창이 있으면 부모창 로그아웃하고 내 창 닫기
            if ($window.opener && $window.opener.document
                && $window.opener.document.domain
                && $window.document.domain == $window.opener.document.domain ) {
                $window.opener.location.href = "/#/login";
                $window.close();
            } else {
                common.moveLoginState();
            }
        };

        common.clearUserAll = function () {
            cookies.logoutClear();
            common.clearUser();
        };

        common.clearAll = function () {
            cookies.logoutClear();
            cache.clearAll();
        };

        common.sortAscByString = function (strings) {
            strings.sort(function (a, b) {
                var strA = a.toUpperCase();
                var strB = b.toUpperCase();
                if (strA < strB) {
                    return -1;
                }
                if (strA > strB) {
                    return 1;
                }
                return 0;
            });
            return strings;
        };

        common.sortAscByNumber = function (numbers) {
            numbers.sort(function (a, b) {
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });
            return numbers;
        };

        common.sortDescByString = function (strings) {
            strings.sort(function (a, b) {
                var strA = a.toUpperCase();
                var strB = b.toUpperCase();
                if (strA > strB) {
                    return -1;
                }
                if (strA < strB) {
                    return 1;
                }
                return 0;
            });
            return strings;
        };

        common.sortDescByNumber = function (numbers) {
            numbers.sort(function (a, b) {
                if (a > b) {
                    return -1;
                }
                if (a < b) {
                    return 1;
                }
                return 0;
            });
            return numbers;
        };

        // 필드 기준 Asc 정렬 (필드가 String 일때) 1차 일때 fieldName2 생략
        common.sortObjectsAscByStringField = function (objects, fieldName1, fieldName2) {
            objects.sort(function (a, b) {
                var strA = (fieldName2) ?  a[fieldName1][fieldName2].toUpperCase() : a[fieldName1].toUpperCase();
                var strB = (fieldName2) ?  b[fieldName1][fieldName2].toUpperCase() : b[fieldName1].toUpperCase();
                if (strA < strB) {
                    return -1;
                }
                if (strA > strB) {
                    return 1;
                }
                return 0;
            });
            return objects;
        };

        // 필드 기준 Desc 정렬 (필드가 String 일때) 1차 일때 fieldName2 생략
        common.sortObjectsDescByStringField = function (objects, fieldName1, fieldName2) {
            objects.sort(function (a, b) {
                var strA = (fieldName2) ?  a[fieldName1][fieldName2].toUpperCase() : a[fieldName1].toUpperCase();
                var strB = (fieldName2) ?  b[fieldName1][fieldName2].toUpperCase() : b[fieldName1].toUpperCase();
                if (strA > strB) {
                    return -1;
                }
                if (strA < strB) {
                    return 1;
                }
                return 0;
            });
            return objects;
        };

        // 필드 기준 Asc 정렬 (필드가 Number 일때) 1차 일때 fieldName2 생략
        common.sortObjectsAscByNumberField = function (objects, fieldName1, fieldName2) {
            objects.sort(function (a, b) {
                var numA = (fieldName2) ?  a[fieldName1][fieldName2] : a[fieldName1];
                var numB = (fieldName2) ?  b[fieldName1][fieldName2] : b[fieldName1];
                if (numA < numB) {
                    return -1;
                }
                if (numA > numB) {
                    return 1;
                }
                return 0;
            });
            return objects;
        };

        // 필드 기준 Desc 정렬 (필드가 Number 일때) 1차 일때 fieldName2 생략
        common.sortObjectsDescByNumberField = function (objects, fieldName1, fieldName2) {
            objects.sort(function (a, b) {
                var numA = (fieldName2) ?  a[fieldName1][fieldName2] : a[fieldName1];
                var numB = (fieldName2) ?  b[fieldName1][fieldName2] : b[fieldName1];
                if (numA > numB) {
                    return -1;
                }
                if (numA < numB) {
                    return 1;
                }
                return 0;
            });
            return objects;
        };

        common.objectsSetAllIsEmptyDefaultValueByField = function (objects, fieldName, value) {
            if (!angular.isArray(objects)) return objects;
            for (var i=0; i<objects.length; i++) {
                if (!objects[i][fieldName]) {
                    objects[i][fieldName] = value
                }
            }
            return objects;
        };

        common.objectsSetAllValueByField = function (objects, fieldName, value) {
            if (!angular.isArray(objects)) return objects;
            for (var i=0; i<objects.length; i++) {
                objects[i][fieldName] = value
            }
            return objects;
        };

        common.objectsFindListByField = function (objects, fieldName, value) {
            if (!angular.isArray(objects)) return null;
            var results = [];
            for (var i=0; i<objects.length; i++) {
                if (objects[i][fieldName] == value) {
                    results.push(objects[i]);
                }
            }
            return results;
        };

        common.objectsFindListCopyByField = function (objects, fieldName, value) {
            var results = common.objectsFindListByField(objects, fieldName, value);
            if (angular.isArray(results)) {
                return angular.copy(results);
            } else {
                return results;
            }
        };

        common.objectsFindChangeByField = function (objects, fieldName, value, changeObject) {
            if (!angular.isArray(objects)) return null;
            for (var i=0; i<objects.length; i++) {
                if (objects[i][fieldName] == value) {
                    objects[i] = changeObject;
                    return;
                }
            }
        };

        common.objectsFindByField = function (objects, fieldName, value) {
            if (!angular.isArray(objects)) return null;
            for (var i=0; i<objects.length; i++) {
                if (objects[i][fieldName] == value) {
                    return objects[i];
                }
            }
            return null;
        };

        common.objectsFindByFieldToFieldValue = function (objects, fieldName, value, rtnFieldName) {
            var findObject = common.objectsFindByField(objects, fieldName, value);
            if (angular.isObject(findObject) && findObject[fieldName]) {
                return findObject[rtnFieldName];
            }
            return null;
        };

        common.objectsFindCopyByField = function (objects, fieldName, value) {
            var obj = common.objectsFindByField(objects, fieldName, value);
            if (angular.isObject(obj)) {
                return angular.copy(obj);
            } else {
                return obj;
            }
        };

        common.objectOrArrayMergeData = function (target, source) {
            if (angular.isArray(target)) {
                if (angular.isArray(source)) {
                    if (target.length > source.length) {
                        target.splice(source.length, target.length - source.length);
                    }
                    for (var i=0; i<source.length; i++) {
                        if (angular.isArray(target[i]) || angular.isObject(target[i])) {
                            common.objectOrArrayMergeData(target[i], source[i]);
                        } else {
                            target[i] = source[i];
                        }
                    }
                } else {
                    target = source;
                }
            } else if (angular.isObject(target)) {
                if (angular.isObject(source)) {
                    angular.forEach(target, function (item, key) {
                        if (angular.isUndefined(source[key])) {
                            delete target[key];
                        }
                    });
                    angular.forEach(source, function (value, key) {
                        if (angular.isArray(target) || angular.isObject(source)[key]) {
                            if (angular.isArray(target[key]) && angular.isArray(target[target[key]])) {
                                common.objectOrArrayMergeData(target[key], value);
                            } else {
                                target[key] = value;
                            }
                        } else {
                            target[key] = value;
                        }
                    });
                } else {
                    target = source;
                }
            } else {
                target = source;
            }
        };

        common.getProcessBar = function (amt) {
            var obj = {};
            obj.countTo = amt;
            obj.countFrom = 0;
            obj.progressValue = amt;
            return obj;
        };

        common.getProcessPercentBar = function (total, usage) {
            var amt = 0;
            if (total > 0) {
                amt = parseInt(usage*100/total);
            }
            return common.getProcessBar(amt);
        };

        common.getPageDatas = function (datas, pageOptions) {
            var pageDatas = [];
            var start = pageOptions.pageSize * (pageOptions.currentPage - 1);
            var count = 0;
            for (var i=start; i<datas.length; i++) {
                pageDatas.push(datas[i]);
                count++;
                if (count >= pageOptions.pageSize) {
                    break;
                }
            }
            return pageDatas;
        };

        common.tooltip = function () {
            $timeout(function () {
                $(document).ready(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                });
            }, 200);
        };

        common.copyToClipboard = function (clipboard) {
            if (clipboard) {
                var $temp_input = $("<input>");
                $("body").append($temp_input);
                $temp_input.val(clipboard).select();
                document.execCommand("copy");
                $temp_input.remove();
            }
        };

        /** STOMP WEB SOCKET **/
        common.stompSubscribeFuns = {};
        common.stompSubscribes = {};
        common.stompSendFuns = [];

        common.stompConnect = function () {
            if (!common.stompClient) {
                common.stompClient = Stomp.client("ws://" + _DOMAIN_ + CONSTANTS.stompConnectPath);
                common.stompClient.debug = true;
            }
            if (!common.stompClientConnectting && !common.stompClientConnected) {
                common.stompClientConnectting = true;
                common.stompClient.connect({}, function(frame) {
                    console.log('Stomp Connected: ' + frame);
                    common.stompClientConnectting = false;
                    common.stompClientConnected = true;
                    angular.forEach(common.stompSubscribes, function (stompSubscribeFun) {
                        if (angular.isFunction(stompSubscribeFun)) {
                            stompSubscribeFun();
                        }
                    });
                    angular.forEach(common.stompSendFuns, function (stompSendFun) {
                        if (angular.isFunction(stompSendFun)) {
                            stompSendFun();
                        }
                    });
                    common.stompSendFuns = []
                }, function(message) {
                    if (_MODE_ == 'DEBUG') console.log('Stomp Connected Error: ' + message);
                    delete common.stompClient;
                    common.stompClientConnectting = false;
                    common.stompClientConnected = false;
                }, function(closeEvent) {
                    if (_MODE_ == 'DEBUG') console.log('Stomp Connected Close: ' + closeEvent);
                    delete common.stompClient;
                    common.stompClientConnectting = false;
                    common.stompClientConnected = false;
                });
            }
        };

        common.stompDisconnect = function () {
            if (common.stompClient) {
                common.stompClient.disconnect();
            }
        };

        // 서버에서 보내주는 메시지를 받는 Listener 추가
        common.appendStompSubscribe = function (fullPath, callback, headers) {
            return common.stompClient.subscribe(fullPath, function(response){
                if (angular.isFunction(callback)) {
                    callback(JSON.parse(response));
                }
                if (_MODE_ == 'DEBUG') console.log(JSON.parse(response));
            }, headers);
        };

        common.stompSubscribe = function (path, callback, headers) {
            var fullPath = '/topic' + path;
            if (common.stompClientConnectting) {
                if (!common.stompSubscribeFuns[fullPath] && !common.stompSubscribes[fullPath]) {
                    common.stompSubscribeFuns[fullPath] = function () {
                        common.stompSubscribes[fullPath] = common.appendStompSubscribe(fullPath, callback, headers);
                    };
                }
            } else {
                if (!common.stompClientConnected) {
                    if (!common.stompSubscribeFuns[fullPath] && !main.stompSubscribes[fullPath]) {
                        common.stompSubscribeFuns[fullPath] = function () {
                            common.stompSubscribes[fullPath] = common.appendStompSubscribe(fullPath, callback, headers);
                        };
                    }
                    common.stompConnect();
                } else {
                    common.stompSubscribes[fullPath] = common.appendStompSubscribe(fullPath, callback, headers);
                }
            }
        };

        common.stompUnsubscribe = function (path) {
            var fullPath = '/topic' + path;
            if (common.stompSubscribes[fullPath]) {
                if (angular.isObject(common.stompSubscribes[fullPath]) && common.stompSubscribes[fullPath].id && angular.isFunction(common.stompSubscribes[fullPath].unsubscribe)) {
                    common.stompSubscribes[fullPath].unsubscribe({});
                }
                delete common.stompSubscribes[fullPath];
                if (common.stompSubscribeFuns[fullPath]) delete common.stompSubscribeFuns[fullPath];
            }
        };

        common.sendStompWebsocket = function (path, params) {
            var fullPath = '/app' + path;
            if (common.stompClientConnectting) {
                common.stompSendFuns.push(function () {
                    common.stompClient.send("/app" + fullPath, {}, JSON.stringify(params));
                });
            } else {
                if (!common.stompClientConnected) {
                    common.stompSendFuns.push(function () {
                        common.stompClient.send("/app" + fullPath, {}, JSON.stringify(params));
                    });
                    common.stompConnect();
                } else {
                    common.stompClient.send("/app" + fullPath, {}, JSON.stringify(params));
                }
            }
        };
        /** STOMP WEB SOCKET **/

        return common;
    })
    .factory('cache', function (localStorageService) {

        var cache = {};

        cache.getStorage = function (key) {
            return localStorageService.get(key);
        };
        cache.setStorage = function (key, data) {
            localStorageService.add(key, data);
        };
        cache.removeStorage = function (key) {
            localStorageService.remove(key);
        };

        cache.getStorageJson = function (key) {
            return JSON.parse(localStorageService.get(key));
        };
        cache.setStorageJson = function (key, data) {
            localStorageService.add(key, JSON.stringify(data));
        };

        cache.getLanguageKey = function () {
            return localStorageService.get(_LANGUAGE_KEY_CASHE_NAME_);
        };

        cache.setLanguageKey = function (languageKey) {
            localStorageService.add(_LANGUAGE_KEY_CASHE_NAME_, languageKey);
        };

        cache.setUser = function (userInfo) {
            localStorageService.add(_USER_INFO_CASHE_NAME_, JSON.stringify(userInfo));
        };

        cache.getUser = function () {
            return JSON.parse(localStorageService.get(_USER_INFO_CASHE_NAME_));
        };

        cache.clearUser = function () {
            localStorageService.remove(_USER_INFO_CASHE_NAME_);
        };

        cache.setLeftMenuShow = function (show) {
            if (show)	{
                localStorageService.add(_LEFT_MENU_SHOW_CASHE_NAME_, "Y");
            } else {
                localStorageService.add(_LEFT_MENU_SHOW_CASHE_NAME_, "N");
            }
        };

        cache.clearAll = function () {
            localStorageService.clearAll();
        };

        return cache;
    })
    .factory('cookies', function ($cookies) {
        var cookies = {};
        var cookiesOption = {path: _COOKIES_PATH_};

        cookies.getLanguageKey = function () {
            return $cookies.get(_LANGUAGE_KEY_COOKIE_NAME_);
        };

        cookies.setLanguageKey = function (languageKey) {
            $cookies.put(_LANGUAGE_KEY_COOKIE_NAME_, languageKey, cookiesOption);
        };

        cookies.setUser = function (userInfo) {
            $cookies.put(_USER_INFO_COOKIE_NAME_, JSON.stringify(userInfo), cookiesOption);
        };

        cookies.getUser = function () {
            if ($cookies.get(_USER_INFO_COOKIE_NAME_)) {
                return JSON.parse($cookies.get(_USER_INFO_COOKIE_NAME_));
            } else {
                return null;
            }
        };

        cookies.clearUser = function () {
            $cookies.remove(_USER_INFO_COOKIE_NAME_, cookiesOption);
        };

        cookies.getAnsibleEdit = function () {
            return $cookies.get(_ANSIBLE_EDIT_COOKIE_NAME_);
        };

        cookies.setAnsibleEdit = function (languageKey) {
            $cookies.put(_ANSIBLE_EDIT_COOKIE_NAME_, languageKey, cookiesOption);
        };

        cookies.clearAnsibleEdit = function () {
            $cookies.remove(_ANSIBLE_EDIT_COOKIE_NAME_, cookiesOption);
        };

        cookies.getLeftMenuShow = function () {
            return $cookies.get(_LEFT_MENU_SHOW_COOKIE_NAME_);
        };

        cookies.setLeftMenuShow = function (show) {
            if (show)	{
                $cookies.put(_LEFT_MENU_SHOW_COOKIE_NAME_, "Y", cookiesOption);
            } else {
                $cookies.put(_LEFT_MENU_SHOW_COOKIE_NAME_, "N", cookiesOption);
            }
        };

        cookies.logoutClear = function () {
            cookies.clearUser();
        };

        return cookies;
    })
    .factory('HttpInterceptor', function ($q) {
        var HttpInterceptor = {
            request: function(config) {
                return config;
            },
            response: function(response) {
                return response;
            },
            progress: function(evt) {
                return evt;
            },
            responseError: function(rejection) {
                if (_MODE_ == 'DEBUG') console.error(rejection);
                return $q.reject(rejection);
            }
        };
        return HttpInterceptor;
    })
;
