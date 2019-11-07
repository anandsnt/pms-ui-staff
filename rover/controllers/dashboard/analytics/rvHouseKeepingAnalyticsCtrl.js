sntRover.controller('RVHouseKeepingAnalyticsController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvAnalyticsSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvAnalyticsSrv, $controller) {

		BaseCtrl.call(this, $scope);

		var initialBaseHrefValue = $('base').attr('href');

		// Setting the CI / CO time
		rvAnalyticsSrv.setHotelCiCoTime($rootScope.hotelDetails);

		$scope.screenData = {
			selectedChart: 'HK_OVERVIEW',
			hideChartData: true,
			analyticsDataUpdatedTime: ""
		};

		$controller('rvHKOverviewAnalticsCtrl', {
			$scope: $scope
		});
		$controller('rvHkWokrPriorityCtrl', {
			$scope: $scope
		});

		var onBarChartClick = function(e) {
			console.log(e);
		};

		var onLegendClick = function(e, item) {
			console.log(item.item_name);
			//console.log(e.target.id);
			//console.log(JSON.stringify(e));
		};

		var date = $rootScope.businessDate;

		var renderHkOverview = function() {
			$scope.screenData.mainHeading = "";
			// Calling HK Overview Build Graph
			rvAnalyticsSrv.hkOverview($scope.dashboardFilter.datePicked, false).then(function(data) {
				var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick,
					onLegendClick: onLegendClick
				};

				d3.select('#d3-plot').selectAll('svg').remove();
				$scope.drawHkOverviewChart(chartDetails);
			});
		};

		var renderHkWorkPriority = function() {
			$scope.screenData.mainHeading = "";
			// Calling HK Overview Build Graph
			rvAnalyticsSrv.hkWorkPriority($scope.dashboardFilter.datePicked).then(function(data) {

				var chartDetails = {
					chartData: data,
					onBarChartClick: onBarChartClick,
					onLegendClick: onLegendClick
				};

				d3.select('#d3-plot').selectAll('svg').remove();
				$scope.drawHkWorkPriorityChart(chartDetails);
			});
		};

		var clearAllExistingChartElements = function() {
			document.getElementById("left-side-legend").innerHTML = "";
			document.getElementById("right-side-legend").innerHTML = "";
			document.getElementById("d3-plot").innerHTML = "";
		};

		var drawChart = function() {
			$scope.screenData.hideChartData = true;
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
					d3.select('#d3-plot').selectAll('svg').remove();
					clearAllExistingChartElements();
					// Redraw chart
					drawChart();
				}, 0);
			});
		});

		$scope.$on("$destroy", function() {
			$(window).off("resize.doResize");
		});

		$scope.$on('ANALYTICS_MENU_CHANGED', function(e, selectedChart) {
			$scope.screenData.selectedChart = selectedChart;
			d3.select('#d3-plot').selectAll('svg').remove();
			clearAllExistingChartElements();
			drawChart();
		});

		var fetchData = function(date, roomTypeId) {
			$('base').attr('href', initialBaseHrefValue);
			var params = {
				"date": date,
				"room_type_id": roomTypeId
			};
			var options = {
				params: params,
				successCallBack: function() {
					$('base').attr('href', '#');
					$scope.screenData.analyticsDataUpdatedTime = moment().format("MM ddd, YYYY hh:mm:ss a");
					d3.select('#d3-plot').selectAll('svg').remove();
					clearAllExistingChartElements();
					drawChart();
				}
			};

			$scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);
		};

		$scope.refreshChart = function() {
			fetchData($scope.dashboardFilter.datePicked, $scope.dashboardFilter.selectedRoomTypeId)
		};

		$scope.$on('RELOAD_DATA_WITH_SELECTED_FILTER', function(e, filter) {
			rvAnalyticsSrv.selectedRoomType = filter.room_type;
			clearAllExistingChartElements();
			drawChart();
		});

		$scope.$on('RESET_ANALYTICS_FILTERS', function() {
			$scope.dashboardFilter.datePicked = $rootScope.businessDate;
			$scope.dashboardFilter.selectedRoomTypeId = "";
			$scope.dashboardFilter.selectedAnalyticsMenu = "HK_OVERVIEW";
			$scope.screenData.selectedChart = "HK_OVERVIEW";
		});

		$scope.$on("$destroy", function() {
			$('base').attr('href', initialBaseHrefValue);
		});

		(function() {
			fetchData($scope.dashboardFilter.datePicked, $scope.dashboardFilter.selectedRoomTypeId);
		})();
	}
]);