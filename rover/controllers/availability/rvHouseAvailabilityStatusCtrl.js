sntRover.controller('RVHouseAvailabilityStatusCtrl', [
	'$scope', 
	'$timeout', 
	'ngDialog', 
	'$rootScope',
	'$filter',
	'rvAvailabilitySrv',
	function($scope, $timeout, ngDialog, $rootScope, $filter, rvAvailabilitySrv){
		

		$scope.$on('$includeContentLoaded', function(event){
			console.log("inside");
			$scope.$emit("hideLoader");
		});

		var init = function(){
			$s = $scope;
			$scope.houseStatus = {};
			fetchHouseStatus();
			
		};

		var fetchHouseStatus = function(){
			var houseStatusFetchSuccess = function(data){
				$scope.$emit("hideLoader");
				console.log(data);
				$scope.houseDetails = data;
				//$scope.houseDetails = computeHouseStatistics(data.results, data.physical_count);

			
			};
			var businessDate = tzIndependentDate($rootScope.businessDate);
			$scope.bd = $rootScope.businessDate;
			//We need to display only 3 days information
			var fromDate = businessDate.clone();
			fromDate.setDate(fromDate.getDate() - 1);
			//fromDate = $filter('date')(fromDate, $rootScope.dateFormatForAPI);
			var toDate = businessDate.clone();
			toDate.setDate(toDate.getDate() + 1);
			//toDate = $filter('date')(toDate, $rootScope.dateFormatForAPI);
			var dataForWebservice = {
				'from_date': $filter('date')(fromDate, $rootScope.dateFormatForAPI),
				'to_date'  : $filter('date')(toDate, $rootScope.dateFormatForAPI),
				'business_date' : $rootScope.businessDate
			}

			$scope.invokeApi(rvAvailabilitySrv.fetchHouseStatusDetails, dataForWebservice, houseStatusFetchSuccess);						
		};

/*		var computeHouseStatistics = function(data, houseTotal){
			var houseDetails = [];
			var houseStatus;
			var businessDate = tzIndependentDate($rootScope.businessDate);
			var date;
			console.log(businessDate);

			angular.forEach(data, function(dayInfo, i) {
				houseStatus = {};
				houseStatus.date = dayInfo.date;

				date = tzIndependentDate(dayInfo.date);
				console.log(date);
				//Set if the day is yesterday/today/tomorrow
				if(date.getTime() ==  businessDate.getTime()) {
					houseStatus.day = "TODAY";
				} else if(date.getTime() < businessDate.getTime()){
					houseStatus.day = "YESTERDAY";
				}else {
					houseStatus.day = "TOMORROW";
				}

				houseStatus.total_rooms_occupied = dayInfo.house.sold;
				houseStatus.total_guests_inhouse = dayInfo.house.in_house;
				houseStatus.departues_expected = dayInfo.house.departing;
				houseStatus.departures_actual = dayInfo.house.departed;
				houseStatus.arrivals_expected = dayInfo.house.arriving;
				houseStatus.arrivals_actual = dayInfo.house.arrived;
				
				houseStatus.available_tonight = Math.round(dayInfo.house.availability /houseTotal * 100);
				houseStatus.occupied_tonight = Math.round(dayInfo.house.sold /houseTotal * 100);

				houseStatus.total_room_revenue = dayInfo.total_room_revenue;
				houseStatus.avg_daily_rate = dayInfo.avg_daily_rate;

				houseDetails.push(houseStatus);
			});

		return houseDetails;

		};*/

		init();
	}
]);