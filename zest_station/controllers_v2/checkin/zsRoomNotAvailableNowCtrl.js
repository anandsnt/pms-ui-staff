sntZestStation.controller('zsRoomNotAvailableNowCtrl', [
	'$scope',
	'zsEventConstants',
	'zsUtilitySrv',
	'zsCheckinSrv',
	'zsGeneralSrv',
	'$stateParams',
	'$filter',
	function($scope, zsEventConstants, zsUtilitySrv, zsCheckinSrv, zsGeneralSrv, $stateParams, $filter) {

		BaseCtrl.call(this, $scope);

		$scope.screenData = {
			email: $stateParams.guest_email || '',
			guest_name: $stateParams.last_name ? ($stateParams.first_name + ' ' + $stateParams.last_name) : $stateParams.first_name,
			action_type: '',
			location: '',
			mode: 'CHOOSE_ACTION'
		};
		// TODO: to expand  for sent_to_queue ?
		$scope.isAutoCheckinOn = $scope.zestStationData.precheckin_details.precheckin_on === "true" &&
								 $scope.zestStationData.precheckin_details.precheckin_action === "auto_checkin";
		var guestWaitingLocations = $filter('translate')('GUEST_WAITING_LOCATIONS');
		// The tag GUEST_WAITING_LOCATIONS has to be saved in admin with ';' separating location names
		$scope.guestWaitingLocations = guestWaitingLocations === 'GUEST_WAITING_LOCATIONS' ? [] : guestWaitingLocations.split(";");

		$scope.showNextButton = function() {
			return ($scope.screenData.action_type === 'send_mail' && zsUtilitySrv.isValidEmail($scope.screenData.email)) ||
				($scope.screenData.action_type === 'find_guest' && !!$scope.screenData.location) ||
				$scope.screenData.action_type === 'guest_will_come_back_later';
		};

		var showSuccessPage = function() {
			$scope.screenData.mode = 'ACTION_COMPLETED';
		};

		var notifyProperty = function() {
			var params = {
				reservation_id: $stateParams.reservation_id,
				application: 'KIOSK',
				action_type: $scope.screenData.action_type
			};

			if ($scope.screenData.action_type === 'find_guest') {
				params.location = $scope.screenData.location;
			}
			var options = {
				params: params,
				successCallBack: showSuccessPage
			};

			$scope.callAPI(zsCheckinSrv.preCheckinReservation, options);
		};

		var precheckinReseravation = function() {
			var options = {
				params: {
					reservation_id: $stateParams.reservation_id,
					application: 'KIOSK'
				},
				successCallBack: showSuccessPage
			};

			$scope.callAPI(zsCheckinSrv.preCheckinReservation, options);
		};

		var updateEmailId = function() {
			var options = {
				params: {
					guest_id: $stateParams.guest_id,
					email: $scope.screenData.email,
					application: 'KIOSK'
				},
				successCallBack: precheckinReseravation
			};

			$scope.callAPI(zsGeneralSrv.updateGuestEmail, options);
		};

		$scope.nextButtonClicked = function() {
			if ($scope.screenData.action_type === 'send_mail') {
				// if mail id has changed, update email id, and then precheckin the reservation
				if (!_.isEqual($stateParams.guest_email, $scope.screenData.email)) {
					updateEmailId();
				} else {
					precheckinReseravation();
				}
			} else if ($scope.screenData.action_type === 'guest_will_come_back_later') {
				$scope.screenData.location = '';
				notifyProperty();
			} else {
				notifyProperty();
			}
		};

		var initializeMe = (function() {
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
		}());

	}
]);