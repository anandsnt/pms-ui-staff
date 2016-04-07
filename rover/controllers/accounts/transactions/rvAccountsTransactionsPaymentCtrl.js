sntRover.controller('RVAccountsTransactionsPaymentCtrl',	[
	'$scope',
	'$rootScope','RVPaymentSrv','ngDialog','$filter', '$timeout', 'rvAccountTransactionsSrv','rvPermissionSrv', 'RVReservationCardSrv',
	function($scope, $rootScope,RVPaymentSrv,ngDialog,$filter, $timeout, rvAccountTransactionsSrv,rvPermissionSrv, RVReservationCardSrv) {

		BasePaymentCtrl.call(this, $scope);
		$scope.renderData = {};
		$scope.swipedCardDataToSave  = {};
		$scope.showArSelection = false;
		var isSixPayment  = false;
		var tokenDetails  = {};
		var cardDetails   = {};
		var zeroAmount = parseFloat("0.00");
		$scope.feeData = {};

		/**
		* function to check whether the user has permission
		* to make payment
		* @return {Boolean}
		*/
		var hasPermissionToMakePayment = function() {
			return rvPermissionSrv.getPermissionValue ('POST_PAYMENT');
		};

		/**
		* function to check whether the user has permission
		* to refund payment
		* @return {Boolean}
		*/
		var hasPermissionToRefundPayment = function() {
			return rvPermissionSrv.getPermissionValue ('POST_REFUND');
		};
                 $scope.$on('isGiftCardPmt',function(v){
                     $scope.isGiftCardPmt = v;
                 });

		var init = function(){
			$scope.saveData = {};
			$scope.renderData = {};
			$scope.errorMessage = '';
			$scope.saveData.payment_type_id = '';
			$scope.newPaymentInfo = {};
			$scope.renderData.billNumberSelected = '';
			$scope.renderData.defaultPaymentAmount = '';
			$scope.defaultRefundAmount = 0;
			//We are passing $scope from bill to this modal
			$scope.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
			$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
			$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
			$scope.billsArray = $scope.transactionsDetails.bills;
			//common payment model items
			$scope.passData = {};
			$scope.passData.details = {};
			$scope.renderData.referanceText = "";
			$scope.swipedCardDataToSave  = {};
			$scope.cardData = {};
			$scope.newCardAdded = false;
			$scope.shouldShowWaiting = false;
			$scope.depositPaidSuccesFully = false;
			$scope.saveData.paymentType = '';
			$scope.defaultPaymentTypeOfBill = '';
			$scope.shouldShowMakePaymentButton = true;
			$scope.hasPermissionToMakePayment = hasPermissionToMakePayment();
			$scope.hasPermissionToRefundPayment = hasPermissionToRefundPayment();
		};
		init();


		/**
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};

		/*
		* Disable payment button if no payment type is selected
		*
		*/

		$scope.disableMakePayment = function(){
			return ($scope.saveData.paymentType.length > 0) ? false : true;
		};

		/*
		* Fee processing starts here
		*
		*/


		$scope.isShowFees = function(){

			// the fees is not shown if feeData is undefined or
			// default amount < min fees or no fee amount

			var isShowFees = false;
			var feesData = $scope.feeData;
			if(typeof feesData === 'undefined' || typeof feesData.feesInfo === 'undefined' || feesData.feesInfo === null){
				isShowFees = false;
			}
			else if((feesData.defaultAmount  >= feesData.minFees) && feesData.feesInfo.amount){
				if($scope.renderData.defaultPaymentAmount >= 0){
					isShowFees = (($rootScope.paymentGateway !== 'sixpayments' || $scope.isManual || $scope.saveData.paymentType !=='CC') && $scope.saveData.paymentType !=="") ? true :false;
				}
			}
			return isShowFees;
		};

		/*
		* Fee calculation (based on payment type selection)
		*
		*/

		$scope.calculateFee = function(){

				var feesInfo = $scope.feeData.feesInfo;
				var amountSymbol = "";
				var feePercent  = zeroAmount;
				var minFees = zeroAmount;

				if (typeof feesInfo !== 'undefined' && feesInfo !== null){
					amountSymbol = feesInfo.amount_symbol;
					feePercent  = feesInfo.amount ? parseFloat(feesInfo.amount) : zeroAmount;
					minFees = feesInfo.minimum_amount_for_fees ? parseFloat(feesInfo.minimum_amount_for_fees) : zeroAmount;
				}

				var totalAmount = ($scope.renderData.defaultPaymentAmount === "") ? zeroAmount :
								parseFloat($scope.renderData.defaultPaymentAmount);

				$scope.feeData.minFees = minFees;
				$scope.feeData.defaultAmount = totalAmount;

				if($scope.isShowFees()){
					if(amountSymbol === "percent"){
						//calculation in case fee is percentage
						var calculatedFee = parseFloat(totalAmount * (feePercent/100));
						$scope.feeData.calculatedFee = parseFloat(calculatedFee).toFixed(2);
						$scope.feeData.totalOfValueAndFee = parseFloat(calculatedFee + totalAmount).toFixed(2);
					}
					else{
						//calculation in case fee is amount
						$scope.feeData.calculatedFee = parseFloat(feePercent).toFixed(2);
						$scope.feeData.totalOfValueAndFee = parseFloat(totalAmount + feePercent).toFixed(2);
					}
				}
				//set button as refund in case of -ve amount
				if($scope.renderData.defaultPaymentAmount < 0){
					$scope.defaultRefundAmount = (-1)*parseFloat($scope.renderData.defaultPaymentAmount);
					$scope.shouldShowMakePaymentButton = false;
				} else {

					$scope.shouldShowMakePaymentButton = true;
				}
		};

		var setupFeeData = function(){

				var feesInfo = $scope.feeData.feesInfo ? $scope.feeData.feesInfo : {};
				var defaultAmount = $scope.renderData ?
				 	parseFloat($scope.renderData.defaultPaymentAmount) : zeroAmount;

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

		$scope.calculateTotalAmount = function(amount) {

			var feesAmount  = (typeof $scope.feeData.calculatedFee === 'undefined' || $scope.feeData.calculatedFee === '' || $scope.feeData.calculatedFee === '-') ? zeroAmount : parseFloat($scope.feeData.calculatedFee);
			var amountToPay = (typeof amount === 'undefined' || amount ==='') ? zeroAmount : parseFloat(amount);

			$scope.feeData.totalOfValueAndFee = parseFloat(amountToPay + feesAmount).toFixed(2);
		};

		var checkforFee = function(){
			_.each($scope.renderData.paymentTypes, function(value) {
				  if(value.name !== "CC" 	&& value.name === $scope.saveData.paymentType){
						$scope.feeData.feesInfo = value.charge_code.fees_information;
						setupFeeData();
				  };
			});
		};

		/*
		* to check if reference is present for payment type
		*/
		var checkReferencetextAvailable = function(){
			//call utils fn
			$scope.referenceTextAvailable = checkIfReferencetextAvailable($scope.renderData.paymentTypes,$scope.saveData.paymentType);

		};
		var checkReferencetextAvailableForCC = function(){
			//call utils fn
			$scope.referenceTextAvailable = checkIfReferencetextAvailableForCC($scope.renderData.paymentTypes,$scope.defaultPaymentTypeCard);
		};


		/*
		 * Show guest credit card list
		 */
		$scope.showCardAddmode = function(){
			$scope.showCCPage = true;
                        $scope.swippedCard = true;
		};

                $scope.showSelectedCreditCardButton = function(){
                    if ($scope.showCreditCardInfo && !$scope.showCCPage && ($scope.paymentGateway !== 'sixpayments' || $scope.isManual) && $scope.saveData.paymentType === 'CC' && !$scope.depositPaidSuccesFully){
                        return true;
                    } else return false;
                };
		/**
		 * change payment type action - override parent's method so as to deal with referance and fees
		 */
    $scope.giftCardAmountAvailable = false;
    $scope.giftCardAvailableBalance = 0;

    $scope.$on('giftCardAvailableBalance',function(e, giftCardData){
       $scope.giftCardAvailableBalance = giftCardData.amount;
    });

    $scope.timer = null;

    $scope.cardNumberInput = function (n, e) {
        if ($scope.isGiftCardPmt){
            var len = n.length;
            $scope.num = n;
            if (len >= 8 && len <= 22){
                //then go check the balance of the cardd
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
        console.info('fetching card balance...');
        if ($scope.isGiftCardPmt){
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




		$scope.changePaymentType = function(){
                    console.log(arguments);
			if($scope.saveData.paymentType === "CC" && $scope.paymentGateway !== 'sixpayments'){
				($scope.isExistPaymentType) ? $scope.showCreditCardInfo = true :$scope.showCardAddmode();
                                if ($rootScope.isStandAlone){
                                    $rootScope.$broadcast('CLICK_ADD_NEW_CARD');
                                }
			} else {
				$scope.showCreditCardInfo = false;
			};
                        console.info('$scope.saveData.paymentType: '+$scope.saveData.paymentType)
                        if ($scope.saveData.paymentType === "GIFT_CARD"){
                            $rootScope.$broadcast('giftCardSelectedFromGroups');
                            $scope.isGiftCardPmt = true;
                        } else {
                            $scope.isGiftCardPmt = false;
                        }
			checkReferencetextAvailable();
			checkforFee();
		};

   	  /*
	 	* Close dialog and update the parent
	 	*/
		$scope.closeDialog = function(){
			$scope.paymentModalOpened = false;
			$scope.$emit('HANDLE_MODAL_OPENED');
			ngDialog.close();
		};


	  /*
		* Initial screen - filled with deafult amount on bill
		* If any payment type attached to that bill then that credit card can be viewed in initial screen
		* Default payment method attached to that bill can be viewed in initial screen
		*/
		var renderDefaultValues = function(){

		    var defaultAmount = $scope.billsArray[$scope.currentActiveBill].total_fees.balance_amount ?
								$scope.billsArray[$scope.currentActiveBill].total_fees.balance_amount : zeroAmount;
			$scope.renderData.defaultPaymentAmount = parseFloat(defaultAmount).toFixed(2);
			$scope.defaultRefundAmount = (-1)*parseFloat($scope.renderData.defaultPaymentAmount);
			if($scope.renderData.defaultPaymentAmount < 0){
					$scope.defaultRefundAmount = (-1)*parseFloat($scope.renderData.defaultPaymentAmount);
					$scope.shouldShowMakePaymentButton = false;
			} else {

					$scope.shouldShowMakePaymentButton = true;
			};
		};
		/*
		* Action - On bill selection
		*/
		$scope.billNumberChanged = function(){
			$scope.currentActiveBill = parseInt($scope.renderData.billNumberSelected) - parseInt(1);
			renderDefaultValues();
		};


	  /*
		* Retrive data to be displayed in the payment screen - payment types and credit card types
		*
		*/

		var fetchPaymentMethods = function(){

			var onPaymnentFetchSuccess = function(data) {
				$scope.renderData.paymentTypes =  data;
				$scope.creditCardTypes = [];
				angular.forEach($scope.renderData.paymentTypes, function(item, key) {
					if(item.name === 'CC'){
						$scope.creditCardTypes = item.values;
					};
				});
				renderDefaultValues();
			},
			onPaymnentFetchFailure = function(errorMessage) {
				$scope.errorMessage = errorMessage;
			};
			$scope.callAPI(RVPaymentSrv.renderPaymentScreen, {
				successCallBack: onPaymnentFetchSuccess,
				failureCallBack: onPaymnentFetchFailure,
				params: {
					direct_bill: true
				}
			});
		};
		fetchPaymentMethods();

		/*
		 * Success call back of save new card
		 */
		 var successNewPayment = function(data){

		 	$scope.$emit("hideLoader");
		 	var cardType = "";
			var cardNumberEndingWith = "";
			var cardExpiry = "";
			var swipedData = angular.copy($scope.swipedCardDataToSave);
			if(!isEmptyObject(swipedData)){
				cardType =  swipedData.cardType.toLowerCase();
				cardNumberEndingWith = swipedData.cardNumber.slice(-4);
				cardExpiry = swipedData.cardExpiryMonth+"/"+swipedData.cardExpiryYear;
				$scope.saveData.paymentType = "CC";
			}
			else{
				cardType = retrieveCardtype(isSixPayment,tokenDetails,cardDetails);
				cardNumberEndingWith = retrieveCardNumber(isSixPayment,tokenDetails,cardDetails);
		 		cardExpiry = retrieveCardExpiryDate(isSixPayment,tokenDetails,cardDetails);

			}

		 	$scope.defaultPaymentTypeCard = cardType;
		 	$scope.defaultPaymentTypeCardNumberEndingWith = cardNumberEndingWith;
		 	$scope.defaultPaymentTypeCardExpiry = cardExpiry;

		 	//check if the selected card has reference
		 	checkReferencetextAvailableForCC();

		 	//check if the selected card has fees
		 	_.each($scope.renderData.paymentTypes, function(paymentType) {
				  if(paymentType.name === "CC" ){
				  	_.each(paymentType.values, function(paymentType) {
				  		if(cardType.toUpperCase() === paymentType.cardcode)
						{
							$scope.feeData.feesInfo = paymentType.charge_code.fees_information;
							setupFeeData();
						}

					});
				  };
			});


		 	$scope.saveData.payment_type_id = data.id;
		 	$scope.showCCPage = false;
                        $scope.swippedCard = false;
		 	$scope.showCreditCardInfo = true;
		 	$scope.newCardAdded = true;
		 	$scope.swipedCardDataToSave = {};

		 };




		/*
		 * To save new card
		 */
		 var savePayment = function(data){

			isSixPayment  = angular.copy($scope.newPaymentInfo.tokenDetails.isSixPayment);
			tokenDetails  = angular.copy($scope.newPaymentInfo.tokenDetails);
			cardDetails   = angular.copy($scope.newPaymentInfo.cardDetails);

			var cardToken   = !isSixPayment ? tokenDetails.session:data.tokenDetails.token_no;
			var expiryMonth = isSixPayment ? tokenDetails.expiry.substring(2, 4) :cardDetails.expiryMonth;
			var expiryYear  = isSixPayment ? tokenDetails.expiry.substring(0, 2) :cardDetails.expiryYear;
			var expiryDate  = (expiryMonth && expiryYear )? ("20"+expiryYear+"-"+expiryMonth+"-01"):"";
			var cardCode = 	isSixPayment?
							getSixCreditCardType(tokenDetails.card_type).toLowerCase():
							cardDetails.cardType;


			$scope.callAPI(rvAccountTransactionsSrv.savePaymentDetails, {
				successCallBack: successNewPayment,
				params: {
					"bill_id": $scope.billsArray[$scope.renderData.billNumberSelected-1].bill_id,
					"data_to_pass":{
						"card_expiry": expiryDate,
						"name_on_card": $scope.newPaymentInfo.cardDetails.userName,
						"payment_type": "CC",
						"token": cardToken,
						"card_code": cardCode
					}
				}
			});
		};

		/**
		 * retrieve token from paymnet gateway - from cards ctrl
		 */
		$scope.$on("TOKEN_CREATED", function(e, data){
		 	$scope.newPaymentInfo = data;
		 	$scope.showCCPage = false;
                        $scope.swippedCard = false;
		 	setTimeout(function(){
		 		savePayment(data);
		 	}, 200);
		 	runDigestCycle();
		 });

		/**
		 * MLI error - from cards ctrl
		 */
		$scope.$on("MLI_ERROR", function(e,data){
		 	$scope.errorMessage = data;
		});

		/**
		 * card selection cancelled - from cards ctrl
		 */
		$scope.$on('cancelCardSelection',function(e,data){
			$scope.showCCPage = false;
                        $scope.swippedCard = false;
			$scope.isManual = false;
			$scope.saveData.paymentType = "";
		});

		/*
		* Success call back of MLI swipe - from cards ctrl
		*/
		$scope.$on("SHOW_SWIPED_DATA_ON_PAY_SCREEN", function(e, swipedCardDataToRender){
			//set variables to display the add mode
			$scope.showCCPage 						 = true;
                        $scope.swippedCard = true;
			$scope.addmode                 			 = true;
			$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
		});


		$scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave){

			$scope.swipedCardDataToSave = swipedCardDataToSave;
			var data 			= swipedCardDataToSave;
			data.payment_credit_type = swipedCardDataToSave.cardType;
			data.credit_card = swipedCardDataToSave.cardType;
			data.card_expiry = "20"+swipedCardDataToSave.cardExpiryYear+"-"+swipedCardDataToSave.cardExpiryMonth+"-01";
		    $scope.callAPI(rvAccountTransactionsSrv.savePaymentDetails, {
				successCallBack: successNewPayment,
				params: {
					"bill_id": $scope.billsArray[$scope.renderData.billNumberSelected-1].bill_id,
					"data_to_pass":data
				}
			});

		});


		/*
		* Success call back of success payment
		*/
		var successPayment = function(data){
			$scope.$emit("hideLoader");
			$scope.depositPaidSuccesFully = true;
			$scope.authorizedCode = data.authorization_code;
			$scope.$emit('UPDATE_TRANSACTION_DATA',data);
			$scope.showArSelection = false;
		};
		var failurePayment = function(error){
			$scope.$emit("hideLoader");
			$scope.errorMessage = error;
			$scope.showArSelection = false;
		};

		/*
		* Payment actions
		*/

		var setUpPaymentParams = function(arType){
			var params = {
				"data_to_pass": {
					"bill_number": $scope.renderData.billNumberSelected,
					"payment_type": $scope.saveData.paymentType,
					"amount": $scope.renderData.defaultPaymentAmount,
					"payment_method_id": ($scope.saveData.paymentType === 'CC') ? $scope.saveData.payment_type_id : null,
					"reference_text" : $scope.renderData.referanceText
					},
				"bill_id": $scope.billsArray[$scope.renderData.billNumberSelected-1].bill_id
			};

			if(typeof arType !=="undefined"  && arType !==""){
				params.data_to_pass.ar_type = arType;
			};

			if($scope.isShowFees()){
				if($scope.feeData.calculatedFee) {
					params.data_to_pass.fees_amount = $scope.feeData.calculatedFee;
				}
				if($scope.feeData.feesInfo) {
					params.data_to_pass.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
				}
			};
			return params;
		};

		var proceedPayment = function(arType){

			$scope.errorMessage = "";
			var params = setUpPaymentParams(arType);
			if($rootScope.paymentGateway === "sixpayments" && !$scope.isManual && $scope.saveData.paymentType === "CC"){
				params.data_to_pass.is_emv_request = true;
				$scope.shouldShowWaiting = true;
				//Six payment SWIPE actions
				rvAccountTransactionsSrv.submitPaymentOnBill(params).then(function(response) {
					$scope.shouldShowWaiting = false;
					successPayment(response);
				},function(error){
					$scope.errorMessage = error;
					$scope.shouldShowWaiting = false;
				});

			} else {

				$scope.callAPI(rvAccountTransactionsSrv.submitPaymentOnBill, {
					successCallBack: successPayment,
					failureCallBack: failurePayment,
					params: params
				});
			};
		};

		var showCreateArAccountPopup  = function(account_id,arType){
			ngDialog.close();
			var paymentDetails = setUpPaymentParams(arType);
			var data = {"account_id":account_id,"is_auto_assign_ar_numbers": $scope.ArDetails.is_auto_assign_ar_numbers,"paymentDetails":paymentDetails};
			$scope.$emit('arAccountWillBeCreated',data);
		};


		// select to which AR account payment has to be done
		$scope.selectArAccount = function(type){
			if(type === "company"){
				if($scope.ArDetails.company_ar_attached){
					proceedPayment("company");
				}
				else{
					showCreateArAccountPopup($scope.ArDetails.company_id,"company");
				}
			}
			else{
				if($scope.ArDetails.travel_agent_ar_attached){
					proceedPayment("travel_agent");
				}
				else{
					showCreateArAccountPopup($scope.ArDetails.travel_agent_id,"travel_agent");
				}
			};
		};

		$scope.showErrorPopup = function(errorMessage){
			$scope.$emit("showValidationErrorPopup", errorMessage);
		};

		var checkIfARAccountisPresent = function(){

			var successArCheck = function(data){
				$scope.ArDetails = data;
				//if both company and travel agent AR accounts are present
				if(data.company_present && data.travel_agent_present){
					$scope.showArSelection = true;
				}else if(data.company_present){
					if(data.company_ar_attached){
						proceedPayment("company");
					}
					else{
						showCreateArAccountPopup($scope.ArDetails.company_id);
					}
				}
				else if(data.travel_agent_present){
					if(data.travel_agent_ar_attached){
						proceedPayment("travel_agent");
					}
					else{
						showCreateArAccountPopup($scope.ArDetails.travel_agent_id);
					}

				}
				else{
					//notify user that AR account is not attached
					$scope.showErrorPopup($filter('translate')('ACCOUNT_ID_NIL_MESSAGE_PAYMENT'));
					$timeout(function() {
						//close payment popup
						ngDialog.close();
					}, 100);
				};
			};
            var params = {
                            account_id: $scope.accountConfigData.summary.posting_account_id
                         };
            $scope.callAPI(rvAccountTransactionsSrv.checkForArAccount, {
						successCallBack: successArCheck,
						params: params
					});
		};

		/*
		* Action - On click submit payment button
		*/
		$scope.submitPayment = function(){
		    // if payment is from groups and payment type is direct bill
		    // we check if AR account is present or not
		    // if not present we inform the user with a popup
			if ($scope.renderData.defaultPaymentAmount > 0 || $scope.renderData.defaultPaymentAmount < 0) {
				($scope.saveData.paymentType ==="DB") ? checkIfARAccountisPresent():proceedPayment();
			} else {
				$timeout(function () {
		 			$scope.errorMessage = ["Please enter amount to pay"];
		 		}, 200);
		 	}
		};
		//CICO-25885 Fix
		$scope.changeOnsiteCallIn = function () {
			$scope.showCCPage = ($scope.isManual) ? true :false;
		};

	 	//CICO-25885 Fix - Function to trigger from sixpayment partial
	    $scope.$on('changeOnsiteCallIn', function(event){
	        $scope.isManual =  !$scope.isManual;
	        $scope.changeOnsiteCallIn();
	    });

}]);