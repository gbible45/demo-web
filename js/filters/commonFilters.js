'use strict';

angular.module('app')
// 부분 필터
    .filter('propsFilter', function () {
        return function (items, props) {
            var out = [];
            if (angular.isArray(items)) {
                var keys = Object.keys(props);
                items.forEach(function (item) {
                    var itemMatches = false;
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }
                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }
            return out;
        };
    })
    .filter('displayVolume', function () {
        return function (value, unit, options) {
            var out = (angular.isUndefined(value) || value == null) ? 0 : parseFloat(value);
            if (!options) {
                options = {};
            }
            if (!unit) {
                unit = "KB";
            }
            if (angular.isUndefined(options.chUnit)) {
                options.chUnit = "AUTO";
            }
            var unitLabel   = "KB";
            // 계산을 일률적으로 하기 위해 KB 단위로 설정
            if (unit.toUpperCase() == "BYTE") {
                out = out/1024;
            } if (unit.toUpperCase() == "MB") {
                out = out*1024;
            } else if (unit.toUpperCase() == "GB") {
                out = out*1024*1024;
            } else if (unit.toUpperCase() == "TB") {
                out = out*1024*1024*1024;
            }
            if (options.chUnit.toUpperCase() != "AUTO") {
                unitLabel = options.chUnit;
            } else {
                // 입력된 단위를 최소 단위로
                if (out >= 1024*1024*1024) {
                    unitLabel = "TB";
                } else if (out >= 1024*1024) {
                    unitLabel = "GB";
                    if (unit.toUpperCase() == "TB") {
                        unitLabel = "TB";
                    }
                } else if (out >= 1024) {
                    unitLabel = "MB";
                    if (unit.toUpperCase() == "GB") {
                        unitLabel = "GB";
                    } else if (unit.toUpperCase() == "TB") {
                        unitLabel = "TB";
                    }
                } else {
                    unitLabel = "KB";
                    if (unit.toUpperCase() == "MB") {
                        unitLabel = "MB";
                    } else if (unit.toUpperCase() == "GB") {
                        unitLabel = "GB";
                    } else if (unit.toUpperCase() == "TB") {
                        unitLabel = "TB";
                    }
                }
            }
            if (unitLabel.toUpperCase() == "TB") {
                out = out/(1024*1024*1024);
            } else if (unitLabel.toUpperCase() == "GB") {
                out = out/(1024*1024);
            } else if (unitLabel.toUpperCase() == "MB") {
                out = out/1024;
            }
            if (angular.isUndefined(options.decimal)) {
                if (angular.isUndefined(options.maxDecimal)) {
                    options.maxDecimal = 2;
                }
            }
            if (angular.isDefined(options.decimal)) {
                out = out.toFixed(options.decimal);
            } else {
                if (options.maxDecimal == 0) {
                    out = Math.round(out);
                } else {
                    var factor = Math.pow(10, options.maxDecimal);
                    out = Math.round(out * factor) / factor;
                }
                if (angular.isDefined(options.minDecimal)) {
                    out = out.toFixed(options.minDecimal);
                }
            }
            if (options.viewType == "val") {
                return out;
            } else if (options.viewType == "unit") {
                return unitLabel;
            } else {
                return out + " " + unitLabel;
            }
        };
    })
    .filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i=0; i<total; i++)
                input.push(i);
            return input;
        };
    })
    .filter('join', function() {
        return function(arr, separator, fkey, chked) {
            if (angular.isArray(arr)) {
                if (fkey) {
                    var keyArr = [];
                    angular.forEach(arr, function (val, k) {
                        if (!chked || val[fkey]) {
                            keyArr.push(val[fkey]);
                        }
                    });
                    return keyArr.join(separator);
                } else {
                    return arr.join(separator);
                }
            } else {
                return arr
            }
        };
    })
    .filter('firstUpperCase', function() {
        return function(value) {
            if (angular.isString(value) && value.length > 0) {
                return value.charAt(0).toUpperCase() + value.slice(1);
            } else {
                return value;
            }
        };
    })
    .filter('enterByNbr', function() {
        return function(value) {
            if (angular.isString(value) && value.length > 0) {
                return value.replace(/\n/g, '<br />');
            } else {
                return value;
            }
        };
    })
    .filter('splitStr', [function () {
        return function(input, splitChar, splitIndex) {
            return input.split(splitChar)[splitIndex];
        };
    }])
    .filter('numberZeroCut', ['$filter', function ($filter) {
        return function(input, digits, zeroDigits) {
            var returnValue = $filter('number')(input, digits);
            if (digits == 0) return returnValue;
            var returnValues = returnValue.split('.');
            if (returnValues.length == 1) return returnValue;
            if (returnValues[1].length == zeroDigits) return returnValue;
            returnValue = returnValues[0];
            var digitsValue = "";
            for (var i=(returnValues[1].length -1); i>=0; i--) {
                if (digitsValue != "" && i<zeroDigits || returnValues[1][i] != '0') {
                    digitsValue = returnValues[1][i] + digitsValue;
                }
            }
            if (digitsValue != "") returnValue += "." + digitsValue;
            return returnValue;
        };
    }])
    .filter('replace', [function () {

        return function (input, from, to) {

            if(input === undefined) {
                return;
            }

            var regex = new RegExp(from, 'g');
            return input.replace(regex, to);

        };
    }])
    .filter('elapseDiffTimeFormat', ['$filter', function ($filter) {
        return function (input, format) {
            if(input) {
                var startDate = new Date(1970, 0, 1, 0, 0, 0);
                var diff = new Date(startDate.getTime() + input);
                return $filter('date')(diff, format);
            }
        };
    }])
    .filter('elapseTime', ['$filter', function ($filter) {
        return function (input) {
            if(input) {
                var inputDate = input instanceof Date ? input : new Date(input);
                var diff = new Date(new Date().getTime() - inputDate.getTime());

                var elapse = {
                    year : Number(diff.getFullYear() - 1970),
                    month : Number(diff.getMonth() -1),
                    day : Number(diff.getDate() - 1),
                    hour : Number(diff.getHours() - 9),
                    minute : Number(diff.getMinutes())
                };

                if(elapse.month < 0 && elapse.month != -1) {
                    elapse.year -= 1;
                    elapse.month = 12 + elapse.month;
                }

                if(elapse.hour < 0 && elapse.month != -9) {
                    elapse.day -= 1;
                    elapse.hour = 24 + elapse.hour;
                }

                if(elapse.minute < 0) {
                    elapse.hour -= 1;
                    elapse.minute = 60 + elapse.minute;
                }

                var returnStr = "";
                if(elapse.year > 0) {
                    returnStr = elapse.year + "년 ";
                    if(elapse.month > 0) {
                        returnStr += elapse.month + "개월";
                    }
                } else if(elapse.month > 0 && elapse.year <= 0) {
                    returnStr = elapse.month + "개월 ";
                    if(elapse.day > 0) {
                        returnStr += elapse.day + "일";
                    }
                } else if(elapse.day > 0 && elapse.month <= 0 && elapse.year <= 0) {
                    returnStr = elapse.day + "일 ";
                    if(elapse.hour > 0) {
                        returnStr += elapse.hour + "시간";
                    }
                } else if(elapse.hour > 0 && elapse.day <= 0 && elapse.month <= 0 && elapse.year <= 0) {
                    returnStr = elapse.hour + "시간 ";
                    if(elapse.minute > 0) {
                        returnStr += elapse.minute + "분";
                    }
                } else {
                    returnStr = elapse.minute + "분";
                }
                return returnStr;
            }
        };
    }])
    .filter('filterMultiple',['$filter',function ($filter) {
        return function (items, keyObj) {
            var filterObj = {
                data:items,
                filteredData:[],
                applyFilter : function(obj,key){
                    var fData = [];
                    if (this.filteredData.length == 0)
                        this.filteredData = this.data;
                    if (obj){
                        var fObj = {};
                        if (!angular.isArray(obj)){
                            fObj[key] = obj;
                            fData = fData.concat($filter('filter')(this.filteredData,fObj));
                        } else if (angular.isArray(obj)){
                            if (obj.length > 0){
                                for (var i=0;i<obj.length;i++){
                                    if (angular.isDefined(obj[i])){
                                        fObj[key] = obj[i];
                                        fData = fData.concat($filter('filter')(this.filteredData,fObj));
                                    }
                                }

                            }
                        }
                        if (fData.length > 0){
                            this.filteredData = fData;
                        }
                    }
                }
            };
            if (keyObj){
                angular.forEach(keyObj,function(obj,key){
                    filterObj.applyFilter(obj,key);
                });
            }
            return filterObj.filteredData;
        }
    }])
;