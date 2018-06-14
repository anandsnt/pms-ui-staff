sntZestStation.controller('zsCheckinVerifyIdCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	function($scope, $state, zsEventConstants, $stateParams) {

		var initializeMe = (function() {
			BaseCtrl.call(this, $scope);
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			$scope.screenMode = 'WAIT_FOR_STAFF';
			console.log(JSON.parse($stateParams.params));
		}());

	}
]);