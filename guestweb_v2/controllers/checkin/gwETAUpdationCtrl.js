/**
 * Checkin - ETA updation ctrl
 */
sntGuestWeb.controller('gwETAUpdationController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv', '$rootScope','$modal',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv, $rootScope,$modal) {

		$controller('BaseController', {
			$scope: $scope
		});
		//to delete
		$rootScope.accessToken = "e78a8786c11ce4ecd9ae2a7c452e2911";
		GwWebSrv.zestwebData.reservationID = "1339909"
		//to delete
		//
		var init = function() {
			var screenIdentifier = "ETA_UPDATION";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.timings = returnTimeArray();//utils function
			$scope.arrivalTime = "";
			$scope.comment ="";
		}();

		var fetchHotelTimeSuccess = function(response) {
			if (response.guest_arriving_today) {
				//need to restrict ETA selection based on the hotel's time
				var hotelTime = response.hote_time;
				var hotelTimeLimitInTimeIndex = getIndexOfSelectedTime(hotelTime);//utils function
				// check with Jeff if we need this
				//$scope.timings = (hotelTimeLimit === "12:00 am") ? []: $scope.timings;
				//remove all times prior to hotels time
				$scope.timings.splice(0, hotelTimeLimitInTimeIndex);
			} else {
				return;
			}
		};

		var options = {
			params: {
				'reservation_id': GwWebSrv.zestwebData.reservationID
			},
			successCallBack: fetchHotelTimeSuccess,
		};
		$scope.callAPI(GwCheckinSrv.fetchHotelTime, options);

		/**
		 * [updateTimeOfArrival description]
		 * @return {[type]} [description]
		 */
		$scope.updateTimeOfArrival = function(){

			if($scope.arrivalTime.length === 0){
				var popupOptions = angular.copy($scope.errorOpts);
				popupOptions.resolve = {
					message: function() {
						return "Please select a valid time."
					}
				};
				$modal.open(popupOptions);
			}
			else{
				var params = {
					"arrival_time":getFormattedTime($scope.arrivalTime),
					"comments": $scope.comment,
					"reservation_id": GwWebSrv.zestwebData.reservationID
				};
				var updateReservationDetailsSuccess = function(response){

					if (response.early_checkin_available && typeof response.early_checkin_offer_id !== "undefined" && !response.bypass_early_checkin) {
						var stateParams = {
							'time': response.checkin_time,
							'charge': response.early_checkin_charge,
							'id': response.early_checkin_offer_id
						};
						$state.go('earlyCheckinOptions',stateParams);
					} else if (response.early_checkin_on && !response.early_checkin_available && !response.bypass_early_checkin) {
						var stateParams = {
							'time': response.checkin_time,
							'isearlycheckin': true
						}
						//$state.go('laterArrival',stateParams);
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