/**
 *	This Controller is to view bill
 */
sntGuestWeb.controller('GwCheckoutReviewBillController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckoutSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckoutSrv) {

		$controller('BaseController', {
			$scope: $scope
		});


		var init = function() {
			var screenIdentifier = "REVIEW_BILL";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			var onSuccess = function(response) {
				$scope.billData = response.bill_details;
				$scope.roomNo = response.room_number;
			};
			var options = {
				params: {},
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