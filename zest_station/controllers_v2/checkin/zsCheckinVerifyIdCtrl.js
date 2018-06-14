sntZestStation.controller('zsCheckinVerifyIdCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	function($scope, $state, zsEventConstants, $stateParams) {

		var initializeMe = (function() {
			BaseCtrl.call(this, $scope);
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			$scope.screenMode = 'GUEST_LIST';
			$scope.adminPin = '';
			$scope.showWarningPopup = false;
			$scope.selectedReservation = {
				guest_details: [{
					'id': 1,
					'guest_type': 'ADULT',
					'first_name': 'Resheil',
					'last_name': 'Mohammed',
				}, {
					'id': 2,
					'guest_type': 'ADULT',
					'first_name': 'guest 1',
					'last_name': 'guest 1'
				}, {
					'id': 3,
					'guest_type': 'ADULT',
					'first_name': 'guest 2',
					'last_name': 'guest 2'
				}, {
					'id': 4,
					'guest_type': 'CHILDREN',
					'first_name': 'guest 3',
					'last_name': 'guest 3'
				}]
			};
			
			console.log(JSON.parse($stateParams.params));
		}());

		$scope.adminVerify = function() {
			$scope.screenMode = 'ADMIN_PIN_ENTRY';
		};

		$scope.goToNext = function () {
			var successCallback = function () {
				$scope.screenMode = 'GUEST_LIST';

			};
			var failureCallback = function () {
				$scope.screenMode = 'PIN_ERROR';
			};

			if($scope.adminPin == '') {
				failureCallback();
			} else {
				successCallback();
			}

		};

		$scope.retryPinEntry = function () {
			$scope.screenMode = 'ADMIN_PIN_ENTRY';
		};

		var apiParams = {
			guests_accepted_with_id: [],
			guests_accepted_without_id: []
		};
		var allGuestsAreVerified;

		var generateApiParams = function(approvePendingIds) {
			apiParams = {
				guests_accepted_with_id: [],
				guests_accepted_without_id: []
			};
			allGuestsAreVerified = true;
			_.each($scope.selectedReservation.guest_details, function(guest) {
				if (guest.review_status === '1') {
					apiParams.guests_accepted_with_id.push(guest.id);
				} else if (guest.review_status === '2' || approvePendingIds) {
					apiParams.guests_accepted_without_id.push(guest.id);
				} else {
					allGuestsAreVerified = false;
				}
			});
			console.log(apiParams);
		};

		$scope.callApiToRecord = function () {
			// call API
			console.log("record");
			console.log(apiParams);
		};

		$scope.acceptWithoutID = function () {
			var approvePendingIds = true;
			generateApiParams(approvePendingIds)
		};

		$scope.abortCheckin = function() {
			$state.go('zeststation.home');
		};

		$scope.hideWarningPopup = function(){
			$scope.showWarningPopup = false;
		};
		$scope.continueToNextScreen = function(guest) {
			generateApiParams();
			if(!allGuestsAreVerified) {
				$scope.showWarningPopup = true;
			} else {
				$scope.callApiToRecord();
			}
		};

	}
]);