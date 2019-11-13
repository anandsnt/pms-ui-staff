angular.module('sntRover')
	.controller('rvManagerSpiderChartCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
		function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

			$scope.drawFrontOfficeActivity = function(chartData) {
				$scope.screenData.mainHeading = "SAMPLE HEADING";
				try {
					var w = 800;
					var h = 800;
					var pad = 20;
					var left_pad = 50;

					var svg = d3.select("#d3-plot")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

					var x = d3.scaleLinear().
					domain([-1, 1])
						.range([left_pad, w - pad]);
					var y = d3.scaleLinear()
						.domain([1, -1])
						.range([pad, h - pad * 2]);

					var xAxis = d3.axisBottom().scale(x).ticks([]).tickSizeOuter(0);
					var yAxis = d3.axisLeft().scale(y).ticks([]).tickSizeOuter(0);

					svg.append("g")
						.attr("class", "axis")
						.attr("transform", "translate(0, " + y(0) + ")")
						.call(xAxis);

					svg.append("g")
						.attr("class", "axis")
						.attr("transform", "translate(" + x(0) + ", 0)")
						.call(yAxis);



					var maxValue = 5000;

					var baseValue = 1;

					var maxValueLength = maxValue.toString().length;

					if (maxValueLength > 1) {
						for (var i = 0; i < maxValueLength - 1; i++) {
							baseValue = baseValue * 10;
						}
					}


					function roundToNextThousand(x) {
						return Math.ceil(x / baseValue) * baseValue;
					}

					var individual = parseInt(maxValue) / 6;
					var roundedInvidual = roundToNextThousand(individual);

					console.log(roundToNextThousand(individual));

					var axisValues;
					if (baseValue >= 1000) {
						var factor = baseValue / 1000;

						axisValues = [roundedInvidual / baseValue + "k",
							roundedInvidual * 2 / baseValue * factor + "k",
							roundedInvidual * 3 / baseValue * factor + "k",
							roundedInvidual * 4 / baseValue * factor + "k",
							roundedInvidual * 5 / baseValue * factor + "k",
							roundedInvidual * 6 / baseValue * factor + "k"
						];
					} else {
						axisValues = [roundedInvidual,
							roundedInvidual * 2,
							roundedInvidual * 3,
							roundedInvidual * 4,
							roundedInvidual * 5,
							roundedInvidual * 6
						];
					}


					var valueOfOne = 0.1 / roundedInvidual;
					console.log(axisValues);

					for (i = 0; i < 10; i++) {

						var width = x(.1 * (i + 1)) - x(-.1 * (i + 1));
						var height = y(-.1 * (i + 1)) - y(.1 * (i + 1));

						svg.append("g")
							.append("rect")
							.attr("class", "chart-rect")
							.attr("id", "line_" + i)
							.attr("stroke-width", function() {
								return i === 3 ? 2 : 1;
							})
							.style("stroke", function() {
								return i === 3 ? "black" : "lightgray";
							})
							.attr("x", x(-.1 * (i + 1)))
							.attr("y", y(.1 * (i + 1)))
							.attr("height", height)
							.attr("width", width);
					}

					var addYAXisLabels = function(textData, isXaxis, isLabel) {
						svg.append("text")
							.attr("x", textData.xOffset)
							.attr("y", textData.yOffset)
							.attr("dx", function() {
								return isXaxis ? "-1em" : isLabel ? "1em" : ".35em"
							})
							.attr("dy", function() {
								return isXaxis ? "1em" : ".35em"
							})
							.attr("class", "")
							.style("font-size", "10px")
							.text(textData.label ? "$" + textData.label : "");
					};


					var yAxisLabels = [{
							"label": "0 %",
							"xOffset": x(0),
							"yOffset": y(0)
						}, {
							"label": "25 %",
							"xOffset": x(0),
							"yOffset": y(0.1)
						}, {
							"label": "50 %",
							"xOffset": x(0),
							"yOffset": y(0.2)
						}, {
							"label": "75 %",
							"xOffset": x(0),
							"yOffset": y(0.3)
						}, {
							"label": "",
							"xOffset": x(0),
							"yOffset": y(0.4)
						}, {
							"label": "25 %",
							"xOffset": x(0),
							"yOffset": y(-0.1)
						}, {
							"label": "50 %",
							"xOffset": x(0),
							"yOffset": y(-0.2)
						}, {
							"label": "75 %",
							"xOffset": x(0),
							"yOffset": y(-0.3)
						}, {
							"label": "",
							"xOffset": x(0),
							"yOffset": y(-0.4)
						},

						{
							"label": axisValues[0],
							"xOffset": x(0),
							"yOffset": y(-0.5)
						}, {
							"label": axisValues[1],
							"xOffset": x(0),
							"yOffset": y(-0.6)
						}, {
							"label": axisValues[2],
							"xOffset": x(0),
							"yOffset": y(-0.7)
						}, {
							"label": axisValues[3],
							"xOffset": x(0),
							"yOffset": y(-0.8)
						}, {
							"label": axisValues[4],
							"xOffset": x(0),
							"yOffset": y(-0.9)
						}, {
							"label": axisValues[5],
							"xOffset": x(0),
							"yOffset": y(-1)
						}, {
							"label": axisValues[0],
							"xOffset": x(0),
							"yOffset": y(0.5)
						}, {
							"label": axisValues[1],
							"xOffset": x(0),
							"yOffset": y(0.6)
						}, {
							"label": axisValues[2],
							"xOffset": x(0),
							"yOffset": y(0.7)
						}, {
							"label": axisValues[3],
							"xOffset": x(0),
							"yOffset": y(0.8)
						}, {
							"label": axisValues[4],
							"xOffset": x(0),
							"yOffset": y(0.9)
						}, {
							"label": axisValues[5],
							"xOffset": x(0),
							"yOffset": y(1)
						}
					];

					for (i = 0; i <= yAxisLabels.length - 1; i++) {
						addYAXisLabels(yAxisLabels[i])
					}



					var xAxisLabels = [{
						"label": axisValues[0],
						"xOffset": x(-0.5),
						"yOffset": y(0)
					}, {
						"label": axisValues[1],
						"xOffset": x(-0.6),
						"yOffset": y(0)
					}, {
						"label": axisValues[2],
						"xOffset": x(-0.7),
						"yOffset": y(0)
					}, {
						"label": axisValues[3],
						"xOffset": x(-0.8),
						"yOffset": y(0)
					}, {
						"label": axisValues[4],
						"xOffset": x(-0.9),
						"yOffset": y(0)
					}, {
						"label": axisValues[5],
						"xOffset": x(-1),
						"yOffset": y(0)
					}, {
						"label": axisValues[0],
						"xOffset": x(0.5),
						"yOffset": y(0)
					}, {
						"label": axisValues[1],
						"xOffset": x(0.6),
						"yOffset": y(0)
					}, {
						"label": axisValues[2],
						"xOffset": x(0.7),
						"yOffset": y(0)
					}, {
						"label": axisValues[3],
						"xOffset": x(0.8),
						"yOffset": y(0)
					}, {
						"label": axisValues[4],
						"xOffset": x(0.9),
						"yOffset": y(0)
					}, {
						"label": axisValues[5],
						"xOffset": x(1),
						"yOffset": y(0)
					}]


					for (i = 0; i <= xAxisLabels.length - 1; i++) {
						addYAXisLabels(xAxisLabels[i], true)
					}

					// svg.selectAll("text")  
					//            .style("text-anchor", "end")
					//            .attr("dx", "-.8em")
					//            .attr("dy", ".15em")
					//            .attr("transform",function(d){
					//              console.log(d)
					//              return  "translate (0,0)rotate(-65)" 
					//            });
					///////////////////////////////////////////////////////////////////////
					svg.append("circle").
					attr("cx", x(-0.3))
						.attr("cy", y(0.3))
						.attr("r", 8)
						.attr("fill", "#89BD55");


					var firstData = {
						"label": "75 %",
						"xOffset": x(-0.3),
						"yOffset": y(0.3)
					}

					addYAXisLabels(firstData, false, true)

					svg.append("circle").
					attr("cx", x(0.1))
						.attr("cy", y(0.1))
						.attr("r", 8)
						.attr("fill", "#E63838");

					var secondData = {
						"label": "25 %",
						"xOffset": x(0.1),
						"yOffset": y(0.1)
					}

					addYAXisLabels(secondData, false, true)

					svg.append("circle").
					attr("cx", x(57 * 0.1 / 25))
						.attr("cy", y(-57 * 0.1 / 25))
						.attr("r", 8)
						.attr("fill", "#F6991B");

					var secondData = {
						"label": "57 %",
						"xOffset": x(57 * 0.1 / 25),
						"yOffset": y(-57 * 0.1 / 25)
					}

					addYAXisLabels(secondData, false, true)

					svg.append("circle").
					attr("cx", x(-90 * 0.1 / 25))
						.attr("cy", y(-90 * 0.1 / 25))
						.attr("r", 8)
						.attr("fill", "#89BD55");


					var firstData = {
						"label": "90 %",
						"xOffset": x(-90 * 0.1 / 25),
						"yOffset": y(-90 * 0.1 / 25)
					}

					addYAXisLabels(firstData, false, true)
					///////////////////////////////////////////////////////////////////////


					var height = 200
					var width = 500


					var addLeftSideOffsetPlusLeftMargin = function(leftSideOffset) {
						return document.getElementById("d3-plot").offsetLeft + leftSideOffset + "px"
					};

					var addLabels = function(d) {
						var div = d3.select('#d3-plot').append('div')
							.style('position', 'absolute')
							.style('top', d.top)
							.style('left', d.left)
							.style('width', "80px")
							.style('height', "40px")
							.style('background-color', d.backgroundColor)
							.style('color', "white")
							.style("text-align", "center")
							.style("font-size", "9px")


						if (baseValue >= 1000) {
							var factor = baseValue / 1000;

							d.value = d.value * factor + "k";
						}
						div.append("p")
							.html(d.label);
						div.append("p")
							.html("$" + d.value);
					}

					var lowestValue = maxValue / 5;
					var oneDivisonConversion = .0001;

					var leftSideMarinCalculation = function(isLeftSide, value) {
						var xValue = 0.5 + (parseInt(value) - parseInt(lowestValue)) * valueOfOne;
						xValue = isLeftSide ? -1 * xValue : xValue;

						return addLeftSideOffsetPlusLeftMargin(x(xValue))
					};

					var topSideMarginCalculation = function(isDownSide, value) {
						var yValue = 0.5 + (parseInt(value) - parseInt(lowestValue)) * valueOfOne;
						yValue = isDownSide ? -1 * yValue : yValue;

						return y(yValue) + "px";
					};

					var lowestValue = maxValue / 5;;
					var oneDivisonConversion = .0001;

					var addLabelToChart = function(label, isLeftSide, isDownSide) {

						var xValue = 0.5 + (parseInt(label.value) - parseInt(roundedInvidual)) * valueOfOne;
						xValue = isLeftSide ? -1 * xValue : xValue;
						var yValue = 0.5 + (parseInt(label.value) - parseInt(roundedInvidual)) * valueOfOne;
						yValue = isDownSide ? -1 * yValue : yValue;
						
						var text1 = svg.append("g");

						text1.append('rect')
							.attr("class", "rect-bars")
							.attr('x', function(d, i) {
								return x(xValue); // xOffset + some margin
							})
							.style("margin-right", "10px")
							.attr('y', function(d) {
								return y(yValue);
							})
							.attr('width', function() {
								return 100;
							})
							.attr('height', function() {
								return 50;
							})
							.attr("fill", label.backgroundColor);

						text1.append("text")
							.attr('x', function(d, i) {

								return x(xValue + 0.05); // xOffset + some margin
							})
							.attr('y', function(d) {
								return y(yValue - 0.05);
							})
							.style("font-size", "15px")
							.style("fill", "white")
							.text(label.label);

						if (baseValue >= 1000) {
							var factor = 1 / 1000;

							label.value = label.value * factor;
						};
						label.value = $filter('number')(label.value, 2);
						if (baseValue >= 1000) {
							label.value = label.value + "k";
						}
						

						text1.append("text")
							.attr('x', function(d, i) {
								return x(xValue + 0.05); // xOffset + some margin
							})
							.attr('y', function(d) {
								return y(yValue - 0.1);
							})
							.style("font-size", "15px")
							.style("fill", "white")
							.text("$" + label.value);
					}



					var leftTop = {
						"class": "bottomRight",
						"top": y(0.6) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(-0.6)),
						"backgroundColor": "#E63838",
						"label": "ADR",
						"value": maxValue
					}


					addLabelToChart(leftTop, true, false);

					var leftTop = {
						"class": "bottomRight",
						// "top": y(0.5) + "px",
						"backgroundColor": "#E63838",
						"label": "REVPAR",
						"value": maxValue / 2
					}
					addLabelToChart(leftTop, true, false);

					// leftTop.top = topSideMarginCalculation(false, leftTop.value);
					// leftTop.left = leftSideMarinCalculation(true,leftTop.value);

					// addLabels(leftTop);

					var rightTop = {
						"class": "bottomRight",
						// "top": y(0.7) + "px",
						"backgroundColor": "#89BD55",
						"label": "ADR",
						"value": maxValue / 2.5
					}
					// rightTop.top = topSideMarginCalculation(false, rightTop.value);
					// rightTop.left = leftSideMarinCalculation(false,rightTop.value);

					addLabelToChart(rightTop, false, false);

					var rightTop = {
						"class": "bottomRight",
						"top": y(0.5) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(0.5)),
						"backgroundColor": "#89BD55",
						"label": "REVPAR",
						"value": maxValue / 3
					}

					addLabelToChart(rightTop, false, false);

					var leftBottom = {
						"class": "bottomRight",
						"top": y(-0.8) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(-0.8)),
						"backgroundColor": "#F6991B",
						"label": "ADR",
						"value": maxValue / 4
					}
					addLabelToChart(leftBottom, true, true);

					var leftBottom = {
						"class": "bottomRight",
						"top": y(-0.5) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(-0.5)),
						"backgroundColor": "#F6991B",
						"label": "REVPAR",
						"value": maxValue / 5
					}

					addLabelToChart(leftBottom, true, true);

					var rightBottom = {
						"class": "bottomRight",
						"top": y(-0.7) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(0.7)),
						"backgroundColor": "#89BD55",
						"label": "ADR",
						"value": maxValue / 2
					}

					addLabelToChart(rightBottom, false, true);

					var rightBottom = {
						"class": "bottomRight",
						"top": y(-0.5) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(0.5)),
						"backgroundColor": "#89BD55",
						"label": "REVPAR",
						"value": maxValue / 3
					}

					addLabelToChart(rightBottom, false, true);

					///////////////////////////////////////////////////////////////////

					var addMainLabelsOnGraph = function(d) {
						var div = d3.select('#d3-plot').append('div')
							.style('position', 'absolute')
							.style('top', d.top)
							.style('left', d.left)
							.style('width', d.width)
							.style('height', "40px")
							.style('background-color', d.backgroundColor)
							.style('color', "white")
							.style("text-align", "center")
							.style("font-size", "9px")
							.style("opacity", "0.8")

						div.append("p")
							.html(d.label);
					};

					var addMainLabelsOnGraph1 = function(label, isLeftSide, isTop) {

						var xValue = isLeftSide ? -0.3 : 0;
						var yValue = isTop ? 1 : -0.9;
						var yValueText = isTop ? 0.95 : -0.95;

						var text1 = svg.append("g");

						text1.append('rect')
							.attr("class", "rect-bars")
							.attr('x', function(d, i) {
								return x(xValue); // xOffset + some margin
							})
							.style("margin-right", "10px")
							.attr('y', function(d) {
								return y(yValue);
							})
							.attr('width', function() {
								return x(0.3) - x(0);
							})
							.attr('height', function() {
								return y(0) - y(0.1);
							})
							.attr("fill", label.backgroundColor)
							.style("fill-opacity", "0.8");

						text1.append("text")
							.attr('x', function(d, i) {

								return x(xValue + 0.05); // xOffset + some margin
							})
							.attr('y', function(d) {
								return y(yValueText);
							})
							.style("font-size", "15px")
							.style("fill", "white")
							.text(label.label);
					}

					var topLeftMainLabel = {
						"top": y(1) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(-0.25)),
						"width": x(0) - x(-0.25) + "px",
						"backgroundColor": "#6B6C6E",
						"label": "Yesterday"
					};

					addMainLabelsOnGraph1(topLeftMainLabel, true, true);


					var rightBottom = {
						"class": "bottomRight",
						"top": y(1) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(0)),
						"width": x(0.25) - x(0) + "px",
						"backgroundColor": "#6B6C6E",
						"label": "Today"
					};

					addMainLabelsOnGraph1(rightBottom, false, true);

					///////////////////////////////////////////////////////////

					var rightBottom = {
						"class": "bottomRight",
						"top": y(-0.95) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(-0.25)),
						"width": x(0) - x(-0.25) + "px",
						"backgroundColor": "#6B6C6E",
						"label": "MTD"
					};

					addMainLabelsOnGraph1(rightBottom, true, false);

					var rightBottom = {
						"class": "bottomRight",
						"top": y(-0.95) + "px",
						"left": addLeftSideOffsetPlusLeftMargin(x(0)),
						"width": x(0.25) - x(0) + "px",
						"backgroundColor": "#6B6C6E",
						"label": "YTD"
					};
					addMainLabelsOnGraph1(rightBottom, false, false);
				} catch (E) {
					console.log(E)
				}

				$scope.$emit('REFRESH_ANALTICS_SCROLLER');
				$scope.screenData.hideChartData = false;
			};
		}
	]);