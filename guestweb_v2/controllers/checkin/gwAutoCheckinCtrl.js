/**
 * Checkin -Auto checkin Controller
 */
sntGuestWeb.controller('gwAutoCheckinController', ['$scope','$controller', 'GwWebSrv', 'GwCheckinSrv','$rootScope',
	function($scope, $controller, GwWebSrv,GwCheckinSrv,$rootScope) {

		$controller('BaseController', {
			$scope: $scope
		});
		//to delete
		$rootScope.accessToken = "e78a8786c11ce4ecd9ae2a7c452e2911";
		GwWebSrv.zestwebData.reservationID = "1339909"
		//to delete
		var init = function() {
			var screenIdentifier = "AUTO_CHECKIN_FINAL";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.isLoading = true;
		}();

		var completeAutoCheckinSuccess = function(response){
			console.log(response);
			$scope.displayText = response.confirmation_message;
			$scope.confirmationNumber = GwWebSrv.zestwebData.confirmationNo;
			$scope.isLoading = false;
		};
		var options = {
			params: {
				'reservation_id': GwWebSrv.zestwebData.reservationID
			},
			successCallBack: completeAutoCheckinSuccess,
		};
		$scope.callAPI(GwCheckinSrv.completeAutoCheckin, options);
	}
]);