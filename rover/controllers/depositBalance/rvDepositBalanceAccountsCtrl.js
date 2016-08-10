sntRover.controller('RVDepositBalanceAccountsCtrl', ['$scope', 'ngDialog', '$rootScope', 'RVDepositBalanceSrv', 'RVPaymentSrv', '$stateParams', '$filter', '$timeout', 'rvPermissionSrv', 'RVReservationCardSrv',
	function($scope, ngDialog, $rootScope, RVDepositBalanceSrv, RVPaymentSrv , $stateParams, $filter, $timeout, rvPermissionSrv, RVReservationCardSrv) {

	BaseCtrl.call(this, $scope);

	//adding a flag to be set after some timeout to remove flickering action in iPad
	$scope.pageloadingOver = false;
	$timeout(function () {
		$scope.pageloadingOver = true;
	}, 3500);

	$scope.shouldShowWaiting = false;

	// UNCOMMENT IF data.existing_payments PRESENT
	/*angular.forEach($scope.depositBalanceData.data.existing_payments, function (value, key) {
		value.isSelected = false;
		value.mli_token = value.ending_with; //For common payment HTML to work - Payment modifications story
		value.card_expiry = value.expiry_date;//Same comment above
	});*/

    $scope.depositWithGiftCard = false;
	$scope.depositPaidSuccesFully = false;
	$scope.shouldShowExistingCards = true;
	$scope.shouldShowAddNewCard   = true;
	$scope.authorizedCode = "";
	$scope.showExistingAndAddNewPayments = true;
	$scope.showOnlyAddCard = false;
	$scope.cardsList = [];

	// UNCOMMENT IF data.existing_payments PRESENT
	/*angular.forEach($scope.depositBalanceData.data.existing_payments, function (obj, index) {
		if (obj.is_credit_card) {
 		 	$scope.cardsList.push(obj);
		}
	});*/

	//$scope.addmode = ($scope.cardsList.length>0) ? false :true; // UNCOMMENT IF data.existing_payments PRESENT
	$scope.shouldShowMakePaymentButton = true;
	$scope.shouldShowMakePaymentScreen = true;
	$scope.showAddtoGuestCard      = true;
	$scope.shouldCardAvailable     = false;
	$scope.depositBalanceMakePaymentData = {};
	$scope.depositBalanceMakePaymentData.amount = parseFloat($scope.depositBalanceData.current_balance).toFixed(2);
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

	var refreshScroll = function () {
		$timeout(function () {
			$scope.refreshScroller('deopositdue');
		}, 1500);
	};

	var refreshScroll = function () {
		$timeout(function () {
			$scope.refreshScroller('cardsList');
		}, 1500);
	};

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

    /*$scope.$watch('depositBalanceMakePaymentData.payment_type',function (to, from) {
        if (to === 'GIFT_CARD'){
            $scope.depositWithGiftCard = true;
            $scope.showingDepositModal = true;
        } else {
            $scope.depositWithGiftCard = false;
            $scope.showingDepositModal = false;
            //$scope.isGiftCard = false;//removes duplicate card_input fields when toggling between credit card and gift card due to multi-controller use
        }
    });*/

    $scope.giftCardAmountAvailable = false;
    $scope.giftCardAvailableBalance = 0;

    $scope.$on('giftCardAvailableBalance',function(e, giftCardData){
       $scope.giftCardAvailableBalance = giftCardData.amount;
    });

    $scope.timer = null;

    $scope.cardNumberInput = function (n, e) {
        if ($scope.depositWithGiftCard){
            var len = n.length;
            $scope.num = n;
            if (len >= 8 && len <= 22){
                //then go check the balance of the card
                $('[name=card-number]').keydown(function(){
                    clearTimeout($scope.timer);
                    $scope.timer = setTimeout($scope.fetchGiftCardBalance, 1500);
                });
            } else {
                //hide the field and reset the amount stored
                $scope.giftCardAmountAvailable = false;
            }
        }
    };

    $scope.num;

    $scope.fetchGiftCardBalance = function () {
        if ($scope.depositWithGiftCard){
               //switch this back for the UI if the payment was a gift card
           var fetchGiftCardBalanceSuccess = function (giftCardData) {
               $scope.giftCardAvailableBalance = giftCardData.amount;
               $scope.giftCardAmountAvailable = true;
               $scope.$emit('giftCardAvailableBalance',giftCardData);
               //data.expiry_date //unused at this time
               $scope.$emit('hideLoader');
           };
           $scope.invokeApi(RVReservationCardSrv.checkGiftCardBalance, {'card_number':$scope.num}, fetchGiftCardBalanceSuccess);
       } else {
           $scope.giftCardAmountAvailable = false;
       }
    };

	/**
	* function to check whether the user has permission
	* to make payment
	* @return {Boolean}
	*/
	$scope.hasPermissionToMakePayment = function () {
		return rvPermissionSrv.getPermissionValue ('MAKE_PAYMENT');
	};

	/**
	* function to determine the visibility of Make Payment button
	* @return {Boolean}
	*/
	$scope.hideMakePayment = function () {
		return (!$scope.hasPermissionToMakePayment());
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

	if($rootScope.paymentGateway === "sixpayments"){
    	//initilayy C&P ACTIVE
    	$scope.shouldCardAvailable = false;
    	$scope.makePaymentButtonDisabled = false;
    }

	var checkReferencetextAvailableForCC = function () {
		angular.forEach($scope.creditCardTypes, function(value, key) {
			if($scope.depositBalanceMakePaymentData.card_code.toUpperCase() === value.cardcode){
				$scope.isDisplayReference = (value.is_display_reference)? true:false;
			};
		});
	};

	var checkReferencetextAvailableFornonCC = function () {
		angular.forEach($scope.passData.details.paymentTypes, function(value, key) {
			if(value.name === $scope.depositBalanceMakePaymentData.payment_type){
				$scope.isDisplayReference =  (value.is_display_reference)? true:false;

				// To handle fees details on reservation summary,
				// While we change payment methods
				// Handling Credit Cards seperately.
				if(value.name !== "CC" && value.name !== "GIFT_CARD"){
					$scope.feeData.feesInfo = value.charge_code.fees_information;
					$scope.setupFeeData();
				}
			}
		});
	};


        $scope.setupGiftCardParams = function(){
             if(!$rootScope.isStandAlone){
                        $scope.initFromCashDeposit = true;
                    }
                    $rootScope.$broadcast('giftCardSelected');
                    $scope.shouldShowIframe = false;
                    $rootScope.depositUsingGiftCard = true;
                    $scope.depositWithGiftCard = true;
        };
        $scope.hideGiftCardFields = function(){
            $scope.depositWithGiftCard = false;
            $rootScope.depositUsingGiftCard = false;
        };


	$scope.changePaymentType = function () {
            var depositType = $scope.depositBalanceMakePaymentData.payment_type;

            if(depositType === "CC" || depositType === "GIFT_CARD"){
                    if (depositType === "CC"){
                        $scope.shouldShowIframe = true;
                        $rootScope.$broadcast('creditCardSelected');

                    }
                    if (depositType === "GIFT_CARD"){
                        $scope.setupGiftCardParams();

                    } else {
                        $scope.hideGiftCardFields();
                    }
                    if($rootScope.paymentGateway !== "sixpayments"){
                            $scope.shouldShowMakePaymentScreen       = false;
                            $scope.shouldShowExistingCards =  ($scope.cardsList.length>0) ? true :false;
                            $scope.addmode = ($scope.cardsList.length>0) ? false :true;

                    if (depositType === "GIFT_CARD"){
                        $scope.shouldShowExistingCards = false;
                        $scope.addmode = false;
                    }

                            refreshScroll();
                    } else {
                            $scope.isManual = false;
                    }
            } else {
                $scope.shouldShowMakePaymentScreen       = true;
                $scope.hideCreditCardFields();
                checkReferencetextAvailableFornonCC();
                $scope.hideGiftCardFields();
            };
            $rootScope.$emit('depositUsingGiftCardChange');
	};

        $scope.hideCreditCardFields = function(){
            $scope.addmode                          = false;
            $scope.shouldShowExistingCards          = false;
            $scope.shouldCardAvailable              = false;
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

	/*
	 * on succesfully created the token
	 */
	$scope.$on("TOKEN_CREATED", function (e, tokenDetails) {
		$scope.cardValues = tokenDetails;
	    var cardExpiry = "";
	    if(!$scope.cardValues.tokenDetails.isSixPayment){
	    	cardExpiry = ($scope.cardValues.cardDetails.expiryMonth!=='' && $scope.cardValues.cardDetails.expiryYear!=='') ? "20"+$scope.cardValues.cardDetails.expiryYear+"-"+$scope.cardValues.cardDetails.expiryMonth+"-01" : "";
	    	//To render the selected card data
	    	$scope.depositBalanceMakePaymentData.card_code = getCreditCardType($scope.cardValues.cardDetails.cardType).toLowerCase();
	    	checkReferencetextAvailableForCC();
	    	$scope.depositBalanceMakePaymentData.ending_with = $scope.cardValues.cardDetails.cardNumber.substr($scope.cardValues.cardDetails.cardNumber.length - 4);;
		    var dataToApiToAddNewCard = {
		          	"token" : $scope.cardValues.tokenDetails.session,
		          	"card_name" :$scope.cardValues.cardDetails.userName,
		          	"card_expiry": cardExpiry,
		          	"payment_type": "CC"
		   };
		}
		else {
			cardExpiry = ($scope.cardValues.tokenDetails.expiry!=='') ? "20"+$scope.cardValues.tokenDetails.expiry.substring(0, 2)+"-"+$scope.cardValues.tokenDetails.expiry.substring(2, 4)+"-01" : "";
			$scope.shouldShowIframe 	   			 = false;
			$scope.shouldShowMakePaymentScreen       = true;
			$scope.showAddtoGuestCard    			 = false;
			$scope.shouldShowExistingCards  		 = false;
			$scope.addmode                 			 = false;
			$scope.makePaymentButtonDisabled         = false;
			$scope.shouldCardAvailable 				 = true;

			//To render the selected card data
			$scope.depositBalanceMakePaymentData.card_code = getSixCreditCardType($scope.cardValues.tokenDetails.card_type).toLowerCase();
			 $scope.depositBalanceMakePaymentData.ending_with = $scope.cardValues.tokenDetails.token_no.substr($scope.cardValues.tokenDetails.token_no.length - 4);;

		     var dataToApiToAddNewCard = {
		          	"token" : $scope.cardValues.tokenDetails.token_no,
		          	"card_name" :$scope.passData.details.firstName+" "+$scope.passData.details.lastName,
		          	"card_expiry": cardExpiry,
		          	"payment_type": "CC"
		   };
		}
		dataToApiToAddNewCard.card_code = (!$scope.cardValues.tokenDetails.isSixPayment)?
										$scope.cardValues.cardDetails.cardType :
										getSixCreditCardType($scope.cardValues.tokenDetails.card_type).toLowerCase();
		$scope.depositBalanceMakePaymentData.card_expiry = $scope.cardValues.tokenDetails.isSixPayment?
					$scope.cardValues.tokenDetails.expiry.substring(2, 4)+" / "+$scope.cardValues.tokenDetails.expiry.substring(0, 2):
					$scope.cardValues.cardDetails.expiryMonth+" / "+$scope.cardValues.cardDetails.expiryYear;
      	$scope.invokeApi(RVPaymentSrv.savePaymentDetails, dataToApiToAddNewCard, $scope.successSavePayment);
	});

	$scope.$on("MLI_ERROR", function (e,data) {
		$scope.errorMessage = data;
	});

	$scope.feeData = {};
	var zeroAmount = parseFloat("0.00");

	// CICO-11591 : To show or hide fees calculation details.
	$scope.isShowFees = function () {
		var isShowFees = false;
		var feesData = $scope.feeData;
		if(typeof feesData === 'undefined' || typeof feesData.feesInfo === 'undefined' || feesData.feesInfo === null){
			isShowFees = false;
		}
		else if((feesData.defaultAmount  >= feesData.minFees) && $scope.isStandAlone && feesData.feesInfo.amount){
			if($scope.depositBalanceMakePaymentData.amount >= 0){
				isShowFees = (($rootScope.paymentGateway !== 'sixpayments' || $scope.isManual || $scope.depositBalanceMakePaymentData.payment_type !=='CC') && $scope.depositBalanceMakePaymentData.payment_type !=="") ? true:false;
			}
		}
		return isShowFees;
	};

	// CICO-9457 : To calculate fee
	$scope.calculateFee = function () {
		if($scope.isStandAlone){
			var feesInfo = $scope.feeData.feesInfo;
			var amountSymbol = "";
			var feePercent  = zeroAmount;
			var minFees = zeroAmount;

			if (typeof feesInfo !== 'undefined' && feesInfo !== null){
				amountSymbol = feesInfo.amount_symbol;
				feePercent  = feesInfo.amount ? parseFloat(feesInfo.amount) : zeroAmount;
				minFees = feesInfo.minimum_amount_for_fees ? parseFloat(feesInfo.minimum_amount_for_fees) : zeroAmount;
			}

			var totalAmount = ($scope.depositBalanceMakePaymentData.amount === "") ? zeroAmount :
							parseFloat($scope.depositBalanceMakePaymentData.amount);

			$scope.feeData.minFees = minFees;
			$scope.feeData.defaultAmount = totalAmount;

			if($scope.isShowFees()){
				if(amountSymbol === "percent"){
					var calculatedFee = parseFloat(totalAmount * (feePercent/100));
					$scope.feeData.calculatedFee = parseFloat(calculatedFee).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(calculatedFee + totalAmount).toFixed(2);
				}
				else{
					$scope.feeData.calculatedFee = parseFloat(feePercent).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(totalAmount + feePercent).toFixed(2);
				}
			}

			if($scope.depositBalanceMakePaymentData.amount < 0){
				$scope.refundAmount = (-1)*parseFloat($scope.depositBalanceMakePaymentData.amount);
				$scope.shouldShowMakePaymentButton = false;
			} else {
				$scope.shouldShowMakePaymentButton = true;
			}
		}
	};

	// CICO-9457 : Data for fees details.
	$scope.setupFeeData = function () {
		var feesInfo = $scope.feeData.feesInfo ? $scope.feeData.feesInfo : {};
		var defaultAmount = $scope.depositBalanceMakePaymentData ?
		 	parseFloat($scope.depositBalanceMakePaymentData.amount) : zeroAmount;

		var minFees = feesInfo.minimum_amount_for_fees ? parseFloat(feesInfo.minimum_amount_for_fees) : zeroAmount;
		$scope.feeData.minFees = minFees;
		$scope.feeData.defaultAmount = defaultAmount;

		if($scope.isShowFees()){
			if(typeof feesInfo.amount !== 'undefined' && feesInfo!== null){

				var amountSymbol = feesInfo.amount_symbol;
				var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount) : zeroAmount;
				$scope.feeData.actualFees = feesAmount;

				if(amountSymbol === "percent") {
					$scope.calculateFee();
				}
				else{
					$scope.feeData.calculatedFee = parseFloat(feesAmount).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(feesAmount + defaultAmount).toFixed(2);
				}
			}
		}
	};

	// CICO-12408 : To calculate Total of fees and amount to pay.
	$scope.calculateTotalAmount = function (amount) {
		var feesAmount  = (typeof $scope.feeData.calculatedFee === 'undefined' || $scope.feeData.calculatedFee === '' || $scope.feeData.calculatedFee === '-') ? zeroAmount : parseFloat($scope.feeData.calculatedFee);
		var amountToPay = (typeof amount === 'undefined' || amount ==='') ? zeroAmount : parseFloat(amount);

		$scope.feeData.totalOfValueAndFee = parseFloat(amountToPay + feesAmount).toFixed(2);
	};

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
	 * call make payment API on clicks select payment
	 */
	$scope.clickedMakePayment = function () {

		var dataToSrv = {
			"postData": {
				"payment_type": $scope.depositBalanceMakePaymentData.payment_type,
				"amount": $scope.depositBalanceMakePaymentData.amount,
				"payment_method_id": $scope.paymentId
				},
			"bill_id": $scope.depositBalanceData.primary_bill_id
		};

		if($scope.isShowFees()){
			if($scope.feeData.calculatedFee) {
				dataToSrv.postData.fees_amount = $scope.feeData.calculatedFee;
			}
			if($scope.feeData.feesInfo) {
				dataToSrv.postData.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
			}
		};

		$scope.invokeApi(RVDepositBalanceSrv.submitPaymentOnBill, dataToSrv, $scope.successMakePayment);
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
	};

	$scope.closeDepositModal = function () {
		$scope.$emit("UPDATE_DEPOSIT_BALANCE_FLAG", false);
		$scope.closeDialog();
	};

	/*
	 * Make payment button success
	 * Update balance data in staycard
	 * closing the modal
	 */
	$scope.successMakePayment = function (data) {
		$scope.$emit("hideLoader");

		if($rootScope.paymentGateway === "sixpayments" && $scope.isManual){
			$scope.authorizedCode = data.authorization_code;
		}

		$scope.depositPaidSuccesFully = true;

        //To update the balance in accounts
        $scope.$emit("BALANCE_AFTER_PAYMENT", data.current_balance);

		ngDialog.close();

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
		$scope.paymentId = $scope.depositBalanceData.data.existing_payments[index].value;

		$scope.depositBalanceMakePaymentData.card_code = $scope.depositBalanceData.data.existing_payments[index].card_code;
		$scope.depositBalanceMakePaymentData.ending_with  = $scope.depositBalanceData.data.existing_payments[index].ending_with;
		$scope.depositBalanceMakePaymentData.card_expiry = $scope.depositBalanceData.data.existing_payments[index].card_expiry;
		checkReferencetextAvailableForCC();

		if ($scope.isStandAlone) {
			// Setup fees info
			// UNCOMMENT IF data.existing_payments PRESENT
			//$scope.feeData.feesInfo = dclone($scope.depositBalanceData.data.existing_payments[index].fees_information,[]);;
			//$scope.setupFeeData();
		}
	};

	/*
	 * Card selected from centralized controler
	 */
	$scope.$on('cardSelected',function (e, data) {
		$scope.shouldCardAvailable 				 = true;
		$scope.setCreditCardFromList(data.index);
	});

	$scope.showAddCardSection = function () {
		$scope.shouldShowIframe 	   			 = false;
		$scope.shouldShowMakePaymentScreen       = false;
		$scope.showAddtoGuestCard    			 = false;
		$scope.shouldShowExistingCards  		 = true;
		$scope.addmode                 			 = false;
		$scope.makePaymentButtonDisabled         = false;
		refreshScroll();
	};

	$scope.$on('cancelCardSelection',function (e,data) {
		$scope.shouldShowMakePaymentScreen       = true;
		$scope.addmode                 			 = false;
		$scope.depositBalanceMakePaymentData.payment_type = "";
		$scope.isManual = false;
	});

	$scope.$on("SHOW_SWIPED_DATA_ON_DEPOSIT_BALANCE_SCREEN", function (e, swipedCardDataToRender){
		$scope.shouldShowMakePaymentScreen       = false;
		$scope.addmode                 			 = true;
		$rootScope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
		//Not good
		$scope.swipedCardHolderName = swipedCardDataToRender.nameOnCard;
	});

	$scope.$on("SWIPED_DATA_TO_SAVE", function (e, swipedCardDataToSave){
		$scope.depositBalanceMakePaymentData.card_code   = swipedCardDataToSave.cardType.toLowerCase();
		$scope.depositBalanceMakePaymentData.ending_with = swipedCardDataToSave.cardNumber.slice(-4);
		$scope.depositBalanceMakePaymentData.card_expiry  = swipedCardDataToSave.cardExpiryMonth+"/"+swipedCardDataToSave.cardExpiryYear;
		$scope.depositBalanceMakePaymentData.payment_type = "CC";

		$scope.isSwipedCardSave = true;

		var data 			= swipedCardDataToSave;
		data.payment_credit_type = swipedCardDataToSave.cardType;
		data.credit_card = swipedCardDataToSave.cardType;
		data.card_expiry = "20"+swipedCardDataToSave.cardExpiryYear+"-"+swipedCardDataToSave.cardExpiryMonth+"-01";

		$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, $scope.successSavePayment);
	});

	//CICO-12488
	$scope.changePaymentType();

    /**
    * Set this value as true always as we have not implemented permission
    * based SR view rate functionality in accounts
    */
    $scope.isBalanceAmountShown = function() {
        return true;
    }
}]);