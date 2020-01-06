sntRover.controller('RVManagerAnalyticsController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	'rvFrontOfficeAnalyticsSrv',
	'rvManagersAnalyticsSrv',
	'rvAnalyticsSrv',
	'rvAnalyticsHelperSrv',
	'$controller',
	function($scope, $rootScope, $state, $timeout, rvFrontOfficeAnalyticsSrv, rvManagersAnalyticsSrv, rvAnalyticsSrv, rvAnalyticsHelperSrv, $controller) {

		BaseCtrl.call(this, $scope);

		// Setting the CI / CO time
		rvAnalyticsSrv.setHotelCiCoTime($rootScope.hotelDetails);
		var initialBaseHrefValue = $('base').attr('href');
		var perfomanceData;
		var combinedPerfomanceData = {};

		// Scrollers for distribution grid view
		var timeLineScrollEndReached = false;
		var GRID_HEADER_HORIZONTAL_SCROLL = 'grid-header-horizontal-scroll',
			GRID_VIEW_DUAL_SCROLL ='grid-scroll',
			GRID_SIDE_MENU_SCROLL ='side-bar-vertical-scroll';

		$scope.screenData = {
			selectedChart: 'PERFOMANCE',
			hideChartData: true,
			analyticsDataUpdatedTime: "",
			showPreviousDayData: false
		};

		$controller('rvManagerSpiderChartCtrl', {
			$scope: $scope
		});

		$controller('rvManagerDistributionAnalyticsCtrl', {
			$scope: $scope
		});

		$controller('rvMangerPaceChart', {
			$scope: $scope
		});

		var clearAllExistingChartElements = function() {
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
		};

		var addChartHeading = function() {
			rvAnalyticsHelperSrv.addChartHeading($scope.screenData.mainHeading, $scope.screenData.analyticsDataUpdatedTime);
		};

		var renderPerfomanceChart = function() {
			$('base').attr('href', initialBaseHrefValue);
			var options = {
				params: {
					date: $scope.dashboardFilter.datePicked
				},
				successCallBack: function(data) {
					$('base').attr('href', '#');
					perfomanceData = data;
					$scope.screenData.analyticsDataUpdatedTime = moment().format("MM ddd, YYYY hh:mm:ss a");
					clearAllExistingChartElements();
					d3.select('#d3-plot').selectAll('svg').remove();
					$scope.drawPerfomceChart(data);
					addChartHeading();
				}
			};

			$scope.callAPI(rvManagersAnalyticsSrv.roomPerformanceKPR, options);
		};

		var shallowDecodedParams = "";
		var distributionChartData = "";

		var renderDistributionChart = function() {

			$('base').attr('href', initialBaseHrefValue);

			var params = {
				start_date: $scope.dashboardFilter.fromDate,
				end_date: $scope.dashboardFilter.toDate,
				chart_type: $scope.dashboardFilter.chartType,
				shallowDecodedParams: shallowDecodedParams
			};

			if ($scope.dashboardFilter.aggType) {
				params.group_by = $scope.dashboardFilter.aggType;
			}
			var options = {
				params: params,
				successCallBack: function(data) {
					$('base').attr('href', '#');
					$scope.screenData.analyticsDataUpdatedTime = moment().format("MM ddd, YYYY hh:mm:ss a");
					clearAllExistingChartElements();
					distributionChartData = data;
					if ($scope.dashboardFilter.gridViewActive) {
						toggleDistributionChartGridView();
					} else {
						$scope.drawDistributionChart(data);
						addChartHeading();
					}
				}
			};

			$scope.callAPI(rvManagersAnalyticsSrv.distributions, options);
		};

		var renderPaceChart = function() {
			var options = {
				params: {
					date: $scope.dashboardFilter.datePicked,
					shallowDecodedParams: shallowDecodedParams
				},
				successCallBack: function(data) {
					if (data && data.length === 0) {
						data = [{
							new: 0,
							cancellation: 0,
							on_the_books: 0,
							date: $scope.dashboardFilter.datePicked
						}];
					}
					clearAllExistingChartElements();
					$scope.drawPaceChart(data);
					addChartHeading();
				}
			};
			$scope.callAPI(rvManagersAnalyticsSrv.pace, options);

		};

		var scrollToTop = function() {
			var analyticsScroll = $scope.getScroller('analytics_scroller');

			if (analyticsScroll) {
				analyticsScroll.scrollTo(0, 0, 0);
			}
		};

		var drawChart = function() {
			scrollToTop();
			$scope.screenData.hideChartData = true;
			$scope.dashboardFilter.showFilters = false;
			clearAllExistingChartElements();
			$scope.screenData.mainHeading = "";

			if ($scope.screenData.selectedChart === 'PERFOMANCE') {
				$scope.dashboardFilter.showFilters = false;
				$scope.dashboardFilter.showLastYearData = false;
				renderPerfomanceChart();
			} else if ($scope.screenData.selectedChart === 'DISTRIBUTION') {
				renderDistributionChart();
			} else if ($scope.screenData.selectedChart === 'PACE') {
				renderPaceChart();
			}
		};

		var setPageHeading = function() {
			var chartTypeSelected = _.find($scope.dashboardFilter.chartTypes, function(chartType) {
				return chartType.code === $scope.dashboardFilter.chartType;
			});
			var aggTypeSelected = _.find($scope.dashboardFilter.aggTypes, function(aggType) {
				return aggType.code === $scope.dashboardFilter.aggType;
			});

			if (aggTypeSelected) {
				$scope.screenData.mainHeading = chartTypeSelected.name + " by " + aggTypeSelected.name;
			} else {
				$scope.screenData.mainHeading = chartTypeSelected.name;
			}
		};
		

		$scope.previousDaySelectionChanged = function() {
			clearAllExistingChartElements();
			drawChart();
		};

		var drawSpiderChart = function() {
			$('base').attr('href', '#');
			clearAllExistingChartElements();
			d3.select('#d3-plot').selectAll('svg').remove();
			$scope.drawPerfomceChart(combinedPerfomanceData);
			addChartHeading();
		};

		var calculateDifferenceInPerfomance = function(lastYeardata, isMixed) {
			for (var key in perfomanceData) {
				for (var key1 in lastYeardata) {
					if (((key === key1) && (key === "mtd" || !isMixed)) || ((key === key1) && (key === "ytd" || !isMixed))) {

						combinedPerfomanceData[key] = angular.copy(perfomanceData[key]);
						combinedPerfomanceData[key].adr_diff = parseFloat(perfomanceData[key].adr) -
							parseFloat(lastYeardata[key].adr);
						combinedPerfomanceData[key].rev_par_diff = parseFloat(perfomanceData[key].rev_par) -
							parseFloat(lastYeardata[key].rev_par);
						combinedPerfomanceData[key].occupancy_diff = parseFloat(perfomanceData[key].occupancy) -
							parseFloat(lastYeardata[key].occupancy);
					}
				}
			}
		};

		var handleChangesForMixedFilter = function() {
			var lastYeardate = moment($scope.dashboardFilter.datePicked)
				.subtract(1, 'years')
				.format("YYYY-MM-DD");
			var options = {
				params: {
					date: lastYeardate
				},
				successCallBack: function(lastYeardata) {
					calculateDifferenceInPerfomance(lastYeardata, true);
					drawSpiderChart();
				}
			};

			$scope.callAPI(rvManagersAnalyticsSrv.roomPerformanceKPR, options);
		};

		var handleFilterChangeForPerfomanceChart = function() {
			if (!$scope.dashboardFilter.showLastYearData) {
				$('base').attr('href', '#');
				clearAllExistingChartElements();
				$scope.drawPerfomceChart(perfomanceData);
				addChartHeading();
				return;
			}

			$('base').attr('href', initialBaseHrefValue);

			var lastYeardate;

			if ($scope.dashboardFilter.lastyearType === "SAME_DATE_LAST_YEAR") {
				lastYeardate = moment($scope.dashboardFilter.datePicked)
					.subtract(1, 'years')
					.format("YYYY-MM-DD");
			} else if ($scope.dashboardFilter.lastyearType === "SAME_DAY_LAST_YEAR" || $scope.dashboardFilter.lastyearType === "MIXED") {
				lastYeardate = rvAnalyticsHelperSrv.getClosetDayOftheYearInPastYear($scope.dashboardFilter.datePicked);
			}
			var options = {
				params: {
					date: lastYeardate
				},
				successCallBack: function(lastYeardata) {
					calculateDifferenceInPerfomance(lastYeardata, false);
					if ($scope.dashboardFilter.lastyearType === "MIXED") {
						handleChangesForMixedFilter();
					} else {
						drawSpiderChart();
					}

				}
			};

			$scope.callAPI(rvManagersAnalyticsSrv.roomPerformanceKPR, options);
		};


		var getScrollerObject = function(key) {
				var scrollerObject = $scope.$parent.myScroll && $scope.$parent.myScroll[key];

				if (_.isUndefined(scrollerObject)) {
					scrollerObject = $scope.myScroll[key];
				}
				return scrollerObject;
			};

		var setGridScrollers = function () {
			var scrollOptions = {
                    tap: true,
					preventDefault: false,
					probeType: 3,
					mouseWheel: true		
                };

            var scrollerOptionsForTimeline = _.extend({
				scrollX: true,
				scrollY: false,
				scrollbars: true
			}, angular.copy(scrollOptions));

			var scrollerOptionsForGrid = _.extend({
				scrollY: true,
				scrollX: true,
				scrollbars: true
			}, angular.copy(scrollOptions));

			$scope.setScroller(GRID_HEADER_HORIZONTAL_SCROLL, scrollerOptionsForTimeline);
			$scope.setScroller(GRID_VIEW_DUAL_SCROLL,scrollerOptionsForGrid);
			$scope.setScroller(GRID_SIDE_MENU_SCROLL, scrollOptions);
			var runDigestCycle = function() {
				if (!$scope.$$phase) {
					$scope.$digest();
				}
			};

			$timeout(function() {
				getScrollerObject (GRID_HEADER_HORIZONTAL_SCROLL)
					.on('scroll', function() {						
						var xPos = this.x;
						var block = getScrollerObject (GRID_VIEW_DUAL_SCROLL);

						block.scrollTo(xPos, block.y);

						// check if edge reached next button
						if (Math.abs(this.maxScrollX) - Math.abs(this.x) <= 150 ) {
							if (!timeLineScrollEndReached) {
									timeLineScrollEndReached = true;
									runDigestCycle();
								}
							} else {
								if (timeLineScrollEndReached) {
								 	timeLineScrollEndReached = false;
									runDigestCycle();
							}
						}
					});				
				getScrollerObject (GRID_SIDE_MENU_SCROLL)
					.on('scroll', function() {						
						var yPos = this.y;
						var block = getScrollerObject (GRID_VIEW_DUAL_SCROLL);

						block.scrollTo(block.x, yPos);
					});
				getScrollerObject (GRID_VIEW_DUAL_SCROLL)
					.on('scroll', function() {
						var xPos = this.x;
						var yPos = this.y;

						getScrollerObject (GRID_HEADER_HORIZONTAL_SCROLL).scrollTo(xPos, 0);
						getScrollerObject (GRID_SIDE_MENU_SCROLL).scrollTo(0, yPos);

						// check if edge reached and enable next button
						if (Math.abs(this.maxScrollX) - Math.abs(this.x) <= 150 ) {
							if (!timeLineScrollEndReached) {
									timeLineScrollEndReached = true;
									runDigestCycle();
								}
							} else {
								if (timeLineScrollEndReached) {
								 	timeLineScrollEndReached = false;
									runDigestCycle();
							}
						}
					});
			}, 1000);
		};


		var toggleDistributionChartGridView = function () {
			if (!$scope.dashboardFilter.gridViewActive) {
				drawChart();
				return;
			}
			if ($scope.dashboardFilter.gridViewActive && !$scope.dashboardFilter.aggType) {
				$scope.gridViewHeader = _.find($scope.dashboardFilter.chartTypes, function(chartType){
					return chartType.code === $scope.dashboardFilter.chartType;
				}).name;
			} else if ($scope.dashboardFilter.gridViewActive && $scope.dashboardFilter.aggType) {
				$scope.gridViewHeader = _.find($scope.dashboardFilter.aggTypes, function(aggType){
					return aggType.code === $scope.dashboardFilter.aggType;
				}).name;
			}
			
			$scope.gridLeftSideHeaders = [];

			if (distributionChartData.length > 0) {
				for (var key in distributionChartData[0]) {
					if (key !== "date") {
						$scope.gridLeftSideHeaders.push(key);
					}
				}
			}

			var today = $rootScope.businessDate;

			distributionChartData = _.sortBy(distributionChartData, function(data) {
				return data.date;
			});

			_.each(distributionChartData, function(data){
				// check if the day is a Sunday or Saturday
				data.isWeekend = moment(data.date, "YYYY-MM-DD").weekday() === 0 ||
				moment(data.date, "YYYY-MM-DD").weekday() === 6;
				// Display day in MMM DD format
				data.dateToDisplay = moment(data.date, "YYYY-MM-DD").format("MMM DD");
				// weekday in 3 letter format
				data.weekDay = moment(data.date, "YYYY-MM-DD").format("ddd");
				// check if day is current day
				data.isToday = moment(data.date).format('YYYY-MM-DD') === today;
			});

			$scope.distributionChartData = distributionChartData;
			$scope.dashboardFilter.showFilters = false;
			setGridScrollers();
			$timeout(function() {
				refreshGridScrollers();
			}, 1000);
		};

		$scope.$on('DISTRUBUTION_CHART_CHANGED', toggleDistributionChartGridView);

		$scope.$on('ANALYTICS_FILTER_CHANGED', function(e, data) {
			if ($scope.screenData.selectedChart === 'PERFOMANCE') {
				handleFilterChangeForPerfomanceChart();
			} else if ($scope.dashboardFilter.selectedAnalyticsMenu === 'DISTRIBUTION') {
				shallowDecodedParams = data;
				renderDistributionChart();
			} else if ($scope.dashboardFilter.selectedAnalyticsMenu === 'PACE') {
				shallowDecodedParams = data;
				renderPaceChart();
			}
		});

		$scope.$on('SET_PAGE_HEADING', setPageHeading);

		$scope.$on('CHART_TYPE_CHANGED', function(e, data) {
			setPageHeading();
			drawChart();
		});

		$scope.$on('CHART_AGGGREGATION_CHANGED', function(e, data) {
			setPageHeading();
			drawChart();
		});

		$(window).on("resize.doResize", function() {
			$scope.$apply(function() {
				$timeout(function() {
					// Redraw chart
					drawChart();
				}, 0);
			});
		});

		$scope.$on('ANALYTICS_MENU_CHANGED', function(e, selectedChart) {
			if ($scope.screenData.selectedChart === selectedChart) {
				return;
			}
			$scope.$emit('RESET_CHART_FILTERS');
			shallowDecodedParams = "";
			$scope.screenData.selectedChart = selectedChart;
			$timeout(function() {
				clearAllExistingChartElements();
				$scope.dashboardFilter.chartType = "occupancy";
				drawChart();
			}, 0);
		});

		$scope.$on("$destroy", function() {
			$(window).off("resize.doResize");
		});

		$scope.$on("SIDE_MENU_TOGGLE", function(e, data) {
			if (data.menuOpen) {
				$('base').attr('href', "/");
			}
		});

		$scope.$on('RELOAD_DATA_WITH_SELECTED_FILTER', function(e, filter) {
			rvAnalyticsSrv.selectedRoomType = filter.room_type;
			drawChart();
		});

		$scope.$on('RESET_ANALYTICS_FILTERS', function() {
			$scope.dashboardFilter.datePicked = $rootScope.businessDate;
			$scope.dashboardFilter.selectedRoomType = "";
			$scope.dashboardFilter.selectedAnalyticsMenu = "PERFOMANCE";
			$scope.screenData.selectedChart = "PERFOMANCE";

		});

		$scope.$on('REFRESH_ANALYTCIS_CHART', function() {
			drawChart();
		});

		$scope.$on('RELOAD_DATA_WITH_DATE_FILTER', function() {
			drawChart();
		});

		$scope.$on("$destroy", function() {
			$('base').attr('href', initialBaseHrefValue);
		});

		 var refreshGridScrollers = function() {
            $scope.refreshScroller(GRID_HEADER_HORIZONTAL_SCROLL);
            $scope.refreshScroller(GRID_VIEW_DUAL_SCROLL);
            $scope.refreshScroller(GRID_SIDE_MENU_SCROLL);
        };

		(function() {
			$scope.dashboardFilter.selectedAnalyticsMenu = "PERFOMANCE";
			$scope.dashboardFilter.showFilters = false;
			$scope.dashboardFilter.showLastYearData = false;
			$scope.dashboardFilter.lastyearType = 'SAME_DATE_LAST_YEAR';
			$scope.dashboardFilter.gridViewActive = false;
			drawChart();
		})();
	}
]);