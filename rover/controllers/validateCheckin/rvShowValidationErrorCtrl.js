sntRover.controller('RVShowValidationErrorCtrl',['$rootScope', '$scope', 'ngDialog',  function($rootScope, $scope, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.okButtonClicked = function(){
		if($scope.callBackMethod){
			$scope.callBackMethod();
		}
		ngDialog.close();
	};
	
}]);