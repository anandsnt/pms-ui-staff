angular.module('sntRover').controller("RVCompanyCardTravelAgentStatisticsController", [
    '$scope',
    '$rootScope',
    'RVCompanyCardSrv',
    '$timeout',
    '$vault',
    '$state',
    '$stateParams',
    function ($scope, $rootScope, RVCompanyCardSrv, $timeout, $vault, $state, $stateParams) {
        var listeners = [],
            SIDEBAR_SCROLLER = 'cc-sidebar-scroller',
            MONTHLY_DATA_SCROLLER = 'cc-monthly-data-scroller',
            SUMMARY_SIDEBAR_SCROLLER = 'cc-statistics-summary-sidebar-scroller',
            SUMMARY_DATA_SCROLLER = 'cc-statistics-summary-data-scroller',
            PER_PAGE_COUNT = 25;

        BaseCtrl.call(this, $scope);
        StatisticsBaseCtrl.call(this, $scope, $rootScope);

        // Load the cc/ta statistics summary
        var loadStatisticsSummary = function () {
            var onStatisticsFetchSuccess = function (data) {
                $scope.statistics.summary = data;
                $timeout(function () {
                    reloadScroller(true);

                }, 200);
                isSummaryViewScrollReady();
            },
                onStatistcsFetchFailure = function () {
                    $scope.statistics.summary = {};
                },
                requestConfig = {
                    params: {
                        year: $scope.filterData.selectedYear,
                        accountId: getAccountId()
                    },
                    onSuccess: onStatisticsFetchSuccess,
                    onFailure: onStatistcsFetchFailure
                };

            $scope.callAPI(RVCompanyCardSrv.fetchCompanyTravelAgentStatisticsSummary, requestConfig);
        },
            // Load the statistic details for the given CC/TA
            loadStatisticsDetails = function () {
                var onStatisticsDetailsFetchSuccess = function (data) {
                    $scope.statistics.details = data;
                    $scope.statistics.details.monthly_data = $scope.statistics.details.monthly_data.reverse();
                    $timeout(function () {
                        reloadScroller(true);
                    }, 500);
                    isDetailedViewScrollReady();
                },
                    onStatistcsDetailsFetchFailure = function () {
                        $scope.statistics.details = {};
                    },
                    requestConfig = {
                        params: {
                            year: $scope.filterData.selectedYear,
                            accountId: getAccountId()
                        },
                        onSuccess: onStatisticsDetailsFetchSuccess,
                        onFailure: onStatistcsDetailsFetchFailure
                    };

                $scope.callAPI(RVCompanyCardSrv.fetchCompanyTravelAgentStatisticsDetails, requestConfig);
            },
            // Set the listeners for the controller
            setListeners = function () {
                listeners['LOAD_GUEST_STATISTICS'] = $scope.$on('LOAD_GUEST_STATISTICS', function () {
                    loadStatisticsSummary();
                }),
                    listeners['UPDATE_CONTACT_INFO'] = $scope.$on('UPDATE_CONTACT_INFO', function () {
                        setUpData();
                    });
            },
            // Destroy the listeners
            destroyListeners = function () {
                angular.forEach(function (listener) {
                    $scope.$on('$destroy', listener);
                });
            },
            // Get account id
            getAccountId = function () {
                var id = '';

                if ($scope.contactInformation && $scope.contactInformation.id) {
                    id = $scope.contactInformation.id;
                }
                if (!id) {
                    id = $stateParams.id;
                }
                return id;
            };

        // Set statistics tab active view - summary | details
        $scope.setActiveView = function (view, year) {
            $scope.activeView = view;

            if (view === 'details') {
                $scope.filterData.selectedYear = year || $scope.getCurrentYear();
                configureScroller();
                isDetailedViewScrollReady();
                populateYearDropDown();
                loadStatisticsDetails();
            } else {
                $scope.filterData.selectedYear = $scope.getCurrentYear() - 1;
                configureScroller();
                isSummaryViewScrollReady();
                populateYearDropDown();
                loadStatisticsSummary();
            }
        };

        $scope.getReservationByPage = function (pageNo) {
            loadReservations(pageNo, $scope.selectedMonthData);
        };

        var loadReservations = function (pageNo, monthlyData) {
                var onMonthlyReservationsFetchSuccess = function (data) {
                        $scope.totalResultCount = data.total_count;
                        monthlyData.reservations = data.reservations;
                        refreshPagination();
                        $timeout(function () {
                            reloadScroller();
                            $scope.getScroller(MONTHLY_DATA_SCROLLER).scrollToElement('.res-active', 500, 0, 0);
                        }, 1000);
                        isDetailedViewScrollReady();
                    },
                    onMonthlyReservationsFetchFailure = function () {
                        monthlyData.reservations = [];
                    },
                    requestConfig = {
                        params: {
                            year: $scope.filterData.selectedYear,
                            month: monthlyData.month,
                            accountId: getAccountId(),
                            per_page: PER_PAGE_COUNT,
                            page: pageNo
                        },
                        onSuccess: onMonthlyReservationsFetchSuccess,
                        onFailure: onMonthlyReservationsFetchFailure
                    };

                $scope.callAPI(RVCompanyCardSrv.fetchCompanyTravelAgentMonthlyReservations, requestConfig);
            },
            refreshPagination = function () {
                $timeout(function () {
                    $scope.$broadcast('updatePagination', 'STATISTICS_PAGINATION');
                }, 200);
            };

        // Checks whether reservation listing should be shown or not
        $scope.shouldShowReservations = function (monthlyData) {
            return monthlyData.reservations_count !== 0;
        };

        // Toggle the reservation list view displayed for a month
        $scope.showMonthlyReservations = function (monthlyData) {
            if (!$scope.shouldShowReservations(monthlyData)) {
                return false;
            }

            if (!monthlyData.isOpen) {
                $scope.totalResultCount = 0;
                refreshPagination();
                $scope.selectedMonthData = monthlyData;
                $scope.statistics.details.monthly_data.forEach(function(data, index) {
                    if (data.month !== monthlyData.month) {
                        $scope.statistics.details.monthly_data[index].isOpen = false;
                        data.reservations = [];
                    }
                });
                loadReservations(1, monthlyData);
                monthlyData.isOpen = !monthlyData.isOpen;
            } else {
                monthlyData.isOpen = !monthlyData.isOpen;
                $timeout(function () {
                    reloadScroller();
                }, 200);
            }
        };

        // Processes the year change event
        $scope.onChangeYear = function () {
            if ($scope.activeView === 'summary') {
                loadStatisticsSummary();
            } else {
                loadStatisticsDetails();
            }
        };

        // create the year dropdown options
        var populateYearDropDown = function () {
            $scope.populateYearDropDown($scope.contactInformation.first_stay_year);
        };

        // Navigate to staycard
        $scope.navigateToStayCard = function (reservation) {
            if ($state.current.name !== 'rover.companycarddetails') {
                return false;
            }

            $vault.set('cardId', $scope.accountId);
            $vault.set('type', $scope.contactInformation.account_details.account_type);
            $vault.set('selectedYear', $scope.filterData.selectedYear);
            $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                id: reservation.reservation_id,
                confirmationId: reservation.confirmation_no,
                isrefresh: true,
                isFromCardStatistics: true
            });
        };

        // Checks whether the navigation to the staycard should be shown or not in the details screen
        $scope.shouldShowNavigation = function () {
            var shouldHide = true;

            if ($state.current.name === 'rover.companycarddetails') {
                shouldHide = false;
            }
            return shouldHide;
        };

        // Get style for statistics details expanded view
        $scope.getStyleForExpandedView = function (monthlyData) {
            var styleClass = {},
                count = monthlyData.reservations && monthlyData.reservations.length;

            if (monthlyData.isOpen) {
                var margin = count * 70 + 30;

                if ($scope.totalResultCount > $scope.perPage) {
                    margin = margin + 60;
                }

                styleClass['margin-bottom'] = margin + 'px';
            }
            return styleClass;
        };

        // Set up the data required during initialization
        var setUpData = function () {            
            $scope.accountId = getAccountId();
            $scope.currentYear = $scope.getCurrentYear();
            populateYearDropDown();
        },
            // Configure the left and right scroller
            configureScroller = function () {
                $scope.setScroller(SIDEBAR_SCROLLER, {
                    'preventDefault': false,
                    'probeType': 3
                });
                $scope.setScroller(MONTHLY_DATA_SCROLLER, {
                    'preventDefault': false,
                    'probeType': 3,
                    'scrollX': true
                });
                $scope.setScroller(SUMMARY_SIDEBAR_SCROLLER, {
                    'preventDefault': false,
                    'probeType': 3
                });
                $scope.setScroller(SUMMARY_DATA_SCROLLER, {
                    'preventDefault': false,
                    'probeType': 3,
                    'scrollX': true
                });
            },
            // Refreshes the two scrollers in the screen
            reloadScroller = function (shouldSrollToTop) {
                $timeout(function () {
                    if ($scope.myScroll.hasOwnProperty(SIDEBAR_SCROLLER)) {
                        $scope.refreshScroller(SIDEBAR_SCROLLER);
                        if (shouldSrollToTop) {
                            $scope.myScroll[SIDEBAR_SCROLLER].scrollTo(0, 0, 100);
                        }
                    }

                    if ($scope.myScroll.hasOwnProperty(MONTHLY_DATA_SCROLLER)) {
                        $scope.refreshScroller(MONTHLY_DATA_SCROLLER);
                        if (shouldSrollToTop) {
                            $scope.myScroll[MONTHLY_DATA_SCROLLER].scrollTo(0, 0, 100);
                        }
                    }

                    if ($scope.myScroll.hasOwnProperty(SUMMARY_SIDEBAR_SCROLLER)) {
                        $scope.refreshScroller(SUMMARY_SIDEBAR_SCROLLER);
                        if (shouldSrollToTop) {
                            $scope.myScroll[SUMMARY_SIDEBAR_SCROLLER].scrollTo(0, 0, 100);
                        }
                    }
                    if ($scope.myScroll.hasOwnProperty(SUMMARY_DATA_SCROLLER)) {
                        $scope.refreshScroller(SUMMARY_DATA_SCROLLER);
                        if (shouldSrollToTop) {
                            $scope.myScroll[SUMMARY_DATA_SCROLLER].scrollTo(0, 0, 100);
                        }
                    }
                }, 200);
            },
            // Set up scroll listeners for detailed view left and right pane
            setUpDetailedViewScrollListner = function () {
                if ($scope.myScroll.hasOwnProperty(SIDEBAR_SCROLLER) && $scope.myScroll.hasOwnProperty(MONTHLY_DATA_SCROLLER)) {
                    $scope.myScroll[SIDEBAR_SCROLLER]
                        .on('scroll', function () {
                            $scope.myScroll[MONTHLY_DATA_SCROLLER]
                                .scrollTo(0, this.y);
                        });
                    $scope.myScroll[MONTHLY_DATA_SCROLLER]
                        .on('scroll', function () {
                            $scope.myScroll[SIDEBAR_SCROLLER]
                                .scrollTo(0, this.y);
                        });
                }
            },
            // Set up scroll listeners for summary view left and right pane
            setUpSummaryViewScrollListner = function () {
                if ($scope.myScroll.hasOwnProperty(SUMMARY_SIDEBAR_SCROLLER) && $scope.myScroll.hasOwnProperty(SUMMARY_DATA_SCROLLER)) {
                    $scope.myScroll[SUMMARY_SIDEBAR_SCROLLER]
                        .on('scroll', function () {
                            $scope.myScroll[SUMMARY_DATA_SCROLLER]
                                .scrollTo(0, this.y);
                        });
                    $scope.myScroll[SUMMARY_DATA_SCROLLER]
                        .on('scroll', function () {
                            $scope.myScroll[SUMMARY_SIDEBAR_SCROLLER]
                                .scrollTo(0, this.y);
                        });
                }

            },
            // Check whether detailed view scroll is ready
            isDetailedViewScrollReady = function () {
                if ($scope.myScroll.hasOwnProperty(SIDEBAR_SCROLLER) && $scope.myScroll.hasOwnProperty(MONTHLY_DATA_SCROLLER)) {
                    setUpDetailedViewScrollListner();
                } else {
                    $timeout(isDetailedViewScrollReady, 1000);
                }
            },
            // Check whether summary view scroll is ready
            isSummaryViewScrollReady = function () {
                if ($scope.myScroll.hasOwnProperty(SUMMARY_SIDEBAR_SCROLLER) && $scope.myScroll.hasOwnProperty(SUMMARY_DATA_SCROLLER)) {
                    setUpSummaryViewScrollListner();
                } else {
                    $timeout(isSummaryViewScrollReady, 1000);
                }
            },
            // Initialize the pagination params
            initialisePagination = function () {
                $scope.perPage = PER_PAGE_COUNT;
                $scope.page = 1;
            },
            // Configure page options
            configurePagination = function () {
                $scope.pageOptions = {
                    id: "STATISTICS_PAGINATION",
                    perPage: $scope.perPage,
                    api: $scope.getReservationByPage
                };
            };


        // Initialize the controller
        var init = function () {
            $scope.activeView = "summary";
            $scope.statistics = {
                summary: {},
                details: {}
            };
            $scope.filterData = {
                selectedYear: $scope.getCurrentYear() - 1
            };
            setUpData();
            isDetailedViewScrollReady();
            isSummaryViewScrollReady();
            setListeners();
            destroyListeners();
            initialisePagination();
            configurePagination();

            if ($stateParams.isBackFromStaycard) {
                $scope.filterData.selectedYear = $stateParams.selectedStatisticsYear ? $stateParams.selectedStatisticsYear : $scope.filterData.selectedYear;
                $scope.setActiveView('details', $scope.filterData.selectedYear);
            } else {
                $scope.setActiveView('summary');
            }


        };

        init();

    }]);