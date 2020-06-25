angular.module('sntRover').controller('rvDiaryRoomStatusAndServiceUpdatePopupCtrl', [
    '$scope',
    '$rootScope',
    'ngDialog',
    'RVHkRoomStatusSrv',
    'RVHkRoomDetailsSrv',
    
    function ($scope, $rootScope, ngDialog, RVHkRoomStatusSrv, RVHkRoomDetailsSrv) {
        BaseCtrl.call(this, $scope);

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
                    }
                });

                $scope.callAPI(RVHkRoomDetailsSrv.fetchAllServiceStatus, {
                    onSuccess: function (data) {
                        $scope.serviceList = data;
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
            fetchRoomServiceInfo = function () {
                $scope.callAPI(RVHkRoomDetailsSrv.getRoomServiceStatus, {
                    params: {
                        room_id: $scope.roomInfo.id
                        //from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
                    },
                    onSuccess: function (data) {
                        $scope.serviceStatus = data.service_status;
                    }
                });
                
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

        // Initialize the controller
        var init = function () {
            $scope.currentActiveSection = 'room';
            $scope.roomInfo = $scope.ngDialogData;
            $scope.serviceStatusDetails = {
                comment: '',
                reason_id: '',
                end_time: '',
                begin_time: '',
                room_service_status_id: ''
            };
            $scope.statusInfo = {
                hkStatus: $scope.roomInfo.hk_status
            };
            $scope.todayDate = tzIndependentDate($rootScope.businessDate);
            fetchHkStatusAndServiceList();
            fetchMaintenenceReasons();
            fetchRoomServiceInfo();
            console.log($scope.ngDialogData);
        };

        init();
        
    }
]);
    