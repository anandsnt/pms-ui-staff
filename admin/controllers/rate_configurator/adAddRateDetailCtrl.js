admin.controller('ADaddRatesDetailCtrl', ['$scope', 'ADRatesAddDetailsSrv',
    function ($scope, ADRatesAddDetailsSrv) {

        $scope.init = function () {
            BaseCtrl.call(this, $scope);
            fetchData();
        };

        /*
         * Validate Rate Details Form
         */

        $scope.isFormValid = function () {
            if (!$scope.rateData.name || !$scope.rateData.description || !$scope.rateData.rate_type_id) {
                return false;
            }
            if (($scope.rateData.name.length <= 0) || ($scope.rateData.description.length <= 0) || ($scope.rateData.rate_type_id.length <= 0)) {
                return false;
            }
            return true;
        };

        /*
         * Fetch Details
         */

        var fetchData = function () {

            var fetchRateTypesSuccessCallback = function (data) {
                $scope.rateTypesDetails = data;
                $scope.$emit('hideLoader');
            };
            var fetchRateTypesFailureCallback = function (data) {
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADRatesAddDetailsSrv.fetchRateTypes, {}, fetchRateTypesSuccessCallback, fetchRateTypesFailureCallback);
        }

        /*
         * Save Rate Details
         */

        $scope.saveRateDetails = function () {

            var amount = parseInt($scope.rateData.based_on.value_sign + $scope.rateData.based_on.value_abs);

            var data = {
                'name': $scope.rateData.name,
                'description': $scope.rateData.description,
                'rate_type_id': $scope.rateData.rate_type_id,
                'based_on_rate_id': $scope.rateData.based_on.id,
                'based_on_type': $scope.rateData.based_on.type,
                'based_on_value': amount
            };

            // Save Rate Success Callback
            var saveSuccessCallback = function (data) {
                console.log("hree");
                if (data.id) {
                    console.log("save");
                    $scope.rateData.id = data.id;
                    console.log($scope.rateData.id);
                    
                }
                $scope.$emit('hideLoader');
                $scope.$emit("changeMenu", 'Room types');
                $scope.$emit("updateBasedonRate");
            };
            var saveFailureCallback = function (data) {
                $scope.$emit('hideLoader');
                $scope.$emit("errorReceived", data);
            };

            if (!$scope.rateData.id) {
                $scope.invokeApi(ADRatesAddDetailsSrv.createNewRate, data, saveSuccessCallback, saveFailureCallback);
            } else {
                var updatedData = {
                    'updatedData': data,
                    'rateId': $scope.rateData.id
                };
                $scope.invokeApi(ADRatesAddDetailsSrv.updateNewRate, updatedData, saveSuccessCallback, saveFailureCallback);
            }
        };

        $scope.init();
    }
]);