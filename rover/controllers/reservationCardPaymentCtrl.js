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
		// console.log("kkkkkkkkkkkk==="+$scope.data.paymenttype);
		$scope.paymentTypeValues = $scope.data[$scope.saveData.selected_payment_type].values;
	};
	$scope.savePayment = function(){
	
		$scope.saveData.payment_type = $scope.data[$scope.saveData.selected_payment_type].name;
		$scope.saveData.card_expiry = $scope.saveData.card_expiry_month && $scope.saveData.card_expiry_year ? "20"+$scope.saveData.card_expiry_year+"-"+$scope.saveData.card_expiry_month+"-01" : "";
		$scope.saveData.reservation_id = $scope.passData.reservationId;
			// console.log(JSON.stringify($scope.saveData));
			var unwantedKeys = ["card_expiry_year","card_expiry_month", "selected_payment_type"];
			var data = dclone($scope.saveData, unwantedKeys);
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data);
			// console.log("============================");
			// console.log($scope.passData.reservationId);
			// console.log("================++++============");
			// console.log(JSON.stringify(data));
	};
	
	
}]);