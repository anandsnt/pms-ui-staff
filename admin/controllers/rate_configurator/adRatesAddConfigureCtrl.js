admin.controller('ADRatesAddConfigureCtrl', ['$scope', 'ADRatesConfigureSrv', 'ADRatesAddRoomTypeSrv', 'ngDialog',
    function ($scope, ADRatesConfigureSrv, ADRatesAddRoomTypeSrv, ngDialog) {
        $scope.sets = "";
        $scope.currentClickedSet = 0;
        $scope.selectedCalendarInitialData = {};
        if ($scope.hasBaseRate) {
            ADRatesConfigureSrv.hasBaseRate = true;
        }

        ADRatesConfigureSrv.setCurrentSetData($scope.$parent.step);
        $scope.$parent.step = ADRatesConfigureSrv.getCurrentSetData();

        $scope.$on('dateRangeUpdated', function (event, data) {
            $scope.$parent.step = data;
        });

        // disable date range edit
        $scope.disableDateSetEdit = function () {
            if ($scope.hasBaseRate) {
                return true;
            }
            if ($scope.edit_mode) {
                if (!$scope.step.is_editable) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        $scope.disableDateRangeEdit = function () {
            if ($scope.edit_mode) {
                if (!$scope.step.is_editable) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }


        var dateRangeId = $scope.$parent.step.id;
        $scope.fetchSetsInDateRangeSuccessCallback = function (data) {
            $scope.$emit('hideLoader');

            $scope.data = $scope.calculateTheRatesRestriction(data);

            // manually build room_rates for add mode   
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
        $scope.fetchSetsInDateRangeFailureCallback = function (errorMessage) {
            $scope.$emit('hideLoader');
        };
        $scope.setCurrentClickedSet = function (index) {
            $scope.currentClickedSet = index;
        };

        $scope.unsetCurrentClickedSet = function (index) {
            $scope.currentClickedSet = -1;
        };

        $scope.fetchData = function () {
            console.log("fetchData");
            $scope.invokeApi(ADRatesConfigureSrv.fetchSetsInDateRange, {
                "id": dateRangeId
            }, $scope.fetchSetsInDateRangeSuccessCallback, $scope.fetchSetsInDateRangeFailureCallback);
        };
        $scope.fetchData();

        $scope.saveSetFailureCallback = function (errorMessage) {
            $scope.$emit('hideLoader');
            $scope.errorMessage = errorMessage;
            $scope.$emit("errorReceived", errorMessage);
        };
        $scope.cancelClick = function () {
            $scope.currentClickedSet = -1;
        };
        $scope.saveSet = function (index) {
            var saveSetSuccessCallback = function () {
                $scope.$emit('hideLoader');
                $scope.data.sets[index].isSaved = true;
            };
            var unwantedKeys = ["room_types"];
            var setData = dclone($scope.data.sets[index], unwantedKeys);
            $scope.updateData = setData;
            $scope.updateData.room_rates = $scope.data.sets[index].room_rates;
            $scope.invokeApi(ADRatesConfigureSrv.saveSet, $scope.updateData, saveSetSuccessCallback, $scope.saveSetFailureCallback);

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

        $scope.saveWholeData = function () {
            angular.forEach($scope.data.sets, function (value, key) {
                $scope.saveSet(key);
            });
        };



        $scope.popupCalendar = function () {


            ngDialog.open({
                template: '/assets/partials/rates/adAddRatesCalendarPopup.html',
                controller: 'ADDateRangeModalCtrl',
                className: 'ngdialog-theme-default calendar-modal'
            });
        };
        $scope.toggleDays = function (index, mod) {
            angular.forEach($scope.data.sets, function (value, key) {
                $scope.data.sets[key][mod] = false;
            });
            $scope.data.sets[index][mod] = true;
        };

        $scope.calculateTheRatesRestriction = function (data) {

            if (!$scope.hasBaseRate) {
                return data;
            }

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