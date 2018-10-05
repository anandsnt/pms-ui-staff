angular.module('sntRover').controller("RVGuestCardStatisticsController", [
    '$scope',
    '$rootScope',
    'RVGuestCardsSrv',
    function ($scope, $rootScope, RVGuestCardsSrv) {
        BaseCtrl.call(this, $scope);

        const SIDEBAR_SCROLLER = 'sidebarScroller';
        const MONTHLY_DATA_SCROLLER = 'monthlyDataScroller';

        var listeners = [];

        // Load the guest card statistics summary
        var loadStatisticsSummary = function() {
                var onStatisticsFetchSuccess = function(data) {
                        $scope.statistics.summary = data;
                        $scope.activeView = 'summary';
                    },
                    onStatistcsFetchFailure = function() {
                        $scope.statistics.summary = {};
                    },
                    requestConfig = {
                        params: {
                            year: $scope.filterData.selectedYear,
                            guestId: $scope.guestID
                        },
                        onSuccess: onStatisticsFetchSuccess,
                        onFailure: onStatistcsFetchFailure
                    };

                $scope.callAPI(RVGuestCardsSrv.fetchGuestCardStatisticsSummary, requestConfig);
            },
            // Load the statistic details for the given guest
            loadStatisticsDetails = function() {
                var onStatisticsDetailsFetchSuccess = function(data) {
                        $scope.statistics.details = data;
                        $scope.activeView = 'details';
                        refreshScroller();
                    },
                    onStatistcsDetailsFetchFailure = function() {
                        $scope.statistics.details = [];
                    },
                    requestConfig = {
                        params: {
                            year: $scope.filterData.selectedYear,
                            guestId: $scope.guestID
                        },
                        onSuccess: onStatisticsDetailsFetchSuccess,
                        onFailure: onStatistcsDetailsFetchFailure
                    };

                $scope.callAPI(RVGuestCardsSrv.fetchGuestCardStatisticsDetails, requestConfig);
            },
            // Set the listeners for the controller
            setListeners = function() {
                var statisticsTabActivateListener = $scope.$on('LOAD_GUEST_STATISTICS', function() {
                                                        loadStatisticsSummary();
                                                    });

                listeners.push(statisticsTabActivateListener);
            },
            // Destroy the listeners
            destroyListeners = function() {
                listeners.forEach( function ( listener ) {
                    $scope.$on('$destroy', listener);
                });
            };

        // Get icon class based on the variance value
        $scope.getStatusIconClass = function( value ) {
            var iconClass = 'neutral';

            if ( value < 0 ) {
                iconClass = 'icons time check-out rotate-right';
            } else if ( value > 0 ) {
                iconClass = 'icons time check-in rotate-right';
            }

            return iconClass;
        };

        // Get style class based on the variance value
        $scope.getStatusClass = function( value ) {
            var styleClass = '';

            if ( value > 0 ) {
                styleClass = 'green';
            } else if ( value < 0 ) {
                styleClass = 'red';
            }

            return styleClass;
        };

        // Set statistics tab active view - summary | details
        $scope.setActiveView = function( view ) {
            $scope.activeView = view;

            if ( view === 'details') {
                loadStatisticsDetails();
            } else {
                loadStatisticsSummary();
            }
        };

        $scope.getReservationClass = function(reservationStatus) {
            var class_ = '';

            switch (reservationStatus.toUpperCase()) {
                case "RESERVED":
                    class_ = 'arrival';
                    break;

                case "CHECKING_IN":
                    class_ = 'check-in';
                    break;

                case "CHECKEDIN":
                    class_ = 'inhouse';
                    break;

                case "CHECKING_OUT":
                    class_ = 'check-out';
                    break;

                case "CHECKEDOUT":
                    class_ = 'departed';
                    break;

                case "CANCELED":
                    class_ = 'cancel';
                    break;

                case "NOSHOW":
                case "NOSHOW_CURRENT":
                    class_ = 'no-show';
                    break;

                default:
                    class_ = '';
                    break;
            }
            return class_;
        };

        // Toggle the reservation list view displayed for a month
        $scope.showMonthlyReservations = function( monthlyData ) {
            monthlyData.isOpen = !monthlyData.isOpen;
        };

        // Get style for statistics details expanded view
        $scope.getStyleForExpandedView = function( monthlyData ) {
            var styleClass = {};                    

            if (monthlyData.isOpen) {
                var margin = monthlyData.reservations.length * 70 + 30;

                styleClass['margin-bottom'] = margin + 'px';
            }

            return styleClass;
        };

        $scope.onChangeYear = function() {
            if ($scope.activeView === 'summary') {
                loadStatisticsSummary();
            } else {
                loadStatisticsDetails();
            }
        };

        // Set the two scrollers in the screen
        var setScroller = function() {            
                var scrollerOptions = {
                    tap: true,
                    preventDefault: false                
                };

                $scope.setScroller(SIDEBAR_SCROLLER, scrollerOptions);
                $scope.setScroller(MONTHLY_DATA_SCROLLER, scrollerOptions);
            },
            // Refreshes the two scrollers in the screen
            refreshScroller = function() {
                $scope.refreshScroller(SIDEBAR_SCROLLER);
                $scope.refreshScroller(MONTHLY_DATA_SCROLLER);
            },
            // Get the current year
            getCurrentYear = function() {
                var businessDate = tzIndependentDate($rootScope.businessDate),
                    currentYear = businessDate.getFullYear();

                return currentYear;
            },
            // create the year dropdown options
            populateYearDropDown = function() {
                var startYear = $scope.guestCardData.contactInfo.first_stay_year,                    
                    currentYear = getCurrentYear();

                $scope.yearOptions = [];

                for (var i = currentYear - 1; i >= startYear; i--) {
                    $scope.yearOptions.push({
                       name: i === currentYear - 1 ? 'Last Year (' + i + ')' : i,
                       value: i
                    });
                }

            };

        // Initialize the controller
        var init = function() {
            $scope.activeView = "summary";
            $scope.statistics = {
                summary: {},
                details: []
            };
            $scope.guestID = $scope.guestCardData.userId;
            populateYearDropDown();
            setScroller();
            setListeners();
            destroyListeners();
            $scope.filterData = {
                selectedYear: getCurrentYear() - 1
            };

        };

        init();

    }]);