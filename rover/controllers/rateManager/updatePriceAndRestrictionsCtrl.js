angular.module('sntRover').controller('UpdatePriceAndRestrictionsCtrl', ['$q', '$scope', '$rootScope', 'ngDialog', 'dateFilter', 'RateMngrCalendarSrv', 'UpdatePriceAndRestrictionsSrv', 'rvPermissionSrv', '$stateParams',
    function ($q, $scope, $rootScope, ngDialog, dateFilter, RateMngrCalendarSrv, UpdatePriceAndRestrictionsSrv, rvPermissionSrv, $stateParams) {
        $scope.data = {};
        $scope.data.roomRateOverrides = [];
        $scope.data.showEditView = false;
        $scope.overrideByDate = [];
        $scope.data.selected_room_type = '';
        $scope.showRestrictionDayUpdate = false;
        $scope.showExpandedView = false;
        $scope.inRoomView = false;

        $scope.init = function () {
            $scope.$emit('hideLoader');
            if ($stateParams.calendarMode !== "ROOM_TYPE_VIEW"){
                $scope.inRoomView = false;
            } else {
                $scope.inRoomView = true;
            }
            if ($stateParams.openUpdatePriceRestrictions){
                $stateParams.openUpdatePriceRestrictions = false;
                $scope.data.roomRateOverrides = [];
                $scope.data.showEditView = false;
                $scope.overrideByDate = [];
                $scope.data.selected_room_type = '';
                $scope.showRestrictionDayUpdate = false;
                $scope.showExpandedView = false;
                if ($scope.popupData.fromRoomTypeView) {
                    computePopupdataForRoomTypeCal();
                } else {
                    computePopUpdataForRateViewCal();
                    if ($scope.popupData.ratesRoomsToggle !== 'ROOMS'){
                        fetchPriceDetailsForRate();
                    }
                }

                if ($scope.popupData.all_data_selected) {
                    $scope.data.isHourly = $scope.calendarData.data[0][$scope.popupData.selectedDate].isHourly;
                }

                $scope.updatePopupWidth();

            setTimeout(function(){
                        $scope.$emit('hideLoader');
            },200);
            }

        };

        $scope.$parent.myScrollOptions = {
            'restictionsList': {
                scrollbars: true,
                interactiveScrollbars: true,
                click: true,
                snap: false
            },
            'priceList': {
                scrollbars: true,
                interactiveScrollbars: true,
                click: true,
                snap: false
            }
        };

        $scope.refreshPopUpScrolls = function () {
            setTimeout(function () {
                if (typeof $scope.myScroll['restictionsList'] !== 'undefined') {
                    $scope.myScroll['restictionsList'].refresh();
                }
                if (typeof $scope.myScroll['priceList'] !== 'undefined') {
                    $scope.myScroll['priceList'].refresh();
                }
                if (typeof $scope.myScroll['restictionWeekDaysScroll'] !== 'undefined') {
                    $scope.myScroll['restictionWeekDaysScroll'].refresh();
                }
            }, 1000);
        };

        $scope.restrictionsList = {
            selectedIndex: -1
        };

        //To display the day options in the popup expanded view
        $scope.daysOptions = {"days": [
                {key: "MON", day: "MONDAY", value: false},
                {key: "TUE", day: "TUESDAY", value: false},
                {key: "WED", day: "WEDNESDAY", value: false},
                {key: "THU", day: "THURSDAY", value: false},
                {key: "FRI", day: "FRIDAY", value: false},
                {key: "SAT", day: "SATURDAY", value: false},
                {key: "SUN", day: "SUNDAY", value: false}
            ],
            "numOfWeeks": 1,
            "applyToPrice": false,
            "applyToRestrictions": false
        };

        $scope.hideUpdatePriceAndRestrictionsDialog = function () {
            ngDialog.close();
        };

        /** 13474
         * method to determine whether the user has permission to update Rate Mgr - Rate Prices
         * @return {Boolean}
         */
        $scope.hasPermissionToUpdateRates = function () {
            return (rvPermissionSrv.getPermissionValue('UPDATE_RATE_PRICE'));
        };
        /**
         * method to determine whether the user has permission to update Rate Mgr - Restrictions
         * @return {Boolean}
         */
        $scope.hasRestrictionPermissions = false;
        $scope.hasPermissionToUpdateRestrictions = function () {
            $scope.hasRestrictionPermissions = (rvPermissionSrv.getPermissionValue('CHANGE_RESTRICTIONS'));
            return (rvPermissionSrv.getPermissionValue('CHANGE_RESTRICTIONS'));
        };

        $scope.getRestriction = function(d, prop){
            if ($scope.popupData){
              var date = $scope.popupData.selectedDate,
                      rateId = $scope.popupData.selectedRate;

              for (var i in $scope.calendarData.data){
                      if (rateId === $scope.calendarData.data[i].id){
                            //each restriction in the obj
                            if (d){
                                for (var x in $scope.calendarData.data[i][date]){
                                    if ($scope.calendarData.data[i][date][x].restriction_type_id === d.id){
                                        return $scope.calendarData.data[i][date][x][prop];
                                    }
                                }
                            }
                        }
                  }
            }
        };
        /**
         * For displaying the price in expanded view
         * Fetch the price info and update the $scope data variable
         */
        var fetchPriceDetailsForRate = function () {
            var data = {};
            data.id = $scope.popupData.selectedRate;
            data.from_date = dateFilter($scope.popupData.selectedDate, 'yyyy-MM-dd');
            data.to_date = dateFilter($scope.popupData.selectedDate, 'yyyy-MM-dd');
            var priceDetailsFetchSuccess = function (response) {
                var roomPriceData = [];
                for (var i in response.data) {
                    var roomType = {};
                    roomType.name = response.data[i].name;
                    roomType.rate = response.data[i][$scope.popupData.selectedDate].single;
                    roomPriceData.push(roomType);
                }
                $scope.data.roomPriceData = roomPriceData;
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(RateMngrCalendarSrv.fetchRoomTypeCalendarData, data, priceDetailsFetchSuccess);


        };

        /**
         * If the popup is opened from room type calendar view.
         * Compute the data structure for the popup display using the 'calendarData' info
         */
        var computePopupdataForRoomTypeCal = function () {
            $scope.data = {};
            $scope.data.id = '';
            $scope.data.name = '';

            $scope.data.single = '';
            $scope.data.double = '';
            $scope.data.extra_adult = '';
            $scope.data.child = '';
            $scope.data.nightly = '';

            $scope.data.nightly_sign = '+';
            $scope.data.nightly_extra_amnt = '';
            $scope.data.nightly_amnt_diff = $rootScope.currencySymbol;

            $scope.data.single_sign = '+';
            $scope.data.single_extra_amnt = '';
            $scope.data.single_amnt_diff = $rootScope.currencySymbol;

            $scope.data.double_sign = '+';
            $scope.data.double_extra_amnt = '';
            $scope.data.double_amnt_diff = $rootScope.currencySymbol;

            $scope.data.extra_adult_sign = '+';
            $scope.data.extra_adult_extra_amnt = '';
            $scope.data.extra_adult_amnt_diff = $rootScope.currencySymbol;

            $scope.data.child_sign = '+';
            $scope.data.child_extra_amnt = '';
            $scope.data.child_amnt_diff = $rootScope.currencySymbol;



            //Flag to check if the rate set amounts are configured for the selected date
            $scope.data.hasAmountConfigured = true;
            selectedDateInfo = {};

            //detect change on data values and update watch obj accordingly
            $scope.$watch("data.single_extra_amnt", function(to, from, evt){
                var via = 'single';
                var d = {};
                d.to = to;
                d.from = from;
                d.via = via;
                $scope.$emit('setReadyButton',d);
                $scope.$emit('applyAllActivity',d);
            });
            $scope.$watch("data.double_extra_amnt", function(to, from, evt){

                var via = 'double';
                var d = {};
                d.to = to;
                d.from = from;
                d.via = via;
                $scope.$emit('setReadyButton',d);
                $scope.$emit('applyAllActivity',d);
            });
            $scope.$watch("data.extra_adult_extra_amnt", function(to, from, evt){

                var via = 'extra_adult';
                var d = {};
                d.to = to;
                d.from = from;
                d.via = via;
                $scope.$emit('setReadyButton',d);
                $scope.$emit('applyAllActivity',d);
            });
            $scope.$watch("data.child_extra_amnt", function(to, from, evt){

                var via = 'child';
                var d = {};
                d.to = to;
                d.from = from;
                d.via = via;
                $scope.$emit('setReadyButton',d);
                $scope.$emit('applyAllActivity',d);
            });

            $scope.$on('apply-all-price-adjust', function (evt, data) {
                var d = data, setVia = data.setFromValue;

                $scope.data.single_sign = d[setVia + '_sign'];
                $scope.data.single_amnt_diff = d[setVia + '_amnt_diff'];
                $scope.data.single_extra_amnt = d[setVia + '_extra_amnt'];

                $scope.data.double_sign = d[setVia + '_sign'];
                $scope.data.double_amnt_diff = d[setVia + '_amnt_diff'];
                $scope.data.double_extra_amnt = d[setVia + '_extra_amnt'];

                $scope.data.extra_adult_sign = d[setVia + '_sign'];
                $scope.data.extra_adult_amnt_diff = d[setVia + '_amnt_diff'];
                $scope.data.extra_adult_extra_amnt = d[setVia + '_extra_amnt'];

                $scope.data.child_sign = d[setVia + '_sign'];
                $scope.data.child_amnt_diff = d[setVia + '_amnt_diff'];
                $scope.data.child_extra_amnt = d[setVia + '_extra_amnt'];

            });

            //Get the rate/restriction details for the selected cell
            if ($scope.popupData.all_data_selected) {
                selectedDateInfo.restrictions = $scope.calendarData.rate_restrictions[$scope.popupData.selectedDate];
                $scope.data.isHourly = $scope.calendarData.data[0][$scope.popupData.selectedDate].isHourly;
            } else {
                for (var i in $scope.calendarData.data) {

                    if ($scope.calendarData.data[i].id === $scope.popupData.selectedRoomType) {
                        selectedDateInfo = $scope.calendarData.data[i][$scope.popupData.selectedDate];
                        $scope.data.id = $scope.calendarData.data[i].id;
                        $scope.data.name = $scope.calendarData.data[i].name;
                        if (typeof selectedDateInfo !== "undefined") {
                            $scope.data.isHourly = selectedDateInfo.isHourly;
                            //Check if the rate set amounts are configured for the selected date
                            if (selectedDateInfo.single === undefined &&
                                    selectedDateInfo.double === undefined &&
                                    selectedDateInfo.extra_adult === undefined &&
                                    selectedDateInfo.child === undefined &&
                                    (selectedDateInfo.isHourly && !selectedDateInfo.nightly === undefined)) { //CICO-9555
                                $scope.data.hasAmountConfigured = false;
                            } else {
                                $scope.data.single = selectedDateInfo.single;
                                $scope.data.double = selectedDateInfo.double;
                                $scope.data.extra_adult = selectedDateInfo.extra_adult;
                                $scope.data.child = selectedDateInfo.child;
                                //(CICO-9555
                                $scope.data.nightly = selectedDateInfo.nightly;
                                //CICO-9555)


                                //CICO-15561
                                var selected_room_type = $scope.data.name,
                                        selected_date = $scope.popupData.selectedDate,
                                        foundOverrides = [];

                                if ($scope.calendarData.room_type_restrictions) {
                                    for (var i in $scope.calendarData.room_type_restrictions) {
                                        if ($scope.calendarData.room_type_restrictions[i].date === selected_date) {
                                            foundOverrides = $scope.calendarData.room_type_restrictions[i];
                                        }

                                    }
                                }
                                $scope.data.selected_room_type = selected_room_type;
                                $scope.data.roomRateOverrides = foundOverrides;
                                $scope.data.selected_room_type_overrides;

                                //CICO-15561
                            }
                        }
                    }
                }
            }

            var restrictionTypes = {};
            var rTypes = dclone($scope.calendarData.restriction_types);
            for (var i in rTypes) {
                restrictionTypes[rTypes[i].id] = rTypes[i];
                var item = rTypes[i];
                var itemID = rTypes[i].id;
                item.days = "";
                item.isRestrictionEnabled = false;
                item.isMixed = false;
                item.hasChanged = false;
                item.showEdit = false;
                item.hasEdit = isRestictionHasDaysEnter(rTypes[i].value);

                if (selectedDateInfo !== undefined) {
                    for (var i in selectedDateInfo.restrictions) {
                        if (selectedDateInfo.restrictions[i].restriction_type_id === itemID) {
                            item.days = selectedDateInfo.restrictions[i].days;
                            item.isOnRate = selectedDateInfo.restrictions[i].is_on_rate;
                            item.isRestrictionEnabled = true;
                            break;
                        }
                    }
                }
                //In all data section, if the restriction is disabled(if enabled, all rates have the restriction enabled for that date, hence not mixed),
                //we should check if the restriction is mixed restriction
                if ($scope.popupData.all_data_selected && !item.isRestrictionEnabled && isMixed(itemID)) {
                    item.isMixed = true;
                }

                restrictionTypes[itemID] = item;
            }
            $scope.data.restrictionTypes = restrictionTypes;

        };


        /**
         * If the popup is opened from rate type calendar view.
         * Compute the data structure for the popup display using the 'calendarData' info
         */
        var computePopUpdataForRateViewCal = function () {
            $scope.data = {};
            $scope.data.id = "";
            $scope.data.name = "";

            var selectedDateInfo = {};
            //Get the rate/restriction details for the selected cell
            if ($scope.popupData.all_data_selected) {
                selectedDateInfo = $scope.calendarData.all_rates[$scope.popupData.selectedDate];

            } else {
                for (var i in $scope.calendarData.data) {
                    if ($scope.calendarData.data[i].id === $scope.popupData.selectedRate) {
                        selectedDateInfo = $scope.calendarData.data[i][$scope.popupData.selectedDate];
                        if (selectedDateInfo === []){
                            selectedDateInfo = $scope.calendarData.all_rates[$scope.popupData.selectedDate];
                        }
                        $scope.data.id = $scope.calendarData.data[i].id;
                        $scope.data.name = $scope.calendarData.data[i].name;
                        $scope.data.isHourly = $scope.calendarData.data[i].isHourly;
                    }
                }
            }

            var restrictionTypes = {};
            var rTypes = dclone($scope.calendarData.restriction_types);
            if ($scope.ratesRoomsToggle === 'ROOMS'){
                selectedDateInfo = $scope.popupData.room_restrictions;
            }
            for (var i in rTypes) {
                restrictionTypes[rTypes[i].id] = rTypes[i];
                var item = rTypes[i];
                var itemID = rTypes[i].id;
                item.days = "";
                item.isRestrictionEnabled = false;
                item.isMixed = false;
                item.hasChanged = false;
                item.showEdit = false;
                item.hasEdit = isRestictionHasDaysEnter(rTypes[i].value);

                if (selectedDateInfo !== undefined) {
                    for (var i in selectedDateInfo) {
                        if (selectedDateInfo[i].restriction_type_id === itemID) {
                            item.days = selectedDateInfo[i].days;
                            item.isOnRate = selectedDateInfo[i].is_on_rate;
                            item.isRestrictionEnabled = true;
                            break;
                        }
                    }
                }
                //In all data section, if the restriction is disabled(if enabled, all roomrates have the restriction enabled for that date, hence not mixed),
                //we should check if the restriction is mixed restriction
                if ($scope.popupData.all_data_selected && !item.isRestrictionEnabled && isMixed(itemID)) {
                    item.isMixed = true;
                }

                restrictionTypes[itemID] = item;
            }
            $scope.data.restrictionTypes = restrictionTypes;
        };

        var isRestictionHasDaysEnter = function (restriction) {
            var ret = false;
            if (['MIN_STAY_LENGTH', 'MAX_STAY_LENGTH', 'MIN_STAY_THROUGH', 'MIN_ADV_BOOKING', 'MAX_ADV_BOOKING'].indexOf(restriction) >= 0) {
                ret = true;
            }
            return ret;
        };

        /* This does not handle the case of "Selected for all Rates", as this can be deduced from allData
         */
        var isMixed = function (id) {
            var mixed = false;
            for (var row in $scope.calendarData.data) {
                if ($scope.popupData.fromRoomTypeView) {
                    var datedata = $scope.calendarData.data[row][$scope.popupData.selectedDate].restrictions;
                } else {
                    var datedata = $scope.calendarData.data[row][$scope.popupData.selectedDate];
                }
                for (var restriction in datedata) {
                    if (datedata[restriction]['restriction_type_id'] === id) {
                        mixed = true;
                        break;
                    }
                }
            }
            return mixed;
        };
        /**
         * Click handler for restriction on/off buttons
         * Enable disable restriction.
         */
        $scope.toggleRestrictions = function (id, days, selectedIndex, restrictionType) {
            if (restrictionType){
                if (restrictionType.description === 'Has Restrictions'){
                    return;
                }
            }
            var action = $scope.data.restrictionTypes[id].isRestrictionEnabled;

            $scope.onOffRestrictions(id, (action) ? 'DISABLE' : 'ENABLE', days, selectedIndex);
        };
        /**
         * Click handler for restriction on/off buttons
         * Enable disable restriction.
         */
        $scope.onOffRestrictions = function (id, action, days, selectedIndex) {
            $scope.data.showEditView = false;
            $scope.restrictionsList.selectedIndex = selectedIndex;

            angular.forEach($scope.data.restrictionTypes, function (value, key) {
                value.showEdit = false;
            });

            /*Prompt the user for number of days
             * Only if enabling a restriction.
             */
            var shouldShowEdit = false;
            if ($scope.data.restrictionTypes[id].hasEdit && action === "ENABLE") {
                shouldShowEdit = true;
            }

            if ($scope.popupData.all_data_selected && action === "ENABLE" && $scope.data.restrictionTypes[id].isMixed) {
                shouldShowEdit = true;
            }


            if (shouldShowEdit) {
                $scope.data.showEditView = true;
                $scope.data.restrictionTypes[id].showEdit = true;
                $scope.updatePopupWidth();
                return false;
            }
            if (action === "ENABLE") {
                $scope.data.restrictionTypes[id].isRestrictionEnabled = true;
                $scope.data.restrictionTypes[id].hasChanged = true;
                $scope.data.restrictionTypes[id].isMixed = false;
            }
            if (action === "DISABLE") {
                $scope.data.restrictionTypes[id].isRestrictionEnabled = false;
                $scope.data.restrictionTypes[id].hasChanged = true;
                $scope.data.restrictionTypes[id].isMixed = false;
            }
            $scope.updatePopupWidth();

        };



        $scope.updatePopupWidth = function () {
            var width = 270;
            if ($scope.data.showEditView) {
                width = width + 400;
            }
            if ($scope.showExpandedView) {
                width = width + 270;
            }
            if ($scope.popupData.fromRoomTypeView && !$scope.data.showEditView && $scope.data.hasAmountConfigured && $scope.hasPermissionToUpdateRates()) {
                width = width + 400;
            }
            if ($scope.showExpandedView && !$scope.popupData.fromRoomTypeView && !$scope.popupData.all_data_selected) {
                width = width + 270;
            }
            $(".ngdialog-content").css("width", width);

        };

        $scope.expandButtonClicked = function () {
            $scope.showExpandedView = !$scope.showExpandedView;
            $scope.updatePopupWidth();
            $scope.refreshPopUpScrolls();
        };

        /**
         * Computes all the selected dates
         */
        var getAllSelectedDates = function () {

            var datesList = [];
            //First entry in the dates list is the current date
            datesList.push($scope.popupData.selectedDate);
            //If the day value is true, then it is a checked(selected) day
            var selectedDays = [];

            $($scope.daysOptions.days).each(function () {
                if (this.value === true) {
                    selectedDays.push(this.key.toUpperCase());
                }
            });

            //We dont have to add more dates to the dates list if no day is checked
            if (selectedDays.length <= 0) {
                return datesList;
            }

            //For the selected date range, if the day matches the selected day of week,
            //Add the date to the datesList
            for (var i = 1; i < ($scope.daysOptions.numOfWeeks) * 7; i++) {
                var date = new Date($scope.popupData.selectedDate);
                var newDate = new Date(date.getTime() + (i * 24 * 60 * 60 * 1000));
                var dayOfWeek = dateFilter(newDate, 'EEE');
                if (selectedDays.indexOf(dayOfWeek.toUpperCase()) >= 0) {
                    datesList.push(getDateString(newDate));

                }
            }
            return datesList;
        };

        var calculateDetailsToSave = function (datesSelected) {
            var details = [];

            // We do not show the apply to restrictions option if not from room type calendar view
            // So setting the flag by default as true
            if (!$scope.popupData.fromRoomTypeView) {
                $scope.daysOptions.applyToRestrictions = true;
            }

            _.each(datesSelected,function(selectedDate, i) {
                /**
                 * for dates other than the selected column, the changes need to be propagated only if the 'applyToPrice'
                 * and 'applyToRestrictions' are set
                 */

                if (i === 0 || !!$scope.daysOptions.applyToRestrictions || !!$scope.daysOptions.applyToPrice) {

                    var restrictionDetails = {};

                    restrictionDetails.from_date = selectedDate;
                    restrictionDetails.to_date = selectedDate;
                    restrictionDetails.restrictions = [];

                    /**
                     * Irrespective of applyToRestrictions flag being set, for the selected rate the restrictions
                     * are to be set to the selected room type / all room types appropriately
                     */
                    if ($scope.daysOptions.applyToRestrictions || i === 0) {
                        angular.forEach($scope.data.restrictionTypes, function (value, key) {
                            if (value.hasChanged) {
                                var action = "";
                                if (value.isRestrictionEnabled) {
                                    action = "add";
                                } else {
                                    action = "remove";
                                }

                                var restrictionData = {
                                    "action": action,
                                    "restriction_type_id": value.id,
                                    "days": value.days
                                };
                                restrictionDetails.restrictions.push(restrictionData);
                            }
                        });
                    }

                    //The popup appears by from the rate calendar view
                    if ($scope.popupData.fromRoomTypeView) {
                        /**
                         * Irrespective of applyToRestrictions flag being set, for the selected rate the restrictions
                         * are to be set to the selected room type / all room types appropriately
                         */

                        if (i === 0 || $scope.daysOptions.applyToPrice) {
                            restrictionDetails.single = {};
                            restrictionDetails.double = {};
                            restrictionDetails.extra_adult = {};
                            restrictionDetails.child = {};
                            restrictionDetails.nightly = {};

                            //(CICO-9555
                            if ($scope.data.nightly_extra_amnt !== "") {
                                restrictionDetails.nightly.value = $scope.data.nightly_sign + $scope.data.nightly_extra_amnt;

                                if ($scope.data.nightly_amnt_diff_sign !== "%") {
                                    restrictionDetails.nightly.type = "amount_diff";
                                } else {
                                    restrictionDetails.nightly.type = "percent_diff";
                                }

                            } else {
                                restrictionDetails.nightly.value = $scope.data.nightly;
                                restrictionDetails.nightly.type = "amount_new";
                            }
                            //CICO-9555)

                            if ($scope.data.single_extra_amnt !== "") {
                                restrictionDetails.single.value = $scope.data.single_sign + $scope.data.single_extra_amnt;

                                if ($scope.data.single_amnt_diff !== "%") {
                                    restrictionDetails.single.type = "amount_diff";
                                } else {
                                    restrictionDetails.single.type = "percent_diff";
                                }

                            } else {
                                restrictionDetails.single.value = $scope.data.single;
                                restrictionDetails.single.type = "amount_new";
                            }

                            if ($scope.data.double_extra_amnt !== "") {
                                restrictionDetails.double.value = $scope.data.double_sign + $scope.data.double_extra_amnt;
                                if ($scope.data.double_amnt_diff !== "%") {
                                    restrictionDetails.double.type = "amount_diff";
                                } else {
                                    restrictionDetails.double.type = "percent_diff";
                                }

                            } else {
                                restrictionDetails.double.value = $scope.data.double;
                                restrictionDetails.double.type = "amount_new";
                            }

                            if ($scope.data.extra_adult_extra_amnt !== "") {
                                restrictionDetails.extra_adult.value = $scope.data.extra_adult_sign + $scope.data.extra_adult_extra_amnt;
                                if ($scope.data.extra_adult_amnt_diff !== "%") {
                                    restrictionDetails.extra_adult.type = "amount_diff";
                                } else {
                                    restrictionDetails.extra_adult.type = "percent_diff";
                                }

                            } else {
                                restrictionDetails.extra_adult.value = $scope.data.extra_adult;
                                restrictionDetails.extra_adult.type = "amount_new";
                            }

                            if ($scope.data.child_extra_amnt !== "") {
                                restrictionDetails.child.value = $scope.data.child_sign + $scope.data.child_extra_amnt;
                                if ($scope.data.child_amnt_diff !== "%") {
                                    restrictionDetails.child.type = "amount_diff";
                                } else {
                                    restrictionDetails.child.type = "percent_diff";
                                }

                            } else {
                                restrictionDetails.child.value = $scope.data.child;
                                restrictionDetails.child.type = "amount_new";
                            }
                            restrictionDetails.single.value = parseFloat(restrictionDetails.single.value);
                            restrictionDetails.double.value = parseFloat(restrictionDetails.double.value);
                            restrictionDetails.extra_adult.value = parseFloat(restrictionDetails.extra_adult.value);
                            restrictionDetails.child.value = parseFloat(restrictionDetails.child.value);
                            restrictionDetails.nightly.value = parseFloat(restrictionDetails.nightly.value);
                        }
                    }
                    details.push(restrictionDetails);
                }
            });

            return details;
        };

        /**
         * Click handler for save button in popup.
         * Calls the API and dismiss the popup on success
         */

        $scope.saveRestriction = function () {
            if ($scope.calendarData.is_child){
                //manual update is disabled for rates which are based on other rates
                $scope.daysOptions.applyToPrice = false;
            }

            //The dates to which the restriction should be applied
            var datesSelected = getAllSelectedDates();

            var data = {};
            data.rate_id = $scope.popupData.selectedRate;
            data.room_type_id = $scope.popupData.selectedRoomType;
            data.rate_ids = [];
            var ratesInView = $scope.ratesDisplayed;
            var ratesDisplayed = ratesInView.length;

            if (ratesInView){// multiple rates may be selected in view, check for 'all_data_selected'
                for (var f in ratesInView){
                    if (ratesInView.length > 1){
                        data.rate_ids.push(ratesInView[f].id);//these will always be sent to the api to apply restrictions to all rates in filter
                    }
                }
            }

           // data.room_ids = [];
            var all = $scope.popupData.all_data_selected;//if a user wants All rates/rooms applied to or not
            var rateView, allRooms = $scope.calendarData.data;
            var room, totalRooms = allRooms.length;
            if ($scope.ratesRoomsToggle === 'RATES'){
                rateView = true;
                if ($scope.ratesDisplayed.length === 1){
                    rateView = false;//the screen defaults to room view if only 1 is selected
                }
            } else {
                rateView = false;
            }
            
            if (all){
                if (!rateView){ //for room view
                    /*for (var c in allRooms){
                        room = allRooms[c];
                        data.room_ids.push(room.id);//currently invalid param 'room_ids'
                    }*/
                    if (ratesDisplayed > 1 || totalRooms > 1){
                        delete data.room_type_id;
                    }
                } else {
                    delete data.room_type_id;
                  //  delete data.room_ids;
                    if (ratesDisplayed > 1){
                        delete data.rate_id;
                    }
                }
            } else {//otherwise just send the selected room_type_id
                if (rateView){
                    delete data.rate_ids;
                } else {//in room view remove the rate_id param
//                    delete data.rate_id;  
                }
               // delete data.room_ids;
            }

            if (ratesDisplayed === 1){
                delete data.rate_ids;
            }
            

            data.details = calculateDetailsToSave(datesSelected);
            var saveRestrictionSuccess = function () {

                ngDialog.close();

                $scope.$emit('showLoader');
                $rootScope.$broadcast('loadingRooms', true);
                setTimeout(function(){
                        $scope.refreshCalendar();
                }, 250);
            };

            $scope.invokeApi(UpdatePriceAndRestrictionsSrv.savePriceAndRestrictions, data, saveRestrictionSuccess);

        };


        $scope.clearOverrides = function (data) {
            $scope.$emit('showLoader');
            var onsuccess = function (successData) {
                $scope.refreshCalendar();
                ngDialog.close();
            };
            data.room_type_id = data.selectedRoomType;

            $scope.invokeApi(RateMngrCalendarSrv.updateRoomTypeOverride, data, onsuccess);
        };


        $scope.hasOverrideValue = function (date, room_type) {
            for (var i in $scope.overrideByDate) {
                if ($scope.overrideByDate[i].date === date) {
                    for (var n in $scope.overrideByDate[i].room_types_with_override) {
                        if ($scope.overrideByDate[i].room_types_with_override[n] && room_type){
                            if ($scope.overrideByDate[i].room_types_with_override[n].toLowerCase() === room_type.toLowerCase()) {
                                return 'true';
                            }
                        }
                    }
                }
            }
            return 'false';
        };
        $scope.hasAnyOverride = function () {
            $scope.overrideByDate = [];
            //date > room type > occupancy
            var all = $scope.current_overrides, d, occupancyOverrides;
            for (var x in all) {
                d = all[x].date;
                var occupancyOverrides, room_types_with_override = [], room_types_parent = [], occupancies_with_override = [];
                for (var i in all[x].room_types) {
                    room_types_parent.push({
                        'name': all[x].room_types[i].room_type.name,
                        'with_override': all[x].room_types[i].has_override
                    });

                    if (all[x].room_types[i].has_override) {
                        if (all[x].room_types[i].has_override.length > 0) {
                            room_types_with_override.push(all[x].room_types[i].room_type.name);
                            if (all[x].room_types[i].has_override) {
                                occupancies_with_override = all[x].room_types[i].has_override;
                            }
                        }
                    }
                }
                if (room_types_with_override.length > 0) {
                    occupancyOverrides = 'true';
                }
                $scope.overrideByDate.push({
                    'date': d,
                    'occupancies_with_override': occupancies_with_override,
                    'room_types_with_override': room_types_with_override,
                    'room_types': room_types_parent,
                    'overrides': occupancyOverrides
                });
            }
            return $scope.hasOverrideValue($scope.popupData.selectedDate, $scope.data.selected_room_type);
        };




        $scope.hasOverride = function (a, label) {
            var room_type = $scope.data.selected_room_type, ovrride,
                    o = a.roomRateOverrides;

            var selected_info;
            if (o){
                if (o.room_types) {
                    for (var i in o.room_types) {
                        if (o.room_types[i].room_type.name === room_type) {
                            selected_info = o.room_types[i];
                        }
                    }
                    $scope.hasAnyOverride();
                    var lbl = label.toLowerCase();
                    for (var w in selected_info.has_override) {
                        if (selected_info.has_override[w].toLowerCase() === lbl) {
                            $scope.selected_has_override = 'true';
                            return true;
                        }
                    }
                    $scope.selected_has_override = 'false';
                    return false;
                }

                return false;
            }
        };

    }]);
