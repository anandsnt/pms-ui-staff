admin.controller('ADClientUsageReportFilterCtrl', ['$scope', '$rootScope', '$filter', 'adReportsSrv', 'adReportsSortOptionsSrv',
    function($scope, $rootScope, $filter, adReportsSrv, adReportsSortOptionsSrv) {
        BaseCtrl.call(this, $scope);

        var initDay = $filter('date')(new Date(), $rootScope.mmddyyyyFormat);

        // common date picker options object
        var commonDateOptions = {
                dateFormat: getJqDateFormat(),
                numberOfMonths: 1,
                changeYear: true,
                changeMonth: true,
                beforeShow: function(input, inst) {
                    $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function(value) {
                    $('#ui-datepicker-overlay').remove();
                }
            },
            init = function() {
                var onGetFilterSuccess = function(filters) {
                        $scope.$emit('hideLoader');
                        //backUp the entire list
                        $scope.filterState.store = angular.copy(filters);
                        $scope.filterState.filters = filters;
                    },
                    onGetSortOptionsSuccess = function(sortOptions) {
                        $scope.filterState.sortOptions = sortOptions;
                        $scope.$emit('hideLoader');
                    };
                // Get Filters and Sort Options for this report
                // NOTE: $scope.reportKey is initiated in the partial so that it is availble in the respective controllers
                $scope.invokeApi(adReportsSrv.getFilterData, $scope.reportKey, onGetFilterSuccess);
                $scope.invokeApi(adReportsSortOptionsSrv.getSortOptions, $scope.reportKey, onGetSortOptionsSuccess);
            },
            genParams = function() {
                var state = $scope.filterState,
                    selectedHotels = _.filter(state.filters['HOTELS'], function(hotel) {
                        return hotel.isSelected;
                    }),
                    payLoad = {
                        from_date: $filter('date')(state.fromDate, $rootScope.mmddyyyyFormat),
                        to_date: $filter('date')(state.toDate, $rootScope.mmddyyyyFormat),
                        hotel_ids: _.pluck(selectedHotels, 'value')
                    }

                if (state.sortByValue) {
                    payLoad['sort_field'] = state.sortByValue;
                    payLoad['sort_dir'] = true;
                }
                return payLoad;
            };

        $scope.filterState = {
            fromDate: initDay,
            toDate: initDay,
            sortByValue: '',
            fromDateOptions: angular.extend({
                onSelect: function(value) {
                    $scope.filterState.toDateOptions.minDate = value;
                }
            }, commonDateOptions),
            toDateOptions: angular.extend({
                onSelect: function(value) {
                    $scope.filterState.fromDateOptions.maxDate = value;
                }
            }, commonDateOptions)
        };

        $scope.exportCSV = function() {
            $scope.invokeApi(adReportsSrv.exportCSV, {
                url: '/api/reports/client_usage.csv',
                payload: genParams()
            }, function(response) {
                $scope.$emit('hideLoader');
            }, function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            });
        };

        $scope.filterHotelsList = function() {
            var selectedTypes = [],
                selectedChains = [],
                filteredHotels = [];

            _.each($scope.filterState.filters["PMS_TYPES"], function(type) {
                if (type.isSelected) {
                    selectedTypes.push(type.value);
                }
            });

            _.each($scope.filterState.filters["HOTEL_CHAINS"], function(type) {
                if (type.isSelected) {
                    selectedChains.push(parseInt(type.value, 10));
                }
            });

            _.each($scope.filterState.store["HOTELS"], function(hotel) {
                var pmsType = hotel.isStandAlone ? "STANDALONE" : "OVERLAY";
                if (_.indexOf(selectedTypes, pmsType) > -1 &&
                    _.indexOf(selectedChains, hotel.chain) > -1) {
                    filteredHotels.push(_.extend(hotel, {
                        isSelected: true
                    }));
                }
            });

            $scope.filterState.filters["HOTELS"] = angular.copy(filteredHotels);
        };

        init();
    }
]);