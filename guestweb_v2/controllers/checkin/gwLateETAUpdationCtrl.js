/**
 * Checkin - ETA updation ctrl
 */
sntGuestWeb.controller('gwLateETAUpdationController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv', '$rootScope', '$modal','$stateParams',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv, $rootScope, $modal, $stateParams) {

		$controller('gwETABaseController', {
			$scope: $scope
		});
		
		var init = function() {
			var screenIdentifier = "ETA_LATE_UPDATION";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.timings = returnTimeArray(); //utils function
			$scope.checkinTime = $stateParams.time;
			$scope.earlyCheckinRestrictLimit = GwWebSrv.zestwebData.earlyCheckinRestrictTime;
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@checkin-time", $scope.checkinTime);
			$scope.screenCMSDetails.description = replaceStringWithScopeVariable($scope.screenCMSDetails.description,"@early-checkin-limit", $scope.earlyCheckinRestrictLimit);
			$scope.arrivalTime = "";
		}();

		//need to restrict ETA selection based on early checkin restrict time
		var hotelTimeLimitInTimeIndex = getIndexOfSelectedTime(GwWebSrv.zestwebData.earlyCheckinRestrictTime); //utils function
		// check with Jeff if we need this
		//$scope.timings = (hotelTimeLimit === "12:00 am") ? []: $scope.timings;
		//remove all times prior to hotels time
		$scope.timings.splice(0, hotelTimeLimitInTimeIndex);

	}
]);