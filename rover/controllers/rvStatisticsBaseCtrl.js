
window.StatisticsBaseCtrl = function ($scope, $rootScope) {

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

    // Calculates absolute value of a number
    $scope.absVal = function(val) {
        if ( val ) {
            return Math.abs(val);
        }
        return '';
    };

    // Get the current year
    $scope.getCurrentYear = function() {
        var businessDate = tzIndependentDate($rootScope.businessDate),
            currentYear = businessDate.getFullYear();

        return currentYear;
    };

    // Creates the year dropdown options
    $scope.populateYearDropDown = function(startYear) {
        var endYear,
            name = '';

        $scope.yearOptions = [];

        if ($scope.activeView === 'summary') {
            startYear = startYear === $scope.getCurrentYear() ? startYear - 1 : startYear;
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

    // Get style class based on reservation status
    $scope.getReservationClass = function(reservation) {
        var classes = {
            RESERVED: 'arrival',
            CHECKING_IN: 'check-in',
            CHECKEDIN: 'inhouse',
            CHECKING_OUT: 'check-out',
            CHECKEDOUT: 'departed',
            CANCELED: 'cancel',
            NOSHOW: 'no-show',
            NOSHOW_CURRENT: 'no-show'

        };
        
        return classes[reservation.reservation_status.toUpperCase()] || '';        
      };

};