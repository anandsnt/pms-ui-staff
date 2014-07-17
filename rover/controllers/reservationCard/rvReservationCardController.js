sntRover.controller('reservationCardController', ['$rootScope', '$scope', 'RVReservationCardSrv', 'RVGuestCardSrv', '$filter', '$state', '$stateParams',
	function($rootScope, $scope, RVReservationCardSrv, RVGuestCardSrv, $filter, $state, $stateParams) {
		BaseCtrl.call(this, $scope);
		$scope.timeline = "";
		$scope.reservationList = [];
		$scope.currentReservationId = "";
		$scope.reservationCount = 0;

		var title = "Staycard";
		$scope.setTitle(title);

		$scope.reservationCardClick = function() {
			$scope.$emit('reservationCardClicked');
		};


		/*
		 * to get state params from resrvation details controller
		 */
		$scope.$on('passReservationParams', function(event, data) {

			// $scope.fetchReservationData(data.reservationId);
			// $scope.currentReservationId = data.confirmationNumber;
			// console.log(JSON.stringify(data))
			$scope.$emit('staycardGuestData', data);
			$scope.data = data;

			$scope.timeline = data.reservation_details.timeline;;

			$scope.countCurrent = data.reservation_list.current_reservations_arr.length;
			$scope.countUpcoming = data.reservation_list.upcoming_reservations_arr.length;
			$scope.countHistory = data.reservation_list.history_reservations_arr.length;

			$scope.currentReservationId = data.confirmationNumber;

			RVReservationCardSrv.setGuestData($scope.data.guest_details);

			var fetchGuestcardDataSuccessCallback = function(data) {
				console.log("+++++++++++++++")
				console.log($scope.data.countries);
				
				var contactInfoData = {
					'contactInfo': data,
					'countries': $scope.data.countries,
					'userId': data.user_id,
					'avatar': $scope.data.avatar,
					'guestId': data.guest_id,
					'vip': $scope.data.vip
				};
				$scope.$emit('guestCardUpdateData', contactInfoData);
				$scope.$emit('hideLoader');
				var guestInfo = {
					"user_id": data.user_id,
					"guest_id": data.guest_id
				};
				$scope.showGuestPaymentList(guestInfo);
			};
			var fetchGuestcardDataFailureCallback = function(data) {
				$scope.$emit('hideLoader');
			};

			//Make this call IFF a guest is available in the card
			if (typeof $scope.data.guest_details.reservation_id != "undefined" && $scope.data.guest_details.reservation_id != null) {
				var param = {
					'fakeDataToAvoidCache': new Date(),
					'id': $scope.data.guest_details.reservation_id
				};
				$scope.invokeApi(RVReservationCardSrv.fetchGuestcardData, param, fetchGuestcardDataSuccessCallback, fetchGuestcardDataFailureCallback, 'NONE');
			}

			if ($scope.timeline == "current") {
				$scope.reservationList = data.reservation_list.current_reservations_arr;
				//This status is used to show appr message if count of reservations in selected time line is zero
				$scope.reservationDisplayStatus = ($scope.countCurrent > 0) ? true : false;
			}
			if ($scope.timeline == "upcoming") {
				$scope.reservationList = data.reservation_list.upcoming_reservations_arr;
				//This status is used to show appr message if count of reservations in selected time line is zero
				$scope.reservationDisplayStatus = ($scope.countUpcoming > 0) ? true : false;
			}
			if ($scope.timeline == "history") {
				$scope.reservationList = data.reservation_list.history_reservations_arr;
				//This status is used to show appr message if count of reservations in selected time line is zero
				$scope.reservationDisplayStatus = ($scope.countHistory > 0) ? true : false;
			}

			RVReservationCardSrv.setGuestData($scope.data.guest_details);

		});
		/*
		 * Handles time line click events
		 * @param {string} time line
		 */
		$scope.showTimeLineReservation = function(timeline) {
			if (timeline == "current") {
				$scope.timeline = "current";
				$scope.reservationList = $scope.data.reservation_list.current_reservations_arr;

				if ($scope.countCurrent > 0) {
					$scope.currentReservationId = $scope.data.reservation_list.current_reservations_arr[0].confirmation_num;
					$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
				} else {
					$scope.currentReservationId = "";
					$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
				}
				//This status is used to show appr message if count of reservations in selected time line is zero
				$scope.reservationDisplayStatus = ($scope.countCurrent > 0) ? true : false;

			}
			if (timeline == "upcoming") {
				$scope.timeline = "upcoming";
				$scope.reservationList = $scope.data.reservation_list.upcoming_reservations_arr;
				if ($scope.countUpcoming > 0) {
					$scope.currentReservationId = $scope.data.reservation_list.upcoming_reservations_arr[0].confirmation_num;
					$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
				} else {
					$scope.currentReservationId = "";
					$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
				}
				//This status is used to show appr message if count of reservations in selected time line is zero
				$scope.reservationDisplayStatus = ($scope.countUpcoming > 0) ? true : false;

			}
			if (timeline == "history") {
				$scope.timeline = "history";
				$scope.reservationList = $scope.data.reservation_list.history_reservations_arr;
				if ($scope.countHistory > 0) {
					$scope.currentReservationId = $scope.data.reservation_list.history_reservations_arr[0].confirmation_num;
					$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
				} else {
					$scope.currentReservationId = "";
					$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
				}
				//This status is used to show appr message if count of reservations in selected time line is zero
				$scope.reservationDisplayStatus = ($scope.countHistory > 0) ? true : false;
			}
			$scope.$broadcast('RESERVATIONLISTUPDATED');

		};
		/*
		 * get reservation details on click each reservation
		 * @param {string} current clicked confirmation number
		 */
		$scope.getReservationDetails = function(currentConfirmationNumber, currentId) {

			// $scope.$broadcast("RESERVATIONDETAILS", currentConfirmationNumber);
			$state.go("rover.staycard.reservationcard.reservationdetails", {
				"id": currentId,
				"confirmationId": currentConfirmationNumber,
				"isrefresh": true
			});
			$scope.currentReservationId = currentConfirmationNumber;
		};
		/*
		 * To show the payment data list
		 */
		$scope.showGuestPaymentList = function(guestInfo) {
			var userId = guestInfo.user_id,
				guestId = guestInfo.guest_id;
			var paymentSuccess = function(paymentData) {
				$scope.$emit('hideLoader');

				var paymentData = {
					"data": paymentData,
					"user_id": userId,
					"guest_id": guestId
				};
				$scope.$emit('GUESTPAYMENTDATA', paymentData);
				$scope.$emit('SHOWGUESTLIKES');
			};
			$scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, userId, paymentSuccess, '', 'NONE');
		};


	}
]);