sntRover.controller('RVCcPrintTransactionsController', ['$scope', '$rootScope', '$timeout', '$window', function($scope, $rootScope, $timeout, $window) {
	BaseCtrl.call(this, $scope);

	/** Code for PRINT BOX drawer common Resize Handler starts here .. **/
	var resizableMinHeight = 0;
	var resizableMaxHeight = 90;

	$scope.eventTimestamp = '';
	$scope.data.printBoxHeight = resizableMinHeight;

  // Checks height on drag-to-resize and opens or closes drawer.
  var heightChecker = function(height) {
    if (height > 5) {
      $scope.data.isDrawerOpened = true;
      $scope.data.printBoxHeight = height;
      $scope.$apply();
    }
    else if(height < 5) {
      $scope.closeDrawer();
    }
  };
	// Drawer resize options.

	$scope.resizableOptions = {
		minHeight: resizableMinHeight,
		maxHeight: resizableMaxHeight,
		handles: 's',
		resize: function(event, ui) {
			var height = $(this).height();

      heightChecker(height);
		},
		stop: function(event, ui) {
      var height = $(this).height();

			preventClicking = true;
			$scope.eventTimestamp = event.timeStamp;
      heightChecker(height);
		}
	};

	// To handle click on drawer handle - open/close.
	$scope.clickedDrawer = function($event) {
		$event.stopPropagation();
		$event.stopImmediatePropagation();
		if(getParentWithSelector($event, document.getElementsByClassName("ui-resizable-handle")[0])) {
			if(parseInt($scope.eventTimestamp)) {
				if(($event.timeStamp - $scope.eventTimestamp)<2) {
					return;
				}
			}
			if($scope.data.printBoxHeight === resizableMinHeight || $scope.data.printBoxHeight === resizableMaxHeight) {
				if ($scope.data.isDrawerOpened)	{
					$scope.closeDrawer();
				}
				else {
					$scope.openDrawer();
				}
			}
			else{
				// mid way click : close guest card
				$scope.closeDrawer();
			}
		}
	};

	// To open the Drawer
	$scope.openDrawer = function() {
		$scope.data.printBoxHeight = resizableMaxHeight;
		$scope.data.isDrawerOpened = true;
	};

	// To close the Drawer
	$scope.closeDrawer = function() {
		$scope.data.printBoxHeight = resizableMinHeight;
		$scope.data.isDrawerOpened = false;
	};

	$scope.$on("CLOSEPRINTBOX", function() {
		$scope.closeDrawer();
	});

    // Add the print orientation before printing
    var addPrintOrientation = function() {
        var orientation = 'portrait';

        switch( $scope.data.activeTab ) {
            case 0:
                orientation = 'landscape';
                break;
            case 1:
                orientation = 'landscape';
                break;
            default:
                orientation = 'portrait';
                break;
        }

        $( 'head' ).append( "<style id='print-orientation'>@page { size: " + orientation + "; }</style>" );
    };

    // Add the print orientation after printing
    var removePrintOrientation = function() {
        $( '#print-orientation' ).remove();
    };

    // To print the screen
    $scope.printButtonClick = function() {

        // add the orientation
        addPrintOrientation();

        /*
         *  ======[ READY TO PRINT ]======
         */
        // this will show the popup with full bill
        $timeout(function() {
            /*
             *  ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
             */

            $window.print();

            if ( sntapp.cordovaLoaded ) {
                cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
            }
        }, 100);

        /*
         *  ======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
         */

        // remove the orientation after similar delay
        $timeout(removePrintOrientation, 100);
    };

}]);