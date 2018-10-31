
var StatisticsBaseCtrl = function ($scope, $rootScope) {

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
        startYear = startYear === $scope.getCurrentYear() ? startYear - 1 : startYear;

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

    // Get style class based on reservation status
    $scope.getReservationClass = function(reservation) {
        var className = '', 
            rStatus = reservation.reservation_status.toUpperCase();
  
        switch (rStatus) {
          case 'RESERVED':
            className = 'arrival';
            break;
  
          case 'CHECKING_IN':
            className = 'check-in';
            break;
  
          case 'CHECKEDIN':
            className = 'inhouse';
            break;
  
          case 'CHECKING_OUT':
            className = 'check-out';
            break;
  
          case 'CHECKEDOUT':
            className = 'departed';
            break;
  
          case 'CANCELED':
            className = 'cancel';
            break;
  
          case 'NOSHOW':
          case 'NOSHOW_CURRENT':
            className = 'no-show';
            break;
  
          default:
            className = '';
            break;
        }
  
        return className;
      };

};