sntRover.controller('RVHouseKeepingAnalyticsController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvAnalyticsSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvAnalyticsSrv, $controller) {

		BaseCtrl.call(this, $scope);
		$scope.screenData = {
			selectedChart : 'HK_OVERVIEW'
		};

		$controller('rvHKOverviewAnalticsCtrl', {
			$scope: $scope
		});
		$controller('rvHkWokrPriorityCtrl', {
			$scope: $scope
		});

		var onBarChartClick = function (e) {
			console.log(JSON.stringify(e));
		};

		var date = $rootScope.businessDate;

		var renderHkOverview = function() {
			$scope.screenData.mainHeading = "";
            // Calling HK Overview Build Graph
			rvAnalyticsSrv.hkOverview($scope.dashboardFilter.datePicked).then(function(data) {
				console.log(data);
				var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick
				};

				d3.select('#analytics-chart').selectAll('svg').remove();
				$scope.drawHkOverviewChart(chartDetails);
			});
        };

		var renderHkWorkPriority = function() {
		    var hotelCheckinTime = $rootScope.hotelDetails.hotel_checkin_time;
		    var hotelCheckoutTime = $rootScope.hotelDetails.hotel_checkout_time;

			$scope.screenData.mainHeading = "";
			// Calling HK Overview Build Graph
			rvAnalyticsSrv.hkWorkPriority($scope.dashboardFilter.datePicked, hotelCheckinTime, hotelCheckoutTime).then(function(data) {

				var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick
				};

				d3.select('#analytics-chart').selectAll('svg').remove();
				$scope.drawHkWorkPriorityChart(chartDetails);
			});

		};

		var clearAllExistingChartElements = function() {
			document.getElementById("left-side-legend").innerHTML = "";
			document.getElementById("right-side-legend").innerHTML = "";
			document.getElementById("analytics-chart").innerHTML = "";
		};

		var drawChart = function() {
			if ($scope.screenData.selectedChart === 'HK_OVERVIEW') {
				renderHkOverview();
			} else {
				renderHkWorkPriority();
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

		$scope.$on("$destroy", function() {
			$(window).off("resize.doResize");
		});

		$scope.$on('ANALYTICS_MENU_CHANGED', function(e, selectedChart){
			$scope.screenData.selectedChart = selectedChart;
			clearAllExistingChartElements();
			drawChart();
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
