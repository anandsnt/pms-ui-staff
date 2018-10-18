angular.module('sntRover').controller("RVCompanyCardTravelAgentStatisticsController", [
    '$scope',    
    '$rootScope',
    'RVCompanyCardSrv',
    '$timeout',
    '$vault',
    '$state',
    '$stateParams',
    function ($scope, $rootScope, RVCompanyCardSrv, $timeout, $vault, $state, $stateParams) {
        // BaseCtrl.call(this, $scope);

        // const SIDEBAR_SCROLLER = 'sidebarScroller';
        // const MONTHLY_DATA_SCROLLER = 'monthlyDataScroller';

        // var listeners = [];

        // // Load the guest card statistics summary
        // var loadStatisticsSummary = function() {
        //         var onStatisticsFetchSuccess = function(data) {
        //                 $scope.statistics.summary = data;
        //                 $scope.activeView = 'summary';
        //             },
        //             onStatistcsFetchFailure = function() {
        //                 $scope.statistics.summary = {};
        //             },
        //             requestConfig = {
        //                 params: {},
        //                 onSuccess: onStatisticsFetchSuccess,
        //                 onFailure: onStatistcsFetchFailure
        //             };

        //         $scope.callAPI(RVGuestCardsSrv.fetchCompanyTravelAgentStatisticsSummary, requestConfig);
        //     },
        //     // Load the statistic details for the given guest
        //     loadStatisticsDetails = function() {
        //         var onStatisticsDetailsFetchSuccess = function(data) {
        //                 $scope.statistics.details = data;
        //                 $scope.activeView = 'details';
        //                 refreshScroller();
        //             },
        //             onStatistcsDetailsFetchFailure = function(error) {
        //                 $scope.statistics.details = [];
        //             },
        //             requestConfig = {
        //                 params: {},
        //                 onSuccess : onStatisticsDetailsFetchSuccess,
        //                 onFailure: onStatistcsDetailsFetchFailure
        //             };

        //         $scope.callAPI(RVGuestCardsSrv.fetchCompanyTravelAgentStatisticsDetails, requestConfig);
        //     },
        //     // Set the listeners for the controller
        //     setListeners = function() {
        //         var statisticsTabActivateListener = $scope.$on('LOAD_STATISTICS', function() {
        //                                                 loadStatisticsSummary();
        //                                             });

        //         listeners.push(statisticsTabActivateListener);
        //     },
        //     // Destroy the listeners
        //     destroyListeners = function() {
        //         listeners.forEach( function ( listener ) {
        //             $scope.$on('$destroy', listener);
        //         });
        //     };

        // // Get icon class based on the variance value
        // $scope.getStatusIconClass = function( value ) {
        //     var iconClass = 'neutral';

        //     if ( value < 0 ) {
        //         iconClass = 'icons time check-out rotate-right';
        //     } else if ( value > 0 ) {
        //         iconClass = 'icons time check-in rotate-right';
        //     }

        //     return iconClass;
        // };

        // // Get style class based on the variance value
        // $scope.getStatusClass = function( value ) {
        //     var styleClass = '';

        //     if ( value > 0 ) {
        //         styleClass = 'green';
        //     } else if ( value < 0 ) {
        //         styleClass = 'red';
        //     }

        //     return styleClass;
        // };

        // // Set statistics tab active view - summary | details
        // $scope.setActiveView = function( view ) {
        //     if ( view === 'details') {
        //         loadStatisticsDetails();
        //     } else {
        //         loadStatisticsSummary();
        //     }
        // };

        // $scope.getReservationClass = function(reservationStatus) {
        //     var class_ = '';

        //     switch (reservationStatus.toUpperCase()) {
        //         case "RESERVED":
        //             class_ = 'arrival';
        //             break;

        //         case "CHECKING_IN":
        //             class_ = 'check-in';
        //             break;

        //         case "CHECKEDIN":
        //             class_ = 'inhouse';
        //             break;

        //         case "CHECKING_OUT":
        //             class_ = 'check-out';
        //             break;

        //         case "CHECKEDOUT":
        //             class_ = 'departed';
        //             break;

        //         case "CANCELED":
        //             class_ = 'cancel';
        //             break;

        //         case "NOSHOW":
        //         case "NOSHOW_CURRENT":
        //             class_ = 'no-show';
        //             break;

        //         default:
        //             class_ = '';
        //             break;
        //     }
        //     return class_;
        // };

        // // Toggle the reservation list view displayed for a month
        // $scope.showMonthlyReservations = function( monthlyData ) {
        //     monthlyData.isOpen = !monthlyData.isOpen;
        // };

        // // Get style for statistics details expanded view
        // $scope.getStyleForExpandedView = function( monthlyData ) {
        //     var styleClass = {};                    

        //     if (monthlyData.isOpen) {
        //         var margin = monthlyData.reservations.length * 70 + 30;

        //         styleClass['margin-bottom'] = margin + 'px';
        //     }

        //     return styleClass;
        // };

        // // Set the two scrollers in the screen
        // var setScroller = function() {            
        //         var scrollerOptions = {
        //             tap: true,
        //             preventDefault: false                
        //         };

        //         $scope.setScroller(SIDEBAR_SCROLLER, scrollerOptions);
        //         $scope.setScroller(MONTHLY_DATA_SCROLLER, scrollerOptions);
        //     },
        //     // Refreshes the two scrollers in the screen
        //     refreshScroller = function() {
        //         $scope.refreshScroller(SIDEBAR_SCROLLER);
        //         $scope.refreshScroller(MONTHLY_DATA_SCROLLER);
        //     };

        // // Initialize the controller
        // var init = function() {
        //     $scope.activeView = "summary";
        //     $scope.statistics = {
        //         summary: {},
        //         details: []
        //     };
        //     setScroller();
        //     setListeners();
        //     destroyListeners();

        // };

        // init();
        BaseCtrl.call(this, $scope);

        var SIDEBAR_SCROLLER = 'sidebarScroller',
            MONTHLY_DATA_SCROLLER = 'monthlyDataScroller';

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
                            accountId: $scope.accountId
                        },
                        onSuccess: onStatisticsFetchSuccess,
                        onFailure: onStatistcsFetchFailure
                    };

                $scope.callAPI(RVCompanyCardSrv.fetchCompanyTravelAgentStatisticsSummary, requestConfig);
            },
            // Load the statistic details for the given guest
            loadStatisticsDetails = function() {
                var onStatisticsDetailsFetchSuccess = function(data) {
                        $scope.statistics.details = data;
                        refreshScroller();
                    },
                    onStatistcsDetailsFetchFailure = function() {
                        $scope.statistics.details = [];
                    },
                    requestConfig = {
                        params: {
                            year: $scope.filterData.selectedYear,
                            accountId: $scope.accountId
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
                                                    populateYearDropDown();
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
                $scope.filterData.selectedYear =  getCurrentYear();
                setScroller();
                isScrollReady();
                populateYearDropDown();
                loadStatisticsDetails();
            } else {
                $scope.filterData.selectedYear =  getCurrentYear() - 1;
                populateYearDropDown();
                loadStatisticsSummary();
            }
        };

        // Get the class name based on the guest status
        $scope.getReservationClass = function(reservationStatus) {
            var className = '';

            switch (reservationStatus.toUpperCase()) {
                case "RESERVED":
                    className = 'arrival';
                    break;

                case "CHECKING_IN":
                    className = 'check-in';
                    break;

                case "CHECKEDIN":
                    className = 'inhouse';
                    break;

                case "CHECKING_OUT":
                    className = 'check-out';
                    break;

                case "CHECKEDOUT":
                    className = 'departed';
                    break;

                case "CANCELED":
                    className = 'cancel';
                    break;

                case "NOSHOW":
                case "NOSHOW_CURRENT":
                    className = 'no-show';
                    break;

                default:
                    className = '';
                    break;
            }
            return className;
        };

        // Toggle the reservation list view displayed for a month
        $scope.showMonthlyReservations = function( monthlyData ) {
            monthlyData.isOpen = !monthlyData.isOpen;
            refreshScroller();
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

        // Set up the two scrollers in the screen
        var setScroller = function() {            
                $scope.setScroller(SIDEBAR_SCROLLER, {
                    'preventDefault': false,
                    'probeType': 3
                });
    
                $scope.setScroller(MONTHLY_DATA_SCROLLER, {
                    'preventDefault': false,
                    'probeType': 3,
                    'scrollX': true
                });
                
            },
            // Refreshes the two scrollers in the screen
            refreshScroller = function() {
                $timeout(function() {
                    $scope.refreshScroller(SIDEBAR_SCROLLER);
                    $scope.refreshScroller(MONTHLY_DATA_SCROLLER);
                }, 200);                
            },
            // Get the current year
            getCurrentYear = function() {
                var businessDate = tzIndependentDate($rootScope.businessDate),
                    currentYear = businessDate.getFullYear();

                return currentYear;
            },
            // Set up scroll listeners for left and right pane
            setUpScrollListner = function() {
                $scope.myScroll[ SIDEBAR_SCROLLER ]
                    .on('scroll', function() {
                        $scope.myScroll[ MONTHLY_DATA_SCROLLER ]
                            .scrollTo( 0, this.y );
                    });

                $scope.myScroll[ MONTHLY_DATA_SCROLLER ]
                    .on('scroll', function() {
                        $scope.myScroll[ SIDEBAR_SCROLLER ]
                            .scrollTo( 0, this.y );
                    });
            },
            // Check whether scroll is ready
            isScrollReady = function isScrollReady () {
                if ( $scope.myScroll.hasOwnProperty(SIDEBAR_SCROLLER) && $scope.myScroll.hasOwnProperty(MONTHLY_DATA_SCROLLER) ) {
                    setUpScrollListner();
                } else {
                    $timeout(isScrollReady, 1000);
                }
            },
            // create the year dropdown options
            populateYearDropDown = function() {
                var startYear = $scope.contactInformation.first_stay_year,                    
                    currentYear = getCurrentYear(),
                    endYear,
                    name = '';

                $scope.yearOptions = [];

                if ($scope.activeView === 'summary') {
                    endYear = getCurrentYear() - 1;
                } else {
                    endYear = getCurrentYear();
                }

                for (var i = endYear; i >= startYear; i--) {
                    if (i === endYear) {
                        if ($scope.activeView === 'summary') {
                            name = 'LAST YEAR (' + i + ')';
                        } else {
                            name = 'YEAR TO DATE (' + i + ')';
                        }

                    } else {
                        name = i;
                    }
                    $scope.yearOptions.push({
                       name: name,
                       value: i
                    });
                }

            };
        
        
        
        // Calculates absolute value of a number
        $scope.absVal = function(val) {
            if ( val ) {
                return Math.abs(val);
            }
            return '';
        };

        // Navigate to staycard
        $scope.navigateToStayCard = function(reservation) {
            $vault.set('guestId', $scope.guestCardData.userId);
            $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
                id: reservation.reservation_id,
                confirmationId: reservation.confirmation_no,
                isrefresh: true,
                isFromGuestStatistics: true
            });
        };

        // Initialize the controller
        var init = function() {
            $scope.activeView = "summary";
            $scope.statistics = {
                summary: {},
                details: []
            };
            $scope.accountId = $stateParams.id;
            $scope.filterData = {
                selectedYear: getCurrentYear() - 1  
            };

            if ($stateParams.isBackToStatistics) {
                $scope.setActiveView('summary');
            }            
            populateYearDropDown();
            setScroller();
            isScrollReady();
            setListeners();
            destroyListeners();

        };

        init();

    }]);