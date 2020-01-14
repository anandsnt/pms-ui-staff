sntRover.controller('rvAnalyticsMainController', ['$scope',
	'$rootScope',
	'$state',
	'$controller',
	'$timeout',
	function($scope, $rootScope, $state,$controller, $timeout) {

		BaseCtrl.call(this, $scope);

		// Available charts in sorted order
		$scope.availableCharts = ['managerPerfomance',
			'managerDistribution',
			'managerPace',
			'hkOverview'
		];

		// if (includeHKCharts) {
		// 	$controller('RVHouseKeepingAnalyticsController', {
		// 		$scope: $scope
		// 	});
		// }
		// if (includeFOCharts) {
		// 	$controller('rvFrontOfficeAnalyticsCtrlController', {
		// 		$scope: $scope
		// 	});
		// }
		// if (incluseManagerCharts) {
		// 	$controller('RVManagerAnalyticsController', {
		// 		$scope: $scope
		// 	});
		// }
		$controller('rvManagerSpiderChartCtrl', {
			$scope: $scope
		});
		$controller('rvManagerDistributionAnalyticsCtrl', {
			$scope: $scope
		});
		$controller('rvMangerPaceChart', {
			$scope: $scope
		});

		$controller('rvHKOverviewAnalticsCtrl', {
			$scope: $scope
		});
		$controller('rvHkWokrPriorityCtrl', {
			$scope: $scope
		});

		$controller('rvFrontOfficeManagementAnalyticsCtrl', {
			$scope: $scope
		});
		$controller('rvFrontOfficeActivityCtrl', {
			$scope: $scope
		});
		$controller('rvFrontOfficeWorkloadCtrl', {
			$scope: $scope
		});

		$scope.availableChartsList = [{
				name: 'Overview',
				department: 'HOUSEKEEPING',
				fetchDataEvent: 'GET_HK_OVERVIEW',
				tileDescription: 'HK_OVERVIEW_DESC'
			}, {
				name: 'Priority',
				department: 'HOUSEKEEPING',
				fetchDataEvent: 'GET_HK_WORK_PRIORITY',
				tileDescription: 'HK_WORKLOAD_DESC'
			},

			{
				name: 'Arrivals',
				department: 'FRONT OFFICE',
				fetchDataEvent: 'GET_FO_ARRIVAL_MANAGEMENT',
				tileDescription: 'FO_ARRIVAL_MANAGEMENT_DESC'
			}, {
				name: 'Activity',
				department: 'FRONT OFFICE',
				fetchDataEvent: 'GET_FO_ACTIVITY',
				tileDescription: 'FO_ACTIVITY_DESC'
			}, {
				name: 'Workload',
				department: 'FRONT OFFICE',
				fetchDataEvent: 'GET_FO_WORKLOAD',
				tileDescription: 'FO_WORKLOAD_DESC'
			},

			{
				name: 'Room Perfomance',
				department: 'GENERAL',
				fetchDataEvent: 'GET_MANAGER_PERFOMANCE',
				tileDescription: 'MANAGER_PERFOMANCE_DESC'
			}, {
				name: 'Distribution',
				department: 'GENERAL',
				fetchDataEvent: 'GET_MANAGER_DISTRIBUTION',
				tileDescription: 'MANAGER_DISTRIBUTION_DESC'
			}, {
				name: 'Pace',
				department: 'GENERAL',
				fetchDataEvent: 'GET_MANAGER_PACE',
				tileDescription: 'MANAGER_PACE_DESC'
			}
		];

		$scope.$on("CLEAR_ALL_CHART_ELEMENTS", function() {
			d3.select('#d3-plot').selectAll('svg').remove();
			d3.select('#d3-plot').selectAll('p').remove();
			var divElements = d3.select('#d3-plot').selectAll('div');

			if (divElements) {
				divElements.remove();
			}
			if (document.getElementById("left-side-legend")) {
				document.getElementById("left-side-legend").innerHTML = "";
			}
			if (document.getElementById("right-side-legend")) {
				document.getElementById("right-side-legend").innerHTML = "";
			}
		});

		$scope.$on('CHART_API_SUCCESS', function (ev, response) {
			$('base').attr('href', '#');
            $scope.screenData.analyticsDataUpdatedTime = response && response.lastUpatedTime ?
                                                         response.lastUpatedTime : moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
            $scope.$emit("CLEAR_ALL_CHART_ELEMENTS");
		});

		$scope.onClickOnChartTile = function(fetchDataEvent) {
			$scope.$broadcast(fetchDataEvent);
		};

		$scope.showRightSideLegends = function () {
			return $scope.dashboardFilter.selectedAnalyticsMenu !== 'PERFOMANCE';
		};

		$scope.showLeftSideLegends = function () {
			return $scope.dashboardFilter.selectedAnalyticsMenu === 'HK_OVERVIEW' ||
				   $scope.dashboardFilter.selectedAnalyticsMenu === 'HK_WORK_PRIRORITY' ||
				   $scope.dashboardFilter.selectedAnalyticsMenu === 'FO_ARRIVALS';
		};

		$(window).on("resize.doResize", function() {
			$scope.$apply(function() {
				$timeout(function() {
					// Clear existing chart
					$scope.$emit("CLEAR_ALL_CHART_ELEMENTS");
					$scope.$broadcast('ON_WINDOW_RESIZE');
				}, 0);
			});
		});

		$scope.$on("$destroy", function() {
			$(window).off("resize.doResize");
			$('base').attr('href', "/");
		});

		(function() {
			$scope.screenData = {
				displayMode: 'GRID'
			};
		})();
	}
]);