angular.module('sntRover')
	.controller('rvManagerDistributionAnalyticsCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvManagersAnalyticsSrv', 'rvAnalyticsHelperSrv', '$rootScope',
		function($scope, sntActivity, $timeout, $filter, rvManagersAnalyticsSrv, rvAnalyticsHelperSrv, $rootScope) {
			var getPrefinedValuesForDate = function(date) {
				var today = $rootScope.businessDate;
				var definedDates = [{
					"value": "Yesterday",
					"date": moment(today)
						.subtract(1, 'day')
						.format("YYYY-MM-DD")
				}, {
					"value": "Today-2",
					"date": moment(today)
						.subtract(2, 'day')
						.format("YYYY-MM-DD")
				}, {
					"value": "Today-3",
					"date": moment(today)
						.subtract(3, 'day')
						.format("YYYY-MM-DD")
				}, {
					"value": "Today-4",
					"date": moment(today)
						.subtract(4, 'day')
						.format("YYYY-MM-DD")
				}, {
					"value": "Today-5",
					"date": moment(today)
						.subtract(5, 'day')
						.format("YYYY-MM-DD")
				}, {
					"value": "Today-6",
					"date": moment(today)
						.subtract(6, 'day')
						.format("YYYY-MM-DD")
				}];

				var isPredefinedDate = function(date) {
					return _.find(definedDates, function(definedDate) {
						return definedDate.date === date;
					});
				};

				if (date === today) {
					return "Today";
				} else if (isPredefinedDate(date)) {
					return isPredefinedDate(date).value;
				}

				return $filter('date')(date, $rootScope.dateFormat);
			};

			$scope.drawDistributionChart = function(chartData) {
				chartData = _.sortBy(chartData, function(data) {
					return data.date;
				});
				$scope.$emit('SET_PAGE_HEADING');
				try {
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
								parseDate = d3.timeParse("%Y-%m-%d"),
								width = document.getElementById("analytics-chart").clientWidth - margin.left - margin.right,
								height = 500 - margin.top - margin.bottom,
								xScale = d3.scaleBand()
								.range([0, width - ((stackKey.length > 1 || $scope.dashboardFilter.aggType) ? 350 : 0)])
								.padding(0.5),
								yScale = d3.scaleLinear()
								.range([height, 0]);

							var xAxis = d3.axisBottom(xScale)
								.tickFormat(function(d) {
									var date = moment(d).format('YYYY-MM-DD');

									return getPrefinedValuesForDate(date);
								})
								.tickSizeOuter(0)
								.tickPadding(15),
								yAxis = d3.axisLeft(yScale)
								.tickSizeOuter(0)
								.tickPadding(5),
								svg = d3.select("#" + domEle)
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

							d3.selectAll(".rect-bars")
								.transition()
								.duration(800)
								.attr("height", function(d) {
									return yScale(d[0]) > yScale(d[1]) ?
										yScale(d[0]) - yScale(d[1]) :
										yScale(d[1]) - yScale(d[0]);
								});

							svg.append("g")
								.attr("class", "axis axis--x")
								.attr("transform", "translate(0," + height + ")")
								.call(xAxis)
								.selectAll("text")
								.style("text-anchor", "end")
								.attr("dx", "-.8em")
								.attr("dy", data.length > 20 ? "-.7em" : "-.15em")
								.attr("transform", "rotate(-65)");

							svg.append("g")
								.attr("class", "axis axis--y")
								.attr("transform", "translate(0,0)")
								.call(yAxis);

							rvAnalyticsHelperSrv.drawRectLines({
								svg: svg,
								xOffset: 0,
								height: 4,
								width: width - ((stackKey.length > 1 || $scope.dashboardFilter.aggType) ? 350 : 0),
								yOffset: height
							});
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
								.attr("font-weight", "bold");

							// var legendSvg = d3.select("#right-side-legend").append("svg")
							if (stackKey.length > 1 || $scope.dashboardFilter.aggType) {
								var legend = svg.selectAll(".legend")
									.data(colors)
									.enter().append("g")
									.attr("class", "legend")
									.attr("transform", function(d, i) {
										return "translate(-300," + i * 30 + ")";
									});

								legend.append("rect")
									.attr("x", width - 18)
									.attr("width", 18)
									.attr("height", 18)
									.style("fill", function(d, i) {
										return colors[i];
									});

								legend.append("text")
									.attr("x", width + 5)
									.attr("y", 9)
									.attr("dy", ".35em")
									.style("text-anchor", "start")
									.style("font-size", "15px")
									.text(function(d, i) {
										return rvAnalyticsHelperSrv.textTruncate(stackKey[i], 35, '...');
									});
							}


						}
					}

					var chartDataKeys = [];

					_.each(chartData, function(data) {
						chartDataKeys = _.union(chartDataKeys, Object.keys(data));
					});

					chartDataKeys = _.reject(chartDataKeys, function(chartDataKey) {
						return chartDataKey === "date";
					});


					var colors = ["#ff0029", "#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f", "#c4eaff", "#cf8c00", "#1b9e77", "#d95f02", "#e7298a", "#e6ab02", "#a6761d", "#0097ff", "#00d067", "#000000", "#252525", "#525252", "#737373", "#969696", "#bdbdbd", "#f43600", "#4ba93b", "#5779bb", "#927acc", "#97ee3f", "#bf3947", "#9f5b00", "#f48758", "#8caed6", "#f2b94f", "#eff26e", "#e43872", "#d9b100", "#9d7a00", "#698cff", "#d9d9d9"];

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
				} catch (E) {
					console.log(E)
				}
			};
		}
	]);