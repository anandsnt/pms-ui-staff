sntRover.controller('RVPaymentMethodCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv', function($rootScope, $scope, $state, RVPaymentSrv){
	BaseCtrl.call(this, $scope);
	$scope.saveData = {};
	
	$scope.successRender = function(data){
		$scope.$emit("hideLoader");
		$scope.data = data;
		$scope.paymentTypeValues = [];
		
		
		
	};
	$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.successRender);
	$scope.renderPaymentValues = function(){
		$scope.paymentTypeValues = $scope.data[$scope.saveData.selected_payment_type].values;
	};
	$scope.saveSuccess = function(){
		$scope.$emit("hideLoader");
		ngDialog.close();
		$scope.paymentData.data.push($scope.saveData);
		
		console.log(JSON.stringify($scope.paymentData));
	};
	$scope.failureCallBack = function(){
		$scope.$emit("hideLoader");
		
		$scope.paymentData.data.push($scope.newPaymentInfo);
		
		console.log(JSON.stringify($scope.paymentData));
	};
	$scope.savePayment = function(){
		
		$scope.saveData.payment_type = $scope.data[$scope.saveData.selected_payment_type].name;
		$scope.saveData.card_expiry = $scope.saveData.card_expiry_month && $scope.saveData.card_expiry_year ? "20"+$scope.saveData.card_expiry_year+"-"+$scope.saveData.card_expiry_month+"-01" : "";
		//$scope.passData  => Gives information from which view popup opened 
		//get reservation id if it is from staycard
		if($scope.passData.fromView == "staycard"){
			$scope.saveData.reservation_id = $scope.passData.reservationId;
		} else {
			$scope.saveData.guest_id = $scope.passData.guest_id;
			$scope.saveData.user_id = $scope.passData.user_id;
		}
		var unwantedKeys = ["card_expiry_year","card_expiry_month", "selected_payment_type"];
		var data = dclone($scope.saveData, unwantedKeys);
		if($scope.passData.fromView == "staycard"){
			
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, $scope.saveSuccess);
		} else {
			//Used to update the list with new value
			var cardNumber = $scope.saveData.card_number;
			var expiryDate = $scope.saveData.card_expiry_month+"/"+$scope.saveData.card_expiry_year;
			$scope.newPaymentInfo = {
				"card_code": $scope.saveData.credit_card,
				"mli_token_display":cardNumber.substr(cardNumber.length - 4),
				"card_expiry": $scope.saveData.card_expiry,
				"card_name": $scope.saveData.name_on_card,
				"is_primary":false
			};
			$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, data, $scope.saveSuccess, $scope.failureCallBack);
		}
		
		
	};
	
	
}]);