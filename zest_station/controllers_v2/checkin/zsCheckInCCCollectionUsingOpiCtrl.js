sntZestStation.controller('zsCheckInCCCollectionUsingOpiCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsPaymentSrv',
	function($scope, $stateParams, $state, zsEventConstants, zsPaymentSrv) {

		BaseCtrl.call(this, $scope);
		var stateParams = JSON.parse($stateParams.params);

		$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
		$scope.screenMode = {
			paymentAction: 'ADD_CARD'
		};

		var goToCardSign = function() {
			// next state is expecting email as state param
			stateParams.email = stateParams.guest_email;
			$state.go('zest_station.checkInSignature', stateParams);
		};

		$scope.startOpiEMVActions = function() {
			$scope.screenMode.paymentAction = 'ADD_CARD';
			$scope.callAPI(zsPaymentSrv.chipAndPinGetToken, {
				params: {
					reservation_id: stateParams.reservation_id
				},
				successCallBack: goToCardSign,
				failureCallBack: function() {
					$scope.screenMode.paymentAction = 'CC_ERROR';
				}
			});
		};

		var timeOutListener = $scope.$on('USER_ACTIVITY_TIMEOUT', function() {
			$scope.screenMode.paymentAction = 'CC_TIMED_OUT';
		});

		$scope.$on('$destroy', timeOutListener);

		// On landing on this screen start OPI actions
		$scope.startOpiEMVActions();
	}
]);