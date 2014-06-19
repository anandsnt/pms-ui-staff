sntRover.controller('RVValidateEmailPhoneCtrl',['$rootScope', '$scope', '$state', 'ngDialog', 'RVValidateCheckinSrv',  function($rootScope, $scope, $state, ngDialog, RVValidateCheckinSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.showEmail = ($scope.guestCardData.contactInfo.email == '' || $scope.guestCardData.contactInfo.email == null) ? true : false;
	$scope.showPhone = ($scope.guestCardData.contactInfo.phone == '' || $scope.guestCardData.contactInfo.phone == null) ? true : false;
	$scope.saveData = {};
	$scope.saveData.email = "";
	$scope.saveData.phone = "";
	$scope.saveData.guest_id = "";
	$scope.saveData.user_id = "";
	$scope.guestCardData.contactInfo.email =  "dsddddddddddddd";
	console.log($scope);
	$scope.clickCancel = function(){
		ngDialog.close();
	};
	$scope.validateEmailPhoneSuccessCallback = function(){
		console.log($scope.guestCardData.contactInfo.email +"===="+ $scope.saveData.email);
		
		
		if($scope.showPhone){
			$scope.guestCardData.contactInfo.phone = $scope.saveData.phone;
		} else {
			$scope.guestCardData.contactInfo.email = $scope.saveData.email;
		}
			
		$scope.$emit('hideLoader');
		ngDialog.close();
	};
	$scope.submitAndGoToCheckin = function(){
			$scope.saveData.guest_id = $scope.guestCardData.guestId;
	        $scope.saveData.user_id = $scope.guestCardData.userId;
			if($scope.showEmail && $scope.showPhone){
				$scope.saveData = $scope.saveData;
			} else if($scope.showPhone){
				var unwantedKeys = ["email"]; // remove unwanted keys for API
				$scope.saveData = dclone($scope.saveData, unwantedKeys); 
			} else {
				var unwantedKeys = ["phone"]; // remove unwanted keys for API
				$scope.saveData = dclone($scope.saveData, unwantedKeys);
			}
			$scope.invokeApi(RVValidateCheckinSrv.saveGuestEmailPhone, $scope.saveData, $scope.validateEmailPhoneSuccessCallback);
	};
	
	
}]);