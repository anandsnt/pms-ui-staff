sntRover.controller('RVStaffsettingsModalController', ['$scope','ngDialog','RVSettingsSrv', function($scope,ngDialog,RVSettingsSrv){

BaseCtrl.call(this, $scope);
$scope.new_password = '';
$scope.confirmPassword ='';
$scope.errorMessage='';
$scope.fetchData = function(){   
    var fetchUserInfoSuccessCallback = function(data){
        $scope.userInfo = data;
        $scope.$emit('hideLoader');
    };
    var fetchUserInfoFailureCallback = function(data){
        $scope.$emit('hideLoader');
    };
    $scope.invokeApi(RVSettingsSrv.fetchUserInfo,{},fetchUserInfoSuccessCallback,fetchUserInfoFailureCallback);  

}   

$scope.fetchData();

$scope.cancelClicked = function(){
    ngDialog.close();

};
$scope.passwordsMatch =function(){
	if($scope.new_password !== $scope.confirmPassword)
		return false;
	else if($scope.new_password.length === 0)
		return false;
	else
		return true;
};


$scope.updateSettings = function(){

	var updateUserInfoSuccessCallback = function(data){
		$scope.cancelClicked();
	    $scope.$emit('hideLoader');
	};
	var updateUserInfoFailureCallback = function(data){
		 $scope.errorMessage=data;
	    $scope.$emit('hideLoader');
	};
	$scope.invokeApi(RVSettingsSrv.updateUserInfo,{'new_password' :$scope.new_password},updateUserInfoSuccessCallback,updateUserInfoFailureCallback);  
	};

}]);