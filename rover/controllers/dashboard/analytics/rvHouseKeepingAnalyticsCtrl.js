sntRover.controller('RVHouseKeepingAnalyticsController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvAnalyticsSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvAnalyticsSrv, $controller) {

		BaseCtrl.call(this, $scope);
		$scope.screenData = {
			selectedChart : 'OVERVIEW'
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
			document.getElementById("analytics-chart").innerHTML = "";
			document.getElementById("right-side-legend").innerHTML = "";
		};

		$scope.changeChart = function() {
			clearAllExistingChartElements();
			if ($scope.screenData.selectedChart === 'OVERVIEW') {
				$scope.screenData.selectedChart = 'WORK_PRIORITY';
				renderHkWorkPriority();
			} else {
				$scope.screenData.selectedChart = 'OVERVIEW';
				renderHkOverview();
			}
		};

		$(window).on("resize.doResize", function() {
			$scope.$apply(function() {
				$timeout(function() {
					// Clear existing chart
					d3.select('#analytics-chart').selectAll('svg').remove();
					clearAllExistingChartElements();
					// Redraw chart
					if ($scope.screenData.selectedChart === 'OVERVIEW') {
						renderHkOverview();
					} else {
						renderHkWorkPriority();
					}
				}, 100);
			});
		});

		$scope.$on("$destroy", function() {
			$(window).off("resize.doResize");
		});

		(function() {

			var options = {
				params: $rootScope.businessDate,
				successCallBack: function() {
                    renderHkOverview();
                }
			};

			$scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);

		})();
	}
]);
