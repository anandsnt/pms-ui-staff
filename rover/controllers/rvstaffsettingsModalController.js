sntRover.controller('RVStaffsettingsModalController', ['$scope','ngDialog','RVSettingsSrv', function($scope,ngDialog,RVSettingsSrv){

BaseCtrl.call(this, $scope);
$scope.new_password = '';
$scope.confirmPassword ='';
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


$scope.updateSettings = function(){

	var updateUserInfoSuccessCallback = function(data){
	    $scope.$emit('hideLoader');
	};
	var updateUserInfoFailureCallback = function(data){
	    $scope.$emit('hideLoader');
	};
	$scope.invokeApi(RVSettingsSrv.updateUserInfo,{'new_password' :$scope.new_password},updateUserInfoSuccessCallback,updateUserInfoFailureCallback);  
	};

}]);