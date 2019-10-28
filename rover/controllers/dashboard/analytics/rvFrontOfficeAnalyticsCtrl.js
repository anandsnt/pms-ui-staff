sntRover.controller('rvFrontOfficeAnalyticsCtrlController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvFrontOfficeAnalyticsSrv',
	'rvAnalyticsSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvFrontOfficeAnalyticsSrv, rvAnalyticsSrv, $controller) {

		BaseCtrl.call(this, $scope);
		$scope.screenData = {
			selectedChart: 'FO_ARRIVALS'
		};

		$controller('rvFrontOfficeWorkloadCtrl', {
			$scope: $scope
		});
		$controller('rvFrontOfficeManagementAnalyticsCtrl', {
			$scope: $scope
		});

		$controller('rvFrontOfficeActivityCtrl', {
			$scope: $scope
		});



		var onBarChartClick = function() {
			// console.log(JSON.stringify(e));
		};

		var date = $rootScope.businessDate;

		var renderfdWorkloadChart = function() {
            var hotelCheckinTime = $rootScope.hotelDetails.hotel_checkin_time;
            var hotelCheckoutTime = $rootScope.hotelDetails.hotel_checkout_time;

			rvFrontOfficeAnalyticsSrv.fdWorkload(date, hotelCheckinTime, hotelCheckoutTime).then(function(data) {
				var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick
				};

				d3.select('#analytics-chart').selectAll('svg').remove();
				$scope.drawWorkLoadChart(chartDetails);
			});
		};
		var renderFrontOfficeManagementChart = function() {

			rvFrontOfficeAnalyticsSrv.fdArrivalsManagement(date).then(function(data) {
				console.log(JSON.stringify(data));
				var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick
				};
				try {
				d3.select('#analytics-chart').selectAll('svg').remove();
				$scope.drawArrivalManagementChart(chartDetails);
				} catch (e) {
					console.log(e)
				}
			});
		};

		var clearAllExistingChartElements = function() {
			document.getElementById("left-side-legend").innerHTML = "";
			document.getElementById("analytics-chart").innerHTML = "";
			document.getElementById("right-side-legend").innerHTML = "";
		};

		var renderFrontOfficeActivity = function() {

			rvFrontOfficeAnalyticsSrv.fdFoActivity(date).then(function(data) {
				clearAllExistingChartElements();
				d3.select('#analytics-chart').selectAll('svg').remove();
				$scope.drawFrontOfficeActivity(data);
			});
		};

		var drawChart = function() {
			clearAllExistingChartElements();
			$scope.screenData.mainHeading = "";
			if ($scope.screenData.selectedChart === 'FO_ARRIVALS') {
				renderFrontOfficeManagementChart();
			} else if ($scope.screenData.selectedChart === 'FO_WORK_LOAD') {
				renderfdWorkloadChart();
			} else if ($scope.screenData.selectedChart = 'FO_ACTIVITY') {
				renderFrontOfficeActivity();
			}
		};

		$(window).on("resize.doResize", function() {
			$scope.$apply(function() {
				$timeout(function() {
					// Clear existing chart
					d3.select('#analytics-chart').selectAll('svg').remove();
					clearAllExistingChartElements();
					// Redraw chart
					drawChart();
				}, 0);
			});
		});

		$scope.$on('ANALYTICS_MENU_CHANGED', function(e, selectedChart){
			$scope.screenData.selectedChart = selectedChart;
			clearAllExistingChartElements();
			drawChart();
		});

		$scope.$on("$destroy", function() {
			$(window).off("resize.doResize");
		});

		var fetchData = function (date, roomTypeId) {
			var params = {
				"date": date,
				"room_type_id": roomTypeId
			};
			var options = {
				params: params,
				successCallBack: function() {
					clearAllExistingChartElements();
                    drawChart();
                }
			};

			$scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);
		};

		$scope.$on('RELOAD_DATA_WITH_SELECTED_FILTER', function(e, filter) {
			fetchData(filter.date, filter.room_type_id);
		});

		$scope.$on('RESET_ANALYTICS_FILTERS', function (){
			$scope.dashboardFilter.datePicked = $rootScope.businessDate;
			$scope.dashboardFilter.selectedRoomTypeId = "";
			$scope.dashboardFilter.selectedAnalyticsMenu = "HK_OVERVIEW";
			$scope.screenData.selectedChart = "HK_OVERVIEW";
		});

		(function() {
			fetchData($scope.dashboardFilter.datePicked, $scope.dashboardFilter.selectedRoomTypeId)
		})();
	}
]);
