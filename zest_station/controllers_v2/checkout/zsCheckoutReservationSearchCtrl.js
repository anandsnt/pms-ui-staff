sntZestStation.controller('zsCheckoutReservationSearchCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	'zsCheckoutSrv',
	function($scope, $rootScope, $state, zsEventConstants, zsCheckoutSrv) {

		/** MODES in the screen
		*   1.LAST_NAME_ENTRY --> enter last name
		*   2.ROOM_NUMBER_ENTRY --> enter room number
		*   3.NO_MATCH --> no reservation found
		**/

		BaseCtrl.call(this, $scope);

		var init = function() {
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				$state.go('zest_station.home');
			});
			//starting mode
			$scope.mode = "LAST_NAME_ENTRY";
			$scope.reservationParams = {
				"last_name": "",
				"room_no": ""
			};
		};
		init();

		var searchReservation = function() {
			var checkoutVerificationSuccess = function(data) {
				var stateParams = {
					"from": "searchByName",
					"reservation_id": data.reservation_id,
					"email": data.email,
					"guest_detail_id": data.guest_detail_id,
					"has_cc": data.has_cc,
					"first_name": data.first_name,
					"last_name": data.last_name,
					"days_of_stay": data.days_of_stay,
					"hours_of_stay": data.hours_of_stay,
					"is_checked_out": data.is_checked_out
				};
				$state.go('zest_station.checkoutReservationBill', stateParams);
			};
			var checkoutVerificationCallBack = function() {
				$scope.mode = 'NO_MATCH';
			};
			var params = {
				"last_name": $scope.reservationParams.last_name,
				"room_no": $scope.reservationParams.room_no + ''.replace(/\-/g, '') //adding '' to for non-str values
			};
			var options = {
				params: params,
				successCallBack: checkoutVerificationSuccess,
				failureCallBack: checkoutVerificationCallBack
			};
			$scope.callAPI(zsCheckoutSrv.findReservation, options);
		};

		$scope.lastNameEntered = function() {
			//if room is already entered, no need to enter again
			if ($scope.reservationParams.room_no.length > 0) {
				searchReservation();
			} else {
				$scope.mode = "ROOM_NUMBER_ENTRY";
			};
		};

		$scope.roomNumberEntered = function() {
			searchReservation();
		};

		$scope.reEnterText = function(type) {
			$scope.mode = (type === "room") ? "ROOM_NUMBER_ENTRY" : "LAST_NAME_ENTRY";
		};

		$scope.talkToStaff = function() {
			//to do
		};
	}
]);