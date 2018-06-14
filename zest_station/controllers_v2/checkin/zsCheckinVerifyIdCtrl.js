	sntZestStation.controller('zsCheckinVerifyIdCtrl', [
		'$scope',
		'$state',
		'zsEventConstants',
		'$stateParams',
		'zsGeneralSrv',
		function($scope, $state, zsEventConstants, $stateParams, zsGeneralSrv) {

			
			BaseCtrl.call(this, $scope);
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			$scope.screenMode = 'WAIT_FOR_STAFF';
			$scope.adminPin = '';
			$scope.showWarningPopup = false;
			$scope.selectedReservation = zsGeneralSrv.testData();
			console.log(JSON.parse($stateParams.params));
	

			var apiParams = {
				guests_accepted_with_id: [],
				guests_accepted_without_id: []
			};
			var allGuestsAreVerified;

			$scope.adminVerify = function() {
				$scope.screenMode = 'ADMIN_PIN_ENTRY';
			};

			$scope.goToNext = function() {
				var successCallback = function() {
					$scope.screenMode = 'GUEST_LIST';
				};
				var failureCallback = function() {
					$scope.screenMode = 'PIN_ERROR';
				};
				var options = {
					params: {
						'pin': $scope.adminPin
					},
					successCallBack: successCallback,
					failureCallBack: failureCallback
				};

				$scope.callAPI(zsGeneralSrv.verifyStaffByPin, options);
			};

			$scope.retryPinEntry = function() {
				$scope.screenMode = 'ADMIN_PIN_ENTRY';
			};

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

			var callApiToRecord = function() {
				var options = {
					params: apiParams,
					successCallBack: function() {
						console.log("next page");
					}
				};

				$scope.callAPI(zsGeneralSrv.recordIdVerification, options);
			};

			$scope.acceptWithoutID = function() {
				var approvePendingIds = true;
				generateApiParams(approvePendingIds);
				callApiToRecord();
			};

			$scope.abortCheckin = function() {
				$state.go('zest_station.home');
			};

			$scope.hideWarningPopup = function() {
				$scope.showWarningPopup = false;
			};

			$scope.continueToNextScreen = function() {
				generateApiParams();
				if (!allGuestsAreVerified) {
					$scope.showWarningPopup = true;
				} else {
					callApiToRecord();
				}
			};
		}
	]);