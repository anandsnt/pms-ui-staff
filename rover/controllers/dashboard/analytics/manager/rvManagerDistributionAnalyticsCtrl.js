angular.module('sntRover')
	.controller('rvManagerDistributionAnalyticsCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvManagersAnalyticsSrv', 'rvAnalyticsHelperSrv', '$rootScope',
		function($scope, sntActivity, $timeout, $filter, rvManagersAnalyticsSrv, rvAnalyticsHelperSrv, $rootScope) {

			var shallowDecodedParams = "";
			var distributionChartData;
			var initialBaseHrefValue = $('base').attr('href');
			var isDistributionChartActive = function() {
				return $scope.dashboardFilter.selectedAnalyticsMenu === 'DISTRIBUTION';
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

			var checkIfDayIsToday = function(dateToCompare) {
				var today = $rootScope.businessDate;
				var date = moment(dateToCompare).format('YYYY-MM-DD');

				return today === date;
			};

			/******************************** DRAW CHART STARTS HERE ********************************************/

			var drawDistributionChart = function(chartData) {
				$scope.dashboardFilter.selectedAnalyticsMenu = 'DISTRIBUTION';
				console.log(JSON.stringify(chartData));

				chartData = _.sortBy(chartData, function(data) {
					return data.date;
				});
				$scope.$emit('SET_PAGE_HEADING');

				var initStackedBarChart = {
					draw: function(config) {
						var domEle = config.element,
							stackKey = config.key,
							data = config.data,
							colors = config.colors,
							margin = {
								top: 20,
								right: 20,
								bottom: 100,
								left: 50
							},
							parseDate = d3.timeParse("%Y-%m-%d");

						var width = document.getElementById("manager-analytics-chart").clientWidth - margin.left - margin.right,
							height = 500 - margin.top - margin.bottom;

						var xScale = d3.scaleBand()
							.range([0, width - ((stackKey.length > 1 || $scope.dashboardFilter.aggType) ? 350 : 0)])
							.padding(0.5);

						var yScale = d3.scaleLinear()
							.range([height, 0]);

						var xAxis = d3.axisBottom(xScale)
							.tickFormat(function(date) {
								if (checkIfDayIsToday(date)) {
									return "Today";
								}
								return moment(date).format('DD MMM');
							})
							.tickSizeOuter(0)
							.tickPadding(15);

						var yAxis = d3.axisLeft(yScale)
							.tickSizeOuter(0)
							.tickPadding(5);

						var svg = d3.select("#" + domEle)
							.append("svg")
							.attr("width", width + margin.left + margin.right)
							.attr("height", height + margin.top + margin.bottom)
							.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

						// remove -ve values coming for some reason
						_.each(data, function(item) {
							for (var key in item) {
								// check if the property/key is defined in the object itself, not in parent
								if (item.hasOwnProperty(key) && key !== "date") {
									item[key] = item[key] > 0 ? item[key] : 0;
								}
							}
						});

						var stack = d3.stack()
							.keys(stackKey)
							.order(d3.stackOrderNone)
							.offset(d3.stackOffsetNone);

						var layers = stack(data);

						xScale.domain(data.map(function(d) {
							return parseDate(d.date);
						}));

						var ydomainMax = d3.max(layers.flat()
							.map(function(d) {
								return d[1];
							}));

						yScale.domain([0, ydomainMax]).nice();

						var layer = svg.selectAll(".layer")
							.data(layers)
							.enter()
							.append("g")
							.attr("class", "layer")
							.style("fill", function(d, i) {
								return colors[i];
							});

						layer.selectAll("rect")
							.data(function(d) {
								return d;
							})
							.enter().append("rect")
							.attr("class", "rect-bars")
							.attr("x", function(d) {
								return xScale(parseDate(d.data.date));
							})
							.attr("y", function(d) {
								return yScale(d[1]);
							})
							.attr("width", xScale.bandwidth())
							.style("cursor", "pointer")
							.on("mouseover", function() {
								tooltip.style("display", null);
							})
							.on("mouseout", function() {
								tooltip.style("display", "none");
							})
							.on("mousemove", function(d) {
								var tooltipText = $filter('number')(d[1] - d[0], 2);
								var xPosition = d3.mouse(this)[0] - 15;
								var yPosition = d3.mouse(this)[1] - 25;

								tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
								tooltip.select("text").text(tooltipText);
							});

						// Add transition before setting height for animation
						d3.selectAll(".rect-bars")
							.transition()
							.duration(800)
							.attr("height", function(d) {
								return yScale(d[0]) > yScale(d[1]) ?
									yScale(d[0]) - yScale(d[1]) :
									yScale(d[1]) - yScale(d[0]);
							});

						// X axis
						svg.append("g")
							.attr("class", "axis axis--x")
							.attr("transform", "translate(0," + height + ")")
							.call(xAxis)
							.selectAll("text")
							.style("text-anchor", "end")
							.attr("dx", "-.8em")
							.attr("dy", data.length > 20 ? "-.7em" : "-.15em")
							.attr("transform", "rotate(-65)")
							.attr("fill", function(date) {
								return checkIfDayIsToday(date) ? "#FFAB18" : "#000";
							})
							.attr("font-weight", function(date) {
								return checkIfDayIsToday(date) ? "bold" : "normal";
							});

						// Y axis
						svg.append("g")
							.attr("class", "axis axis--y")
							.attr("transform", "translate(0,0)")
							.call(yAxis);

						// draw rect on top of X axis
						rvAnalyticsHelperSrv.drawRectLines({
							svg: svg,
							xOffset: 0,
							height: 4,
							width: width - ((stackKey.length > 1 || $scope.dashboardFilter.aggType) ? 350 : 0),
							yOffset: height
						});
						// draw rect on top of Y axis
						rvAnalyticsHelperSrv.drawRectLines({
							svg: svg,
							xOffset: 0,
							height: height,
							width: 4,
							yOffset: 0
						});

						// Prep the tooltip bits, initial display is hidden
						var tooltip = svg.append("g")
							.attr("class", "tooltip")
							.style("display", "none");

						tooltip.append("rect")
							.attr("width", 30)
							.attr("height", 20)
							.attr("fill", "white")
							.style("opacity", 0.5);

						tooltip.append("text")
							.attr("x", 15)
							.attr("dy", "1.2em")
							.style("text-anchor", "middle")
							.attr("font-size", "12px")
							.attr("font-weight", "bold")
							.style("fill", "#000");

						if (stackKey.length > 1 || $scope.dashboardFilter.aggType) {
							var legendParentElement = d3.select("#right-side-legend");
							var legend = legendParentElement.selectAll(".legend-item")
								.data(colors)
								.enter().append("g")
								.attr("class", "legend-item")
							// .attr("transform", function(d, i) {
							// 	return "translate(-300," + i * 30 + ")";
							// });

							legend.append("span")
								.attr("class", "bar")
								.style("background-color", function(d, i) {
									return colors[i];
								});
							legend.append("span")
								.attr("class", "bar-label")
								.text(function(d, i) {
									return rvAnalyticsHelperSrv.textTruncate(stackKey[i], 35, '...');
								});
						}
					}
				}

				// The keys for the chart are dynamic and need to found out on fly and used for chart and in legends
				var chartDataKeys = [];

				_.each(chartData, function(data) {
					chartDataKeys = _.union(chartDataKeys, Object.keys(data));
				});

				chartDataKeys = _.reject(chartDataKeys, function(chartDataKey) {
					return chartDataKey === "date";
				});
				chartDataKeys = _.sortBy(chartDataKeys, function(key) {
					return key.toLowerCase();
				});

				// Predefined colors to avoid similiar colors coming close to each other
				// var colors = ["#ff7f00", "#ff0029", "#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f", "#c4eaff", "#cf8c00", "#1b9e77", "#d95f02", "#e7298a", "#e6ab02", "#a6761d", "#0097ff", "#00d067", "#000000", "#252525", "#525252", "#737373", "#969696", "#bdbdbd", "#f43600", "#4ba93b", "#5779bb", "#927acc", "#97ee3f", "#bf3947", "#9f5b00", "#f48758", "#8caed6", "#f2b94f", "#eff26e", "#e43872", "#d9b100", "#9d7a00", "#698cff", "#d9d9d9"];

				// TODO: confirm with Stjepan
				var colors = ['#F76707', '#FCC419', '#74B816', '#2B8A3E', '#12B886', '#1098AD',
					'#1864AB', '#4263EB', '#5F3DC4', '#9C36B5', '#E64980', '#E03131',

					'#F87A26', '#FCCB36', '#85C133', '#469956', '#30C195', '#2EA5B7',
					'#3577B5', '#5A77ED', '#7355CB', '#A84FBE', '#E96090', '#E44B4B',

					'#F98D45', '#FDD353', '#97CA50', '#60A76E', '#4DCAA4', '#4CB2C2',
					'#528BC0', '#718AF0', '#876ED3', '#B568C8', '#EC77A0', '#E86565',

					'#FAA064', '#FDDA6F', '#A8D36D', '#7AB686', '#6BD3B3', '#6ABFCC',
					'#6F9ECA', '#899EF2', '#9B86DA', '#C181D1', '#EF8DB0', '#EC7E7E',

					'#FBB383', '#FEE28C', '#BADB8B', '#95C59F', '#89DBC3', '#88CCD6',
					'#8BB2D5', '#A1B1F5', '#AF9EE2', '#CE9BDA', '#F2A4CO', '#EF9898'
				];

				// Till 50, use above color. After that use random colors
				if (colors.length > chartDataKeys.length) {
					colors = colors.slice(0, chartDataKeys.length);
				} else {
					for (var i = colors.length; i <= chartDataKeys.length - 1; i++) {
						colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
					}
				}

				initStackedBarChart.draw({
					data: chartData,
					key: chartDataKeys,
					colors: colors,
					element: 'd3-plot'
				});

				$scope.screenData.hideChartData = false;
				$scope.dashboardFilter.showFilters = false;
			};

			/******************************** DRAW CHART ENDS HERE ********************************************/


			var fetchDistributionChartData = function() {
				$scope.dashboardFilter.displayMode = 'CHART_DETAILS';
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
						$scope.$emit("CLEAR_ALL_CHART_ELEMENTS");
						distributionChartData = data;
						// if ($scope.dashboardFilter.gridViewActive) {
						// 	toggleDistributionChartGridView();
						// } else {
						drawDistributionChart(data);
						setPageHeading();
						rvAnalyticsHelperSrv.addChartHeading($scope.screenData.mainHeading, $scope.screenData.analyticsDataUpdatedTime);
					}
				};

				$scope.callAPI(rvManagersAnalyticsSrv.distributions, options);
			};

			$scope.$on('GET_MANAGER_DISTRIBUTION', fetchDistributionChartData);

			var redrawDistributionChartIfNeeded = function() {
				if (!isDistributionChartActive()) {
					return;
				}
				fetchDistributionChartData();
			};

			$scope.$on('ANALYTICS_FILTER_CHANGED', function(e, data) {
				shallowDecodedParams = data;
				redrawDistributionChartIfNeeded();
			});

			$scope.$on('CHART_AGGGREGATION_CHANGED', function(e, data) {
				setPageHeading();
				redrawDistributionChartIfNeeded();
			});

			$scope.$on('RELOAD_DATA_WITH_DATE_FILTER_DISTRIBUTION', fetchDistributionChartData);
			
            $scope.$on('REFRESH_ANALYTCIS_CHART_DISTRIBUTION', function() {
				$scope.$emit('RESET_CHART_FILTERS');
				fetchDistributionChartData()
			});
            
			$scope.$on('ON_WINDOW_RESIZE', function() {
				if (!isDistributionChartActive()){
					return;
				}
				else if (distributionChartData) {
					drawDistributionChart(distributionChartData);
				} else {
					redrawDistributionChartIfNeeded();
				}
			});
		}
	]);