/**
 * Checkin - ETA updation ctrl
 */
sntGuestWeb.controller('gwLateETAUpdationController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv', '$rootScope', '$modal','$stateParams',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv, $rootScope, $modal, $stateParams) {

		$controller('BaseController', {
			$scope: $scope
		});
		//to delete
		$rootScope.accessToken = "e78a8786c11ce4ecd9ae2a7c452e2911";
		GwWebSrv.zestwebData.reservationID = "1339909"
			//to delete
			//
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


		/**
		 * [updateTimeOfArrival description]
		 * @return {[type]} [description]
		 */
		$scope.updateTimeOfArrival = function() {

			if ($scope.arrivalTime.length === 0) {
				var popupOptions = angular.copy($scope.errorOpts);
				popupOptions.resolve = {
					message: function() {
						return "Please select a valid time."
					}
				};
				$modal.open(popupOptions);
			} else {
				var params = {
					"arrival_time": getFormattedTime($scope.arrivalTime),
					"reservation_id": GwWebSrv.zestwebData.reservationID
				};
				var updateReservationDetailsSuccess = function(response) {

					GwWebSrv.zestwebData.earlyCheckinHour = response.last_early_checkin_hour;
					GwWebSrv.zestwebData.earlyCheckinRestrictHour = response.early_checkin_restrict_hour;
					GwWebSrv.zestwebData.earlyCheckinRestrictTime = response.early_checkin_restrict_time;

					if (response.early_checkin_available && typeof response.early_checkin_offer_id !== "undefined" && !response.bypass_early_checkin) {
						var stateParams = {
							'time': response.checkin_time,
							'charge': response.early_checkin_charge,
							'id': response.early_checkin_offer_id
						};
						$state.go('earlyCheckinOptions', stateParams);
					} else if (response.early_checkin_on && !response.early_checkin_available && !response.bypass_early_checkin) {
						var stateParams = {
							'time': response.checkin_time,
							'isearlycheckin': true
						}
						$state.go('laterArrival', stateParams);
					} else {
						$state.go('autoCheckinFinal');
					};

				};
				var options = {
					params: params,
					successCallBack: updateReservationDetailsSuccess,
				};
				$scope.callAPI(GwCheckinSrv.updateReservationDetails, options);
			}
		};

	}
]);