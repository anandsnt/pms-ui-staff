var login = angular.module('login',['ui.router', 'ng-iscroll']);

login.controller('loginRootCtrl', ['$scope', function($scope){
}]);

login.controller('loginCtrl',['$scope', 'loginSrv', '$window', '$state', function($scope, loginSrv, $window, $state){
	 $scope.data = {};
	 $scope.errorMessage = "";
	 $scope.successCallback = function(data){
	 	if(data.token!=''){
	 		$state.go('resetpassword', {token: data.token});
	 	} else {
	 		$window.location.href = data.redirect_url;
	 	}
	 	 //$state.go('resetpassword');
	 	 // $window.location.href = data.redirect_url;
	 	// console.log(data);
	 };
	 $scope.failureCallBack = function(errorMessage){
	 	$scope.errorMessage = errorMessage;
	 };
	 $scope.submit = function() {
		loginSrv.login($scope.data, $scope.successCallback, $scope.failureCallBack);
	};

}]);

login.controller('resetCtrl',['$scope', 'resetSrv', '$window', '$state', '$stateParams', function($scope, resetSrv, $window, $state, $stateParams){
	 $scope.data = {};
	 $scope.data.token = $stateParams.token;
	 console.log($stateParams.token);
	 $scope.errorMessage = "";
	 $scope.successCallback = function(data){
	 	if(data.token!=''){
	 		$state.go('resetpassword');
	 	} else {
	 		$window.location.href = data.redirect_url;
	 	}
	 	 //$state.go('resetpassword');
	 	 // $window.location.href = data.redirect_url;
	 	// console.log(data);
	 };
	 $scope.failureCallBack = function(errorMessage){
	 	$scope.errorMessage = errorMessage;
	 };
	 $scope.submit = function() {
		resetSrv.resetPassword($scope.data, $scope.successCallback, $scope.failureCallBack);
	};

}]);


