sntRover.controller('RVValidateEmailPhoneCtrl',['$rootScope', '$scope', '$state', 'ngDialog', function($rootScope, $scope, $state, ngDialog){
	BaseCtrl.call(this, $scope);
	
	$scope.showEmail = ($scope.guestCardData.contactInfo.email == '' || $scope.guestCardData.contactInfo.email == null) ? true : false;
	$scope.showPhone = ($scope.guestCardData.contactInfo.phone == '' || $scope.guestCardData.contactInfo.phone == null) ? true : false;
	
	console.log("emailllll==---"+$scope.showEmail);
	console.log("phonellll==---"+$scope.showPhone);
	
	
	$scope.clickCancel = function(){
		ngDialog.close();
	};
	
	
}]);