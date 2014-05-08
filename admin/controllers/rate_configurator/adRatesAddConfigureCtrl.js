admin.controller('ADRatesAddConfigureCtrl', ['$scope', 'ADRatesConfigureSrv', 'ADRatesAddRoomTypeSrv', 'ADRatesRangeSrv','ngDialog',
    function ($scope, ADRatesConfigureSrv, ADRatesAddRoomTypeSrv, ADRatesRangeSrv, ngDialog) {
        //expand first set
        $scope.currentClickedSet = 0;


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

        var fetchData = function () {

            var fetchSetsInDateRangeSuccessCallback = function (data) {
                $scope.$emit('hideLoader');
                if($scope.dateRange.id < 0){
                    console.log("beforr0");
                    $scope.calculateTheRatesRestriction(data);
                }
                $scope.data = data;

                // Manually build room rates dictionary - if Add Rate
                angular.forEach($scope.data.sets, function (value, key) {
                    
                    if($scope.dateRange.id < 0){
                        value.id = value.id * -1;
                    }

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

            
            var dateRangeId = $scope.dateRange.id;
            if(dateRangeId < 0){
                dateRangeId = dateRangeId * -1;
            }

            $scope.invokeApi(ADRatesConfigureSrv.fetchSetsInDateRange, 
                {
                    "id": dateRangeId
                }, fetchSetsInDateRangeSuccessCallback);
        };

        // webservice call to fetch each date range details
        fetchData();

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
                $scope.data.sets[parentIndex].room_rates[index].double = $scope.data.sets[parentIndex].room_types[index].single;
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
            
            if($scope.dateRange.id < 0){
                $scope.saveDateRangeFirstTime();
                return false;
            }

            angular.forEach($scope.data.sets, function (value, key) {
                $scope.saveSet(key);
            });

        };

        /**
        * If the rate is a based on rate, then save the entair date range data
        */
        $scope.saveDateRangeFirstTime = function(){
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

        $scope.calculateTheRatesRestriction = function (data) {
            var basedonValue = parseInt($scope.rateData.based_on.value_abs);
            var basedonPlusMinus = $scope.rateData.based_on.value_sign;

            angular.forEach(data.sets, function (set, key) {
                angular.forEach(set.room_rates, function (roomRate, key) {

                    if ($scope.rateData.based_on.type == 'amount') {
                        console.log("amout");
                        roomRate.single = basedonPlusMinus == "+" ? (roomRate.single + basedonValue) : (roomRate.single - basedonValue);
                        roomRate["double"] = basedonPlusMinus == "+" ? (roomRate["double"] + basedonValue) : (roomRate["double"] - basedonValue);
                        roomRate.extra_adult = basedonPlusMinus == "+" ? (roomRate.extra_adult + basedonValue) : (roomRate.extra_adult - basedonValue);
                        roomRate.child = basedonPlusMinus == "+" ? (roomRate.child + basedonValue) : (roomRate.child - basedonValue);

                    } else if ($scope.rateData.based_on.type == 'percent') {
                        console.log("percent");
                        
                        roomRate.single = basedonPlusMinus == "+" ? (roomRate.single + (basedonValue / 100 * roomRate.single)) : (roomRate.single - (basedonValue / 100 * roomRate.single));
                        roomRate["double"] = basedonPlusMinus == "+" ? (roomRate["double"] + (basedonValue / 100 * roomRate["double"])) : (roomRate["double"] - (basedonValue / 100 * roomRate["double"]));
                        roomRate.extra_adult = basedonPlusMinus == "+" ? (roomRate.extra_adult + (basedonValue / 100 * roomRate.extra_adult)) : (roomRate.extra_adult - (basedonValue / 100 * roomRate.extra_adult));
                        roomRate.child = basedonPlusMinus == "+" ? (roomRate.child + (basedonValue / 100 * roomRate.child)) : (roomRate.child - (basedonValue / 100 * roomRate.child));

                    }

                });
            });
            return data;
        };
    }
]);