sntRover.controller('RVJournalPrintController', ['$scope',function($scope) {
	BaseCtrl.call(this, $scope);

	$scope.data.isRevenueToggleSummaryActive = true;
	$scope.data.isPaymentToggleSummaryActive = true;

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
		console.log("chargeGroupSelected"+$scope.data.selectedChargeGroup);
		$scope.data.activeChargeCodes = [];
		angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {
			if(charge_groups.id == $scope.data.selectedChargeGroup){
				charge_groups.show = true;
				angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {
					var obj = { "id": charge_codes.id , "name": charge_codes.name };
       				$scope.data.activeChargeCodes.push(obj);
				});
			}
			else if($scope.data.selectedChargeGroup == 'ALL'){
				charge_groups.show = true;
			}
			else{
				charge_groups.show = false;
			}
       	});
       	$scope.data.selectedChargeCode = 'ALL';
       	console.log($scope.data.revenueData.charge_groups);
	};
	// On changing charge code on PRINT filter
	$scope.chargeCodeChanged = function(){
		console.log("chargeCodeChanged"+$scope.data.selectedChargeCode);

		angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {

			angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {

				if(charge_codes.id == $scope.data.selectedChargeCode){
					charge_codes.show = true;
				}
				else if($scope.data.selectedChargeCode == 'ALL'){
					charge_codes.show = true;
				}
				else{
					charge_codes.show = false;
				}
			});
       	});

       	console.log($scope.data.revenueData.charge_groups);
	};

	// To handle Summary/Details toggle button click - REVENUE
	$scope.toggleSummaryOrDeatilsRevenue = function(){
		if($scope.data.isRevenueToggleSummaryActive){
			console.log("REVENUE Summary filter");
			$scope.showByLevels(true,true,true);
		}
		else{
			console.log("REVENUE Details filter");
			$scope.showByLevels(true,true,false);
		}
		$scope.data.isRevenueToggleSummaryActive = !$scope.data.isRevenueToggleSummaryActive ;
	};
	// To handle Summary/Details toggle button click - PAYMENT
	$scope.toggleSummaryOrDeatilsPayment = function(){
		if($scope.data.isPaymentToggleSummaryActive){
			console.log("PAYMENT Summary filter");
		}
		else{
			console.log("PAYMENT Details filter");
		}
		$scope.data.isPaymentToggleSummaryActive = !$scope.data.isPaymentToggleSummaryActive ;
	};

	$scope.showByLevels = function(level1,level2,level3){
		// Adding Show status flag to each item.
		angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {
			
			if((level1 && $scope.data.selectedChargeGroup == 'ALL') || (level1 && $scope.data.selectedChargeGroup == charge_groups.id)) 
				charge_groups.show = true ;
			else
				charge_groups.show = false ;

            angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {
            	
            	if((level2 && $scope.data.selectedChargeCode == 'ALL') || (level2 && $scope.data.selectedChargeCode == charge_codes.id ))
            		charge_codes.show = true ;
            	else
            		charge_codes.show = false ;

                angular.forEach(charge_codes.transactions,function(transactions, index3) {
                	
                	if(level3) transactions.show = true;
                	else transactions.show = false ;
                });
            });
        });
	};

	/** Code for Revenue Tab - PRINT BOX - filters ends here .. **/

}]);