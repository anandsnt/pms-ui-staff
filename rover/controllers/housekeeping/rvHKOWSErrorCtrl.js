sntRover.controller('RVHKOWSErrorCtrl', ['$scope', 'RVHKOWSTestSrv',function($scope, RVHKOWSTestSrv) {

	/**
	* Call API to test the OWS connection
	*/
	$scope.tryAgainButtonClicked = function() {
	
		$scope.$parent.$emit('showLoader');

		RVHKOWSTestSrv.checkOWSConnection().then(function(data) {
			$scope.$parent.$emit('hideLoader');
			$scope.closeThisDialog();
		}, function(){
			$scope.$parent.$emit('hideLoader');
		});
	};

}]);