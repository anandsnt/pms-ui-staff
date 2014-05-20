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
                "rate_type": {
                    "id": "",
                    "name": ""
                },
                "status": true,
                "room_type_ids": [],
                "promotion_code": "",
                "date_ranges": [],
                "addOns":[]
            }

            $scope.allAddOns = [];
            $scope.basedonRateData = {};

            // intialize rateData dictionary - END
            $scope.basedonRateData = {};
            $scope.errorMessage = '';
            // webservice call to fetch rate details for edit
            if ($stateParams.rateId) {
                $scope.is_edit = true;
                $scope.invokeApi(ADRatesSrv.fetchDetails, {
                    rateId: $stateParams.rateId
                }, rateDetailsFetchSuccess);
            }
            $scope.invokeApi(ADRatesSrv.fetchAdditionalDetails,{},fetchAdditionalDetailsSuccessCallback);
            
        };

        var fetchAdditionalDetailsSuccessCallback  = function(data){
        //add ons
        $scope.allAddOns = data.addons;
        angular.forEach($scope.allAddOns, function(addOns){
                addOns.isSelected = false;
                addOns.is_inclusive_in_rate = "false";
             });
        $scope.rateData.addOns =data.results;
       
        //restriction type
        $scope.restrictionDetails = data.restrictionDetails;
        angular.forEach($scope.restrictionDetails, function(restrictionType){
               if(restrictionType.value == 'CANCEL_PENALTIES'){
                 $scope.cancelPenaltiesActivated = (restrictionType.activated) ? true:false;
               } 
               if(restrictionType.value == 'DEPOSIT_REQUESTED'){
                $scope.depositRequiredActivated = (restrictionType.activated)  ? true:false;              
               }    
         });

         //selected restrictions 
         angular.forEach(data.selectedRestrictions, function(selectedRestriction){
              
               if(selectedRestriction.value == 'MAX_ADV_BOOKING'){
                  $scope.maxAdvancedBookingActivated =  true;
               } 
               if(selectedRestriction.value == 'MAX_STAY_LENGTH'){
                  $scope.maxStayLengthActivated =  true;          
               } 
               if(selectedRestriction.value == 'MIN_ADV_BOOKING'){
                  $scope.minAdvancedBookingActivated =  true;            
               }  
                if(selectedRestriction.value == 'MIN_ADV_BOOKING'){
                   $scope.minStayLengthActivated =  true;            
               }     
         });

         };



        /*
         * toogle different rate view
         */
        $scope.$on("changeMenu", function (e, value) {
            if (!isNaN(parseInt(value))){
                value = "dateRange."+value;
            }
            $scope.rateMenu = value;

        });

        $scope.$on("errorReceived", function (e, value) {
            $scope.errorMessage = value;
        });

        /**
        * Function ivoked from child classes when the rate details are changed.
        */
        $scope.$on("rateChangedFromDetails", function(e){
            $scope.$broadcast('ratesChanged');
            fetchBasedOnRateDetails();
        });

        /**
        * Fetch the based on rate retails, if the rate has chosen a based on rate.
        */
        var fetchBasedOnRateDetails = function(){
            if($scope.rateData.based_on.id == undefined || $scope.rateData.based_on.id == ""){
                return false;
            }
            var fetchBasedonSuccess = function(data){
                // set basedon data
                $scope.basedonRateData = data;
                $scope.basedonRateData.rate_type = (data.rate_type != null) ? data.rate_type.id : ''
                $scope.basedonRateData.based_on = (data.based_on != null) ? data.based_on.id : '';
                //Broadcast an event to child classed to notify that the based on rates are changed.
                $scope.$broadcast('basedonRatesChanged');
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADRatesSrv.fetchDetails, {
                rateId: $scope.rateData.based_on.id
            }, fetchBasedonSuccess);
        }
        var manipulateAdditionalDetails = function(data){
            // rules and restrictions
            $scope.rateData.min_advanced_booking = data.min_advanced_booking;
            $scope.rateData.max_advanced_booking = data.max_advanced_booking;
            $scope.rateData.min_stay = data.min_stay;
            $scope.rateData.max_stay = data.max_stay;        
            $scope.rateData.use_rate_levels =(data.use_rate_levels) ? true: false ;
            $scope.rateData.deposit_policy_id = data.deposit_policy_id;
            $scope.rateData.cancellation_policy_id = data.cancellation_policy_id;

            //Additional details
            $scope.rateData.is_commission_on = (data.is_commission_on)?true:false;
            $scope.rateData.is_suppress_rate_on = (data.is_suppress_rate_on)?true:false;
            $scope.rateData.is_discount_allowed_on = (data.is_discount_allowed_on)?true:false;
            $scope.rateData.source_id = data.source_id;
            $scope.rateData.market_segment_id = data.market_segment_id;
            $scope.rateData.end_date = data.end_date;

            // addons
            if($scope.rateData.addOns.length>0){
                var tempData = $scope.rateData.addOns;
                $scope.rateData.addOns = [];
                angular.forEach($scope.allAddOns, function(addOns){
                    angular.forEach(tempData, function(addOnsSelected){
                        if(addOns.id === addOnsSelected.id){
                            addOns.isSelected = true;
                            addOns.is_inclusive_in_rate = addOnsSelected.is_inclusive_in_rate ? 'true':'false';
                            $scope.rateData.addOns.push(addOns);
                        };
                    });
                });
            }

        };

        $scope.manipulateData = function(data){
          
            if(data.id) { $scope.rateData.id = data.id; }
            if(!$scope.is_edit) { $scope.is_edit =true };
            $scope.rateData.name= data.name;
            $scope.rateData.description = data.description;
            $scope.rateData.promotion_code = data.promotion_code;
            $scope.rateData.room_type_ids = data.room_type_ids;
            $scope.rateData.date_ranges= data.date_ranges;
            $scope.rateData.rate_type.id = (data.rate_type != null) ? data.rate_type.id : '';
            $scope.rateData.rate_type.name = (data.rate_type != null) ? data.rate_type.name : '';
            $scope.rateData.addOns = data.addons;
            $scope.rateData.charge_code_id = data.charge_code_id;
            $scope.rateData.currency_code_id = data.currency_code_id;

            manipulateAdditionalDetails(data);
                   

            if (data.based_on) {
                $scope.rateData.based_on.id = data.based_on.id;
                $scope.rateData.based_on.type = data.based_on.type;
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
            
        }
   
        // Fetch details success callback for rate edit

        var rateDetailsFetchSuccess = function (data) {

            $scope.hotel_business_date = data.business_date;
            // set rate data for edit   
            
            $scope.manipulateData(data);
            $scope.rateData.id = $stateParams.rateId;
            // navigate to step where user last left unsaved
            if($scope.rateData.date_ranges.length > 0){
                activeDateRange = getActiveDateRange();
                $scope.$emit("changeMenu", activeDateRange);
            }
            else if($scope.rateData.room_type_ids.length > 0){
                $scope.$emit("changeMenu", 'Room types');
            }
            else{
                $scope.$emit("changeMenu", 'Details');
            }
            fetchBasedOnRateDetails(false);
            $scope.$emit('hideLoader');
            $scope.$broadcast('ratesChanged');
        };


        var getActiveDateRange = function(){
            var beginDate = '';
            var endDate = '';
            var hotelBusinessDate = new Date($scope.hotel_business_date).getTime();
            var keepGoing = true;
            var activeDateRange = $scope.rateData.date_ranges[$scope.rateData.date_ranges.length-1].id;
            angular.forEach($scope.rateData.date_ranges, function(dateRange, index){
                if(keepGoing) {
                    beginDate = new Date(dateRange.begin_date).getTime();
                    endDate = new Date(dateRange.end_date).getTime();
                    if (beginDate <= hotelBusinessDate && hotelBusinessDate <= endDate){
                        activeDateRange = "dateRange." + dateRange.id;
                        keepGoing = false;
                    }
                }
            });
            return activeDateRange;
        }

        $scope.$on('deletedAllDateRangeSets', function(e, dateRangeId){
            angular.forEach($scope.rateData.date_ranges, function(dateRange, index){
                if (dateRange.id == dateRangeId){
                    $scope.rateData.date_ranges.splice(index, 1);
                }
            });
        })

        $scope.addNewDateRange = function(){
            $scope.rateMenu ='ADD_NEW_DATE_RANGE';
            // reset calendar
            $scope.$broadcast('resetCalendar');
        };

        $scope.shouldShowAddNewDateRange = function(){
            if($scope.rateMenu === 'ADD_NEW_DATE_RANGE') { return false; }
            if($scope.rateData.based_on.id > 1 && $scope.rateData.rate_type.name != 'Promotional') { return false; }
            if (!$scope.rateData.id || $scope.rateData.room_type_ids.length == 0) { return false; }
            return true;
        };

        /*
         * init call
         */
        $scope.init();


    }
]);
