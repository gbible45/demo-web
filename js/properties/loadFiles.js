'use strict';

angular.module('app')
    .constant('LOADFILES', {
        modules: [
            {
                name: 'ADM-dateTimePicker',
                files: [
                    'css/components/bootstrap-datetimepicker' + _MIN_ + '.css',
                    'css/components/ADM-dateTimePicker' + _MIN_ + '.css',
                    'js/components/modules/bootstrap-datetimepicker' + _MIN_ + '.js',
                    'js/components/modules/ADM-dateTimePicker' + _MIN_ + '.js',
                ],
                provider: 'js/components/provider/adMdtpProvider.js',
            },
            {
                name : 'rzModule',
                files: [
                    'css/components/bootstrap-slider.css',
                    'css/components/rzslider' + _MIN_ + '.css',
                    'js/components/modules/bootstrap-slider.js',
                    'js/components/modules/rzslider' + _MIN_ + '.js'
                ],
            },
            {
                name: 'ngStomp',
                files: [
                    'js/components/modules/ng-stomp.standalone.min.js',
                ],
            },
            {
                name: 'nvd3',
                files: [
                    'css/components/nv.d3.css',
                    'js/components/modules/d3.js',
                    'js/components/modules/nv.d3.js',
                    'js/components/modules/angular-nvd3.js',
                ],
            },
            {
                name: 'chart.js',
                files: [
                    'js/components/modules/Chart' + _MIN_ + '.js',
                    'js/components/modules/angular-chart' + _MIN_ + '.js',
                ],
                provider: 'js/components/provider/chartJsProvider.js',
            },
            {
                name: 'countTo',
                files: ['js/components/modules/angular-count-to' + _MIN_ + '.js'],
            },
            {
                name: 'ui.select2',
                files: [
                    'js/components/modules/bootstrap-select' + _MIN_ + '.js',
                    'css/components/select2' + _MIN_ + '.css',
                    'js/components/modules/select2' + _MIN_ + '.js',
                    'js/components/modules/angular-select2.js',
                ],
            },
            {
                name: 'ngJScrollPane',
                files: [
                    'css/components/jquery.scrolling-tabs' + _MIN_ + '.css',
                    'js/components/modules/jquery.scrolling-tabs' + _MIN_ + '.js',
                    'css/components/jquery.jscrollpane.css',
                    'js/components/modules/jquery.jscrollpane' + _MIN_ + '.js',
                    'js/components/modules/angular-jscrollpane' + _MIN_ + '.js',
                ],
            },
            {
                name: 'Tek.progressBar',
                files: [
                    'css/components/progress-wizard.min.css',
                    'js/components/modules/tek.progress-bar' + _MIN_ + '.js',
                ],
            },
            {
                name: 'slickCarousel',
                files: [
                    'css/components/slick' + _MIN_ + '.css',
                    'css/components/slick-theme' + _MIN_ + '.css',
                    'js/components/modules/slick' + _MIN_ + '.js',
                    'js/components/modules/angular-slick' + _MIN_ + '.js',
                ],
            },
            {
                name: 'scrollable-table',
                files: [
                    'css/components/scrollable-table.css',
                    'css/customs/scrollable-table.css',
                    'js/components/modules/angular-scrollable-table' + _MIN_ + '.js',
                ],
            },
            {
                name: 'ui.sortable',
                files: [
                    'js/components/modules/sortable.js',
                ],
            },
            {
                name: 'dndLists',
                files: [
                    'js/components/modules/angular-drag-and-drop-lists' + _MIN_ + '.js',
                ],
            },
            {
                name: 'toggle-switch',
                files: [
                    'css/components/angular-toggle-switch.css',
                    'js/components/modules/angular-toggle-switch' + _MIN_ + '.js',
                ],
            },
            {
                name: 'checklist-model',
                files: [
                    'js/components/modules/checklistModel.js',
                ],
            },
        ],
        scriptFiles: {
            xterm: [
                'css/components/xterm.css',
                'js/components/modules/xterm.js',
            ],
        },
        customModules: [

        ]
    })
;
