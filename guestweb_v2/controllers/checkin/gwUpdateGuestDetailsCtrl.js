/**
 * Checkin - Reservation details Controller
 */
sntGuestWeb.controller('gwUpdateGuestDetailsController', ['$scope', '$state', '$controller', 'GwWebSrv', 'GwCheckinSrv',
	function($scope, $state, $controller, GwWebSrv, GwCheckinSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "GUEST_DETAILS_UPDATE";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
			$scope.years = returnYearsInReverseOrder();
			$scope.months = returnMonthsArray();
			$scope.guestDetails = {
								'day':'',
								'month':'',
								'year':'',
								'postal_code':'',
								'state':'',
								'city':'',
								'street':'',
								'street2':'',
								'birthday':'',
								'country':''
							  };
		}();

		var guestDetailsFetchSuccess = function(response){
			$scope.guestDetails       	 = response;
			$scope.guestDetails.street   = response.street1;
			$scope.guestDetails.country	 = response.country_id;
			$scope.guestDetails.day   	 = ($scope.guestDetails.birthday !== null) ? parseInt($scope.guestDetails.birthday.substring(8, 10)): "";
			$scope.guestDetails.month 	 = ($scope.guestDetails.birthday !== null)?  parseInt($scope.guestDetails.birthday.substring(5, 7)) : "";
			$scope.guestDetails.year  	 = ($scope.guestDetails.birthday !== null)?  parseInt($scope.guestDetails.birthday.substring(0, 4)): "";
		};

		var options = {
			params: {
				'reservation_id': GwWebSrv.zestwebData.reservationID
			},
			successCallBack: guestDetailsFetchSuccess,
		};
		$scope.callAPI(GwCheckinSrv.getGuestDetails, options);
	

		$scope.yearOrMonthChanged = function(){
			if(!checkIfDateIsValid($scope.guestDetails.month,$scope.guestDetails.day,$scope.guestDetails.year)){
				$scope.guestDetails.day = "";
			}else{
				return;
			}
		};

		var getDataToSave = function() {
			var data = {};
			var unwanted_keys = ["month", "year", "day"];
			var newObject = JSON.parse(JSON.stringify($scope.guestDetails));
			for (var i = 0; i < unwanted_keys.length; i++) {
				delete newObject[unwanted_keys[i]];
			};
			data = newObject;
			if ($scope.guestDetails.month && $scope.guestDetails.day && $scope.guestDetails.year) {
				data.birthday = $scope.guestDetails.month + "-" + $scope.guestDetails.day + "-" + $scope.guestDetails.year;
			} else {
				delete data["birthday"];
			};
			return data;
		};


	}
]);