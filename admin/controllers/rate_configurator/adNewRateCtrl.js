admin.controller('ADAddnewRate', ['$scope', 'ADRatesRangeSrv', 'ADRatesSrv', '$state', '$stateParams',
    function ($scope, ADRatesRangeSrv, ADRatesSrv, $state, $stateParams) {
        $scope.init = function () {
            BaseCtrl.call(this, $scope);
            $scope.is_edit = false;
            // activate Rate Details View
            $scope.rateMenu = 'Details';
            // intialize rateData dictionary - START
            $scope.rateData = {
                "id": "",
                "name": "",
                "description": "",
                "code": "",
                "based_on": {
                    "id": "",
                    "type": "",
                    "value_abs": "",
                    "value_sign": ""
                },
                "rate_type_id": "",
                "status": true,
                "room_type_ids": [],
                "date_ranges": []
            }
            // intialize rateData dictionary - END
            $scope.errorMessage = '';
            // webservice call to fetch rate details for edit
            if ($stateParams.rateId) {
                $scope.is_edit = true;
                $scope.invokeApi(ADRatesSrv.fetchDetails, {
                    rateId: $stateParams.rateId
                }, rateDetailsFetchSuccess);
            }
        };


        /*
         * toogle different rate view
         */
        $scope.$on("changeMenu", function (e, value) {
            if (parseInt(value) > 0){
                value = "dateRange."+value;
            }
            $scope.rateMenu = value;
        });

        $scope.$on("errorReceived", function (e, value) {
            $scope.errorMessage = value;
        });

        /**
        * Fetch the based on rate retails, if the rate has chosen a based on rate.
        */
        $scope.$on("updateBasedonRate", function(e){
        	fetchBasedOnRateDetails(true);
        });


        var fetchBasedOnRateDetails = function(update_rate_data){
            if($scope.rateData.based_on.id == undefined || $scope.rateData.based_on.id == ""){
                return false;
            }
            var fetchBasedonSuccess = function(data){
                // set basedon data
                $scope.basedonRateData = data;
                $scope.basedonRateData.rate_type = (data.rate_type != null) ? data.rate_type.id : ''
                $scope.basedonRateData.based_on = (data.based_on != null) ? data.based_on.id : '';
                if(update_rate_data){
                    updateRateDefaults();
                }
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADRatesSrv.fetchDetails, {
                rateId: $scope.rateData.based_on.id
            }, fetchBasedonSuccess);
        }




        var updateRateDefaults = function(){
            if($scope.rateData.room_type_ids.length == 0){
                // set basedon room types into rateData room types
                $scope.rateData.room_type_ids = angular.copy($scope.basedonRateData.room_type_ids);
                $scope.rateData.date_ranges = angular.copy($scope.basedonRateData.date_ranges)
            }
            $scope.$broadcast('onRateDefaultsFetched');
        }

        // Fetch details success callback for rate edit

        var rateDetailsFetchSuccess = function (data) {

            $scope.hotel_business_date = data.business_date;
            // set rate data for edit
            $scope.rateData = data;
            $scope.rateData.id = $stateParams.rateId;
            $scope.rateData.rate_type_id = (data.rate_type != null) ? data.rate_type.id : '';
            if (data.based_on) {
                $scope.rateData.based_on.value_abs = Math.abs(data.based_on.value)
                $scope.rateData.based_on.value_sign = data.based_on.value > 0 ? "+" : "-";
            } else {
                $scope.rateData.based_on = {
                    "id": "",
                    "type": "",
                    "value_abs": "",
                    "value_sign": ""
                };
            }
            // fetch basedOn Rate Details
            fetchBasedOnRateDetails(false);
            $scope.$emit('hideLoader');
            $scope.$broadcast('onRateDefaultsFetched');
        };

        $scope.addNewDateRange = function(){
            $scope.rateMenu ='ADD_NEW_DATE_RANGE';
            // TODO :: call reset calendar

        };

        $scope.shouldShowAddNewDateRange = function(){
            if($scope.rateMenu === 'ADD_NEW_DATE_RANGE') { return false; }
            if (!$scope.rateData.id || $scope.rateData.room_type_ids.length == 0) { return false; }
            return true;
        };

        /*
         * init call
         */
        $scope.init();


    }
]);
