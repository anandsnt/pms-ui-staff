sntRover.controller('RVbillCardController',['$scope','$rootScope','$state','RVBillCardSrv','reservationBillData', function($scope,$rootScope,$state, RVBillCardSrv, reservationBillData){
	
	BaseCtrl.call(this, $scope);
	var countFeesElements = 0;//1 - For heading, 2 for totl fees and balance, 2 for guest balnce and creditcard
	var roomTypeDescriptionLength = parseInt(150); //Approximate height
	var billTabHeight = parseInt(35);
	var calenderDaysHeight = parseInt(35);
	var totalHeight = 0;
	$scope.init = function(reservationBillData){
		/*
		 * Adding biilValue and oldBillValue with data. Adding with each bills fees details
		 * To handle move to bill action
		 * Added same value to two different key because angular is two way binding
		 * Check in HTML moveToBillAction
		 */
		angular.forEach(reservationBillData.bills, function(value, key) {
			value.isOpenFeesDetails = false;
			if(key == 0){
				value.isOpenFeesDetails = true;
			}
	        angular.forEach(value.total_fees[0].fees_details, function(feesValue, feesKey) {
	        	feesValue.billValue = value.bill_number;//Bill value append with bill details
	        	feesValue.oldBillValue = value.bill_number;// oldBillValue used to identify the old billnumber
	     	});
	     });
		$scope.reservationBillData = reservationBillData;
		$scope.routingArrayCount = $scope.reservationBillData.routing_array.length;
		$scope.incomingRoutingArrayCount = $scope.reservationBillData.routing_array.length;
		//Variables used to calculate height of the wrapper.To do scroll refresh
		countFeesElements = parseInt(reservationBillData.bills[0].total_fees[0].fees_details.length)+parseInt(5);//1 - For heading, 2 for totl fees and balance, 2 for guest balnce and creditcard
		var totalHeight = parseInt(countFeesElements*64)+calenderDaysHeight+billTabHeight+roomTypeDescriptionLength;
		$scope.calculatedHeight = totalHeight;
	};
	$scope.init(reservationBillData);
	
	//Scope variable to set active bill
	$scope.currentActiveBill = 0;
	//Scope variable used for show/hide rate per day when clicks on each day in calender 
	$scope.dayRates = -1;
	//Scope variable used to show addon data
	$scope.showAddonIndex = -1;
	//Scope variable used to show group data
	$scope.showGroupItemIndex = -1;
	//Scope variable used to show room details
	$scope.showRoomDetailsIndex = -1;
	$scope.showActiveBillFeesDetails = 0;
	$scope.showFeesDetails = true;
	$scope.moveToBill = 0;
	/*
	 * Adding class for active bill
	 */
	$scope.showActiveBill = function(index){
		
		var activeBillClass = "";
		if(index == $scope.currentActiveBill){
			activeBillClass = "ui-tabs-active ui-state-active";
		}
		return activeBillClass;
	};
	/*
	 * Remove class hidden for day rates
	 * @param {int} index of calender days
	 * @param {string} clickedDate
	 * @param {string} checkoutDate
	 */
	$scope.showDayRates = function(dayIndex, clickedDate, checkoutDate){
		//In this condition show the last clicked days item 
		//OR if checkout date clicked first do not show anything
		if(clickedDate == checkoutDate){
			$scope.dayRates = $scope.dayRates;
		} else {
			$scope.dayRates = dayIndex;
		}
		
	};
	/*
	 * Set clicked bill active and show corresponding days/packages/addons calender
	 * @param {int} index of bill
	 */ 
	$scope.setActiveBill = function(billIndex){
		countFeesElements = parseInt(reservationBillData.bills[billIndex].total_fees[0].fees_details.length)+parseInt(5);//1 - For heading, 2 for totl fees and balance, 2 for guest balnce and creditcard
		totalHeight = parseInt(countFeesElements*64)+calenderDaysHeight+billTabHeight+roomTypeDescriptionLength;
		$scope.calculatedHeight = totalHeight;
		
		$scope.$parent.myScroll['registration-content'].refresh();
		$scope.currentActiveBill = billIndex;
		$scope.showActiveBillFeesDetails = billIndex;
	};
	/*
	 * Show Addons
	 * @param {int} addon index
	 */
	$scope.showAddons = function(addonIndex){
		$scope.showAddonIndex = addonIndex;
	};
	/*
	 * Show Group Items
	 * @param {int} group index
	 */
	$scope.showGroupItems = function(groupIndex){
		$scope.showGroupItemIndex = groupIndex;
	};
	/*
	 * Show Room Details 
	 * @param {int} each day room index
	 */
	$scope.showRoomDetails = function(roomDetailsIndex){
		//Condition added to do toggle action - Room details area
		if($scope.showRoomDetailsIndex == roomDetailsIndex){
			$scope.showRoomDetailsIndex = -1;
		} else {
			$scope.showRoomDetailsIndex = roomDetailsIndex;
		}
	};
	/*
	 * To get class of balance red/green
	 * @param {string} balance amount
	 */
	 $scope.getBalanceClass = function(balanceAmount){
	 	var balanceClass = "";
	 	if(balanceAmount == 0 || balanceAmount == "0.00" || balanceAmount == "0.0"){
	 		balanceClass = "green";
	 	} else  {
	 		balanceClass = "red";
	 	}
	 	return balanceClass;
	 };
	 /*
	  * To show not defined in payment display area
	  * @param {string} payment Type
	  */
	 $scope.showNotDefined = function(paymentType){
	 	var isShowNotDefined = true;
	 	if(paymentType == 'CC' || paymentType == 'CC' || paymentType == 'CC' || paymentType == 'CC'){
	 		isShowNotDefined = false;
	 	}
	 };
	 $scope.toggleFeesDetails = function(){
	 	
	 };
	 /*
	  * Success callback of fetch - After moving fees item from one bill to another
	  */
	 $scope.fetchSuccessCallback = function(data){
	 	$scope.$emit('hideLoader');
	 	$scope.init(data);
	 };
	 /*
	  * MOve fees item from one bill to another
	  * @param {int} old Bill Value
	  * @param {int} fees index
	  */
	 $scope.moveToBillAction = function(oldBillValue, feesIndex){
	 	var parseOldBillValue = parseInt(oldBillValue)-1;
		var newBillValue = $scope.reservationBillData.bills[parseOldBillValue].total_fees[0].fees_details[feesIndex].billValue;
		var transactionId = $scope.reservationBillData.bills[parseOldBillValue].total_fees[0].fees_details[feesIndex].transaction_id;
		var dataToMove = {
			"reservation_id" : $scope.reservationBillData.reservation_id,
			"to_bill" : newBillValue,
			"from_bill" : oldBillValue,
			"transaction_id" : transactionId
		};
		/*
		 * Success Callback of move action
		 */
		var moveToBillSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			//Fetch data again to refresh the screen with new data
			$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, $scope.fetchSuccessCallback);
		};
		$scope.invokeApi(RVBillCardSrv.movetToAnotherBill, dataToMove, moveToBillSuccessCallback);  
	 };
		
	 $scope.$parent.myScrollOptions = {		
		    'registration-content': {
		    	scrollbars: true,
		        snap: false,
		        hideScrollbar: false,
		        preventDefault: false
		    }
		};
	 $scope.$on('$viewContentLoaded', function() {
	
		setTimeout(function(){
			$scope.$parent.myScroll['registration-content'].refresh();
			
			}, 
		3000);
		
     });
		
}]);