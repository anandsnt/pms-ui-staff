sntRover.controller('rvReservationGuestController', ['$scope', '$rootScope', 'RVReservationGuestSrv', '$stateParams', '$state', '$timeout', 'ngDialog',
	function($scope, $rootScope, RVReservationGuestSrv, $stateParams, $state, $timeout, ngDialog) {

		BaseCtrl.call(this, $scope);
		$scope.guestData = {};
		var presentGuestInfo = {};
		$scope.errorMessage = '';

		$scope.init = function() {

			var successCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.guestData = data;
				$scope.$emit("GETVARYINGOCCUPANCY");
				presentGuestInfo = JSON.parse(JSON.stringify($scope.guestData));
				$scope.errorMessage = '';
			};

			var errorCallback = function(errorMessage) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
			};

			var data = {
				"reservation_id": $scope.reservationData.reservation_card.reservation_id
			};

			$scope.invokeApi(RVReservationGuestSrv.fetchGuestTabDetails, data, successCallback, errorCallback);
		};

		$scope.$on("VARYINGOCCUPANCY", function(e, data) {
			$scope.guestData.varying_occupancy = data;
		});

		/* To save guest details */
		$scope.saveGuestDetails = function() {

			var data = JSON.parse(JSON.stringify($scope.guestData));
			var dataUpdated = false;
			if (!angular.equals(data, presentGuestInfo)) {
				dataUpdated = true;
			}

			if (dataUpdated) {

				var successCallback = function(data) {
					$scope.$emit('hideLoader');
					$scope.errorMessage = '';
					$scope.$emit("GETVARYINGOCCUPANCY");
					presentGuestInfo = JSON.parse(JSON.stringify($scope.guestData));
				};

				var errorCallback = function(errorMessage) {
					$scope.$emit('hideLoader');
					$scope.$emit("OPENGUESTTAB");
					$scope.errorMessage = errorMessage;
				};

				var dataToSend = dclone(data, ["primary_guest_details", "accompanying_guests_details"]);
				dataToSend.accompanying_guests_details = [];
				dataToSend.reservation_id = $scope.reservationData.reservation_card.reservation_id;

				angular.forEach(data.accompanying_guests_details, function(item, index) {
					delete item.image;
					if ((item.first_name == "" || item.first_name == null) && (item.last_name == "" || item.last_name == null)) {
						// do nothing
					} else {
						// Only valid data is going to send.
						dataToSend.accompanying_guests_details.push(item);
					}
				});

				$scope.invokeApi(RVReservationGuestSrv.updateGuestTabDetails, dataToSend, successCallback, errorCallback);
			}
		};

		$scope.$on("UPDATEGUESTDEATAILS", function(e) {
			$scope.saveGuestDetails();
		});

		/**
		 * To check the currently entered occupancy and display prompt if it is not configured
		 * @return boolean [description]
		 */
		function isWithinMaxOccupancy() {
			var maxOccupancy = 5; //TODO: Get the max occupancy here
			var currentTotal = parseInt($scope.guestData.adult_count || 0) +
				parseInt($scope.guestData.children_count || 0) +
				parseInt($scope.guestData.infants_count || 0);

			return currentTotal > maxOccupancy;
		}

		/**
		 * CICO-12672 Occupancy change from the staycard --
		 */
		$scope.onStayCardOccupancyChange = function() {
			console.log({
				adults: $scope.guestData.adult_count,
				children: $scope.guestData.children_count,
				infants: $scope.guestData.infants_count
			})

			if (isWithinMaxOccupancy()) {
				////////
				// Step 1 : Check against max occupancy and let know the user if the occupancy is not allowed
				////////
				ngDialog.open({
					template: '/assets/partials/reservation/alerts/occupancy.html',
					className: 'ngdialog-theme-default',
					scope: $scope,
					closeByDocument: false,
					closeByEscape: false,
					data: JSON.stringify({
						roomType: "Sample Room",
						roomMax: "4"
					})
				});

				$scope.guestData.adult_count = presentGuestInfo.adult_count;
				$scope.guestData.children_count = presentGuestInfo.children_count;
				$scope.guestData.infants_count = presentGuestInfo.infants_count;
			} else {
				presentGuestInfo.adult_count = $scope.guestData.adult_count;
				presentGuestInfo.children_count = $scope.guestData.children_count;
				presentGuestInfo.infants_count = $scope.guestData.infants_count;
			}

		}

		$scope.init();
	}
]);