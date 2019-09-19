angular.module('sntRover').controller('RVCustomExportCtrl', [
    '$scope',
    'RVCustomExportSrv',
    '$timeout',
    '$rootScope',
    'RVreportsSrv',
    'RVCustomExportsUtilFac',
    'RVReportUtilsFac',
    '$filter',
    function($scope, 
        RVCustomExportSrv,
        $timeout,
        $rootScope,
        reportsSrv,
        RVCustomExportsUtilFac,
        reportUtils,
        $filter) {

        BaseCtrl.call(this, $scope);

        const STAGES = {
            SHOW_CUSTOM_EXPORT_LIST: 'SHOW_CUSTOM_EXPORT_LIST',
            SHOW_PARAMETERS: 'SHOW_PARAMETERS'
        };

        const REPORT_COLS_SCROLLER = 'report-cols-scroller';
        const REPORT_SELECTED_COLS_SCROLLER = 'report-selected-cols-scroller';
        const EXPORT_LIST_SCROLLER = 'exports-list-scroller';
        const SCHEDULE_DETAILS_SCROLLER = 'schedule-details-scroller';
        const DELIVERY_OPTIONS_SCROLLER = 'delivery-options-scroller';
        const SCROLL_REFRESH_DELAY = 100;

        // Initialize the scrollers
        var initializeScrollers = () => {
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            $scope.setScroller(REPORT_COLS_SCROLLER, scrollerOptions);
            $scope.setScroller(REPORT_SELECTED_COLS_SCROLLER, scrollerOptions);
            $scope.setScroller(EXPORT_LIST_SCROLLER, scrollerOptions);
            $scope.setScroller(SCHEDULE_DETAILS_SCROLLER, scrollerOptions);
            $scope.setScroller(DELIVERY_OPTIONS_SCROLLER, scrollerOptions);
        };

        // Refresh the given scroller
        var refreshScroll = function(name, reset) {

            $scope.refreshScroller(name);

            if ( !! reset && $scope.myScroll.hasOwnProperty(name) ) {
                $scope.myScroll[name].scrollTo(0, 0, SCROLL_REFRESH_DELAY);
            }
        };

        // Should show the export list
        $scope.shouldShowExportListOnly = () => {
            return $scope.viewState.currentStage === STAGES.SHOW_CUSTOM_EXPORT_LIST;
        };

        // Create new export
        var configureNewExport = () => {
            fetchDataSpaces();
            $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
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

            var startsOn = $scope.selectedEntityDetails.starts_on || $rootScope.businessDate,
                endsOnDate = $scope.selectedEntityDetails.ends_on_date || $rootScope.businessDate,
                exportDate = $scope.selectedEntityDetails.export_date || $rootScope.businessDate;


            $scope.scheduleParams = {};

            if ( angular.isDefined($scope.selectedEntityDetails.export_date) ) {
                $scope.scheduleParams.export_date = $scope.selectedEntityDetails.export_date;
            } else {
                $scope.scheduleParams.export_date = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days');

                var todayDate = moment().startOf('day'),
                    daysDiff = moment.duration(todayDate.diff($scope.scheduleParams.export_date)).asDays();
                
                if (daysDiff < 7) {
                    $scope.scheduleParams.export_date = $scope.scheduleParams.export_date.format("L");
                } else {
                    $scope.scheduleParams.export_date = $scope.scheduleParams.export_date.calendar();
                }
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
            $scope.scheduleParams.export_date = reportUtils.processDate(exportDate).today;

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

            $scope.scheduleParams.delivery_id = $scope.selectedEntityDetails.delivery_type ? $scope.selectedEntityDetails.delivery_type.value : '';
            
            if ($scope.scheduleParams.delivery_id === 'CLOUD_DRIVE') {
                $scope.scheduleParams.delivery_id = $scope.selectedEntityDetails.cloud_drive_type;
            }

            if ( $scope.scheduleParams.delivery_id === 'EMAIL' ) {
                $scope.emailList = $scope.selectedEntityDetails.emails.split(', ');
            } else if ( $scope.scheduleParams.delivery_id === 'SFTP' ) {
                $scope.scheduleParams.selectedFtpRecipient = $scope.selectedEntityDetails.sftp_server_id;
            } else if ( $scope.scheduleParams.delivery_id === 'GOOGLE DRIVE' || $scope.scheduleParams.delivery_id === 'DROPBOX' ) {
                $scope.scheduleParams.selectedCloudAccount = $scope.selectedEntityDetails.cloud_drive_id;
            } 

            $scope.timeSlots = reportUtils.createTimeSlots(TIME_SLOTS);
        };

        /**
         * Fetch available data spaces for custom exports
         */
        var fetchDataSpaces = () => {
            var onDataSpaceFetchSuccess = (data) => {
                    
                    _.each(data, function (dataSpace) {
                        $scope.customExportsData.customExportDataSpaces.push({
                            id: dataSpace.id,
                            report: {
                                id: dataSpace.id,
                                title: dataSpace.title,
                                description: dataSpace.description
                            },
                            active: false,
                            filteredOut: false,
                            filters: dataSpace.filters
                        });
                    });                                       
                },
                onDataSpaceFetchFailure = () => {
                    $scope.customExportsData.customExportDataSpaces = [];
                };

            $scope.callAPI(RVCustomExportSrv.getAvailableDataSpaces, {
                onSuccess: onDataSpaceFetchSuccess,
                onFailure: onDataSpaceFetchFailure
            });
        };

        // Fetch scheduled custom exports
        var fetchScheduledCustomExports = () => {
            var onScheduledExportsFetchSuccess = (data) => {
                    $scope.customExportsData.scheduledCustomExports = data;

                    _.each($scope.customExportsData.scheduledCustomExports, function (schedule) {
                        schedule.filteredOut = false;
                        schedule.report.description = schedule.name;
                    });

                    $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
                },
                onScheduledExportsFetchFailure = () => {
                    $scope.customExportsData.scheduledCustomExports = [];
                };

            $scope.callAPI(RVCustomExportSrv.getScheduledCustomExports, {
                onSuccess: onScheduledExportsFetchSuccess,
                onFailure: onScheduledExportsFetchFailure
            });

        };
        
        // Populate the selected value for delivery type and format for already saved schedule
        var applySelectedFormatAndDeliveryTypes = () => {
                $scope.customExportsScheduleParams.format = $scope.selectedEntityDetails.format && $scope.selectedEntityDetails.format.id;
                $scope.customExportsScheduleParams.deliveryType = $scope.selectedEntityDetails.delivery_type && $scope.selectedEntityDetails.delivery_type.id;
            },
            // mark the selected columns
            updateSelectedColumns = () => {
                
                _.each ($scope.selectedEntityDetails.mapped_name, (value) => {
                    var selectedColumn = _.find($scope.selectedEntityDetails.columns, {
                                            name: value.field_name 
                                        }),
                        columnPos = parseInt(value.sequence_order) - 1;
                    
                        selectedColumn.selected = true;
                        selectedColumn.customColLabel = value.mapped_name;

                    $scope.selectedColumns[columnPos] = selectedColumn;

                });
            },
            getValue = (value) => {
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
                    case 'MINUTES':
                        return 'Minute';
                    default:
                        return 'Per';
                }
            },

            createExportFrequencyTypes = () => {
                $scope.customExportsData.scheduleFreqTypes = _.map($scope.customExportsData.scheduleFrequencies, function(freq) {
                    return {
                        id: freq.id,
                        value: getValue(freq.value),
                        originalValue: freq.value
                    };
                });
            };
            
        /**
         * Loads all the data required for the exports
         * @param {Number} reportId - id of the report
         * @return {void}
         */
        var loadReqData = (reportId, isSavedSchedule ) => {
            var onSuccess = ( payload ) => {
                    $scope.selectedEntityDetails.columns = angular.copy(payload.columns);
                    $scope.selectedEntityDetails.active = true;
                    $scope.viewState.currentStage = STAGES.SHOW_PARAMETERS;
                    $scope.customExportsData.exportFormats = angular.copy(payload.exportFormats);
                    $scope.customExportsData.deliveryTypes = angular.copy(payload.deliveryTypes);
                    $scope.customExportsData.durations = angular.copy(payload.durations);
                    $scope.customExportsData.scheduleFrequencies = angular.copy(payload.scheduleFrequency);
                    $scope.ftpServerList = payload.ftpServerList;
                    $scope.dropBoxAccountList = payload.dropBoxAccounts;
                    $scope.googleDriveAccountList = payload.googleDriveAccounts;

                    if (!$scope.customExportsData.isNewExport) {
                        applySelectedFormatAndDeliveryTypes(); 
                        updateSelectedColumns();
                    }
                    createExportFrequencyTypes();
                    processScheduleDetails($scope.selectedEntityDetails);
                    $scope.updateViewCol($scope.viewColsActions.SIX);
                    refreshScroll(REPORT_COLS_SCROLLER, true);
                    refreshScroll(SCHEDULE_DETAILS_SCROLLER, true);
                    refreshScroll(DELIVERY_OPTIONS_SCROLLER, true);

                    var reportFilters = angular.copy($scope.selectedEntityDetails.filters);

                    $scope.selectedEntityDetails.processedFilters = RVCustomExportsUtilFac.processFilters(reportFilters);
                    if (isSavedSchedule) {
                        $scope.$broadcast('UPDATE_FILTER_SELECTIONS');
                    }

                },
                onFailure = (error) => {
                    $scope.errorMessage = error;
                };
            
            $scope.callAPI(RVCustomExportSrv.getRequestData, {
                onSuccess: onSuccess,
                onFailure: onFailure,
                params: {
                    reportId: reportId
                }
            });
        };

        // Click handler for the given data space
        $scope.clickDataSpace = ( selectedDataSpace ) => {
            // Set the previous data space as non-active
            if ($scope.selectedEntityDetails) {
                $scope.selectedEntityDetails.active = false;
            }
            $scope.selectedEntityDetails = selectedDataSpace;
            $scope.filterData.appliedFilters = [];
            loadReqData(selectedDataSpace.id);
        };

        // Handle the selection of fields belonging to the data space
        $scope.selectColumn = (column) => {
            if (column.selected) {
                $scope.selectedColumns.push(column);
            } else {
                $scope.selectedColumns = _.reject($scope.selectedColumns, (col) => {
                    return col.name === column.name;

                });
            }

            $timeout(function () {
                refreshScroll(REPORT_SELECTED_COLS_SCROLLER);
            }, 100);

        };

        /**
         * Get selected item values for multi select option
         * @param {Array} items - array of items
         * @param {String} key -the key to used as value
         * @return {Array} selectedIds - array of selected ids
         */
        var getSelectedItemValues = (items, key) => {
            key = key || 'value';
            var selectedItems = _.where(items, { selected: true }),
                selectedIds = _.pluck(selectedItems, key);

            return selectedIds;
        };

        /**
         * Construct the request params required while saving the export
         * @param {Number} reportId - id of the report
         * @return {Object} params - holding the request parameters
         */
        var getScheduleParams = (reportId) => {
            var params = {
                report_id: reportId,
                hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
                format_id: $scope.customExportsScheduleParams.format,
                delivery_type_id: '',
                name: $scope.customExportsScheduleParams.exportName
            };

            var fieldMappings = [],
                selectedField;

            _.each ($scope.selectedColumns, (column, index) => {
                selectedField = {
                    field_name: column.name,
                    mapped_name: column.customColLabel,
                    sequence_order: index + 1
                };
                fieldMappings.push(selectedField);
            });

            params.mapped_names = fieldMappings;

            // Process the applied filters
            var filterValues = {},
                paramKey;

            _.each($scope.filterData.appliedFilters, function (filter) {
                paramKey = (filter.selectedFirstLevel).toLowerCase();
                if (filter.isDuration) {
                    filterValues[paramKey] = filter.selectedSecondLevel;
                } else if (filter.isOption) {
                    if (filter.hasDualState) {
                        filterValues[paramKey] = filter.selectedSecondLevel;
                    } else if (filter.isMultiSelect) {
                        filterValues[paramKey] = getSelectedItemValues(filter.secondLevelData);
                    }
                } else if (filter.isRange) {
                    if (!filterValues[paramKey]) {
                        filterValues[paramKey] = [];
                    }
                    filterValues[paramKey].push({
                        operator: filter.selectedSecondLevel,
                        value: filter.rangeValue
                    });
                }

            });
            params.filter_values = filterValues;

            var runOnceId = _.find($scope.customExportsData.scheduleFrequencies, { value: 'RUN_ONCE' }).id;

            if ( $scope.scheduleParams.time ) {
                params.time = $scope.scheduleParams.time;
            }
            
            if ( $scope.scheduleParams.export_date ) {
                params.export_date = $filter('date')($scope.scheduleParams.export_date, 'yyyy/MM/dd');
            }
            

            // fill 'frequency_id', 'starts_on', 'repeats_every' and 'ends_on_date'
            params.frequency_id = $scope.scheduleParams.frequency_id;

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

            var deliveryType = _.find ($scope.customExportsData.deliveryTypes, {
                value: $scope.scheduleParams.delivery_id
            });

            if (deliveryType) {
                params.delivery_type_id = parseInt(deliveryType.id);
            }

            // fill emails/FTP
            if ( $scope.checkDeliveryType('EMAIL') && $scope.emailList.length ) {
                params.emails = $scope.emailList.join(', ');
            } else if ( $scope.checkDeliveryType('SFTP') && !! $scope.scheduleParams.selectedFtpRecipient ) {
                params.sftp_server_id = $scope.scheduleParams.selectedFtpRecipient;
            } else if (($scope.checkDeliveryType('GOOGLE DRIVE') || $scope.checkDeliveryType('DROPBOX')) && 
                        !!$scope.scheduleParams.selectedCloudAccount ) {
                params.cloud_drive_id = $scope.scheduleParams.selectedCloudAccount;
            } else {
                params.emails = '';
                params.sftp_server_id = '';
            }

            // fill sort_field and filters

            return params;
        };

        /**
         * Create a new schedule
         */
        var createSchedule = () => {
            var requestParams = getScheduleParams($scope.selectedEntityDetails.id),
                onScheduleCreateSuccess = () => {
                    $scope.errorMessage = '';
                    $scope.updateViewCol($scope.viewColsActions.ONE);
                    $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
                    $scope.customExportsData.isNewExport = false;
                    fetchScheduledCustomExports();
                },
                onScheduleCreateFailure = (error) => {
                    $scope.errorMessage = error;
                };

            $scope.callAPI(reportsSrv.createSchedule, {
                params: requestParams,
                onSuccess: onScheduleCreateSuccess,
                onFailure: onScheduleCreateFailure
            });
            
        };

        /**
         * Select a particular schedule
         * @param {Object} selectedSchedule - selected schedule
         * @return {void}
         */
        $scope.pickSchedule = (selectedSchedule) => {
            $scope.selectedEntityDetails = selectedSchedule;
            $scope.customExportsData.isNewExport = false;
            $scope.selectedColumns = [];
            $scope.filterData.appliedFilters = [];
            $scope.customExportsScheduleParams.exportName = selectedSchedule.name;
            selectedSchedule.active = true;
            loadReqData(selectedSchedule.report.id, true);
        };

        // Save the given schedule
        var saveSchedule = () => {
            var requestParams = getScheduleParams($scope.selectedEntityDetails.report.id),
                onScheduleSaveSuccess = () => {
                    $scope.errorMessage = '';
                    $scope.updateViewCol($scope.viewColsActions.ONE);
                    $scope.customExportsData.isNewExport = false;
                    $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
                    fetchScheduledCustomExports();
                },
                onScheduleSaveFailure = (error) => {
                    $scope.errorMessage = error;
                };

            requestParams.id = $scope.selectedEntityDetails.id;

            $scope.callAPI(reportsSrv.updateSchedule, {
                params: requestParams,
                onSuccess: onScheduleSaveSuccess,
                onFailure: onScheduleSaveFailure
            });
        };

        // Set up all the listeners here
        var setUpListeners = () => {
            $scope.addListener('UPDATE_CUSTOM_EXPORT_SCHEDULE', () => {
                saveSchedule();
            });
    
            $scope.addListener('SHOW_EXPORT_LISTING', () => {
                $scope.updateViewCol($scope.viewColsActions.ONE);
                $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
                $scope.selectedEntityDetails.active = false;
                
            });
    
            $scope.addListener('CREATE_NEW_CUSTOM_EXPORT_SCHEDULE', () => {
                createSchedule();
            });

            // Listener for creating new custom export
            $scope.addListener('CREATE_NEW_CUSTOM_EXPORT', function () {
                initializeData();
                configureNewExport();
                $scope.customExportsData.isNewExport = true;
                $scope.updateView($scope.reportViewActions.SHOW_CUSTOM_NEW_EXPORT);
                $scope.updateViewCol($scope.viewColsActions.ONE);
            });

            $scope.addListener('RESET_CURRENT_STAGE', () => {
                $scope.viewState.currentStage = STAGES.SHOW_CUSTOM_EXPORT_LIST;
            });
        };

        $scope.notRunOnce = function () {
            var match = _.find($scope.customExportsData.scheduleFrequencies, { id: $scope.scheduleParams.frequency_id }) || {};

            return match.value !== 'RUN_ONCE';
        };

        $scope.getRepeatPer = function() {
            var found = _.find($scope.customExportsData.scheduleFreqTypes, { id: $scope.scheduleParams.frequency_id });

            return found ? found.value : 'Per';
        };

        $scope.checkDeliveryType = function (checkFor) {
            return checkFor === $scope.scheduleParams.delivery_id;
        };

        var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
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
                var alreadyPresent = _.find($scope.emailList, function(email) {
                    return email === ui.item.value;
                });

                if ( ! alreadyPresent ) {
                    $scope.emailList.push( ui.item.value );
                }
                this.value = '';

                runDigestCycle();
                refreshScroll(DELIVERY_OPTIONS_SCROLLER, true);

                return false;
            },
            focus: function() {
                return false;
            }
        };

        $scope.removeEmail = function(index) {
            $scope.emailList = [].concat(
                $scope.emailList.slice(0, index),
                $scope.emailList.slice(index + 1)
            );

            refreshScroll(DELIVERY_OPTIONS_SCROLLER, true);
        };

        $scope.onDeliveryOptionChange = () => {
            // We are just clearing the cloud drive id only because the given id belongs to 
            // a single cloud drive account and if not cleared it will shows empty <option>
            // when the cloud account type is changed from the delivery options
            $scope.scheduleParams.selectedCloudAccount = null;
        };


        // Initialize the data
        var initializeData = () => {
            $scope.customExportsScheduleParams.format = '';
            $scope.customExportsScheduleParams.exportName = '';
            $scope.selectedColumns = [];
            $scope.customExportsData.scheduledCustomExports = [];
            $scope.customExportsData.customExportDataSpaces = [];
            $scope.customExportsData.exportFormats = [];
            $scope.customExportsData.deliveryTypes = [];
            $scope.customExportsData.durations = [];
            $scope.filterData = {
                appliedFilters: [],
                primaryFilter: ''
            };
            $scope.viewState = {
                currentStage: STAGES.SHOW_CUSTOM_EXPORT_LIST
            };
            $scope.scheduleParams = {};
            $scope.emailList = [];
        };
        
        // Initialize the controller
        var init = () => {
            $scope.customExportsData.isNewExport = false;
            initializeData();
            fetchScheduledCustomExports();
            initializeScrollers();
            setUpListeners();
            
        };

        init();

    }
]);