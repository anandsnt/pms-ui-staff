sntZestStation.controller('zsCheckoutKeyCardActionsCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'zsModeConstants',
	'$stateParams',
	'$sce', 'zsTabletSrv',
	'zsCheckoutSrv','$timeout',
	function($scope, $state, zsEventConstants, zsModeConstants, $stateParams, $sce, zsTabletSrv, zsCheckoutSrv,$timeout) {

		BaseCtrl.call(this, $scope);
		$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
		$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
		$scope.reservationSearchFailed = false;
		$scope.zestStationData.isKeyCardLookUp = true;
		$scope.socketBeingConnected = true;
		sntZestStation.filter('unsafe', function($sce) {
			return function(val) {
				return $sce.trustAsHtml(val);
			};
		});

		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			$state.go('zest_station.home'); //go back to reservation search results
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


		$scope.$on('UID_FETCH_SUCCESS', function(event, data) {
			findReservation(data.uid)
		});

		$scope.$on('UID_FETCH_FAILED',function(){
			findReservationFailed();
		});

		var setTimeOutFunctionToEnsureSocketIsOpened = function(){
			$timeout(function() {
				// there is some delay in actual socket operations
				// even after the socket is being open
				// so inorder to avoid a possible error because of
				// wrong timing adding a buffer of 1.5 seconds
                $scope.socketBeingConnected = false;//connection success
  			}, 1500);
  			$scope.socketOperator.InsertKeyCard();
		};
		var init = function(){
			//$scope.socketOperator.connectWebSocket(socketOpenedSuccessCallback, socketOpenedFailureCallback, actionSuccesCallback);
			setTimeOutFunctionToEnsureSocketIsOpened();
		}();

		/** 
		 * reservation search failed actions starts here
		 * */
		$scope.retrySearch = function() {
			$scope.reservationSearchFailed = false;
			//$scope.socketOperator.connectWebSocket(socketOpenedSuccessCallback, socketOpenedFailureCallback, actionSuccesCallback);
			$scope.socketBeingConnected = true;
			setTimeOutFunctionToEnsureSocketIsOpened();
			runDigestCycle();
		};

		$scope.talkToStaff = function() {
			$state.go('zest_station.talk_to_staff');
		};

		$scope.searchByName = function() {
			$state.lastAt = 'home';
			$state.isPickupKeys = false;
			$state.mode = zsModeConstants.CHECKOUT_MODE;
			$state.go('zest_station.reservation_search', {
				mode: zsModeConstants.CHECKOUT_MODE
			});
		};
		// reservation search failed actions ends here

	}
]);