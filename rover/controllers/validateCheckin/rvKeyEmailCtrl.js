sntRover.controller('RVKeyEmailCtrl',['$rootScope', '$scope', '$state', 'ngDialog', 'RVValidateCheckinSrv',  function($rootScope, $scope, $state, ngDialog, RVValidateCheckinSrv){
	BaseCtrl.call(this, $scope);
	$scope.getEmailModalSuccessCallback = function(data){
		$scope.$emit("hideLoader");
		console.log(JSON.stringify(data));
		$scope.keyEmailModalData = data;
	};
	$scope.init = function(){
		var data = {
			"reservation_id" : $scope.reservationBillData.reservation_id
		};
		$scope.invokeApi(RVValidateCheckinSrv.getKeyEmailModalData, data, $scope.getEmailModalSuccessCallback);
	};
	$scope.init();
	
	
	$scope.goToStaycard = function(){
		$scope.closeDialog();
		$state.go('rover.staycard.reservationcard.reservationdetails', {"id": $scope.reservationBillData.reservation_id, "confirmationId": $scope.reservationBillData.confirm_no});
		
	};
	$scope.goToSearch = function(){
		$scope.closeDialog();
		$state.go('rover.search');
		
	};
	
}]);