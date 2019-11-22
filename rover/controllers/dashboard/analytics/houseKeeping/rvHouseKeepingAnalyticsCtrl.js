sntRover.controller('RVHouseKeepingAnalyticsController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvAnalyticsSrv',
	'$controller',
	'ngDialog',
	function($scope, $rootScope, $state, $timeout, rvAnalyticsSrv, $controller, ngDialog) {

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

		var showChartDetails = function() {
			// ngDialog.open({
			// 	template: '/assets/partials/dashboard/analyticsPopups/analyticsDetailsView.html',
			// 	className: '',
			// 	scope: $scope,
			// 	closeByDocument: false,
			// 	closeByEscape: false
			// });
		};

		var getChartDetails = function(type) {
			var clickedElementData = {
				type: type,
				date: $scope.dashboardFilter.datePicked,
			};

			var roomsTypeArray = ["rooms_clean",
								 "rooms_inspected",
								 "rooms_dirty",
								 "rooms_pickup",
								 "vacant_clean",
								 "vacant_inspected",
								 "vacant_dirty",
								 "vacant_pickup"];

			if (_.indexOf(roomsTypeArray, type) !== -1) {
				$scope.detailsType = 'ROOM';
				$scope.detailedList = rvAnalyticsSrv.getRooms(clickedElementData);
			} else {
				$scope.detailsType = 'RESERVATION';
				$scope.detailedList = rvAnalyticsSrv.getReservations(clickedElementData);
			}
			showChartDetails();

			console.log("\n\n type - " + type + "\n\n")
			console.log("\n\n get ROOMS \n\n")
			console.log(rvAnalyticsSrv.getRooms(clickedElementData));
			console.log("\n\n get RESERVATIONS \n\n")
			console.log(rvAnalyticsSrv.getReservations(clickedElementData));
		};

		$scope.closeDialog = function (){
			ngDialog.close()
		};

		var onBarChartClick = function(type) {
			getChartDetails(type);
		};

		var onLegendClick = function(type) {
			getChartDetails(type);
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
			$('base').attr('href', '#');
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
					$scope.screenData.analyticsDataUpdatedTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
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
		$scope.$on("SIDE_MENU_TOGGLE", function(e, data) {
			if (data.menuOpen) {
				$('base').attr('href', "/");
			}
		});

		(function() {
			fetchData($scope.dashboardFilter.datePicked, $scope.dashboardFilter.selectedRoomTypeId);
		})();
	}
]);