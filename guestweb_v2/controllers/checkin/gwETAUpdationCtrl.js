/**
 * Checkin - ETA updation ctrl
 */
sntGuestWeb.controller('gwETAUpdationController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv','$rootScope',
	function($scope, $state, $controller, GwWebSrv,GwCheckinSrv,$rootScope) {

		$controller('BaseController', {
			$scope: $scope
		});

		$rootScope.accessToken = "e78a8786c11ce4ecd9ae2a7c452e2911";

		GwWebSrv.zestwebData.reservationID ="1339909"
		var init = function() {
			var screenIdentifier = "ETA_UPDATION";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.timings = returnTimeArray();
		}();

			var onSuccess = function(response){
				var hoteTime ="11:47:14 AM";
				hotelTimeHour =  hoteTime.slice(0, 2);
				hotelTimeMinute =  hoteTime.slice(3, 5);
				hotelPrimeTime = hoteTime.slice(-2).toLowerCase();
				console.log(hotelPrimeTime)

				hotelTimeMinuteLimit = "00";
				if(hotelTimeMinute === "00" || hotelTimeMinute < 15){
					hotelTimeMinuteLimit = "15";
				}
				else if(hotelTimeMinute >= 15 && hotelTimeMinute < 30){
					hotelTimeMinuteLimit = "30";
				}
				else if(hotelTimeMinute >= 30 && hotelTimeMinute < 45){
					hotelTimeMinuteLimit = "45";
				}
				else{
					hotelTimeHour = parseInt(hotelTimeHour)+1;
					hotelTimeHour = (hotelTimeHour < 10) ? ("0"+hotelTimeHour) : hotelTimeHour;
					hotelTimeMinuteLimit = "00";
				}
				
				var switchAMPM = function(){
					(hotelPrimeTime === "pm") ? "am" : "pm";
				};
				(hotelTimeHour === 12 && hotelTimeMinuteLimit === "00")? switchAMPM() : "";
				
								
				console.log(hotelPrimeTime)
				hotelTimeLimit = hotelTimeHour+":"+hotelTimeMinuteLimit+" "+hotelPrimeTime;

				  var hotelTimeLimitInTimeIndex = _.findIndex($scope.timings, function(time) {
				    return time === hotelTimeLimit;
				  });
				  console.log(hotelTimeLimit)
				//   console.log($scope.timings.length);
				//   console.log($scope.timings.length -1);
				//   console.log(hotelTimeLimitInTimeIndex);
				// console.log($scope.timings);
				$scope.timings.splice(0,hotelTimeLimitInTimeIndex);
				console.log($scope.timings);

			};
		
			var options = {
				params: {'reservation_id': GwWebSrv.zestwebData.reservationID},
				successCallBack: onSuccess,
			};
			$scope.callAPI(GwCheckinSrv.fetchHotelTime, options);

	}
]);