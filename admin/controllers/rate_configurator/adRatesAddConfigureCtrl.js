admin.controller('ADRatesAddConfigureCtrl', ['$scope', 'ADRatesConfigureSrv', 'ADRatesAddRoomTypeSrv', 'ADRatesRangeSrv','ngDialog',
    function ($scope, ADRatesConfigureSrv, ADRatesAddRoomTypeSrv, ADRatesRangeSrv, ngDialog) {
        //expand first set
        $scope.currentClickedSet = 0;

        $scope.init = function(){
            // in edit mode last date range data will be expanded and details can't by click
            // so intiating fetching data
            if($scope.rateMenu === ("dateRange." + $scope.dateRange.id)){
                fetchData($scope.dateRange.id);
            }
        };


        // data range set expanded view
        $scope.setCurrentClickedSet = function (index) {
            $scope.currentClickedSet = index;
        };

        // data range set collapsed view
        $scope.unsetCurrentClickedSet = function (index) {
            $scope.currentClickedSet = -1;
        };

        // collapse current active date range set view
        $scope.cancelClick = function () {
            $scope.currentClickedSet = -1;
        };

        console.log("child initialize");

        $scope.$on("fetchLastDateRangeSet", function(e){
            console.log("inside sdfhsldjfl");
            // webservice call to fetch each date range details
            fetchData(id);
        });

        $scope.getDateRangeData = function(id){
            // webservice call to fetch each date range details
            fetchData(id);
            $scope.$emit('changeMenu', id)
        };

        var fetchData = function (dateRangeId) {

            var fetchSetsInDateRangeSuccessCallback = function (data) {
                $scope.$emit('hideLoader');
                
                $scope.data = data;

                // Manually build room rates dictionary - if Add Rate
                angular.forEach($scope.data.sets, function (value, key) {
                    
                  
                    room_rates = []
                    if (value.room_rates.length === 0) {
                        angular.forEach($scope.data.room_types, function (room_type, key) {
                            data = {
                                "id": room_type.id,
                                "name": room_type.name,
                                "single": "",
                                "double": "",
                                "extra_adult": "",
                                "child": "",
                                "isSaved": false
                            }
                            room_rates.push(data);
                        });
                        value.room_rates = room_rates;
                    }
                });



            };
            // $scope.dateRange.id
            $scope.invokeApi(ADRatesConfigureSrv.fetchSetsInDateRange, 
                {
                    "id": dateRangeId
                }, fetchSetsInDateRangeSuccessCallback);
        };

        

        $scope.saveSet = function (index) {

            var saveSetSuccessCallback = function () {
                $scope.$emit('hideLoader');
                $scope.data.sets[index].isSaved = true;
            };

            var saveSetFailureCallback = function (errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
                $scope.$emit("errorReceived", errorMessage);
            };

            // API request do not require all keys except room_types
            var unwantedKeys = ["room_types"];
            var setData = dclone($scope.data.sets[index], unwantedKeys);

            $scope.invokeApi(ADRatesConfigureSrv.saveSet, setData, saveSetSuccessCallback, saveSetFailureCallback);

        };

        $scope.moveAllSingleToDouble = function (index) {
            angular.forEach($scope.data.sets[index].room_rates, function (value, key) {
                if (value.hasOwnProperty("single") && value.single != "") {
                    value.double = value.single;
                }
            });
        };

        $scope.moveSingleToDouble = function (parentIndex, index) {
            if ($scope.data.sets[parentIndex].room_rates[index].single != "" && $scope.data.sets[parentIndex].room_rates[index].hasOwnProperty("single")) {
                $scope.data.sets[parentIndex].room_rates[index].double = $scope.data.sets[parentIndex].room_rates[index].single;
            }
        };

        $scope.deleteSet = function (id, index) {
            var successDeleteCallBack = function () {
                $scope.$emit('hideLoader');
                var sets = $scope.data.sets;
                $scope.data.sets.splice(index, 1);
            };
            $scope.invokeApi(ADRatesConfigureSrv.deleteSet, id, successDeleteCallBack);
        };

        $scope.checkFieldEntered = function (index) {
            var enableSetUpdateButton = false;
            angular.forEach($scope.data.sets[index].room_rates, function (value, key) {
                if (value.hasOwnProperty("single") && value.single != "") {
                    enableSetUpdateButton = true;
                }
                if (value.hasOwnProperty("double") && value.double != "") {
                    enableSetUpdateButton = true;
                }
                if (value.hasOwnProperty("extra_adult") && value.extra_adult != "") {
                    enableSetUpdateButton = true;
                }
                if (value.hasOwnProperty("child") && value.child != "") {
                    enableSetUpdateButton = true;
                }
            });
            if (enableSetUpdateButton) {
                $scope.data.sets[index].isEnabled = true;
            } else {
                $scope.data.sets[index].isEnabled = false;
            }
            return enableSetUpdateButton;
        };

        $scope.saveDateRange = function () {
            
            /*if($scope.dateRange.id < 0){
                $scope.saveDateRangeFirstTime();
                return false;
            }*/

            angular.forEach($scope.data.sets, function (value, key) {
                $scope.saveSet(key);
            });

        };

        /**
        * If the rate is a based on rate, then save the entair date range data
        */
        /*$scope.saveDateRangeFirstTime = function(){
            angular.forEach($scope.data.sets, function (set, key) {
                delete set["id"];
            });
            var dateRangeData = {
                'id': $scope.rateData.id,
                'data': {
                    'begin_date': $scope.dateRange.begin_date,
                    'end_date': $scope.dateRange.end_date,
                    'sets': $scope.data.sets
                }
            };
          
            var saveDateRangeSuccess = function(data){
                $scope.$emit('hideLoader');
            }
            $scope.invokeApi(ADRatesRangeSrv.postDateRange, dateRangeData, saveDateRangeSuccess);
        };
*/


        $scope.popupCalendar = function () {
           // ADRatesConfigureSrv.setCurrentSetData($scope.data);
            ngDialog.open({
                template: '/assets/partials/rates/adAddRatesCalendarPopup.html',
                controller: 'ADDateRangeModalCtrl',
                className: 'ngdialog-theme-default calendar-modal',
                scope: $scope
            });
        };

        $scope.toggleDays = function (index, mod) {
            angular.forEach($scope.data.sets, function (value, key) {
                $scope.data.sets[key][mod] = false;
            });
            $scope.data.sets[index][mod] = true;
        };

        // check whether date range is past
        $scope.is_date_range_editable = function(date_range_end_date){
            if($scope.is_edit){
                if ($scope.rateData.based_on.id) { return false; }
                if (date_range_end_date){
                    return Date.parse(date_range_end_date) > Date.parse($scope.hotel_business_date)
                }
            }
            return true;
        };

        $scope.init();
    }
]);