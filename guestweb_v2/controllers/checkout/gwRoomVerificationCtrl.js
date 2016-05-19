/**
 *	Verify room
 */
sntGuestWeb.controller('GwRoomVerificationController', ['$scope', '$state', '$controller','$modal', 'GwWebSrv', 'GwCheckoutSrv',
	function($scope, $state, $controller,$modal, GwWebSrv, GwCheckoutSrv) {

		$controller('BaseController', {
			$scope: $scope
		});

		var init = function() {
			var screenIdentifier = "ROOM_VERIFICATION";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.roomVerificationInstruction  = GwWebSrv.zestwebData.roomVerificationInstruction;
		}();

		$scope.continueButtonClicked = function() {
			var onSuccess = function(response) {
				// check and navigate base upon checkout later option is available
				GwWebSrv.zestwebData.isLateCheckoutAvailable ? $state.go('checkOutOptions') : $state.go('checkOutConfirmation');
			};
			var onFailure = function() {
				var popupOptions = angular.copy($scope.errorOpts);
				popupOptions.resolve = {
					message: function() {
						return "We couldn't verify your room number. Please try again or check out at the front desk."
					}
				};
				$modal.open(popupOptions);
			};
			var options = {
				params: {
					'reservation_id': GwWebSrv.zestwebData.reservationID,
					'room_number': $scope.roomNumber
				},
				successCallBack: onSuccess,
				failureCallBack: onFailure
			};

			$scope.callAPI(GwCheckoutSrv.verifyRoom, options);
		};
	}
]);