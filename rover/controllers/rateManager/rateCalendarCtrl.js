sntRover.controller('RateCalendarCtrl', [
    '$scope', '$rootScope', 'RateMngrCalendarSrv', 'dateFilter', 'ngDialog', '$stateParams',
    function($scope, $rootScope, RateMngrCalendarSrv, dateFilter, ngDialog, $stateParams) {
        $scope.$parent.myScrollOptions = {
            RateCalendarCtrl: {
                scrollX: true,
                scrollbars: true,
                interactiveScrollbars: true,
                click: true,
                snap: false
            }
        };
        /* Cute workaround. ng-iscroll creates myScroll array in its Scope's $parent.
         * Since our controller's scope is two step above the scroll div,
         * We create an empty myScroll here. ng-iscroll will see this item, and use the same.
         * Note: If a subscope requires another iScroll, this approach may not work.
         */
        $scope.hideRoomsDownArrow = false;
        $scope.applyAllShow = '';
        $scope.lastClickedApply = '';
        $scope.firstrun = true;
        $scope.initDefault = true;
        $scope.activeToggleButton = 'Rates';

        $scope.activityObj = {};
        $scope.activityObj.changedField = '';

        $scope.$parent.myScroll = [];
        $scope.isWeekend = function(date) {
            //get the 'day' format, sat/sun and return true if its considered a weekend
            var day = new Date(date).getDay();
            //sat=5, sun=6
            if (day === 6 || day === 5) {
                return true;
            } else {
                return false;
            }
        };


        $scope.$on("applyAllActivity", function() {
            if (typeof arguments[1].via !== typeof undefined) {
                $scope.viaSection = arguments[1].via;
            }
        });

        BaseCtrl.call(this, $scope);

        $scope.init = function() {
            $scope.currentExpandedRow = -1;
            $scope.displayMode = "CALENDAR";
            $scope.calendarMode = "RATE_VIEW";
            $scope.currentSelectedRate = {};
            $scope.calendarData = {};
            $scope.popupData = {};
            $scope.loading = true;

            if ($scope.currentFilterData.filterConfigured) {
                loadTable();
            }
        };

        /**
         * Click handler for expand button in room type calendar
         */

        $scope.isExpandedHeight = 0;

        $scope.expandRow = function(index) {
            if ($scope.currentExpandedRow === index) {
                $scope.currentExpandedRow = -1;
                $scope.refreshScroller();

                return false;
            }
            $scope.currentExpandedRow = index;
            $scope.refreshScroller();
        };

        $scope.isExpandedRow = function(idx) {
            if (idx === $scope.currentExpandedRow) {
                return true;
            } else {
                return false;
            }
        };
        $scope.getLimitRow = function(rowIndex) {
            if (rowIndex) {
                if (rowIndex === $scope.currentExpandedRow) {
                    return 8;
                } else {
                    return 3;
                }
            } else {
                return 8;
            }
        };

        $scope.refreshScroller = function() {
            $scope.initScrollBind();
            if ($scope.$parent.myScroll.RateCalendarCtrl) {
                setTimeout(function() {
                    $scope.$parent.myScroll.RateCalendarCtrl.refresh();
                }, 0);
            }
        };

        $scope.isRestrictTo = function(zoom, restrictions) {
            var z = '' + zoom;
            if (typeof restrictions === typeof []) {
                var n = restrictions.length;
                if (n === 0) {
                    return 3;
                }
                switch (z) {
                    case '3':
                        if (n >= 1) {
                            return 3;
                        }
                        break;

                    case '4':
                        if (n >= 1) {
                            return 3;
                        }
                        break;

                    case '5':
                        if (n >= 1) {
                            return 3;
                        }
                        break;

                    case '6':
                        if (n > 1) {
                            return 2;
                        } else {
                            return 3;
                        }
                        break;

                    case '7':
                        if (n > 1) {
                            return 2;
                        } else {
                            return 3;
                        }
                        break;
                }
            }
        };

        $scope.ready = {};
        $scope.ready.single = true;
        $scope.ready.double = true;
        $scope.ready.extra_adult = true;
        $scope.ready.child = true;

        $scope.$on("setReadyButton", function() {
            var obj = arguments[1].via;
            switch (obj) {
                case 'single':
                    $scope.ready.single = true;

                    $scope.ready.double = false;
                    $scope.ready.extra_adult = false;
                    $scope.ready.child = false;
                    break;

                case 'extra_adult':
                    $scope.ready.extra_adult = true;

                    $scope.ready.double = false;
                    $scope.ready.single = false;
                    $scope.ready.child = false;
                    break;

                case 'child':
                    $scope.ready.child = true;

                    $scope.ready.double = false;
                    $scope.ready.extra_adult = false;
                    $scope.ready.single = false;
                    break;

                case 'double':
                    $scope.ready.double = true;

                    $scope.ready.single = false;
                    $scope.ready.extra_adult = false;
                    $scope.ready.child = false;
                    break;
            }
        });

        /**
         * @returns totalnumber of dates {Number} to be displayed
         */
        var getNumOfCalendarColumns = function() {
            var numColumns = new Date($scope.currentFilterData.end_date) - new Date($scope.currentFilterData.begin_date);
            numColumns = numColumns / (24 * 60 * 60 * 1000) + 1;

            return parseInt(numColumns);
        };

        $scope.showButtonReady = true;
        $scope.showButton = function(a, s) {
            if ($scope.showButtonReady === true || typeof $scope.showButtonReady === typeof undefined) {
                if (s !== $scope.viaSection) {
                    return true;
                } else if (a !== '' && s !== '') {
                    return false;
                } else {
                    if ($scope.ready[$scope.viaSection]) {
                        return false;
                    }
                    if ($scope.lastClickedApply !== s) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else if ($scope.viaSection !== '') {
                return true;
            } else {
                return false;
            }
        };


        $scope.everyRestriction = [];
        $scope.getRestrictionsForDateRoomType = function(date, room_type_name) {
            for (var x in $scope.everyRestriction) {
                if ($scope.everyRestriction[x].date === date) {
                    for (var i in $scope.everyRestriction[x].room_types) {
                        if (room_type_name === $scope.everyRestriction[x].room_types[i].room_type.name) {
                            return $scope.everyRestriction[x].room_types[i].restriction_overrides;
                        }
                    }
                }
            }
        };
        $scope.reloadingRooms = false;
        var loadTable = function() {
            $scope.currentExpandedRow = -1; //reset the expanded row
            $scope.loading = true;
            $scope.$emit('showLoader');
            setTimeout(function() {
                // If only one rate is selected in the filter section, the defult view is room type calendar
                if ($scope.currentFilterData.rates_selected_list.length === 1) {
                    $scope.calendarMode = "ROOM_TYPE_VIEW";
                    $scope.currentSelectedRate.id = $scope.currentFilterData.rates_selected_list[0].id;
                }

                var calenderDataFetchSuccess = function(data) {
                    //Set the calendar type
                    if (data.type === 'ROOM_TYPES_LIST') {
                        $scope.calendarMode = "ROOM_TYPE_VIEW";
                        $scope.current_overrides = data.room_type_restrictions;
                        $scope.calendarData.overrides = $scope.current_overrides;
                        $scope.hasAnyOverride();

                    } else {
                        $scope.calendarMode = "RATE_VIEW";
                    }


                    if ($scope.ratesRoomsToggle === 'ROOMS') {
                        $scope.everyRestriction = $scope.calendarData.room_type_restrictions;
                        var d, rm_type, r_date, rm_type_name;
                        $scope.calendarData.data_new = [];
                        for (var x in $scope.calendarData.data) {
                            if (x < $scope.calendarData.room_types_all.length) {
                                d = $scope.calendarData.data[x];
                                $scope.calendarData.data[x].name = $scope.calendarData.room_types_all[x].name;
                                $scope.calendarData.data[x].room_type_id = $scope.calendarData.room_types_all[x].room_type_id;

                                $scope.calendarData.data_new.push($scope.calendarData.data[x]);

                            } else {
                                delete $scope.calendarData.data[x];
                            }
                        }


                        //push the room_type restriction into the all_rates object
                        //per date/room_type
                        var room_type_id, date, rs, rs_ri;
                        for (var a in $scope.calendarData.data_new) {
                            room_type_id = $scope.calendarData.data_new[a].room_type_id;
                            date = $scope.calendarData.dates[a];

                            for (var b in $scope.calendarData.room_type_restrictions) {
                                rs = $scope.calendarData.room_type_restrictions[b];
                                if (rs.date === date) {
                                    for (var ri in rs.room_types) {
                                        rs_ri = rs.room_types[ri];
                                        if (rs_ri.room_type.id === room_type_id) {
                                            for (var c in rs_ri.restriction_overrides) {
                                                $scope.calendarData.room_type_restrictions[b].room_types[ri].restriction_overrides[c].type_id = rs_ri.restriction_overrides.restriction_type_id;
                                            }
                                            $scope.calendarData.all_rates[date] = rs_ri.restriction_overrides;
                                        }
                                    }
                                }

                            }
                        }

                        for (var ev in $scope.calendarData.data) {
                            rm_type = $scope.calendarData.data[ev];
                            rm_type_name = $scope.calendarData.data[ev].name;

                            for (var xi = 0; xi < $scope.calendarData.dates.length; xi++) {
                                r_date = $scope.calendarData.dates[xi];
                                $scope.calendarData.data[ev][r_date] = $scope.getRestrictionsForDateRoomType(r_date, rm_type_name);
                            }

                        }
                        $scope.calendarData.data = $scope.calendarData.data_new;
                        data.data = $scope.calendarData.data;
                    }

                    if (typeof data.selectedRateDetails !== 'undefined') {
                        $scope.currentSelectedRate = data.selectedRateDetails;
                        $scope.ratesDisplayed.push(data.selectedRateDetails);
                    }
                    $scope.calendarData = {}; //wipe it out first..
                    $scope.calendarData = data;
                    if (!$scope.reloadingRooms) { //workaround to fix the loader from disappearing too quickly
                        $scope.$emit('hideLoader');
                    } else if ($scope.reloadRoomsCount >= 1) {
                        $scope.$emit('hideLoader');
                        $scope.reloadingRooms = false;
                    } else {
                        ++$scope.reloadRoomsCount;
                    }
                };

                //Set the current business date value to the service. Done for calculating the history dates
                RateMngrCalendarSrv.businessDate = $rootScope.businessDate;

                if ($scope.calendarMode === "RATE_VIEW") {
                    $scope.invokeApi(RateMngrCalendarSrv.fetchCalendarData, calculateRateViewCalGetParams(), calenderDataFetchSuccess)
                        .then(finalizeCapture);

                } else {
                    $scope.invokeApi(RateMngrCalendarSrv.fetchRoomTypeCalenarData, calculateRoomTypeViewCalGetParams(), calenderDataFetchSuccess)
                        .then(finalizeCapture);


                }
            }, 200);
        };

        $scope.reloadRoomsCount = 0;
        $rootScope.$on('loadingRooms', function() {
            $scope.reloadingRooms = true;
            if ($scope.reloadRoomsCount >= 1) {
                $scope.reloadRoomsCount = 0;
            }
            ++$scope.reloadRoomsCount;
        });
        $scope.$on('showRatesBtnClicked', function() {
            $scope.ratesRoomsToggle = 'RATES';
            $scope.activeToggleButton = 'Rates';
        });

        $scope.toggleAllRates = function() {
            //if active toggle IS rates, ignore
            if ($scope.ratesRoomsToggle !== 'RATES') {
                $scope.calendarData.data = [];
                $scope.calendarData.restriction_types = [];
                $scope.ratesRoomsToggle = 'RATES';
                $scope.activeToggleButton = 'Rates';
                loadTable();
            }
        };

        $scope.toggleAllRooms = function() {
            if ($scope.ratesRoomsToggle !== 'ROOMS') {
                $scope.ratesRoomsToggle = 'ROOMS';
                $scope.activeToggleButton = 'Rooms';
                loadTable();
            }
        };


        function finalizeCapture() {
            $scope.initScrollBind();
            $scope.loading = false;
            $scope.currentFilterData.filterConfigured = true;

            $scope.$emit('computeColumWidth');

            if ($scope.$parent.myScroll.RateCalendarCtrl) {
                $scope.refreshScroller();
            }
        }

        /**
         * Calcultes the get params for fetching calendar.
         */
        var calculateRateViewCalGetParams = function() {
            var data = {};

            data.from_date = dateFilter($scope.currentFilterData.begin_date, 'yyyy-MM-dd');
            data.to_date = dateFilter($scope.currentFilterData.end_date, 'yyyy-MM-dd');
            data.order_id = $scope.currentFilterData.sort_order;

            //Total number of dates to be displayed
            data.per_page = getNumOfCalendarColumns();

            data.name_card_ids = [];

            for (var i in $scope.currentFilterData.name_cards) {
                data.name_card_ids.push($scope.currentFilterData.name_cards[i].id);
            }

            if ($scope.currentFilterData.is_checked_all_rates) {
                return data;
            }

            data.rate_type_ids = [];

            for (var i in $scope.currentFilterData.rate_type_selected_list) {
                data.rate_type_ids.push($scope.currentFilterData.rate_type_selected_list[i].id);
            }

            data.rate_ids = [];

            for (var i in $scope.currentFilterData.rates_selected_list) {
                data.rate_ids.push($scope.currentFilterData.rates_selected_list[i].id);
            }

            return data;
        };


        /**
         * Calcultes the get params for fetching calendar.
         */
        var calculateRoomTypeViewCalGetParams = function() {

            var data = {};

            data.id = $scope.currentSelectedRate.id;
            data.from_date = dateFilter($scope.currentFilterData.begin_date, 'yyyy-MM-dd');
            data.to_date = dateFilter($scope.currentFilterData.end_date, 'yyyy-MM-dd');

            data.order_id = $scope.currentFilterData.sort_order;

            //Total number of dates to be displayed
            data.per_page = getNumOfCalendarColumns();
            return data;
        };


        /**
         * Click handler for up-arrows in rate_view_calendar
         */
        $scope.goToRoomTypeCalendarView = function(rate) {
            if ($scope.ratesRoomsToggle !== 'ROOMS') {
                $scope.$emit('showLoader');
                $scope.loading = true;
                setTimeout(function() {
                    $scope.ratesDisplayed.length = 0;
                    $scope.ratesDisplayed.push(rate);
                    $scope.currentSelectedRate = rate;
                    $scope.$emit("enableBackbutton");
                    $scope.calendarMode = "ROOM_TYPE_VIEW";
                    loadTable(rate.id);
                }, 200);
            }
        };
        /**
         * Handle openall/closeall button clicks
         * Calls the API to update the "CLOSED" restriction.
         */
        $scope.openCloseAllRestrictions = function(action) {

            var restrictionUpdateSuccess = function() {

                loadTable();
            };

            var params = {};
            if ($scope.currentSelectedRate !== "") {
                params.rate_id = $scope.currentSelectedRate.id;
            }
            params.details = [];

            item = {};
            item.from_date = dateFilter($scope.currentFilterData.begin_date, 'yyyy-MM-dd');
            item.to_date = dateFilter($scope.currentFilterData.end_date, 'yyyy-MM-dd');
            item.restrictions = [];

            var rr = {};
            rr.action = action;
            var restrictionTypes = $scope.calendarData.restriction_types;
            var restrictionTypeId = "";
            for (var i = 0, keys = Object.keys(restrictionTypes), j = keys.length; i < j; i++) {
                if (restrictionTypes[keys[i]].value === "CLOSED") {
                    restrictionTypeId = restrictionTypes[keys[i]].id;
                    break;
                }
            }
            rr.restriction_type_id = restrictionTypeId;

            item.restrictions.push(rr);
            params.details.push(item);

            $scope.invokeApi(RateMngrCalendarSrv.updateRestrictions, params, restrictionUpdateSuccess);
        };

        /**
         * Update the calendar to the 'Rate view' and refresh the calendar
         */
        $scope.$on("updateRateCalendar", function() {
            $scope.$emit('showLoader');
            var rates_selected = $scope.currentFilterData.rates_selected_list,
                rates_displayed = $scope.ratesDisplayed;

            $scope.calendarMode = "RATE_VIEW";
            $scope.ratesDisplayed.length = 0;
            //Update the rates displayed list - show in topbar
            for (var i = 0, len = rates_selected.length; i < len; i++) {
                rates_displayed.push(rates_selected[i]);
            }

            loadTable();
        });

        /**
         * Calendar mode set as rate type calendar
         */
        $scope.$on("setCalendarModeRateType", function() {
            $scope.$emit('showLoader');
            $scope.calendarMode = "RATE_VIEW";
            $scope.currentSelectedRate = {};
            loadTable();

        });


        /**
         * Click handler for calendar cell. Creates an ng-dialog and pass the scope parameters
         * Set scope variables to be passed to the popup.
         */
        $scope.showUpdatePriceAndRestrictionsDialog = function(date, rate, roomType, type, isForAllData) {
            $stateParams.openUpdatePriceRestrictions = true;
            //flag to show update price restriction window
            if ($scope.ratesRoomsToggle === 'ROOMS') {
                var roomTypeName;
                for (var i in $scope.calendarData.room_types_all) {
                    if ($scope.calendarData.room_types_all[i].room_type_id === roomType) {
                        roomTypeName = $scope.calendarData.room_types_all[i].name;
                    }
                }
                $scope.popupData.room_restrictions = $scope.getRestrictionsForDateRoomType(date, roomTypeName);
            }
            $scope.popupData.selectedDate = date;
            $scope.popupData.selectedRate = rate;
            if (rate === "") {
                $scope.popupData.selectedRate = $scope.currentSelectedRate.id;
            }
            $scope.popupData.selectedRoomType = roomType;
            $scope.popupData.fromRoomTypeView = false;

            if (type === 'ROOM_TYPE') {
                $scope.popupData.fromRoomTypeView = true;
            }

            $scope.popupData.all_data_selected = false;
            if (isForAllData) {
                $scope.popupData.all_data_selected = true;
            }

            popupClassName = (function() {

                if ($scope.popupData.fromRoomTypeView) {
                    return 'ngdialog-theme-default restriction-popup fromRoomTypeView';
                } else {
                    return 'ngdialog-theme-default restriction-popup';
                }
            }());
            $scope.popupData.is_child = $scope.calendarData.is_child;
            if ($scope.ratesDisplayed.length > 0) {
                if ($scope.ratesDisplayed[0].name) {
                    $scope.popupData.rate_name = '"' + $scope.ratesDisplayed[0].name.toUpperCase() + '"';
                } else {
                    $scope.popupData.rate_name = 'this';
                }
            } else {
                $scope.popupData.rate_name = 'this';
            }
            $stateParams.calendarMode = $scope.calendarMode;
            ngDialog.open({
                template: '/assets/partials/rateManager/updatePriceAndRestrictions.html',
                className: popupClassName,
                closeByDocument: true,
                controller: 'UpdatePriceAndRestrictionsCtrl',
                scope: $scope
            });
        };

        /**
         * Check if a date is past the current business date
         * @return true {boolean} if the date is history
         */
        $scope.isHistoryDate = function(date) {
            var currentDate = new Date(date);
            var businessDate = new Date($rootScope.businessDate);
            var ret = false;
            if (currentDate.getTime() < businessDate.getTime()) {
                ret = true;
            }
            return ret;
        };

        $scope.initScrollBind = function() {
            var scrollTable = $(".scrollTable");
            scrollTable.scroll(function() {
                scrollTable.scrollTop($(this).scrollTop());
            });
        };

        $scope.toggleRestrictionIconView = function() {
            return !$scope.loading;
        };

        $scope.refreshCalendar = function() {
            $scope.$emit('showLoader');
            loadTable();
        };

        $scope.applyToAll = function(d, s) {
            d.setFromValue = s;
            $scope.lastClickedApply = s;
            $scope.applyAllShow = 'none';
            $scope.viaSection = 'none';
            $scope.$broadcast('apply-all-price-adjust', d);
            $scope.showButtonReady = false;
            setTimeout(function() {
                d.setFromValue = '';
                $scope.applyAllShow = '';
                $scope.ready.child = false;
                $scope.showButtonReady = true;
            }, 300);
        };
        $scope.current_overrides = [];
        /**
         * Fetches the calendar data and update the scope variables
         */

        $scope.hasOverrideValue = function(date, room_type) {
            var override_obj, override_room_type;
            for (var i in $scope.overrideByDate) {
                override_obj = $scope.overrideByDate[i];
                if (override_obj.date === date) {
                    for (var n in override_obj.room_types_with_override) {
                        override_room_type = override_obj.room_types_with_override[n];
                        if (override_room_type.toLowerCase() === room_type.toLowerCase()) {
                            return 'true';
                        }
                    }
                }
            }
            return 'false';
        };

        $scope.hasAnyOverride = function() {
            $scope.overrideByDate = [];
            //date > room type > occupancy
            var all = $scope.current_overrides,
                d, occupancyOverrides;
            for (var x in all) {
                d = all[x].date;
                var occupancyOverrides, room_types_with_override = [],
                    room_types_parent = [],
                    occupancies_with_override = [];
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
            if ($scope.popupData && $scope.data) {
                if ($scope.popupData.selectedDate && $scope.data.selected_room_type) {
                    return $scope.hasOverrideValue($scope.popupData.selectedDate, $scope.data.selected_room_type);
                }
            }
        };


        $scope.getOccupancyRestrictions = function(room_type, date) {
            for (var i in $scope.overrideByDate) {
                if ($scope.overrideByDate[i].date === date) {
                    return ($scope.overrideByDate[i].occupancies_with_override);
                }
            }
        };

        $scope.rateDateHasOverride = function(rate, date, occ) { //room_type, date, occupancy
            /*
             *
             * this is a three step check to determine if--
             *   on each specific date the room type > occupancy has an override
             *  -step 1- find the data for the given date
             *  -step 2- in the date object, find the correct room_type
             *  -step 3- using the room/type & date, determine if the occupancy 'has override'
             *
             */

            var room_type = rate.name;
            if (typeof date === typeof undefined) {
                date = $scope.popupData.selectedDate; //use the popup data
            }
            var override_obj, override_date, room_type_obj;
            for (var i in $scope.overrideByDate) {
                override_obj = $scope.overrideByDate[i];
                override_date = override_obj.date;
                if (override_date === date) {
                    if (override_obj.room_types_with_override) {
                        for (var r in override_obj.room_types_with_override) {
                            if (override_obj.room_types_with_override[r] === room_type) {
                                if (occ === 'nightly') { //hourly / nightly
                                    $scope.popupData.hasOverride = true;
                                    return true;
                                }
                                for (var rtn in override_obj.room_types) {
                                    room_type_obj = override_obj.room_types[rtn];
                                    if (room_type === room_type_obj.name) {
                                        if (room_type_obj.with_override) {
                                            if (room_type_obj.with_override.length > 0) {
                                                if (occ === '_any_') {
                                                    return true;
                                                }
                                                for (var n in room_type_obj.with_override) {
                                                    if (room_type_obj.with_override[n].toLowerCase() === occ.toLowerCase()) {
                                                        return 'true';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        };
                    }
                }
            }
            return 'false';
        };

        $scope.init();

        $scope.$watch('ratesRoomsToggle', function() {
            if ($scope.ratesRoomsToggle === 'ROOMS') {
                $scope.hideRoomsDownArrow = true;
            } else {
                $scope.hideRoomsDownArrow = false;
            }
        });

        $scope.rateIsChild = function(rate) {
            if ($scope.calendarData.isChildRate) {
                for (var i in $scope.calendarData.isChildRate) {
                    if ($scope.calendarData.isChildRate[i] === rate.id) {
                        return true;
                    };
                }
                return false;
            } else {
                return false;
            }
        };


    }
]);