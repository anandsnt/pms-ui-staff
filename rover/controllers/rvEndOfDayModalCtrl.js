sntRover.controller('RVEndOfDayModalController', ['$scope','ngDialog', function($scope,ngDialog){

BaseCtrl.call(this, $scope);
$scope.userName = '';
$scope.password ='';
$scope.errorMessage='';
$scope.isLoggedIn = false;

/*
 * cancel click action
 */
$scope.cancelClicked = function(){
    ngDialog.close();

};

$scope.login = function(){

	$scope.isLoggedIn = true;
};

// $scope.updateSettings = function(){
// 	var updateUserInfoSuccessCallback = function(data){
// 		$scope.cancelClicked();
// 	    $scope.$emit('hideLoader');
// 	};
// 	var updateUserInfoFailureCallback = function(data){
// 		 $scope.errorMessage=data;
// 	    $scope.$emit('hideLoader');
// 	};
// 	$scope.invokeApi(RVSettingsSrv.updateUserInfo,{'new_password' :$scope.newPassword},updateUserInfoSuccessCallback,updateUserInfoFailureCallback);  
// 	};

}]);