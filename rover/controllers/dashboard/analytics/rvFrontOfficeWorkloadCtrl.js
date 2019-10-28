angular.module('sntRover')
	.controller('rvFrontOfficeWorkloadCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
		function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

			var colorScheme = d3.scaleOrdinal()
				.range(["#4D9316", "#68D41E", "#9ED474", "#AF2B12", "#E46C68", "#E58874"])
				.domain(["early_checkin", "vip_checkin", "checkin","vip_checkout", "checkout", "late_checkout"]);

			var cssClassMappings = {
                "Early Check in": "bar bar-green bar-dark",
                "Checkin": "bar bar-green bar-light",
                "VIP checkin": "bar bar-green",

                "VIP checkout": "bar bar-red bar-dark",
                "Late checkout": "bar bar-red bar-light",
                "Checkout": "bar bar-red",
            };

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
					.rangeRound([0, height])
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
					});

				var yAxis = d3.axisLeft()
					.scale(yScale)
					.ticks(5)
					.tickSizeOuter(0)
					.tickPadding(10)
					.tickFormat(function(d) {
						return d.toUpperCase();
					});

				var svgHeight = height + margin.top + margin.bottom;
				var svg = d3.select("#analytics-chart").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", svgHeight)
					.attr("id", "d3-plot")
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// DEBUGING CODE
				// chartDetails = rvAnalyticsHelperSrv.addRandomNumbersForTesting(chartDetails);

				// sort right side items in ascending order
				chartDetails.chartData.data = _.sortBy(chartDetails.chartData.data, function(item, index) {
					return item.type === 'REMAINING' ? 0 : 1;
				});

				chartDetails.chartData.data.forEach(function(chart) {

					var chartName = chart.type;

					// Let count be 10, 25, 35 - based on calculation below the following will the calculated values
					// item 1 = { xOrigin : 0  , xFinal : 10 }
					// item 2 = { xOrigin : item 1 xFinal = 10 , xFinal : item 2 xOrigin + count = 10 + 25 = 35 }
					// item 2 = { xOrigin : item 2 xFinal = 35 , xFinal : item 3 xOrigin + count = 35 + 35 = 70 }

					chart.contents.right_side = _.each(chart.contents.right_side, function(item, index) {
						// For first item X origin is 0 and xFinal is count 
						if (index === 0) {
							item.origin = 0;
							item.xFinal = item.count;
						} else {
							// For all other elements, X origin  is count of previous item and X final is count of the item
							item.origin = chart.contents.right_side[index - 1].xFinal;
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
						};
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

				var setFontSizeBasedOnNumberOfRows = function(isBarText) {
					var totalRowsPresent = chartDetails.chartData.data.length;
					var fontSize;

					if (totalRowsPresent > 20) {
						fontSize = isBarText ? "0px" :"10px";
					} else if (totalRowsPresent > 15) {
						fontSize = isBarText ? "8px" :"12px";
					} else {
						fontSize = isBarText ? "10px" :"13px";
					}

					return fontSize;
				};

				// Add x axis
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				// Add left side axis
				svg.append("g")
					.attr("class", "y axis left-most")
					.call(yAxis)
					.style("font-size", function() {
						return setFontSizeBasedOnNumberOfRows();
					});

				var remainingTypeYoffset;
				var vakken = svg.selectAll(".type")
					.data(chartDetails.chartData.data)
					.enter()
					.append("g")
					.attr("class", "bar")
					.attr("transform", function(chart) {

						if (chart.type === 'REMAINING') {
							remainingTypeYoffset = yScale(chart.type);
						}
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

					return itemPercantage < 3;
				};

				bars.append("text")
					.attr("x", function(item) {
						return ((xScale(item.xOrigin) + xScale(item.xFinal)) / 2);
					})
					.attr("y", function() {
						return yScale.bandwidth() / 2;
					})
					.attr("dy", function(item) {
						return isSmallBarItem(item) ? -1 * (yScale.bandwidth() / 2 + 10) : "0.5em";
					})
					.attr("dx", function(item) {
						return isSmallBarItem(item) && item.xOrigin < 0 ? "-0.5em" : "0em";
					})
					.style("font-size", function(item) {
						var fontSize = setFontSizeBasedOnNumberOfRows(true);

						return isSmallBarItem(item) ? "0px" : fontSize;
					})
					.style("text-anchor", "middle")
					.text(function(item) {
						return item.count !== 0  || chartDetails.chartData.data.length < 15 ? item.count : '';
					});

				// Draw horizontal line on top of REMAINING
				var yPositionOfRemainingTopLine = remainingTypeYoffset - yScale.bandwidth() / 2;
				var strokeWidthOfLines = chartDetails.chartData.data.length > 20 ? "1px" : "2px";

				if (maxValueInBotheDirections > 0) {
					svg.append("line") // attach a line
						.style("stroke", "#A0A0A0") // colour the line
						.style("stroke-width", strokeWidthOfLines)
						.attr("x1", -100) // x position of the first end of the line
						.attr("y1", yPositionOfRemainingTopLine) // y position of the first end of the line
						.attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
						.attr("y2", yPositionOfRemainingTopLine);

					// Draw horizontal line under REMAINING
					var yPositionOfRemainingBottomLine = yPositionOfRemainingTopLine + 2 * yScale.bandwidth();

					svg.append("line") // attach a line
						.style("stroke", "#A0A0A0") // colour the line
						.style("stroke-width", strokeWidthOfLines)
						.attr("x1", -100) // x position of the first end of the line
						.attr("y1", yPositionOfRemainingBottomLine) // y position of the first end of the line
						.attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
						.attr("y2", yPositionOfRemainingBottomLine);

					// Draw thick line on top of x-axis
					var yPositionOfXaxis = height;

					svg.append("line") // attach a line
						.style("stroke", "#A0A0A0") // colour the line
						.style("stroke-width", strokeWidthOfLines)
						.attr("x1", 0) // x position of the first end of the line
						.attr("y1", yPositionOfXaxis) // y position of the first end of the line
						.attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
						.attr("y2", yPositionOfXaxis);

					// Draw thick line on top of y-axis
					svg.append("line") // attach a line
						.style("stroke", "#A0A0A0") // colour the line
						.style("stroke-width", strokeWidthOfLines)
						.attr("x1", 0) // x position of the first end of the line
						.attr("y1", 0) // y position of the first end of the line
						.attr("x2", 0) // x position of the second end of the line
						.attr("y2", height);
				}

				var rightSideLegendDiv = d3.select("#right-side-legend");

				var rightSideLegendColor = d3.scaleOrdinal()
					.range(["#50762A", "#83B451", "#AC2727", "#EAC710", "#A99113", "#DD3636"])
					.domain(["Early Check in", "VIP checkin", "Checkin", "VIP checkout", "Checkout", "Late checkout"]);

				rightSideLegendDiv
					.append("dt")
					.attr("class", "legend-title")
					.attr("id", "todays-data");

				var rightSideLegendList = rightSideLegendDiv.append("ul");

				var rightSideLegendEntries = rightSideLegendList.selectAll("li")
					.data(rightSideLegendColor.domain().slice())
					.enter()
					.append("li");

				rightSideLegendEntries.append("span")
					.attr("class", "rect")
					.style("background-color", rightSideLegendColor);

				rightSideLegendEntries.append("span")
					.attr("class", "label")
					.html(function(d) {
						return d;
					});
			
			};
		}
	]);