/**
 *	This Controller is to view bill
 */
sntGuestWeb.controller('GwCheckoutReviewBillController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckoutSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckoutSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
//to do:CC

		var init = function() {
			var screenIdentifier = "REVIEW_BILL";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			var onSuccess = function(response) {
				$scope.billData = response.bill_details;
				$scope.roomNo = response.room_number;
				$scope.userDetails = {
					user_name: GwWebSrv.zestwebData.userName,
					user_city: GwWebSrv.zestwebData.userCity,
					user_state: GwWebSrv.zestwebData.userState
				};
			};
			var options = {
				params: {
					'reservation_id': GwWebSrv.zestwebData.reservationID
				},
				successCallBack: onSuccess
			};
			$scope.callAPI(GwCheckoutSrv.fetchBillDetails, options);
			$scope.showBill = false;
		}();
		$scope.gotToNextStep = function() {
			$state.go('checkOutFinal');
		};
	}
]);