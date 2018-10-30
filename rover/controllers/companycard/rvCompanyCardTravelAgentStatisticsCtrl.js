angular.module('sntRover').controller("RVCompanyCardTravelAgentStatisticsController", [
    '$scope',    
    '$rootScope',
    'RVCompanyCardSrv',
    '$timeout',
    '$vault',
    '$state',
    '$stateParams',
    function ($scope, $rootScope, RVCompanyCardSrv, $timeout, $vault, $state, $stateParams) {
        var listeners = [];

        BaseCtrl.call(this, $scope);
        StatisticsBaseCtrl.call(this, $scope, $rootScope, $timeout);        

        // Load the cc/ta statistics summary
        var loadStatisticsSummary = function() {
                var onStatisticsFetchSuccess = function(data) {
                        $scope.statistics.summary = data;
                    },
                    onStatistcsFetchFailure = function() {
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
            loadStatisticsDetails = function() {
                var onStatisticsDetailsFetchSuccess = function(data) {
                        $scope.statistics.details = data;
                        $scope.statistics.details.monthly_data = $scope.statistics.details.monthly_data.reverse();
                        $scope.reloadScroller();
                    },
                    onStatistcsDetailsFetchFailure = function() {
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
            setListeners = function() {
                var statisticsTabActivateListener = $scope.$on('LOAD_STATISTICS', function() {
                                                        loadStatisticsSummary();
                                                    }),
                    contactInfoUpdateListener = $scope.$on('UPDATE_CONTACT_INFO', function() {
                                                    init();    
                                                });

                listeners.push(statisticsTabActivateListener);
                listeners.push(contactInfoUpdateListener);
            },
            // Destroy the listeners
            destroyListeners = function() {
                listeners.forEach( function ( listener ) {
                    $scope.$on('$destroy', listener);
                });
            },
            // Get account id
            getAccountId = function() {
                var id = '';

                if ($scope.contactInformation &&  $scope.contactInformation.id) {
                    id = $scope.contactInformation.id;
                }
                if (!id) {
                    id = $stateParams.id;
                }               
                return id;
            };

        // Set statistics tab active view - summary | details
        $scope.setActiveView = function( view ) {
            $scope.activeView = view;

            if ( view === 'details') {
                $scope.filterData.selectedYear =  $scope.getCurrentYear();
                $scope.configureScroller();
                $scope.isScrollReady();
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
            $scope.reloadScroller();
        };

        // Processes the year change event
        $scope.onChangeYear = function() {
            if ($scope.activeView === 'summary') {
                loadStatisticsSummary();
            } else {
                loadStatisticsDetails();
            }
        };

        // create the year dropdown options
        var populateYearDropDown = function() {
            $scope.populateYearDropDown($scope.contactInformation.first_stay_year);
        };

        // Navigate to staycard
        $scope.navigateToStayCard = function(reservation) {
            if ($state.current.name !== 'rover.companycarddetails') {
                return false;
            }

            $vault.set('cardId', $scope.accountId);
            $vault.set('type', $scope.contactInformation.account_details.account_type);
            $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                id: reservation.reservation_id,
                confirmationId: reservation.confirmation_no,
                isrefresh: true,
                isFromCardStatistics: true
            });
        };

        // Checks whether the navigation to the staycard should be shown or not in the details screen
        $scope.shouldShowNavigation = function() {
            var shouldHide = true;

            if ($state.current.name === 'rover.companycarddetails') {
                shouldHide = false;
            }
            return shouldHide;
        };


        // Initialize the controller
        var init = function() {
            $scope.activeView = "summary";
            $scope.statistics = {
                summary: {},
                details: {}
            };
            $scope.accountId = getAccountId();
            $scope.filterData = {
                selectedYear: $scope.getCurrentYear() - 1  
            };

            $scope.currentYear = $scope.getCurrentYear();

            if ($stateParams.isBackFromStaycard) {
                $scope.setActiveView('summary');
            }            
            populateYearDropDown();
            $scope.configureScroller();
            $scope.isScrollReady();
            setListeners();
            destroyListeners();
        };

        init();

    }]);