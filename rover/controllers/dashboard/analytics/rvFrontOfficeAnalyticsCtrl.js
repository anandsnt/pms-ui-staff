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
			selectedChart: 'ARRIVALS_MANAGEMENT'
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
			rvFrontOfficeAnalyticsSrv.fdWorkload(date).then(function(data) {
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

				d3.select('#analytics-chart').selectAll('svg').remove();
				$scope.drawArrivalManagementChart(chartDetails);
			});
		};


		var renderFrontOfficeActivity = function() {

			rvFrontOfficeAnalyticsSrv.fdFoActivity(date).then(function(data) {
				console.log(JSON.stringify(data));
				try {
					$scope.drawFrontOfficeActivity(data);
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

		$scope.changeChart = function() {
			clearAllExistingChartElements();
			if ($scope.screenData.selectedChart === 'ARRIVALS_MANAGEMENT') {
				$scope.screenData.selectedChart = 'WORK_LOAD';
				renderfdWorkloadChart();
			} else if ($scope.screenData.selectedChart === 'WORK_LOAD') {
				$scope.screenData.selectedChart = 'FO_ACTIVITY';
				renderFrontOfficeActivity();
			} else {
				$scope.screenData.selectedChart = 'ARRIVALS_MANAGEMENT';
				renderFrontOfficeManagementChart();
			}
		};

		$(window).on("resize.doResize", function() {
			$scope.$apply(function() {
				$timeout(function() {
					// Clear existing chart
					d3.select('#analytics-chart').selectAll('svg').remove();
					clearAllExistingChartElements();
					// Redraw chart
					if ($scope.screenData.selectedChart === 'ARRIVALS_MANAGEMENT') {
						renderFrontOfficeManagementChart();
					} else if ($scope.screenData.selectedChart === 'WORK_LOAD') {
						renderfdWorkloadChart();
					} else {
						renderFrontOfficeActivity();
					}
				}, 0);
			});
		});

		$scope.$on("$destroy", function() {
			$(window).off("resize.doResize");
		});

		(function() {

			var options = {
				params: $rootScope.businessDate,
				successCallBack: function() {
					renderFrontOfficeActivity();
					//renderFrontOfficeManagementChart();
					// renderfdWorkloadChart();
				}
			};

			$scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);

		})();
	}
]);