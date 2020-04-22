angular.module('sntRover')
	.controller('rvManagerPaceLineChartCtrl', ['$scope', 'rvAnalyticsHelperSrv', 'rvManagersAnalyticsSrv', '$rootScope',
		function ($scope, rvAnalyticsHelperSrv, rvManagersAnalyticsSrv, $rootScope) {

			var dataForDateInfo = [],
				numberOfDateInfoFetched = 0,
				datesToCompare = [];

			var fetchPaceChartData = function (selectedData, shallowDecodedParams) {
				var options = {
					params: {
						date: selectedData,
						shallowDecodedParams: shallowDecodedParams
					},
					successCallBack: function (data) {
						if (data && data.length === 0) {
							data = [{
								new: 0,
								cancellation: 0,
								on_the_books: 0,
								date: selectedData
							}];
						}
						$scope.screenData.analyticsDataUpdatedTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

						dataForDateInfo.push({
							date: selectedData,
							chartData: data
						});
						numberOfDateInfoFetched++;
						// if numberOfDateInfoFetched reached the dates to compare array length +  1 which the selected date ($scope.dashboardFilter.datePicked)
						if ((datesToCompare.length + 1) === numberOfDateInfoFetched) {
							drawPaceLineChart();
						}
					}
				};
				$scope.callAPI(rvManagersAnalyticsSrv.pace, options);
			};

			$scope.startDrawingPaceLineChart = function (chartData, shallowDecodedParams) {
				// chartData will have one set of data with date $scope.dashboardFilter.datePicked
				numberOfDateInfoFetched = 0;
				dataForDateInfo = [];
				dataForDateInfo.push({
					date: $scope.dashboardFilter.datePicked,
					chartData: chartData
				});
				numberOfDateInfoFetched++;
				// If more dates are selected to compare, fetch data corresponding to all those dates
				// and upon fetching all data, draw the chart
				datesToCompare = $scope.dashboardFilter.datesToCompare;

				if (datesToCompare.length > 0) {
					if (datesToCompare.includes($scope.dashboardFilter.datePicked)) {
						datesToCompare = _.reject(datesToCompare, function (date) {
							return date === $scope.dashboardFilter.datePicked;
						})
					}
					console.log(datesToCompare);
					_.each(datesToCompare, function (dateToCompare) {
						fetchPaceChartData(dateToCompare, shallowDecodedParams);
					});
				} else {
					drawPaceLineChart();
				}
			};

			var checkIfDayIsToday = function (dateToCompare) {
				var today = $rootScope.businessDate;
				var date = moment(dateToCompare).format('YYYY-MM-DD');

				return today === date;
			};

			var drawPaceLineChart = function () {
				// draw line chart using the array dataForDateInfo
				console.log("[dataForDateInfo].........");
				console.log(dataForDateInfo);
				// TODO:  delete the test code in below line
				dataForDateInfo = rvAnalyticsHelperSrv.samplePaceCompareDates;
				console.log(dataForDateInfo);
				$scope.$emit("CLEAR_ALL_CHART_ELEMENTS");
				// iterate through array dataForDateInfo to draw line charts
				// Also draw avg line chart which comprises of all the selected data (only if dataForDateInfo.length > 0)
				// Show selected dates as legends on rights ride (only if dataForDateInfo.length > 0)

				var initPaceLineChart = {
					draw: function (configData) {
						var domElement = configData.element,
							stackKey = configData.key,
							data = configData.data,
							colors = configData.colors,
							margin = {
								top: 20,
								right: 20,
								bottom: 100,
								left: 50
							},
							parseDate = d3.timeParse("%Y-%m-%d"),
							xAxisDates = [],
							yAxisValues = [],
							chartDatum = [],
							colorMap = {};

						stackKey.push("Mean");
						_.each(stackKey, function (date, index) {
							colorMap[date] = colors[index];
						});

						_.each(dataForDateInfo, function (dataObject) {
							_.each(dataObject.chartData, function (chartData) {
							chartDatum.push(chartData);
								xAxisDates.push(chartData.date);
								yAxisValues.push(chartData.new + chartData.on_the_books);
							});
						});

						// remove duplicate dates and values
						xAxisDates = [...new Set(xAxisDates)];
						yAxisValues = [...new Set(yAxisValues)];

						// calculate the mean chart data
						var meanChartData = {
							date: "Mean",
							chartData: []
						};

						_.each(xAxisDates, function (xDate) {
							var meanChartValue = {
								date: xDate,
								new: 0,
								cancellation: 0,
								on_the_books: 0
							};

							_.each(chartDatum, function (chartData) {
								if (xDate === chartData.date) {
									meanChartValue.new += chartData.new;
									meanChartValue.cancellation += chartData.cancellation;
									meanChartValue.on_the_books += chartData.on_the_books;
								}
							});
							meanChartValue.new /= (stackKey.length - 1);
							meanChartValue.cancellation /= (stackKey.length - 1);
							meanChartValue.on_the_books /= (stackKey.length - 1);
							meanChartData.chartData.push(meanChartValue);
						});
						dataForDateInfo.push(meanChartData);

						_.each(meanChartData.chartData, function(chartData) {
							yAxisValues.push(chartData.new + chartData.on_the_books);
						});

						xAxisDates = [...new Set(xAxisDates)];
						yAxisValues = [...new Set(yAxisValues)];

						xAxisDates = _.sortBy(xAxisDates, function (date) {
							return date;
						});
						yAxisValues = _.sortBy(yAxisValues, function (value) {
							return value;
						});

						// max and min values for domain
						var maxValue = _.max(yAxisValues),
							minValue = _.min(yAxisValues),
							yValueRange = d3.range(minValue, maxValue);

						// for adding extra spacing
						maxValue += yValueRange[1] - yValueRange[0];

						var width = document.getElementById("dashboard-analytics-chart").clientWidth - margin.left - margin.right,
							height = 500 - margin.top - margin.bottom;

						var xScale = d3.scaleBand()
							.range([0, width - ((stackKey.length > 1 || $scope.dashboardFilter.aggType) ? 350 : 0)])
							.padding(0.5);

						xScale.domain(xAxisDates.map(function (date) {
							return parseDate(date);
						}));

						var yScale = d3.scaleLinear()
							.range([height, 0])
							.domain([minValue, maxValue]);

						// define X axis
						var xAxis = d3.axisBottom(xScale)
							.tickFormat(function (date) {
								if (checkIfDayIsToday(date)) {
									return "Today";
								}
								return moment(date).format('DD MMM');
							})
							.tickSizeOuter(0)
							.tickPadding(15);

						// define Y axis
						var yAxis = d3.axisLeft(yScale)
							.tickSizeOuter(0)
							.tickPadding(5);

						// svg element
						var svg = d3.select("#" + domElement)
							.append("svg")
							.attr("width", width + margin.left + margin.right)
							.attr("height", height + margin.top + margin.bottom)
							.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

						// X axis
						svg.append("g")
							.attr("class", "axis axis--x")
							.attr("transform", "translate(0," + height + ")")
							.call(xAxis)
							.selectAll("text")
							.style("text-anchor", "end")
							.attr("dx", "-.8em")
							.attr("dy", xAxisDates.length > 20 ? "-.7em" : "-.15em")
							.attr("transform", "rotate(-65)")
							.attr("fill", function (date) {
								return checkIfDayIsToday(date) ? "#FFAB18" : "#000";
							})
							.attr("font-weight", function (date) {
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

						// draw horizontal marker lines
						_.each(yValueRange, function (range, index) {
							rvAnalyticsHelperSrv.drawRectLines({
								svg: svg,
								xOffset: 0,
								height: 1,
								width: width - ((stackKey.length > 1 || $scope.dashboardFilter.aggType) ? 350 : 0),
								yOffset: height * (1 - (index + 1) / (yValueRange.length + 1))
							});
						});

						// draw line graphs with tooltip
						dataForDateInfo.forEach(dataObject => {
							svg.append("path")
								.datum(dataObject.chartData)
								.attr("fill", "none")
								.attr("stroke", function (d) { return colorMap[dataObject.date]; })
								.attr("stroke-width", 3)
								.attr("d", d3.line()
									.curve(d3.curveCardinal)
									.x(function (d) { return xScale(parseDate(d.date)); })
									.y(function (d) { return yScale(d.new + d.on_the_books); })
								)
								.style("cursor", "pointer")
								.on("mouseover", function () {
									tooltip.style("display", null);
								})
								.on("mouseout", function () {
									tooltip.style("display", "none");
								})
								.on("mousemove", function (d) {
									var formatDecimal = d3.format(".0f"),
										xPosition = d3.mouse(this)[0] - 15,
										yPosition = d3.mouse(this)[1] - 25,
										xRange = yScale.invert(d3.mouse(this)[1]);

									tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
									tooltip.select("text").text(formatDecimal(xRange) + " , " + dataObject.date);
								});
						});

						// tooltip
						var tooltip = svg.append("g")
							.attr("class", "tooltip")
							.style("display", "none");

						tooltip.append("rect")
							.attr("width", 100)
							.attr("height", 20)
							.attr("fill", "white")
							.style("opacity", 0.5);

						tooltip.append("text")
							.attr("x", 15)
							.attr("dx", "2.8em")
							.attr("dy", "1.2em")
							.style("text-anchor", "middle")
							.attr("font-size", "12px")
							.attr("font-weight", "bold")
							.style("fill", "#000");

						// add right side legend
						var legendParentElement = d3.select("#right-side-legend");

						var legend = legendParentElement.selectAll(".legend")
							.data(colors)
							.enter().append("g")
							.attr("class", "legend-item")
							.attr("transform", function (d, i) {
								return "translate(-100," + i * 30 + ")";
							});

						legend.append("span")
							.attr("class", "bar")
							.style("background-color", function (d, i) {
								return colors[i];
							});
						legend.append("span")
							.attr("class", "bar-label")
							.text(function (d, i) {
								return rvAnalyticsHelperSrv.textTruncate(stackKey[i], 35, '...');
							});

					}
				}

				// The keys for the chart are dynamic and need to found out on fly and used for chart and in legends
				var chartDataKeys = [];

				_.each(dataForDateInfo, function (data) {
					chartDataKeys.push(data.date);
				});

				chartDataKeys = _.sortBy(chartDataKeys, function (date) {
					return date;
				});

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
					colors = colors.slice(0, chartDataKeys.length + 1);
				} else {
					for (var i = colors.length; i <= chartDataKeys.length; i++) {
						colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
					}
				}

				initPaceLineChart.draw({
					data: dataForDateInfo,
					key: chartDataKeys,
					colors: colors,
					element: 'd3-plot'
				});

				$scope.screenData.hideChartData = false;
				$scope.dashboardFilter.showFilters = false;
			};
		}
	]);