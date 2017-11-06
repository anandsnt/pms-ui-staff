angular.module('admin').controller('ADInterfaceLogsCtrl', ['$scope', '$rootScope', 'interfaces', 'currentTime', 'dateFilter', 'ADInterfaceLogsSrv',
    'ADHotelListSrv', 'ngTableParams', '$timeout', '$log',
    function($scope, $rootScope, interfaces, currentTime, dateFilter, ADInterfaceLogsSrv,
             ADHotelListSrv, ngTableParams, $timeout, $log) {

        var currentHour, currentMinute, isLoadComplete;

        /**
         *
         * @param {Integer} hours hour from current hotel time
         * @param {Integer} minutes minute from current hotel time
         * @return {string} hh:mm 24h format rounded to next quarter
         */
        function getNextQuarterHour(hours, minutes) {
            var roundedHours = (minutes > 45 ? ++hours % 24 : hours).toString(),
                roundedMins = ((((minutes + 14) / 15 | 0) * 15) % 60).toString();

            return (roundedHours.length === 2 ? roundedHours : "0" + roundedHours ) +
                ":" +
                (roundedMins.length === 2 ? roundedMins : "0" + roundedMins);
        }

        /**
         * @return {Object} default filter values
         */
        function getDefaultFilter() {
            return angular.copy({
                integration: $scope.interfaces[0] || '',
                date: new tzIndependentDate($rootScope.businessDate),
                from_time: getNextQuarterHour(currentHour - 1, currentMinute),
                to_time: getNextQuarterHour(currentHour, currentMinute),
                keyword: "",
                direction: 'inbound'
            });
        }

        $scope.datePickerOptions = {
            dateFormat: $rootScope.jqDateFormat,
            numberOfMonths: 1,
            changeYear: true,
            changeMonth: true,
            beforeShow: function() {
                $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
            },
            onClose: function() {
                $('#ui-datepicker-overlay').remove();
            }
        };


        $scope.selectDirection = function(direction) {
            $scope.filter.direction = direction;
            $scope.reloadTable();
        };

        $scope.search = function($defer, params) {
            if (!isLoadComplete) {
                isLoadComplete = 1;
                return;
            }
            $scope.$emit('showLoader');
            $scope.errorMessage = '';

            $scope.callAPI(ADInterfaceLogsSrv.search, {
                params: _.extend($scope.filter, {
                    hotel_uuid: ADHotelListSrv.getSelectedProperty(),
                    date: dateFilter($scope.filter.date, $rootScope.dateFormatForAPI),
                    page: params.page()
                }),
                successCallBack: function(response) {
                    $timeout(function() {
                        $scope.$emit('hideLoader');
                        $scope.totalCount = response.total_count;
                        $scope.totalPage = Math.ceil(response.total_count / $scope.displyCount);
                        $scope.data = response.messages;
                        $scope.currentPage = params.page();
                        params.total(response.total_count);
                        $defer.resolve($scope.data);
                    }, 500);
                },
                failureCallBack: function(errors) {
                    $scope.$emit('hideLoader');
                    $scope.errorMessage = errors;
                }
            });
        };

        $scope.download = function(id, integration, request, response) {
            if (request) {
                $scope.callAPI(ADInterfaceLogsSrv.download, {
                    params: {
                        integration: integration,
                        hotel_uuid: ADHotelListSrv.getSelectedProperty(),
                        url: '/admin/interface_messages/' + id + '/message_request.xml?integration=' + integration
                    },
                    successCallBack: function(response) {
                        $log.info(response);
                    },
                    failureCallBack: function(errors) {
                        $scope.errorMessage = errors;
                    }
                });
            }

            if (response) {
                $scope.callAPI(ADInterfaceLogsSrv.download, {
                    params: {
                        integration: integration,
                        hotel_uuid: ADHotelListSrv.getSelectedProperty(),
                        url: '/admin/interface_messages/' + id + '/message_response.xml?integration=' + integration
                    },
                    successCallBack: function(response) {
                        $log.info(response);
                    },
                    failureCallBack: function(errors) {
                        $scope.errorMessage = errors;
                    }
                });
            }
        };

        (function() {
            BaseCtrl.call(this, $scope);
            ADBaseTableCtrl.call(this, $scope, ngTableParams);

            currentTime = currentTime.hotel_time;
            currentHour = parseInt(currentTime.hh, 10);
            currentMinute = parseInt(currentTime.mm, 10);

            $scope.interfaces = interfaces.external_interfaces || [];
            $scope.filter = getDefaultFilter();
            $scope.results = [];

            $scope.tableParams = new ngTableParams(
                {
                    page: 1,
                    count: $scope.displyCount || 10,
                    sorting: {
                        rate: 'asc'
                    }
                }, {
                    total: $scope.data.length,
                    getData: $scope.search
                }
            );
        }());
    }
]);
