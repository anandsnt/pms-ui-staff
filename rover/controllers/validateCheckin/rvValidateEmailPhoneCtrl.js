sntRover.controller('RVValidateEmailPhoneCtrl',['$rootScope', '$scope', '$state', 'ngDialog', function($rootScope, $scope, $state, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.showEmail = ($scope.guestCardData.contactInfo.email == '' || $scope.guestCardData.contactInfo.email == null) ? true : false;
	$scope.showPhone = ($scope.guestCardData.contactInfo.phone == '' || $scope.guestCardData.contactInfo.phone == null) ? true : false;
	
	console.log("emailllll==---"+JSON.stringify($scope.guestCardData));

	
	
	$scope.clickCancel = function(){
		ngDialog.close();
	};
	
	$scope.submitAndGoToCheckin = function(){
		
	};
	
	
}]);