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
			email: !$stateParams.guest_email_blacklisted ? ($stateParams.guest_email || '') : '',
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

		var precheckinReseravation = function() {
			var options = {
				params: {
					reservation_id: $stateParams.reservation_id,
					application: 'KIOSK',
					set_arrival_time_to_current_time: true
				},
				successCallBack: showSuccessPage
			};

			$scope.callAPI(zsCheckinSrv.preCheckinReservation, options);
		};

		var notifyProperty = function() {
			var locationNoteText;
			var comeBackLaterText;
			var noteForStaff;

			// Assuming that the default language will be the language used by the staff, use those tags for notes.
			// If no tag is provided in default language, for now hardcode some text
			if (zsGeneralSrv.refToLatestPulledTranslations && zsGeneralSrv.defaultLangShortCode) {
				var defaulTranslations = zsGeneralSrv.refToLatestPulledTranslations[zsGeneralSrv.defaultLangShortCode];

				locationNoteText = defaulTranslations['ROOM_UNAVAILABLE_NOTE_WITH_LOCATION'];
				comeBackLaterText = defaulTranslations['ROOM_UNAVAILABLE_NOTE'];
			}

			if ($scope.screenData.action_type === 'find_guest') {
				noteForStaff = locationNoteText ?
					locationNoteText.replace("{{ location }}", $scope.screenData.location) :
					'When the room is ready, please find the guest at' + ' ' + $scope.screenData.location;
			} else {
				noteForStaff = comeBackLaterText ?
					comeBackLaterText :
					'The guest will come back later to check if the room is ready by then.';
			}
			var params = {
				application: 'KIOSK',
				action_type: $scope.screenData.action_type,
				note_topic: 1,
				reservation_id: $stateParams.reservation_id,
				text: noteForStaff
			};

			var options = {
				params: params,
				successCallBack: function() {
					if ($scope.isAutoCheckinOn) {
						precheckinReseravation();
					} else {
						showSuccessPage();
					}
				}
			};

			$scope.callAPI(zsCheckinSrv.addNotes, options);
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

		(function() {
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
		}());
	}
]);