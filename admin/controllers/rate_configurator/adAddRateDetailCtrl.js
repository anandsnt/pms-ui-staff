admin.controller('ADaddRatesDetailCtrl', ['$scope', 'ADRatesAddDetailsSrv','ngDialog',
    function ($scope, ADRatesAddDetailsSrv,ngDialog) {

        $scope.init = function () {
            BaseCtrl.call(this, $scope);
            $scope.rateTypesDetails = {};
            fetchData();
            $scope.detailsMenu = '';
        };

      /*
       * change detials sub menu selection
       */
        $scope.changeDetailsMenu = function(selectedMenu){
            $scope.detailsMenu = selectedMenu;
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
         * Set add on data
         */
        var setUpAddOnData = function(){
            var addOnsArray = [];
            angular.forEach($scope.rateData.addOns, function(addOns){
                if(addOns.isSelected)
                { 
                    var data ={};
                    data.is_inclusive_in_rate = addOns.is_inclusive_in_rate;
                    data.addon_id =  addOns.id;
                    addOnsArray.push(data);
                }
             });
            return addOnsArray;
        };

        /*
         * Save Rate Details
         */

        $scope.saveRateDetails = function () {

            var amount = parseInt($scope.rateData.based_on.value_sign + $scope.rateData.based_on.value_abs);

            var addOns = setUpAddOnData();
            var data = {
                'name': $scope.rateData.name,
                'description': $scope.rateData.description,
                'rate_type_id': $scope.rateData.rate_type.id,
                'based_on_rate_id': $scope.rateData.based_on.id,
                'based_on_type': $scope.rateData.based_on.type,
                'based_on_value': amount,
                'promotion_code': $scope.rateData.promotion_code,
                'addons': addOns,
                'charge_code_id': $scope.rateData.charge_code_id,
                'currency_code_id': $scope.rateData.currency_code_id,
                'min_advanced_booking':$scope.rateData.min_advanced_booking,
                'max_advanced_booking':$scope.rateData.max_advanced_booking,
                'min_stay':$scope.rateData.min_stay,
                'max_stay':$scope.rateData.max_stay,
                'use_rate_levels':$scope.rateData.use_rate_levels,
                'is_commission_on':$scope.rateData.is_commission_on,
                'is_suppress_rate_on':$scope.rateData.is_suppress_rate_on,
                'is_discount_allowed_on':$scope.rateData.is_discount_allowed_on,
                'source_id':$scope.rateData.source_id,
                'market_segment_id':$scope.rateData.market_segment_id,
                'cancellation_policy_id': $scope.rateData.cancellation_policy_id,
                'deposit_policy_id':$scope.rateData.deposit_policy_id,
                'end_date':$scope.rateData.end_date

            };

            // Save Rate Success Callback
            var saveSuccessCallback = function (data) {
                $scope.manipulateData(data);
                $scope.detailsMenu = "";
                $scope.$emit('hideLoader');
                $scope.$emit("changeMenu", 'Room types');
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


        $scope.popupCalendar = function(){
        ngDialog.open({
         template: '/assets/partials/rates/adRatesAdditionalDeatilsPicker.html',
         controller: 'adEndDatePickerController',
         className: 'ngdialog-theme-default single-calendar-modal',
         scope:$scope,
         closeByDocument:true
    });
};
    }
]);

