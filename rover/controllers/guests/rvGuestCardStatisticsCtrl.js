angular.module('sntRover').controller("RVGuestCardStatisticsController", [
    '$scope',
    '$rootScope',
    'RVGuestCardsSrv',
    '$timeout',
    '$vault',
    '$state',
    '$stateParams',
    function ($scope, $rootScope, RVGuestCardsSrv, $timeout, $vault, $state, $stateParams) {
        var listeners = [];

        BaseCtrl.call(this, $scope);
        StatisticsBaseCtrl.call(this, $scope, $rootScope, $timeout);

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
                        $scope.statistics.details.monthly_data = $scope.statistics.details.monthly_data.reverse();
                        $timeout(function() {
                            $scope.reloadScroller();
                            
                        }, 500);
                        $scope.isScrollReady();
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
                                                    }),
                    contactInfoUpdateListener = $scope.$on('UPDATE_CONTACT_INFO', function() {
                                                    setUpData();    
                                                });

                listeners.push(statisticsTabActivateListener);
                listeners.push(contactInfoUpdateListener);
            },
            // Destroy the listeners
            destroyListeners = function() {
                listeners.forEach( function ( listener ) {
                    $scope.$on('$destroy', listener);
                });
            };

        // Set statistics tab active view - summary | details
        $scope.setActiveView = function(view, year) {
            $scope.activeView = view;

            if ( view === 'details') {
                $scope.filterData.selectedYear =  year || $scope.getCurrentYear();
                populateYearDropDown();
                loadStatisticsDetails();
            } else {
                $scope.filterData.selectedYear =  $scope.getCurrentYear() - 1;
                populateYearDropDown();
                loadStatisticsSummary();
            }
        };

        // Toggle the reservation list view displayed for a month
        $scope.showMonthlyReservations = function( monthlyData ) {
            if (_.isEmpty(monthlyData.reservations)) {
                return false;
            }
            monthlyData.isOpen = !monthlyData.isOpen;
            $timeout(function() {
                $scope.reloadScroller();
                
            }, 100);
        };

        // Handles the year dropdown change
        $scope.onChangeYear = function() {
            if ($scope.activeView === 'summary') {
                loadStatisticsSummary();
            } else {
                loadStatisticsDetails();
            }
        };

        // Navigate to staycard
        $scope.navigateToStayCard = function(reservation) {
            if ($state.current.name !== 'rover.guest.details') {
                return false;
            }

            $vault.set('guestId', $scope.guestCardData.userId);
            $vault.set('selectedYear', $scope.filterData.selectedYear);
            $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                id: reservation.reservation_id,
                confirmationId: reservation.confirmation_no,
                isrefresh: true,
                isFromGuestStatistics: true
            });
        };

        // Checks whether the navigation to the staycard should be shown or not in the details screen
        $scope.shouldShowNavigation = function() {
            var shouldHide = true;

            if ($state.current.name === 'rover.guest.details') {
                shouldHide = false;
            }
            return shouldHide;
        };

        // create the year dropdown options
        var populateYearDropDown = function() {
                $scope.populateYearDropDown($scope.guestCardData.contactInfo.first_stay_year); 
            },
            // Set up the data required during initialization
            setUpData = function() {
                $scope.activeView = "summary";
                $scope.statistics = {
                    summary: {},
                    details: []
                };
                $scope.guestID = $scope.guestCardData.userId;
                $scope.filterData = {
                    selectedYear: $scope.getCurrentYear() - 1  
                };
                $scope.currentYear = $scope.getCurrentYear();
                populateYearDropDown();                
            };

        // Initialize the controller
        var init = function() {
            setUpData();
            $scope.configureScroller();
            $scope.isScrollReady();
            setListeners();
            destroyListeners();

            if ($stateParams.isBackToStatistics) {
                $scope.filterData.selectedYear = $stateParams.selectedStatisticsYear ? $stateParams.selectedStatisticsYear : $scope.filterData.selectedYear;
                $scope.setActiveView('details', $scope.filterData.selectedYear);
            }
            
        };
        
        init();

    }]);