sntRover.controller('RVbillCardController',['$scope','$rootScope','$state','$stateParams','RVBillCardSrv','reservationBillData', 'RVReservationCardSrv', 'RVChargeItems', 'ngDialog','$filter','$window', function($scope,$rootScope,$state,$stateParams, RVBillCardSrv, reservationBillData, RVReservationCardSrv, RVChargeItems, ngDialog, $filter, $window){
	
	BaseCtrl.call(this, $scope);
	var countFeesElements = 0;//1 - For heading, 2 for total fees and balance, 2 for guest balance and creditcard
	var roomTypeDescriptionLength = parseInt(150); //Approximate height
	var billTabHeight = parseInt(35);
	var calenderDaysHeight = parseInt(35);
	var totalHeight = 0;
	$scope.clickedButton = $stateParams.clickedButton;
	console.log($scope.clickedButton);
	$scope.saveData = {};
	$scope.saveData.promotions = false;
	$scope.saveData.termsAndConditions = false;
	//options fo signature plugin
	var screenWidth = angular.element($window).width(); // Calculating screen width.
	$scope.signaturePluginOptions = {
			height : 130,
			width : screenWidth-60,
			lineWidth : 1
	};
	
	// $scope.heading = $filter('translate')('VIEW_BILL_TITLE');
	$scope.$emit('HeaderChanged', $filter('translate')('VIEW_BILL_TITLE'));
	$scope.init = function(reservationBillData){
		/*
		 * Adding billValue and oldBillValue with data. Adding with each bills fees details
		 * To handle move to bill action
		 * Added same value to two different key because angular is two way binding
		 * Check in HTML moveToBillAction
		 */
		angular.forEach(reservationBillData.bills, function(value, key) {
			//To handle fees open/close
			value.isOpenFeesDetails = false;
			if(key == 0){
				value.isOpenFeesDetails = true;
			}
			value.hasFeesArray = true;
			if(value.total_fees.length > 0){
				value.hasFeesArray = false;
				angular.forEach(value.total_fees[0].fees_details, function(feesValue, feesKey) {
		        	feesValue.billValue = value.bill_number;//Bill value append with bill details
		        	feesValue.oldBillValue = value.bill_number;// oldBillValue used to identify the old billnumber
		     	});	
			}
	        
	     });
	     // console.log(JSON.stringify(reservationBillData));
		$scope.reservationBillData = reservationBillData;
		$scope.routingArrayCount = $scope.reservationBillData.routing_array.length;
		$scope.incomingRoutingArrayCount = $scope.reservationBillData.incoming_routing_array.length;
		//Variables used to calculate height of the wrapper.To do scroll refresh
		if(reservationBillData.bills[0].total_fees.length > 0){
			countFeesElements = parseInt(reservationBillData.bills[0].total_fees[0].fees_details.length)+parseInt(5);//1 - For heading, 2 for totl fees and balance, 2 for guest balnce and creditcard
		} else {
			countFeesElements = parseInt(5);
		}
		
		var totalHeight = parseInt(countFeesElements*67)+calenderDaysHeight+billTabHeight+roomTypeDescriptionLength;
		$scope.calculatedHeight = totalHeight;
	};
	$scope.init(reservationBillData);
	$scope.setNightsString = function(){
		return (reservationBillData.number_of_nights > 1)?$filter('translate')('NIGHTS'):$filter('translate')('NIGHT');
	};
	
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
	//Variable used to show signed signature
	$scope.showSignedSignature = false;
	$scope.showBillingInfo = false;
	$scope.showIncomingBillingInfo = false;
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
	$scope.showDayRates = function(dayIndex, clickedDate, checkoutDate, numberOfNights){
		//In this condition show the last clicked days item 
		//OR if checkout date clicked first do not show anything
		if(clickedDate == checkoutDate){
			if(numberOfNights == 0){
				$scope.dayRates = dayIndex;
			} else {
				$scope.dayRates = $scope.dayRates;
			}
			
		} else if($scope.dayRates != dayIndex) {
			$scope.dayRates = dayIndex;
		}else{
			$scope.dayRates = -1;
		}
		$scope.showAddonIndex = -1;
		$scope.showGroupItemIndex = -1;
		$scope.calculateHeightAndRefreshScroll();
		
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
		$scope.calculateHeightAndRefreshScroll();
	};
	/*
	 * Show Addons
	 * @param {int} addon index
	 */
	$scope.showAddons = function(addonIndex){
		$scope.showAddonIndex = ($scope.showAddonIndex != addonIndex)?addonIndex:-1;
		$scope.dayRates = -1;
		$scope.showGroupItemIndex = -1;
		$scope.calculateHeightAndRefreshScroll();
	};
	/*
	 * Show Group Items
	 * @param {int} group index
	 */
	$scope.showGroupItems = function(groupIndex){
		$scope.dayRates = -1;
		$scope.showGroupItemIndex = ($scope.showGroupItemIndex != groupIndex)?groupIndex:-1;
		$scope.showAddonIndex = -1;
		$scope.calculateHeightAndRefreshScroll();
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
		$scope.calculateHeightAndRefreshScroll();
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
	 $scope.toggleFeesDetails = function(billIndex){
	 	 $scope.reservationBillData.bills[billIndex].isOpenFeesDetails = !$scope.reservationBillData.bills[billIndex].isOpenFeesDetails;
	 	 $scope.calculateHeightAndRefreshScroll();
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
	 /*
	  * To add class active if fees is open
	  * @param {bool} - new data added along with bill data for each bill 
	  */
	 $scope.showFeesDetailsOpenClose = function(openCloseStatus){
	 	 var openCloseClass = ""; 
	     if(openCloseStatus){
	     	 openCloseClass = "active";
	     }
	     return openCloseClass;
	 };
	 /*
	  * To show/hide fees details on click arrow
	  */
	 $scope.showFeesDetailsClass = function(showFeesStatus){
	 	 var showFeesClass = "hidden"; 
	     if(showFeesStatus){
	     	 showFeesClass = "";
	     }
	     return showFeesClass;
	 };
	 /*
	  * Show guest balance OR balance depends on reservation status
	  * @param {string} reservation status
 	  */
	 $scope.showGuestBalance = function(reservationStatus){
	 	 var showGuestBalance = false;
	 	 if(reservationStatus == 'CHECKING_IN' || reservationStatus == 'NOSHOW_CURRENT'){
	 	 	showGuestBalance = true;
	 	 }
	 	 return showGuestBalance;
	 };
	 $scope.addNewPaymentModal = function(data){
	 	if(data === undefined){
  	 			var passData = {
			 		"reservationId": $scope.reservationBillData.reservation_id,
			 		"fromView": "billcard",
			 		"fromBill" : $scope.currentActiveBill,
			 		"is_swiped": false 
			 	};
			 	var paymentData = $scope.reservationBillData;
			 	$scope.showAddNewPaymentModal(passData, paymentData);
  	 	} else {
  	 		
  	 		
           var  getTokenFrom = {
	              'et2': data.RVCardReadTrack2,
	              'ksn': data.RVCardReadTrack2KSN,
	              'pan': data.RVCardReadMaskedPAN
	           };
         
         	var tokenizeSuccessCallback = function(tokenData){
         		data.token = tokenData;
         		var passData = {
		  	 		"reservationId": $scope.reservationBillData.reservation_id,
		  	 		"fromView": "billcard",
		  	 		"credit_card": data.RVCardReadCardType,
		  	 		"card_number": "xxxx-xxxx-xxxx-"+tokenData.slice(-4),
		  	 		"name_on_card": data.RVCardReadCardName,
		  	 		"card_expiry":data.RVCardReadExpDate,
		  	 		"et2": data.RVCardReadTrack2,
	             	 'ksn': data.RVCardReadTrack2KSN,
	              	'pan': data.RVCardReadMaskedPAN,
	              	'token': tokenData,
	              	"fromBill" : $scope.currentActiveBill,
		  	 		"is_swiped": true   // Commenting for now
		  	 	};
	         	var paymentData = $scope.reservationBillData;
	  	 		$scope.showAddNewPaymentModal(passData, paymentData);
         	};
         	$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);	
  	 	}
	 	
	 	
	 	
	 };
	 /*
	  * To show vertical scroll
	  */
	 $scope.$parent.myScrollOptions = {		
		    'registration-content': {
		    	scrollbars: true,
		        snap: false,
		        hideScrollbar: false,
		        preventDefault: false
		    }
	 };
	 /*
	  * Refresh scroll once page is loaded.
	  */
	 $scope.$on('$viewContentLoaded', function() {
		setTimeout(function(){
			$scope.$parent.myScroll['registration-content'].refresh();
			}, 
		3000);
     });
     
     
     /*
	  * Handle swipe action in bill card
	  */
	 $scope.$on('SWIPEHAPPENED', function(event, data){
	 	if(!$scope.isGuestCardVisible){
	 		$scope.addNewPaymentModal(data);
	 	}
	 });
	 /*
	  * Toggle signature display
	  */
	 $scope.showSignature = function(){
	 	$scope.showSignedSignature = !$scope.showSignedSignature;
	 };
	 /*
	  * Show the payment list of guest card for selection
	  */
	 $scope.showPaymentList = function(){
	 	$scope.reservationBillData.currentView = "billCard";
	 	$scope.reservationBillData.currentActiveBill = $scope.currentActiveBill;
	 	$scope.$emit('SHOWPAYMENTLIST', $scope.reservationBillData);
	 };
	 

	$scope.openPostCharge = function() {

		// pass on the reservation id
		$scope.reservation_id = $scope.reservationBillData.reservation_id;

		var callback = function(data) {
		    $scope.$emit( 'hideLoader' );

		    $scope.fetchedData = data;

    		ngDialog.open({
        		template: '/assets/partials/postCharge/postCharge.html',
        		controller: 'RVPostChargeController',
        		scope: $scope
        	});
		};

		$scope.invokeApi(RVChargeItems.fetch, $scope.reservation_id, callback);
	};

	// just fetch the bills again ;)
	var postchargeAdded = $scope.$on('postcharge.added', function(event, netPrice) {
		
		// cos' we are gods, and this is what we wish
		// just kidding.. :P
		$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, $scope.fetchSuccessCallback);
	});

	// the listner must be destroyed when no needed anymore
	$scope.$on( '$destroy', postchargeAdded );

	$scope.closeDialog = function() {
		ngDialog.close();
	};
	$scope.getRoomClass =  function(reservationStatus, roomStatus, foStatus){
		var roomClass = "";
		if(reservationStatus == "CHECKING_IN"){
			if(roomStatus == "READY" && foStatus== "VACANT"){
				roomClass = "ready";
			} else {
				roomClass = "not-ready";
			}
		} 
		return roomClass;
	};
	$scope.showDays = function(date, checkoutDate, numberOfNights, place){
		var showDay = false;
		if(place == 'checkout'){
			if(date == checkoutDate && numberOfNights != 0){
				showDay = true;
			}
		} else {
			if(date == checkoutDate && numberOfNights == 0){
				showDay = true;
			} else if(date != checkoutDate){
				showDay = true;
			}
		}
		return showDay;
		
	};
	$scope.getDaysClass = function(index, dayDate, checkinDate, checkoutDate, businessDate){
		var dayClass = "";
		if(index!=0){
			dayClass = "hidden";
		}
		if(dayDate == checkinDate){
			dayClass = "check-in active";
		}
		if(dayDate != checkoutDate){
			if(dayDate <= businessDate){
				dayClass = "active";
			}
		}
		if(dayDate == checkoutDate){
			if(businessDate <= dayDate){
				dayClass = "check-out last";
			}
		}
		return dayClass;
	};
	$scope.showBillingInfoHandle = function(){
		$scope.showBillingInfo = !$scope.showBillingInfo;
	};
	$scope.showIncomingBillingInfoHandle = function(){
		$scope.showIncomingBillingInfo = !$scope.showIncomingBillingInfo ;
	};
	
	
	
	
	
	$scope.calculateHeightAndRefreshScroll = function(){
		 
		var height = 0;
		if($scope.reservationBillData.bills[$scope.currentActiveBill].isOpenFeesDetails){
			if(reservationBillData.bills[$scope.currentActiveBill].total_fees.length > 0){
				countFeesElements = parseInt(reservationBillData.bills[$scope.currentActiveBill].total_fees[0].fees_details.length)+parseInt(7);
			}
			
			height = parseInt(height) + parseInt(countFeesElements*67);
		}
		if($scope.showRoomDetailsIndex!=-1){
			height = parseInt(height) + parseInt(billTabHeight) + parseInt(roomTypeDescriptionLength);
		}
		$scope.routingArrayCount = $scope.reservationBillData.routing_array.length;
		
		if($scope.routingArrayCount>0){
			height = parseInt(height) + parseInt($scope.routingArrayCount * 25);
		}
		if($scope.incomingRoutingArrayCount>0){
			height = parseInt(height) + parseInt($scope.incomingRoutingArrayCount * 25);
		}
		// if()
		// var totalHeight = calenderDaysHeight+billTabHeight+roomTypeDescriptionLength;
		$scope.calculatedHeight = height;
		setTimeout(function(){
			$scope.$parent.myScroll['registration-content'].refresh();
			}, 
		600);
		
	};
	// To enable scroll
	$scope.enableScroll = function(){
		$scope.$parent.myScroll['registration-content'].enable();
	};
	// To disable scroll
	$scope.disableScroll = function(){
		$scope.$parent.myScroll['registration-content'].disable();
		// Adding class 'pad' for styling the cursor for signature pad on initial hover on signature pad.
		if(!angular.element($("#signature canvas")).hasClass('pad')){
			angular.element($("#signature canvas")).addClass('pad');
		}
	};
	// To clear signature
	$scope.clickedClearSignature = function(){
		$("#signature").jSignature("clear");	// Against angular js practice ,TODO: check proper solution using ui-jq to avoid this.
	};
	$scope.completeCheckinSuccessCallback = function(){
		if($scope.reservationBillData.key_settings == "email"){
			ngDialog.open({
        		template: '/assets/partials/validateCheckin/rvKeyEmailModal.html',
        		controller: 'RVKeyEmailCtrl',
        		scope: $scope
        	});
		}
	};
	// To handle complete checkin button click
	$scope.clickedCompleteCheckin = function(){
		// Against angular js practice ,TODO: check proper solution using ui-jq to avoid this.
		var signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
		
		var errorMsg = "";
		if(signatureData == "[]" && $scope.reservationBillData.required_signature_at == "CHECKIN"){
			console.log("---------------");
			errorMsg = "Signature is missing";
			$scope.errorMessage = [errorMsg];
		} else if(!$scope.saveData.termsAndConditions){
			errorMsg = "Please check agree to the Terms & Conditions";
			$scope.errorMessage = [errorMsg];
		} else {
			if($scope.saveData.promotions && $scope.guestCardData.contactInfo.email == ''){
				ngDialog.open({
	        		template: '/assets/partials/validateCheckin/rvAskEmailFromCheckin.html',
	        		controller: 'RVValidateEmailPhoneCtrl',
	        		scope: $scope
	        	});
			} else {
				
				
				var data = {
					"is_promotions_and_email_set" : $scope.saveData.promotions,
					"signature" : signatureData,
					"reservation_id" : $scope.reservationBillData.reservation_id	
				};
				
				$scope.invokeApi(RVBillCardSrv.completeCheckin, data, $scope.completeCheckinSuccessCallback);
			
			}
		}
	};
		//{'hidden': $parent.$index!='0', 'check-in':days.date == reservationBillData.checkin_date,'active': days.date != reservationBillData.checkout_date, 'check-out': days.date == reservationBillData.checkout_date, 'last': days.date == reservationBillData.checkout_date}
}]);