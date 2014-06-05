sntRover.controller('RVbillCardController',['$scope','$state','RVBillCardSrv','reservationBillData', function($scope,$state, RVBillCardSrv, reservationBillData){
	
	BaseCtrl.call(this, $scope);
	$scope.reservationBillData = reservationBillData;
	$scope.routingArrayCount = $scope.reservationBillData.routing_array.length;
	$scope.incomingRoutingArrayCount = $scope.reservationBillData.routing_array.length;
	//Variables used to calculate height of the wrapper.To do scroll refresh
	var countFeesElements = parseInt(reservationBillData.bills[0].total_fees[0].fees_details.length)+parseInt(5);//1 - For heading, 2 for totl fees and balance, 2 for guest balnce and creditcard
	var roomTypeDescriptionLength = parseInt(150); //Approximate height
	var billTabHeight=parseInt(35);
	var calenderDaysHeight=parseInt(35);
	var totalHeight = parseInt(countFeesElements*64)+calenderDaysHeight+billTabHeight+roomTypeDescriptionLength;
	$scope.calculatedHeight = totalHeight;
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