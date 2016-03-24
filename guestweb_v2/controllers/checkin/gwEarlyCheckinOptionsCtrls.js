/**
 * Checkin - early checkin options
 */
sntGuestWeb.controller('gwEarlyCheckinOptionsController', ['$scope', '$state', '$stateParams', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $stateParams, $controller, GwWebSrv, GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "EARLY_CHECKIN_OPTIONS";
			$scope.checkinTime = $stateParams.time;
			$scope.earlyCheckinCharge = $stateParams.charge;
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@checkin-time", $scope.checkinTime);
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@early-checkin-charge", $scope.earlyCheckinCharge);
		}();

		$scope.nextButtonClicked = function() {
			var applyEarlyCheckinSuccess = function(response) {
				var stateParams = {'charge':$scope.earlyCheckinCharge};
				$state.go('earlyCheckinFinal', stateParams);
			};
			var params = {
				'reservation_id': GwWebSrv.zestwebData.reservationID,
				'early_checkin_offer_id': $stateParams.id
			};
			var options = {
				params: params,
				successCallBack: applyEarlyCheckinSuccess
			};
			$scope.callAPI(GwCheckinSrv.applyEarlyCheckin, options);
		};
		$scope.changeArrivalTime = function() {
			//to do
		};

	}
]);