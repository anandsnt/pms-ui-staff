sntRover.controller('RVArTransactionsPayCreditsController',['$scope','RVPaymentSrv', 'ngDialog', '$rootScope','$timeout','$filter','rvAccountTransactionsSrv', function($scope, RVPaymentSrv, ngDialog, $rootScope,$timeout,$filter,rvAccountTransactionsSrv){
	BaseCtrl.call(this, $scope);

	$scope.feeData = {};
	var zeroAmount = parseFloat("0.00");
	$scope.saveData = {'paymentType':''};
	$scope.renderData = {};
	$scope.renderData.defaultPaymentAmount = $scope.arTransactionDetails.amount_owing;
    var bill_id = $scope.contactInformation.account_details.bill_id;
	/*
	* if no payment type is selected disable payment button
	*/
	$scope.disableMakePayment = function(){
		if($scope.saveData.paymentType.length > 0){
			return false;
		}
		else{
			return true;
		};
	};
	$scope.handleCloseDialog = function(){
		$scope.closeDialog();
	};
	/*
	* Fee setup starts here
	*/
	$scope.isShowFees = function(){
		var isShowFees = false;
		var feesData = $scope.feeData;
		if(typeof feesData === 'undefined' || typeof feesData.feesInfo === 'undefined' || feesData.feesInfo === null){
			isShowFees = false;
		}
		else if((feesData.defaultAmount  >= feesData.minFees) && $scope.isStandAlone && feesData.feesInfo.amount){
			if($scope.renderData.defaultPaymentAmount >= 0){
				isShowFees = ($scope.saveData.paymentType !=="") ? true :false;
			}
		}
		return isShowFees;
	};

	$scope.calculateFee = function(){
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
			var totalAmount = ($scope.renderData.defaultPaymentAmount === "") ? zeroAmount :
			parseFloat($scope.renderData.defaultPaymentAmount);
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
			if($scope.renderData.defaultPaymentAmount < 0){
				$scope.defaultRefundAmount = (-1)*parseFloat($scope.renderData.defaultPaymentAmount);
				$scope.shouldShowMakePaymentButton = false;
			} else {
				$scope.shouldShowMakePaymentButton = true;
			}
		}
	};

	$scope.setupFeeData = function(){
		if($scope.isStandAlone){
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
		}
	};
	$scope.calculateTotalAmount = function(amount) {
		var feesAmount  = (typeof $scope.feeData.calculatedFee === 'undefined' || $scope.feeData.calculatedFee === '' || $scope.feeData.calculatedFee === '-') ? zeroAmount : parseFloat($scope.feeData.calculatedFee);
		var amountToPay = (typeof amount === 'undefined' || amount === '') ? zeroAmount : parseFloat(amount);
		$scope.feeData.totalOfValueAndFee = parseFloat(amountToPay + feesAmount).toFixed(2);
	};
	/*
	* Fee setup ends here
	*/
	var checkReferencetextAvailable = function(){
		angular.forEach($scope.renderData.paymentTypes, function(value, key) {
			if(value.name === $scope.saveData.paymentType){
				$scope.referenceTextAvailable = (value.is_display_reference)? true:false;
				$scope.feeData.feesInfo = value.charge_code.fees_information;
				$scope.setupFeeData();
			}
		});
	};
	$scope.paymentTypeChanged =  function(){
		checkReferencetextAvailable();
	};
	/*
	* Success call back - for initial screen
	*/
	$scope.getPaymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.renderData.paymentTypes = data;
		$scope.creditCardTypes = [];
		angular.forEach($scope.renderData.paymentTypes, function(item, index) {
			if(item.name === 'CC'){
				$scope.renderData.paymentTypes.splice(index,1);
			};
		});
		checkReferencetextAvailable();
	};
	var init = function(){	
		$scope.referenceTextAvailable = false;
		$scope.showInitalPaymentScreen = true;
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.getPaymentListSuccess);
	};
	init();
	/*
	* Success call back of success payment
	*/
	var successPayment = function(data){
		$scope.$emit("hideLoader");
		$scope.arTransactionDetails.amount_owing = parseFloat(data.amount_owing).toFixed(2);
        $scope.arTransactionDetails.available_credit = parseFloat(data.available_credit).toFixed(2);;
		$scope.handleCloseDialog();
	};
	/*
	* Failure call back of submitpayment
	*/
	var failedPayment = function(data){
		$scope.$emit("hideLoader");
		$scope.errorMessage = data;
	};
	/*
	* Clears paymentErrorMessage
	*/
	$scope.clearPaymentErrorMessage = function(){
		$scope.paymentErrorMessage = '';
	};

	/*
	* Action - On click submit payment button
	*/
	$scope.submitPayment = function(){
		if($scope.saveData.paymentType === '' || $scope.saveData.paymentType === null){
			$timeout(function() {
				$scope.errorMessage = ["Please select payment type"];
			}, 1000);
		} else if($scope.renderData.defaultPaymentAmount === '' || $scope.renderData.defaultPaymentAmount === null){
			$timeout(function() {
				$scope.errorMessage = ["Please enter amount"];
			}, 1000);
		} else {
			$scope.errorMessage = "";
			var dataToSrv = {
				"data_to_pass": {
					"bill_number": 1,
					"payment_type": $scope.saveData.paymentType,
					"amount": $scope.renderData.defaultPaymentAmount,
				},
				"bill_id":bill_id
			};
			if($scope.isShowFees()){
				if($scope.feeData.calculatedFee) {
					dataToSrv.data_to_pass.fees_amount = $scope.feeData.calculatedFee;
				}
				if($scope.feeData.feesInfo) {
					dataToSrv.data_to_pass.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
				}
			}

			if($scope.referenceTextAvailable){
				dataToSrv.data_to_pass.reference_text = $scope.renderData.referanceText;
			};
			$scope.invokeApi(rvAccountTransactionsSrv.submitPaymentOnBill, dataToSrv, successPayment, failedPayment);
		}
	};	
}]);