hkRover.controller('HKOWSErrorCtrl', ['$scope', 'HKOWSTestSrv',
										function($scope, HKOWSTestSrv) {

	/**
	* Call API to test the OWS connection
	*/
	$scope.tryAgainButtonClicked = function() {
	
		$scope.$parent.$emit('showLoader');

		HKOWSTestSrv.checkOWSConnection().then(function(data) {
			$scope.$parent.$emit('hideLoader');
			$scope.closeThisDialog();
		}, function(){
			$scope.$parent.$emit('hideLoader');
		});
	};

}]);