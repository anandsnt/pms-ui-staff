angular.module('sntRover')
	.controller('rvFrontOfficeWorkloadCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
		function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {


			var colorScheme = d3.scaleOrdinal()
				.range(["#50762A", "#83B451", "#EAC710", "#DD3636", "#A99113", "#AC2727"])
				.domain(["early_checkin", "vip_checkin", "vip_checkout", "late_checkout", "checkout", "checkin"]);


			$scope.drawWorkLoadChart = function(chartDetails) {
				$scope.screenData.mainHeading = $filter('translate')(chartDetails.chartData.label);
				var chartAreaWidth = document.getElementById("analytics-chart").clientWidth;
				var margin = {
						top: 50,
						right: 20,
						bottom: 30,
						left: 150
					},
					width = chartAreaWidth - margin.left - margin.right,
					height = window.innerHeight * 2 / 3 - margin.top - margin.bottom;

				var yScale = d3.scaleBand()
					.rangeRound([0, height + 10])
					.padding(.5);

				var xScale = d3.scaleLinear()
					.rangeRound([0, width]);

				var xAxis = d3.axisBottom()
					.scale(xScale)
					.tickSizeOuter(0)
					.ticks(10)
					.tickSizeInner(-height)
					.tickFormat(function(d) {
						// X axis... treat -ve values as positive
						return (d < 0) ? (d * -1) : d;
					})
					//.attr("style","{ 'stroke': 'black', 'fill': 'none', 'stroke-width': '1px'}");

				var yAxis = d3.axisLeft()
					.scale(yScale)
					.ticks(5)
					//.tickSizeInner(-width)
					.tickSizeOuter(0)
					.tickPadding(10)
					.tickFormat(function(d) {
						console.log(d);
						return d.toUpperCase();
					});

				var svg = d3.select("#analytics-chart").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.attr("id", "d3-plot")
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// DEBUGING CODE
				chartDetails = rvAnalyticsHelperSrv.addRandomNumbersForTesting(chartDetails);

				chartDetails.chartData.data.forEach(function(chart) {

					var chartName = chart.type;
					// sort right side items in ascending order
					chart.contents.right_side = _.sortBy(chart.contents.right_side, function(item) {
						return item.count;
					});

					// Let count be 10, 25, 35 - based on calculation below the following will the calculated values
					// item 1 = { xOrigin : 0  , xFinal : 10 }
					// item 2 = { xOrigin : 10 , xFinal : 25 }
					// item 2 = { xOrigin : 25 , xFinal : 35 }

					chart.contents.right_side = _.each(chart.contents.right_side, function(item, index) {
						// For first item X origin is 0 and xFinal is count 
						if (index === 0) {
							item.origin = 0;
							item.xFinal = item.count;
						} else {
							// For all other elements, X origin  is count of previous item and X final is count of the item
							item.origin = chart.contents.right_side[index - 1].xFinal;;
							item.xFinal = item.origin + chart.contents.right_side[index].count;
						}
					});

					chart.boxes = chart.contents.right_side.map(function(item) {
						return {
							type: item.type,
							label: item.label,
							xOrigin: item.origin,
							xFinal: item.xFinal,
							count: item.count,
							chartName: chartName,
							elementId: chartName + "-" + item.type
						}
					});
				});

				// get minimum and maximum values to plot
				chartDetails.min_val = d3.min(chartDetails.chartData.data, function(chart) {
					return chart.boxes["0"].xOrigin;
				});
				chartDetails.max_val = d3.max(chartDetails.chartData.data, function(chart) {
					return chart.boxes[chart.boxes.length - 1].xFinal;
				});

				var maxValueInBotheDirections = chartDetails.min_val > chartDetails.max_val ?
					chartDetails.min_val : chartDetails.max_val;

				// set scales for x axis
				xScale.domain([0, maxValueInBotheDirections]).nice();
				yScale.domain(chartDetails.chartData.data.map(function(chart) {
					return chart.type;
				}));

				// Add x axis
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				// Add left side axis
				svg.append("g")
					.style("font-size", "18px")
					.attr("class", "y axis left-most")
					.call(yAxis);

				//              var dataForDrawingBars = {
				//                  svg: svg,
				//                  yScale: yScale,
				//                  xScale: xScale,
				//                  chartDetails: chartDetails,
				//                  colorScheme: colorScheme,
				//                  maxValue: maxValueInBotheDirections
				//              };


				//              var svg = barData.svg,
				// yScale = barData.yScale,
				// xScale = barData.xScale,
				// chartDetails = barData.chartDetails,
				// colorScheme = barData.colorScheme,
				// maxValue = barData.maxValue;

				var vakken = svg.selectAll(".type")
					.data(chartDetails.chartData.data)
					.enter().append("g")
					.attr("class", "bar")
					.attr("transform", function(chart) {
						return "translate(0," + yScale(chart.type) + ")";
					});

				var bars = vakken.selectAll("rect")
					.data(function(mainItem) {
						return mainItem.boxes;
					})
					.enter()
					.append("g")
					.attr("class", "subbar")
					.attr("id", function(item) {
						return item.elementId;
					});

				bars.append("rect")
					.attr("height", yScale.bandwidth())
					.attr("x", function(item) {
						return xScale(item.xOrigin);
					})
					.attr("width", function(item) {
						return xScale(item.xFinal) - xScale(item.xOrigin);
					})
					.style("fill", function(item) {
						// console.log(item.chartName);
						// console.log(colorScheme[item.chartName + 'ColorScheme']);
						return colorScheme(item.type);
					})
					.on("click", function(e) {
						chartDetails.onBarChartClick(e);
					});

				var isSmallBarItem = function(item) {
					var itemPercantage = item.count * 100 / maxValueInBotheDirections;
					return itemPercantage < 5;
				};
				bars.append("text")
					.attr("x", function(item) {
						return ((xScale(item.xOrigin) + xScale(item.xFinal)) / 2);
					})
					.attr("y", function(item) {
						return yScale.bandwidth() / 2;
					})
					.attr("dy", function(item) {
						return isSmallBarItem(item) ? -1 * (yScale.bandwidth() / 2 + 10) : "0.5em";
					})
					.attr("dx", function(item) {
						return isSmallBarItem(item) && item.xOrigin < 0 ? "-0.5em" : "0em";
					})
					.style("font-size", function(item) {
						return isSmallBarItem(item) ? "10px" : "15px";
					})
					.style("text-anchor", "middle")
					.text(function(item) {
						return item.count !== 0 ? item.count : '';
					});
				// rvAnalyticsHelperSrv.drawBarsOfBidirectonalChart(dataForDrawingBars);


				var firstLineHeight = yScale.bandwidth()/2;
				svg.append("line") // attach a line
					.style("stroke", "#000000") // colour the line
					.style("stroke-width", "2px")
					.attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
					.attr("y1", firstLineHeight) // y position of the first end of the line
					.attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
					.attr("y2", firstLineHeight);

				var firstLineHeight1 = 2.5 * yScale.bandwidth();
				svg.append("line") // attach a line
					.style("stroke", "#000000") // colour the line
					.style("stroke-width", "2px")
					.attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
					.attr("y1", firstLineHeight1) // y position of the first end of the line
					.attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
					.attr("y2", firstLineHeight1);


				// // right side legends
				var rightSideLegendDiv = d3.select("#right-side-legend")
										.style("margin-top", yScale.bandwidth());
				var rightSideLegendColor = d3.scaleOrdinal()
					.range(["#50762A", "#83B451", "#EAC710", "#DD3636", "#A99113", "#AC2727"])
					.domain(["Early Check in", "VIP checkin", "VIP checkout", "Late checkout", "Checkout", "Checkin"]);
	
				var rightSideLegendEntries = rightSideLegendDiv.selectAll("dd")
					.data(rightSideLegendColor.domain().slice())
					.enter()
					.append("dd")
					.attr("class", "legend-item")
					.attr("id", function(item) {
						return "left-legend-" + item.toLowerCase();
					})

				rightSideLegendEntries.append("span")
					.attr("class", "rect")
					.style("background-color", rightSideLegendColor);

				rightSideLegendEntries.append("span")
					.attr("class", "rect-label")
					.html(function(label) {
						return label;
					});

				
			}
		}
	]);