sntRover.controller('RVccTransactionsController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVccTransactionsSrv','$timeout','$window', function($scope, $filter,$stateParams, ngDialog, $rootScope, RVccTransactionsSrv, $timeout, $window) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading and browser title.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_CC_TRANSACTIONS'));
	$scope.setTitle($filter('translate')('MENU_CC_TRANSACTIONS'));

	$scope.data = {};
    $scope.data.activeTab = $stateParams.id == '' ? 0 : $stateParams.id;
    $scope.data.transactionDate = $rootScope.businessDate;
    
    $scope.data.isAuthToggleSummaryActive = true;
    $scope.data.isPaymentToggleSummaryActive = true;
	
	// Handling TransactionDate date picker click
	$scope.clickedTransactionDate = function(){
		$scope.popupCalendar('TRANSACTIONS');
	};

    // Handling TransactionDate date picker click
    $scope.clickedSubmitBatch = function(){
        var successCallBackSubmitBatch = function(data){
            $scope.$broadcast('showErrorMessage', "");
            $scope.$emit('hideLoader');
        };
        var failureCallBackSubmitBatch = function(data){
            $scope.$broadcast('showErrorMessage', data);
            $scope.$emit('hideLoader');
        };
        $scope.invokeApi(RVccTransactionsSrv.submitBatch, {}, successCallBackSubmitBatch,  failureCallBackSubmitBatch);
    };

	// Show calendar popup.
	$scope.popupCalendar = function(clickedOn) {
		$scope.clickedOn = clickedOn;
      	ngDialog.open({
	        template: '/assets/partials/financials/journal/rvJournalCalendarPopup.html',
	        controller: 'RVJournalDatePickerController',
	        className: 'single-date-picker',
	        scope: $scope
      	});
    };

    // Handle Tab switch
    $scope.activatedTab = function(index){
    	$scope.data.activeTab = index;
    };

    // Handle toggle button click
    $scope.toggleSummaryOrDeatils = function(){

        if($scope.data.activeTab == 0) {
            // for Payments screen
            $scope.data.isPaymentToggleSummaryActive = !$scope.data.isPaymentToggleSummaryActive;
        }
        else if($scope.data.activeTab == 1) {
            // for Authorization screen
            $scope.data.isAuthToggleSummaryActive = !$scope.data.isAuthToggleSummaryActive;
        }
    };

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
    $scope.printButtonClick = function(){

        // add the orientation
        addPrintOrientation();
        
        /*
         *  =====[ READY TO PRINT ]=====
         */
        // this will show the popup with full bill
        $timeout(function() {
            /*
             *  =====[ PRINTING!! JS EXECUTION IS PAUSED ]=====
             */

            $window.print();

            if ( sntapp.cordovaLoaded ) {
                cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
            };
        }, 100);

        /*
         *  =====[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]=====
         */

        // remove the orientation after similar delay
        $timeout(removePrintOrientation, 100);
    };

    
}]);