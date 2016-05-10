
sntRover.controller('RVbillCardController',
	['$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'RVBillCardSrv',
	'reservationBillData',
	'RVReservationCardSrv',
	'ngDialog',
	'$filter',
	'$window',
	'$timeout',
	'chargeCodeData',
	'$sce',
	'RVKeyPopupSrv',
	'RVPaymentSrv',
	'RVSearchSrv',
	'rvPermissionSrv',
	'jsMappings',
	'$q',
	function($scope, $rootScope,
			$state, $stateParams,
			RVBillCardSrv, reservationBillData,

			RVReservationCardSrv,
			ngDialog, $filter,

			$window, $timeout,
			chargeCodeData, $sce,

			RVKeyPopupSrv,RVPaymentSrv,
			RVSearchSrv, rvPermissionSrv, jsMappings, $q){


	BaseCtrl.call(this, $scope);
	// set a back button on header
	$rootScope.setPrevState = {
		title: $filter('translate')('STAY_CARD'),
		callback: 'goBackToStayCard',
		scope: $scope
	};
	$scope.encoderTypes = [];

	// Flag for CC auth permission
    $scope.hasCCAuthPermission = function() {
        return rvPermissionSrv.getPermissionValue ('OVERRIDE_CC_AUTHORIZATION');
    };

	// Setup ng-scroll for 'registration-content' , 'bill-tab-scroller' , 'billDays'
	var scrollerOptionsForGraph = {scrollX: true, click: true, preventDefault: true, mouseWheel: false};
	var scrollerOptionForSummary = {scrollX: true };
	var scrollOptions =  {preventDefaultException:{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|DIV)$/ }, preventDefault: false};
	$scope.setScroller('registration-content', scrollOptions);
  	$scope.setScroller ('bill-tab-scroller', scrollerOptionsForGraph);


	$scope.clickedButton = $stateParams.clickedButton;
	$scope.saveData = {};
	$scope.signatureData = "";
	$scope.saveData.promotions = !!reservationBillData.is_promotions_and_email_set ? true : false;
	$scope.saveData.termsAndConditions = false;
	$scope.reviewStatusArray = [];
	$scope.isAllBillsReviewed = false;
	$scope.saveData.isEarlyDepartureFlag = false;
	$scope.saveData.isEmailPopupFlag = false;
	$scope.isRefreshOnBackToStaycard = false;
	$scope.paymentModalOpened = false;
	$scope.billingInfoModalOpened = false;
	$scope.showPayButton = false;
	$scope.paymentModalSwipeHappened = false;
	$scope.isSwipeHappenedDuringCheckin = false;
	$scope.do_not_cc_auth = false;
	var isAlreadyShownPleaseSwipeForCheckingIn = false;

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
	$scope.reservationBillData = reservationBillData;
	$scope.performCompleteCheckoutAction = false;
	// CICO-6089 : Flag for Guest Bill: Check out without Settlement
	$scope.isCheckoutWithoutSettlement = false;

	//set up flags for checkbox actions
	$scope.hasMoveToOtherBillPermission = function() {
        return ($rootScope.isStandAlone && rvPermissionSrv.getPermissionValue ('MOVE_CHARGES_RESERVATION_ACCOUNT'));
    };

    //only for standalone
	var setChargeCodesSelectedStatus = function(bool){
		if(!$rootScope.isStandAlone){
			return;
		}
		else{
			var billTabsData = $scope.reservationBillData.bills;
			var chargeCodes = billTabsData[$scope.currentActiveBill].total_fees[0].fees_details;
			chargeCodesId = [];
			_.each(chargeCodes, function(chargeCode) {
			  chargeCode.isSelected = bool;
			  chargeCodesId.push(chargeCode.id);
			});
			$scope.reservationBillData.isAllChargeCodeSelected = bool;
		}
	};
	setChargeCodesSelectedStatus(false);

    /*
    * Check if all the items are selected
    */
	$scope.isAllChargeCodesSelected = function(){
		var isAllChargeCodesSelected = true;
		var billTabsData = $scope.reservationBillData.bills;
		if(!$rootScope.isStandAlone){
			isAllChargeCodesSelected = false;
		}
		else{
			var chargeCodes = billTabsData[$scope.currentActiveBill].total_fees[0].fees_details;
	        if (chargeCodes){
	            if(chargeCodes.length > 0){
	                _.each(chargeCodes, function(chargeCode) {
	                  if(!chargeCode.isSelected){
	                    isAllChargeCodesSelected = false;
	                  }
	                });
	            } else{
	                isAllChargeCodesSelected = false;
	            }
	        } else{
	            isAllChargeCodesSelected = false;
	        }
		}
        return isAllChargeCodesSelected;
	};

	/*
    * Check if selection is partial
    */
	$scope.isAnyOneChargeCodeIsExcluded = function(){
		var isAnyOneChargeCodeIsExcluded = false;
		var isAnyOneChargeCodeIsIncluded = false;
		var billTabsData = $scope.reservationBillData.bills;
		if(!$rootScope.isStandAlone){
			isAnyOneChargeCodeIsExcluded = false;
			isAnyOneChargeCodeIsIncluded = false;
		}
		else{
			var chargeCodes = billTabsData[$scope.currentActiveBill].total_fees[0].fees_details;
			if(chargeCodes.length>0){
				_.each(chargeCodes, function(chargeCode,index) {
				  if(!chargeCode.isSelected){
				  	isAnyOneChargeCodeIsExcluded = true;
				  }
				  else{
				  	isAnyOneChargeCodeIsIncluded = true;
				  }
				});
			}
			else{
				isAnyOneChargeCodeIsExcluded = false;
				isAnyOneChargeCodeIsIncluded = false;
			}
		}

		return isAnyOneChargeCodeIsExcluded && isAnyOneChargeCodeIsIncluded;
	};

	$scope.selectAllChargeCodeToggle = function(){
		$scope.reservationBillData.isAllChargeCodeSelected ? setChargeCodesSelectedStatus(true) :setChargeCodesSelectedStatus(false);
	};


	$scope.moveChargesClicked = function(){
		var billTabsData = $scope.reservationBillData.bills;
		var chargeCodes = billTabsData[$scope.currentActiveBill].total_fees[0].fees_details;
		//Data to pass to the popup
		//1. Selected transaction ids
		//2. Confirmation number
		//3. GuestName
		//4. CurrentBillNumber
		//5. Current Bill id
		$scope.moveChargeData = {};
		$scope.moveChargeData.selectedTransactionIds = [];
		var firtName = (typeof $scope.guestCardData.contactInfo.first_name !== "undefined") ?$scope.guestCardData.contactInfo.first_name :"";
		var lastName = (typeof $scope.guestCardData.contactInfo.last_name !== "undefined")  ?$scope.guestCardData.contactInfo.last_name:"";
		$scope.moveChargeData.displayName = $scope.reservationBillData.confirm_no + ' '+lastName+' '+firtName;
		$scope.moveChargeData.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
		$scope.moveChargeData.fromBillId = billTabsData[$scope.currentActiveBill].bill_id;


		if(chargeCodes.length>0){
			_.each(chargeCodes, function(chargeCode,index) {
				if(chargeCode.isSelected){
					$scope.moveChargeData.selectedTransactionIds.push(chargeCode.id);
				}
		    });
		    ngDialog.open({
	    		template: '/assets/partials/bill/rvMoveTransactionPopup.html',
	    		controller: 'RVMoveChargeCtrl',
	    		className: '',
	    		scope: $scope
    		});
		}
		else{
			return;
		};
	};



	$scope.isPrintRegistrationCard = false;

	//To send track details on checkin button
	var swipedTrackDataForCheckin = {};

	$scope.reservationBillData.roomChargeEnabled = "";
	$scope.billingData = {};

	$scope.printData = {};
	//This value changes when clicks on pay button
	$scope.fromViewToPaymentPopup = "billcard";
	//options fo signature plugin
	var screenWidth = angular.element($window).width(); // Calculating screen width.
	$scope.signaturePluginOptions = {
			height : 130,
			width : screenWidth-60,
			lineWidth : 1
	};

	if($scope.clickedButton === "checkoutButton"){
		$scope.$emit('HeaderChanged', $filter('translate')('GUEST_BILL_TITLE'));
		$scope.setTitle($filter('translate')('GUEST_BILL_TITLE'));
	} else if($scope.clickedButton === "checkinButton"){
		$scope.$emit('HeaderChanged', $filter('translate')('REGISTRATION'));
		$scope.setTitle($filter('translate')('REGISTRATION'));
	}
	else{
		$scope.$emit('HeaderChanged', $filter('translate')('GUEST_BILL_TITLE'));
		$scope.setTitle($filter('translate')('GUEST_BILL_TITLE'));
	}

	/**
	* function to get smartband creation along with key creation enabled
	* @return Boolean
	*/
	var isSmartBandKeyCreationAlongWithKeyCreationEnabled = function(){
		return ($scope.reservationBillData.icare_enabled === "true" &&
				$scope.reservationBillData.combined_key_room_charge_create === "true") ? "true": "false";
	};

	/**
	* function to check whether the user has permission
	* to Edit/Split/Move/Delete charges
	* @return {Boolean}
	*/
	$scope.hasPermissionToChangeCharges = function() {
		return rvPermissionSrv.getPermissionValue ('EDIT_SPLIT_DELETE_CHARGE');
	};


	/**
	* function to check whether the user has permission
	* to make payment
	* @return {Boolean}
	*/
	$scope.hasPermissionToMakePayment = function() {
		return rvPermissionSrv.getPermissionValue ('MAKE_PAYMENT');
	};

	/**
	* function to check whether the user has permission
	* to move charges
	* @return {Boolean}
	*/
	$scope.hasPermissionToMoveCharges = function() {
		return rvPermissionSrv.getPermissionValue ('MOVE_CHARGES');
	};

	/**
	* function to check whether the user has permission
	* to Post Room Charge
	* @return {Boolean}
	*/
	$scope.hasPermissionToPostRoomCharge = function() {
		return rvPermissionSrv.getPermissionValue ('ENABLE_DISABLE_POST_CHARGES');
	};

	/**
	* function to decide whether to show Move Charge Drop Down
	* @return {Boolean}
	*/
	$scope.showMoveChargeDropDown = function(){
		return ($rootScope.isStandAlone && $scope.hasPermissionToMoveCharges());
	};

	/**
	* function to decide whether to show Enable/Disable Charge Button
	* @return {Boolean}
	*/
	$scope.shouldShowEnableDisableChargeButton = function(){
		return ($scope.clickedButton === 'checkinButton' &&
			!$scope.reservationBillData.is_res_posting_control_disabled);
	};

	/**
	* function to decide whether to show Edit charge button
	* @param {String} - Fees type value
	* @return {Boolean}
	*/
	$scope.showEditChargeButton = function(feesType){
		return ($rootScope.isStandAlone &&
				feesType!== 'TAX' &&
				$scope.hasPermissionToChangeCharges());
	};

	// Refresh registration-content scroller.
	$scope.calculateHeightAndRefreshScroll = function() {
		$timeout(function(){
			$scope.refreshScroller('registration-content');
		}, 500);
	};


	//Whatever permission of Make Payment we are assigning that
	//removing standalone thing here
	$scope.showPayButton = $scope.hasPermissionToMakePayment() && $rootScope.isStandAlone;

	//Calculate the scroll width for bill tabs in all the cases
	$scope.getWidthForBillTabsScroll = function(){
		var width = 0;
		if($scope.routingArrayCount > 0) {
			width = width + 200;
		}
		if($scope.incomingRoutingArrayCount > 0) {
			width = width + 275;
		}
		if($scope.clickedButton === 'checkinButton') {
			width = width + 230;
		}
		if($scope.reservationBillData.bills.length < 10) {
			width = width + 50;
		}
		width =  133 * $scope.reservationBillData.bills.length + 10 + width;
		return width;
	};

	// Initializing reviewStatusArray
	$scope.reviewStatusArray = [];
	$scope.caculateExpenseAmountForPackageAddon=function(expense_details, returnAmount){
		var inclLength=0;
		angular.forEach(expense_details,function(elem){
		if(elem.is_inclusive===true)
		{
			inclLength++;
		}
	});
	if(inclLength===expense_details.length)
	{
		return 'INCL';
	}else if(inclLength>0&&inclLength<expense_details.length)
	{
		return 'MULTI';
	}else{
		return returnAmount	;
	}
	};

        $scope.putInQueue = false;
	$scope.init = function(reservationBillData){
                $scope.lastResBillData = reservationBillData;//used if refreshing screen manually
                $scope.isStandAlone = $rootScope.isStandAlone;
                var viaQueue = false;
                    if ($scope.$parent){
                        if ($scope.$parent.reservation){
                            viaQueue = $scope.$parent.reservation.check_in_via_queue;
                        }
                    }

                if ($rootScope.advanced_queue_flow_enabled && viaQueue){
                    $scope.putInQueue = true;
                } else {
                    $scope.putInQueue = false;
                }

		if ($rootScope.advanced_queue_flow_enabled && $rootScope.queuedCheckIn) {
			if ($scope.reservationBillData.bills[$scope.currentActiveBill].credit_card_details.payment_type === "CC") {
				isAlreadyShownPleaseSwipeForCheckingIn = true;
			}
			$scope.saveData.termsAndConditions = true;
		}

		/*
		 * Adding billValue and oldBillValue with data. Adding with each bills fees details
		 * To handle move to bill action
		 * Added same value to two different key because angular is two way binding
		 * Check in HTML moveToBillAction
		 */
		angular.forEach(reservationBillData.bills, function(value, key) {



			//To handle fees open/close
			value.isOpenFeesDetails = false;
			if(key === 0 && $scope.clickedButton === "viewBillButton"){
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
	    if($scope.clickedButton === "checkinButton" && !isAlreadyShownPleaseSwipeForCheckingIn){
	     	isAlreadyShownPleaseSwipeForCheckingIn = true;
	     	setTimeout(function(){
	     		if($scope.reservationBillData.is_disabled_cc_swipe === "false" || $scope.reservationBillData.is_disabled_cc_swipe === "" || $scope.reservationBillData.is_disabled_cc_swipe === null){
	     			$scope.openPleaseSwipe();
	     		}

	        }, 200);
	    };
		$scope.reservationBillData = reservationBillData;
		$scope.routingArrayCount = $scope.reservationBillData.routing_array.length;
		$scope.incomingRoutingArrayCount = $scope.reservationBillData.incoming_routing_array.length;
		/*
		 * set the status for the room charge no post button,
		 * on the basis of payment type
		 */
		$scope.setNoPostStatus();
     	$scope.calculateHeightAndRefreshScroll();
     	$scope.refreshScroller('bill-tab-scroller');
     	$scope.billingData.billingInfoTitle = ($scope.reservationBillData.routing_array.length > 0) ? $filter('translate')('BILLING_INFO_TITLE'):$filter('translate')('ADD_BILLING_INFO_TITLE');
		setChargeCodesSelectedStatus(false);
	};

	/*
		 * set the status for the room charge no post button,
		 * on the basis of payment type
		 */
	$scope.setNoPostStatus = function(){

		$scope.reservationBillData.roomChargeEnabled = "";

		if($scope.reservationBillData.no_post === "true"){
			$scope.reservationBillData.roomChargeEnabled = false;
		}else if($scope.reservationBillData.no_post === "false"){
			$scope.reservationBillData.roomChargeEnabled = true;
		}
	};

	$scope.getNoPostButtonTiltle = function(){
		return $scope.reservationBillData.roomChargeEnabled? $filter('translate')('NO_POST_ENABLED'): $filter('translate')('NO_POST_DISABLED');
	};
	var buttonClicked = false;
	$scope.noPostButtonClicked = function(){
		if (!$scope.hasPermissionToPostRoomCharge()){
			$scope.errorMessage = [ "You have no permission to enable or disbable this button!"];
			return false;
		}

		if(buttonClicked) {
			return;
		}
		buttonClicked = true;
		setTimeout(function(){
	     		buttonClicked = false;
	        }, 200);
		$scope.reservationBillData.roomChargeEnabled = !$scope.reservationBillData.roomChargeEnabled;
	};

    $scope.$on('REFRESH_BILLCARD_VIEW',function(){
        $scope.refreshBillView();
        setTimeout(function(){
			$scope.isRefreshOnBackToStaycard = true;
            var fetchBillDataSuccessCallback = function(billData){
			 	$scope.$emit('hideLoader');
			 	reservationBillData = billData;
			 	$scope.init(billData);
			 	$scope.calculateBillDaysWidth();
			};

			$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, fetchBillDataSuccessCallback);
            $scope.$apply();
        },1000);
    });

        $scope.refreshBillView = function(){
            $scope.init($scope.lastResBillData);
        };
	$scope.init(reservationBillData);
	$scope.openPleaseSwipe = function(){
		ngDialog.open({
    		template: '/assets/partials/payment/rvPleaseSwipeModal.html',
    		controller: 'RVPleaseSwipeCtrl',
    		className: '',
    		scope: $scope
    	});
	};
	$scope.setNightsString = function(){
		return (reservationBillData.number_of_nights > 1)?$filter('translate')('NIGHTS'):$filter('translate')('NIGHT');
	};

	/*
	 * Get the title for the billing info button,
	 * on the basis of routes available or not
	 */

	/*
	 * Adding class for active bill
	 */
	$scope.showActiveBill = function(index){

		var activeBillClass = "";
		if(index === $scope.currentActiveBill){
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
		if(clickedDate === checkoutDate){
			if(numberOfNights === 0){
				$scope.dayRates = dayIndex;
			} else {
				$scope.dayRates = $scope.dayRates;
			}

		} else if($scope.dayRates !== dayIndex) {
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

		$scope.currentActiveBill = billIndex;
		$scope.showActiveBillFeesDetails = billIndex;
		$scope.calculateHeightAndRefreshScroll();
		setChargeCodesSelectedStatus(false);
	};
	/*$state
	 * Show Addons
	 * @param {int} addon index
	 */
	$scope.showAddons = function(addonIndex){
		$scope.showAddonIndex = ($scope.showAddonIndex !== addonIndex)?addonIndex:-1;
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
		$scope.showGroupItemIndex = ($scope.showGroupItemIndex !== groupIndex)?groupIndex:-1;
		$scope.showAddonIndex = -1;
		$scope.calculateHeightAndRefreshScroll();
	};
	/*
	 * Show Room Details
	 * @param {int} each day room index
	 */
	$scope.showRoomDetails = function(roomDetailsIndex){
		//Condition added to do toggle action - Room details area
		if($scope.showRoomDetailsIndex === roomDetailsIndex){
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
	 	if(balanceAmount === 0 || balanceAmount === "0.00" || balanceAmount === "0.0"){
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
	 	if(paymentType === 'CC' || paymentType === 'CC' || paymentType === 'CC' || paymentType === 'CC'){
	 		isShowNotDefined = false;
	 	}
	 };
	 $scope.toggleFeesDetails = function(billIndex){
	 	var length = 0;
	 	if(typeof $scope.reservationBillData.bills[$scope.currentActiveBill].total_fees[0] !== 'undefined'){
	 		length = $scope.reservationBillData.bills[$scope.currentActiveBill].total_fees[0].fees_details.length;
		 	if(length>0){
		 	 	$scope.reservationBillData.bills[billIndex].isOpenFeesDetails = !$scope.reservationBillData.bills[billIndex].isOpenFeesDetails;
		 	 	$scope.calculateHeightAndRefreshScroll();
		 	}
		}
	 };
	 /*
	  * Success callback of fetch - After moving fees item from one bill to another
	  */
	 $scope.fetchSuccessCallback = function(data){
	 	$scope.$emit('hideLoader');
	 	reservationBillData = data;
	 	$scope.init(data);
	 	$scope.calculateBillDaysWidth();
	 };
	 $scope.moveToBillActionfetchSuccessCallback = function(data){
	 	$scope.fetchSuccessCallback(data);
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
		var id  = $scope.reservationBillData.bills[parseOldBillValue].total_fees[0].fees_details[feesIndex].id;
		var dataToMove = {
			"reservation_id" : $scope.reservationBillData.reservation_id,
			"to_bill" : newBillValue,
			"from_bill" : oldBillValue,
			"transaction_id" : transactionId,
			"id":id
		};
		/*
		 * Success Callback of move action
		 */
		var moveToBillSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.movedIndex =parseInt(newBillValue)-1;

			//Fetch data again to refresh the screen with new data
			$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, $scope.moveToBillActionfetchSuccessCallback);
		};

		/*
		 * Failure Callback of move action
		 */
		var moveToBillFailureCallback = function(errorMessage) {
			console.log("@moveToBillFailureCallback");
			console.log(errorMessage);
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		$scope.invokeApi(RVBillCardSrv.movetToAnotherBill, dataToMove, moveToBillSuccessCallback, moveToBillFailureCallback );
	 };
	 /*
	  * To add class active if fees is open
	  * @param {bool} - new data added along with bill data for each bill
	  */
        $rootScope.allowPmtWithGiftCard = false;
         $scope.cardsListSuccess = function(data){
             $scope.fetchPmtList = true;
             $scope.allowPmtWithGiftCard = false;
             $rootScope.allowPmtWithGiftCard = false;
             $scope.$emit('hideLoader');
             for (var i in data){
                 if (data[i].name === "GIFT_CARD"){
                    $scope.allowPmtWithGiftCard = true;
                    $rootScope.allowPmtWithGiftCard = true;
                 }
             }
         };
         $scope.fetchPmtList = false;
	 $scope.showFeesDetailsOpenClose = function(openCloseStatus){
             if (!$rootScope.isStandAlone){//CICO-19009 adding gift card support, used to validate gift card is enabled
                 if (!$scope.fetchPmtList){
                    $scope.fetchPmtList = true;
                    $scope.invokeApi(RVPaymentSrv.fetchAvailPayments, {} , $scope.cardsListSuccess);
                 }
             }

	 	var length = 0;
	 	var openCloseClass = " ";

	 	if(typeof $scope.reservationBillData.bills[$scope.currentActiveBill].total_fees[0] !== 'undefined'){
	 		length = $scope.reservationBillData.bills[$scope.currentActiveBill].total_fees[0].fees_details.length;
	 	}
	    if(openCloseStatus && length===0){
	     	openCloseClass = " ";
	    }
	    else if(openCloseStatus && length>0){
	    	openCloseClass = "has-arrow active";
	    }
	    else if(!openCloseStatus && length>0){
	    	openCloseClass = "has-arrow";
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
	 	 if(reservationStatus === 'CHECKING_IN' || reservationStatus === 'NOSHOW_CURRENT'){
	 	 	showGuestBalance = true;
	 	 }
	 	 return showGuestBalance;
	 };

	 $scope.addNewPaymentModal = function(swipedCardData){
	 	//Current active bill is index - adding 1 to get billnumber
	 	var billNumber = parseInt($scope.currentActiveBill)+parseInt(1);
	 	var passData = {
	 		"reservationId": $scope.reservationBillData.reservation_id,
	 		"fromView": $scope.fromViewToPaymentPopup,
	 		"fromBill" : billNumber,
	 		"is_swiped": false ,
	 		"details":{
	 			"firstName":$scope.guestCardData.contactInfo.first_name,
	 			"lastName":$scope.guestCardData.contactInfo.last_name
	 		}
	 	};
	 	var paymentData = $scope.reservationBillData;
	 	if($scope.clickedButton === "checkinButton"){
	 		if(!$scope.paymentModalSwipeHappened && swipedCardData !== undefined){
	 			$scope.isSwipeHappenedDuringCheckin = true;
	 			swipedTrackDataForCheckin = swipedCardData;
	 			if(!$scope.putInQueue) passData.details.isClickedCheckin = true;
	 		}
	 	}

	 	if(swipedCardData === undefined){
			 	passData.showDoNotAuthorize = ($scope.clickedButton === "checkinButton" && $rootScope.isStandAlone);
				$scope.setScroller('cardsList');
				$scope.addmode = false;
				passData.details.hideDirectBill = true;
		 		$scope.openPaymentDialogModal(passData, paymentData);

  	 	} else {

  	 			var swipeOperationObj = new SwipeOperation();
				var swipedCardDataToRender = swipeOperationObj.createSWipedDataToRender(swipedCardData);

				passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
				if(swipedCardDataToRender.swipeFrom !== "payButton" && swipedCardDataToRender.swipeFrom !== 'billingInfo'){
					$scope.openPaymentDialogModal(passData, paymentData);
				} else if(swipedCardDataToRender.swipeFrom === "payButton") {
					$scope.$broadcast('SHOW_SWIPED_DATA_ON_PAY_SCREEN', swipedCardDataToRender);
				}
				else if(swipedCardDataToRender.swipeFrom === "billingInfo") {
					$scope.$broadcast('SHOW_SWIPED_DATA_ON_BILLING_SCREEN', swipedCardDataToRender);
				}

  	 	}
	 };

	 /*
	  * Refresh scroll once page is loaded.
	  */
	 $scope.$on('$viewContentLoaded', function() {
		setTimeout(function(){
			$scope.refreshScroller('registration-content');
			$scope.refreshScroller('billDays');
			$scope.refreshScroller('bill-tab-scroller');
			},
		3000);
     });


     /*
	  * Handle swipe action in bill card
	  */

	 $scope.$on('SWIPE_ACTION', function(event, swipedCardData) {
	 	if(!$scope.isGuestCardVisible){

	 		// commenting out the below code to close ngDialog which is wrong
	 		// The broadcast event will not happpen if the dialog is closed. - CICO-21772

                //ngDialog.close();//close the dialog if one exists, set data after, so duplicates are not created
                //this needs to be moved after 1.13.0 to better detect where the swipe happens and do proper broadcasts to set carddata
	 	    if($scope.paymentModalOpened){
				swipedCardData.swipeFrom = "payButton";
			} else if ($scope.billingInfoModalOpened) {
				swipedCardData.swipeFrom = "billingInfo";
			} else {
				swipedCardData.swipeFrom = "viewBill";
			}
			var swipeOperationObj = new SwipeOperation();
			var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
			var tokenizeSuccessCallback = function(tokenValue){
				$scope.$emit('hideLoader');
				swipedCardData.token = tokenValue;
				$scope.addNewPaymentModal(swipedCardData);
                                $scope.swippedCard = true;
			};
			$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);


	 	 }



	});
	 /*
	  * Clicked pay button function
	  */
	 $scope.clickedPayButton = function(isViaReviewProcess){

	 	// To check for ar account details in case of direct bills
		if($scope.isArAccountNeeded( $scope.currentActiveBill)){
			return;
		}

	 	$scope.paymentModalOpened = true;
	 	$scope.removeDirectPayment = true;

	 	if(isViaReviewProcess) {
	 		$scope.isViaReviewProcess = true;
	 	}
	 	else {
	 		$scope.isViaReviewProcess = false;
	 	}
	 	ngDialog.open({
              template: '/assets/partials/pay/rvPaymentModal.html',
              className: '',
              controller: 'RVBillPayCtrl',
              closeByDocument: false,
              scope: $scope
          });
	 };
	 $scope.clickedAddUpdateCCButton = function(){
	 	$scope.fromViewToPaymentPopup = "billcard";
	 	$scope.isRefreshOnBackToStaycard = true; //CICO-17739 Refresh view when returning from staycard after altering the payment method.
	 	$scope.addNewPaymentModal();
	 };
	 $rootScope.$on('OPENPAYMENTMODEL',function(){
	 	$scope.clickedAddUpdateCCButton();
	 });
	 /*
	  * Toggle signature display
	  */
	 $scope.showSignature = function(){
	 	$scope.showSignedSignature = !$scope.showSignedSignature;
	 	$scope.calculateHeightAndRefreshScroll();
	 };

	 var openPaymentList = function(data) {
			$scope.dataToPaymentList = data;
			$scope.dataToPaymentList.isFromBillCard = true;
			ngDialog.open({
				template: '/assets/partials/payment/rvShowPaymentList.html',
				controller: 'RVShowPaymentListCtrl',
				className: '',
				scope: $scope
			});
	};
	 /*
	  * Show the payment list of guest card for selection
	  */
	 $scope.showPaymentList = function(){
	 	$scope.reservationBillData.currentView = "billCard";
	 	$scope.reservationBillData.currentActiveBill = $scope.currentActiveBill;
	 	openPaymentList($scope.reservationBillData);
	 };

	 $scope.$on('paymentChangedToCC', function(){
	 	$scope.reservationBillData.no_post = "false";
	 	$scope.reservationBillData.roomChargeEnabled = true;
	 });


	$scope.openPostCharge = function(activeBillNo) {
        // Show a loading message until promises are not resolved
        $scope.$emit('showLoader');

        jsMappings.fetchAssets(['postcharge', 'directives'])
        .then(function(){

        $scope.$emit('hideLoader');

		// pass on the reservation id
		$scope.reservation_id = $scope.reservationBillData.reservation_id;

		// pass down active bill no

		$scope.billNumber = activeBillNo;

		// translating this logic as such from old Rover
		// api post param 'fetch_total_balance' must be 'false' when posted from 'staycard'
		// Also passing the available bills to the post charge modal
		$scope.fetchTotalBal = false;

		var bills = [];
	    for(var i = 0; i < $scope.reservationBillData.bills.length; i++ ) {
	    	bills.push(i+1);
	    }

	    $scope.fetchedData = {};
		$scope.fetchedData.bill_numbers = bills;
	    $scope.isOutsidePostCharge = false;

		ngDialog.open({
    		template: '/assets/partials/postCharge/rvPostChargeV2.html',
    		className: '',
    		scope: $scope
    	});
	    })
	};

	$scope.$on('paymentTypeUpdated', function() {
		$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, $scope.fetchSuccessCallback);
	});

	$scope.$on('cc_auth_updated', function($event, do_not_cc_auth) {
		$scope.do_not_cc_auth = do_not_cc_auth;
	});

	// just fetch the bills again ;)
	var postchargeAdded = $scope.$on('postcharge.added', function(event, netPrice) {

		// cos' we are gods, and this is what we wish
		// just kidding.. :P
		$scope.isRefreshOnBackToStaycard = true;
		$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, $scope.fetchSuccessCallback);
	});

	//Reload bill card when routing popup is dismissed
	$scope.$on('routingPopupDismissed', function(event) {

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
		if(reservationStatus === 'CHECKING_IN'){

			if(roomReadyStatus!==''){
				if(foStatus === 'VACANT'){
					switch(roomReadyStatus) {

						case "INSPECTED":
							reservationRoomStatusClass = ' room-green';
							break;
						case "CLEAN":
							if (checkinInspectedOnly === "true") {
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
		if(place === 'checkout'){
			if(date === checkoutDate && numberOfNights !== 0){
				showDay = true;
			}
		} else {
			if(date === checkoutDate && numberOfNights === 0){
				showDay = true;
			} else if(date !== checkoutDate){
				showDay = true;
			}
		}
		return showDay;

	};
	$scope.getDaysClass = function(index, dayDate, checkinDate, checkoutDate, businessDate){
		var dayClass = "";
		if(index!==0){
			dayClass = "hidden";
		}
		if(dayDate === checkinDate){
			dayClass = "check-in active";
		}
		if(dayDate !== checkoutDate){
			if(dayDate <= businessDate){
				dayClass = "active";
			}
		}
		if(dayDate === checkoutDate && dayDate !== checkinDate){
			if(reservationBillData.bills[$scope.currentActiveBill]){
				if(reservationBillData.bills[$scope.currentActiveBill].addons !== undefined && reservationBillData.bills[$scope.currentActiveBill].addons.length >0){
					dayClass = "check-out last";
				} else {
					dayClass = "check-out";
				}
			}
		}
		return dayClass;
	};

	$scope.caculateExpenseAmountForPackageAddon=function(expense_details, returnAmount){
		var inclLength=0;
		angular.forEach(expense_details,function(elem){
		if(elem.is_inclusive===true)
		{
			inclLength++;
		}
	});
	if(inclLength===expense_details.length)
	{
		return 'INCL';
	}else if(inclLength>0&&inclLength<expense_details.length)
	{
		return 'MULTI';
	}else{
		return returnAmount	;
	}
	};
	$scope.showBillingInfoHandle = function(){
		$scope.showBillingInfo = !$scope.showBillingInfo;
		$scope.calculateHeightAndRefreshScroll();
	};
	$scope.showIncomingBillingInfoHandle = function(){
		$scope.showIncomingBillingInfo = !$scope.showIncomingBillingInfo ;
		$scope.calculateHeightAndRefreshScroll();
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

	$scope.continueWithoutCC = function(){
		$scope.reservationBillData.is_cc_authorize_at_checkin_enabled = false;
		$scope.clickedCompleteCheckin(true);
		$scope.closeDialog();
	};

	$scope.continueAfterSuccessAuth = function(){
		$scope.triggerKeyCreationProcess();
		$scope.closeDialog();
	};

	// Normal checkin process success.
	$scope.completeCheckinSuccessCallback = function(data){
		// CICO-6109 : Without Authorization flow ..
		$scope.$emit('hideLoader');
	 	$scope.triggerKeyCreationProcess();
	};

	// Success after autherization
	$scope.completeCheckinAuthSuccessCallback = function(data){

		$scope.$emit('hideLoader');

		// CICO-6109 : With Authorization flow .: Auth Success
		if(data.check_in_status === "Success"){
		 	$scope.isInProgressScreen = false;
	    	$scope.isSuccessScreen = true;
	    	$scope.isFailureScreen = false;
	    	$scope.cc_auth_amount = data.cc_auth_amount;
	    	$scope.cc_auth_code = data.cc_auth_code;
	    	$scope.reservationBillData.bills[$scope.currentActiveBill].credit_card_details.auth_color_code = 'green';
	    }
	    else{
	    	// CICO-6109 : With Authorization flow .: Auth declined
	    	$scope.isInProgressScreen = false;
	    	$scope.isSuccessScreen = false;
	    	$scope.isFailureScreen = true;
	    	$scope.cc_auth_amount = data.cc_auth_amount;
	    	$scope.reservationBillData.bills[$scope.currentActiveBill].credit_card_details.auth_color_code = 'red';
	    }
	};

	$scope.triggerKeyCreationProcess = function(){

		var keySettings = $scope.reservationBillData.key_settings;
		$scope.viewFromBillScreen = true;
		$scope.fromView = "checkin";
		//show email popup
		if(keySettings === "email"){

			ngDialog.open({
				 template: '/assets/partials/keys/rvKeyEmailPopup.html',
				 controller: 'RVKeyEmailPopupController',
				 className: '',
				 closeByDocument: false,
				 scope: $scope
			});
		}
		else if(keySettings === "qr_code_tablet"){

			//Fetch and show the QR code in a popup
			var	reservationId = $scope.reservationBillData.reservation_id;

			var successCallback = function(data){
				$scope.$emit('hideLoader');
				$scope.data = data;
				ngDialog.open({
					 template: '/assets/partials/keys/rvKeyQrcodePopup.html',
					 controller: 'RVKeyQRCodePopupController',
					 className: '',
					 scope: $scope
				});
			};

			$scope.invokeApi(RVKeyPopupSrv.fetchKeyQRCodeData,{ "reservationId": reservationId }, successCallback);
		}

		//Display the key encoder popup
		//https://stayntouch.atlassian.net/browse/CICO-21898?focusedCommentId=58632&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-58632
		else if(keySettings === "encode"  || keySettings === "mobile_key_encode"){
			if($scope.reservationBillData.is_remote_encoder_enabled && $scope.encoderTypes !== undefined && $scope.encoderTypes.length <= 0){
				fetchEncoderTypes();
			} else {
				openKeyEncodePopup();
			}
		}
	};

	var openKeyEncodePopup = function(){
		$scope.isSmartbandCreateWithKeyWrite = isSmartBandKeyCreationAlongWithKeyCreationEnabled();
		ngDialog.open({
		    template: '/assets/partials/keys/rvKeyEncodePopup.html',
		    controller: 'RVKeyEncodePopupCtrl',
		    className: '',
		    closeByDocument: false,
		    scope: $scope
		});
	};

		//Fetch encoder types for SAFLOK_MSR
	var fetchEncoderTypes = function(){
		var encoderFetchSuccess = function(data){
			$scope.$emit('hideLoader');
			$scope.encoderTypes = data;
			openKeyEncodePopup();
		};
	    $scope.invokeApi(RVKeyPopupSrv.fetchActiveEncoders, {}, encoderFetchSuccess);
	};


	$scope.completeCheckinFailureCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.errorMessage = data;
		// Some error in checkin process - auth popup closing..
		$scope.closeDialog();
	};

        $scope.goToStayCardFromAddToQueue = function(){
            $scope.isRefreshOnBackToStaycard = true;
            $scope.goBackToStayCard();
        };


        $scope.checkGuestInFromQueue = false;
        if (!$rootScope.reservationBillWatch){//alternative to $destroy, this is an init-once method
            $rootScope.reservationBillWatch = 1;

            $rootScope.$on('goToStayCardFromAddToQueue',function(){
                 $scope.goToStayCardFromAddToQueue();

            });
            $rootScope.$on('checkGuestInFromQueue', function() {
                $scope.checkGuestInFromQueue = true;
                //if checking guest in from queue, then signature details should have already been collected, dont re-submit the signature, this will fix an issue getting internal server error
                var signature = 'isSigned';
                  //  signature = $scope.reservationBillData.signature_details.signed_image;
                $scope.initCompleteCheckin(false, signature);
            });
        }

	//CICO-13907
	$scope.hasAnySharerCheckedin = function(){
		var isSharerCheckedin = false;
		angular.forEach($scope.reservationBillData.sharer_information, function(sharer, key){
			if(sharer.reservation_status === 'CHECKEDIN' || sharer.reservation_status === 'CHECKING_OUT'){
				isSharerCheckedin = true;
				return false;
			}
		});
		return isSharerCheckedin;
	};

        $scope.putInQueueAdvanced = function(saveData){
                   var reservationId = $scope.reservationBillData.reservation_id;
                   $scope.reservationData.check_in_via_queue = false;//set flag for checking in via put-in-queue

                   var data = {
                           "reservationId": reservationId,
                           "status": "true"
                   };
                   if (saveData && saveData.signature !== '[]'){
                       data.signature = saveData.signature;
                   }
                   if (saveData.is_promotions_and_email_set !== undefined){
                       data.is_promotions_and_email_set = saveData.is_promotions_and_email_set;
                   }
                   data.viaAdvancedQueue = true;

                   $scope.invokeApi(RVReservationCardSrv.modifyRoomQueueStatus, data, $scope.successPutInQueueCallBack, $scope.failPutInQueueCallBack);
               };

            $scope.successPutInQueueCallBack = function() {
                    $scope.$emit('hideLoader');
                    $scope.reservationData.reservation_card.is_reservation_queued = "true";
                    $scope.$emit('UPDATE_QUEUE_ROOMS_COUNT', 'add');
                    RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.reservation_id, $scope.reservationData);

                    var useAdvancedQueFlow = $rootScope.advanced_queue_flow_enabled;
                    if (useAdvancedQueFlow){
                        setTimeout(function(){
                            //then prompt for keys
                            $rootScope.$broadcast('clickedIconKeyFromQueue');//signals rvReservationRoomStatusCtrl to init the keys popup
                        },1250);
                        $scope.goToStayCardFromAddToQueue();
                    }
            };
            $scope.failPutInQueueCallBack = function(err) {
                    $scope.$emit('hideLoader');
                    $scope.errorMessage = err;
            };


	// Handle checkin process with Autherization..
	var performCCAuthAndCheckinProcess = function(data,isCheckinWithoutAuth, queueRoom){
            /*
             * put in Queue should not attempt to auth CC during normal workflow in Overlay,
             * in Standalone, $scope.putInQueue should always be false; (until we start supporting standalone put in queue)
             */

		if(isCheckinWithoutAuth || ($scope.putInQueue && !$scope.checkGuestInFromQueue) || queueRoom === true){
                        //$scope.putInQueue is set to true when going through the overlay -> put in queue advanced flow process (basically the same as check-in, without CC auth-CICO-19673)
                        //--- also the guest is not checked-in, so the user gets redirected back to the stay card, where they will see the option to "remove from queue"
                        //--- this also updates the flow for check-in, if (reservation was queue'd, then we will skip upgrade page, T&C page and credit card authorization
                        //----> upon check-in w/ res. queued, Immediately check-in guest in Opera and advance Rover to key generation screen
                        data.authorize_credit_card = false;
                        if ($scope.putInQueue || queueRoom === true){
                            $scope.putInQueueAdvanced(data);
                            //Now, we need to go ahead and produce the keys so the user doesn't need key creation at check-in if (queued room)

                        }else {
                            // Perform checkin process without authorization..
                            $scope.invokeApi(RVBillCardSrv.completeCheckin, data, $scope.completeCheckinSuccessCallback, $scope.completeCheckinFailureCallback);
                        }
		}
		else if($scope.reservationBillData.is_cc_authorize_at_checkin_enabled && $scope.reservationBillData.bills[$scope.currentActiveBill].credit_card_details.payment_type === "CC"){
		    // Performing cc autherization process..
	    	$scope.isInProgressScreen = true;
	    	$scope.isSuccessScreen = false;
	    	$scope.isFailureScreen = false;
	    	$scope.isCCAuthPermission = $scope.hasCCAuthPermission();

		    ngDialog.open({
				template: '/assets/partials/bill/ccAuthorization.html',
				className: '',
				closeByDocument: false,
				scope: $scope
			});
			data.authorize_credit_card = true;
			$scope.invokeApi(RVBillCardSrv.completeCheckin, data, $scope.completeCheckinAuthSuccessCallback, $scope.completeCheckinFailureCallback);
		}
		else{
			// Perform checkin process without authorization..
			data.authorize_credit_card = false;
			$scope.invokeApi(RVBillCardSrv.completeCheckin, data, $scope.completeCheckinSuccessCallback, $scope.completeCheckinFailureCallback);
		}
	};

	var setFlagForPreAuthPopup = function(){
		// CICO-17266 Setting up flags for showing messages ..
	    $scope.message_incoming_from_room = false;
	    $scope.message_out_going_to_room = false;
	    $scope.message_out_going_to_comp_tra = false;

	    if($scope.reservationBillData.routing_info.incoming_from_room){
	    	$scope.message_incoming_from_room = true;
	    }
	    else if($scope.reservationBillData.routing_info.out_going_to_room){
	    	$scope.message_out_going_to_room = true;
	    }
	    else if($scope.reservationBillData.routing_info.out_going_to_comp_tra){
	    	$scope.message_out_going_to_comp_tra = true;
	    }
	};

	// CICO-17266 Considering Billing info details before Auth..
	var showPreAuthPopupWithBillingInfo = function(data){

 		$scope.clickedFullAuth = function(){
 			// @params : data , isCheckinWithoutAuth: false
			performCCAuthAndCheckinProcess(data,false);
			ngDialog.close();
	    };

	    $scope.clickedManualAuth = function(){
	    	// As of now , Manual auth is performed at stay card..
			// Proceeding checkin without authorization..
			// @params : data , isCheckinWithoutAuth :true
			$scope.reservationBillData.is_cc_authorize_at_checkin_enabled = false;
			performCCAuthAndCheckinProcess(data,true);
			ngDialog.close();
	    };

	    setFlagForPreAuthPopup();

	    // CICO-17266 Considering Billing info details before Auth..
	    ngDialog.open({
			template: '/assets/partials/bill/ccAuthAndBillingInfoConfirm.html',
			className: '',
			closeByDocument: false,
			scope: $scope
		});
	};


        $scope.getSignature = function(){//moved here for easier cleanup later
		// Against angular js practice ,TODO: check proper solution using ui-jq to avoid this.
		var signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
                return signatureData;
        };
        $scope.signatureNeeded = function(signatureData){
                if ($scope.reservationBillData.signature_details.is_signed === 'true'){
                    signatureData = $scope.reservationBillData.signature_details.signed_image;
                    return false;
                };

		if(signatureData === "[]" && $scope.reservationBillData.required_signature_at === "CHECKIN"){
                    return true;
                } else return false;
        };

        $scope.termsConditionsNeeded = function(){
            if(!$scope.saveData.termsAndConditions &&
                    (
                        $scope.reservationBillData.is_disabled_terms_conditions_checkin === "false" ||
                        $scope.reservationBillData.is_disabled_terms_conditions_checkin === "" ||
                        $scope.reservationBillData.is_disabled_terms_conditions_checkin === null
                    )
                ){
                return true;
            } else return false;
        };

        $scope.validateEmailNeeded = function(){
          if ($scope.saveData.promotions && $scope.guestCardData.contactInfo.email === '') {
              return true;
          } else return false;
        };

        $scope.getCheckinSwipeData = function(signatureData, addToGuest){

            var cardExpiry = "20"+swipedTrackDataForCheckin.RVCardReadExpDate.substring(0, 2)+"-"+swipedTrackDataForCheckin.RVCardReadExpDate.slice(-2)+"-01";
            var data = {
                    "is_promotions_and_email_set" : $scope.saveData.promotions,
                    "signature" : signatureData,
                    "reservation_id" : $scope.reservationBillData.reservation_id,
                    "payment_type": "CC",
                    "mli_token": swipedTrackDataForCheckin.token,
                    "et2": swipedTrackDataForCheckin.RVCardReadTrack2,
                    "etb": swipedTrackDataForCheckin.RVCardReadETB,
                    "ksn": swipedTrackDataForCheckin.RVCardReadTrack2KSN,
                    "pan": swipedTrackDataForCheckin.RVCardReadMaskedPAN,
                    "card_name": swipedTrackDataForCheckin.RVCardReadCardName,
                    "name_on_card": swipedTrackDataForCheckin.RVCardReadCardName,
                    "card_expiry": cardExpiry,
                    "credit_card" : swipedTrackDataForCheckin.RVCardReadCardType,
                    "do_not_cc_auth" : true,
                    "no_post" : ($scope.reservationBillData.roomChargeEnabled === "") ? "": !$scope.reservationBillData.roomChargeEnabled,
                    "add_to_guest_card" : addToGuest
            };
            //CICO-12554 indicator if the track data is encrypted or not
            data.is_encrypted = true;
            if(swipedTrackDataForCheckin.RVCardReadIsEncrypted === 0 || swipedTrackDataForCheckin.RVCardReadIsEncrypted === '0'){
                    data.is_encrypted = false;
                    data.card_number = swipedTrackDataForCheckin.RVCardReadPAN;
            }
            //CICO-12554 Adding the KSN conditionally
            data.ksn = swipedTrackDataForCheckin.RVCardReadTrack2KSN;

            if(swipedTrackDataForCheckin.RVCardReadETBKSN !== "" && typeof swipedTrackDataForCheckin.RVCardReadETBKSN !== "undefined"){
                    data.ksn = swipedTrackDataForCheckin.RVCardReadETBKSN;
            }
            return data;
        };

        $scope.getCheckinNonSwipeData = function(signatureData){
            var data = {
                "is_promotions_and_email_set" : $scope.saveData.promotions,
                "signature" : signatureData,
                "reservation_id" : $scope.reservationBillData.reservation_id,
                "do_not_cc_auth" : $scope.do_not_cc_auth,
                "no_post" : ($scope.reservationBillData.roomChargeEnabled === "") ? "": !$scope.reservationBillData.roomChargeEnabled
            };
            return data;
        };



	// To handle complete checkin button click
	$scope.clickedCompleteCheckin = function(isCheckinWithoutPreAuthPopup, checkInQueuedRoom){


		if($scope.hasAnySharerCheckedin()){
			// Do nothing , Keep going checkin process , it is a sharer reservation..
		}
		else if(($scope.reservationBillData.room_status === 'NOTREADY' || $scope.reservationBillData.fo_status === 'OCCUPIED') && !$rootScope.queuedCheckIn){
			 var reservationStatus = $scope.reservationBillData.reservation_status
	  		 var isUpgradeAvaiable = $scope.reservationBillData.is_upsell_available && (reservationStatus === 'RESERVED' || reservationStatus === 'CHECKING_IN');
			//TO DO:Go to room assignemt view
			$state.go("rover.reservation.staycard.roomassignment", {
				"reservation_id": $scope.reservationBillData.reservation_id,
				"room_type": $scope.reservationBillData.room_type,
				"clickedButton": "checkinButton",
				"upgrade_available" : isUpgradeAvaiable
			});
			return false;
		}

		var errorMsg = "", signatureData = $scope.getSignature();

		if($scope.signatureNeeded(signatureData)){
			errorMsg = "Signature is missing";
			$scope.showErrorPopup(errorMsg);



		} else if($scope.termsConditionsNeeded()){
			errorMsg = "Please check agree to the Terms & Conditions";
			$scope.showErrorPopup(errorMsg);


		} else {
                    $scope.initCompleteCheckin(isCheckinWithoutPreAuthPopup, signatureData);
		}

	};
        $scope.clickedCompleteAddToQueue = function(isCheckinWithoutPreAuthPopup, checkInQueuedRoom){

		if($scope.hasAnySharerCheckedin()){
			// Do nothing , Keep going checkin process , it is a sharer reservation..
		}

		var errorMsg = "", signatureData = $scope.getSignature();

		if($scope.signatureNeeded(signatureData)){
			errorMsg = "Signature is missing";
			$scope.showErrorPopup(errorMsg);



		} else if($scope.termsConditionsNeeded()){
			errorMsg = "Please check agree to the Terms & Conditions";
			$scope.showErrorPopup(errorMsg);


		} else {
                    var queueRoom = true;
                    $scope.initCompleteCheckin(isCheckinWithoutPreAuthPopup, signatureData, queueRoom);
		}

	};

        $scope.initCompleteCheckin = function(isCheckinWithoutPreAuthPopup, signatureData, queueRoom){

			if($scope.validateEmailNeeded()){
                            ngDialog.open({
                                template: '/assets/partials/validateCheckin/rvAskEmailFromCheckin.html',
                                controller: 'RVValidateEmailPhoneCtrl',
                                className: '',
                                scope: $scope
                            });
			} else {
				var addToGuest = false;
				if($scope.isAddToGuestCardEnabledDuringCheckin !== undefined){
					addToGuest = $scope.isAddToGuestCardEnabledDuringCheckin;
				}


                            var data;
                            if($scope.isSwipeHappenedDuringCheckin){
                                 data = $scope.getCheckinSwipeData(signatureData, addToGuest);
	 		    } else if ($scope.checkGuestInFromQueue) {
	 		    	 data = $scope.getCheckinNonSwipeData(signatureData);
	 		    } else {
	 		    	 data = $scope.getCheckinNonSwipeData(signatureData);
	 		    }
                            if (!$scope.putInQueue){
                                setFlagForPreAuthPopup();
                            }
                            if (signatureData === 'isSigned' || signatureData === '[]'){
                                delete data.signature;
                            }

	 		    if(typeof isCheckinWithoutPreAuthPopup !== 'undefined' && isCheckinWithoutPreAuthPopup){
	 		    	// Directly performing checkin process without pre-auth popup.
	 		    	performCCAuthAndCheckinProcess(data,true,queueRoom);
	 		    }
	 		    else if(!$scope.message_incoming_from_room && !$scope.message_out_going_to_room && !$scope.message_out_going_to_comp_tra){
	 		    	performCCAuthAndCheckinProcess(data,false,queueRoom);
	 		    }
	 		    else if($scope.reservationBillData.is_cc_authorize_at_checkin_enabled && $scope.reservationBillData.bills[$scope.currentActiveBill].credit_card_details.payment_type === "CC"){
                                // CICO-17266 PMS: Rover - CC Auth should consider Billing Information.
                                showPreAuthPopupWithBillingInfo(data);
                            }
                            else{
                                performCCAuthAndCheckinProcess(data,true,queueRoom);
                            }
			}
        };
    /**
	* function to check whether the user has permission
	* to Show 'Checkout Without Settlement' checkbox.
	* @return {Boolean}
	*/
	$scope.hasPermissionToShowCheckoutWithoutSettlement = function() {
		return rvPermissionSrv.getPermissionValue ('ALLOW_CHECKOUT_WITHOUT_SETTLEMENT');
	};
    // CICO-6089 : Handle toggle button.
    $scope.toggleCheckoutWithoutSettlement = function(){
    	$scope.isCheckoutWithoutSettlement = !$scope.isCheckoutWithoutSettlement;
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

	// To handle ar account details in case of direct bills
	$scope.isArAccountNeeded = function(index){

		//CICO-15493: A reservation being linked to a Group Account should be sufficient to be able to check out to Direct Bill; no need to check for AR account
		if($scope.reservationBillData.is_linked_to_group_account){
			return false;
		}
		//Prompt for AR account
		if($scope.reservationBillData.bills[index].credit_card_details.payment_type === "DB" && $scope.reservationBillData.ar_number === null && $rootScope.isStandAlone){

			if($scope.reservationBillData.account_id === null || typeof $scope.reservationBillData.account_id === 'undefined'){
				$scope.showErrorPopup($filter('translate')('ACCOUNT_ID_NIL_MESSAGE'));
			}else{
				$scope.account_id = $scope.reservationBillData.account_id;
				ngDialog.open({
					template: '/assets/partials/payment/rvAccountReceivableMessagePopup.html',
					controller: 'RVAccountReceivableMessagePopupCtrl',
					className: '',
					scope: $scope
				});
			}
			return true;
		}else{
			return false;
		}
	};

	// To handle complete checkout button click
	$scope.clickedCompleteCheckout = function() {

		$scope.findNextBillToReview();	// Verifying wheather any bill is remaing for reviewing.

		if(!$scope.isAllBillsReviewed){
			return;
		}

		// To check for ar account details in case of direct bills
		var index = $scope.reservationBillData.bills.length - 1;
		if($scope.isArAccountNeeded(index)){
			return;
		}

		// Against angular js practice ,TODO: check proper solution using ui-jq to avoid this.
		if($scope.signatureData === "" || $scope.signatureData === "[]"){
			var signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
		}
		else{
			var signatureData = $scope.signatureData;
		}
		var errorMsg = "";
		var totalBal = 0;

		// calculate total
		for (var i = 0; i < reservationBillData.bills.length; i++) {
			var bill = reservationBillData.bills[i];
			totalBal += bill.total_amount * 1;
		};

		var finalBillBalance = "0.00";
		if(typeof $scope.reservationBillData.bills[$scope.currentActiveBill].total_fees[0] !=='undefined'){
			finalBillBalance = $scope.reservationBillData.bills[$scope.currentActiveBill].total_fees[0].balance_amount;
		}
		var paymentType = reservationBillData.bills[$scope.currentActiveBill].credit_card_details.payment_type;

		if($scope.isCheckoutWithoutSettlement){
			var data = {
				"reservation_id" : $scope.reservationBillData.reservation_id,
				"email" : $scope.guestCardData.contactInfo.email,
				"signature" : signatureData,
				"allow_checkout_without_settlement": true
			};
			$scope.invokeApi(RVBillCardSrv.completeCheckout, data, $scope.completeCheckoutSuccessCallback, $scope.completeCheckoutFailureCallback);
		}
		else if($rootScope.isStandAlone && finalBillBalance !== "0.00" && paymentType === "DB"  && !$scope.performCompleteCheckoutAction  && !reservationBillData.bills[$scope.currentActiveBill].is_allow_direct_debit ){
			showDirectDebitDisabledPopup();
		}
		else if($rootScope.isStandAlone && finalBillBalance !== "0.00" && paymentType!=="DB"){
			$scope.reservationBillData.isCheckout = true;
			$scope.clickedPayButton(true);
		}
		else if(!$scope.guestCardData.contactInfo.email && !$scope.saveData.isEmailPopupFlag){
			// Popup to accept and save email address.
			$scope.callBackMethodCheckout = function(){
				$scope.saveData.isEmailPopupFlag = true ;
				$scope.clickedCompleteCheckout();
			};
			ngDialog.open({
	        		template: '/assets/partials/validateCheckout/rvValidateEmail.html',
	        		controller: 'RVValidateEmailCtrl',
	        		className: '',
	        		scope: $scope
	        });
		}
		else if($scope.reservationBillData.reservation_status === "CHECKEDIN" && !$scope.saveData.isEarlyDepartureFlag && !$scope.reservationBillData.is_early_departure_penalty_disabled){
			// If reservation status in INHOUSE - show early checkout popup
			$scope.callBackMethodCheckout = function(){
				$scope.clickedCompleteCheckout();
			};
			ngDialog.open({
        		template: '/assets/partials/earlyCheckout/rvEarlyCheckout.html',
        		controller: 'RVEarlyCheckoutCtrl',
        		className: '',
        		scope: $scope
	        });
		}
		else if (signatureData === "[]" && $scope.reservationBillData.required_signature_at === "CHECKOUT"){
			errorMsg = "Signature is missing";
			$scope.showErrorPopup(errorMsg);
		}
		else if (!$scope.saveData.acceptCharges){
			errorMsg = "Please check the box to accept the charges";
			$scope.showErrorPopup(errorMsg);
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

	/**
	* function to check whether the user has permission
	* to to proceed checkout
	* @return {Boolean}
	*/
	$scope.hasPermissionToProceedCheckout = function() {
		return rvPermissionSrv.getPermissionValue ('OVERWRITE_DEBIT_RESTRICTION');
	};

	// CICO-12983 Restrict Debits for Company / TA cards.
	var showDirectDebitDisabledPopup = function(){
		ngDialog.open({
    		template: '/assets/partials/validateCheckout/rvDirectDebitDisabled.html',
    		className: '',
    		scope: $scope
        });
	};

	// CICO-12983 To handle procced with checkout on DirectDebitDisabledPopup.
	$scope.proceedWithCheckout = function(){
		$scope.closeDialog();
		/*
		 *	For the Final bill => If all bills already reviewed -> proceed complete checkout process.
		 *	In all other bills => proceed the review process.
		 */
		if($scope.isAllBillsReviewed){
			$scope.performCompleteCheckoutAction = true;
			$scope.clickedCompleteCheckout();
		}
		else{
			// Updating review status for the bill.
			$scope.reviewStatusArray[$scope.currentActiveBill].reviewStatus = true;
			$scope.findNextBillToReview();
		}
	};

	// To handle review button click
	$scope.clickedReviewButton = function(index){
		// To check for ar account details in case of direct bills
		if($scope.isArAccountNeeded(index)){
			return;
		}
		// CICO-9721 : Payment should be prompted on Bill 1 first before moving to review Bill 2 when balance is not 0.00.
		var ActiveBillBalance = $scope.reservationBillData.bills[$scope.currentActiveBill].total_fees[0].balance_amount;
		var paymentType = reservationBillData.bills[$scope.currentActiveBill].credit_card_details.payment_type;
		if($rootScope.isStandAlone && ( ActiveBillBalance === "0.00" || $scope.isCheckoutWithoutSettlement )){
			// Checking bill balance for stand-alone only.
			$scope.reviewStatusArray[index].reviewStatus = true;
			$scope.findNextBillToReview();
		}
		else if( $rootScope.isStandAlone && ActiveBillBalance !== "0.00" && paymentType === "DB"  && !reservationBillData.bills[$scope.currentActiveBill].is_allow_direct_debit ){
			showDirectDebitDisabledPopup();
		}
		else if($rootScope.isStandAlone && ActiveBillBalance !== "0.00" && paymentType!=="DB"){
			// Show payment popup for stand-alone only.
			$scope.reservationBillData.isCheckout = true;
			$scope.clickedPayButton(true);
		}
		else{
			$scope.reviewStatusArray[index].reviewStatus = true;
			$scope.findNextBillToReview();
		}
	};

	// To find next tab which is not reviewed before.
	$scope.findNextBillToReview = function(){
		var billIndex = 0;
		for(var i=0; i < $scope.reviewStatusArray.length ; i++){

			// Checking last bill balance for stand-alone only.
			if($rootScope.isStandAlone && typeof $scope.reservationBillData.bills[i].total_fees[0] !== 'undefined'){
				var billBalance = $scope.reservationBillData.bills[i].total_fees[0].balance_amount;
				var paymentType = $scope.reservationBillData.bills[i].credit_card_details.payment_type;
				if(billBalance !== "0.00" && paymentType !== "DB" && !$scope.isCheckoutWithoutSettlement ) {
					$scope.reviewStatusArray[i].reviewStatus = false;
				}
			}
			if(!$scope.reviewStatusArray[i].reviewStatus){
				// when all bills reviewed and reached final bill
				if($scope.reviewStatusArray.length === (i+1)) {
					$scope.isAllBillsReviewed = true;
				}
				billIndex = $scope.reviewStatusArray[i].billIndex;
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
    		className: '',
    		scope: $scope
    	});
	};

	$scope.showSuccessPopup = function(successMessage){
		$scope.status = "success";
		$scope.popupMessage = successMessage;
		$scope.callBackMethod = function(){
			//CICO-11807 issue fixed
			if($scope.saveData.isEarlyDepartureFlag===true){
				var stateParams = {'type': 'INHOUSE', 'from_page': 'DASHBOARD'};
			}
			else{
				var stateParams = {'type': 'DUEOUT', 'from_page': 'DASHBOARD'};
			}
			if(RVSearchSrv.searchTypeStatus === undefined){
				var stateParams = {'useCache': true};
				$scope.reservationBillData.reservation_status = "CHECKEDOUT";
				RVSearchSrv.updateRoomDetails($scope.reservationBillData.confirm_no, $scope.reservationBillData);
			}
			if(RVSearchSrv.totalSearchResults==='1'){
				$state.go('rover.dashboard');
			}
			else{
            	$state.go('rover.search', stateParams);
			}
		};
		ngDialog.open({
    		template: '/assets/partials/validateCheckin/rvShowValidation.html',
    		controller: 'RVShowValidationErrorCtrl',
    		className: '',
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

	$scope.HIDE_LOADER_FROM_POPUP =  function(){
		$scope.$emit("hideLoader");
	};
	//trigger the billing information popup
    $scope.openBillingInformation = function(){

    	$scope.reservationData = {};
    	$scope.reservationData.confirm_no = $scope.reservationBillData.confirm_no;
    	$scope.reservationData.reservation_id = $scope.reservationBillData.reservation_id;
    	$scope.reservationData.reservation_status = $scope.reservationBillData.reservation_status;
    	$scope.reservationData.user_id = $stateParams.userId;
    	$scope.reservationData.is_opted_late_checkout = false;
    	$scope.billingInfoModalOpened = true;

    	$scope.$emit('showLoader');
       	jsMappings.fetchAssets(['addBillingInfo', 'directives'])
        .then(function(){
        	$scope.$emit('hideLoader');
		    ngDialog.open({
		        template: '/assets/partials/bill/rvBillingInformationPopup.html',
		        controller: 'rvBillingInformationPopupCtrl',
		        className: '',
		        scope: $scope
		    });
		});
    };

	/*
	 * to show the advance bill confirmation dialog
	 *
	 */
	$scope.showAdvancedBillDialog = function(){
		if($rootScope.isStandAlone && $scope.reservationBillData.reservation_status === 'CHECKEDIN' && !$scope.reservationBillData.is_advance_bill && !$scope.reservationBillData.is_hourly){
		 		ngDialog.open({
	    		template: '/assets/partials/bill/rvAdvanceBillConfirmPopup.html',
	    		className: '',
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
			var reservation = RVReservationCardSrv.getResrvationForConfirmationNumber($scope.reservationBillData.confirm_no);
			reservation.reservation_card.balance_amount = successData.reservation_balance;
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationBillData.confirm_no, reservation);
			$scope.clickedPayButton();
			$scope.reservationBillData.is_advance_bill = true;
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
	$scope.selectedChargeCode = {};
	$scope.chargeCodeData = chargeCodeData.results;
	$scope.availableChargeCodes = chargeCodeData.results;

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

		$scope.errorMessage = "";
		//hide edit and remove options in case type is  payment
		$scope.hideRemoveAndEdit  = (type === "PAYMENT") ? true : false;
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
    		className: '',
    		scope: $scope
    	});
	};

  /*
	 * open popup for remove transaction
	 */

	$scope.openRemoveChargePopup = function(){
		ngDialog.open({
    		template: '/assets/partials/bill/rvRemoveChargePopup.html',
    		controller:'rvBillCardPopupCtrl',
    		className: '',
    		scope: $scope
    	});
	};

  /*
	 * open popup for split transaction
	 */

	$scope.openSplitChargePopup = function(){
		ngDialog.open({
    		template: '/assets/partials/bill/rvSplitChargePopup.html',
    		controller:'rvBillCardPopupCtrl',
    		className: '',
    		scope: $scope
    	});
	};

  /*
	 * open popup for edit transaction
	 */

	$scope.openEditChargePopup = function(){
		$scope.selectedChargeCode = {
			"id": "",
			"name": "",
			"description": "",
			"associcated_charge_groups": []
		};
		ngDialog.open({
    		template: '/assets/partials/bill/rvEditPostingPopup.html',
    		className: '',
    		controller:'rvBillCardPopupCtrl',
    		scope: $scope
    	});
    	$scope.setScroller('chargeCodesList');
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


	$scope.clickedEmail = function(data){
		$scope.closeDialog();
		var sendEmailSuccessCallback = function(successData){
			$scope.$emit('hideLoader');
			$scope.statusMsg = $filter('translate')('EMAIL_SENT_SUCCESSFULLY');
			$scope.status = "success";
			$scope.showEmailSentStatusPopup();
		};
		var sendEmailFailureCallback = function(errorData){
			$scope.$emit('hideLoader');
			$scope.statusMsg = $filter('translate')('EMAIL_SEND_FAILED');
			$scope.status = "alert";
			$scope.showEmailSentStatusPopup();
		};
		$scope.invokeApi(RVBillCardSrv.sendEmail, data, sendEmailSuccessCallback, sendEmailFailureCallback);
	};


	//print bill
	$scope.clickedPrint = function(requestData){
		$scope.closeDialog();
		printBill(requestData);
		scrollToTop();
	};

	var scrollToTop = function() {
			$scope.$parent.myScroll['registration-content'].scrollTo(0, 0, 100);
	};



	// add the print orientation before printing
	var addPrintOrientation = function() {
		$( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
	};

	// add the print orientation after printing
	var removePrintOrientation = function() {
		$( '#print-orientation' ).remove();
	};

	// print the page
	var printBill = function(data) {
		var printDataFetchSuccess = function(successData){
			$scope.isPrintRegistrationCard = false;
			$scope.$emit('hideLoader');
			$scope.printData = successData;
			$scope.errorMessage = "";

			// CICO-9569 to solve the hotel logo issue
			$("header .logo").addClass('logo-hide');
			$("header .h2").addClass('text-hide');

		    // add the orientation
		    addPrintOrientation();

		    /*
		    *	======[ READY TO PRINT ]======
		    */
		    // this will show the popup with full bill
		    $timeout(function() {
		    	/*
		    	*	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
		    	*/

		    	$window.print();
		    	if ( sntapp.cordovaLoaded ) {
		    		cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
		    	};
		    }, 200);

		    /*
		    *	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
		    */

		    $timeout(function() {
				// CICO-9569 to solve the hotel logo issue
				$("header .logo").removeClass('logo-hide');
				$("header .h2").addClass('text-hide');

				// remove the orientation after similar delay
		    	removePrintOrientation();
		    }, 200);

		};

		var printDataFailureCallback = function(errorData){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorData;
		};

		$scope.invokeApi(RVBillCardSrv.fetchBillPrintData, data, printDataFetchSuccess, printDataFailureCallback);
	};

	$scope.printRegistrationCard = function() {
		scrollToTop();

		var sucessCallback = function(data) {

			$scope.isPrintRegistrationCard = true;

			$scope.$emit('hideLoader');
			$scope.printRegCardData = data;
			$scope.errorMessage = "";

			// CICO-25012 - checking for signature dispaly on Reg'n Card PRINT
			if( $scope.reservationBillData.signature_details.is_signed === "true" ){
				$scope.printRegCardData.signature_url = $scope.reservationBillData.signature_details.signed_image;
			}
			else{
				var canvasElement 	= angular.element( document.querySelector('canvas.jSignature'))[0],
					signatureURL 	= (!!canvasElement) ? canvasElement.toDataURL() : '';
				$scope.printRegCardData.signature_url = signatureURL;
			}

			// CICO-9569 to solve the hotel logo issue
			$("header .logo").addClass('logo-hide');
			$("header .h2").addClass('text-hide');

		    // add the orientation
		    addPrintOrientation();

		    /*
		    *	======[ READY TO PRINT ]======
		    */
		    // this will show the popup with full bill
		    $timeout(function() {

		    	/*
		    	*	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
		    	*/
		    	$window.print();
		    	if ( sntapp.cordovaLoaded ) {
		    		cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
		    	};
		    }, 200);

		    /*
		    *	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
		    */
		    $timeout(function() {


				// CICO-9569 to solve the hotel logo issue
				$("header .logo").removeClass('logo-hide');
				$("header .h2").addClass('text-hide');

				// remove the orientation after similar delay
		    	removePrintOrientation();
		    }, 200);

		};

		var failureCallback = function(errorData){
			$scope.isPrintRegistrationCard = false;
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorData;
		};

		$scope.invokeApi(RVBillCardSrv.fetchRegistrationCardPrintData, { 'reservation_id': $scope.reservationBillData.reservation_id }, sucessCallback, failureCallback);
	};


	 $scope.$on('PAYMENT_SUCCESS', function(event,data) {
	 	$scope.signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
	 	var billCount = $scope.reservationBillData.bills.length;
		$scope.isRefreshOnBackToStaycard = true;
		var fetchBillDataSuccessCallback = function(billData){
		 	$scope.$emit('hideLoader');
		 	reservationBillData = billData;
		 	$scope.init(billData);
		 	$scope.calculateBillDaysWidth();
		 	//CICO-10906 review process continues after payment.
			if( (data.bill_balance === 0.0 || data.bill_balance === "0.0") && $scope.isViaReviewProcess ){
				(billCount === data.billNumber) ? $scope.clickedCompleteCheckout() :
						$scope.clickedReviewButton(data.billNumber-1);
			}
		};

		//update the bill screen and handle futher payments
		$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, fetchBillDataSuccessCallback);


	});

	//To update paymentModalOpened scope - To work normal swipe in case if payment screen opened and closed - CICO-8617
	$scope.$on('HANDLE_MODAL_OPENED', function(event) {
		$scope.paymentModalOpened = false;
		$scope.billingInfoModalOpened = false;
	});


	$scope.createNewBill = function(type){
		$scope.movedIndex= $scope.reservationBillData.bills.length;
		var billData ={
			"reservation_id" : $scope.reservationBillData.reservation_id,
			"bill_number" : $scope.reservationBillData.bills.length+1
		};
		/*
		 * Success Callback of move action
		 */
		var createBillSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			//Fetch data again to refresh the screen with new data
			$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, $scope.moveToBillActionfetchSuccessCallback);
			// Update Review status array.
			var data = {};
			data.reviewStatus = false;
			data.billNumber = ($scope.reservationBillData.bills.length+1).toString();
			data.billIndex = $scope.reservationBillData.bills.length;
			$scope.isAllBillsReviewed = false;
			$scope.reviewStatusArray.push(data);


		};
		$scope.invokeApi(RVBillCardSrv.createAnotherBill,billData,createBillSuccessCallback);
	};


	/*
	*Open the terms and conditions dialog after fetching
	*the terms and conditions text from the server
	*/
	$scope.termsAndConditionsClicked = function(){
		$scope.termsAndConditionsText = $sce.trustAsHtml($rootScope.termsAndConditionsText);
		ngDialog.open({
	    		template: '/assets/partials/validateCheckin/rvTermsAndConditionsDialog.html',
	    		className: '',
	    		controller: 'RVTermsAndConditionsDialogCtrl',
	    		scope : $scope
	    	});
	};
	$scope.setScroller('billDays', scrollerOptionForSummary);

	$scope.refreshBillDaysScroller = function(){

		$timeout(function(){
			$scope.refreshScroller('billDays');
		}, 4000);
	};
	$scope.calculateBillDaysWidth = function(){
		angular.forEach(reservationBillData.bills, function(value, key) {
			billDaysWidth = 0;
			angular.forEach(value.days, function(daysValue, daysKey){
				billDaysWidth = parseInt(billDaysWidth) + parseInt(70);
			});
			angular.forEach(value.addons, function(addonsValue, addonsKey){
				billDaysWidth = parseInt(billDaysWidth) + parseInt(70);
			});
			angular.forEach(value.group_items, function(grpValue, grpKey){
				billDaysWidth = parseInt(billDaysWidth) + parseInt(70);
			});
			value.billDaysWidth = billDaysWidth + parseInt(75);//60 for ADD button and space
		});
		$scope.refreshBillDaysScroller();
	};

	$scope.setupReviewStatusArray = function(){

		angular.forEach(reservationBillData.bills, function(value, key) {
			var data = {};
	        // Bill is reviewed(true) or not-reviewed(false).
			data.reviewStatus = false;
			data.billNumber = value.bill_number;
			data.billIndex = key;
			$scope.reviewStatusArray.push(data);
		});
	};

	// Checks whether the user has signed or not
	$scope.isSigned = function() {
            $scope.adjustForUserTime();
		return ($scope.reservationBillData.signature_details.is_signed === "true");
	};

	//Checks whether the user has accepted the charges during web check-in
	$scope.isChargeAccepted = function() {
		return $scope.reservationBillData.is_charges_accepted_from_mobile_web;
	};

	$scope.setupReviewStatusArray();

	$scope.calculateBillDaysWidth();


	$scope.clickedReverseCheckoutButton = function(){

			var reservationId = $scope.reservationBillData.reservation_id,
	    		confirmationNumber = $scope.reservationBillData.confirm_no;

			var reverseCheckoutsuccess = function(data){
				$scope.$emit("hideLoader");

				//if error go to stay card and show popup
				//else go to staycard and refresh
				if(data.status === "success"){
					$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {"id" : reservationId, "confirmationId": confirmationNumber, "isrefresh": true});
				}
				else{
					$scope.reverseCheckoutDetails.data.is_reverse_checkout_failed  = true;
					$scope.reverseCheckoutDetails.data.errormessage= data.message;
					$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {"id" : reservationId, "confirmationId": confirmationNumber});
				};
			};

			var data ={"reservation_id" : $scope.reservationBillData.reservation_id};
			$scope.invokeApi(RVBillCardSrv.completeReverseCheckout,data,reverseCheckoutsuccess);

	};

        $scope.adjustForUserTime = function(){
            if ($scope.reservationBillData.signature_details){
                var str = $scope.reservationBillData.signature_details.signed_time_utc;
                if (str){
                    var newTimeStr = $scope.getAdjustedTimeStr(str);
                    $scope.reservationBillData.signature_details.local_user_time = newTimeStr;//set for use in signature view, to see what time (locally), the signature was aquired
                }
            }
        };
        $scope.getAdjustedTimeStr = function(str){
            var d = new Date();
            var n = d.getTimezoneOffset()/60*-1;//offset from utc
            var splStr = str.split(':');
            var hour = parseInt(splStr[0]);
            var restOfTime = splStr[1];
            var a = restOfTime.split(' ');
            var am = a[1];
            var newTime = hour+n;

            if (newTime <= 0){//so the string doesnt end up being -03, when it should be 10, etc..
                newTime = 12+n;
            }

            var am = newTime < 12 ? 'AM':'PM';

            if (newTime < 10 && newTime > 0){
                newTime = '0'+newTime;
            } else if (newTime === 0){
                newTime = '12';
            }

            return newTime+':'+a[0]+' '+am;
        };

	$scope.$on('moveChargeSuccsess', function() {
		$scope.invokeApi(RVBillCardSrv.fetch, $scope.reservationBillData.reservation_id, $scope.fetchSuccessCallback);
	});

	/**
     * Function to toggle show rate checkbox value
     */
	$scope.clickedShowRate = function(){

		var sucessCallback = function(data){
			$scope.reservationBillData.hide_rates = !$scope.reservationBillData.hide_rates;
			$scope.$emit('hideLoader');
			$scope.errorMessage = "";
		};
		var failureCallback = function(errorData){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorData;
		};
		var data = {
			'reservation_id': $scope.reservationBillData.reservation_id,
			'hide_rates'	: !$scope.reservationBillData.hide_rates
		};
		$scope.invokeApi(RVBillCardSrv.toggleHideRate, data, sucessCallback, failureCallback);
	};


	$scope.$on('PAYMENT_MAP_ERROR',function(event,data){
        $scope.errorMessage = data;
    });

    $scope.showFormatBillPopup = function(billNo) {
    	$scope.billNo = billNo;
    	ngDialog.open({
    		template: '/assets/partials/popups/billFormat/rvBillFormatPopup.html',
    		controller: 'rvBillFormatPopupCtrl',
    		className: '',
    		scope: $scope
    	});
    };

    $scope.showEmailSentStatusPopup = function(status) {
    	ngDialog.open({
    		template: '/assets/partials/popups/rvEmailSentStatusPopup.html',
    		className: '',
    		scope: $scope
    	});
    };

    $scope.closeDialog = function() {
        ngDialog.close();
    };



}]);
