snt.controller('resetPasswordController', ['$rootScope','$location','$state','$scope', function($rootScope,$location,$state,$scope) {


	$scope.pageValid = true;
	$scope.showBackButtonImage = false;
    $scope.data = {};
    $scope.data.newPassword = "";
    $scope.data.confirmPassword = "";
    $scope.isPasswordReset = false;
	


}]);