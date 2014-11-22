sntRover.controller('RVBillPayCtrl',['$scope', 'RVBillPaymentSrv','RVPaymentSrv','RVGuestCardSrv','RVReservationCardSrv', 'ngDialog', '$rootScope', function($scope, RVBillPaymentSrv, RVPaymentSrv, RVGuestCardSrv, RVReservationCardSrv, ngDialog, $rootScope){
	BaseCtrl.call(this, $scope);
	
	var setupbasicBillData = function(){
		$scope.renderData = {};
		$scope.saveData = {};
		$scope.errorMessage = '';
		$scope.saveData.payment_type_id = '';
		$scope.guestPaymentList = {};
		$scope.newPaymentInfo = {};
		$scope.newPaymentInfo.addToGuestCard = false;
		$scope.renderData.billNumberSelected = '';
		$scope.renderData.defaultPaymentAmount = '';
		//We are passing $scope from bill to this modal
		$scope.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
		$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
		$scope.billsArray = $scope.reservationBillData.bills;
		$scope.passData = {};
		$scope.passData.details ={};
		$scope.passData.details.firstName = "cfef";
		$scope.passData.details.lastName = "dewr3";
		$scope.shouldShowAddNewCard = true;
		$scope.shouldShowExistingCards = true;
		$scope.setScroller('cardsList');
		$scope.addmode = true;
		$scope.showAddtoGuestCard = true;
		$scope.showCancelCardSelection = true;
	};

	$scope.handleCloseDialog = function(){
		$scope.paymentModalOpened = false;
		$scope.$emit('HANDLE_MODAL_OPENED');
		$scope.closeDialog();
	};

	// $scope.hideCC = function(){
	// 	$scope.showCCPage = false;
	// };

	/*
	* Show guest credit card list
	*/
	$scope.showGuestCreditCardList = function(){
		console.log("cewcdhechgdche");
		$scope.showCCPage = true;
		if($scope.guestPaymentList.length >0){
		// $scope.showInitalPaymentScreen = false;
			$scope.showExistingAndAddNewPayments = true;
			$scope.showExistingGuestPayments = true;
			$scope.showOnlyAddCard = false;
			$scope.cardsList = $scope.guestPaymentList;
			$scope.refreshScroller('cardsList');
		} else {
			$scope.showOnlyAddCard = true;
		};		
	};

	$scope.showHideCreditCard = function(){
		if($scope.saveData.paymentType == "CC"){
			($scope.isExistPaymentType) ? $scope.showCreditCardInfo = true :$scope.showGuestCreditCardList();
		} else {
			$scope.showCreditCardInfo = false;
		};
	};

	/*
	* Success call back - for initial screen
	*/
	$scope.getPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.renderData = data;
		$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
		$scope.renderDefaultValues();
	};
	/*
	* Success call back for guest payment list screen
	*/
	$scope.guestPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		if(data.length == 0){
			$scope.guestPaymentList = [];
		} else {
			$scope.guestPaymentList = data;
			angular.forEach($scope.guestPaymentList, function(value, key) {
				value.isSelected = false;
				if(!isEmptyObject($scope.billsArray[$scope.currentActiveBill].credit_card_details)){
					if($scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase() == "CC"){
						if(($scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number == value.mli_token) && ($scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase() == value.card_code.toLowerCase() )) {
							value.isSelected = true;
						} 
					}
				}

			});
		}

	};
	/*
	* Initial function - To render screen with data
	* Initial screen - filled with deafult amount on bill
	* If any payment type attached to that bill then that credit card can be viewed in initial screen
	* Default payment method attached to that bill can be viewed in initial screen
	*/
	$scope.init = function(){
		setupbasicBillData();
		$scope.showInitalPaymentScreen = true;
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, '', $scope.getPaymentListSuccess);
		$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.guestInfoToPaymentModal.user_id, $scope.guestPaymentListSuccess, '', 'NONE');
	};

	/*
	* Initial screen - filled with deafult amount on bill
	* If any payment type attached to that bill then that credit card can be viewed in initial screen
	* Default payment method attached to that bill can be viewed in initial screen
	*/
	$scope.renderDefaultValues = function(){
		var ccExist = false;
		if($scope.renderData.length > 0){
			if(!isEmptyObject($scope.billsArray[$scope.currentActiveBill].credit_card_details)){
				$scope.defaultPaymentTypeOfBill = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase();
				$scope.saveData.payment_type_id = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_id;
				angular.forEach($scope.renderData, function(value, key) {
					if(value.name == "CC"){
						ccExist = true;
					}
				});

				$scope.saveData.paymentType = $scope.defaultPaymentTypeOfBill;
				if($scope.defaultPaymentTypeOfBill == 'CC'){
					if(!ccExist){
						$scope.saveData.paymentType = '';
					}
					$scope.isExistPaymentType = true;
					$scope.showCreditCardInfo = true;
					$scope.isfromBill = true;
					$scope.defaultPaymentTypeCard = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase();
					$scope.defaultPaymentTypeCardNumberEndingWith = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number;
					$scope.defaultPaymentTypeCardExpiry = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_expiry;
				}
			}
		}

		var defaultAmount = $scope.billsArray[$scope.currentActiveBill].total_fees[0].balance_amount;
		$scope.renderData.defaultPaymentAmount = defaultAmount;

	};
	$scope.init();

	/*
	* Action - On bill selection 
	*/
	$scope.billNumberChanged = function(){
		$scope.currentActiveBill = parseInt($scope.renderData.billNumberSelected) - parseInt(1);
		$scope.renderDefaultValues();
	};

	/*
	* Success call back of success payment
	*/
	var successPayment = function(){
		$scope.$emit("hideLoader");
		$scope.handleCloseDialog();
	//To refresh the view bill screen 
	$scope.$emit('PAYMENT_SUCCESS');
};

	/*
	* Action - On click submit payment button
	*/
	$scope.submitPayment = function(){

		if($scope.saveData.paymentType == '' || $scope.saveData.paymentType == null){
			$scope.errorMessage = ["Please select payment type"];
		} else if($scope.renderData.defaultPaymentAmount == '' || $scope.renderData.defaultPaymentAmount == null){
			$scope.errorMessage = ["Please enter amount"];
		} else {
			$scope.errorMessage = "";
			var dataToSrv = {
				"postData": {
					"bill_number": $scope.renderData.billNumberSelected,
					"payment_type": $scope.saveData.paymentType,
					"amount": $scope.renderData.defaultPaymentAmount,
					"payment_type_id":$scope.saveData.payment_type_id
				},
				"reservation_id": $scope.reservationData.reservationId
			};
			if($scope.saveData.paymentType == "CC"){
				if(!$scope.showCreditCardInfo){
					$scope.errorMessage = ["Please select/add credit card"];
					$scope.showHideCreditCard();
					return false;
				} else {
					$scope.errorMessage = "";
	dataToSrv.postData.credit_card_type = $scope.defaultPaymentTypeCard.toUpperCase();//Onlyifpayment_type is CC
}
}
$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToSrv,successPayment);
}

};

	/*
	* Success call back of save new card
	*/
	var successNewPayment = function(data){
		$scope.$emit("hideLoader");
		
		$scope.defaultPaymentTypeCard = getCreditCardType($scope.newPaymentInfo.tokenDetails.cardBrand).toLowerCase();
		$scope.defaultPaymentTypeCardNumberEndingWith = $scope.newPaymentInfo.cardDetails.cardNumber.slice(-4);
		$scope.defaultPaymentTypeCardExpiry = $scope.newPaymentInfo.cardDetails.expiryMonth+"/"+$scope.newPaymentInfo.cardDetails.expiryYear;
		var selectedBillIndex = parseInt($scope.renderData.billNumberSelected) - parseInt(1);
		$scope.billsArray[selectedBillIndex].credit_card_details.card_code = getCreditCardType($scope.newPaymentInfo.tokenDetails.cardBrand).toLowerCase();
		$scope.billsArray[selectedBillIndex].credit_card_details.card_expiry = $scope.newPaymentInfo.cardDetails.expiryMonth+"/"+$scope.newPaymentInfo.cardDetails.expiryYear;
		$scope.billsArray[selectedBillIndex].credit_card_details.card_number =  $scope.newPaymentInfo.cardDetails.cardNumber.slice(-4);
		$scope.saveData.payment_type_id = data.id;
		angular.forEach($scope.guestPaymentList, function(value, key) {
			value.isSelected = false;
		});

		if($scope.newPaymentInfo.addToGuestCard){
			var dataToGuestList = {
				"card_code": getCreditCardType($scope.newPaymentInfo.tokenDetails.cardBrand).toLowerCase(),
				"mli_token": $scope.newPaymentInfo.cardDetails.cardNumber.slice(-4),
				"card_expiry": $scope.newPaymentInfo.cardDetails.expiryMonth+"/"+$scope.newPaymentInfo.cardDetails.expiryYear,
				"card_name": $scope.newPaymentInfo.cardDetails.userName,
				"id": data.id,
				"isSelected": true,
				"is_primary":false,
				"payment_type":data.payment_name,
				"payment_type_id": 1
			};
			$scope.guestPaymentList.push(dataToGuestList);
			$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', dataToGuestList);
		}
		$scope.showCCPage = false;
	};
	/*
	* To save new card
	*/
	var savePayment = function(cardToken){
		var expiryDate = $scope.newPaymentInfo.cardDetails.expiryMonth && $scope.newPaymentInfo.cardDetails.expiryYear ? "20"+$scope.newPaymentInfo.cardDetails.expiryYear+"-"+$scope.newPaymentInfo.cardDetails.expiryMonth+"-01" : "";

		var dataToSave = {
				"add_to_guest_card": $scope.newPaymentInfo.cardDetails.addToGuestCard,
				"bill_number": $scope.renderData.billNumberSelected,
				"card_expiry": expiryDate,
				//"credit_card": "DS", // dONT HAVE THE TYPE OF CARD IN THIS SCREEN
				"name_on_card": $scope.newPaymentInfo.cardDetails.userName,
				"payment_type": "CC",
				"reservation_id": $scope.reservationData.reservationId,
				"token": cardToken
		};
	console.log(dataToSave);
	$scope.invokeApi(RVPaymentSrv.savePaymentDetails, dataToSave,successNewPayment);

};


$scope.setCreditCardFromList = function(index){
	$scope.isExistPaymentType = true;
	$scope.showCreditCardInfo = true;
	$scope.defaultPaymentTypeCard = $scope.guestPaymentList[index].card_code.toLowerCase();
	$scope.defaultPaymentTypeCardNumberEndingWith = $scope.guestPaymentList[index].mli_token;
	$scope.defaultPaymentTypeCardExpiry = $scope.guestPaymentList[index].card_expiry;
	angular.forEach($scope.guestPaymentList, function(value, key) {
		value.isSelected = false;
	});
	$scope.guestPaymentList[index].isSelected = true;
	$scope.saveData.payment_type_id =  $scope.guestPaymentList[index].id;
	// $scope.showInitialScreen();
	$scope.showCCPage = false;
};

$scope.$on('cardSelected',function(e,data){
	$scope.setCreditCardFromList(data.index);
});

$scope.$on("TOKEN_CREATED", function(e,data){
	console.log(data);
	$scope.newPaymentInfo = data;
	//$scope.cardDetails.tokenDetails
	data.tokenDetails.isSixPayment ? savePayment(data.tokenDetails.token_no) : savePayment(data.tokenDetails.session);
});

$scope.$on("MLI_ERROR", function(e,data){
	$scope.errorMessage = data;
});
$scope.$on('cancelCardSelection',function(e,data){
	console.log(data+"-------------------------");
	$scope.showCCPage = false;
});

}]);