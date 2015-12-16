// This code will be assimilated, resistance is futile
// Code will be assimilated to become part of a better IMH234
// auto complete feature
sntRover.directive('autoCompleteRate', ['highlightFilter',
    function(highlightFilter) {
        return {
            restrict: 'A',
            scope: {
                autoOptions: '=autoCompleteOptions',
                ngModel: '=',
                ulClass: '@ulClass'
            },
            link: function(scope, el, attrs) {
                $(el).autocomplete(scope.autoOptions)
                    .data('ui-autocomplete')
                    ._renderItem = function(ul, item) {
                        ul.addClass(scope.ulClass);

                        var $content = highlightFilter(item.label, scope.ngModel),
                            $result = $("<a></a>").html($content),
                            defIconText = '',
                            $image = '';

                        switch (item.type) {
                            case 'PUBLIC':
                                defIconText = 'Public';
                                break;

                            case 'CORP':
                                defIconText = 'Corporate';
                                break;

                            default:
                                break;
                        };

                        $image = '<span class="label ' + defIconText + '">' + defIconText + '</span>';

                        if (item.type) {
                            $($image).appendTo($result);
                        }
                        return $('<li></li>').append($result).appendTo(ul);
                    };
            }
        };
    }
]);

angular.module('sntRover').directive('rvRateAutoComplete', ['RVCompanyCardSrv', function (RVCompanyCardSrv) {
    return {
        restrict    : 'E',
        replace     : true,
        scope       : {
            rate_id             : '=selectedRateId',
            rate_name           : '=ngModel',
            label               : '@label',
            entryDivClass       : '@entryDivClass',
            delay               : '@delay',
            minLengthToTrigger  : '@minLengthToTrigger'
        },
        controller : function($scope) {
            BaseCtrl.call(this, $scope);

            var minLengthToTrigger;

            var successCallBackOfFetchRate = function(data, successCallBackParameters) {
                if (data.contract_rates.length === 0) {
                    $scope.$emit ("showErrorMessage", ["Unable find charge code against '" + $scope.rate_name + "'"]);
                    $scope.rate_id = '';
                    return;
                }
                successCallBackParameters.callBackToAutoComplete (data.results);
            };

            /**
             * [fetchRates description]
             * @return {[type]} [description]
             */
            var fetchRates = function(callBackToAutoComplete) {
                var params = {
                    query: $scope.rate_name
                };
                var options = {
                    params          : params,
                    successCallBack : successCallBackOfFetchRate,
                    successCallBackParameters: {
                        callBackToAutoComplete: callBackToAutoComplete
                    }
                };
                $scope.callAPI(RVCompanyCardSrv.fetchRates, options);
            };

            var clearConfigValues = function() {
                $scope.rate_id       = '';
                $scope.rate_name     = '';
            };

            // jquery autocomplete Souce handler
            // get two arguments - request object and response callback function
            var autoCompleteSourceHandler = function(request, callBackToAutoComplete) {
                if (request.term.length === 0) {
                    clearConfigValues();
                    runDigestCycle();
                } 
                else if (request.term.length > minLengthToTrigger) {
                    fetchRates(callBackToAutoComplete);
                }
            };

            /**
             * to run angular digest loop,
             * will check if it is not running
             * return - None
             */
            var runDigestCycle = function() {
                if (!$scope.$$phase) {
                    $scope.$digest();
                }
            };

            /**
             * [autoCompleteSelectHandler description]
             * @param  {[type]} event [description]
             * @param  {[type]} ui    [description]
             * @return {[type]}       [description]
             */
            var autoCompleteSelectHandler = function(event, ui) {
                $scope.rate_id   = ui.item.id;
                $scope.rate_name = ui.item.name;
                runDigestCycle();
                return false;    
            };

            /**
             * Initialization stuffs
             * @return {undefiend}
             */
            var initializeMe = function() {
                var chargeCodeAutocompleteOptions = {
                    delay       : _.isUndefined($scope.delay) ? 600 : parseInt($scope.delay),
                    minLength   : 0,
                    position    : {
                        my          : "right top",
                        at          : "right bottom",
                        collision   : 'flip'
                    },
                    source      : autoCompleteSourceHandler,
                    select      : autoCompleteSelectHandler
                };

                $scope.label            = _.isUndefined($scope.label) ? 'Charge Code' : $scope.label;
                $scope.entryDivClass    = _.isUndefined($scope.entryDivClass) ? '' : $scope.entryDivClass;
                minLengthToTrigger      = _.isUndefined($scope.minLengthToTrigger) ? 1 : parseInt($scope.minLengthToTrigger);
                
                $(el).autocomplete(chargeCodeAutocompleteOptions)
                    .data('ui-autocomplete')
                    ._renderItem = function(ul, item) {
                        ul.addClass(scope.ulClass);

                        var $content = highlightFilter(item.label, scope.ngModel),
                            $result = $("<a></a>").html($content),
                            defIconText = '',
                            $image = '';

                        switch (item.type) {
                            case 'PUBLIC':
                                defIconText = 'Public';
                                break;

                            case 'CORP':
                                defIconText = 'Corporate';
                                break;

                            default:
                                break;
                        };

                        $image = '<span class="label ' + defIconText + '">' + defIconText + '</span>';

                        if (item.type) {
                            $($image).appendTo($result);
                        }
                        return $('<li></li>').append($result).appendTo(ul);
                    };
            }();    
        },
        templateUrl : '../../assets/directives/chargeCodeAutoComplete/adChargeCodeAutoCompleteDir.html',
    };
}]);