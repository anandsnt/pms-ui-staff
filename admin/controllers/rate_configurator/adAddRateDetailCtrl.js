admin.controller('ADaddRatesDetailCtrl', ['$scope', 'ADRatesAddDetailsSrv',
    function ($scope, ADRatesAddDetailsSrv) {

        $scope.init = function () {
            BaseCtrl.call(this, $scope);
            $scope.rateTypesDetails = {};
            fetchData();
        };

        $scope.isPromotional = function(){
            var ispromo =false;
            if($scope.rateTypesDetails){
                angular.forEach($scope.rateTypesDetails.rate_types, function(rate_type){
                    if($scope.rateData.rate_type.id === rate_type.id){
                        if(rate_type.name === "Promotional"){
                            ispromo = true;
                        }
                        else{
                            ispromo = false;
                        }
                    }
                });
            }
            return ispromo;
        }

        $scope.hideBasedOn = function(){
            var hideBasedOn =false;
            if($scope.rateTypesDetails){
                angular.forEach($scope.rateTypesDetails.rate_types, function(rate_type){
                    if($scope.rateData.rate_type.id === rate_type.id){
                        if (['Corporate Rates', 'Consortia Rates', 'Government Rates'].indexOf(rate_type.name) >= 0){
                            hideBasedOn = true;
                        }
                        else{
                            hideBasedOn = false;
                        }
                    }
                });
            }
            return hideBasedOn;
        }

        /*
         * Validate Rate Details Form
         */

        $scope.isFormValid = function () {
            if (!$scope.rateData.name || !$scope.rateData.description || !$scope.rateData.rate_type.id) {
                return false;
            }
            if (($scope.rateData.name.length <= 0) || ($scope.rateData.description.length <= 0) || ($scope.rateData.rate_type.id.length <= 0)) {
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
        /**
        * Method to show/hide the based on range selection.
        * Based on rate will not be available, 
        * if it the rate type is 'Corporate Rates', 'Consortia Rates', 'Government Rates'
        */
        $scope.rateTypeChanged = function(){
            var rateTypeSelected = $scope.rateData.rate_type.name;
            if (['Corporate Rates', 'Consortia Rates', 'Government Rates'].indexOf(rateTypeSelected) >= 0){
                $scope.hideBasedOn = true;
            }
            else if(rateTypeSelected === 'Promotional'){
                $scope.isPromotional = true;
            }
        };

        /*
         * Save Rate Details
         */

        $scope.saveRateDetails = function () {

            var amount = parseInt($scope.rateData.based_on.value_sign + $scope.rateData.based_on.value_abs);

            var data = {
                'name': $scope.rateData.name,
                'description': $scope.rateData.description,
                'rate_type_id': $scope.rateData.rate_type.id,
                'based_on_rate_id': $scope.rateData.based_on.id,
                'based_on_type': $scope.rateData.based_on.type,
                'based_on_value': amount,
                'promotion_code': $scope.rateData.promotion_code
            };

            // Save Rate Success Callback
            var saveSuccessCallback = function (data) {
                $scope.manipulateData(data);
                $scope.$emit('hideLoader');
                $scope.$emit("changeMenu", 'Room types');
                //$scope.$emit("updateBasedonRate");
                $scope.$emit("rateChangedFromDetails");

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