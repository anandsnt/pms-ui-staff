sntRover.controller('RVJournalPrintController', ['$scope','$rootScope','$timeout','$window',function($scope,$rootScope,$timeout,$window) {
	BaseCtrl.call(this, $scope);

	/** Code for PRINT BOX drawer common Resize Handler starts here .. **/
	var resizableMinHeight = 0;
	var resizableMaxHeight = 90;
	$scope.eventTimestamp = '';
	$scope.data.printBoxHeight = resizableMinHeight;
	// Drawer resize options.
	$scope.resizableOptions = {
		minHeight: resizableMinHeight,
		maxHeight: resizableMaxHeight,
		handles: 's',
		resize: function(event, ui) {
			var height = $(this).height();
			if (height > 5){
				$scope.data.isDrawerOpened = true;
				$scope.data.printBoxHeight = height;
			}
			else if(height < 5){
				$scope.closeDrawer();
			}
		},
		stop: function(event, ui) {
			preventClicking = true;
			$scope.eventTimestamp = event.timeStamp;
		}
	};
	
	// To handle click on drawer handle - open/close.
	$scope.clickedDrawer = function($event){
		$event.stopPropagation();
		$event.stopImmediatePropagation();
		if(getParentWithSelector($event, document.getElementsByClassName("ui-resizable-handle")[0])){
			if(parseInt($scope.eventTimestamp)) {
				if(($event.timeStamp - $scope.eventTimestamp)<2){
					return;
				}
			}
			if($scope.data.printBoxHeight == resizableMinHeight || $scope.data.printBoxHeight == resizableMaxHeight) {
				if ($scope.data.isDrawerOpened)	$scope.closeDrawer();
				else $scope.openDrawer();
			}
			else{
				// mid way click : close guest card
				$scope.closeDrawer();
			}
		}
	};

	// To open the Drawer
	$scope.openDrawer = function(){
		$scope.data.printBoxHeight = resizableMaxHeight;
		$scope.data.isDrawerOpened = true;
	};

	// To close the Drawer
	$scope.closeDrawer = function(){
		$scope.data.printBoxHeight = resizableMinHeight;
		$scope.data.isDrawerOpened = false;
	};

	$scope.$on("CLOSEPRINTBOX",function(){
		$scope.closeDrawer();
	});

	/** Code for Resize Handler ends here ..  **/

	/** Code for Revenue Tab - PRINT BOX - filters  starts here .. **/

	// On changing charge group on PRINT filter
	$scope.chargeGroupChanged = function(){
		
		$scope.data.activeChargeCodes = [];

		angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {
			
			if(charge_groups.id == $scope.data.selectedChargeGroup){
				
				if(charge_groups.show){
					charge_groups.show = true;
					charge_groups.filterFlag = true;
					angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {
						if(charge_codes.show){
							charge_codes.filterFlag = true;
							var obj = { "id": charge_codes.id , "name": charge_codes.name };
		       				$scope.data.activeChargeCodes.push(obj);
	       				}
					});
				}
				else{
					charge_groups.filterFlag = false;
					console.log("not found");
				}
			}
			else if($scope.data.selectedChargeGroup == 'ALL'){
				charge_groups.filterFlag = true;
			}
			else{
				charge_groups.filterFlag = false;
			}
       	});
       	$scope.data.selectedChargeCode = 'ALL';
	};

	// On changing charge code on PRINT filter
	$scope.chargeCodeChanged = function(){

		angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {

			angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {

				if((charge_codes.id == $scope.data.selectedChargeCode) || ($scope.data.selectedChargeCode == 'ALL')){

					if(charge_codes.show) {
						charge_codes.filterFlag = true;
						charge_groups.active = true;
					}
					else{
						charge_codes.filterFlag = false;
					}

					$scope.toggleRevenueTransactions();
				}
				else{
					charge_codes.filterFlag = false;
				}
			});
       	});
	};

	$scope.toggleRevenueTransactions = function(){
		if($scope.data.isRevenueToggleSummaryActive)
			$scope.showRevenueByLevels(true,true,false);
		else
			$scope.showRevenueByLevels(true,true,true);
	};

	// To handle Summary/Details toggle button click - REVENUE
	$scope.toggleSummaryOrDeatilsRevenue = function(){
		$rootScope.$broadcast('REFRESHREVENUECONTENT');
		$scope.data.isRevenueToggleSummaryActive = !$scope.data.isRevenueToggleSummaryActive;
		$scope.toggleRevenueTransactions();
	};

	$scope.togglePaymentTransactions = function(){
		if($scope.data.isPaymentToggleSummaryActive)
			$scope.showPaymentByLevels(true,true,false);
		else
			$scope.showPaymentByLevels(true,true,true);
	};

	// To handle Summary/Details toggle button click - PAYMENT
	$scope.toggleSummaryOrDeatilsPayment = function(){
		$rootScope.$broadcast('REFRESHPAYMENTCONTENT');
		$scope.data.isPaymentToggleSummaryActive = !$scope.data.isPaymentToggleSummaryActive;
		$scope.togglePaymentTransactions();
	};

	/*
     *	To hanlde show/hide each Levels on Revenue list.
	 */
	$scope.showRevenueByLevels = function(level1,level2,level3){
		// Adding Show status flag to each item.
		angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {
			
            angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {
            	
            	if(level3 && charge_codes.filterFlag){
            		charge_codes.active = true;
            		charge_groups.active = true;
            	}
            	else{
            	 	charge_codes.active = false;
            	}
            });
        });
	};

	/** Code for Revenue Tab - PRINT BOX - filters ends here ..   **/

	/** Code for Payment Tab - PRINT BOX - filters starts here .. **/
	$scope.paymentTypeChanged = function(){

		angular.forEach($scope.data.paymentData.payment_types,function(payment_types, index1) {

			if(($scope.data.selectedPaymentType == 'ALL') || (payment_types.id == $scope.data.selectedPaymentType)) {
				payment_types.show 	 = true ;
				payment_types.active = true ;
	        }
	        else{
	        	payment_types.show 	 = false ;
	        	payment_types.active = false ;
	        }
        });
	};

	/*
     *	To hanlde show/hide each Levels on payments list.
	 */
	$scope.showPaymentByLevels = function(level1,level2,level3){
		// Adding Show status flag to each item.
		angular.forEach($scope.data.paymentData.payment_types,function(payment_types, index1) {
			
			if((level1 && $scope.data.selectedPaymentType == 'ALL') || (level1 && $scope.data.selectedPaymentType == payment_types.id)){
				payment_types.show = true; 
				payment_types.active = true ;
			}
			else{
				payment_types.show = false;
				payment_types.active = false ;
			}

			if(payment_types.payment_type == "Credit Card"){
	            angular.forEach(payment_types.credit_cards,function(credit_cards, index2) {
	            	
	            	if(level2){
	            		credit_cards.show = true;
	            		credit_cards.active = true;
	            	}
	            	else{
	            		credit_cards.show = false;
	            		credit_cards.active = false;
	            	}

	                angular.forEach(credit_cards.transactions,function(transactions, index3) {
	                	
	                	if(level3) credit_cards.active = true;
	                	else credit_cards.active = false;
	                });
	            });
        	}
        });
	};

	/** Code for Payment Tab - PRINT BOX - filters ends here .. **/


	/** PRINT Functionality **/

	$scope.printRevenue = function(){
		console.log("printRevenue");
		printJournal();
	};

	$scope.printPayment = function(){
		console.log("printPayment");
		printJournal();
	};

	$scope.printCashier = function(){
		console.log("printCashier");
		printJournal();
	};

	// print the journal page
	var printJournal = function() {
		
		/*
		 *	=====[ READY TO PRINT ]=====
		 */
		// this will show the popup with full bill
	    $timeout(function() {
	    	/*
	    	 *	=====[ PRINTING!! JS EXECUTION IS PAUSED ]=====
	    	 */

	        $window.print();

	        if ( sntapp.cordovaLoaded ) {
	            cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
	        };
	    }, 100);

	    /*
	     *	=====[ PRINTING COMPLETE. JS EXECUTION WILL COMMENCE ]=====
	     */
	};


}]);