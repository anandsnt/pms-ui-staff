sntRover.controller('RVPaymentAddPaymentCtrl',
	['$rootScope', 
	 '$scope', 
	 '$state', 
	 'ngDialog',
	 'RVPaymentSrv', 
	function($rootScope, $scope, $state, ngDialog, RVPaymentSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.shouldShowExistingCards = false;
	$scope.shouldShowAddNewCard    = false;
	$scope.showInitialScreen       = true; 
	$scope.savePayment = {};
	$scope.successRender = function(data){
		$scope.$emit("hideLoader");
		$scope.renderData = data;
		//console.log(JSON.stringify($scope.renderData));
	};
	$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.successRender);
	/*
	 * change payment type action - initial add payment screen
	 */
	$scope.changePaymentType = function(){
		if($scope.dataToSave.paymentType == "CC"){
			$scope.shouldShowAddNewCard    = true;
			$scope.showInitialScreen       = false; 
		} else {
			$scope.shouldShowAddNewCard    = false;
			$scope.showInitialScreen       = true; 
		}
	};
	
	
	$scope.$on("TOKEN_CREATED", function(mliData){
		$scope.mliData = mliData;
		
	});
	$scope.saveNewCard = function(){
		console.log(">>>"+$scope.savePayment.addToGuest);
		var data = {
			
		};
		//$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, $scope.saveSuccess, $scope.failureCallBack);
	};
	
	
	
}]);