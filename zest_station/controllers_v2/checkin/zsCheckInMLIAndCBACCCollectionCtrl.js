sntZestStation.controller('zsCheckInMLIAndCBACCCollectionCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$controller',
	'$timeout',
	'zsCheckinSrv',
	'zsModeConstants',
	'zsGeneralSrv',
	'sntPaymentSrv',
	'zsPaymentSrv',
	function($scope, $stateParams, $state, zsEventConstants, $controller, $timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv, sntPaymentSrv, zsPaymentSrv) {

		BaseCtrl.call(this, $scope);
		var stateParams = JSON.parse($stateParams.params);

		$scope.screenMode = {};
		$controller('zsPaymentCtrl', {
			$scope: $scope
		});
		$scope.initiateCBAlisteners();
		$scope.reservation_id = stateParams.reservation_id;

		// Collect deposit if applicable
		if (stateParams.mode === 'DEPOSIT') {
			$scope.screenMode.paymentAction = 'PAY_AMOUNT';
			$scope.screenMode.value = 'DEPOSIT';
			$scope.$emit("FETCH_PAYMENT_TYPES", {
				paymentTypeName: 'CBA',
				amountToPay: stateParams.deposit_amount
			});
		} else {
			// action type for determining which process to be done in zsPaymentCtrl
			$scope.screenMode.paymentAction = 'ADD_CARD';
			// screen display mode
			$scope.screenMode.value = 'CC_COLLECTION';
			$scope.waitingForSwipe = true;
			$scope.$emit('START_MLI_CARD_COLLECTION');
		}


		var startCBAPayment = function() {
			$scope.screenMode.isCBADespositMode = true;
			$scope.startCBAPayment();
		};

		// CBA
		var goToCardSign = function() {
			zsPaymentSrv.setPaymentData({});
			// next state is expecting email as param
			stateParams.email = stateParams.guest_email;
			$state.go('zest_station.checkInSignature', stateParams);
		};

		$scope.proceedToDeposit = function() {
			startCBAPayment();
		};

		// MLI card collection
		var goToSwipeError = function() {
			$scope.waitingForSwipe = false;
			$scope.swipeTimeout = false;
			$scope.swipeError = true;
			if (stateParams.mode === 'DEPOSIT') {
				$scope.screenMode.value = 'DEPOSIT';
			}
		};

		$scope.reTryCardSwipe = function() {
			$scope.waitingForSwipe = true;
			$scope.swipeError = false;
			$scope.swipeTimeout = false;
			if ($scope.screenMode.paymentAction === 'PAY_AMOUNT') {
				$scope.screenMode.value = 'PAYMENT_IN_PROGRESS';
				startCBAPayment();
			}
		};
		var onCCTimeout = function() {
			if ($scope.screenMode.isCBADespositMode) {
				return;
			}
			$scope.waitingForSwipe = false;
			$scope.swipeError = false;
			$scope.swipeTimeout = true;
		};
		var backButtonAction = function() {
			$state.go('zest_station.checkInReservationDetails', stateParams);
		};

		var onMLICCSave = $scope.$on('SAVE_CC_SUCCESS', goToCardSign);

		var cbaPaymentCompletedActions = function() {
			// If primary method is not CC , collect CC
			if (stateParams.payment_method === 'CC') {
				goToCardSign();
			} else {
				$scope.screenMode.paymentAction = 'ADD_CARD';
				// screen display mode
				$scope.screenMode.value = 'CC_COLLECTION';
				$scope.waitingForSwipe = true;
				$scope.$emit('START_MLI_CARD_COLLECTION');
			}
		};

		// Listeners
		var backButtonActionListener = $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, backButtonAction);
		var timeOutListener = $scope.$on('USER_ACTIVITY_TIMEOUT', onCCTimeout);
		var paymentFailureListener = $scope.$on('PAYMENT_FAILED', goToSwipeError);
		var paymentSuccessListener = $scope.$on('CBA_PAYMENT_COMPLETED', cbaPaymentCompletedActions);

		$scope.$on('$destroy', backButtonActionListener);
		$scope.$on('$destroy', timeOutListener);
		$scope.$on('$destroy', paymentFailureListener);
		$scope.$on('$destroy', paymentSuccessListener);
		$scope.$on('$destroy', onMLICCSave);

		// mocking actions
		document.addEventListener('ACTIVITY_TIMEOUT', function() {
			onCCTimeout();
			$scope.$digest();
		});
		document.addEventListener('PAYMENT_FAILED', function() {
			goToSwipeError();
			$scope.$digest();
		});
	}
]);