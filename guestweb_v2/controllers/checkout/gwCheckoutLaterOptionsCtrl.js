/**
 * This Controller is to show the  late checkout options
 */
sntGuestWeb.controller('GwCheckoutLaterController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckoutSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckoutSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		//to do:CC
		var init = function() {
			var screenIdentifier = "CHECKOUT_LATER_OPTIONS";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			var onSuccess = function(response) {
				$scope.lateCheckoutOptions = response;
				$scope.isOperationCompleted = true;
			};
			var options = {
				params: {
					'reservation_id': GwWebSrv.zestwebData.reservationID
				},
				successCallBack: onSuccess
			};
			$scope.callAPI(GwCheckoutSrv.fetchLateCheckoutOptions, options);
		}();


		$scope.gotToNextStep = function(option) {
			var onSuccess = function(response) {
				if (!GwWebSrv.zestwebData.isCCOnFile && GwWebSrv.zestwebData.isMLI) {
					$state.go('ccAddition', {
						'fee': option.amount,
						'message': "Late check-out fee",
						'isFromCheckoutNow': false,
						'time': option.time,
						'ap': option.ap,
						'amount': option.amount
					});
				} else {
					$state.go('checkOutLaterFinal', {
						time: option.time,
						ap: option.ap,
						amount: option.amount
					});
				};

			};
			var options = {
				params: {
					'reservation_id': GwWebSrv.zestwebData.reservationID,
					'late_checkout_offer_id': option.id
				},
				//'is_cc_attached_from_guest_web':false};
				successCallBack: onSuccess
			};
			$scope.callAPI(GwCheckoutSrv.updateReservationWithNewCheckoutOptions, options);
		};
	}
]);