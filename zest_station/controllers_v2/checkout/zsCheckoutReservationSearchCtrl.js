sntZestStation.controller('zsCheckoutReservationSearchCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	'zsCheckoutSrv',
	function($scope, $rootScope, $state, zsEventConstants, zsCheckoutSrv) {

		BaseCtrl.call(this, $scope);

		var init = function() {
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//starting mode
			$scope.mode = "last_name_entry";
			$scope.reservationParams = {
				"last_name": "",
				"room_no": ""
			};
		};
		init();

		var searchReservation = function() {
			var checkoutVerificationSuccess = function(data) {
				console.log(data);
				//$scope.zestStationData.reservationData = data;
				//$state.go('zest_station.review_bill');
			};
			var checkoutVerificationCallBack = function() {
				$scope.mode = 'no_match';
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
				$scope.mode = "room_number_entry";
			};
		};

		$scope.roomNumberEntered = function() {
			searchReservation();
		};

		$scope.reEnterText = function(type) {
			$scope.mode = (type === "room") ? "room_number_entry" : "last_name_entry";
		};

		$scope.talkToStaff = function() {
			//to do
		};
	}
]);