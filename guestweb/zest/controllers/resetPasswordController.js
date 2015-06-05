snt.controller('resetPasswordController', ['$rootScope','$location','$state','$scope', 'resetPasswordService', '$modal', function($rootScope,$location,$state,$scope, resetPasswordService, $modal) {


	$scope.pageValid = true;
	$scope.showBackButtonImage = false;
    $scope.data = {};
    $scope.data.password = "";
    $scope.data.confirm_password = "";
    $scope.isPasswordReset = false;

    // $scope.hotelLogo = "/assets/img/Yotel/yotel-logo.png"

    //setup options for modal
	$scope.opts = {
		backdrop: true,
		backdropClick: true,
		templateUrl: '/assets/zest/partials/yotel/errorModal.html',
		controller: ModalInstanceCtrl,
		scope: $scope
	};
	
    $scope.resetPasswordClicked = function()	{
    	    
		    if($scope.data.password.localeCompare($scope.data.confirm_password) == 0 && $scope.data.password != "" && $scope.data.confirm_password != ""){
		    	$scope.data.perishable_token = $scope.accessToken;
		    	$scope.isPosting = true;
		    	resetPasswordService.resetPassword($scope.data).then(function(response) {
		    
                $scope.isPosting = false;
		        if(response.status === 'failure') {
		           $scope.errorMessage = response.errors[0];
		           $modal.open($scope.opts); // error modal popup
	           }
	           else{		    
	           
		           $scope.isPasswordReset = true;
	           } 
               },function(){
               	   $scope.isPosting = false;
               	   $scope.isPasswordReset = false;
	               $scope.errorMessage = "The password reset is unsuccessful. Please contact the front Desk"
		           $modal.open($scope.opts); // error modal popup
               });	 
		    }else if($scope.data.password == ""){
                $scope.errorMessage = "The password field is blank"
                $modal.open($scope.opts); // error modal popup
		    }else if($scope.data.confirm_password == ""){
                $scope.errorMessage = "The confirm password field is blank"
                $modal.open($scope.opts); // error modal popup
		    }else{
                $scope.errorMessage = "The password fields does not match"
                $modal.open($scope.opts); // error modal popup
		    }
		    	
	};		    
}]);