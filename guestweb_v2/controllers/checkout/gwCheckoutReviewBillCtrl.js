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
			// varibale to handle bill popup
			$scope.showBill = false;
		}();

		$scope.gotToNextStep = function() {
			//if payment gateway is MLI
			// and balance >0 and CC is not attached
			if(!GwWebSrv.zestwebData.isCCOnFile && parseInt($scope.billData.balance) > 0.00 && GwWebSrv.zestwebData.isMLI){
				$state.go('ccAddition',{'fee':$scope.billData.balance,'message':'Check-out fee','isFromCheckoutNow':true});
			}
			else{
				$state.go('checkOutFinal');
			};
		};
	}
]);