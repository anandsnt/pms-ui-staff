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
			rvAnalyticsSrv.hkOverview(date).then(function(data) {
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
			$scope.screenData.mainHeading = "";
			// Calling HK Overview Build Graph
			rvAnalyticsSrv.hkWorkPriority(date).then(function(data) {
				console.log(data);
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

		(function() {
			fetchData($scope.dashboardFilter.datePicked, $scope.dashboardFilter.selectedRoomTypeId)
		})();
	}
]);
