snt.controller('resetPasswordController', ['$rootScope','$location','$state','$scope', 'resetPasswordService', '$modal', function($rootScope,$location,$state,$scope, resetPasswordService, $modal) {


	$scope.pageValid = true;
	$scope.showBackButtonImage = false;
    $scope.data = {};
    $scope.data.newPassword = "";
    $scope.data.confirmPassword = "";
    $scope.isPasswordReset = false;
	
    $scope.resetPasswordClicked = function()	{
		
		    resetPasswordService.resetPassword(data).then(function(response) {
		    

		    if(response.status === 'failure') {
		      // $modal.open($scope.opts); // error modal popup
	        }
	        else{		    
	           
		      $scope.isPasswordReset = false;
	        } 
        },function(){
	       $rootScope.netWorkError = true;
	       $scope.isPosting = false;
        });	 	
	};

}]);