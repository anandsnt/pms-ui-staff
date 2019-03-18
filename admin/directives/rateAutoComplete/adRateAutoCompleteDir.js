admin.directive('adRateAutoComplete', ['ADRatesSrv', function (ADRatesSrv) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            charge_code_id: '=selectedChargeCodeId',
            charge_code_name: '=ngModel',
            label: '@label',
            entryDivClass: '@entryDivClass',
            delay: '@delay',
            minLengthToTrigger: '@minLengthToTrigger',
            excludePayments: '@',
            onlyPayments: '@',
            required: '=',
            onSelect: '=',
            isDisabled: '='
        },
        controller: function ($scope) {
            BaseCtrl.call(this, $scope);

            var minLengthToTrigger;

            var successCallBackOfFetchChargeCodes = function (data, successCallBackParameters) {
                if (data.results.length === 0) {
                    $scope.$emit('showErrorMessage', ['Unable find charge code against \'' + $scope.charge_code_name + '\'']);
                    $scope.charge_code_id = '';
                    return;
                }
                successCallBackParameters.callBackToAutoComplete(data.results);
            };

            /**
             * [fetchChargeCodes description]
             * @return {[type]} [description]
             */
            var fetchChargeCodes = function (callBackToAutoComplete) {
                var params = {
                    query: $scope.charge_code_name
                };

                var options = {
                    params: params,
                    successCallBack: successCallBackOfFetchChargeCodes,
                    successCallBackParameters: {
                        callBackToAutoComplete: callBackToAutoComplete
                    }
                };

                $scope.callAPI(ADRatesSrv.fetchRates, options);
            };

            var clearConfigValues = function () {
                $scope.charge_code_id = '';
                $scope.charge_code_name = '';
            };

            // jquery autocomplete Souce handler
            // get two arguments - request object and response callback function
            var autoCompleteSourceHandler = function (request, callBackToAutoComplete) {
                if (request.term.length === 0) {
                    clearConfigValues();
                    runDigestCycle();
                } else if (request.term.length > minLengthToTrigger) {
                    fetchChargeCodes(callBackToAutoComplete);
                }
            };

            /**
             * to run angular digest loop,
             * will check if it is not running
             * return - None
             */
            var runDigestCycle = function () {
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
            var autoCompleteSelectHandler = function (event, ui) {
                $scope.charge_code_id = ui.item.id;
                $scope.charge_code_name = ui.item.name;
                $scope.$emit('RATE_SELECTED', {
                    id: ui.item.id,
                    name: ui.item.name
                });
                runDigestCycle();
                return false;
            };

            /**
             * Initialization stuffs
             * @return {undefined}
             */
            (function () {
                $scope.chargeCodeAutocompleteOptions = {
                    delay: _.isUndefined($scope.delay) ? 600 : parseInt($scope.delay),
                    minLength: 0,
                    position: {
                        my: 'right top',
                        at: 'right bottom',
                        collision: 'flip'
                    },
                    source: autoCompleteSourceHandler,
                    select: autoCompleteSelectHandler
                };

                $scope.label = _.isUndefined($scope.label) ? 'Rate' : $scope.label;
                $scope.entryDivClass = _.isUndefined($scope.entryDivClass) ? '' : $scope.entryDivClass;
                minLengthToTrigger = _.isUndefined($scope.minLengthToTrigger) ? 1 : parseInt($scope.minLengthToTrigger);
            }());
        },
        templateUrl: '/assets/directives/rateAutoComplete/adRateAutoCompleteDir.html'
    };
}]);
