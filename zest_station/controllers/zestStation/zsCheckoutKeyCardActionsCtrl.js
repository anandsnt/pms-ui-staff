sntZestStation.controller('zsCheckoutKeyCardActionsCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'zsModeConstants',
	'$stateParams',
	'$sce', 'zsTabletSrv',
	'zsCheckoutSrv',
	function($scope, $state, zsEventConstants, zsModeConstants, $stateParams, $sce, zsTabletSrv,zsCheckoutSrv) {

		BaseCtrl.call(this, $scope);
		$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
		$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
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

		var findReservationSuccess = function(data) {
			if(data.reservation_id === null){
				$scope.socketOperator.EjectKeyCard();
			}
			console.log(data);
			//to delete
			// var data = {
			// 	"reservation_id": 1339907,
			// 	"email": "resheil@stayntouch.com",
			// 	"guest_detail_id": 473901,
			// 	"has_cc": false,
			// 	"first_name": "Resheil",
			// 	"last_name": "M555",
			// 	"days_of_stay": 121,
			// 	"is_checked_out": false
			// };
			//to delete
			// $scope.zestStationData.reservationData = data;
			// $state.go('zest_station.review_bill');
		};

		var ejectCard = function(){
			console.log("failed")
			$scope.socketOperator.EjectKeyCard();
		};

		var findReservationFailed = function(){
			ejectCard();
			//handle retry / continue by name / see staff
		};
		var findReservation = function(uid)
		{
			 var options = {
                    params            : {'uid':uid},
                    successCallBack   : findReservationSuccess,
                    failureCallBack   : findReservationFailed
            };
            $scope.callAPI(zsCheckoutSrv.fetchReservationFromUId, options);
		};
		


		var actionSuccesCallback = function(response) {
			console.log(response.UID);

                var cmd = response.Command,
                    msg = response.Message;
			console.log(cmd);
			console.log(msg);

			if (response.Command === 'cmd_insert_key_card') {
				$scope.zestStationData.keyCardInserted = true;
				(typeof response.UID !== "undefined" && response.UID !== null) ? findReservation(response.UID):findReservationFailed() ;
			}
			else if(response.Command === 'cmd_eject_key_card'){
				console.log(response);
				if(response.ResponseCode === 19){
					// key ejection failed
					$state.go('zest_station.error_page');
				}
			};
		};
		var socketOpenedFailureCallback = function(){
			console.log("failed");
			$scope.socketOperator.InsertKeyCard();
		}
		var socketOpenedSuccessCallback = function() {
			console.log("opened");
			$scope.socketOperator.InsertKeyCard();
		};

		$scope.socketOperator.connectWebSocket(socketOpenedSuccessCallback,socketOpenedFailureCallback, actionSuccesCallback);

	}
]);