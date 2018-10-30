
var StatisticsBaseCtrl = function ($scope, $rootScope, $timeout) {
    var SIDEBAR_SCROLLER = 'sidebarScroller',
        MONTHLY_DATA_SCROLLER = 'monthlyDataScroller';
        
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

    // Get style for statistics details expanded view
    $scope.getStyleForExpandedView = function( monthlyData ) {
        var styleClass = {};                    

        if (monthlyData.isOpen) {
            var margin = monthlyData.reservations.length * 70 + 30;

            styleClass['margin-bottom'] = margin + 'px';
        }
        return styleClass;
    };

    // Calculates absolute value of a number
    $scope.absVal = function(val) {
        if ( val ) {
            return Math.abs(val);
        }
        return '';
    };

    // Configure the left and right scroller
    $scope.configureScroller = function() {            
        $scope.setScroller(SIDEBAR_SCROLLER, {
            'preventDefault': false,
            'probeType': 3
        });

        $scope.setScroller(MONTHLY_DATA_SCROLLER, {
            'preventDefault': false,
            'probeType': 3,
            'scrollX': true
        });
    };

    // Refreshes the two scrollers in the screen
    $scope.reloadScroller = function() {
        $timeout(function() {
            $scope.refreshScroller(SIDEBAR_SCROLLER);
            $scope.refreshScroller(MONTHLY_DATA_SCROLLER);
        }, 200);                
    };

    // Get the current year
    $scope.getCurrentYear = function() {
        var businessDate = tzIndependentDate($rootScope.businessDate),
            currentYear = businessDate.getFullYear();

        return currentYear;
    };

    // Set up scroll listeners for left and right pane
    $scope.setUpScrollListner = function() {
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
    };
    // Check whether scroll is ready
    $scope.isScrollReady = function () {
        if ( $scope.myScroll.hasOwnProperty(SIDEBAR_SCROLLER) && $scope.myScroll.hasOwnProperty(MONTHLY_DATA_SCROLLER) ) {
            $scope.setUpScrollListner();
        } else {
            $timeout($scope.isScrollReady, 1000);
        }
    };

    // Creates the year dropdown options
    $scope.populateYearDropDown = function(startYear) {
        var endYear,
            name = '';

        $scope.yearOptions = [];

        if ($scope.activeView === 'summary') {
            endYear = $scope.getCurrentYear() - 1;
        } else {
            endYear = $scope.getCurrentYear();
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

};