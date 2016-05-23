sntZestStation.controller('zsKeyDispenseCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'zsGeneralSrv',
	function($scope, $stateParams, $state, zsEventConstants, zsGeneralSrv) {

		//pickup key and checkin share this . But HTML will be differnt.
		//and use two states and two controllers inheriting this controller.
		//zest_station.checkInKeyDispense and zest_station.pickUpKeyDispense
		//include all common functions that will be shared in both screens
		//use the inherited controller for the customized actions like
		//navigation to next page or nav back

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {

			BaseCtrl.call(this, $scope);
			//hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
		}();
		/**
		 * [set data from stateParams description]
		 * @type {[type]}
		 */
		$scope.selectedReservation = {
			"reservationId" : $stateParams.reservation_id,
			"room": $stateParams.room_no,
			"first_name": $stateParams.first_name
		};

		/**
		 * [fetchDoorLockSettings description]
		 * @return {[type]} [description]
		 */
		var fetchDoorLockSettings = function() {
			var onResponse = function(response) {
				var remote = (response.enable_remote_encoding) ? 'enabled' : 'disabled';
				$scope.remoteEncoding = response.enable_remote_encoding;
			};
			$scope.callAPI(zsGeneralSrv.getDoorLockSettings, {
				params: {},
				'successCallBack': onResponse
			});
		}();
	}
]);