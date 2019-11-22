'use strict';

angular.module('app', [
    , 'common.controllers'
    , 'common.services'
    , 'ngRoute'
    , 'oc.lazyLoad'
    , 'ui.router'
    , 'ui.bootstrap'
    , 'ngCookies'
    , 'ngSanitize'
    , 'ngAnimate'
    , 'ngMaterial'
    , 'ngTouch'
    , 'ngResource'
    , 'ghiscoding.validation'
    , 'pascalprecht.translate'
    , 'angularFileUpload'
    , 'angular-loading-bar'
    , 'angular-growl'
    , 'bytes-validator'
    , 'bw.paging'
    //, 'ngStomp'
    //, 'nvd3'
    //, 'chart.js'
    //, 'ADM-dateTimePicker' , 'ui.select2', 'countTo', 'rzModule', 'chart.js', 'slickCarousel', 'nvd3'
    // , 'scrollable-table', 'dndLists', 'Tek.progressBar', 'ui.sortable', 'ngJScrollPane', 'checklist-model'
])
    .config(['$httpProvider', '$stateProvider', '$urlRouterProvider','$ocLazyLoadProvider', '$translateProvider', 'CONSTANTS', 'LOADFILES', 'SITEMAP',
        function ($httpProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $translateProvider, CONSTANTS, LOADFILES, SITEMAP) {

            if (_MODE_ == "DEBUG") console.log('app.js : commonApp');

            var loadModuleNames = [];
            var modules = angular.copy(LOADFILES.modules);

            if (angular.isArray(LOADFILES.scriptFiles) && LOADFILES.scriptFiles.length > 0) {
                angular.forEach(LOADFILES.scriptFiles, function (scriptFile, key) {
                    if (angular.isArray(scriptFile.files) && scriptFile.files.length > 0) {
                        angular.forEach(scriptFile.files, function (file, k) {
                            scriptFile.files[k] = file + _VERSION_TAIL_HEAD_;
                            scriptFile.cache = (_MODE_ == 'DEBUG') ? false : true;
                        });
                    }
                });
            }

            if (angular.isArray(LOADFILES.customModules) && LOADFILES.customModules.length > 0) {
                angular.forEach(LOADFILES.customModules, function (customModule, key) {
                    if (angular.isArray(customModule.files) && customModule.files.length > 0) {
                        angular.forEach(customModule.files, function (file, k) {
                            customModule.files[k] = file + _VERSION_TAIL_HEAD_;
                            customModule.cache = (_MODE_ == 'DEBUG') ? false : true;
                        });
                    }
                    modules.push(customModule);
                });
            }

            if (angular.isArray(modules) && modules.length > 0) {
                angular.forEach(modules, function (loadModule, key) {
                    loadModuleNames.push(loadModule.name);
                });
            }


            $ocLazyLoadProvider.config({
                debug: (_MODE_ == "DEBUG") ? true : false,
                events: true,
                // 로드 할 모듈 정의
                modules: modules
            });

            $httpProvider.defaults.useXDomain = true;
            $httpProvider.defaults.withCredentials = true;
            $httpProvider.defaults.xsrfCookieName = _CSRF_TOKEN_COOKIE_NAME_;
            $httpProvider.defaults.xsrfHeaderName = _CSRF_TOKEN_HEADER_NAME_;
            $httpProvider.interceptors.push('HttpInterceptor');

            var initInjector = angular.injector(["ng"]);

            var $http = initInjector.get("$http");
            $http.defaults.useXDomain = true;
            $http.defaults.withCredentials = true;
            $http.defaults.xsrfCookieName = _CSRF_TOKEN_COOKIE_NAME_;
            $http.defaults.xsrfHeaderName = _CSRF_TOKEN_HEADER_NAME_;

            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            $urlRouterProvider.otherwise('/');

            function setState(option) {
                var mainContents	= {};
                if (option.controller) {
                    mainContents.controller	    = option.controller;
                    mainContents.controllerAs	= (option.controllerAs) ? option.controllerAs : "contents";
                }

                if (option.templateUrl) {
                    mainContents.templateUrl	= option.templateUrl;
                }

                var pageStage = option.pageStage ? option.pageStage : "comm";
                var mainBody = {
                    templateUrl: CONSTANTS.mainBody.templateUrl + _VersionTail(),
                    controller: CONSTANTS.mainBody.controller,
                    controllerAs: CONSTANTS.mainBody.controllerAs,
                    resolve: {
                        pageStage: function () {
                            return pageStage
                        }
                    }
                };

                if (angular.isObject(option.loadMyFile)) {
                    if (angular.isArray(option.loadMyFile.loadMyScripts)) {
                        var loadMyFiles = [];
                        angular.forEach(option.loadMyFile.loadMyScripts, function (name, key) {
                            if (angular.isArray(LOADFILES.scriptFiles[name])) {
                                loadMyFiles.push(LOADFILES.scriptFiles[name]);
                            } else {
                                loadMyFiles.push(name);
                            }
                        });
                        mainBody.resolve.loadMyFile = ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({files: loadMyFiles, cache: ((_DEBUG_LEVEL_ >= 3) ? false : true)});
                        }];
                    }

                    if (angular.isArray(option.loadMyFile.loadMyServices)) {
                        mainBody.resolve.loadMyService = ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({name: 'common.services', files: option.loadMyFile.loadMyServices, cache: ((_DEBUG_LEVEL_ >= 3) ? false : true)});
                        }]
                    }

                    if (angular.isArray(option.loadMyFile.loadMyControllers)) {
                        mainBody.resolve.loadMyCtrl = ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({name: 'common.controllers', files: option.loadMyFile.loadMyControllers, cache: ((_DEBUG_LEVEL_ >= 3) ? false : true)});
                        }]
                    }

                    if (angular.isArray(option.loadMyFile.loadMyDirectives)) {
                        mainBody.resolve.loadMyDirective = ['$ocLazyLoad', function($ocLazyLoad) {
                            var providerFiles = [];
                            angular.forEach(option.loadMyFile.loadMyDirectives, function (name, key) {
                                var moduleConfig = null;
                                if (angular.isString(name)) {
                                    moduleConfig = $ocLazyLoad.getModuleConfig(name);
                                    if (!moduleConfig || !moduleConfig.name) {
                                        moduleConfig = $ocLazyLoad.getModuleConfig('app');
                                        if (!moduleConfig || !moduleConfig.name) {
                                            moduleConfig = {name: 'app', files: [name]}
                                        } else {
                                            if (moduleConfig.files.indexOf(name) == -1) {
                                                moduleConfig.files.push(name);
                                            }
                                        }
                                        $ocLazyLoad.setModuleConfig(moduleConfig);
                                        option.loadMyFile.loadMyDirectives[key] = moduleConfig.name
                                    }
                                } else if (angular.isObject(name)) {
                                    moduleConfig = angular.copy(name);
                                    if (!$ocLazyLoad.getModuleConfig(moduleConfig.name)) {
                                        $ocLazyLoad.setModuleConfig(moduleConfig);
                                        option.loadMyFile.loadMyDirectives[key] = moduleConfig.name
                                    }
                                }
                                if (moduleConfig && moduleConfig.provider) {
                                    providerFiles.push(moduleConfig.provider);
                                }
                            });
                            return $ocLazyLoad.load(option.loadMyFile.loadMyDirectives)
                                .then(function() {
                                    if (providerFiles.length > 0) {
                                        $ocLazyLoad.load({name: 'app', files: providerFiles}).then(function() {
                                        });
                                    }
                                });
                        }]
                    }
                }

                if (option.mainBodyTemplateUrl) {
                    mainBody.templateUrl = option.mainBodyTemplateUrl;
                }

                var views = { "mainBody" : mainBody };

                $stateProvider.state(option.stateKey, { url: option.url, views: views } );
                return mainContents;
            };

            function setParentMergeMyFiles (parentFiles, childrenFiles) {
                if (angular.isArray(parentFiles)) {
                    var loadMyFiles = angular.copy(parentFiles);
                    if (angular.isArray(childrenFiles)) {
                        angular.forEach(childrenFiles, function(loadFile, key) {
                            if (angular.isString(loadFile)) {
                                if (loadModuleNames.indexOf(loadFile) == -1) {
                                    loadMyFiles.push(loadFile + _VERSION_TAIL_HEAD_);
                                } else {
                                    loadMyFiles.push(loadFile);
                                }
                            } else if (angular.isObject(loadFile) && angular.isArray(loadFile.files)) {
                                if (loadFile.files.length > 0) {
                                    angular.forEach(loadFile.files, function (file, k) {
                                        loadFile.files[k] = file + _VERSION_TAIL_HEAD_;
                                    });
                                }
                                loadMyFiles.push(loadFile);
                            }
                        });
                    }
                    return loadMyFiles;
                } else {
                    if (angular.isArray(childrenFiles)) {
                        return childrenFiles
                    } else {
                        return [];
                    }
                }
            }

            angular.forEach(SITEMAP.pages, function(option, key) {
                option.pageStage = (option.pageStage) ? option.pageStage : "comm";
                if (option.url && option.stateKey) {
                    SITEMAP.pages[key].url = option.url;
                    SITEMAP.pages[key].contentsView = setState(option);
                }
            });

            angular.forEach(SITEMAP.contentsMenus, function(mainOption, mainKey) {
                mainOption.pageStage = (mainOption.pageStage) ? mainOption.pageStage : "comm";
                if(!angular.isObject(mainOption.loadMyFile)) mainOption.loadMyFile = {};
                mainOption.loadMyFile.loadMyFiles = setParentMergeMyFiles([], mainOption.loadMyFile.loadMyFiles);
                mainOption.loadMyFile.loadMyServices = setParentMergeMyFiles([], mainOption.loadMyFile.loadMyServices);
                mainOption.loadMyFile.loadMyControllers = setParentMergeMyFiles([], mainOption.loadMyFile.loadMyControllers);
                mainOption.loadMyFile.loadMyDirectives = setParentMergeMyFiles([], mainOption.loadMyFile.loadMyDirectives);
                angular.forEach(mainOption.menus, function(option, key) {
                    option.pageStage = (option.pageStage) ? option.pageStage : mainOption.pageStage;
                    if(!angular.isObject(option.loadMyFile)) option.loadMyFile = {};
                    option.loadMyFile.loadMyFiles = setParentMergeMyFiles(mainOption.loadMyFile.loadMyFiles, option.loadMyFile.loadMyFiles);
                    option.loadMyFile.loadMyServices = setParentMergeMyFiles(mainOption.loadMyFile.loadMyServices, option.loadMyFile.loadMyServices);
                    option.loadMyFile.loadMyControllers = setParentMergeMyFiles(mainOption.loadMyFile.loadMyControllers, option.loadMyFile.loadMyControllers);
                    option.loadMyFile.loadMyDirectives = setParentMergeMyFiles(mainOption.loadMyFile.loadMyDirectives, option.loadMyFile.loadMyDirectives);
                    if (option.url && option.stateKey) {
                        SITEMAP.contentsMenus[mainKey].menus[key].contentsView = setState(option);
                    }
                    angular.forEach(option.subPages, function(subPageOption, subPageKey) {
                        subPageOption.pageStage = (subPageOption.pageStage) ? subPageOption.pageStage : option.pageStage;
                        if(!angular.isObject(option.loadMyFile)) option.loadMyFile = {};
                        if(!angular.isObject(subPageOption.loadMyFile)) subPageOption.loadMyFile = {};
                        subPageOption.loadMyFile.loadMyFiles = setParentMergeMyFiles(option.loadMyFile.loadMyFiles, subPageOption.loadMyFile.loadMyFiles);
                        subPageOption.loadMyFile.loadMyServices = setParentMergeMyFiles(option.loadMyFile.loadMyServices, subPageOption.loadMyFile.loadMyServices);
                        subPageOption.loadMyFile.loadMyControllers = setParentMergeMyFiles(option.loadMyFile.loadMyControllers, subPageOption.loadMyFile.loadMyControllers);
                        subPageOption.loadMyFile.loadMyDirectives = setParentMergeMyFiles(option.loadMyFile.loadMyDirectives, subPageOption.loadMyFile.loadMyDirectives);
                        if (subPageOption.url && subPageOption.stateKey) {
                            SITEMAP.contentsMenus[mainKey].menus[key].subPages[subPageKey].contentsView = setState(subPageOption);
                        }
                    });
                    angular.forEach(option.subMenus, function(subMenuOption, subMenuKey) {
                        subMenuOption.pageStage = (subMenuOption.pageStage) ? subMenuOption.pageStage : option.pageStage;
                        if(!angular.isObject(option.loadMyFile)) option.loadMyFile = {};
                        if(!angular.isObject(subMenuOption.loadMyFile)) subMenuOption.loadMyFile = {};
                        subMenuOption.loadMyFile.loadMyFiles = setParentMergeMyFiles(option.loadMyFile.loadMyFiles, subMenuOption.loadMyFile.loadMyFiles);
                        subMenuOption.loadMyFile.loadMyServices = setParentMergeMyFiles(option.loadMyFile.loadMyServices, subMenuOption.loadMyFile.loadMyServices);
                        subMenuOption.loadMyFile.loadMyControllers = setParentMergeMyFiles(option.loadMyFile.loadMyControllers, subMenuOption.loadMyFile.loadMyControllers);
                        subMenuOption.loadMyFile.loadMyDirectives = setParentMergeMyFiles(option.loadMyFile.loadMyDirectives, subMenuOption.loadMyFile.loadMyDirectives);
                        if (subMenuOption.url && subMenuOption.stateKey) {
                            SITEMAP.contentsMenus[mainKey].menus[key].subMenus[subMenuKey].contentsView = setState(subMenuOption);
                        }
                        angular.forEach(subMenuOption.subPages, function(subPageOption, subPageKey) {
                            subPageOption.pageStage = (subPageOption.pageStage) ? subPageOption.pageStage : subMenuOption.pageStage;
                            if(!angular.isObject(subPageOption.loadMyFile)) subPageOption.loadMyFile = {};
                            subPageOption.loadMyFile.loadMyFiles = setParentMergeMyFiles(subMenuOption.loadMyFile.loadMyFiles, subPageOption.loadMyFile.loadMyFiles);
                            subPageOption.loadMyFile.loadMyServices = setParentMergeMyFiles(subMenuOption.loadMyFile.loadMyServices, subPageOption.loadMyFile.loadMyServices);
                            subPageOption.loadMyFile.loadMyControllers = setParentMergeMyFiles(subMenuOption.loadMyFile.loadMyControllers, subPageOption.loadMyFile.loadMyControllers);
                            subPageOption.loadMyFile.loadMyDirectives = setParentMergeMyFiles(subMenuOption.loadMyFile.loadMyDirectives, subPageOption.loadMyFile.loadMyDirectives);
                            if (subPageOption.url && subPageOption.stateKey) {
                                SITEMAP.contentsMenus[mainKey].menus[key].subMenus[subMenuKey].subPages[subPageKey].contentsView = setState(subPageOption);
                            }
                        });
                    });
                });
            });

            var translateFiles = [];

            translateFiles.push({
                prefix: 'js/locales/locale-',
                suffix: '.json' + _VERSION_TAIL_
            });
            translateFiles.push({
                prefix: 'js/locales/validation/',
                suffix: '.json' + _VERSION_TAIL_
            });

            $translateProvider
                .useStaticFilesLoader({ files: translateFiles })
                .registerAvailableLanguageKeys(['en','ko'], {
                    'en-*': 'en',
                    'ko-*': 'ko'
                })
                // .determinePreferredLanguage()
                .fallbackLanguage(_DEFAULT_LANGUAGE_);
            $translateProvider.useSanitizeValueStrategy(null);
            $translateProvider.test = "test";

        }])
    /*
        .config(['ChartJsProvider', function(ChartJsProvider) {
            // Configure all charts
            ChartJsProvider.setOptions({ colors: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
            // Configure all doughnut charts
            ChartJsProvider.setOptions('doughnut', {
                cutoutPercentage: 60
            });
            ChartJsProvider.setOptions('bubble', {
                tooltips: { enabled: false }
            });
        }])
    */
    /**
     * Run -------------------------------------------------------------------------
     */
    .run(function (common, $translate, CONSTANTS) {

        if (_MODE_ == "DEBUG") console.log("app run");

        /********** default start **********/
        var languageKey = common.getLanguageKey();
        languageKey = 'ko';
        if(languageKey == null || languageKey == '') {
            languageKey = $translate.proposedLanguage() || $translate.use();
            common.setLanguageKey(languageKey);
        }
        $translate.use(languageKey);
    })
;
