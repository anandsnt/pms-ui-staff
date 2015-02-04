snt.controller('resetPasswordController', ['$rootScope','$location','$state','$scope', 'resetPasswordService', '$modal', function($rootScope,$location,$state,$scope, resetPasswordService, $modal) {


	$scope.pageValid = true;
	$scope.showBackButtonImage = false;
    $scope.data = {};
    $scope.data.password = "";
    $scope.data.confirm_password = "";
    $scope.isPasswordReset = false;
	
    $scope.resetPasswordClicked = function()	{
		    if($scope.data.password.localeCompare($scope.data.confirm_password) == 0){
		    	$scope.data.perishable_token = $scope.accessToken;
		    	resetPasswordService.resetPassword($scope.data).then(function(response) {
		    

		        if(response.status === 'failure') {
		        // $modal.open($scope.opts); // error modal popup
	           }
	           else{		    
	           
		           $scope.isPasswordReset = true;
	           } 
               },function(){
               	   $scope.isPasswordReset = false;
	               $rootScope.netWorkError = true;
	               $scope.isPosting = false;
               });	 
		    }else{

		    }
		    	
	};
}]);