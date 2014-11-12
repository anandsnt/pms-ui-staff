sntRover.controller('RVShowRoomNotAvailableCtrl',['$rootScope', '$scope', 'ngDialog',  function($rootScope, $scope, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.okButtonClicked = function(){
		if($rootScope.isHourlyRateOn){
			console.log("Go to diary screen");
		} else {
			ngDialog.close();
		}
	};
	
	
}]);