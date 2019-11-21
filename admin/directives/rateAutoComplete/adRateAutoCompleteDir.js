angular.module('admin')
    .directive('adRateAutoComplete', ['ADRatesSrv', function (ADRatesSrv) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                rate_id: '=selectedRateId',
                rate_name: '=ngModel',
                label: '@label',
                entryDivClass: '@entryDivClass',
                delay: '@delay',
                minLengthToTrigger: '@minLengthToTrigger',
                onSelect: '=',
                isDisabled: '='
            },
            controller: function ($scope) {
                var minLengthToTrigger;


                var search = function (callBackToAutoComplete) {
                    var params = {
                        query: $scope.rate_name
                    };

                    var options = {
                        params: params,
                        successCallBack: function (data, successCallBackParameters) {
                            if (data.results.length === 0) {
                                // Rate not found
                                $scope.rate_id = '';
                                return;
                            }
                            successCallBackParameters.callBackToAutoComplete(data.results);
                        },
                        successCallBackParameters: {
                            callBackToAutoComplete: callBackToAutoComplete
                        }
                    };

                    $scope.callAPI(ADRatesSrv.fetchRates, options);
                };

                /**
                 * Initialization
                 * @return {undefined}
                 */
                (function () {
                    BaseCtrl.call(this, $scope);
                    $scope.autoCompleteOptions = {
                        delay: _.isUndefined($scope.delay) ? 600 : parseInt($scope.delay),
                        minLength: 0,
                        position: {
                            my: 'right top',
                            at: 'right bottom',
                            collision: 'flip'
                        },
                        source: function (request, callBackToAutoComplete) {
                            if (request.term.length === 0) {
                                // reset
                                $scope.rate_id = '';
                                $scope.rate_name = '';
                            } else if (request.term.length > minLengthToTrigger) {
                                search(callBackToAutoComplete);
                            }
                        },
                        select: function (event, ui) {
                            $scope.rate_id = ui.item.id;
                            $scope.rate_name = ui.item.name;
                            $scope.$emit('RATE_SELECTED', {
                                id: ui.item.id,
                                name: ui.item.name
                            });

                            return false;
                        }
                    };

                    $scope.label = _.isUndefined($scope.label) ? 'Rate' : $scope.label;
                    $scope.entryDivClass = _.isUndefined($scope.entryDivClass) ? '' : $scope.entryDivClass;
                    minLengthToTrigger = _.isUndefined($scope.minLengthToTrigger) ? 1 : parseInt($scope.minLengthToTrigger);
                }());
            },
            templateUrl: '/assets/directives/rateAutoComplete/adRateAutoCompleteDir.html'
        };
    }]);
