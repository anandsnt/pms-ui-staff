sntRover.controller('RVHouseAvailabilityStatusCtrl', [
	'$scope', 
	'$timeout', 
	'ngDialog', 
	'$rootScope',
	'$filter',
	'rvAvailabilitySrv',
	function($scope, $timeout, ngDialog, $rootScope, $filter, rvAvailabilitySrv){
		$s = $scope;

		$scope.$on('$includeContentLoaded', function(event){
			$scope.$emit("hideLoader");
		});

		var init = function(){
			$scope.houseStatus = {};
			fetchHouseStatus();
			
		};

		var fetchHouseStatus = function(){
			var houseStatusFetchSuccess = function(data){
				console.log(data);
				console.log("house status availability fetch sc")

			};
			var businessDate = tzIndependentDate($rootScope.businessDate);
			//We need to display only 3 days information
			var fromDate = businessDate.clone();
			fromDate.setDate(fromDate.getDate() - 1);
			//fromDate = $filter('date')(fromDate, $rootScope.dateFormatForAPI);
			var toDate = businessDate.clone();
			toDate.setDate(toDate.getDate() + 1);
			//toDate = $filter('date')(toDate, $rootScope.dateFormatForAPI);
			console.log(toDate);
			var dataForWebservice = {
				'from_date': $filter('date')(fromDate, $rootScope.dateFormatForAPI),
				'to_date'  : $filter('date')(toDate, $rootScope.dateFormatForAPI)
			}

			$scope.invokeApi(rvAvailabilitySrv.fetchHouseStatusDetails, dataForWebservice, houseStatusFetchSuccess);						
		};

		var computeHouseStatistics = function(data){
			var houseStatus;
			var businessDate = tzIndependentDate($rootScope.businessDate);
			var date;
			var house;

			angular.forEach(data.results, function(dayInfo, i) {
				houseStatus = {};
				date = tzIndependentDate(dayInfo.date);
				//Set if the day is yesterday/today/tomorrow
				if(date ==  businessDate) {
					houseStatus.day = "TODAY";
				} else if(date < businessDate){
					houseStatus.day = "YESTERDAY";
				}else {
					houseStatus.day = "TOMORROW";
				}
				house = data.house;

				houseStatus.total_rooms_occupied = data.physical_count;
				houseStatus.total_guests_inhouse = house.in_house;
				houseStatus.departues_expected = house.departing;
				houseStatus.departures_actual = house.departed;
				houseStatus.arrivals_expected = house.arriving;
				houseStatus.arrivals_actual = house.arrived;
				
				houseStatus.available_tonight = house.availability;
				houseStatus.occupied_tonight = 0;

				houseStatus.total_room_revenue = dayInfo.total_room_revenue;
				houseStatus.avg_daily_rate = dayInfo.avg_daily_rate;

			});

		};

		init();
	}
]);