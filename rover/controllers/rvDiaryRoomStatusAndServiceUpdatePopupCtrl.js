angular.module('sntRover').controller('rvDiaryRoomStatusAndServiceUpdatePopupCtrl', [
    '$scope',
    '$rootScope',
    'ngDialog',
    'RVHkRoomStatusSrv',
    'RVHkRoomDetailsSrv',
    '$timeout',
    '$filter',
    'rvUtilSrv',
    function ($scope, $rootScope, ngDialog, RVHkRoomStatusSrv, RVHkRoomDetailsSrv, $timeout, $filter, util) {
        BaseCtrl.call(this, $scope);

        var ROOM_STATUS_SERVICE_UPDATE_SCROLLER = 'roomStatusServiceUpdateScroller',
            INTERVAL_FOR_TIME_SELECTOR = 15,
            HOUR_MODE = 12,
            IN_SERVICE_ID = 1;

        // Closes the popup
        $scope.closeDialog = function () {
            ngDialog.close();
        };

        /**
         * Set the active tab in the popup - status | service
         * @param {String} name active tab name
         * @return {void}
         */
        $scope.setActiveSection = function (name) {
            $scope.currentActiveSection = name;
            if (name === 'service') {
                $timeout(function () {
                    $scope.refreshScroller(ROOM_STATUS_SERVICE_UPDATE_SCROLLER);
                }, 1000);
            }

        };

        /**
         * Get class name based on the hk status and service status
         * @param {String} roomStatus hk status
         * @param {String} serviceStatus service status
         * @return {String} className css class
         */
        $scope.getClassNameByHkStatus = function (roomStatus, serviceStatus) {
            var className = '';

            if (serviceStatus !== 'IN_SERVICE') {
                className = 'unavailable';
            } else if (roomStatus === 'CLEAN' && $rootScope.useInspectedRoomStatus) {
                className = 'clean not-inspected';
            } else if (roomStatus === 'CLEAN' && !$rootScope.useInspectedRoomStatus) {
                className = 'clean';
            } else if (roomStatus === 'INSPECTED') {
                className = 'inspected';
            } else if (roomStatus === 'DIRTY') {
                className = 'dirty';
            } else if (roomStatus === 'PICKUP') {
                className = 'pickup';
            } else if (roomStatus === 'DO_NOT_DISTURB') {
                className = 'dnd';
            }

            return className;

        };

        /**
         * Find hk status id by value
         * @param {String} statusValue - status value
         * @return {String} id return id of the status
         */
        var findHkStatusIdByValue = function (statusValue) {
            var selectedItem = _.find($scope.hkStatusList, {
                value: statusValue
            });

            return (selectedItem && selectedItem.id) || '';
        };

        // Fetch hk status and service list
        var fetchHkStatusAndServiceList = function () {

            $scope.callAPI(RVHkRoomStatusSrv.fetchHkStatusList, {
                onSuccess: function (data) {
                    $scope.hkStatusList = data;
                    $scope.returnStatusList = _.reject($scope.hkStatusList, function (item) {
                        return item.value === 'DO_NOT_DISTURB';
                    });
                }
            });

            $scope.callAPI(RVHkRoomDetailsSrv.fetchAllServiceStatus, {
                onSuccess: function (data) {
                    $scope.serviceList = data;
                    IN_SERVICE_ID = (_.find($scope.serviceList, { value: 'IN_SERVICE' })).id;
                }
            });

        },
            // Fetch maintanence reasons list
            fetchMaintenenceReasons = function () {
                $scope.callAPI(RVHkRoomDetailsSrv.fetchMaintenanceReasons, {
                    onSuccess: function (data) {
                        $scope.maintenanceReasonsList = data;
                    }
                });

            },
            // Fetch room service info
            fetchRoomServiceInfo = function (selectedDate) {
                $scope.callAPI(RVHkRoomDetailsSrv.getRoomServiceStatus, {
                    params: {
                        room_id: $scope.roomInfo.id,
                        from_date: $filter('date')(selectedDate, 'yyyy-MM-dd')
                    },
                    onSuccess: function (data) {
                        $scope.serviceStatus = data.service_status;
                        var selectedServiceData = $scope.serviceStatus[getApiFormattedDate(selectedDate)];
                        
                        $scope.serviceStatusDetails.room_service_status_id = selectedServiceData.id;
                        $scope.serviceStatusDetails.reason_id = selectedServiceData.maintenance_reason_id;
                        $scope.serviceStatusDetails.comment = selectedServiceData.comments;
                        $scope.serviceStatusDetails.return_status_id = selectedServiceData.return_status_id;
                        
                    }
                });

            },
            // Set from and to date picker options
            setDatePickerOptions = function () {
                var setClass = function (day) {
                    return [true, $scope.serviceStatus[$filter('date')(tzIndependentDate(day), 'yyyy-MM-dd')]
                        && $scope.serviceStatus[$filter('date')(tzIndependentDate(day), 'yyyy-MM-dd')].id > 1 ? 'room-out' : ''];
                },
                    datePickerCommon = {
                        dateFormat: $rootScope.jqDateFormat,
                        numberOfMonths: 1,
                        changeYear: true,
                        changeMonth: true,
                        beforeShow: function (input, inst) {
                            $('#ui-datepicker-div').addClass('reservation hide-arrow');
                            $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

                            setTimeout(function () {
                                $('body').find('#ui-datepicker-overlay')
                                    .on('click', function () {
                                        $('#room-out-from').blur();
                                        $('#room-out-to').blur();
                                    });
                            }, 100);
                        },
                        onClose: function (value) {
                            $('#ui-datepicker-div').removeClass('reservation hide-arrow');
                            $('#ui-datepicker-overlay').off('click').remove();
                        }
                    },
                    adjustDates = function () {
                        if (tzIndependentDate($scope.serviceStatusDetails.from_date) > tzIndependentDate($scope.serviceStatusDetails.to_date)) {
                            $scope.serviceStatusDetails.to_date = $filter('date')(tzIndependentDate($scope.serviceStatusDetails.from_date), 'yyyy-MM-dd');
                        }
                        $scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.serviceStatusDetails.from_date), $rootScope.dateFormat);
                    };

                $scope.fromDateOptions = angular.extend({
                    minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
                    onSelect: adjustDates,
                    beforeShowDay: setClass
                }, datePickerCommon);

                $scope.untilDateOptions = angular.extend({
                    minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
                    onSelect: adjustDates,
                    beforeShowDay: setClass
                }, datePickerCommon);
            },
            // Get date in API date format
            getApiFormattedDate = function (date) {
                return $filter('date')(new tzIndependentDate(date), $rootScope.dateFormatForAPI);
            };

        // Checks whether the room tab is active or not
        $scope.isRoomStatusSectionActive = function () {
            return $scope.currentActiveSection === 'room';
        };

        /**
         * Update the hk status of the given room
         * @param {String} roomNo room no
         * @return {void}
         */
        $scope.updateRoomStatus = function (roomNo) {
            $scope.callAPI(RVHkRoomDetailsSrv.updateHKStatus, {
                params: {
                    room_no: roomNo,
                    hkstatus_id: findHkStatusIdByValue($scope.statusInfo.hkStatus)
                },
                onSuccess: function () {
                    $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', $scope.roomInfo.room_id);
                    $scope.closeDialog();
                },
                onFailure: function (error) {
                    $scope.errorMessage = error;
                }
            });
        };

        // Checks if room is in-service
        $scope.isInService = function () {
            return $scope.serviceStatusDetails.room_service_status_id === IN_SERVICE_ID;
        };

        // Handler for service status change
        $scope.onServiceStatusChange = function () {
            $scope.refreshScroller(ROOM_STATUS_SERVICE_UPDATE_SCROLLER);
        };

        // Should show time selector fields
        $scope.shouldShowTimeSelector = function () {
            return ($rootScope.isHourlyRateOn || $rootScope.hotelDiaryConfig.mode === 'FULL') && !$scope.isInService();
        };

        // Update room service status
        $scope.updateServiceStatus = function () {

            var updateServiceStatusSuccessCallBack = function () {
                    $scope.$emit('REFRESH_DIARY_ROOMS_AND_RESERVATIONS', $scope.roomInfo.room_id);
                    $scope.closeDialog();
                },
                params = {
                    from_date: getApiFormattedDate($scope.serviceStatusDetails.from_date),
                    to_date: getApiFormattedDate($scope.serviceStatusDetails.to_date),
                    begin_time: "",
                    end_time: "",
                    reason_id: $scope.serviceStatusDetails.reason_id,
                    comment: $scope.serviceStatusDetails.comment,
                    room_service_status_id: $scope.serviceStatusDetails.room_service_status_id,
                    return_status_id: $scope.serviceStatusDetails.return_status_id
                };

            if ($scope.shouldShowTimeSelector()) {
                params.begin_time = $scope.serviceStatusDetails.begin_time;
                params.end_time = $scope.serviceStatusDetails.end_time;
            }

            params.room_id = $scope.roomInfo.id;

            $scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, params, updateServiceStatusSuccessCallBack);
        };

        // Initialize the controller
        var init = function () {
            $scope.currentActiveSection = 'room';
            $scope.roomInfo = $scope.ngDialogData;
            $scope.serviceStatusDetails = {
                comment: '',
                reason_id: '',
                end_time: '',
                begin_time: '',
                room_service_status_id: '',
                from_date: tzIndependentDate($rootScope.businessDate),
                to_date: tzIndependentDate($rootScope.businessDate)
            };
            $scope.statusInfo = {
                hkStatus: $scope.roomInfo.hk_status
            };
            $scope.todayDate = tzIndependentDate($rootScope.businessDate);
            setDatePickerOptions();
            fetchHkStatusAndServiceList();
            fetchMaintenenceReasons();
            fetchRoomServiceInfo(tzIndependentDate($rootScope.businessDate));
            $scope.setScroller(ROOM_STATUS_SERVICE_UPDATE_SCROLLER);
            $scope.timeSelectorList = util.getListForTimeSelector(INTERVAL_FOR_TIME_SELECTOR, HOUR_MODE);
            console.log($scope.ngDialogData);
        };

        init();

    }
]);
