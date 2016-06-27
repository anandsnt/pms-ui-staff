sntZestStation.controller('zsCheckoutKeyCardActionsCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'zsModeConstants',
	'$stateParams',
	'$sce',
	'zsCheckoutSrv', '$timeout',
	function($scope, $state, zsEventConstants, zsModeConstants, $stateParams, $sce, zsCheckoutSrv, $timeout) {

		/********************************************************************************
		 **		Expected state params -----> nothing			  
		 **		Exit function -> findReservationSuccess								
		 **																		 
		 *********************************************************************************/


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
			} else if (data.is_checked_out) {
				$scope.zestStationData.keyCardInserted = true;
				$scope.alreadyCheckedOut = true;
			} else {
				$scope.zestStationData.keyCardInserted = true;
				var stateParams = {
					"from": "keycard",
					"reservation_id": data.reservation_id,
					"email": data.email,
					"guest_detail_id": data.guest_detail_id,
					"has_cc": data.has_cc,
					"first_name": data.first_name,
					"last_name": data.last_name,
					"days_of_stay": data.days_of_stay,
					"hours_of_stay": data.hours_of_stay
				}
				$state.go('zest_station.checkoutReservationBill', stateParams);
			}
		};

		var ejectCard = function() {
			$scope.$emit('EJECT_KEYCARD');
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
			//open socket if not in open state
			($scope.socketOperator.returnWebSocketObject().readyState !== 1) ? $scope.$emit('CONNECT_WEBSOCKET'): $scope.socketOperator.InsertKeyCard();
		};
		init();

		/** 
		 * reservation search failed actions starts here
		 * */
		$scope.retrySearch = function() {
			$scope.reservationSearchFailed = false;
			$scope.socketBeingConnected = true;
			init();
			runDigestCycle();
		};

		$scope.searchByName = function() {
			$state.go('zest_station.checkOutReservationSearch');
		};

		$scope.alreadyCheckedOutActions = function() {
			$scope.$emit('EJECT_KEYCARD');
			$state.go('zest_station.home');
		};
	}
]);