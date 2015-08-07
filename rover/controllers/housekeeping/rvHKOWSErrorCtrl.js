sntRover.controller('RVHKOWSErrorCtrl', ['$scope', 'RVHKOWSTestSrv', '$rootScope', 'ngDialog',function($scope, RVHKOWSTestSrv, $rootScope, ngDialog) {

	/**
	* Call API to test the OWS connection
	*/
	$scope.tryAgainButtonClicked = function() {

		$scope.$parent.$emit('showLoader');

		RVHKOWSTestSrv.checkOWSConnection().then(function(data) {
			$scope.$parent.$emit('hideLoader');
			$scope.closeThisDialog();
			$rootScope.$broadcast('OWSConnectionRetrySuccesss');
		}, function(){
			$scope.$parent.$emit('hideLoader');
		});
	};
	$scope.closeThisDialog = function(){
			$rootScope.isOWSErrorShowing = false;
			ngDialog.close();
	};

}]);