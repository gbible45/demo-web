'use strict';

angular.module('app')
    .constant('SITEMAP', {
        pages : {
            loading: {
                pageStage : "pages",
                name: 'loading',
                stateKey: 'loading',
                controller: 'loadingCtrl',
                url: '/loading',
                templateUrl:  _VIEWS_+'/common/loading.html',
                frameMainTemplateUrl: _LAYOUT_VIEWS_+'/noFrameMainBody.html',
            },
            serverErr: {
                pageStage : "pages",
                name: 'serverErr',
                stateKey: 'serverErr',
                controller: 'serverErrCtrl',
                url: '/server_err',
                templateUrl:  _VIEWS_+'/common/apiServerError.html',
                frameMainTemplateUrl: _LAYOUT_VIEWS_+'/noFrameMainBody.html',
            },
            login: {
                pageStage : "pages",
                name: 'login',
                stateKey: 'login',
                url: '/login',
                controller: 'loginCtrl',
                templateUrl:  _VIEWS_+'/user/login.html',
                frameMainTemplateUrl: _LAYOUT_VIEWS_+'/noFrameMainBody.html',
            },
        },
        contentsMenus: {
            common: {
                pageStage : "comm",
                name: "common",
                pageViewAuth: "goodMonitor",
                pageEditAuth: "goodDeveloper",
                mainTop: true,
                leftMenu: true,
                leftMenuTemplateUrl: _VIEWS_+'/layout/commLeftMenu.html',
                loadMyFile: {
                    loadMyScripts: [],
                    loadMyServices: [],
                    loadMyControllers: [],
                    loadMyDirectives: [],
                },
                menus: {
                    dashboard: {
                        name: 'dashboard',
                        stateKey: 'dashboard',
                        menuDisplayNo : true,
                        url: '/',
                        controller: 'dashboardCtrl',
                        templateUrl: _VIEWS_+'/dashboard/dashboard.html',
                        loadMyFile: {
                            loadMyScripts: [],
                            loadMyServices: [],
                            loadMyControllers: [_CONTROLLERS_+'/dashboard/dashboardControllers.js'],
                            loadMyDirectives: [],
                        },
                    },
                    dataCatalog: {
                        name: 'dataCatalog',
                        stateKey: 'dataCatalog',
                        menuDisplayNo : true,
                        url: '/dataCatalog',
                        controller: 'dataCatalogCtrl',
                        loadMyFile: {
                            loadMyScripts: [],
                            loadMyServices: [],
                            loadMyControllers: [_CONTROLLERS_+'/dataCatalog/dataCatalogControllers.js'],
                            loadMyDirectives: [],
                        },
                        subPages: {
                            testMenu1: {
                                name: 'dataCatalog_testMenu1',
                                stateKey: 'dataCatalog_testMenu1',
                                url: '/testMenu1',
                                controller: 'dataCatalogCtrl1',
                                templateUrl: _VIEWS_+'/dataCatalog/testMenu1.html',
                            },
                            testMenu2: {
                                name: 'dataCatalog_testMenu2',
                                stateKey: 'dataCatalog_testMenu2',
                                url: '/testMenu2',
                                controller: 'dataCatalogCtrl2',
                                templateUrl: _VIEWS_+'/dataCatalog/testMenu2.html',
                            },
                            testMenu3: {
                                name: 'dataCatalog_testMenu3',
                                stateKey: 'dataCatalog_testMenu3',
                                url: '/testMenu3',
                                controller: 'dataCatalogCtrl3',
                                templateUrl: _VIEWS_+'/dataCatalog/testMenu3.html',
                            }
                        }
                    }
                }
            },
            /*member: {
                pageStage : "member",
                pageViewAuth: "goodAdmin",
                pageEditAuth: "goodAdmin",
                mainTop: true,
                leftMenu: true,
                leftMenuTemplateUrl: _VIEWS_+'/layout/commLeftMenu.html',
                loadMyFile: {
                    loadMyScripts: [],
                    loadMyServices: [_SERVICES_+'/memberServices.js'],
                    loadMyControllers: [_CONTROLLERS_+'/member/memberControllers.js'],
                    loadMyDirectives:  [],
                },
                menus: {
                    deploy: {
                        name: 'member.users',
                        stateKey: 'member_users',
                        menuDisplayNo : true,
                        url: '/member/users',
                        controller: 'memberUsersCtrl',
                        templateUrl: _VIEWS_+'/member/members.html',
                    },
                }
            },*/
            sample: {
                pageStage : "sample",
                name: "sample",
                pageViewAuth: "goodAuditor",
                pageEditAuth: "goodAdmin",
                mainTop: true,
                leftMenu: true,
                mainContentsClass: '',
                frameMainTemplateUrl: _LAYOUT_VIEWS_+'/frameMainBody.html',
                mainBodyTemplateUrl: _LAYOUT_VIEWS_+'/defaultLayoutFrame.html',
                navigationTemplateUrl: _LAYOUT_VIEWS_+'/navigation.html',
                mainTopTemplateUrl: _LAYOUT_VIEWS_+'/mainTop.html',
                leftMenuTemplateUrl: _VIEWS_+'/sample/sampleLeftMenu.html',
                loadMyFile: {
                    loadMyScripts: [],
                    loadMyServices: [],
                    loadMyControllers: [_CONTROLLERS_+'/sample/sampleControllers.js'],
                    //loadMyDirectives: ['toggle-switch'],
                },
                menus: {
                    dashboard: {
                        name: 'sample.dashboard',
                        stateKey: 'sample',
                        url: '/sample',
                        controller: 'sampleDashboardCtrl',
                        templateUrl: _VIEWS_+'/sample/sampleDashboard.html',
                        loadMyFile: {
                            loadMyScripts: ['css/timeline.css'],
                            loadMyServices: [],
                            loadMyControllers: [],
                            loadMyDirectives: [_CONTROLLERS_+'/sample/sampleStats.js'],
                        },
                    },
                    charts: {
                        name: 'sample.charts',
                        stateKey: 'sample_charts',
                        url: '/sample/charts',
                        controller: 'sampleChartsCtrl',
                        templateUrl: _VIEWS_+'/sample/sampleCharts.html',
                        loadMyFile: {
                            loadMyScripts: [],
                            loadMyServices: [],
                            loadMyControllers: [],
                            loadMyDirectives: ['chart.js'],
                        },
                    },
                    forms: {
                        name: 'sample.forms',
                        stateKey: 'sample_forms',
                        url: '/sample/forms',
                        templateUrl: _VIEWS_+'/sample/sampleForms.html',
                    },
                    blank: {
                        name: 'sample.blank',
                        stateKey: 'sample_blank',
                        url: '/sample/blank',
                        templateUrl: _VIEWS_+'/sample/sampleBlank.html',
                    },
                    tables: {
                        name: 'sample.tables',
                        stateKey: 'sample_tables',
                        url: '/sample/table',
                        templateUrl: _VIEWS_+'/sample/sampleTables.html',
                    },
                    panelsWells: {
                        name: 'sample.panelsWells',
                        stateKey: 'sample_panels_wells',
                        url: '/sample/panels_wells',
                        templateUrl: _VIEWS_+'/sample/samplePanelsWells.html',
                    },
                    buttons: {
                        name: 'sample.buttons',
                        stateKey: 'sample_buttons',
                        url: '/sample/buttons',
                        templateUrl: _VIEWS_+'/sample/sampleButtons.html',
                    },
                    notifications: {
                        name: 'sample.notifications',
                        stateKey: 'sample_notifications',
                        url: '/sample/notifications',
                        templateUrl: _VIEWS_+'/sample/sampleNotifications.html',
                    },
                    typography: {
                        name: 'sample.typography',
                        stateKey: 'sample_typography',
                        url: '/sample/typography',
                        templateUrl: _VIEWS_+'/sample/sampleTypography.html',
                    },
                    icons: {
                        name: 'sample.icons',
                        stateKey: 'sample_icons',
                        url: '/sample/icons',
                        templateUrl: _VIEWS_+'/sample/sampleIcons.html',
                    },
                    grid: {
                        name: 'sample.grid',
                        stateKey: 'sample_grid',
                        url: '/sample/grid',
                        templateUrl: _VIEWS_+'/sample/sampleGrid.html',
                    },
                    pop: {
                        name: 'sample.pop',
                        stateKey: 'sample_pop',
                        url: '/sample/pop',
                        controller: 'samplePopCtrl',
                        templateUrl: _VIEWS_+'/sample/samplePop.html',
                        loadMyFile: {
                            loadMyScripts: [],
                            loadMyServices: [],
                            loadMyControllers: [],
                            loadMyDirectives:  [],
                        },
                    },
                    demo: {
                        name: 'sample.demo',
                        stateKey: 'sample_demo',
                        url: '/sample/demo/:demoPage',
                        loadMyFile: {
                            loadMyScripts: [],
                            loadMyServices: [],
                            loadMyControllers: [],
                            loadMyDirectives:  [],
                        },
                    },
                }
            }
        }
    })
;
