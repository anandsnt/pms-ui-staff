sntZestStation.controller('zsCheckoutKeyCardActionsCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'zsModeConstants',
	'$stateParams',
	'$sce', 'zsTabletSrv',
	'zsCheckoutSrv', '$timeout',
	function($scope, $state, zsEventConstants, zsModeConstants, $stateParams, $sce, zsTabletSrv, zsCheckoutSrv, $timeout) {


		var init = function() {
			BaseCtrl.call(this, $scope);
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			$scope.reservationSearchFailed = false;
			$scope.zestStationData.isKeyCardLookUp = true;
			$scope.socketBeingConnected = true;
		}();

		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			$state.go('zest_station.checkoutSearchOptions'); //go back to checkout options
		});

		$scope.navToPrev = function() {
			$scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
		};
		/**
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			} else {
				return;
			}
		};


		var findReservationSuccess = function(data) {
			if (data.reservation_id === null) {
				$scope.socketOperator.EjectKeyCard();
			} else {
				$scope.zestStationData.keyCardInserted = true;
				$scope.zestStationData.reservationData = data;
				$state.go('zest_station.review_bill');
			}
		};

		var ejectCard = function() {
			$scope.socketOperator.EjectKeyCard();
		};

		var goToRetryPage = function() {
			$scope.reservationSearchFailed = true;
			ejectCard();
			runDigestCycle();
		};

		var findReservationFailed = function() {
			goToRetryPage();
		};

		var findReservation = function(uid) {
			var options = {
				params: {
					'uid': uid
				},
				successCallBack: findReservationSuccess,
				failureCallBack: findReservationFailed
			};
			$scope.callAPI(zsCheckoutSrv.fetchReservationFromUId, options);
		};
		/********************************************************************************
		 *  Websocket actions related to keycard lookup
		 *  starts here
		 ********************************************************************************/

		$scope.$on('UID_FETCH_SUCCESS', function(event, data) {
			findReservation(data.uid)
		});
		$scope.$on('UID_FETCH_FAILED', function() {
			findReservationFailed();
		});
		$scope.$on('SOCKET_FAILED', function() {
			findReservationFailed();
		});
		$scope.$on('SOCKET_CONNECTED', function() {
			$scope.socketOperator.InsertKeyCard();
		});
		/********************************************************************************
		 *  Websocket actions related to keycard lookup
		 *  ends here
		 ********************************************************************************/

		var setTimeOutFunctionToEnsureSocketIsOpened = function() {
			$timeout(function() {
				// so inorder to avoid a possible error because of
				// wrong timing adding a buffer of 1.5 seconds
				$scope.socketBeingConnected = false; //connection success
			}, 1000);

		};
		var init = function() {
			setTimeOutFunctionToEnsureSocketIsOpened();
			console.info("websocket: readyState -> " + $scope.socketOperator.returnWebSocketObject().readyState);
			//close the opened socket
			($scope.socketOperator.returnWebSocketObject().readyState !== 1) ? $scope.$emit('CONNECT_WEBSOCKET'): $scope.socketOperator.InsertKeyCard();
		}();

		/** 
		 * reservation search failed actions starts here
		 * */
		$scope.retrySearch = function() {
			$scope.reservationSearchFailed = false;
			$scope.socketBeingConnected = true;
			setTimeOutFunctionToEnsureSocketIsOpened();
			runDigestCycle();
		};

		$scope.talkToStaff = function() {
			$state.go('zest_station.talk_to_staff');
		};

		$scope.searchByName = function() {
			$state.go('checkOutReservationSearch');
		};
	}
]);