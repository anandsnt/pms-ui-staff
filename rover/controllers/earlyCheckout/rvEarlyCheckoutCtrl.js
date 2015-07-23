sntRover.controller('RVEarlyCheckoutCtrl',['$rootScope', '$scope', 'ngDialog',  function($rootScope, $scope, ngDialog){
	BaseCtrl.call(this, $scope);

	$scope.okButtonClicked = function(){
		$scope.saveData.isEarlyDepartureFlag = true;
		if($scope.callBackMethodCheckout){
			$scope.callBackMethodCheckout();
		}
		ngDialog.close();
	};

}]);