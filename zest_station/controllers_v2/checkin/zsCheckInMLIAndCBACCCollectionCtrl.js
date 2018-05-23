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
		stateParams.deposit_amount = '0.1';

		if (stateParams.payment_method === 'CC' && stateParams.mode === 'DEPOSIT') {
			$scope.depositAmount = stateParams.deposit_amount;
			$scope.screeMode = 'DEPOSIT';
		} else {
			$scope.screeMode = 'CC_COLLECTION';
			$scope.zestStationData.waitingForSwipe = true;
		}
		console.log(stateParams);

		var goToCardSign = function() {
			//TODO: uncomment below code
			// $state.go('zest_station.checkInSignature', stateParams);
			console.log("card sign");
		};

		// CBA payment

		$scope.proceedToDeposit = function() {
			// do CBA payment
			var paymentSuccess = function() {
				goToCardSign();
			};
			paymentSuccess();
		};


		// MLI card collection

		var goToSwipeError = function() {
			$scope.zestStationData.waitingForSwipe = false;
			$scope.swipeTimeout = false;
			$scope.swipeError = true;
		};

		var successSavePayment = function(){
			if(stateParams.mode === 'DEPOSIT'){
				$scope.depositAmount = stateParams.deposit_amount;
				$scope.screeMode = 'DEPOSIT';
			} else{
				goToCardSign();
			}
		};

		var saveSwipedCardMLI = function(response) {
            var swipeOperationObj = new SwipeOperation();
            var postData = swipeOperationObj.createSWipedDataToSave(response);

            postData.reservation_id = stateParams.reservation_id;

			$scope.callAPI(zsPaymentSrv.savePayment, {
				params: postData,
				successCallBack: successSavePayment,
				failureCallBack: goToSwipeError
			});
        };

		 var processSwipeCardData = function(swipedCardData) {
            var swipeOperationObj = new SwipeOperation();
            var params = swipeOperationObj.createDataToTokenize(swipedCardData);
			var onFetchMLITokenResponse = function(response) {
				swipedCardData.token = response;
				saveSwipedCardMLI(swipedCardData);
			};

            $scope.callAPI(zsGeneralSrv.tokenize, {
                params: params,
                successCallBack: onFetchMLITokenResponse,
                failureCallBack: goToSwipeError
            });
        };


		var onCardSwipeResponse = function(evt, swipedCardData) {
			if($scope.screeMode === 'DEPOSIT'){
				return;
			}
			processSwipeCardData(swipedCardData);
		};

		$scope.reTryCardSwipe = function(){
			$scope.zestStationData.waitingForSwipe = true;
			$scope.swipeError = false;
			$scope.swipeTimeout = false;
		};
		var onCCTimeout = function() {
			$scope.zestStationData.waitingForSwipe = false;
			$scope.swipeError = false;
			$scope.swipeTimeout = true;
		};
		var backButtonAction = function() {
			$state.go('zest_station.checkInReservationDetails', stateParams);
		};

		var backButtonActionListener = $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, backButtonAction);
		var swipeListener = $scope.$on('SWIPE_ACTION', onCardSwipeResponse);
		var timeOutListener = $scope.$on('USER_ACTIVITY_TIMEOUT', onCCTimeout);

		$scope.$on('$destroy', backButtonActionListener);
		$scope.$on('$destroy', swipeListener);
		$scope.$on('$destroy', timeOutListener);

		// To Mock MLI swipe - 
		// Once payment screen is loaded, 
		// In browser console call document.dispatchEvent(new Event('MOCK_MLI_SWIPE')) 

		document.addEventListener('MOCK_MLI_SWIPE', function() {
			$scope.$emit('showLoader');
			$timeout(function() {
				$scope.$emit('hideLoader');
				onCardSwipeResponse({}, sntPaymentSrv.sampleMLISwipedCardResponse);
			}, 1000);
		});

		document.addEventListener('TIMEOUT', function() {
			onActivityTimeout();
			$scope.$emit('RUN_APPLY');
		});
	}
]);