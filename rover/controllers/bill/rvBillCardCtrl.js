
sntRover.controller('RVbillCardController',['$scope','$rootScope','$state','$stateParams','RVBillCardSrv','reservationBillData', 'RVReservationCardSrv', 'RVChargeItems', 'ngDialog','$filter','$window', '$timeout','chargeCodeData', function($scope,$rootScope,$state,$stateParams, RVBillCardSrv, reservationBillData, RVReservationCardSrv, RVChargeItems, ngDialog, $filter, $window, $timeout,chargeCodeData){

	
	BaseCtrl.call(this, $scope);

	// set a back button on header
	$rootScope.setPrevState = {
		title: $filter('translate')('STAY_CARD'),
		callback: 'goBackToStayCard',
		scope: $scope
	};
	
	var countFeesElements = 0;//1 - For heading, 2 for total fees and balance, 2 for guest balance and creditcard
	var roomTypeDescriptionLength = parseInt(100); //Approximate height
	var billTabHeight = parseInt(35);
	var calenderDaysHeight = parseInt(35);
	var totalHeight = 0;
	var addOnExpandedHeight = 0;
	var groupItemExpandedHeight = 0;
	$scope.clickedButton = $stateParams.clickedButton;
	$scope.saveData = {};
	$scope.saveData.promotions = reservationBillData.is_promotions_and_email_set;
	$scope.saveData.termsAndConditions = false;
	$scope.reviewStatusArray = [];
	$scope.isAllBillsReviewed = false;
	$scope.saveData.isEarlyDepartureFlag = false;
	$scope.saveData.isEmailPopupFlag = false;
	$scope.calculatedWidth = 0;
	$scope.isRefreshOnBackToStaycard = false;
	$scope.paymentModalOpened = false;
	$scope.showPayButton = false;
	$scope.paymentModalSwipeHappened = false;
	if($rootScope.isStandAlone){
		$scope.showPayButton = true;
	}
	//This value changes when clicks on pay button
	$scope.fromViewToPaymentPopup = "billcard";
	//options fo signature plugin
	var screenWidth = angular.element($window).width(); // Calculating screen width.
	$scope.signaturePluginOptions = {
			height : 130,
			width : screenWidth-60,
			lineWidth : 1
	};
	width = 0;

	if($scope.clickedButton == "checkoutButton"){
		$scope.$emit('HeaderChanged', $filter('translate')('GUEST_BILL_TITLE'));
		$scope.setTitle($filter('translate')('GUEST_BILL_TITLE'));
	} else if($scope.clickedButton == "checkinButton"){
		$scope.$emit('HeaderChanged', $filter('translate')('REGISTRATION'));
		$scope.setTitle($filter('translate')('REGISTRATION'));
	}
	else{
		$scope.$emit('HeaderChanged', $filter('translate')('GUEST_BILL_TITLE'));
		$scope.setTitle($filter('translate')('GUEST_BILL_TITLE'));
	}
	
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
	        
	        var data = {};
			data.reviewStatus = false;
			data.billNumber = value.bill_number;
			data.billIndex = key;
			$scope.reviewStatusArray.push(data);
			
	     });
	     if($scope.clickedButton == "checkinButton"){
	     	setTimeout(function(){
	     		$scope.openPleaseSwipe();
	        }, 200);
	    };
		$scope.reservationBillData = reservationBillData;
		$scope.routingArrayCount = $scope.reservationBillData.routing_array.length;
		$scope.incomingRoutingArrayCount = $scope.reservationBillData.incoming_routing_array.length;
		
		$timeout(function(){
     		$scope.calculateHeightAndRefreshScroll();
        }, 500);
		
	};
	$scope.init(reservationBillData);
	$scope.openPleaseSwipe = function(){
		ngDialog.open({
    		template: '/assets/partials/payment/rvPleaseSwipeModal.html',
    		controller: 'RVPleaseSwipeCtrl',
    		className: 'ngdialog-theme-default1 calendar-single1',
    		scope: $scope
    	});
	};
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
	
	 width = parseInt(width)+parseInt(reservationBillData.bills[$scope.currentActiveBill].days.length*100)+parseInt(85);//85-Add button
     if(reservationBillData.bills[$scope.currentActiveBill].addons != undefined){
    	width = parseInt(width)+parseInt(reservationBillData.bills[$scope.currentActiveBill].addons.length*70);
     }
     if(reservationBillData.bills[$scope.currentActiveBill].group_items != undefined){
    	width = parseInt(width)+parseInt(reservationBillData.bills[$scope.currentActiveBill].group_items.length*70);
     }
		
	$scope.calculatedWidth = width;
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
			roomTypeDescriptionLength = 0;
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
		
		$scope.currentActiveBill = billIndex;
		$scope.showActiveBillFeesDetails = billIndex;
		$scope.calculateHeightAndRefreshScroll();
	};
	/*$state
	 * Show Addons
	 * @param {int} addon index
	 */
	$scope.showAddons = function(addonIndex){
		$scope.showAddonIndex = ($scope.showAddonIndex != addonIndex)?addonIndex:-1;
		$scope.dayRates = -1;
		$scope.showGroupItemIndex = -1;
		var addonCount = reservationBillData.bills[$scope.currentActiveBill].addons[addonIndex].expense_details.length;
		addOnExpandedHeight = parseInt(addonCount*35 + 60);
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
		var groupItemCount = reservationBillData.bills[$scope.currentActiveBill].group_items[groupIndex].expense_details.length;
		groupItemExpandedHeight = parseInt(groupItemCount*35 + 60);
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
	 	//Current active bill is index - adding 1 to get billnumber
	 	var billNumber = parseInt($scope.currentActiveBill)+parseInt(1);
	 	if(data === undefined){
	 		   
  	 			var passData = {
			 		"reservationId": $scope.reservationBillData.reservation_id,
			 		"fromView": $scope.fromViewToPaymentPopup,
			 		"fromBill" : billNumber,
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
         		//Below code used for closing please swipe modal popup
         		$scope.closeDialog();
         		data.token = tokenData;
         		var passData = {
		  	 		"reservationId": $scope.reservationBillData.reservation_id,
		  	 		"fromView": $scope.fromViewToPaymentPopup,
		  	 		"credit_card": data.RVCardReadCardType,
		  	 		"card_number": "xxxx-xxxx-xxxx-"+tokenData.slice(-4),
		  	 		"name_on_card": data.RVCardReadCardName,
		  	 		"card_expiry":data.RVCardReadExpDate,
		  	 		"et2": data.RVCardReadTrack2,
	             	 'ksn': data.RVCardReadTrack2KSN,
	              	'pan': data.RVCardReadMaskedPAN,
	              	'token': tokenData,
	              	"fromBill" : billNumber,
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
	 $scope.setScroller('registration-content');
	 $scope.setScroller('billDays');
	 
	 /*
	  * Refresh scroll once page is loaded.
	  */
	 $scope.$on('$viewContentLoaded', function() {
		setTimeout(function(){
			$scope.refreshScroller('registration-content');
			$scope.refreshScroller('billDays');
			}, 
		3000);
     });
     
     
     /*
	  * Handle swipe action in bill card
	  */
	 $scope.$on('SWIPEHAPPENED', function(event, data){
	 	if(!$scope.isGuestCardVisible){
	 		if($scope.paymentModalOpened){
	 			$scope.paymentModalSwipeHappened = true;
	 			$scope.$broadcast('PAYMENTSWIPEHAPPENED', data);
	 		} else {
	 			$scope.fromViewToPaymentPopup = "billcard";
	 			$scope.addNewPaymentModal(data);
	 		}
	 		
	 	}
	 });
	 /*
	  * Clicked pay button function
	  */
	 $scope.clickedPayButton = function(){

	 	// $scope.fromViewToPaymentPopup = "paybutton";
	 	// $scope.addNewPaymentModal();
	 	$scope.paymentModalOpened = true;
	 	
	 	 ngDialog.open({
              template: '/assets/partials/pay/rvPaymentModal.html',
              className: 'ngdialog-theme-default1 modal-theme1',
              controller: 'RVBillPayCtrl',
              closeByDocument: false,
              scope: $scope
          });
	 };
	 $scope.clickedAddUpdateCCButton = function(){
	 	$scope.fromViewToPaymentPopup = "billcard";
	 	$scope.addNewPaymentModal();
	 };
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
	 

	$scope.openPostCharge = function(activeBillNo) {

		// pass on the reservation id
		$scope.reservation_id = $scope.reservationBillData.reservation_id;

		// pass down active bill no
		$scope.passActiveBillNo = activeBillNo;

		// translating this logic as such from old Rover
		// api post param 'fetch_total_balance' must be 'false' when posted from 'staycard'
		$scope.fetchTotalBal = false;

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
		$scope.isRefreshOnBackToStaycard = true;
		$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, $scope.fetchSuccessCallback);
	}); 
    
    /*
	 * Go back to staycard - Depends on changes in bill do refresh or not
	 */
    $scope.goBackToStayCard = function() {
    	var reservationId = $scope.reservationBillData.reservation_id,
    		confirmationNumber = $scope.reservationBillData.confirm_no;

    	if( $scope.isRefreshOnBackToStaycard ) {
    		$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {"id" : reservationId, "confirmationId": confirmationNumber, "isrefresh": true});
    	} else {
    		$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {"id" : reservationId, "confirmationId": confirmationNumber});
    	}
    };

	// the listner must be destroyed when no needed anymore
	$scope.$on( '$destroy', postchargeAdded );

	$scope.closeDialog = function() {
		ngDialog.close();
	};


	
	/*
	 * Used to add class with respect to different status
	 * @param {string} reservationStatus
	 * @param {string} room status
	 * @param {string} fo status
	 */
	$scope.getRoomClass = function(reservationStatus, roomStatus, foStatus, roomReadyStatus, checkinInspectedOnly){
		var reservationRoomStatusClass = "";
		if(reservationStatus == 'CHECKING_IN'){
			
			if(roomReadyStatus!=''){
				if(foStatus == 'VACANT'){
					switch(roomReadyStatus) {

						case "INSPECTED":
							reservationRoomStatusClass = ' room-green';
							break;
						case "CLEAN":
							if (checkinInspectedOnly == "true") {
								reservationRoomStatusClass = ' room-orange';
								break;
							} else {
								reservationRoomStatusClass = ' room-green';
								break;
							}
							break;
						case "PICKUP":
							reservationRoomStatusClass = " room-orange";
							break;
			
						case "DIRTY":
							reservationRoomStatusClass = " room-red";
							break;

		        }
				
				} else {
					reservationRoomStatusClass = "room-red";
				}
				
			}
		} 
		return reservationRoomStatusClass;
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
		if(dayDate == checkoutDate && dayDate != checkinDate){
			if(reservationBillData.bills[$scope.currentActiveBill].addons != undefined && reservationBillData.bills[$scope.currentActiveBill].addons.length >0){
				dayClass = "check-out last";
			} else {
				dayClass = "check-out";
			}
		}
		return dayClass;
	};
	$scope.showBillingInfoHandle = function(){
		$scope.showBillingInfo = !$scope.showBillingInfo;
		$scope.calculateHeightAndRefreshScroll();
	};
	$scope.showIncomingBillingInfoHandle = function(){
		$scope.showIncomingBillingInfo = !$scope.showIncomingBillingInfo ;
		$scope.calculateHeightAndRefreshScroll();
	};
	

	
	
	/*
	 * calculate Height of bill screen
	 */

	$scope.calculateHeightAndRefreshScroll = function() {
		 
		var height = 0;
		var width = 0;
		if($scope.reservationBillData.bills[$scope.currentActiveBill].isOpenFeesDetails){
			//height = parseInt(height) + parseInt(41);//For table title
			if(reservationBillData.bills[$scope.currentActiveBill].total_fees.length > 0){
				countFeesElements = parseInt(reservationBillData.bills[$scope.currentActiveBill].total_fees[0].fees_details.length)+parseInt(5);
			}
			height = parseInt(height) + parseInt(countFeesElements*73.5);
			if(reservationBillData.bills[$scope.currentActiveBill].total_fees[0] && reservationBillData.bills[$scope.currentActiveBill].total_fees[0].total_amount){
				height = parseInt(height) + parseInt(45);
			}
			if(reservationBillData.bills[$scope.currentActiveBill].total_fees[0] && reservationBillData.bills[$scope.currentActiveBill].total_fees[0].balance_amount){
				height = parseInt(height) + parseInt(45);
			}
		}
		else{
			//If Total fees toggle is closed.
			height = parseInt(height) + parseInt(150);
		}
		if($scope.dayRates!=-1){
			height = parseInt(height) + parseInt(50);
		}
		if($scope.showRoomDetailsIndex!=-1){
			height = parseInt(height) + parseInt(roomTypeDescriptionLength);
		}
		if($scope.showAddonIndex!=-1){
			height = parseInt(height) + parseInt(addOnExpandedHeight);
		}
		if($scope.showGroupItemIndex!=-1){
			height = parseInt(height) + parseInt(groupItemExpandedHeight);
		}
		if($scope.clickedButton == "checkinButton" || $scope.clickedButton == "checkoutButton"){
			height = parseInt(height) + parseInt(50);//For checkin or checkout buttons
			if((parseInt(reservationBillData.bills.length)-1) == $scope.currentActiveBill && $scope.reservationBillData.required_signature_at !== "NO_SIGNATURE"){
				//For siganture Pad.
				if($scope.reservationBillData.bills[$scope.currentActiveBill].isOpenFeesDetails) height = parseInt(height) + parseInt(200);
	     		else height = parseInt(height) + parseInt(350);
	     	}
	    };
	    if($scope.showBillingInfo){
	        var routingLength =	($scope.reservationBillData.routing_array.length*32);
	    	height = parseInt(height) + parseInt(routingLength) + parseInt(30);
	    }
	    if($scope.showIncomingBillingInfo){
	        var routingLength =	($scope.reservationBillData.incoming_routing_array.length*32);
	    	height = parseInt(height) + parseInt(routingLength) + parseInt(30);
	    }
	    width = parseInt(width)+parseInt(reservationBillData.bills[$scope.currentActiveBill].days.length*100)+parseInt(85);//85-Add button
	    if(reservationBillData.bills[$scope.currentActiveBill].addons != undefined){
	    	width = parseInt(width)+parseInt(reservationBillData.bills[$scope.currentActiveBill].addons.length*70);
	    }
	     if(reservationBillData.bills[$scope.currentActiveBill].group_items != undefined){
	    	width = parseInt(width)+parseInt(reservationBillData.bills[$scope.currentActiveBill].group_items.length*70);
	    }
		$scope.calculatedHeight = height;
		
		$scope.calculatedWidth = width;
		
		$timeout(function(){
			$scope.refreshScroller('registration-content');
			$scope.refreshScroller('billDays');
			}, 
		1000);
		
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
	/*
	 * success callback ofcomplete checkin
	 */
	$scope.completeCheckinSuccessCallback = function(){

		$scope.$emit('hideLoader');
				
		var keySettings = $scope.reservationBillData.key_settings;
		$scope.fromView = "checkin";
		//show email popup
		if(keySettings === "email"){
			
			ngDialog.open({
				 template: '/assets/partials/keys/rvKeyEmailPopup.html',
				 controller: 'RVKeyEmailPopupController',
				 className: 'ngdialog-theme-default1',
				 closeByDocument: false,
				 scope: $scope
			});
		}
		else if(keySettings === "qr_code_tablet"){
			
			ngDialog.open({
				 template: '/assets/partials/keys/rvKeyQrcodePopup.html',
				 controller: 'RVKeyQRCodePopupController',
				 className: 'ngdialog-theme-default1',
				 closeByDocument: false,
				 scope: $scope
			});
		}
		
		//Display the key encoder popup
		else if(keySettings === "encode"){
			ngDialog.open({
			    template: '/assets/partials/keys/rvKeyEncodePopup.html',
			    controller: 'RVKeyEncodePopupCtrl',
			    className: 'ngdialog-theme-default1',
			    closeByDocument: false,
			    scope: $scope
			});
		}
	};

	$scope.completeCheckinFailureCallback = function(data){

		$scope.$emit('hideLoader');
		$scope.errorMessage = data;
	};
	// To handle complete checkin button click
	$scope.clickedCompleteCheckin = function(){
		// Against angular js practice ,TODO: check proper solution using ui-jq to avoid this.
		var signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
		
		var errorMsg = "";
		if(signatureData == "[]" && $scope.reservationBillData.required_signature_at == "CHECKIN"){
			errorMsg = "Signature is missing";
			$scope.showErrorPopup(errorMsg);
		} else if(!$scope.saveData.termsAndConditions){
			errorMsg = "Please check agree to the Terms & Conditions";
			$scope.showErrorPopup(errorMsg);
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
				$scope.invokeApi(RVBillCardSrv.completeCheckin, data, $scope.completeCheckinSuccessCallback, $scope.completeCheckinFailureCallback);
			
			}
		}
	};
	// To handle success callback of complete checkout
	$scope.completeCheckoutSuccessCallback = function(response){
		$scope.$emit('hideLoader');
		$scope.showSuccessPopup(response);
	};
	// To handle failure callback of complete checkout
	$scope.completeCheckoutFailureCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.errorMessage = data;
	};
	// To handle complete checkout button click
	$scope.clickedCompleteCheckout = function() {

		
		$scope.findNextBillToReview();	// Verifying wheather any bill is remaing for reviewing.

		if(!$scope.isAllBillsReviewed){
			return;
		}
		
		// Against angular js practice ,TODO: check proper solution using ui-jq to avoid this.
		var signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
		var errorMsg = "";
		var totalBal = 0;

		// calculate total
		for (var i = 0; i < reservationBillData.bills.length; i++) {
			var bill = reservationBillData.bills[i];
			totalBal += bill.total_amount * 1;
		};
		
		if(!$scope.guestCardData.contactInfo.email && !$scope.saveData.isEmailPopupFlag){
			// Popup to accept and save email address.
			$scope.callBackMethodCheckout = function(){
				$scope.saveData.isEmailPopupFlag = true ;
				$scope.clickedCompleteCheckout();
			};
			ngDialog.open({
	        		template: '/assets/partials/validateCheckout/rvValidateEmail.html',
	        		controller: 'RVValidateEmailCtrl',
	        		className: 'ngdialog-theme-default1 calendar-single1',
	        		scope: $scope
	        });
		}
		else if($scope.reservationBillData.reservation_status == "CHECKEDIN" && !$scope.saveData.isEarlyDepartureFlag){
			// If reservation status in INHOUSE - show early checkout popup
			$scope.callBackMethodCheckout = function(){
				$scope.clickedCompleteCheckout();
			};
			ngDialog.open({
        		template: '/assets/partials/earlyCheckout/rvEarlyCheckout.html',
        		controller: 'RVEarlyCheckoutCtrl',
        		className: 'ngdialog-theme-default1 calendar-single1',
        		scope: $scope
	        });
		}
		else if (signatureData == "[]" && $scope.reservationBillData.required_signature_at == "CHECKOUT"){
			errorMsg = "Signature is missing";
			$scope.showErrorPopup(errorMsg);
		}
		else if (!$scope.saveData.acceptCharges){
			errorMsg = "Please check the box to accept the charges";
			$scope.showErrorPopup(errorMsg);
		}
		else if ($rootScope.isStandAlone && totalBal > 0) {
			$scope.clickedPayButton();
		}
		else{
			var data = {
				"reservation_id" : $scope.reservationBillData.reservation_id,
				"email" : $scope.guestCardData.contactInfo.email,
				"signature" : signatureData
			};
			$scope.invokeApi(RVBillCardSrv.completeCheckout, data, $scope.completeCheckoutSuccessCallback, $scope.completeCheckoutFailureCallback);
		}
	};
	
	// To handle review button click
	$scope.clickedReviewButton = function(index){
		$scope.reviewStatusArray[index].reviewStatus = true;
		$scope.findNextBillToReview();
	};
	
	// To find next tab which is not reviewed before.
	$scope.findNextBillToReview = function(){
		for(var i=0; i < $scope.reviewStatusArray.length ; i++){
			if(!$scope.reviewStatusArray[i].reviewStatus){
				// when all bills reviewed and reached final bill
				if($scope.reviewStatusArray.length == (i+1)) $scope.isAllBillsReviewed = true;
				var billIndex = $scope.reviewStatusArray[i].billIndex;
				break;
			}
		}
		$scope.setActiveBill(billIndex);
	};
	/*
	 * to show error message - Error message signature and T&C
	 * @param {string} errormessage
	 */
	$scope.showErrorPopup = function(errorMessage){
		$scope.status = "error";
		$scope.popupMessage = errorMessage;
		ngDialog.open({
    		template: '/assets/partials/validateCheckin/rvShowValidation.html',
    		controller: 'RVShowValidationErrorCtrl',
    		className: 'ngdialog-theme-default1 calendar-single1',
    		scope: $scope
    	});
	};
	
	$scope.showSuccessPopup = function(successMessage){
		$scope.status = "success";
		$scope.popupMessage = successMessage;
		$scope.callBackMethod = function(){
			$state.go("rover.search");
		};
		ngDialog.open({
    		template: '/assets/partials/validateCheckin/rvShowValidation.html',
    		controller: 'RVShowValidationErrorCtrl',
    		className: 'ngdialog-theme-default1 calendar-single1',
    		scope: $scope
    	});
	};
	
	$scope.$on('BALANCECHANGED', function(event, data){
	 	var dataToSrv = {
	 		"confirmationNumber": data.confirm_no,
	 		"isRefresh":false
	 	};
	 	var getReservationDetailsSuccessCallback = function(successData){
			$scope.$emit('hideLoader');
			var reservationData = successData;
			reservationData.reservation_card.balance_amount = data.balance;
			RVReservationCardSrv.updateResrvationForConfirmationNumber(data.confirm_no, reservationData);
		};
	 	$scope.invokeApi(RVReservationCardSrv.fetchReservationDetails, dataToSrv, getReservationDetailsSuccessCallback );

	 });

	/*
	 * to show the advance bill confirmation dialog
	 *
	 */
	$scope.showAdvancedBillDialog = function(){
		if($scope.reservationBillData.reservation_status == 'CHECKEDIN' && !$scope.reservationBillData.is_advance_bill){
		 		ngDialog.open({
	    		template: '/assets/partials/bill/rvAdvanceBillConfirmPopup.html',
	    		className: 'ngdialog-theme-default',
	    		scope : $scope
	    	});
	 	}else{
	 		$scope.clickedPayButton();
	 	}
		
		
	};

	/*
	 * to invoke the api on opting the advance bill and fetch the advanced bill details 
	 *
	 */
	$scope.generateAdvanceBill = function(){
		var data = {};
		data.id = $scope.reservationBillData.reservation_id;
		var getAdvanceBillSuccessCallback = function(successData){
			ngDialog.close();
			$scope.$emit('hideLoader');
			$scope.init(successData);
			$scope.clickedPayButton();
		};
		var getAdvanceBillErrorCallback = function(error){
			ngDialog.close();
			$scope.$emit('hideLoader');
			$scope.errorMessage = error;			
		};
	 	$scope.invokeApi(RVBillCardSrv.getAdvanceBill, data, getAdvanceBillSuccessCallback, getAdvanceBillErrorCallback );
	};

	/*
	 * to invoke the payment dialogs on closing the advance bill dialog. 
	 *
	 */
	$scope.closeAdanceBillDialog = function(){
		ngDialog.close();
		$scope.clickedPayButton();
	};


/*------------- edit/remove/split starts here --------------*/
	
	$scope.splitTypeisAmount = true;
	$scope.chargeCodeActive = false;
	$scope.selectedChargeCode = "";
	$scope.chargeCodeData = chargeCodeData.results;

	$scope.getAllchargeCodes = function (callback) {
    	callback($scope.chargeCodeData);
	};

	$scope.setchargeCodeActive = function(bool){
		$scope.chargeCodeActive = bool;
	};

   /*
	 * open popup for edit/split/remove transaction
	 */
	$scope.openActionsPopup = function(id,desc,amount,type,credits){
		//hide edit and remove options in case type is  payment
		$scope.hideRemoveAndEdit  = (type == "PAYMENT") ? true : false;
		$scope.selectedTransaction = {};
		$scope.selectedTransaction.id = id;
		$scope.selectedTransaction.desc = desc;
	
		if(amount){
			$scope.selectedTransaction.amount = amount;
		}
		else if(credits){
			$scope.selectedTransaction.amount = credits;
		};
		
		ngDialog.open({
    		template: '/assets/partials/bill/rvBillActionsPopup.html',
    		className: 'ngdialog-theme-default1',
    		scope: $scope
    	});    	
	};

  /*
	 * open popup for remove transaction
	 */

	$scope.openRemoveChargePopup = function(){
		ngDialog.open({
    		template: '/assets/partials/bill/rvRemoveChargePopup.html',
    		className: 'ngdialog-theme-default1',
    		scope: $scope
    	});
	};

  /*
	 * open popup for split transaction
	 */

	$scope.openSplitChargePopup = function(){
		ngDialog.open({
    		template: '/assets/partials/bill/rvSplitChargePopup.html',
    		className: 'ngdialog-theme-default1',
    		scope: $scope
    	});
	};

  /*
	 * open popup for edit transaction
	 */

	$scope.openEditChargePopup = function(){
		ngDialog.open({
    		template: '/assets/partials/bill/rvEditPostingPopup.html',
    		className: 'ngdialog-theme-default1',
    		scope: $scope
    	});
	};


	var refreshListWithData = function(data){
		$scope.reservationBillData = data; 
		reservationBillData = data;
		//expand list
		$scope.reservationBillData.bills[$scope.currentActiveBill].isOpenFeesDetails = true;
		$scope.calculateHeightAndRefreshScroll();
	};

	var hideLoaderAndClosePopup = function(){
		$scope.$emit("hideLoader");
		ngDialog.close();
	};

	var failureCallBack = function(data){
		//hideLoaderAndClosePopup();
		$scope.$emit("hideLoader");
		$scope.errorMessage = data;
	};

   /*
	 * API call remove transaction
	 */

	$scope.removeCharge = function(reason){
		
		var deleteData = 
		{
			data:{
				"reason":reason,
				"process":"delete"
			},
			"id" :$scope.selectedTransaction.id
		};
		var transactionDeleteSuccessCallback = function(data){		
			hideLoaderAndClosePopup();
			refreshListWithData(data);
			
		};
		$scope.invokeApi(RVBillCardSrv.transactionDelete, deleteData, transactionDeleteSuccessCallback,failureCallBack);
	};

   /*
	 * API call split transaction
	 */

	$scope.splitCharge = function(qty,isAmountType){

		var split_type = isAmountType ? $rootScope.currencySymbol:'%';
		var splitData = {
			"id" :$scope.selectedTransaction.id,
			"data":{
				"split_type": split_type,
   				"split_value": qty
			}
			 
		};
		var transactionSplitSuccessCallback = function(data){		
			hideLoaderAndClosePopup();
			refreshListWithData(data);
		};
		$scope.invokeApi(RVBillCardSrv.transactionSplit, splitData, transactionSplitSuccessCallback,failureCallBack);
	};

   /*
	 * API call edit transaction
	 */
	$scope.editCharge = function(newAmount,chargeCode){
		
		var newData = 
		{
			"updatedDate":
						{
				  			"new_amount":newAmount,
				  			"charge_code_id": chargeCode.id
						},
					"id" :$scope.selectedTransaction.id
		};

		var transactionEditSuccessCallback = function(data){
			hideLoaderAndClosePopup();
			refreshListWithData(data);
		};
		$scope.invokeApi(RVBillCardSrv.transactionEdit, newData, transactionEditSuccessCallback,failureCallBack);
	
	};


	$scope.callActionsPopupAction = function(action){
		
		ngDialog.close();	
		if(action ==="remove"){
			$scope.openRemoveChargePopup();
		}
		else if(action ==="split"){
			$scope.openSplitChargePopup();
		}else if(action === "edit"){
			$scope.openEditChargePopup();
		};

	};

/*----------- edit/remove/split ends here ---------------*/

	 
	$scope.clickedEmail = function(){
		
		var data = {
				"reservation_id" : $scope.reservationBillData.reservation_id,
				"bill_number" : reservationBillData.bills[$scope.currentActiveBill].bill_number
		};
		var sendEmailSuccessCallback = function(successData){
			$scope.$emit('hideLoader');
			$scope.errorMessage = "";
		};
		var sendEmailFailureCallback = function(errorData){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorData;
		};
		console.log(data);
		$scope.invokeApi(RVBillCardSrv.sendEmail, data, sendEmailSuccessCallback, sendEmailFailureCallback);
	
	};
	//print bill
	$scope.clickedPrint = function(){
		printBill();
		scrollToTop();
	};

	var scrollToTop = function() {
			$scope.refreshScroller( 'registration-content' );
			$scope.$parent.myScroll['registration-content'].scrollTo(0, 0, 100);
	};

	// print the page
	var printBill = function() {
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

	 
	 $scope.$on('PAYMENT_SUCCESS', function(event) {
		
		$scope.isRefreshOnBackToStaycard = true;
		$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, $scope.fetchSuccessCallback);
	}); 
	//To update paymentModalOpened scope - To work normal swipe in case if payment screen opened and closed - CICO-8617
	$scope.$on('HANDLE_MODAL_OPENED', function(event) {
		$scope.paymentModalOpened = false;
	});
		
}]);