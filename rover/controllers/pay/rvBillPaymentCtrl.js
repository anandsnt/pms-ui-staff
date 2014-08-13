sntRover.controller('RVBillPayCtrl',['$scope', 'RVBillPaymentSrv','RVPaymentSrv','RVGuestCardSrv','ngDialog', function($scope, RVBillPaymentSrv, RVPaymentSrv, RVGuestCardSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.renderData = {};
	$scope.saveData = {};
	$scope.guestPaymentList = {};
	console.log($scope);
	//We are passing $scope from bill to this modal
	$scope.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
	$scope.billsArray = $scope.reservationBillData.bills;
	//Parameter used to show credit card info - first modal
	$scope.showCreditCardInfo = false;
	$scope.isfromBill = false;
	$scope.isfromGuestCard = false;
	//Parameter used to handle ng-change of payment type 
	// if default credit card not exist show guest payment lists
	//Otherwise that screen will be viewed when click on credit card area. 
	$scope.isExistPaymentType = false;
	$scope.showExistingAndAddNewPayments = false;
	$scope.showExistingGuestPayments = false;
	$scope.showInitalPaymentScreen = false;
	$scope.init = function(){
		$scope.showInitalPaymentScreen = true;
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, '', $scope.getPaymentListSuccess);
		$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.guestInfoToPaymentModal.user_id, $scope.guestPaymentListSuccess, '', 'NONE');
	};
	$scope.getPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.renderData = data;
		$scope.renderDefaultValues();
	};
	$scope.guestPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.guestPaymentList = data;
	};
	$scope.renderDefaultValues = function(){
		$scope.defaultPaymentTypeOfBill = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase();
		if($scope.defaultPaymentTypeOfBill == 'CC'){
			$scope.isExistPaymentType = true;
			$scope.showCreditCardInfo = true;
			$scope.isfromBill = true;
			$scope.defaultPaymentTypeCard = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase();
			$scope.defaultPaymentTypeCardNumberEndingWith = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number;
			$scope.defaultPaymentTypeCardExpiry = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_expiry;
		}
	};
	$scope.init();
	$scope.submitPayment = function(){
		
	};
	$scope.showHideCreditCard = function(){
		if($scope.saveData.paymentType == "CC"){
			if($scope.isExistPaymentType){
				$scope.showCreditCardInfo = true;
			} else{
				$scope.showInitalPaymentScreen = false;
				$scope.showExistingAndAddNewPayments = true;
				$scope.showExistingGuestPayments = true;
				
			}
			
		} else {
			$scope.showCreditCardInfo = false;
		}
	};
	
	
}]);