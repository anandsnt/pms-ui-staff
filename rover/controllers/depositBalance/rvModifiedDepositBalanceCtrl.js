sntRover.controller('RVDepositBalanceCtrl',[
					'$scope',
					'ngDialog',
					'$rootScope',
					'RVDepositBalanceSrv',
					'RVPaymentSrv',
					'$stateParams',
					'$filter',
					'$timeout',
					'rvPermissionSrv',
                    'RVReservationCardSrv',
		function($scope,
				ngDialog,
				$rootScope,
				RVDepositBalanceSrv,
				RVPaymentSrv,
				$stateParams,
				$filter,
				$timeout, rvPermissionSrv, RVReservationCardSrv){

	BaseCtrl.call(this, $scope);

	//adding a flag to be set after some timeout to remove flickering action in iPad
	$scope.pageloadingOver = false;
	$timeout(function() {
		$scope.pageloadingOver = true;
	}, 3500);

	$scope.shouldShowWaiting = false;
	$scope.$emit("UPDATE_DEPOSIT_BALANCE_FLAG", true);

	angular.forEach($scope.depositBalanceData.data.existing_payments, function (value, key) {
		value.isSelected = false;
		value.mli_token = value.ending_with; //For common payment HTML to work - Payment modifications story
		value.card_expiry = value.expiry_date;//Same comment above
	});

    $scope.depositWithGiftCard = false;
	$scope.depositPaidSuccesFully = false;
	$scope.shouldShowExistingCards = true;
	$scope.shouldShowAddNewCard   = true;
	$scope.authorizedCode = "";
	$scope.showExistingAndAddNewPayments = true;
	$scope.showOnlyAddCard = false;
	$scope.cardsList =[];

	angular.forEach($scope.depositBalanceData.data.existing_payments, function (obj, index) {
		if (obj.is_credit_card) {
 		 	$scope.cardsList.push(obj);
		}
	});

	$scope.addmode = ($scope.cardsList.length>0) ? false :true;
	$scope.shouldShowMakePaymentButton = true;
	$scope.shouldShowMakePaymentScreen = true;
	$scope.showAddtoGuestCard      = true;
	$scope.shouldCardAvailable     = false;
	$scope.depositBalanceMakePaymentData = {};
	$scope.depositBalanceMakePaymentData.amount = parseFloat($scope.depositBalanceData.data.balance_deposit_amount).toFixed(2);
	$scope.refundAmount = 0;

	if ($scope.depositBalanceMakePaymentData.amount < 0) {
		$scope.refundAmount = (-1) * parseFloat($scope.depositBalanceMakePaymentData.amount);
		$scope.shouldShowMakePaymentButton = false;
	}

	$scope.depositBalanceMakePaymentData.add_to_guest_card = false;
	$scope.makePaymentButtonDisabled = true;
	$scope.isDisplayReference = false;
	$scope.referanceText = "";

	//To show add to guest card checkbox
	$scope.isAddToGuestCardVisible = false;
	$scope.isSwipedCardSave = false;
	$scope.isManual = false;
	$scope.setScroller('cardsList',{'click':true, 'tap':true});
	$scope.setScroller('deopositdue');
    $scope.setScroller('payment-deposit-scroll');

	var refreshScroll = function() {
		$timeout(function() {
			$scope.refreshScroller('deopositdue');
		}, 1500);
	};

	var refreshScroll = function() {
		$timeout(function() {
			$scope.refreshScroller('cardsList');
		}, 1500);
	};

    var refreshPaymentScroll = function() {
        setTimeout(function(){
                $scope.refreshScroller('payment-deposit-scroll');
        }, 500);

    };

	$scope.reservationData.reservation_card.payment_method_used = ($scope.reservationData.reservation_card.payment_method_used) ? $scope.reservationData.reservation_card.payment_method_used :"";
    $scope.validPayment = true;

	$scope.disableMakePayment = function () {
        if (!$scope.validPayment){
            return false;
        }
        else {
			if (typeof $scope.depositBalanceMakePaymentData.payment_type !== "undefined") {
				return ($scope.depositBalanceMakePaymentData.payment_type.length > 0) ? false :true;
			}
			else {
				return true;
			}
	    }
	};

    $scope.showingDepositModal = false;

	/**
	* function to check whether the user has permission
	* to make payment
	* @return {Boolean}
	*/
	$scope.hasPermissionToMakePayment = function () {
		return rvPermissionSrv.getPermissionValue ('MAKE_PAYMENT');
	};

	/*
	 * class based on the make payment button status
	 */
	$scope.showMakePaymentButtonStatus = function () {
		var buttonClass = "";
		if(typeof $scope.depositBalanceMakePaymentData.payment_type !== "undefined"){
			buttonClass = ($scope.depositBalanceMakePaymentData.payment_type.length > 0 && $scope.validPayment) ? "green" :"grey";
		}else {
                    if (!$scope.validPayment){
			buttonClass = "grey overlay";
                    } else {
			buttonClass = "grey";
                    }
		};
		return buttonClass;
	};

	$scope.showRefundButtonStatus = function () {
		var buttonClass = "";
		if(typeof $scope.depositBalanceMakePaymentData.payment_type !== "undefined"){
			buttonClass = ($scope.depositBalanceMakePaymentData.payment_type.length > 0) ? "blue" :"grey";
		}else {
			buttonClass = "grey";
		};
		return buttonClass;
	};


	if($scope.reservationData.reservation_card.payment_method_used === "CC" || $scope.reservationData.reservation_card.payment_method_used === 'GIFT_CARD'){
		$scope.shouldCardAvailable = true;
		$scope.depositBalanceMakePaymentData.payment_type = "CC";
                if ($scope.reservationData.reservation_card.payment_method_used === 'GIFT_CARD'){
                    $scope.depositBalanceMakePaymentData.payment_type = "GIFT_CARD";
                }
		$scope.depositBalanceMakePaymentData.card_code = $scope.reservationData.reservation_card.payment_details.card_type_image.replace(".png", "");
		$scope.depositBalanceMakePaymentData.ending_with = $scope.reservationData.reservation_card.payment_details.card_number;
		$scope.depositBalanceMakePaymentData.card_expiry = $scope.reservationData.reservation_card.payment_details.card_expiry;
		$scope.paymentId = $scope.reservationData.reservation_card.payment_details.id;
	}
	else{
        // Please check CICO-12046
        if($scope.isStandAlone){
                $scope.depositBalanceMakePaymentData.payment_type = angular.copy($scope.reservationData.reservation_card.payment_method_used);
        }
	};


        $scope.showSixPayCardInput = function(){
           if ($scope.paymentGateway == 'sixpayments' &&
                   $scope.depositBalanceMakePaymentData.payment_type == 'CC' &&
                   $scope.shouldShowMakePaymentScreen &&
                   !$scope.depositPaidSuccesFully && !$scope.depositWithGiftCard
            ) { return true;} else return false;
        };
        $scope.showCCPage = false;
        $scope.showPaymentTypeBox = function(v){
            $scope.showCCPage = !v;
        };

	$scope.changeOnsiteCallIn = function () {
		$scope.shouldShowMakePaymentScreen = ($scope.isManual) ? false:true;
		$scope.shouldShowExistingCards =  ($scope.cardsList.length>0) ? true :false;
		$scope.addmode = ($scope.cardsList.length>0) ? false :true;
		//in case c&p no need to show attached CC
		$scope.shouldCardAvailable = ($scope.shouldShowMakePaymentScreen) ? false: true;
		refreshScroll();
	};
	//to trigger from sixpayment partial
	$scope.$on('changeOnsiteCallIn', function(event){
	    $scope.isManual =  !$scope.isManual;
	    $scope.changeOnsiteCallIn();
	});


	$scope.feeData = {};



    $scope.emitCancelCardSelection = function () {
        if(!$rootScope.isStandAlone){
                ngDialog.close();
        }
        $scope.depositWithGiftCard = false;
        $scope.$emit('cancelCardSelection');
        $scope.cardselectedIndex = -1;

        //in case of hotel with MLI iframe will not be present
        if(!!$("#sixIframe").length){
            var iFrame = document.getElementById('sixIframe');
            iFrame.src = iFrame.src;
        };
    };

	/*
	 * On saving new card success
	 * show the make payment screen and make payment button active
	 * setting payment id
	 */
    $scope.giftCardAvailableBalance = '';
    $scope.$on('giftCardAvailableBalance',function (e, giftCardData) {
        $scope.giftCardAvailableBalance = giftCardData.amount;
        $scope.giftCardAmountAvailable = true;
    });

    $rootScope.$on('validatedGiftCardPmt',function (n, valid) {
        if (valid){
           $scope.validPayment = true;
       } else {
           $scope.validPayment = false;
       }
    });

    $scope.updatedAmountToPay = function (amt) {
        //used if checking against gift card balance
           if ($scope.depositBalanceMakePaymentData.payment_type === 'GIFT_CARD'){
               var bal = $scope.giftCardAvailableBalance;
            if (bal){
                var avail = parseFloat(bal).toFixed(2);
                var toPay = parseFloat(amt).toFixed(2);
                avail = parseFloat(avail);
                toPay = parseFloat(toPay);
                if (avail < toPay){
                    $scope.validPayment = false;
                } else {
                    $scope.validPayment = true;
                }
            }
        } else {
            $scope.validPayment = true;
        }
        $rootScope.$broadcast('validatedGiftCardPmt',$scope.validPayment);
    };

	$scope.successSavePayment = function (data) {
	    $scope.$emit("hideLoader");
		$scope.shouldShowIframe 	   			 = false;
		$scope.shouldShowMakePaymentScreen       = true;
		$scope.showAddtoGuestCard    			 = false;
		$scope.shouldShowExistingCards  		 = false;
		$scope.addmode                 			 = false;
		$scope.makePaymentButtonDisabled         = false;
		$scope.paymentId = data.id;
		$scope.shouldCardAvailable 				 = true;
		$scope.isAddToGuestCardVisible 			 = true;
		//CICO-25882 - Fixing the issue of make payment btn not visible
		refreshPaymentScroll();
	};

	$scope.closeDepositModal = function () {
		$scope.$emit("UPDATE_DEPOSIT_BALANCE_FLAG", false);
		$scope.closeDialog();
	};

	$scope.$on("CLOSE_DIALOG", function() {
		$scope.closeDepositModal();
	});

	/*
	 * Make payment button success
	 * Update balance data in staycard
	 * closing the modal
	 */
	$scope.successMakePayment = function (data) {
		$scope.$emit("hideLoader");
        $scope.errorMessage = [];
		if($scope.reservationData.reservation_card.is_rates_suppressed === "false" || $scope.reservationData.reservation_card.is_rates_suppressed === false){
			$scope.reservationData.reservation_card.deposit_attributes.outstanding_stay_total = parseInt($scope.reservationData.reservation_card.deposit_attributes.outstanding_stay_total) - parseInt($scope.depositBalanceMakePaymentData.amount);

		}

		if ($scope.isAddToGuestCardVisible) {
			var cardCode = $scope.depositBalanceMakePaymentData.card_code.toLowerCase();
			var cardNumber = $scope.depositBalanceMakePaymentData.ending_with;
			var cardName = "";
			if($scope.isSwipedCardSave){
				cardName = $scope.swipedCardHolderName;
			} else {
				cardName = ($scope.cardValues.tokenDetails.isSixPayment) ? $scope.passData.details.firstName+" "+$scope.passData.details.lastName: $scope.cardValues.cardDetails.userName;
			}

			var dataToGuestList = {
				"card_code": cardCode,
				"mli_token": cardNumber,
				"card_expiry": $scope.depositBalanceMakePaymentData.card_expiry,
				"card_name": cardName,
				"id": $scope.paymentId,
				"isSelected": true,
				"is_primary":false,
				"payment_type":"CC",
				"payment_type_id": 1
			};
			$scope.cardsList.push(dataToGuestList);
			$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', dataToGuestList);
		}

		if($rootScope.paymentGateway === "sixpayments" && $scope.isManual){
			$scope.authorizedCode = data.authorization_code;
		}

		$scope.depositPaidSuccesFully = true;

		ngDialog.close();
		$rootScope.$broadcast("UPDATE_DEPOSIT_BALANCE", data);
		// Update reservation type
		$rootScope.$broadcast('UPDATERESERVATIONTYPE', data.reservation_type_id);
		$rootScope.$broadcast('UPDATE_DEPOSIT_BALANCE_FLAG', false);
	};

    $scope.onPaymentFailure = function(data) {
        $scope.$emit("hideLoader");
        $scope.errorMessage = data;
    };

	/*
	 * Show the selected cards list in make payment screen
	 */
	$scope.setCreditCardFromList = function (index) {
		$scope.shouldShowIframe 	   			 = false;
		$scope.shouldShowMakePaymentScreen       = true;
		$scope.showAddtoGuestCard    			 = false;
		$scope.shouldShowExistingCards  		 = false;
		$scope.addmode                 			 = false;
		$scope.makePaymentButtonDisabled         = false;
		$scope.shouldCardAvailable 				 = true;
		$scope.isAddToGuestCardVisible 			 = false;
		$scope.paymentId = $scope.depositBalanceData.data.existing_payments[index].value;

		$scope.depositBalanceMakePaymentData.card_code = $scope.depositBalanceData.data.existing_payments[index].card_code;
		$scope.depositBalanceMakePaymentData.ending_with  = $scope.depositBalanceData.data.existing_payments[index].ending_with;
		$scope.depositBalanceMakePaymentData.card_expiry = $scope.depositBalanceData.data.existing_payments[index].card_expiry;
		checkReferencetextAvailableForCC();

		if ($scope.isStandAlone) {
			// Setup fees info
			$scope.feeData.feesInfo = dclone($scope.depositBalanceData.data.existing_payments[index].fees_information,[]);;
			$scope.setupFeeData();
		}
	};

	/*
	 * Card selected from centralized controler
	 */
	$scope.$on('cardSelected',function (e, data) {
		$scope.shouldCardAvailable = true;
		$scope.setCreditCardFromList(data.index);
                $scope.showPaymentTypeBox(true);
        refreshPaymentScroll();
	});

	$scope.showAddCardSection = function () {
		$scope.shouldShowIframe 	   			 = false;
		$scope.shouldShowMakePaymentScreen       = false;
		$scope.showAddtoGuestCard    			 = false;
		$scope.shouldShowExistingCards  		 = true;
		$scope.addmode                 			 = false;
		$scope.makePaymentButtonDisabled         = false;

                $scope.showPaymentTypeBox(false);
		refreshScroll();
	};

	$scope.$on('cancelCardSelection',function (e,data) {
		$scope.shouldShowMakePaymentScreen       = true;
                $scope.addmode = false;
		$scope.depositBalanceMakePaymentData.payment_type = "";
                $scope.showPaymentTypeBox(true);
                $scope.isManual = false;
	});

	//Listen to swipe events
	$scope.$on("SHOW_SWIPED_DATA_ON_DEPOSIT_BALANCE_SCREEN", function(e, swipedCardDataToRender){
		$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
	});

}]);