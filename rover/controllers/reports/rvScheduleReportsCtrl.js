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
        const SHOW_ERROR_MSG_EVENT = 'SHOW_ERROR_MSG_EVENT';
        var runDuringEodScheduleFrequencyId;

        var originalScheduleFormats = [];

        var showFilterNames = [
            'INCLUDE_DUE_OUT',
            'INCLUDE_INHOUSE',
            'EXCEEDED_ONLY',
            'OOO',
            'OOS'
        ];

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
            if (!!reset && $scope.myScroll.hasOwnProperty(name)) {
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
                frequency = _.find($scope.originalScheduleFrequency, { id: item.frequency_id }),
                description = '',
                value = '';

            var FREQ_VALUES = {
                DAILY: 'DAILY',
                HOURLY: 'HOURLY',
                WEEKLY: 'WEEKLY',
                MONTHLY: 'MONTHLY'
            };

            if (frequency) {
                description = frequency.description;
                value = frequency.value;
            }

            if (item.repeats_every === 0 || !item.repeats_every) {
                occurance += description.toLowerCase();
            } else {
                occurance += 'after every ' + item.repeats_every + ' ';

                if (value === FREQ_VALUES.DAILY) {
                    occurance += item.repeats_every === 1 ? 'day' : 'days';
                } else if (value === FREQ_VALUES.HOURLY) {
                    occurance += item.repeats_every === 1 ? 'hour' : 'hours';
                } else if (value === FREQ_VALUES.WEEKLY) {
                    occurance += item.repeats_every === 1 ? 'week' : 'weeks';
                } else if (value === FREQ_VALUES.MONTHLY) {
                    occurance += item.repeats_every === 1 ? 'month' : 'months';
                } else if (value === FREQ_VALUES.MONTHLY) {
                    occurance += item.repeats_every === 1 ? 'month' : 'months';
                }
            }

            if (item.time) {
                occurance += ' at ' + item.time + '. ';
            } else {
                occurance += '. ';
            }

            if (item.starts_on) {
                occurance += 'Started on ' + $filter('date')(item.starts_on, $rootScope.dateFormat) + '. ';
            }

            if (item.ends_on_after) {
                occurance += 'Ends after ' + item.ends_on_after + ' times.';
            } else if (item.ends_on_date) {
                occurance += 'Ends on ' + $filter('date')(item.ends_on_date, $rootScope.dateFormat) + '.';
            } else {
                occurance += 'Runs forever.';
            }

            return occurance;
        };

        var validateSchedule = function() {
            var hasTimePeriod = function() {
                var has = false;

                if ($scope.isYearlyTaxReport || $scope.isGuestBalanceReport || 
                    $scope.isCreditCheckReport || $scope.isRoomStatusReport || 
                    angular.isDefined($scope.scheduleParams.time_period_id)) {
                    has = true;
                }

                if ($scope.isReservationsByUserReport) {
                    has = $scope.scheduleParams.create_date_range || $scope.scheduleParams.arrival_date_range;
                }

                if ($scope.isRateAdjustmentReport) {
                    has = $scope.scheduleParams.arrival_date_range || $scope.scheduleParams.adjustment_date_range;
                }

                if ($scope.isCancellationNoShowReport) {
                    has = $scope.scheduleParams.date_range || $scope.scheduleParams.cancelation_date_range; 
                }

                return has;
            };

            var hasFrequency = function() {
                return !!$scope.scheduleParams.frequency_id;
            };

            var hasValidDistribution = function() {
                var hasEmail = $scope.checkDeliveryType('EMAIL') && $scope.emailList.length,
                    hasFTP = $scope.checkDeliveryType('SFTP') && !!$scope.scheduleParams.selectedFtpRecipient,
                    hasDropbox = $scope.checkDeliveryType('DROPBOX') && !!$scope.scheduleParams.selectedCloudAccount,
                    hasGoogleDrive = $scope.checkDeliveryType('GOOGLE DRIVE') && !!$scope.scheduleParams.selectedCloudAccount;

                return hasEmail || hasFTP || hasDropbox || hasGoogleDrive;
            };

            return hasTimePeriod() && hasFrequency() && hasValidDistribution();
        };

        var fillValidationErrors = function() {
            $scope.createErrors = [];

            if (!$scope.isYearlyTaxReport && !$scope.isGuestBalanceReport && !$scope.scheduleParams.time_period_id) {
                $scope.createErrors.push('Time period in parameters');
            }
            if (!$scope.scheduleParams.frequency_id) {
                $scope.createErrors.push('Repeat frequency in details');
            }
            if (!$scope.emailList.length && !$scope.scheduleParams.selectedFtpRecipient &&
                !$scope.scheduleParams.selectedCloudAccount) {
                $scope.createErrors.push('Emails/SFTP/Dropbox/Google Drive in distribution list');
            }
        };

        // Get rates list
        var getRateListToShow = function(item) {
            // if selected some room types
            var listedRateTypes = item.hasRateTypeFilter.data,
                selectedRateTypes = _.where(listedRateTypes, { selected: true }),
                selectedRateTypesIds = _.pluck(selectedRateTypes, 'rate_type_id');

            return _.filter(item.hasRateFilter.data, function(rate) {
                return (selectedRateTypesIds.indexOf(rate.rate_type_id) > -1);
            });
        };

        // Get rate types
        var getSelectedRateTypes = function(item) {
            return _.pluck(_.where(item.hasRateTypeFilter.data, { selected: true }), 'rate_type_id');
        };

        // Set exclude_tax to true for Daily Production Reports
        var isDailyProdReport = function() {
            return ($scope.selectedEntityDetails.report.title === reportNames['DAILY_PRODUCTION_ROOM_TYPE'] ||
                $scope.selectedEntityDetails.report.title === reportNames['DAILY_PRODUCTION_DEMO'] ||
                $scope.selectedEntityDetails.report.title === reportNames['DAILY_PRODUCTION_RATE']);
        };

        /**
         * Navigate to the schedulable report list
         */
        $scope.navigateToSchedulableReportList = function() {
            ngDialog.close();
            if (!!$scope.selectedReport && $scope.selectedReport.active) {
                $scope.selectedReport.active = false;
            }
            $scope.updateViewCol($scope.viewColsActions.ONE);
            $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

            fetch_reportSchedules_frequency_timePeriod_scheduableReports();
        };

        var createSchedule = function() {
            var params = {
                report_id: $scope.selectedEntityDetails.report.id,
                hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
                /**/
                format_id: $scope.scheduleParams.format_id,
                delivery_type_id: ''
            };

            var filter_values = {
                page: 1,
                per_page: 99999
            };

            var key;

            var success = function(data) {
                $scope.errorMessage = '';
                $scope.$emit('hideLoader');
                if (data.is_export_already_exist) {
                    ngDialog.open({
                        template: '/assets/partials/reports/rvDuplicateScheduleWarningPopup.html',
                        scope: $scope,
                        closeByEscape: false,
                        data: {
                            isUpdate: false
                        }
                    });
                } else {
                    $scope.navigateToSchedulableReportList();
                }
            };

            var failed = function(errors) {
                $scope.errorMessage = errors;
                $scope.$emit(SHOW_ERROR_MSG_EVENT, errors);
                $scope.$emit('hideLoader');
            };

            // fill 'time' and 'time_period_id'
            if ($scope.scheduleParams.time) {
                params.time = $scope.scheduleParams.time;
            }
            if ($scope.scheduleParams.time_period_id) {
                params.time_period_id = $scope.scheduleParams.time_period_id;
            }

            if ($scope.scheduleParams.create_date_range) {
                filter_values.create_date_range = $scope.scheduleParams.create_date_range;
            }

            if ($scope.scheduleParams.arrival_date_range) {
                filter_values.arrival_date_range = $scope.scheduleParams.arrival_date_range;
            }

            if ($scope.scheduleParams.adjustment_date_range) {
                filter_values.adjustment_date_range = $scope.scheduleParams.adjustment_date_range;
            }

            if ($scope.scheduleParams.date_range) {
                filter_values.date_range = $scope.scheduleParams.date_range;
            }

            if ($scope.scheduleParams.cancelation_date_range) {
                filter_values.cancelation_date_range = $scope.scheduleParams.cancelation_date_range;
            }

            // fill 'frequency_id', 'starts_on', 'repeats_every' and 'ends_on_date'
            params.frequency_id = $scope.scheduleParams.frequency_id;
            /**/
            if ($scope.scheduleParams.starts_on) {
                params.starts_on = $filter('date')($scope.scheduleParams.starts_on, 'yyyy/MM/dd');
            }
            if ($scope.scheduleParams.frequency_id === runDuringEodScheduleFrequencyId) {
                params.repeats_every = null;
            } else if ($scope.scheduleParams.repeats_every) {
                params.repeats_every = $scope.scheduleParams.repeats_every;
            } else {
                params.repeats_every = 0;
            }
            if ($scope.scheduleParams.scheduleEndsOn === 'NUMBER') {
                params.ends_on_after = $scope.scheduleParams.ends_on_after;
            } else if ($scope.scheduleParams.scheduleEndsOn === 'DATE') {
                params.ends_on_date = $filter('date')($scope.scheduleParams.ends_on_date, 'yyyy/MM/dd');
            } else {
                params.ends_on_after = null;
                params.ends_on_date = null;
            }

            var deliveryType = _.find($scope.scheduleDeliveryTypes, {
                value: $scope.scheduleParams.delivery_id
            });

            if (deliveryType) {
                params.delivery_type_id = parseInt(deliveryType.id);
            }

            // fill emails/FTP
            if ($scope.checkDeliveryType('EMAIL') && $scope.emailList.length) {
                params.emails = $scope.emailList.join(', ');
            } else if ($scope.checkDeliveryType('SFTP') && !!$scope.scheduleParams.selectedFtpRecipient) {
                params.sftp_server_id = $scope.scheduleParams.selectedFtpRecipient;
            } else if (($scope.checkDeliveryType('GOOGLE DRIVE') || $scope.checkDeliveryType('DROPBOX')) &&
                !!$scope.scheduleParams.selectedCloudAccount) {
                params.cloud_drive_id = $scope.scheduleParams.selectedCloudAccount;
            } else {
                params.emails = '';
                params.sftp_server_id = '';
            }

            // fill sort_field and filters
            if ($scope.scheduleParams.sort_field) {
                filter_values.sort_field = $scope.scheduleParams.sort_field;
            }
            if ($scope.isYearlyTaxReport) {
                filter_values.year = $scope.scheduleParams.year;
                filter_values.with_vat_number = $scope.scheduleParams.with_vat_number;
                filter_values.without_vat_number = $scope.scheduleParams.without_vat_number;
            }
            if ($scope.isOccupancyRevenueSummaryReport) {
                filter_values.include_day_use = $scope.scheduleParams.include_day_use;
            }

            // Fill group by fields
            if ($scope.selectedEntityDetails.group_fields.length > 0) {
                var groupByKey = '';

                if ('DATE' === $scope.scheduleParams.groupBy) {
                    groupByKey = reportParams['GROUP_BY_DATE'];
                } else if ('USER' === $scope.scheduleParams.groupBy) {
                    groupByKey = reportParams['GROUP_BY_USER'];
                } else if ('ADDON' === $scope.scheduleParams.groupBy) {
                    groupByKey = reportParams['ADDON_GROUP_BY'];
                }

                if (groupByKey) {
                    filter_values[groupByKey] = true;
                }
            }
            _.each($scope.filters, function(filter, keyName) {
                if (keyName === 'hasRateTypeFilter') {
                    filter_values[reportParams['RATE_TYPE_IDS']] = getSelectedRateTypes($scope.filters);
                } else if (keyName === 'hasRateFilter') {
                    key = reportParams['RATE_IDS'];
                    filter_values[key] = _.pluck(_.where(getRateListToShow($scope.filters), { selected: true }), 'id');
                    // For the daily production rates; we are to send an array with group or allotment ids
                    if (reportNames['DAILY_PRODUCTION_RATE'] === $scope.selectedEntityDetails.report.title) {
                        var selectedCustomRates = _.pluck(_.where(getRateListToShow($scope.filters), {
                            selected: true,
                            id: null
                        }), 'group_id');

                        if (selectedCustomRates.length > 0) {
                            params[key] = _.without(params[key], null); // remove null entries in the rate_ids array (null entries would be there if custom rates were selected)
                            params['custom_rate_group_ids'] = selectedCustomRates;
                        }
                    }
                } else if (keyName === 'hasByChargeGroup') {
                    key = reportParams['CHARGE_GROUP_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasByChargeCode') {
                    key = reportParams['CHARGE_CODE_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasDepartments') {
                    key = reportParams['ASSIGNED_DEPARTMENTS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasIncludeCountry') {
                    key = reportParams['COUNTRY'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasCompletionStatus') {
                    key = reportParams['COMPLETION_STATUS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasShowActionables') {
                    key = reportParams['SHOW_ACTIONABLES'];
                    if ($scope.filters.showActionables === 'BOTH') {
                        filter_values[key] = ['GUEST', 'GROUP'];
                    } else {
                        filter_values[key] = [$scope.filters.showActionables];
                    }

                } else if (keyName === 'hasUsers') {
                    key = reportParams['USER_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');
                    if (filter_values[key].length === filter.data.length) {
                        filter_values['all_users_selected'] = true;
                    }

                } else if (keyName === 'hasMarketsList') {
                    key = reportParams['MARKET_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasOriginsList') {
                    key = reportParams['BOOKING_ORIGIN_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasSourcesList') {
                    key = reportParams['SOURCE_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasHkReservationStatus') {
                    key = reportParams['HK_RESERVATION_STATUSES'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'status');

                } else if (keyName === 'hasReservationStatus') {
                    key = reportParams['RESERVATION_STATUS'];
                    var statuses = _.pluck(_.where(filter.data, { selected: true }), 'id');

                    statuses = statuses.map(id => id.toString());
                    filter_values[key] = statuses;

                } else if (keyName === 'hasFloorList') {
                    key = reportParams['FLOOR'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasIncludeWorkTypes') {
                    key = reportParams['WORK_TYPE'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasFrontOfficeStatus') {
                    key = reportParams['HK_FRONT_OFFICE_STATUSES'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'status');

                } else if (keyName === 'hasHouseKeepingStatus') {
                    key = reportParams['HOUSEKEEPING_STATUS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');                    
                    
                } else if (keyName === 'hasIncludeCompanyTaGroup' && $scope.selectedEntityDetails.chosenIncludeCompanyTaGroup) {
                    key = filter.value.toLowerCase();
                    filter_values[key] = $scope.selectedEntityDetails.chosenIncludeCompanyTaGroup;
                    filter_values[reportParams['ENTITY_TYPE']] = $scope.selectedEntityDetails.chosenIncludeCompanyTaGroupType;
                    filter_values[reportParams['ENTITY_NAME']] = $scope.selectedEntityDetails.uiChosenIncludeCompanyTaGroup;
                } else if (keyName === 'hasGuaranteeTypeList') {
                    key = reportParams['INCLUDE_GUARANTEE_TYPE'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasSegmentList') {
                    key = reportParams['SEGMENT_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasRoomTypeList') {
                    key = reportParams['ROOM_TYPE_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasRateCodeList') {
                    key = reportParams['RATE_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');
                } else if (keyName === 'hasAddonGroups') {
                    key = reportParams['ADDONS_GROUPS_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');
                } else if (keyName === 'hasAddons') {
                    key = reportParams['ADDONS_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'addon_id');
                } else if (keyName === 'hasIncludeAgingBalance') {
                    key = reportParams['AGING_BALANCE'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');
                } else if (keyName === 'hasAccountSearch') {
                    key = reportParams['ACCOUNT_SEARCH'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');
                } else {
                    _.each(filter.data, function(each) {
                        if (each.selected) {
                            filter_values[each.paramKey] = true;
                        }
                    });
                }

            });
            params.filter_values = filter_values;

            if (isDailyProdReport()) {
                params.filter_values.exclude_tax = true;
            }

            if ($scope.scheduleParams.includeTitleHeader && ($scope.scheduleParams.format_id === $scope.CSV_FORMAT_ID)) {
                params.include_title_header = $scope.scheduleParams.includeTitleHeader;
            }

            $scope.invokeApi(reportsSrv.createSchedule, params, success, failed);
        };

        // Navigate to schedules list
        $scope.navigateToSchedulesList = (params) => {
            ngDialog.close();
            var updatedIndex = _.findIndex($scope.$parent.$parent.schedulesList, { id: params.id });

            if (!!$scope.selectedSchedule && $scope.selectedSchedule.active) {
                $scope.selectedSchedule.active = false;
            }
            $scope.updateViewCol($scope.viewColsActions.ONE);
            $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

            if (updatedIndex >= 0) {
                $scope.$parent.$parent.schedulesList[updatedIndex].frequency_id = params.frequency_id;
                $scope.$parent.$parent.schedulesList[updatedIndex].repeats_every = params.repeats_every;
                $scope.$parent.$parent.schedulesList[updatedIndex].time = params.time;
                $scope.$parent.$parent.schedulesList[updatedIndex].starts_on = params.starts_on;
                $scope.$parent.$parent.schedulesList[updatedIndex].ends_on_after = params.ends_on_after;
                $scope.$parent.$parent.schedulesList[updatedIndex].ends_on_date = params.ends_on_date;

                $scope.$parent.$parent.schedulesList[updatedIndex].occurance = findOccurance($scope.$parent.$parent.schedulesList[updatedIndex]);
            }
        };

        var saveSchedule = function() {
            var params = {
                id: $scope.selectedEntityDetails.id,
                report_id: $scope.selectedEntityDetails.report.id,
                hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
                /**/
                format_id: $scope.scheduleParams.format_id,
                delivery_type_id: ''
            };

            var filter_values = {
                page: 1,
                per_page: 99999
            };

            var key;

            var success = function(data) {
                $scope.errorMessage = '';
                $scope.$emit('hideLoader');
                if (data.is_export_already_exist) {
                    ngDialog.open({
                        template: '/assets/partials/reports/rvDuplicateScheduleWarningPopup.html',
                        scope: $scope,
                        closeByEscape: false,
                        data: {
                            isUpdate: true,
                            params: params
                        }
                    });
                } else {
                    $scope.navigateToSchedulesList(params);
                }

            };

            var failed = function(errors) {
                $scope.errorMessage = errors;
                $scope.$emit(SHOW_ERROR_MSG_EVENT, errors);
                $scope.$emit('hideLoader');
            };

            // fill 'time' and 'time_period_id'
            if ($scope.scheduleParams.time) {
                params.time = $scope.scheduleParams.time;
            }
            if ($scope.scheduleParams.time_period_id) {
                params.time_period_id = $scope.scheduleParams.time_period_id;
            }

            if ($scope.scheduleParams.create_date_range) {
                filter_values.create_date_range = $scope.scheduleParams.create_date_range;
            }

            if ($scope.scheduleParams.arrival_date_range) {
                filter_values.arrival_date_range = $scope.scheduleParams.arrival_date_range;
            }

            if ($scope.scheduleParams.adjustment_date_range) {
                filter_values.adjustment_date_range = $scope.scheduleParams.adjustment_date_range;
            }

            if ($scope.scheduleParams.date_range) {
                filter_values.date_range = $scope.scheduleParams.date_range;
            }

            if ($scope.scheduleParams.cancelation_date_range) {
                filter_values.cancelation_date_range = $scope.scheduleParams.cancelation_date_range;
            }

            params.format_id = parseInt($scope.scheduleParams.format_id);

            // fill 'frequency_id', 'starts_on', 'repeats_every' and 'ends_on_date'
            params.frequency_id = $scope.scheduleParams.frequency_id;
            /**/
            if ($scope.scheduleParams.starts_on) {
                params.starts_on = $filter('date')($scope.scheduleParams.starts_on, 'yyyy/MM/dd');
            }
            if ($scope.scheduleParams.frequency_id === runDuringEodScheduleFrequencyId) {
                params.repeats_every = null;
            } else if ($scope.scheduleParams.repeats_every) {
                params.repeats_every = $scope.scheduleParams.repeats_every;
            } else {
                params.repeats_every = 0;
            }

            if ($scope.scheduleParams.scheduleEndsOn === 'NUMBER') {
                params.ends_on_after = $scope.scheduleParams.ends_on_after;
            } else if ($scope.scheduleParams.scheduleEndsOn === 'DATE') {
                params.ends_on_date = $filter('date')($scope.scheduleParams.ends_on_date, 'yyyy/MM/dd');
            } else {
                params.ends_on_after = null;
                params.ends_on_date = null;
            }

            var deliveryType = _.find($scope.scheduleDeliveryTypes, {
                value: $scope.scheduleParams.delivery_id
            });

            if (deliveryType) {
                params.delivery_type_id = parseInt(deliveryType.id);
            }

            // fill emails/FTP
            if ($scope.checkDeliveryType('EMAIL') && $scope.emailList.length) {
                params.emails = $scope.emailList.join(', ');
            } else if ($scope.checkDeliveryType('SFTP') && !!$scope.scheduleParams.selectedFtpRecipient) {
                params.sftp_server_id = $scope.scheduleParams.selectedFtpRecipient;
            } else if (($scope.checkDeliveryType('GOOGLE DRIVE') || $scope.checkDeliveryType('DROPBOX')) &&
                !!$scope.scheduleParams.selectedCloudAccount) {
                params.cloud_drive_id = $scope.scheduleParams.selectedCloudAccount;
            } else {
                params.emails = '';
                params.sftp_server_id = '';
            }

            // fill sort_field and filters
            if ($scope.scheduleParams.sort_field) {
                filter_values.sort_field = $scope.scheduleParams.sort_field;
            }
            if ($scope.isYearlyTaxReport) {
                filter_values.year = $scope.scheduleParams.year;
                filter_values.with_vat_number = $scope.scheduleParams.with_vat_number;
                filter_values.without_vat_number = $scope.scheduleParams.without_vat_number;
            }
            if ($scope.isOccupancyRevenueSummaryReport) {
                filter_values.include_day_use = $scope.scheduleParams.include_day_use;
            }

            // Fill group by fields
            if ($scope.selectedEntityDetails.group_fields.length > 0) {
                var groupByKey = '';

                if ('DATE' === $scope.scheduleParams.groupBy) {
                    groupByKey = reportParams['GROUP_BY_DATE'];
                } else if ('USER' === $scope.scheduleParams.groupBy) {
                    groupByKey = reportParams['GROUP_BY_USER'];
                } else if ('ADDON' === $scope.scheduleParams.groupBy) {
                    groupByKey = reportParams['ADDON_GROUP_BY'];
                }
                
                if (groupByKey) {
                    filter_values[groupByKey] = true;
                }
            }
            _.each($scope.filters, function(filter, keyName) {
                if (keyName === 'hasRateTypeFilter') {
                    filter_values[reportParams['RATE_TYPE_IDS']] = getSelectedRateTypes($scope.filters);
                } else if (keyName === 'hasRateFilter') {
                    key = reportParams['RATE_IDS'];
                    filter_values[key] = _.pluck(_.where(getRateListToShow($scope.filters), { selected: true }), 'id');
                    // For the daily production rates; we are to send an array with group or allotment ids
                    if (reportNames['DAILY_PRODUCTION_RATE'] === $scope.selectedEntityDetails.report.title) {
                        var selectedCustomRates = _.pluck(_.where(getRateListToShow($scope.filters), {
                            selected: true,
                            id: null
                        }), 'group_id');

                        if (selectedCustomRates.length > 0) {
                            params[key] = _.without(params[key], null); // remove null entries in the rate_ids array (null entries would be there if custom rates were selected)
                            params['custom_rate_group_ids'] = selectedCustomRates;
                        }
                    }
                } else if (keyName === 'hasByChargeGroup') {
                    key = reportParams['CHARGE_GROUP_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasByChargeCode') {
                    key = reportParams['CHARGE_CODE_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasDepartments') {
                    key = reportParams['ASSIGNED_DEPARTMENTS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasIncludeCountry') {
                    key = reportParams['COUNTRY'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasMarketsList') {
                    key = reportParams['MARKET_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasOriginsList') {
                    key = reportParams['BOOKING_ORIGIN_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasSourcesList') {
                    key = reportParams['SOURCE_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasSegmentsList') {
                    key = reportParams['SEGMENT_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasCompletionStatus') {
                    key = reportParams['COMPLETION_STATUS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasHkReservationStatus') {
                    key = reportParams['HK_RESERVATION_STATUSES'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'status');

                } else if (keyName === 'hasReservationStatus') {
                    key = reportParams['RESERVATION_STATUS'];
                    var statuses = _.pluck(_.where(filter.data, { selected: true }), 'id');

                    statuses = statuses.map(id => id.toString());
                    filter_values[key] = statuses;

                } else if (keyName === 'hasFloorList') {
                    key = reportParams['FLOOR'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasIncludeWorkTypes') {
                    key = reportParams['WORK_TYPE'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasFrontOfficeStatus') {
                    key = reportParams['HK_FRONT_OFFICE_STATUSES'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'status');

                } else if (keyName === 'hasHouseKeepingStatus') {
                    key = reportParams['HOUSEKEEPING_STATUS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasShowActionables') {
                    key = reportParams['SHOW_ACTIONABLES'];
                    if ($scope.filters.showActionables === 'BOTH') {
                        filter_values[key] = ['GUEST', 'GROUP'];
                    } else {
                        filter_values[key] = [$scope.filters.showActionables];
                    }

                } else if (keyName === 'hasUsers') {
                    key = reportParams['USER_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');
                    if (filter_values[key].length === filter.data.length) {
                        filter_values['all_users_selected'] = true;
                    }

                } else if (keyName === 'hasIncludeCompanyTaGroup' && $scope.selectedEntityDetails.chosenIncludeCompanyTaGroup) {
                    key = filter.value.toLowerCase();
                    filter_values[key] = $scope.selectedEntityDetails.chosenIncludeCompanyTaGroup;
                    filter_values[reportParams['ENTITY_TYPE']] = $scope.selectedEntityDetails.chosenIncludeCompanyTaGroupType;
                    filter_values[reportParams['ENTITY_NAME']] = $scope.selectedEntityDetails.uiChosenIncludeCompanyTaGroup;
                } else if (keyName === 'hasGuaranteeTypeList') {
                    key = reportParams['INCLUDE_GUARANTEE_TYPE'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasSegmentList') {
                    key = reportParams['SEGMENT_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasRoomTypeList') {
                    key = reportParams['ROOM_TYPE_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasRateCodeList') {
                    key = reportParams['RATE_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');
                
                } else if (keyName === 'hasAddonGroups') {
                    key = reportParams['ADDONS_GROUPS_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');

                } else if (keyName === 'hasAddons') {
                    key = reportParams['ADDONS_IDS'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'addon_id');

                } else if (keyName === 'hasIncludeAgingBalance') {
                    key = reportParams['AGING_BALANCE'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');
                } else if (keyName === 'hasAccountSearch') {
                    key = reportParams['ACCOUNT_SEARCH'];
                    filter_values[key] = _.pluck(_.where(filter.data, { selected: true }), 'id');
                } else {
                    _.each(filter.data, function(each) {
                        if (each.selected) {
                            filter_values[each.paramKey] = true;
                        }
                    });
                }

            });
            params.filter_values = filter_values;

            if (isDailyProdReport()) {
                params.filter_values.exclude_tax = true;
            }

            if ($scope.scheduleParams.includeTitleHeader && ($scope.scheduleParams.format_id === $scope.CSV_FORMAT_ID)) {
                params.include_title_header = $scope.scheduleParams.includeTitleHeader;
            }

            $scope.invokeApi(reportsSrv.updateSchedule, params, success, failed);
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
            HAS_VEHICLE_REG_NO: 'HAS_VEHICLE_REG_NO',
            SHOW_PHONE_NUMBER: 'SHOW_PHONE_NUMBER',
            // this filter for few reports could also be listed
            // under SHOW and not OPTIONS
            INCLUDE_DUE_OUT: 'INCLUDE_DUE_OUT',
            RESTRICTED_POST_ONLY: 'RESTRICTED_POST_ONLY',
            INCLUDE_TAX: 'INCLUDE_TAX',
            INCLUDE_LEDGER_DATA: 'INCLUDE_LEDGER_DATA',
            NO_NATIONALITY: 'NO_NATIONALITY',
            EXCLUDE_NON_GTD: 'EXCLUDE_NON_GTD',
            INCLUDE_NEW: 'INCLUDE_NEW',
            INCLUDE_BOTH: 'INCLUDE_BOTH',
            SHOW_RATE_ADJUSTMENTS_ONLY: 'SHOW_RATE_ADJUSTMENTS_ONLY',
            INCLUDE_CANCELLED: 'INCLUDE_CANCELLED',
            INCLUDE_LAST_YEAR: 'INCLUDE_LAST_YEAR',
            INCLUDE_VARIANCE: 'INCLUDE_VARIANCE',
            ACCOUNT: 'ACCOUNT',
            GUEST: 'GUEST'
        };

        var matchSortFields = {
            DATE: 'DATE',
            NAME: 'NAME',
            ROOM: 'ROOM',
            BALANCE: 'BALANCE',
            ROOM_NO: 'ROOM_NO',
            DEPARTMENT: 'DEPARTMENT',
            CHARGE_CODE: 'CHARGE_CODE',
            USER: 'USER',
            CREATE_DATE: 'CREATE_DATE',
            GUARANTEE_TYPE: 'GUARANTEE_TYPE',
            OVERRIDE_AMOUNT: 'OVERRIDE_AMOUNT',
            RATE_AMOUNT: 'RATE_AMOUNT',
            RESERVATION: 'RESERVATION',
            TYPE: 'TYPE',
            END_DATE: 'END_DATE',
            ROOM_TYPE: 'ROOM_TYPE',
            START_DATE: 'START_DATE',
            GUEST_USER: 'GUEST_USER',
            CREDIT: 'CREDIT',
            DEBIT: 'DEBIT',
            AR_NUMBER: 'AR_NUMBER',
            ACCOUNT_NAME: 'ACCOUNT_NAME',
            GUEST_NAME: 'GUEST_NAME'
        };
        
        var groupByFields = {
            GROUP_BY_DATE: 'DATE',
            GROUP_BY_USER: 'USER',
            GROUP_FIELD: 'ADDON'
        };

        var reportIconCls = {
            'Arriving Guests': 'guest-status check-in',
            'Departing Guests': 'guest-status check-out',
            'All In-House Guests': 'guest-status inhouse',
            'Balance for all Outstanding Accounts': 'icon-report icon-balance',
            'Statistics Report by Comparison': 'icon-report icon-comparison',
            'Company or Travel Agent Accounts with total net revenue over EUR 250.00.': 'icon-report icon-forecast'
        };

        var displayFilterNames = {
            'INCLUDE_MARKET': true,
            'INCLUDE_SOURCE': true,
            'INCLUDE_ORIGIN': true,
            'INCLUDE_SEGMENT': true
        };

        // Process Display filters
        var processDisplayFilters = function(filter) {

            $scope.filters.hasDisplay.data.push({
                paramKey: filter.value.toLowerCase(),
                description: filter.description,
                selected: true
            });
        };

        // Populate the time period data for each of the time period name
        var populateTimePeriodsData = (selectedTimePeriods) => {
            var timePeriodsData = [];

            _.each(selectedTimePeriods, function(timePeriod) {
                timePeriodsData.push(_.find($scope.originalScheduleTimePeriods, { value: timePeriod }));
            });

            return timePeriodsData;
        };

        // Process sort fields if any
        var processSortFields = () => {
            if ($scope.selectedEntityDetails.report.title === reportNames['RESERVATIONS_BY_USER']) {
                $scope.selectedEntityDetails.sort_fields = _.reject($scope.selectedEntityDetails.sort_fields, (sortField) => {
                    return sortField.value === 'TYPE';
                });
            }
            
        };

        // Get user list
        var getUserList = () => {
            var userList = angular.copy( $scope.$parent.activeUserList);

            if ($scope.selectedEntityDetails.report.title === reportNames['ROOM_STATUS_REPORT']) {
                var UNDEFINED = {
                    full_name: 'UNDEFINED',
                    id: -1
                };

                userList.push(UNDEFINED);
            }

            return userList;
           
        };

        // this is a temporary setup
        // may have to share logic with
        // rvReportUtilsFac.js in future
        var setupFilters = function() {
            $scope.filters = {};

            if ($scope.selectedEntityDetails.report.title === reportNames['CREDIT_CHECK_REPORT']) {
                $scope.scheduleParams.sort_field = 'ROOM_NO';
            }

            $scope.filters.hasGeneralOptions = {
                data: [],
                options: {
                    selectAll: false,
                    hasSearch: false,
                    key: 'description'
                }
            };

            $scope.filters.hasDisplay = {
                data: [],
                options: {
                    selectAll: true,
                    hasSearch: false,
                    key: 'description',
                    defaultValue: 'Select displays'
                }
            };

            $scope.filters.hasShow = {
                data: [],
                options: {
                    selectAll: false,
                    hasSearch: false,
                    key: 'description',
                    allValue: 'Both',
                    defaultValue: 'Select options'
                }
            };

            var pushShowData = function(filter) {
                $scope.filters['hasShow']['data'].push({
                    paramKey: filter.value.toLowerCase(),
                    description: filter.description,
                    selected: filter.value !== 'EXCEEDED_ONLY'
                });
            };

            if ($scope.selectedEntityDetails.report.title === reportNames['RESERVATIONS_BY_USER']) {
                $scope.selectedEntityDetails.filters.push({
                    value: 'SHOW_EMPLOYEES'
                });
            }

            _.each($scope.selectedEntityDetails.filters, function(filter) {
                var selected = false,
                    mustSend = false;
                
                // For credit check report, include due out comes under show
                if (matchGeneralOptions[filter.value] && !$scope.isCreditCheckReport) {
                    if ($scope.selectedEntityDetails.report.description === 'Arriving Guests' && filter.value === 'DUE_IN_ARRIVALS') {
                        selected = true;
                    }

                    if ($scope.selectedEntityDetails.report.description === 'Departing Guests' && filter.value === 'DUE_OUT_DEPARTURES') {
                        selected = true;
                    }

                    if ($scope.selectedEntityDetails.report.description === 'All In-House Guests' && filter.value === 'INCLUDE_DUE_OUT') {
                        selected = true;
                    }

                    if ($scope.selectedEntityDetails.report.description === 'Restricted Post only' && filter.value === 'RESTRICTED_POST_ONLY') {
                        selected = false;
                    }

                    if ($scope.selectedEntityDetails.report.title === reportNames['RESERVATIONS_BY_USER'] && filter.value === 'INCLUDE_NEW') {
                        selected = true;
                    }

                    if ($scope.selectedEntityDetails.report.title === reportNames['OCCUPANCY_REVENUE_SUMMARY']) {
                        selected = true;
                    }

                    if (filter.value === 'ACCOUNT' || filter.value === 'GUEST') {
                        selected = true;
                    }

                    if ($scope.selectedEntityDetails.report.title === reportNames['FORECAST_GUEST_GROUPS'] && filter.value === 'EXCLUDE_NON_GTD') {
                        selected = true;
                    }

                    if ($scope.selectedEntityDetails.report.title === reportNames['CANCELLATION_NO_SHOW'] && filter.value === 'INCLUDE_CANCELED') {
                        selected = true;
                    }

                    $scope.filters.hasGeneralOptions.data.push({
                        paramKey: filter.value.toLowerCase(),
                        description: filter.description,
                        selected: selected,
                        mustSend: mustSend
                    });

                    if ($scope.selectedEntityDetails.report.description === 'Arriving Guests' || $scope.selectedEntityDetails.report.description === 'Departing Guests') {
                        $scope.filters.hasGeneralOptions.options.noSelectAll = true;
                    }
                } else if (displayFilterNames[filter.value]) {
                    if (filter.value === 'INCLUDE_MARKET' ||
                        filter.value === 'INCLUDE_ORIGIN' ||
                        filter.value === 'INCLUDE_SEGMENT' ||
                        filter.value === 'INCLUDE_SOURCE') {
                        processDisplayFilters(filter);
                    }
                } else if (filter.value === 'RATE') {
                    reportUtils.fillRateTypesAndRatesForScheduledReports($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if (filter.value === 'COMPLETION_STATUS') {
                    reportUtils.fillCompletionStatus($scope.filters);
                } else if (filter.value === 'DEPARTMENT_ASSIGNED') {
                    reportUtils.fillDepartments($scope.filters, $scope.selectedEntityDetails.filter_values);
                } else if (filter.value === 'COUNTRY') {
                    reportUtils.fillCountries($scope.filters, $scope.selectedEntityDetails.filter_values);
                } else if (filter.value === 'ACTIONS_BY') {
                    reportUtils.fillActionsBy($scope.filters);
                    $scope.filters.showActionables = 'BOTH';
                } else if (filter.value === 'INCLUDE_CHARGE_GROUP' || filter.value === 'INCLUDE_CHARGE_CODE' || filter.value === 'SHOW_CHARGE_CODES') {
                    reportUtils.fillChargeGroupsAndChargeCodes($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if (filter.value === 'CHOOSE_MARKET') {
                    reportUtils.fillMarkets($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if (filter.value === 'CHOOSE_SOURCE') {
                    reportUtils.fillSources($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if (filter.value === 'CHOOSE_BOOKING_ORIGIN') {
                    reportUtils.fillBookingOrigins($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if (filter.value === 'RESERVATION_STATUS' && $scope.selectedEntityDetails.report.title === reportNames['ROOM_STATUS_REPORT']) {
                    reportUtils.fillReservationStatus($scope.filters, $scope.selectedEntityDetails.filter_values);
                } else if (filter.value === 'RESERVATION_STATUS' && ($scope.selectedEntityDetails.report.title === reportNames['ADDON_FORECAST'] || $scope.selectedEntityDetails.report.title === reportNames['COMPLIMENTARY_ROOM_REPORT'] )) {
                    reportUtils.fillResStatus($scope.filters, $scope.selectedEntityDetails.filter_values);
                } else if (filter.value === 'FLOOR') {
                    reportUtils.fillFloors($scope.filters, $scope.selectedEntityDetails.filter_values);
                } else if (filter.value === 'WORK_TYPE') {
                    reportUtils.fillWorkTypes($scope.filters, $scope.selectedEntityDetails.filter_values);
                } else if (filter.value === 'FRONT_OFFICE_STATUS' && $scope.selectedEntityDetails.report.title === reportNames['ROOM_STATUS_REPORT']) {
                    reportUtils.fillFrontOfficeStatus($scope.filters, $scope.selectedEntityDetails.filter_values);
                } else if (filter.value === 'HOUSEKEEPING_STATUS') {
                    reportUtils.fillHouseKeepingStatus($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if (filter.value === 'ADDON_GROUPS') {
                    reportUtils.fillAddonGroups($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if (filter.value === 'SHOW_EMPLOYEES') {
                    $scope.filters.hasUsers = {
                        title: $scope.selectedEntityDetails.report.title === reportNames['RESERVATIONS_BY_USER'] ? 'Users' : 'Employees',
                        data: getUserList(),
                        options: {
                            selectAll: true,
                            hasSearch: true,
                            key: 'full_name',
                            altKey: 'email'
                        }
                    };

                } else if (filter.value === 'SHOW_DELETED_CHARGES' || filter.value === 'SHOW_ADJUSTMENTS') {
                    if (!$scope.filters.hasChargeTypes) {
                        $scope.filters.hasChargeTypes = {
                            data: [],
                            options: {
                                selectAll: true,
                                hasSearch: false,
                                key: 'description'
                            }
                        };
                    }
                    $scope.filters.hasChargeTypes['data'].push({
                        paramKey: filter.value.toLowerCase(),
                        description: filter.description,
                        selected: true
                    });
                } else if (showFilterNames.indexOf(filter.value) > -1 &&
                    $scope.selectedEntityDetails.report.title !== reportNames['IN_HOUSE_GUEST']) {
                    pushShowData(filter);
                } else if (filter.value === 'GROUP_COMPANY_TA_CARD') {
                    $scope.filters['hasIncludeCompanyTaGroup'] = filter;
                } else if (filter.value === 'RATE_CODE') {
                    reportUtils.fillRateCodes($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if ( filter.value === 'ROOM_TYPE') {
                    reportUtils.fillRoomTypes($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if ( filter.value === 'CHOOSE_SEGMENT') {
                    reportUtils.fillSegments($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if ( filter.value === 'INCLUDE_GUARANTEE_TYPE') {
                    reportUtils.fillGuaranteeTypes($scope.filters, $scope.selectedEntityDetails.filter_values, $scope.selectedEntityDetails.report.title);
                } else if (filter.value === 'CREATE_DATE_RANGE') {
                    $scope.creationDateTimePeriods = reportsSrv.getScheduleReportTimePeriods($scope.selectedEntityDetails.report.title + ':' + filter.value);
                    $scope.creationDateTimePeriods = populateTimePeriodsData($scope.creationDateTimePeriods);
                } else if (filter.value === 'ARRIVAL_DATE_RANGE' || filter.value === 'DATE_RANGE') {
                    $scope.arrivalDateTimePeriods = reportsSrv.getScheduleReportTimePeriods($scope.selectedEntityDetails.report.title + ':' + filter.value);
                    $scope.arrivalDateTimePeriods = populateTimePeriodsData($scope.arrivalDateTimePeriods);
                } else if (filter.value === 'EMPLOYEE') {
                    reportUtils.fillEmployeeList($scope.filters, $scope.selectedEntityDetails.filter_values);
                } else if (filter.value === 'ADJUSTMENT_DATE_RANGE') {
                    $scope.adjustmentDateTimePeriods = reportsSrv.getScheduleReportTimePeriods($scope.selectedEntityDetails.report.title + ':' + filter.value);
                    $scope.adjustmentDateTimePeriods = populateTimePeriodsData($scope.adjustmentDateTimePeriods);
                } else if (filter.value === 'INCLUDE_DAY_USE') {
                    $scope.filters.hasDayUseFilter = true;
                    $scope.filters.include_day_use = false;
                } else if (filter.value === 'AGING_BALANCE') {
                    reportUtils.fillAgingBalances($scope.filters, $scope.selectedEntityDetails.filter_values);
                } else if (filter.value === 'ACCOUNT_NAME') {
                    reportUtils.fillAccountNames($scope.filters, $scope.selectedEntityDetails.filter_values); 
                } else if (filter.value === 'CANCELATION_DATE_RANGE') {
                    $scope.cancellationDateTimePeriods = reportsSrv.getScheduleReportTimePeriods($scope.selectedEntityDetails.report.title + ':' + filter.value);
                    $scope.cancellationDateTimePeriods = populateTimePeriodsData($scope.cancellationDateTimePeriods);
                }
            });

            var reportTimePeriods = reportsSrv.getScheduleReportTimePeriods($scope.selectedEntityDetails.report.title);

            $scope.scheduleTimePeriods = populateTimePeriodsData(reportTimePeriods);

            if ($scope.selectedEntityDetails.group_fields && $scope.selectedEntityDetails.group_fields.length) {
                $scope.selectedEntityDetails.group_fields = _.reject($scope.selectedEntityDetails.group_fields, { value: 'BLANK' });
            }

            processSortFields();
            runDigestCycle();
        };

        /**
         * Apply selected charge types
         * @param {String} key the key in the saved filter 
         * @return {void}
         */
        var applySelectedChargeTypes = (key) => {
            var selectedChargeType = _.find($scope.filters.hasChargeTypes['data'], { paramKey: key });

            selectedChargeType.selected = true;

            $scope.filters.hasChargeTypes['options']['selectAll'] = ($scope.filters.hasChargeTypes['data'].filter(item => item.selected).length === 2);
        };


        var applySavedFilters = function(isNewSchedule) {
            if (!isNewSchedule) {
                $scope.filters.hasDisplay.options.selectAll = false;
                _.map($scope.filters.hasDisplay.data, function(displayOption) {
                    displayOption.selected = false;
                });

                $scope.filters.hasShow.options.selectAll = false;
                _.map($scope.filters.hasShow.data, function(showOption) {
                    showOption.selected = false;
                });
            }

            if (!isNewSchedule && $scope.filters.hasChargeTypes) {
                $scope.filters.hasChargeTypes['data'] = $scope.filters.hasChargeTypes['data'].map(chargeType => {
                    chargeType.selected = false;
                    return chargeType;
                });
            }

            // Reset all initial selections, when the filters are set explicitly be the user
            if (!_.isEmpty($scope.selectedEntityDetails.filter_values) && $scope.filters.hasGeneralOptions.data.length > 0) {
                $scope.filters.hasGeneralOptions.data = $scope.filters.hasGeneralOptions.data.map((option) => {
                    option.selected = false;

                    return option;
                });
            }

            _.each($scope.selectedEntityDetails.filter_values, function(value, key) {
                var optionFilter, upperCaseKey;

                upperCaseKey = key.toUpperCase();
                if (matchGeneralOptions[upperCaseKey] && !!value) {
                    optionFilter = _.find($scope.filters.hasGeneralOptions.data, { paramKey: key });
                    if (angular.isDefined(optionFilter)) {
                        optionFilter.selected = true;
                    }
                }

                if (matchSortFields[value]) {
                    $scope.scheduleParams.sort_field = value;
                }

                if (displayFilterNames[upperCaseKey] && !!value) {
                    optionFilter = _.find($scope.filters.hasDisplay.data, { paramKey: key });
                    if (angular.isDefined(optionFilter)) {
                        optionFilter.selected = true;
                    }
                } else if (key === reportParams['SHOW_ACTIONABLES']) {
                    if (value.length === 2) {
                        $scope.filters.showActionables = 'BOTH';
                    } else {
                        $scope.filters.showActionables = value[0];
                    }
                } else if (key === reportParams['COMPLETION_STATUS']) {
                    $scope.filters['hasCompletionStatus']['data'] = $scope.filters['hasCompletionStatus']['data'].map(status => {
                        status.selected = false;

                        if (value.indexOf(status.id) > -1) {
                            status.selected = true;
                        }
                        return status;
                    });
                    $scope.filters['hasCompletionStatus']['options']['selectAll'] = $scope.filters['hasCompletionStatus']['data'].length === value.length;

                } else if (key === reportParams['USER_IDS'] && value.length > 0) {
                    var selectedEmps = [],
                        employeesCopy = getUserList();

                    employeesCopy.forEach(emp => {
                        emp.selected = false;

                        if (value.indexOf(emp.id) > -1) {
                            emp.selected = true;
                        }

                        selectedEmps.push(emp);
                    });
                    $scope.filters.hasUsers['data'] = selectedEmps;
                    $scope.filters.hasUsers['options']['selectAll'] = selectedEmps.length === value.length;

                } else if (showFilterNames.indexOf(upperCaseKey) > -1) {
                    var currentFilter = _.find($scope.filters.hasShow.data, { paramKey: key });

                    if (currentFilter) {
                        currentFilter.selected = true;
                    }

                    $scope.filters.hasShow['options']['selectAll'] = ($scope.filters.hasShow['data'].filter(item => item.selected).length === $scope.filters.hasShow['data'].length);

                } else if (upperCaseKey === 'SHOW_ADJUSTMENTS' || upperCaseKey === 'SHOW_DELETED_CHARGES') {
                    applySelectedChargeTypes(key);
                } else if (key === reportParams['GROUP_COMPANY_TA_CARD']) {
                    $scope.selectedEntityDetails.uiChosenIncludeCompanyTaGroup = value;
                    $scope.selectedEntityDetails.chosenIncludeCompanyTaGroupType = $scope.selectedEntityDetails.filter_values[reportParams['ENTITY_TYPE']];
                    $scope.selectedEntityDetails.uiChosenIncludeCompanyTaGroup = $scope.selectedEntityDetails.filter_values[reportParams['ENTITY_NAME']];
                } else if (groupByFields[key.toUpperCase()]) {
                    $scope.scheduleParams.groupBy = groupByFields[key.toUpperCase()];
                } else if (upperCaseKey === 'CREATE_DATE_RANGE' || upperCaseKey === 'ARRIVAL_DATE_RANGE' || upperCaseKey === 'ADJUSTMENT_DATE_RANGE' || upperCaseKey === 'DATE_RANGE' || upperCaseKey === 'CANCELATION_DATE_RANGE') {
                    $scope.scheduleParams[key] = value;
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

            $scope.creationDateTimePeriods = [];
            $scope.arrivalDateTimePeriods = [];
            $scope.adjustmentDateTimePeriods = [];
            $scope.cancellationDateTimePeriods = [];
            $scope.scheduleTimePeriods = [];
            
            $scope.scheduleParams = {};

            $scope.isYearlyTaxReport = ($scope.selectedEntityDetails.report.title === reportNames['YEARLY_TAX']);
            $scope.isForecastReport = ($scope.selectedEntityDetails.report.title === reportNames['FORECAST_BY_DATE']);
            $scope.isReservationsByUserReport = ($scope.selectedEntityDetails.report.title === reportNames['RESERVATIONS_BY_USER']);
            $scope.isRoomStatusReport = $scope.selectedEntityDetails.report.title === reportNames['ROOM_STATUS_REPORT'];
            $scope.isRateAdjustmentReport = $scope.selectedEntityDetails.report.title === reportNames['RATE_ADJUSTMENTS_REPORT'];
            $scope.isOccupancyRevenueSummaryReport = $scope.selectedEntityDetails.report.title === reportNames['OCCUPANCY_REVENUE_SUMMARY'];
            $scope.isCancellationNoShowReport = $scope.selectedEntityDetails.report.title === reportNames['CANCELLATION_NO_SHOW'];
            $scope.scheduleParams.format_id = null;

            if (angular.isDefined($scope.selectedEntityDetails.schedule_formats)) {
                $scope.schedule_formats = $scope.selectedEntityDetails.schedule_formats;
                $scope.scheduleParams.format_id = $scope.selectedEntityDetails.format.id;
            } else {
                if ($scope.isYearlyTaxReport || $scope.selectedEntityDetails.report.title === reportNames['BUSINESS_ON_THE_BOOKS']) {
                    $scope.scheduleParams.format_id = _.find($scope.scheduleFormat, { value: 'CSV' }).id; 
                } else if ($scope.selectedEntityDetails.report.title === reportNames['ARRIVAL'] || 
                $scope.selectedEntityDetails.report.title === reportNames['DEPARTURE'] || 
                $scope.selectedEntityDetails.report.title === reportNames['IN_HOUSE_GUEST']) {
                    var pdfFormat = _.find($scope.scheduleFormat, { value: 'PDF' });

                    if (!pdfFormat) {
                        pdfFormat = _.find(originalScheduleFormats, { value: 'PDF' });
                    }

                    if (pdfFormat) {
                        $scope.scheduleParams.format_id = pdfFormat.id;
                    }
                }
                
            }
            if ($scope.isYearlyTaxReport) {
                $scope.scheduleParams.year = moment().format('YYYY');
            }
            hasAccOrGuest = _.find(report.filters, function(filter) {
                return filter.value === 'ACCOUNT' || filter.value === 'GUEST';
            });

            if (angular.isDefined(hasAccOrGuest)) {
                $scope.scheduleParams.time_period_id = _.find($scope.originalScheduleTimePeriods, { value: "ALL" }).id;
                $scope.isGuestBalanceReport = true;
            } else if ($scope.isYearlyTaxReport || $scope.isCreditCheckReport || $scope.isRoomStatusReport) {
                $scope.scheduleParams.time_period_id = _.find($scope.originalScheduleTimePeriods, { value: "ALL" }).id;
            } else if (angular.isDefined($scope.selectedEntityDetails.time_period_id)) {
                $scope.scheduleParams.time_period_id = $scope.selectedEntityDetails.time_period_id;
            } else {
                $scope.scheduleParams.time_period_id = undefined;
            }

            if (angular.isDefined($scope.selectedEntityDetails.time)) {
                $scope.scheduleParams.time = $scope.selectedEntityDetails.time;
            } else {
                $scope.scheduleParams.time = undefined;
            }

            if (angular.isDefined($scope.selectedEntityDetails.frequency_id)) {
                $scope.scheduleParams.frequency_id = $scope.selectedEntityDetails.frequency_id;
            } else {
                $scope.scheduleParams.frequency_id = undefined;
            }

            if (angular.isDefined($scope.selectedEntityDetails.repeats_every)) {
                $scope.scheduleParams.repeats_every = $scope.selectedEntityDetails.repeats_every;
            } else {
                $scope.scheduleParams.repeats_every = undefined;
            }

            if ($scope.selectedEntityDetails.ends_on_date !== null && $scope.selectedEntityDetails.ends_on_after === null) {
                $scope.scheduleParams.scheduleEndsOn = 'DATE';
            } else if ($scope.selectedEntityDetails.ends_on_date === null && $scope.selectedEntityDetails.ends_on_after !== null) {
                $scope.scheduleParams.ends_on_after = $scope.selectedEntityDetails.ends_on_after;
                $scope.scheduleParams.scheduleEndsOn = 'NUMBER';
            } else {
                $scope.scheduleParams.scheduleEndsOn = 'NEVER';
            }

            $scope.startsOnOptions = angular.extend({
                minDate: tzIndependentDate($rootScope.businessDate),
                onSelect: function(value) {
                    $scope.endsOnOptions.minDate = value;
                    if ($scope.scheduleParams.ends_on_date < $scope.scheduleParams.starts_on)
                    {
                        $scope.scheduleParams.ends_on_date = $scope.scheduleParams.starts_on;
                    }
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
            
            $scope.scheduleParams.delivery_id = $scope.selectedEntityDetails.delivery_type ? $scope.selectedEntityDetails.delivery_type.value : null;

            if ($scope.scheduleParams.delivery_id === 'CLOUD_DRIVE') {
                $scope.scheduleParams.delivery_id = $scope.selectedEntityDetails.cloud_drive_type;
            }

            if ($scope.scheduleParams.delivery_id === 'EMAIL') {
                $scope.emailList = $scope.selectedEntityDetails.emails.split(', ');
            } else if ($scope.scheduleParams.delivery_id === 'SFTP') {
                $scope.scheduleParams.selectedFtpRecipient = $scope.selectedEntityDetails.sftp_server_id;
            } else if ($scope.scheduleParams.delivery_id === 'GOOGLE DRIVE' || $scope.scheduleParams.delivery_id === 'DROPBOX') {
                $scope.scheduleParams.selectedCloudAccount = $scope.selectedEntityDetails.cloud_drive_id;
            }

            if ($scope.selectedEntityDetails.filter_values && $scope.isYearlyTaxReport) {
                $scope.scheduleParams.year = $scope.selectedEntityDetails.filter_values.year;
                $scope.scheduleParams.with_vat_number = $scope.selectedEntityDetails.filter_values.with_vat_number;
                $scope.scheduleParams.without_vat_number = $scope.selectedEntityDetails.filter_values.without_vat_number;
            }

            if ($scope.selectedEntityDetails.filter_values && $scope.isOccupancyRevenueSummaryReport) {
                $scope.scheduleParams.include_day_use = $scope.selectedEntityDetails.filter_values.include_day_use;
            }

            $scope.timeSlots = reportUtils.createTimeSlots(TIME_SLOT);

            $scope.scheduleParams.includeTitleHeader = $scope.selectedEntityDetails.include_title_header;
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
                $scope.originalScheduleFrequency = payload.scheduleFrequency;
                runDuringEodScheduleFrequencyId = (_.find($scope.originalScheduleFrequency, { value: 'RUN_DURING_EOD'})).id;
                $scope.scheduleFormat = payload.scheduleFormat;
                originalScheduleFormats = dclone(payload.scheduleFormat);
                $scope.$parent.$parent.schedulesList = [];
                $scope.$parent.$parent.schedulableReports = [];
                $scope.CSV_FORMAT_ID = (_.find($scope.scheduleFormat, { value: 'CSV'})).id;

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

                    if (angular.isDefined(found)) {
                        applyIconClass.init(found);
                        $scope.$parent.$parent.schedulableReports.push({
                            id: found.id,
                            filters: found.filters,
                            sort_fields: found.sort_fields,
                            group_fields: found.group_fields,
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

                $scope.originalScheduleFreqType = _.map($scope.originalScheduleFrequency, function(freq) {
                    return {
                        id: freq.id,
                        value: getValue(freq.value),
                        originalValue: freq.value
                    };
                });

                _.each($scope.$parent.$parent.schedulesList, function(item) {
                    if (angular.isDefined(reportIconCls[item.report.description])) {
                        item.reportIconCls = reportIconCls[item.report.description];
                    }
                });

                $scope.scheduleDeliveryTypes = payload.scheduleDeliveryTypes;
                $scope.ftpServerList = payload.ftpServerList;
                $scope.dropBoxAccountList = payload.dropBoxAccounts;
                $scope.googleDriveAccountList = payload.googleDriveAccounts;

                $scope.refreshReportSchedulesScroll(reset);

                $scope.$emit('hideLoader');
            };

            var failed = function(errors) {
                $scope.errors = errors;
                // refreshScrolls();
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(reportsSrv.reportSchedulesPayload, {}, success, failed);
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

                if (!alreadyPresent) {
                    $scope.emailList.push(ui.item.value);
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
                $scope.touchedReport = $scope.selectedEntityDetails;
                $scope.isGuestBalanceReport = false;
                $scope.isYearlyTaxReport = false;
                $scope.isCreditCheckReport = false;
                $scope.isForecastReport = false;
                $scope.isOccupancyRevenueSummaryReport = false;

                if ($scope.selectedEntityDetails.report.title === reportNames['CREDIT_CHECK_REPORT']) {
                    $scope.isCreditCheckReport = true;
                }

                if (!!$scope.selectedSchedule && $scope.selectedSchedule.active) {
                    $scope.selectedSchedule.active = false;
                }
                $scope.selectedSchedule = $scope.$parent.$parent.schedulesList[index];
                $scope.selectedSchedule.active = true;
                /**/
                $scope.selectedReport.active = false;

                $scope.addingStage = STAGES.SHOW_DISTRIBUTION;
                $scope.updateViewCol($scope.viewColsActions.FOUR);

                processScheduleDetails(item);
                filterScheduleFrequency($scope.selectedEntityDetails);
                setupFilters();
                applySavedFilters(false);

                $scope.refreshAllOtherColumnScrolls();

                $scope.$emit('hideLoader');
            };

            var failed = function(errors) {
                $scope.errors = errors;
                $scope.$emit('hideLoader');
            };

            var params = {
                id: item.id
            };

            $scope.invokeApi(reportsSrv.fetchOneSchedule, params, success, failed);
        };

        $scope.check = function() {
            ngDialog.open({
                template: '/assets/partials/reports/scheduleReport/rvConfirmDiscard.html',
                scope: $scope
            });
        };

        /**
         * Set the required frequency optios for each of the reports
         * @param {Object} item report object
         * @return { void }
         */
        var filterScheduleFrequency = function(item) {
            var dailyOnly = _.find($scope.originalScheduleFrequency, { value: 'DAILY' });

            var dailyTypeOnly = _.find($scope.originalScheduleFreqType, { originalValue: 'DAILY' }),
                weeklyTypeOnly = _.find($scope.originalScheduleFreqType, { originalValue: 'WEEKLY' }),
                monthlyTypeOnly = _.find($scope.originalScheduleFreqType, { originalValue: 'MONTHLY' }),
                hourlyTypeOnly = _.find($scope.originalScheduleFreqType, { originalValue: 'HOURLY' });                

            var weeklyOnly = _.find($scope.originalScheduleFrequency, { value: 'WEEKLY' }),
                monthlyOnly = _.find($scope.originalScheduleFrequency, { value: 'MONTHLY' }),
                hourlyOnly = _.find($scope.originalScheduleFrequency, { value: 'HOURLY' }),
                runDuringEod = _.find($scope.originalScheduleFrequency, { value: 'RUN_DURING_EOD'});

            $scope.scheduleFrequency = [];
            $scope.scheduleFreqType = [];

            var forDaily = {
                'Arrival': true,
                'Departure': true,
                'In-House Guests': true,
                'Comparison': true,
                'Guest Balance Report': true,
                'Yearly Tax Report': true,
                'Daily Production': true,
                'Daily Production by Demographics': true,
                'Daily Production by Rate': true,
                'Business on the Books': true,
                'Daily Transactions': true,
                'Action Manager': true,
                'Financial Transactions - Adjustment Report': true,
                'Credit Check Report': true,
                'Forecast': true,
                'Reservations By User': true,
                'Room Status Report': true,
                'Rate Adjustment Report': true,
                'Occupancy & Revenue Summary': true,
                'Rooms OOO/OOS': true,
                'Deposit Balance Summary': true,
                'Add-On Forecast': true,
                'Forecast Guests & Groups': true,
                'Market Segment Statistics Report': true,
                'A/R Aging': true,
                'Complimentary Room Report': true,
                'Cancellation & No Show': true
            };

            var forWeekly = {
                'Arrival': true,
                'Departure': true,
                'In-House Guests': true,
                'Comparison': true,
                'Guest Balance Report': true,
                'Yearly Tax Report': true,
                'Business on the Books': true,
                'Daily Transactions': true,
                'Action Manager': true,
                'Financial Transactions - Adjustment Report': true,
                'Credit Check Report': true,
                'Forecast': true,
                'Reservations By User': true,
                'Room Status Report': true,
                'Rate Adjustment Report': true,
                'Occupancy & Revenue Summary': true,
                'Rooms OOO/OOS': true,
                'Deposit Balance Summary': true,
                'Add-On Forecast': true,
                'Forecast Guests & Groups': true,
                'A/R Aging': true,
                'Complimentary Room Report': true,
                'Cancellation & No Show': true
            };
            var forMonthly = {
                'Arrival': true,
                'Departure': true,
                'In-House Guests': true,
                'Comparison': true,
                'Guest Balance Report': true,
                'Yearly Tax Report': true,
                'Business on the Books': true,
                'Daily Transactions': true,
                'Action Manager': true,
                'Financial Transactions - Adjustment Report': true,
                'Credit Check Report': true,
                'Forecast': true,
                'Reservations By User': true,
                'Room Status Report': true,
                'Rate Adjustment Report': true,
                'Occupancy & Revenue Summary': true,
                'Rooms OOO/OOS': true,
                'Deposit Balance Summary': true,
                'Add-On Forecast': true,
                'Forecast Guests & Groups': true,
                'A/R Aging': true,
                'Complimentary Room Report': true,
                'Cancellation & No Show': true
            };

            var forHourly = {
                'Arrival': true,
                'Departure': true,
                'In-House Guests': true,
                'Comparison': true,
                'Guest Balance Report': true,
                'Yearly Tax Report': true,
                'Business on the Books': true,
                'Credit Check Report': true,
                'Forecast': true,
                'Reservations By User': true,
                'Room Status Report': true,
                'Rate Adjustment Report': true,
                'Occupancy & Revenue Summary': true,
                'Rooms OOO/OOS': true,
                'Deposit Balance Summary': true,
                'Add-On Forecast': true,
                'Forecast Guests & Groups': true,
                'A/R Aging': true,
                'Complimentary Room Report': true,
                'Cancellation & No Show': true
            };

            if (forHourly[item.report.title]) {
                $scope.scheduleFrequency.push(hourlyOnly);
                $scope.scheduleFreqType.push(hourlyTypeOnly);
            }

            if (forDaily[item.report.title]) {
                $scope.scheduleFrequency.push(dailyOnly);
                $scope.scheduleFreqType.push(dailyTypeOnly);
            }

            if (forWeekly[item.report.title]) {
                $scope.scheduleFrequency.push(weeklyOnly);
                $scope.scheduleFreqType.push(weeklyTypeOnly);
            }

            if (forMonthly[item.report.title]) {
                $scope.scheduleFrequency.push(monthlyOnly);
                $scope.scheduleFreqType.push(monthlyTypeOnly);
            }

            if ($rootScope.isStandAlone) {
                $scope.scheduleFrequency.push(runDuringEod);
            }

        };

        $scope.pickReport = function(item, index) {
            $scope.selectedEntityDetails = $scope.$parent.$parent.schedulableReports[index];
            $scope.touchedReport = $scope.selectedEntityDetails;
            $scope.isGuestBalanceReport = false;
            $scope.isCreditCheckReport = false;
            $scope.isYearlyTaxReport = false;
            $scope.isForecastReport = false;
            $scope.isOccupancyRevenueSummaryReport = false;

            if ($scope.selectedEntityDetails.report.title === reportNames['CREDIT_CHECK_REPORT']) {
                $scope.isCreditCheckReport = true;
            } 
            
            
            if (!!$scope.selectedReport && $scope.selectedReport.active) {
                $scope.selectedReport.active = false;
            }
            $scope.selectedReport = $scope.$parent.$parent.schedulableReports[index];
            $scope.selectedReport.active = true;
            /**/
            $scope.selectedSchedule.active = false;

            $scope.addingStage = STAGES.SHOW_PARAMETERS;
            $scope.updateViewCol($scope.viewColsActions.TWO);

            processScheduleDetails(item);
            filterScheduleFrequency($scope.selectedEntityDetails);
            setupFilters();
            applySavedFilters(true);

            $scope.refreshAllOtherColumnScrolls();
        };

        $scope.getRepeatPer = function() {
            var found = _.find($scope.scheduleFreqType, { id: $scope.scheduleParams.frequency_id });

            return found ? found.value : 'Per';
        };

        $scope.checkCanCreateSchedule = function() {
            if (validateSchedule()) {
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
            if (validateSchedule()) {
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
                $scope.$emit('hideLoader');
                if (!!$scope.selectedReport && $scope.selectedReport.active) {
                    $scope.selectedReport.active = false;
                }
                $scope.updateViewCol($scope.viewColsActions.ONE);
                $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

                fetch_reportSchedules_frequency_timePeriod_scheduableReports();
            };

            var failed = function(errors) {
                $scope.errorMessage = errors;
                $scope.$emit('hideLoader');
            };

            $scope.closeDialog();
            $scope.invokeApi(reportsSrv.deleteSchedule, { id: $scope.selectedEntityDetails.id }, success, failed);
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

            $scope.selectedSchedule.active = false;

            $scope.updateView($scope.reportViewActions.SHOW_SCHEDULE_A_REPORT);
            $scope.updateViewCol($scope.viewColsActions.ONE);

            $scope.refreshReportSchedulesScroll(reset);
            $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

            $scope.$emit('UPDATE_TITLE_AND_HEADING');
        };

        $scope.checkCanCancel = function() {
            if (!!$scope.selectedReport && $scope.selectedReport.active) {
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

            if ($scope.addingStage === STAGES.SHOW_PARAMETERS) {
                $scope.addingStage = STAGES.SHOW_DETAILS;
                $scope.updateViewCol($scope.viewColsActions.THREE, noReset);
                $scope.refreshThirdColumnScroll(verReset);
            } else if ($scope.addingStage === STAGES.SHOW_DETAILS) {
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
        $scope.shouldShowFileFormat = function(selectedEntity) {
            if (selectedEntity.report && selectedEntity.report.title === reportNames['COMPARISION_BY_DATE']) {
                $scope.scheduleFormat = _.filter(originalScheduleFormats, function(object) { return object.value !== "XML"; });
            } else if (selectedEntity.report && (selectedEntity.report.title === reportNames['DAILY_PRODUCTION_ROOM_TYPE'] ||
                    selectedEntity.report.title === reportNames['DAILY_PRODUCTION_DEMO'] ||
                    selectedEntity.report.title === reportNames['DAILY_PRODUCTION_RATE'] ||
                    selectedEntity.report.title === reportNames['DAILY_TRANSACTIONS'] ||
                    selectedEntity.report.title === reportNames['FINANCIAL_TRANSACTIONS_ADJUSTMENT_REPORT'] ||
                    selectedEntity.report.title === reportNames['MARKET_SEGMENT_STAT_REPORT'] ||
                    selectedEntity.report.title === reportNames['RESERVATIONS_BY_USER'] ||
                    selectedEntity.report.title === reportNames['ROOM_STATUS_REPORT'] ||
                    selectedEntity.report.title === reportNames['ROOMS_OOO_OOS'] || 
                    selectedEntity.report.title === reportNames['OCCUPANCY_REVENUE_SUMMARY'] ||
                    selectedEntity.report.title === reportNames['ADDON_FORECAST'] || 
                    selectedEntity.report.title === reportNames['MARKET_SEGMENT_STAT_REPORT'] || 
                    selectedEntity.report.title === reportNames['COMPLIMENTARY_ROOM_REPORT'])) {
                $scope.scheduleFormat = _.filter(originalScheduleFormats, function(object) {
                    return object.value === 'CSV';
                });
            } else if (selectedEntity.report && (
                selectedEntity.report.title === reportNames['GUEST_BALANCE_REPORT'] ||
                selectedEntity.report.title === reportNames['A/R_AGING'] ||
                selectedEntity.report.title === reportNames['ACTIONS_MANAGER'] ||
                selectedEntity.report.title === reportNames['CANCELLATION_NO_SHOW'] ||
                selectedEntity.report.title === reportNames['DEPOSIT_SUMMARY']
                selectedEntity.report.title === reportNames['RATE_ADJUSTMENTS_REPORT'] ||
                selectedEntity.report.title === reportNames['FORECAST_GUEST_GROUPS'] ||
                selectedEntity.report.title === reportNames['CREDIT_CHECK_REPORT']
            )) {
                $scope.scheduleFormat = _.filter(originalScheduleFormats, function(object) {
                    return object.value === 'CSV' || object.value === 'PDF';
                });
            }

            return selectedEntity.report && (selectedEntity.report.title === reportNames['COMPARISION_BY_DATE'] ||
                selectedEntity.report.title === reportNames['DAILY_PRODUCTION_ROOM_TYPE'] ||
                selectedEntity.report.title === reportNames['DAILY_PRODUCTION_DEMO'] ||
                selectedEntity.report.title === reportNames['DAILY_PRODUCTION_RATE'] ||
                selectedEntity.report.title === reportNames['DAILY_TRANSACTIONS'] ||
                selectedEntity.report.title === reportNames['GUEST_BALANCE_REPORT'] ||
                selectedEntity.report.title === reportNames['FINANCIAL_TRANSACTIONS_ADJUSTMENT_REPORT'] ||
                selectedEntity.report.title === reportNames['ACTIONS_MANAGER'] ||
                selectedEntity.report.title === reportNames['CREDIT_CHECK_REPORT'] ||
                selectedEntity.report.title === reportNames['FORECAST_BY_DATE'] || 
                selectedEntity.report.title === reportNames['RESERVATIONS_BY_USER'] ||
                selectedEntity.report.title === reportNames['ROOM_STATUS_REPORT'] || 
                selectedEntity.report.title === reportNames['RATE_ADJUSTMENTS_REPORT'] ||
                selectedEntity.report.title === reportNames['ROOMS_OOO_OOS'] || 
                selectedEntity.report.title === reportNames['DEPOSIT_SUMMARY'] ||
                selectedEntity.report.title === reportNames['OCCUPANCY_REVENUE_SUMMARY'] ||
                selectedEntity.report.title === reportNames['ADDON_FORECAST'] || 
                selectedEntity.report.title === reportNames['FORECAST_GUEST_GROUPS'] || 
                selectedEntity.report.title === reportNames['MARKET_SEGMENT_STAT_REPORT'] || 
                selectedEntity.report.title === reportNames['A/R_AGING'] || 
                selectedEntity.report.title === reportNames['COMPLIMENTARY_ROOM_REPORT'] || 
                selectedEntity.report.title === reportNames['CANCELLATION_NO_SHOW']);

        };

        // Listener for creating new report schedule
        let createNewReportScheduleListener = $scope.$on("CREATE_NEW_REPORT_SCHEDULE", () => {
            $scope.scheduleReport();
        });

        $scope.$on('$destroy', createNewReportScheduleListener);

        $scope.addListener('RESET_CURRENT_STAGE', () => {
            $scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;
        });

        // Change handler for delivery options
        $scope.onDeliveryOptionChange = () => {
            // We are just clearing the cloud drive id only because the given id belongs to 
            // a single cloud drive account and if not cleared it will shows empty <option>
            // when the cloud account type is changed from the delivery options
            $scope.scheduleParams.selectedCloudAccount = null;
        };

        $scope.checkDeliveryType = function(checkFor) {
            return checkFor === $scope.scheduleParams.delivery_id;
        };

        /**
         * Disable repeats every section
         */
        $scope.shallDisableRepeatsEvery = () => {
            return $scope.originalScheduleFrequency && ($scope.scheduleParams.frequency_id === (_.find($scope.originalScheduleFrequency, {value: 'RUN_DURING_EOD'})).id);
        };

        /**
         * Startup
         * @return {Object} undefined
         */
        function init() {
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
            $scope.scheduleYearList = Array.from({ length: 10 },
                function(v, i) {
                    return {
                        "value": moment().add(-1 * i, 'y')
                            .format('YYYY')
                    };
                });

            $scope.scheduleFreqType = [];
            $scope.emailList = [];

            $scope.scheduleParams = {};
            $scope.creationDateTimePeriods = [];
            $scope.arrivalDateTimePeriods = [];
            $scope.adjustmentDateTimePeriods = [];
            $scope.cancellationDateTimePeriods = [];
            setupScrolls();

            fetch_reportSchedules_frequency_timePeriod_scheduableReports();
        }

        init();
    }
]);
