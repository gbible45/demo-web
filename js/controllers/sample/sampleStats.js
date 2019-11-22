'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('app')
    .directive('sampleStats',function() {
        return {
            templateUrl: _VIEWS_+'/sample/sampleStats.html'+_VERSION_TAIL_,
            restrict:'E',
            replace:true,
            scope: {
                'model': '=',
                'comments': '@',
                'number': '@',
                'name': '@',
                'colour': '@',
                'details':'@',
                'type':'@',
                'goto':'@'
            }

        }
    });
