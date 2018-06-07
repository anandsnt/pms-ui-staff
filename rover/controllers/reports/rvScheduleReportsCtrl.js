angular.module('sntRover').controller('RVScheduleReportsCtrl', [
    '$rootScope',
    '$scope',
    'RVreportsSrv',
    'RVReportUtilsFac',
    'RVReportParamsConst',
    'RVReportMsgsConst',
    'RVReportNamesConst',
    '$filter',
    '$timeout',
    'rvUtilSrv',
    'ngDialog',
    'RVReportApplyIconClass',
    function($rootScope, $scope, reportsSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout, util, ngDialog, applyIconClass) {


        var REPORT_SCHEDULES_SCROLL = 'REPORT_SCHEDULES_SCROLL';
        var SECOND_COLUMN_SCROLL = 'SECOND_COLUMN_SCROLL';
        var THIRD_COLUMN_SCROLL = 'THIRD_COLUMN_SCROLL';
        var FOURTH_COLUMN_SCROLL = 'FOURTH_COLUMN_SCROLL';
        var setupScrolls = function() {
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(REPORT_SCHEDULES_SCROLL, scrollerOptions);
            $scope.setScroller(SECOND_COLUMN_SCROLL, scrollerOptions);
            $scope.setScroller(THIRD_COLUMN_SCROLL, scrollerOptions);
            $scope.setScroller(FOURTH_COLUMN_SCROLL, scrollerOptions);
        };
        var refreshScroll = function(name, reset) {
            var DURATION = 100;

            $scope.refreshScroller(name);
            /**/
            if ( !! reset && $scope.myScroll.hasOwnProperty(name) ) {
                $scope.myScroll[name].scrollTo(0, 0, DURATION);
            }
        };

        var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };

        // helper function
        var findOccurance = function(item) {
            var occurance = 'Runs ',
                frequency = _.find($scope.scheduleFrequency, { id: item.frequency_id }),
                description = '',
                value = '';

            var FREQ_VALUES = {
                DAILY: 'DAILY',
                HOURLY: 'HOURLY',
                WEEKLY: 'WEEKLY',
                MONTHLY: 'MONTHLY'
            };

            if ( frequency ) {
                description = frequency.description;
                value = frequency.value;
            }

            if ( item.repeats_every === 0 ) {
                occurance += description.toLowerCase();
            } else {
                occurance += 'after every ' + item.repeats_every + ' ';

                if ( value === FREQ_VALUES.DAILY ) {
                    occurance += item.repeats_every === 1 ? 'day' : 'days';
                } else if ( value === FREQ_VALUES.HOURLY ) {
                    occurance += item.repeats_every === 1 ? 'hour' : 'hours';
                } else if ( value === FREQ_VALUES.WEEKLY ) {
                    occurance += item.repeats_every === 1 ? 'week' : 'weeks';
                } else if ( value === FREQ_VALUES.MONTHLY ) {
                    occurance += item.repeats_every === 1 ? 'month' : 'months';
                } else if ( value === FREQ_VALUES.MONTHLY ) {
                    occurance += item.repeats_every === 1 ? 'month' : 'months';
                }
            }

            if ( item.time ) {
                occurance += ' at ' + item.time + '. ';
            } else {
                occurance += '. ';
            }

            if ( item.starts_on ) {
                occurance += 'Started on ' + $filter('date')(item.starts_on, $rootScope.dateFormat) + '. ';
            }

            if ( item.ends_on_after ) {
                occurance += 'Ends after ' + item.ends_on_after + ' times.';
            } else if ( item.ends_on_date ) {
                occurance += 'Ends on ' + $filter('date')(item.ends_on_date, $rootScope.dateFormat) + '.';
            } else {
                occurance += 'Runs forever.';
            }

            return occurance;
        };

        var validateSchedule = function() {
            var hasTimePeriod = function() {
                var has = false;

                if ( $scope.isYearlyTaxReport || $scope.isGuestBalanceReport || angular.isDefined($scope.scheduleParams.time_period_id) ) {
                    has = true;
                }

                return has;
            };

            var hasFrequency = function() {
                return !! $scope.scheduleParams.frequency_id;
            };

            var hasEmailList = function() {
                return $scope.emailList.length;
            };

            return hasTimePeriod() && hasFrequency() && hasEmailList();
        };

        var fillValidationErrors = function() {
            $scope.createErrors = [];

            if ( !$scope.isYearlyTaxReport && ! $scope.isGuestBalanceReport && ! $scope.scheduleParams.time_period_id ) {
                $scope.createErrors.push('Time period in parameters');
            }
            if ( ! $scope.scheduleParams.frequency_id ) {
                $scope.createErrors.push('Repeat frequency in details');
            }
            if ( ! $scope.emailList.length ) {
                $scope.createErrors.push('Emails in distribution list');
            }
        };

        var createSchedule = function() {
            var params = {
                report_id: $scope.selectedEntityDetails.report.id,
                hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
                /**/
                format_id: $scope.scheduleParams.format_id
            };

            var filter_values = {
                page: 1,
                per_page: 99999
            };

            var success = function() {
                $scope.errorMessage = '';
                $scope.$emit( 'hideLoader' );
                if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
                    $scope.selectedReport.active = false;
                }
                $scope.updateViewCol($scope.viewColsActions.ONE);
                $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

                fetch_reportSchedules_frequency_timePeriod_scheduableReports();
            };

            var failed = function(errors) {
                $scope.errorMessage = errors;
                $scope.$emit( 'hideLoader' );
            };

            // fill 'time' and 'time_period_id'
            if ( $scope.scheduleParams.time ) {
                params.time = $scope.scheduleParams.time;
            }
            if ( $scope.scheduleParams.time_period_id ) {
                params.time_period_id = $scope.scheduleParams.time_period_id;
            }

            // fill 'frequency_id', 'starts_on', 'repeats_every' and 'ends_on_date'
            params.frequency_id = $scope.scheduleParams.frequency_id;
            /**/
            if ( $scope.scheduleParams.starts_on ) {
                params.starts_on = $filter('date')($scope.scheduleParams.starts_on, 'yyyy/MM/dd');
            }
            if ( $scope.scheduleParams.repeats_every ) {
                params.repeats_every = $scope.scheduleParams.repeats_every;
            } else {
                params.repeats_every = 0;
            }
            if ( $scope.scheduleParams.scheduleEndsOn === 'NUMBER' ) {
                params.ends_on_after = $scope.scheduleParams.ends_on_after;
            } else if ( $scope.scheduleParams.scheduleEndsOn === 'DATE' ) {
                params.ends_on_date = $filter('date')($scope.scheduleParams.ends_on_date, 'yyyy/MM/dd');
            } else {
                params.ends_on_after = null;
                params.ends_on_date = null;
            }

            // fill emails
            if ( $scope.emailList.length ) {
                params.emails = $scope.emailList.join(', ');
            } else {
                params.emails = '';
            }

            // fill sort_field and filters
            if ( $scope.scheduleParams.sort_field ) {
                filter_values.sort_field = $scope.scheduleParams.sort_field;
            }
            if ($scope.isYearlyTaxReport) {
                filter_values.year = $scope.scheduleParams.year;
                filter_values.with_vat_number = $scope.scheduleParams.with_vat_number;
                filter_values.without_vat_number = $scope.scheduleParams.without_vat_number;
            }
            _.each($scope.filters, function(filter) {
                _.each(filter.data, function(each) {
                    if ( each.selected ) {
                        filter_values[each.paramKey] = true;
                    }
                });
            });
            params.filter_values = filter_values;

            $scope.invokeApi( reportsSrv.createSchedule, params, success, failed );
        };

        var saveSchedule = function() {
            var params = {
                id: $scope.selectedEntityDetails.id,
                report_id: $scope.selectedEntityDetails.report.id,
                hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
                /**/
                format_id: $scope.scheduleParams.format_id,
                delivery_method_id: $scope.selectedEntityDetails.delivery_type.id
            };            

            var filter_values = {
                page: 1,
                per_page: 99999
            };

            var success = function() {
                var updatedIndex = _.findIndex($scope.$parent.$parent.schedulesList, { id: params.id });

                $scope.errorMessage = '';
                $scope.$emit( 'hideLoader' );
                if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
                    $scope.selectedSchedule.active = false;
                }
                $scope.updateViewCol($scope.viewColsActions.ONE);

                if ( updatedIndex >= 0 ) {
                    $scope.$parent.$parent.schedulesList[updatedIndex].frequency_id = params.frequency_id;
                    $scope.$parent.$parent.schedulesList[updatedIndex].repeats_every = params.repeats_every;
                    $scope.$parent.$parent.schedulesList[updatedIndex].time = params.time;
                    $scope.$parent.$parent.schedulesList[updatedIndex].starts_on = params.starts_on;
                    $scope.$parent.$parent.schedulesList[updatedIndex].ends_on_after = params.ends_on_after;
                    $scope.$parent.$parent.schedulesList[updatedIndex].ends_on_date = params.ends_on_date;

                    $scope.$parent.$parent.schedulesList[updatedIndex].occurance = findOccurance($scope.$parent.$parent.schedulesList[updatedIndex]);
                }
            };

            var failed = function(errors) {
                $scope.errorMessage = errors;
                $scope.$emit( 'hideLoader' );
            };

            // fill 'time' and 'time_period_id'
            if ( $scope.scheduleParams.time ) {
                params.time = $scope.scheduleParams.time;
            }
            if ( $scope.scheduleParams.time_period_id ) {
                params.time_period_id = $scope.scheduleParams.time_period_id;
            }
            params.format_id = parseInt($scope.scheduleParams.format_id);

            // fill 'frequency_id', 'starts_on', 'repeats_every' and 'ends_on_date'
            params.frequency_id = $scope.scheduleParams.frequency_id;
            /**/
            if ( $scope.scheduleParams.starts_on ) {
                params.starts_on = $filter('date')($scope.scheduleParams.starts_on, 'yyyy/MM/dd');
            }
            if ( $scope.scheduleParams.repeats_every ) {
                params.repeats_every = $scope.scheduleParams.repeats_every;
            } else {
                params.repeats_every = 0;
            }
            if ( $scope.scheduleParams.scheduleEndsOn === 'NUMBER' ) {
                params.ends_on_after = $scope.scheduleParams.ends_on_after;
            } else if ( $scope.scheduleParams.scheduleEndsOn === 'DATE' ) {
                params.ends_on_date = $filter('date')($scope.scheduleParams.ends_on_date, 'yyyy/MM/dd');
            } else {
                params.ends_on_after = null;
                params.ends_on_date = null;
            }

            // fill emails
            if ( $scope.emailList.length ) {
                params.emails = $scope.emailList.join(', ');
            } else {
                params.emails = '';
            }

            // fill sort_field and filters
            if ( $scope.scheduleParams.sort_field ) {
                filter_values.sort_field = $scope.scheduleParams.sort_field;
            }
            if ($scope.isYearlyTaxReport) {
                filter_values.year = $scope.scheduleParams.year;
                filter_values.with_vat_number = $scope.scheduleParams.with_vat_number;
                filter_values.without_vat_number = $scope.scheduleParams.without_vat_number;
            }
            _.each($scope.filters, function(filter) {
                _.each(filter.data, function(each) {
                    if ( each.selected ) {
                        filter_values[each.paramKey] = true;
                    }
                });
            });
            params.filter_values = filter_values;           

            $scope.invokeApi( reportsSrv.updateSchedule, params, success, failed );
        };

        var matchGeneralOptions = {
            DUE_IN_ARRIVALS: 'DUE_IN_ARRIVALS',
            DUE_OUT_DEPARTURES: 'DUE_OUT_DEPARTURES',
            INCLUDE_CANCELED: 'INCLUDE_CANCELED',
            INCLUDE_NO_SHOW: 'INCLUDE_NO_SHOW',
            INCLUDE_GUEST_NOTES: 'INCLUDE_GUEST_NOTES',
            INCLUDE_RESERVATION_NOTES: 'INCLUDE_RESERVATION_NOTES',
            INCLUDE_ACTIONS: 'INCLUDE_ACTIONS',
            SHOW_GUESTS: 'SHOW_GUESTS',
            VIP_ONLY: 'VIP_ONLY',
            // this filter for few reports could also be listed
            // under SHOW and not OPTIONS
            INCLUDE_DUE_OUT: 'INCLUDE_DUE_OUT',
            RESTRICTED_POST_ONLY: 'RESTRICTED_POST_ONLY',
            INCLUDE_TAX: 'INCLUDE_TAX',
            INCLUDE_LEDGER_DATA: 'INCLUDE_LEDGER_DATA',
            NO_NATIONALITY: 'NO_NATIONALITY'
        };

        var matchSortFields = {
            DATE: 'DATE',
            NAME: 'NAME',
            ROOM: 'ROOM',
            BALANCE: 'BALANCE',
            ROOM_NO: 'ROOM_NO'
        };

        var reportIconCls = {
            'Arriving Guests': 'guest-status check-in',
            'Departing Guests': 'guest-status check-out',
            'All In-House Guests': 'guest-status inhouse',
            'Balance for all Outstanding Accounts': 'icon-report icon-balance',
            'Statistics Report by Comparison': 'icon-report icon-comparison',
            'Company or Travel Agent Accounts with total net revenue over EUR 250.00.': 'icon-report icon-forecast'
        };

        // this is a temporary setup
        // may have to share logic with
        // rvReportUtilsFac.js in future
        var setupFilters = function() {
            $scope.filters = {};

            $scope.filters.hasGeneralOptions = {
                data: [],
                options: {
                    selectAll: false,
                    hasSearch: false,
                    key: 'description'
                }
            };

            _.each($scope.selectedEntityDetails.filters, function(filter) {
                var selected = false,
                    mustSend = false;


                if (filter.value === 'ACCOUNT' || filter.value === 'GUEST') {
                    selected = true;
                    $scope.filters.hasGeneralOptions.data.push({
                        paramKey: filter.value.toLowerCase(),
                        description: filter.description,
                        selected: selected,
                        mustSend: mustSend
                    });
                }

                selected = false;
                if ( matchGeneralOptions[filter.value] ) {

                    if ( $scope.selectedEntityDetails.report.description === 'Arriving Guests' && filter.value === 'DUE_IN_ARRIVALS' ) {
                        selected = true;
                    }

                    if ( $scope.selectedEntityDetails.report.description === 'Departing Guests' && filter.value === 'DUE_OUT_DEPARTURES' ) {
                        selected = true;
                    }

                    if ( $scope.selectedEntityDetails.report.description === 'All In-House Guests' && filter.value === 'INCLUDE_DUE_OUT' ) {
                        selected = true;
                    }

                    if ( $scope.selectedEntityDetails.report.description === 'Restricted Post only' && filter.value === 'RESTRICTED_POST_ONLY' ) {
                        selected = false;
                    }

                    $scope.filters.hasGeneralOptions.data.push({
                        paramKey: filter.value.toLowerCase(),
                        description: filter.description,
                        selected: selected,
                        mustSend: mustSend
                    });

                    if ( $scope.selectedEntityDetails.report.description === 'Arriving Guests' || $scope.selectedEntityDetails.report.description === 'Departing Guests' ) {
                        $scope.filters.hasGeneralOptions.options.noSelectAll = true;
                    }
                }
            });

            var reportTimePeriods = reportsSrv.getScheduleReportTimePeriods($scope.selectedEntityDetails.report.title);

            $scope.scheduleTimePeriods = [];
            _.each(reportTimePeriods, function (timePeriod) {
                $scope.scheduleTimePeriods.push(_.find($scope.originalScheduleTimePeriods, { value: timePeriod }));
            });

            runDigestCycle();
        };

        var applySavedFilters = function() {
            _.each($scope.selectedEntityDetails.filter_values, function(value, key) {
                var optionFilter, upperCaseKey;

                upperCaseKey = key.toUpperCase();
                if ( matchGeneralOptions[upperCaseKey] && !! value ) {
                    optionFilter = _.find($scope.filters.hasGeneralOptions.data, { paramKey: key });
                    if ( angular.isDefined(optionFilter) ) {
                        optionFilter.selected = true;
                    }
                }

                if ( matchSortFields[value] ) {
                    $scope.scheduleParams.sort_field = value;
                }
            });

            runDigestCycle();
        };

        var processScheduleDetails = function(report) {
            var TIME_SLOT = 30;
            var hasAccOrGuest;

            var datePickerCommon = {
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1,
                changeYear: true,
                changeMonth: true,
                beforeShow: function() {
                    angular.element('#ui-datepicker-div');
                    angular.element('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function() {
                    angular.element('#ui-datepicker-div');
                    angular.element('#ui-datepicker-overlay').remove();
                }
            };

            var startsOn = $scope.selectedEntityDetails.starts_on || $rootScope.businessDate;
            var endsOnDate = $scope.selectedEntityDetails.ends_on_date || $rootScope.businessDate;

            $scope.scheduleParams = {};

            $scope.isYearlyTaxReport = ($scope.selectedEntityDetails.report.title === reportNames['YEARLY_TAX']);

            if (angular.isDefined($scope.selectedEntityDetails.schedule_formats)) {
                $scope.schedule_formats = $scope.selectedEntityDetails.schedule_formats;
                $scope.scheduleParams.format_id = $scope.selectedEntityDetails.format.id;
            } else {
                if ($scope.isYearlyTaxReport) {
                    $scope.scheduleParams.format_id = _.find($scope.scheduleFormat, {value: 'CSV'}).id;
                } else if ($scope.selectedEntityDetails.report.title !== reportNames['COMPARISION_BY_DATE'] ) {
                   $scope.scheduleParams.format_id = _.find($scope.scheduleFormat, {value: 'PDF'}).id;
                }
            }
            if ($scope.isYearlyTaxReport) {
                $scope.scheduleParams.year = moment().format('YYYY');
            }
            hasAccOrGuest = _.find(report.filters, function(filter) {
                return filter.value === 'ACCOUNT' || filter.value === 'GUEST';
            });            
           
            if ( angular.isDefined(hasAccOrGuest) ) {
                $scope.scheduleParams.time_period_id = _.find($scope.originalScheduleTimePeriods, { value: "ALL" }).id;
                $scope.isGuestBalanceReport = true;
            } else if ($scope.isYearlyTaxReport) {
                $scope.scheduleParams.time_period_id = _.find($scope.originalScheduleTimePeriods, { value: "ALL" }).id;
            } else if ( angular.isDefined($scope.selectedEntityDetails.time_period_id) ) {
                $scope.scheduleParams.time_period_id = $scope.selectedEntityDetails.time_period_id;
            } else {
                $scope.scheduleParams.time_period_id = undefined;
            }

            if ( angular.isDefined($scope.selectedEntityDetails.time) ) {
                $scope.scheduleParams.time = $scope.selectedEntityDetails.time;
            } else {
                $scope.scheduleParams.time = undefined;
            }

            if ( angular.isDefined($scope.selectedEntityDetails.frequency_id) ) {
                $scope.scheduleParams.frequency_id = $scope.selectedEntityDetails.frequency_id;
            } else {
                $scope.scheduleParams.frequency_id = undefined;
            }

            if ( angular.isDefined($scope.selectedEntityDetails.repeats_every) ) {
                $scope.scheduleParams.repeats_every = $scope.selectedEntityDetails.repeats_every;
            } else {
                $scope.scheduleParams.repeats_every = undefined;
            }

            if ( $scope.selectedEntityDetails.ends_on_date !== null && $scope.selectedEntityDetails.ends_on_after === null ) {
                $scope.scheduleParams.scheduleEndsOn = 'DATE';
            } else if ( $scope.selectedEntityDetails.ends_on_date === null && $scope.selectedEntityDetails.ends_on_after !== null ) {
                $scope.scheduleParams.ends_on_after = $scope.selectedEntityDetails.ends_on_after;
                $scope.scheduleParams.scheduleEndsOn = 'NUMBER';
            } else {
                $scope.scheduleParams.scheduleEndsOn = 'NEVER';
            }

            $scope.startsOnOptions = angular.extend({
                minDate: tzIndependentDate($rootScope.businessDate),
                onSelect: function(value) {
                    $scope.endsOnOptions.minDate = value;
                }
            }, datePickerCommon);
            $scope.scheduleParams.starts_on = reportUtils.processDate(startsOn).today;
            /**/
            $scope.endsOnOptions = angular.extend({
                onSelect: function(value) {
                    $scope.startsOnOptions.maxDate = value;
                }
            }, datePickerCommon);
            $scope.scheduleParams.ends_on_date = reportUtils.processDate(endsOnDate).today;

            // save emails
            if ( $scope.selectedEntityDetails.emails ) {
                $scope.emailList = $scope.selectedEntityDetails.emails.split(', ');
            } else {
                $scope.emailList = [];
            }

            if ($scope.selectedEntityDetails.filter_values && $scope.isYearlyTaxReport) {
                $scope.scheduleParams.year = $scope.selectedEntityDetails.filter_values.year;
                $scope.scheduleParams.with_vat_number = $scope.selectedEntityDetails.filter_values.with_vat_number;
                $scope.scheduleParams.without_vat_number = $scope.selectedEntityDetails.filter_values.without_vat_number;
            }

            $scope.timeSlots = reportUtils.createTimeSlots(TIME_SLOT);
        };

        var fetch_reportSchedules_frequency_timePeriod_scheduableReports = function() {
            var success = function(payload) {
                var found, reset = true;

                var getValue = function(value) {
                    switch (value) {
                    case 'DAILY':
                        return 'Day';
                    case 'HOURLY':
                        return 'Hour';
                    case 'WEEKLY':
                        return 'Week';
                    case 'MONTHLY':
                        return 'Month';
                    default:
                        return 'Per';
                    }
                };

                $scope.originalScheduleTimePeriods = payload.scheduleTimePeriods;
                $scope.scheduleFrequency = payload.scheduleFrequency;
                $scope.scheduleFormat = payload.scheduleFormat;
                $scope.$parent.$parent.schedulesList = [];
                $scope.$parent.$parent.schedulableReports = [];

                // sort schedule list by report name
                $scope.$parent.$parent.schedulesList = _.sortBy(
                        payload.schedulesList,
                        function(item) {
                            return item.report.title;
                        }
                    );

                // add filtered out and occurance
                _.each($scope.$parent.$parent.schedulesList, function(item) {
                    item.filteredOut = false;
                    item.occurance = findOccurance(item);
                });

                // structure the schedulable reports exactly like the
                // schedules list, then we can re-use the support functions
                _.each(payload.schedulableReports, function(id) {
                    found = _.find($scope.$parent.$parent.reportList, { 'id': id });

                    if ( angular.isDefined(found) ) {
                        applyIconClass.init(found);
                        $scope.$parent.$parent.schedulableReports.push({
                            id: found.id,
                            filters: found.filters,
                            sort_fields: found.sort_fields,
                            report: {
                                id: found.id,
                                description: found.description,
                                title: found.title
                            },
                            reportIconCls: found.reportIconCls,
                            active: false,
                            filteredOut: false
                        });
                    }
                });

                // sort schedulable reports by report name
                $scope.$parent.$parent.schedulableReports = _.sortBy(
                    $scope.$parent.$parent.schedulableReports,
                    function(item) {
                        return item.report.title;
                    }
                );

                $scope.scheduleFreqType = _.map($scope.scheduleFrequency, function(freq) {
                    return {
                        id: freq.id,
                        value: getValue(freq.value)
                    };
                });

                _.each($scope.$parent.$parent.schedulesList, function(item) {
                    if ( angular.isDefined(reportIconCls[item.report.description]) ) {
                        item.reportIconCls = reportIconCls[item.report.description];
                    }
                });

                $scope.refreshReportSchedulesScroll(reset);

                $scope.$emit( 'hideLoader' );
            };

            var failed = function(errors) {
                $scope.errors = errors;
                // refreshScrolls();
                $scope.$emit( 'hideLoader' );
            };

            $scope.invokeApi( reportsSrv.reportSchedulesPayload, {}, success, failed );
        };

        var STAGES = {
            SHOW_SCHEDULE_LIST: 'SHOW_SCHEDULE_LIST',
            SHOW_PARAMETERS: 'SHOW_PARAMETERS',
            SHOW_DETAILS: 'SHOW_DETAILS',
            SHOW_DISTRIBUTION: 'SHOW_DISTRIBUTION'
        };

        BaseCtrl.call(this, $scope);

        $scope.removeEmail = function(index) {
            var RESET = true;

            $scope.emailList = [].concat(
                $scope.emailList.slice(0, index),
                $scope.emailList.slice(index + 1)
            );

            $scope.refreshFourthColumnScroll(RESET);
        };

        $scope.userAutoCompleteSimple = {
            minLength: 3,
            source: function(request, response) {
                var mapedUsers, found;

                mapedUsers = _.map($scope.activeUserList, function(user) {
                    return {
                        label: user.full_name || user.email,
                        value: user.email
                    };
                });
                found = $.ui.autocomplete.filter(mapedUsers, request.term);
                response(found);
            },
            select: function(event, ui) {
                var RESET = true;
                var alreadyPresent = _.find($scope.emailList, function(email) {
                    return email === ui.item.value;
                });

                if ( ! alreadyPresent ) {
                    $scope.emailList.push( ui.item.value );
                }
                this.value = '';

                runDigestCycle();
                $scope.refreshFourthColumnScroll(RESET);

                return false;
            },
            focus: function() {
                return false;
            }
        };
        $scope.userEmailTyped = function() {

        };

        $scope.pickSchedule = function(item, index) {
            var success = function(data) {
                $scope.selectedEntityDetails = data;
                $scope.isGuestBalanceReport = false;
                $scope.isYearlyTaxReport = false;

                if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
                    $scope.selectedSchedule.active = false;
                }
                $scope.selectedSchedule = $scope.$parent.$parent.schedulesList[index];
                $scope.selectedSchedule.active = true;
                /**/
                $scope.selectedReport.active = false;

                $scope.addingStage = STAGES.SHOW_DISTRIBUTION;
                $scope.updateViewCol($scope.viewColsActions.FOUR);

                processScheduleDetails(item);
                setupFilters();
                applySavedFilters();

                $scope.refreshAllOtherColumnScrolls();

                $scope.$emit( 'hideLoader' );
            };

            var failed = function(errors) {
                $scope.errors = errors;
                $scope.$emit( 'hideLoader' );
            };

            var params = {
                id: item.id
            };

            $scope.invokeApi( reportsSrv.fetchOneSchedule, params, success, failed );
        };

        $scope.check = function () {
            ngDialog.open({
                template: '/assets/partials/reports/scheduleReport/rvConfirmDiscard.html',
                scope: $scope
            });
        };

        $scope.pickReport = function(item, index) {
            $scope.selectedEntityDetails = $scope.$parent.$parent.schedulableReports[index];
            $scope.isGuestBalanceReport = false;

            $scope.isYearlyTaxReport = false;


            if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
                $scope.selectedReport.active = false;
            }
            $scope.selectedReport = $scope.$parent.$parent.schedulableReports[index];
            $scope.selectedReport.active = true;
            /**/
            $scope.selectedSchedule.active = false;

            $scope.addingStage = STAGES.SHOW_PARAMETERS;
            $scope.updateViewCol($scope.viewColsActions.TWO);

            processScheduleDetails(item);
            setupFilters();
            applySavedFilters();

            $scope.refreshAllOtherColumnScrolls();
        };

        $scope.getRepeatPer = function() {
            var found = _.find($scope.scheduleFreqType, { id: $scope.scheduleParams.frequency_id });

            return found ? found.value : 'Per';
        };

        $scope.checkCanCreateSchedule = function() {
            if ( validateSchedule() ) {
                createSchedule();
            } else {
                fillValidationErrors();
                ngDialog.open({
                    template: '/assets/partials/reports/scheduleReport/rvCantCreateSchedule.html',
                    scope: $scope
                });
            }
        };

        $scope.checkCanSaveSchedule = function() {
            if ( validateSchedule() ) {
                saveSchedule();
            } else {
                fillValidationErrors();
                ngDialog.open({
                    template: '/assets/partials/reports/scheduleReport/rvCantCreateSchedule.html',
                    scope: $scope
                });
            }
        };

        $scope.confirmDelete = function() {
            ngDialog.open({
                template: '/assets/partials/reports/scheduleReport/rvConfirmDeleteSchedule.html',
                scope: $scope
            });
        };

        $scope.deleteSchedule = function() {
            var success = function() {
                $scope.errorMessage = '';
                $scope.$emit( 'hideLoader' );
                if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
                    $scope.selectedReport.active = false;
                }
                $scope.updateViewCol($scope.viewColsActions.ONE);
                $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

                fetch_reportSchedules_frequency_timePeriod_scheduableReports();
            };

            var failed = function(errors) {
                $scope.errorMessage = errors;
                $scope.$emit( 'hideLoader' );
            };

            $scope.closeDialog();
            $scope.invokeApi( reportsSrv.deleteSchedule, { id: $scope.selectedEntityDetails.id }, success, failed );
        };

        $scope.refreshReportSchedulesScroll = function(reset) {
            refreshScroll(REPORT_SCHEDULES_SCROLL, reset);
        };
        $scope.refreshSecondColumnScroll = function(reset) {
            refreshScroll(SECOND_COLUMN_SCROLL, reset);
        };
        $scope.refreshThirdColumnScroll = function(reset) {
            refreshScroll(THIRD_COLUMN_SCROLL, reset);
        };
        $scope.refreshFourthColumnScroll = function(reset) {
            refreshScroll(FOURTH_COLUMN_SCROLL, reset);
        };
        $scope.refreshAllOtherColumnScrolls = function() {
            var reset = true;

            $scope.refreshSecondColumnScroll(reset);
            $scope.refreshThirdColumnScroll(reset);
            $scope.refreshFourthColumnScroll(reset);
        };

        $scope.scheduleReport = function() {
            var reset = true;

            $scope.isAddingNew = true;
            $scope.addingStage = STAGES.SHOW_PARAMETERS;

            $scope.selectedSchedule.active = false;

            $scope.updateView($scope.reportViewActions.SHOW_SCHEDULE_A_REPORT);
            $scope.updateViewCol($scope.viewColsActions.ONE);

            $scope.refreshReportSchedulesScroll(reset);

            $scope.$emit('UPDATE_TITLE_AND_HEADING');
        };

        $scope.checkCanCancel = function() {
            if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
                ngDialog.open({
                    template: '/assets/partials/reports/scheduleReport/rvConfirmDiscard.html',
                    scope: $scope
                });
            } else {
                $scope.cancelScheduleReport();
            }
        };

        $scope.cancelScheduleReport = function() {
            var reset = true;

            $scope.isAddingNew = false;
            $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

            $scope.selectedReport.active = false;

            $scope.updateView($scope.reportViewActions.SHOW_SCHEDULED_REPORTS);
            $scope.updateViewCol($scope.viewColsActions.ONE);

            $scope.refreshReportSchedulesScroll(reset);

            $scope.closeDialog();
        };

        $scope.goToNext = function() {
            var noReset = true;
            var verReset = true;

            if ( $scope.addingStage === STAGES.SHOW_PARAMETERS ) {
                $scope.addingStage = STAGES.SHOW_DETAILS;
                $scope.updateViewCol($scope.viewColsActions.THREE, noReset);
                $scope.refreshThirdColumnScroll(verReset);
            } else if ( $scope.addingStage === STAGES.SHOW_DETAILS ) {
                $scope.addingStage = STAGES.SHOW_DISTRIBUTION;
                $scope.updateViewCol($scope.viewColsActions.FOUR, noReset);
                $scope.refreshFourthColumnScroll(verReset);
            }

            $scope.scrollToLast();
        };

        $scope.shouldHideParametersCol = function() {
            return $scope.addingStage === STAGES.SHOW_SCHEDULE_LIST;
        };

        $scope.shouldHideDetailsCol = function() {
            return $scope.addingStage === STAGES.SHOW_SCHEDULE_LIST || $scope.addingStage === STAGES.SHOW_PARAMETERS;
        };

        $scope.shouldHideDistributionCol = function() {
            return $scope.addingStage === STAGES.SHOW_SCHEDULE_LIST ||
                $scope.addingStage === STAGES.SHOW_PARAMETERS ||
                $scope.addingStage === STAGES.SHOW_DETAILS;
        };

        // Checks whether file format dropdown should be shown or not
        $scope.shouldShowFileFormat = function (selectedEntity) {
            return selectedEntity.report && selectedEntity.report.title === reportNames['COMPARISION_BY_DATE'];
        };

        // Listener for creating new report schedule
        let createNewReportScheduleListener = $scope.$on("CREATE_NEW_REPORT_SCHEDULE", () => {
            $scope.scheduleReport();
        });

        $scope.$on('$destroy', createNewReportScheduleListener);        

        /**
         * Startup
         * @return {Object} undefined
         */
        function init () {
            $scope.isAddingNew = false;
            $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

            $scope.selectedSchedule = {};
            $scope.selectedReport = {};
            $scope.selectedEntityDetails = {};

            $scope.$parent.$parent.schedulesList = [];
            $scope.$parent.$parent.scheduleReport = [];
            $scope.scheduleTimePeriods = [];
            $scope.scheduleFrequency = [];
            $scope.scheduleFormat = [];
            $scope.scheduleYearList = Array.from( {length: 10}, 
                        function (v, i) {
                           return {
                                "value": moment().add(-1 * i, 'y')
                                        .format('YYYY')
                                };
                        });

            $scope.scheduleFreqType = [];
            $scope.emailList = [];

            $scope.scheduleParams = {};            

            setupScrolls();

            fetch_reportSchedules_frequency_timePeriod_scheduableReports();
        }

        init();
    }
]);
