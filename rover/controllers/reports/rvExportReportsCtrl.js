angular.module('sntRover').controller('RVExportReportsCtrl', [
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
    function(
        $rootScope,
        $scope,
        reportsSrv,
        reportUtils,
        reportParams,
        reportMsgs,
        reportNames,
        $filter,
        $timeout,
        util,
        ngDialog
    ) {
        var scheduleTimePeriods = [];

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
            var DELAY = 100;

            $scope.refreshScroller(name);
            /**/
            if ( !! reset && $scope.myScroll.hasOwnProperty(name) ) {
                $scope.myScroll[name].scrollTo(0, 0, DELAY);
            }
        };

        // helper function
        var findOccurance = function(item) {
            var occurance = 'Runs ',
                frequency = _.find($scope.originalScheduleFrequency, { id: item.frequency_id }),
                description = '',
                value = '';

            var FREQ_VALUES = {
                DAILY: 'DAILY',
                HOURLY: 'HOURLY',
                WEEKLY: 'WEEKLY',
                MONTHLY: 'MONTHLY',
                RUN_ONCE: 'RUN_ONCE'
            };

            if ( frequency ) {
                description = frequency.description;
                value = frequency.value;
            }

            if ( value === FREQ_VALUES.RUN_ONCE ) {
                occurance += 'once';
            } else {
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
            }

            if ( item.time ) {
                occurance += ' at ' + item.time + '. ';
            } else {
                occurance += '. ';
            }

            if ( item.starts_on ) {
                occurance += 'Started on ' + $filter('date')(item.starts_on, $rootScope.dateFormat) + '. ';
            }

            if ( value !== FREQ_VALUES.RUN_ONCE ) {
                if ( item.ends_on_after ) {
                    occurance += 'Ends after ' + item.ends_on_after + ' times.';
                } else if ( item.ends_on_date ) {
                    occurance += 'Ends on ' + $filter('date')(item.ends_on_date, $rootScope.dateFormat) + '.';
                } else {
                    occurance += 'Runs forever.';
                }
            }

            return occurance;
        };

        var validateSchedule = function() {
            var hasTimePeriod = function() {
                return angular.isDefined($scope.scheduleParams.time_period_id);
            };

            var hasFrequency = function() {
                return !! $scope.scheduleParams.frequency_id;
            };

            var hasEmailFtpList = function() {
                var hasEmail = $scope.checkDeliveryType('EMAIL') && $scope.emailList.length;
                var hasFTP = $scope.checkDeliveryType('SFTP') && !! $scope.scheduleParams.selectedFtpRecipient;

                return hasEmail || hasFTP;
            };

            return hasTimePeriod() && hasFrequency() && hasEmailFtpList();
        };

        var fillValidationErrors = function() {
            $scope.createErrors = [];

            if ( ! $scope.isGuestBalanceReport && ! $scope.scheduleParams.time_period_id ) {
                $scope.createErrors.push('Time period in parameters');
            }
            if ( ! $scope.scheduleParams.frequency_id ) {
                $scope.createErrors.push('Repeat frequency in details');
            }
            if ( ! $scope.emailList.length ) {
                $scope.createErrors.push('Emails/SFTP in distribution list');
            }
        };

        var createSchedule = function() {
            var params = {
                report_id: $scope.selectedEntityDetails.id,
                hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
                /**/
                format_id: 1,
                delivery_type_id: $scope.scheduleParams.delivery_id
            };

            var success = function() {
                $scope.errorMessage = '';
                $scope.$emit( 'hideLoader' );
                if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
                    $scope.selectedReport.active = false;
                }
                $scope.updateViewCol($scope.viewColsActions.ONE);
                $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

                fetchReqDatas();
            };

            var failed = function(errors) {
                $scope.errorMessage = errors;
                $scope.$emit( 'hideLoader' );
            };

            var filter_values = {};

            var runOnceId = _.find($scope.originalScheduleFrequency, { value: 'RUN_ONCE' }).id;

            // fill 'time' and 'time_period_id'
            if ( $scope.scheduleParams.time ) {
                params.time = $scope.scheduleParams.time;
            }
            if ( $scope.scheduleParams.time_period_id ) {
                params.time_period_id = $scope.scheduleParams.time_period_id;
            }
            if ( $scope.scheduleParams.export_date ) {
                params.export_date = $scope.scheduleParams.export_date;
            }

            // fill 'frequency_id', 'starts_on', 'repeats_every' and 'ends_on_date'
            params.frequency_id = $scope.scheduleParams.frequency_id;
            /**/
            if ( $scope.scheduleParams.starts_on ) {
                params.starts_on = $filter('date')($scope.scheduleParams.starts_on, 'yyyy/MM/dd');
            }

            if ( $scope.scheduleParams.frequency_id === runOnceId ) {
                params.repeats_every = null;
            } else if ( $scope.scheduleParams.repeats_every ) {
                params.repeats_every = $scope.scheduleParams.repeats_every;
            } else {
                params.repeats_every = 0;
            }

            if ( $scope.scheduleParams.frequency_id === runOnceId ) {
                params.ends_on_after = null;
                params.ends_on_date = null;
            } else if ( $scope.scheduleParams.scheduleEndsOn === 'NUMBER' ) {
                params.ends_on_after = $scope.scheduleParams.ends_on_after;
                params.ends_on_date = null;
            } else if ( $scope.scheduleParams.scheduleEndsOn === 'DATE' ) {
                params.ends_on_date = $filter('date')($scope.scheduleParams.ends_on_date, 'yyyy/MM/dd');
                params.ends_on_after = null;
            } else {
                params.ends_on_after = null;
                params.ends_on_date = null;
            }

            // fill emails/FTP
            if ( $scope.checkDeliveryType('EMAIL') && $scope.emailList.length ) {
                params.emails = $scope.emailList.join(', ');
            } else if ( $scope.checkDeliveryType('SFTP') && !! $scope.scheduleParams.selectedFtpRecipient ) {
                params.sftp_server_id = $scope.scheduleParams.selectedFtpRecipient;
            }
            // fill sort_field and filters
            if ( $scope.scheduleParams.sort_field ) {
                filter_values.sort_field = $scope.scheduleParams.sort_field;
                params.filter_values = filter_values;
            }

            $scope.invokeApi( reportsSrv.createSchedule, params, success, failed );
        };

        var saveSchedule = function() {
            var params = {
                id: $scope.selectedEntityDetails.id,
                report_id: $scope.selectedEntityDetails.report.id,
                hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
                /**/
                format_id: 1,
                delivery_type_id: $scope.scheduleParams.delivery_id
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

            var filter_values = {};

            var runOnceId = _.find($scope.originalScheduleFrequency, { value: 'RUN_ONCE' }).id;

            // fill 'time' and 'time_period_id'
            if ( $scope.scheduleParams.time ) {
                params.time = $scope.scheduleParams.time;
            }
            if ( $scope.scheduleParams.time_period_id ) {
                params.time_period_id = $scope.scheduleParams.time_period_id;
            }
            params.export_date = $filter('date')($scope.scheduleParams.export_date, 'yyyy/MM/dd');

            // fill 'frequency_id', 'starts_on', 'repeats_every' and 'ends_on_date'
            params.frequency_id = $scope.scheduleParams.frequency_id;
            /**/
            if ( $scope.scheduleParams.starts_on ) {
                params.starts_on = $filter('date')($scope.scheduleParams.starts_on, 'yyyy/MM/dd');
            }

            if ( $scope.scheduleParams.frequency_id === runOnceId ) {
                params.repeats_every = null;
            } else if ( $scope.scheduleParams.repeats_every ) {
                params.repeats_every = $scope.scheduleParams.repeats_every;
            } else {
                params.repeats_every = 0;
            }

            if ( $scope.scheduleParams.frequency_id === runOnceId ) {
                params.ends_on_after = null;
                params.ends_on_date = null;
            } else if ( $scope.scheduleParams.scheduleEndsOn === 'NUMBER' ) {
                params.ends_on_after = $scope.scheduleParams.ends_on_after;
                params.ends_on_date = null;
            } else if ( $scope.scheduleParams.scheduleEndsOn === 'DATE' ) {
                params.ends_on_date = $filter('date')($scope.scheduleParams.ends_on_date, 'yyyy/MM/dd');
                params.ends_on_after = null;
            } else {
                params.ends_on_after = null;
                params.ends_on_date = null;
            }

            // fill emails/FTP
            if ( $scope.checkDeliveryType('EMAIL') && $scope.emailList.length ) {
                params.emails = $scope.emailList.join(', ');
            } else if ( $scope.checkDeliveryType('SFTP') && !! $scope.scheduleParams.selectedFtpRecipient ) {
                params.sftp_server_id = $scope.scheduleParams.selectedFtpRecipient;
            } else {
                params.emails = '';
                params.sftp_server_id = '';
            }

            // fill sort_field and filters
            if ( $scope.scheduleParams.sort_field ) {
                filter_values.sort_field = $scope.scheduleParams.sort_field;
                params.filter_values = filter_values;
            }

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
            INCLUDE_TAX: 'INCLUDE_TAX'
        };

        var matchSortFields = {
            DATE: 'DATE',
            NAME: 'NAME',
            ROOM: 'ROOM',
            BALANCE: 'BALANCE',
            ROOM_NO: 'ROOM_NO',
            CONFIRMATION_NUMBER: 'CONFIRMATION_NUMBER',
            CHECKOUT_DATE: 'CHECKOUT_DATE',
            TRAVEL_AGENT: 'TRAVEL_AGENT'
        };

        var reportIconCls = {
            'Arriving Guests': 'guest-status check-in',
            'Departing Guests': 'guest-status check-out',
            'All In-House Guests': 'guest-status inhouse',
            'Balance for all Outstanding Accounts': 'icon-report icon-balance',
            'Statistics Report by Comparison': 'icon-report icon-comparison'
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
                    mustSend = false,
                    filteredTimePeriods;

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

                    if ( $scope.selectedEntityDetails.report.description === 'Statistics Report by Comparison' ) {
                        filteredTimePeriods = _.filter( scheduleTimePeriods, function(item) {
                            return item.value === 'YESTERDAY';
                        });

                        $scope.scheduleTimePeriods = filteredTimePeriods;
                    }
                    else {
                        filteredTimePeriods = _.filter( scheduleTimePeriods, function(item) {
                            return item.value !== 'YESTERDAY';
                        });

                        $scope.scheduleTimePeriods = filteredTimePeriods;
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

        var filterScheduleFrequency = function (item) {
            var dailyOnly = _.find($scope.originalScheduleFrequency, { value: 'DAILY' });
            var runOnceOnly = _.find($scope.originalScheduleFrequency, { value: 'RUN_ONCE' });

            var dailyTypeOnly = _.find($scope.originalScheduleFreqType, { originalValue: 'DAILY' }),
                weeklyTypeOnly = _.find($scope.originalScheduleFreqType, { originalValue: 'WEEKLY' }),
                monthlyTypeOnly = _.find($scope.originalScheduleFreqType, { originalValue: 'MONTHLY' }),
                hourlyTypeOnly = _.find($scope.originalScheduleFreqType, { originalValue: 'HOURLY' });

            var weeklyOnly = _.find($scope.originalScheduleFrequency, { value: 'WEEKLY' }),
                monthlyOnly = _.find($scope.originalScheduleFrequency, { value: 'MONTHLY' }),
                hourlyOnly = _.find($scope.originalScheduleFrequency, { value: 'HOURLY' });

            $scope.scheduleFrequency = [];
            $scope.scheduleFreqType = [];

            var forDaily = {
                'Financial Transactions': true,
                'Stash Rewards Membership Export': true,
                'Reservations': true,
                'Rooms': true,
                'Future Reservations': true,
                'Journal Export': true,
                'Clairvoyix Stays Export': true,
                'Clairvoyix Reservations Export': true,
                'Synxis - Reservations': true,
                'Synxis - Upcoming Reservation Export (Future Reservation Export)': true
            };

            var forRunOnceOnly = {
                'Financial Transactions': true,
                'Stash Rewards Membership Export': true,
                'Reservations': true,
                'Rooms': true,
                'Future Reservations': true,
                'Last Week Reservations': true,
                'Past Reservations - Monthly': true,
                'Nationality Statistics': true,
                'Commissions': true,
                'Clairvoyix Stays Export': true,
                'Clairvoyix Reservations Export': true,
                'Synxis - Reservations': true,
                'Synxis - Upcoming Reservation Export (Future Reservation Export)': true
            };

            var forWeekly = {
                'Future Reservations': true,
                'Last Week Reservations': true,
                'Clairvoyix Reservations Export': true,
                'Synxis - Upcoming Reservation Export (Future Reservation Export)': true
            };
            var forMonthly = {
                'Future Reservations': true,
                'Past Reservations - Monthly': true,
                'Nationality Statistics': true,
                'Commissions': true,
                'Clairvoyix Reservations Export': true,
                'Synxis - Upcoming Reservation Export (Future Reservation Export)': true
            };

            var forHourly = {
                'Future Reservations': true,
                'Clairvoyix Reservations Export': true,
                'Synxis - Upcoming Reservation Export (Future Reservation Export)': true
            };

            if ( forHourly[item.report.title] ) {
                $scope.scheduleFrequency.push(hourlyOnly);
                $scope.scheduleFreqType.push(hourlyTypeOnly);
            }

            if ( forDaily[item.report.title] ) {
                $scope.scheduleFrequency.push(dailyOnly);
                $scope.scheduleFreqType.push(dailyTypeOnly);
            }

            if ( forWeekly[item.report.title] ) {
                $scope.scheduleFrequency.push(weeklyOnly);
                $scope.scheduleFreqType.push(weeklyTypeOnly);
            }

            if ( forMonthly[item.report.title] ) {
                $scope.scheduleFrequency.push(monthlyOnly);
                $scope.scheduleFreqType.push(monthlyTypeOnly);
            }

            if ( forRunOnceOnly[item.report.title] ) {
                $scope.scheduleFrequency.push(runOnceOnly);
            }
        };

        // Configure the time periods for the given report
        var filterScheduleTimePeriod = function(item) {

            $scope.scheduleTimePeriods = [];

            var reportTimePeriods = reportsSrv.getReportExportTimePeriods (item.report.title);

            _.each(reportTimePeriods, function (timePeriod) {
                $scope.scheduleTimePeriods.push(_.find($scope.originalScheduleTimePeriods, { value: timePeriod }));
            });

        };

        var processScheduleDetails = function(report) {
            var TIME_SLOTS = 30;

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

            // saved emails/FTP
            var delieveryType = $scope.selectedEntityDetails.delivery_type ? $scope.selectedEntityDetails.delivery_type.value : '';

            var hasAccOrGuest, todayTimePeriod;

            hasAccOrGuest = _.find(report.filters, function(filter) {
                return filter.value === 'ACCOUNT' || filter.value === 'GUEST';
            });

            $scope.scheduleParams = {};

            if ( angular.isDefined(hasAccOrGuest) ) {
                todayTimePeriod = _.find($scope.scheduleTimePeriods, function(each) {
                    return each.value === 'TODAY';
                });

                $scope.scheduleParams.time_period_id = todayTimePeriod.id;
                $scope.isGuestBalanceReport = true;
            } else if ( angular.isDefined($scope.selectedEntityDetails.time_period_id) ) {
                $scope.scheduleParams.time_period_id = $scope.selectedEntityDetails.time_period_id;
            } else {
                $scope.scheduleParams.time_period_id = undefined;
            }

            if ( angular.isDefined($scope.selectedEntityDetails.export_date) ) {
                $scope.scheduleParams.export_date = $scope.selectedEntityDetails.export_date;
            } else {
                $scope.scheduleParams.export_date = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days')
                                                    .calendar();
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
            /*
             * Export Calender Options
             * max date is business date
             */
            $scope.exportCalenderOptions = angular.extend({
                maxDate: tzIndependentDate($rootScope.businessDate)
            }, datePickerCommon);

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


            if ( delieveryType === 'EMAIL' ) {
                $scope.scheduleParams.delivery_id = $scope.getDeliveryId('EMAIL');
                $scope.emailList = $scope.selectedEntityDetails.emails.split(', ');
            } else if ( delieveryType === 'SFTP' ) {
                $scope.scheduleParams.delivery_id = $scope.getDeliveryId('SFTP');
                $scope.scheduleParams.selectedFtpRecipient = $scope.selectedEntityDetails.sftp_server_id;
            } else {
               $scope.emailList = [];
               $scope.scheduleParams.selectedFtpRecipient = '';
            }

            $scope.timeSlots = reportUtils.createTimeSlots(TIME_SLOTS);
        };

        var fetchReqDatas = function() {
            var reset = true;

            var success = function(payload) {
                $scope.originalScheduleFrequency = payload.scheduleFrequency;
                $scope.originalScheduleTimePeriods = payload.scheduleTimePeriods;
                $scope.$parent.$parent.schedulesList = [];
                $scope.$parent.$parent.schedulableReports = [];
                $scope.scheduleDeliveryTypes = payload.scheduleDeliveryTypes;
                $scope.ftpServerList = payload.ftpServerList;

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
                _.each(payload.schedulableReports, function(each) {
                    $scope.$parent.$parent.schedulableReports.push({
                        id: each.id,
                        report: {
                            id: each.id,
                            description: each.description,
                            title: each.title
                        },
                        sort_fields: each.sort_fields,
                        active: false,
                        filteredOut: false
                    });
                });

                // sort schedulable reports by report name
                $scope.$parent.$parent.schedulableReports = _.sortBy(
                    $scope.$parent.$parent.schedulableReports,
                    function(item) {
                        return item.report.title;
                    }
                );

                /**
                 * Convert sys value to human
                 *
                 * @param {String} value the sys value
                 * @returns {String} converted value
                 */
                function getValue (value) {
                    switch (value) {
                    case 'DAILY':
                        return 'Day';
                    case 'HOURLY':
                        return 'Hour';
                    case 'WEEKLY':
                        return 'Week';
                    case 'MONTHLY':
                        return 'Month';
                    case 'RUN_ONCE':
                        return 'Once';
                    default:
                        return 'Per';
                    }
                }

                $scope.originalScheduleFreqType = _.map($scope.originalScheduleFrequency, function(freq) {
                    return {
                        id: freq.id,
                        value: getValue(freq.value),
                        originalValue: freq.value
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
                $scope.$emit( 'hideLoader' );
            };

            $scope.invokeApi( reportsSrv.reportExportPayload, {}, success, failed );
        };

        var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };

        var STAGES = {
            SHOW_SCHEDULE_LIST: 'SHOW_SCHEDULE_LIST',
            SHOW_PARAMETERS: 'SHOW_PARAMETERS',
            SHOW_DETAILS: 'SHOW_DETAILS',
            SHOW_DISTRIBUTION: 'SHOW_DISTRIBUTION'
        };


        BaseCtrl.call(this, $scope);


        $scope.runScheduleNow = function () {
            var params = {
                id: $scope.selectedEntityDetails.id
            };

            var getFtpAddress = function (id) {
                var has;
                var ret = {
                    description: '',
                    url: ''
                };

                if ( $scope.ftpServerList.length ) {
                    has = _.find($scope.ftpServerList, { id: id }) || ret;
                    ret = {
                        description: has.description,
                        url: has.url
                    };
                }

                return ret;
            };

            var showResponse = function () {
                $scope.runNowData = {
                    isEmail: $scope.checkDeliveryType('EMAIL'),
                    isFtp: $scope.checkDeliveryType('SFTP'),
                    isSingleEmail: $scope.emailList.length === 1,
                    ftpAddress: getFtpAddress($scope.scheduleParams.selectedFtpRecipient)
                };

                ngDialog.open({
                    template: '/assets/partials/reports/scheduleReport/rvRunScheduleNowUpdate.html',
                    scope: $scope
                });
            };

            var success = function() {
                $scope.errorMessage = '';
                $scope.$emit( 'hideLoader' );
                // if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
                //     $scope.selectedSchedule.active = false;
                // }
                // $scope.updateViewCol($scope.viewColsActions.ONE);

                $scope.runScheduleNowSuccess = true;
                showResponse();
            };

            var failed = function(errors) {
                $scope.errorMessage = errors;
                $scope.$emit( 'hideLoader' );

                $scope.runScheduleNowSuccess = false;
                showResponse();
            };

            $scope.invokeApi( reportsSrv.runScheduleNow, params, success, failed );
        };

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

                if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
                    $scope.selectedSchedule.active = false;
                }
                $scope.selectedSchedule = $scope.$parent.$parent.schedulesList[index];
                $scope.selectedSchedule.active = true;
                /**/
                $scope.selectedReport.active = false;

                $scope.addingStage = STAGES.SHOW_DISTRIBUTION;
                $scope.updateViewCol($scope.viewColsActions.FOUR);

                filterScheduleTimePeriod($scope.selectedEntityDetails);
                filterScheduleFrequency($scope.selectedEntityDetails);
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

            if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
                $scope.selectedReport.active = false;
            }
            $scope.selectedReport = $scope.$parent.$parent.schedulableReports[index];
            $scope.selectedReport.active = true;
            /**/
            $scope.selectedSchedule.active = false;

            $scope.addingStage = STAGES.SHOW_PARAMETERS;
            $scope.updateViewCol($scope.viewColsActions.TWO);

            filterScheduleTimePeriod($scope.selectedEntityDetails);
            filterScheduleFrequency($scope.selectedEntityDetails);
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

                fetchReqDatas();
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

            $scope.updateView($scope.reportViewActions.SHOW_EXPORT_A_REPORT);
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

            $scope.updateView($scope.reportViewActions.SHOW_EXPORT_REPORTS);
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
            return $scope.addingStage === STAGES.SHOW_SCHEDULE_LIST ||
                $scope.addingStage === STAGES.SHOW_PARAMETERS;
        };

        $scope.shouldHideDistributionCol = function() {
            return $scope.addingStage === STAGES.SHOW_SCHEDULE_LIST ||
                $scope.addingStage === STAGES.SHOW_PARAMETERS ||
                $scope.addingStage === STAGES.SHOW_DETAILS;
        };
        /*
         * Show export calender only for joyrnal export
         */
        $scope.shouldShowExportCalenderDate = function () {
            if ($scope.selectedEntityDetails.report.title === 'Journal Export') {
                var dateFieldObject = _.find($scope.originalScheduleTimePeriods,
                    function(item) {
                        return item.value === 'DATE'; }
                    );

                if (dateFieldObject.id === $scope.scheduleParams.time_period_id) {
                    return true;
                }
            }
            return false;
        };

        $scope.notRunOnce = function () {
            var match = _.find($scope.originalScheduleFrequency, { id: $scope.scheduleParams.frequency_id }) || {};

            return match.value !== 'RUN_ONCE';
        };

        $scope.checkDeliveryType = function (checkFor) {
            var match = _.find($scope.scheduleDeliveryTypes, { id: $scope.scheduleParams.delivery_id }) || {};

            return match.value === checkFor;
        };
        $scope.getDeliveryId = function (checkFor) {
            var match = _.find($scope.scheduleDeliveryTypes, { value: checkFor }) || {};

            return match.id;
        };

        // Listener for scheduling new report
        let createNewExportScheduleListener = $scope.$on('CREATE_NEW_EXPORT_SCHEDULE', () => {
            $scope.scheduleReport();
        });

        $scope.$on('$destroy', createNewExportScheduleListener);

        /**
         * Start everything
         * @return {Object} undefined
         *
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
            $scope.scheduleFreqType = [];
            $scope.emailList = [];

            $scope.scheduleParams = {};

            setupScrolls();

            fetchReqDatas();
        }

        init();
    }
]);
