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
		$scope.reservation_id = stateParams.reservation_id;

		// if CC is already present, collect deposit if applicable
		if (stateParams.payment_method === 'CC' && stateParams.mode === 'DEPOSIT') {
			$scope.screenMode.paymentAction = 'PAY_AMOUNT';
			$scope.depositAmount = stateParams.deposit_amount;
			$scope.screenMode.value = 'DEPOSIT';
		} else {
			// action type for determining which process to be done in zsPaymentCtrl
			$scope.screenMode.paymentAction = 'ADD_CARD';
			// screen display mode
			$scope.screenMode.value = 'CC_COLLECTION';
			$scope.waitingForSwipe = true;
		}


		var startCBAPayment = function() {
			var paymentParams = zsPaymentSrv.getPaymentData();
			$scope.screenMode.isCBADespositMode = true;
			$scope.initiateCBAlisteners();
			$scope.startCBAPayment();
		};

		// stateParams.deposit_amount = '0.1';
		// $scope.isIpad = true;
		// $scope.zestStationData.noCheckInsDebugger = true;

		// CBA
		var goToCardSign = function() {
			zsPaymentSrv.setPaymentData({});
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
		};

		$scope.reTryCardSwipe = function() {
			$scope.waitingForSwipe = true;
			$scope.swipeError = false;
			$scope.swipeTimeout = false;
		};
		var onCCTimeout = function() {
			if($scope.screenMode.isCBADespositMode){
				return;
			}
			$scope.waitingForSwipe = false;
			$scope.swipeError = false;
			$scope.swipeTimeout = true;
		};
		var backButtonAction = function() {
			$state.go('zest_station.checkInReservationDetails', stateParams);
		};

		var onCCSave = $scope.$on('SAVE_CC_SUCCESS', function() {
			// on CC addition, collect deposit if applicable
			// else to signature page
			if (stateParams.mode === 'DEPOSIT') {
				$scope.depositAmount = stateParams.deposit_amount;
				$scope.screenMode.value = 'DEPOSIT';
			} else {
				goToCardSign();
			}
		});

		// Listeners
		var backButtonActionListener = $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, backButtonAction);
		var timeOutListener = $scope.$on('USER_ACTIVITY_TIMEOUT', onCCTimeout);
		var paymentFailureListener = $scope.$on('PAYMENT_FAILED', goToSwipeError);
		var paymentSuccessListener = $scope.$on('CBA_PAYMENT_COMPLETED', goToCardSign);

		$scope.$on('$destroy', backButtonActionListener);
		$scope.$on('$destroy', timeOutListener);
		$scope.$on('$destroy', paymentFailureListener);
		$scope.$on('$destroy', paymentSuccessListener);


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