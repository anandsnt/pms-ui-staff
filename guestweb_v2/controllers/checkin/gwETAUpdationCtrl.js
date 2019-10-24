/**
 * Checkin - ETA updation ctrl
 */
sntGuestWeb.controller('gwETAUpdationController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv', '$rootScope', '$modal',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv, $rootScope, $modal) {

		$controller('gwETABaseController', {
			$scope: $scope
		});
		
		var init = (function() {
			var screenIdentifier = "ETA_UPDATION";

			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.timings = returnTimeArray();// utils function
			$scope.arrivalTime = "";
			$scope.comment = "";
		}());

		var fetchHotelTimeSuccess = function(response) {
			if (response.guest_arriving_today) {
				// need to restrict ETA selection based on the hotel's time
				var hotelTime = response.hote_time;
				var hotelTimeLimitInTimeIndex = getIndexOfSelectedTime(hotelTime);// utils function
				// check with Jeff if we need this
				// $scope.timings = (hotelTimeLimit === "12:00 am") ? []: $scope.timings;
				// remove all times prior to hotels time

				$scope.timings.splice(0, hotelTimeLimitInTimeIndex);
			} else {
				return;
			}
		};

		var options = {
			params: {
				'reservation_id': GwWebSrv.zestwebData.reservationID
			},
			successCallBack: fetchHotelTimeSuccess
		};

		if (!GwWebSrv.zestwebData.isInZestwebDemoMode) {
			$scope.callAPI(GwCheckinSrv.fetchHotelTime, options);	
		}

	}
]);