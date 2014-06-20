sntRover.controller('RVKeyEmailCtrl',['$rootScope', '$scope', '$state', 'ngDialog', 'RVValidateCheckinSrv',  function($rootScope, $scope, $state, ngDialog, RVValidateCheckinSrv){
	BaseCtrl.call(this, $scope);
	$scope.getEmailModalSuccessCallback = function(data){
		console.log(JSON.stringify(data));
	};
	$scope.init = function(){
		var data = {
			"reservation_id" : $scope.reservationBillData.reservation_id
		};
		$scope.invokeApi(RVValidateCheckinSrv.getKeyEmailModalData, data, $scope.getEmailModalSuccessCallback);
	};
	$scope.init();
	
	
}]);