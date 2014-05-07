admin.controller('ADRatesAddConfigureCtrl', ['$scope', 'ADRatesConfigureSrv', 'ADRatesAddRoomTypeSrv', 'ngDialog',
    function ($scope, ADRatesConfigureSrv, ADRatesAddRoomTypeSrv, ngDialog) {

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

            $scope.invokeApi(ADRatesConfigureSrv.fetchSetsInDateRange, 
                {
                    "id": $scope.dateRange.id
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
            angular.forEach($scope.data.sets, function (value, key) {
                $scope.saveSet(key);
            });
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
            if ($scope.rateData.based_on.id) { return false; }
            if (date_range_end_date){
                return Date.parse(date_range_end_date) > Date.parse($scope.hotel_business_date)
            }
            return false;
        };

        $scope.calculateTheRatesRestriction = function (data) {
            var basedonValue = parseInt($scope.basedonValue);
            var basedonPlusMinus = $scope.basedonPlusMinus;
            angular.forEach(data.sets, function (set, key) {
                angular.forEach(set.room_rates, function (roomRate, key) {

                    if ($scope.basedonType == 'amount') {
                        roomRate.single = basedonPlusMinus == "+" ? (roomRate.single + basedonValue) : (roomRate.single - basedonValue);
                        roomRate["double"] = basedonPlusMinus == "+" ? (roomRate["double"] + basedonValue) : (roomRate["double"] - basedonValue);
                        roomRate.extra_adult = basedonPlusMinus == "+" ? (roomRate.extra_adult + basedonValue) : (roomRate.extra_adult - basedonValue);
                        roomRate.child = basedonPlusMinus == "+" ? (roomRate.child + basedonValue) : (roomRate.child - basedonValue);

                    } else if ($scope.basedonType == 'percent') {
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