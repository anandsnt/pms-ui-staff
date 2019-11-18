angular.module('sntRover')
	.controller('rvManagerSpiderChartCtrl', ['$scope', '$rootScope',  'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
		function($scope, $rootScope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

			$scope.drawPerfomceChart = function(chartData) {

				// chartData = {
				// 	"today": {
				// 		"adr": "1000.00",
				// 		"rev_par": "900.00",
				// 		"occupancy": "90"
				// 	},
				// 	"yesterday": {
				// 		"adr": "9000.00",
				// 		"rev_par": "900.00",
				// 		"occupancy": "80"
				// 	},
				// 	"mtd": {
				// 		"adr": "1000.00",
				// 		"rev_par": "900.00",
				// 		"occupancy": "67"
				// 	},
				// 	"ytd": {
				// 		"adr": "500.00",
				// 		"rev_par": "900.00",
				// 		"occupancy": "45.98"
				// 	}
				// }

				$scope.screenData.mainHeading = $filter('translate')("AN_ROOM_PERFOMANCE_KPR");
				console.log(chartData);

				var chartDataArray = Object.keys(chartData).map(function(key) {
					return _.extend({
						type: key
					}, chartData[key]);
				});

				var maxAdr = _.max(chartDataArray, function(data) {
					return parseFloat(data.adr);
				});
				var maxRevPar = _.max(chartDataArray, function(data) {
					return parseFloat(data.rev_par);
				});
				var maxValueForChart = parseInt(maxAdr.adr) > parseInt(maxRevPar.rev_par) ? maxAdr.adr : maxRevPar.rev_par;

				try {
					var chartWidth = 800;
					var chartHeight = 800;
					var padding = 50;
					var leftPadding = 50;

					var svg = d3.select("#d3-plot")
						.append("svg")
						.attr("width", chartWidth)
						.attr("height", chartHeight);

					var x = d3.scaleLinear().
					domain([-1, 1])
						.range([leftPadding, chartWidth - padding]);

					var y = d3.scaleLinear()
						.domain([1, -1])
						.range([padding, chartHeight - padding * 2]);

					var xAxis = d3.axisBottom()
						.scale(x)
						.ticks([])
						.tickSizeOuter(0);
					var yAxis = d3
						.axisLeft()
						.scale(y)
						.ticks([])
						.tickSizeOuter(0);


					svg.append("g")
						.attr("class", "axis")
						.attr("transform", "translate(0, " + y(0) + ")")
						.call(xAxis);

					svg.append("g")
						.attr("class", "axis")
						.attr("transform", "translate(" + x(0) + ", 0)")
						.call(yAxis);

					var baseValue = 1;
					maxValueForChart = parseInt(maxValueForChart);
					var maxValueForChartLength = maxValueForChart.toString().length;

					if (maxValueForChartLength > 1) {
						for (var i = 0; i < maxValueForChartLength - 1; i++) {
							baseValue = baseValue * 10;
						}
					}

					function roundToNextThousand(x) {
						return Math.ceil(x / baseValue) * baseValue;
					}
					var individual = parseInt(maxValueForChart) / 6;
					var roundedInvidual = roundToNextThousand(individual);

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

					// Draw 10 squares
					for (var i = 0; i < 10; i++) {

						var width = x(.1 * (i + 1)) - x(-.1 * (i + 1));
						var height = y(-.1 * (i + 1)) - y(.1 * (i + 1));

						svg.append("g")
							.append("rect")
							.attr("class", "chart-rect")
							.attr("id", "line_" + i)
							.attr("stroke-width", function() {
								// for the fourth sqaures, add thick lines
								return i === 3 ? 2 : 1;
							})
							.style("stroke", function() {
								// for the fourth sqaures, paint black
								return i === 3 ? "black" : "lightgray";
							})
							.attr("x", x(-.1 * (i + 1)))
							.attr("y", y(.1 * (i + 1)))
							.transition()
							.duration(1000)
							.attr("height", height)
							.attr("width", width)
					}


					var addAxisLabelsToChart = function(textData, isXaxis) {
						var label = (textData.type === "occupany") ?
							(textData.label ? textData.label + "%" : "") :
							$rootScope.currencySymbol + textData.label;

						svg.append("text")
							.attr("x", textData.xOffset)
							.attr("y", textData.yOffset)
							.attr("dx", function() {
								return isXaxis ? "-1em" : ".35em";
							})
							.attr("dy", function() {
								return isXaxis ? "1em" : ".35em"
							})
							.attr("class", "")
							.style("font-size", "10px")
							.text(label);
					};

					var addTextToTheChart = function(textData, isLeftSide, isDownSide) {
						var label = (textData.type === "occupany") ?
							(textData.label ? textData.label + "%" : "") :
							"$" + textData.label;

						svg.append("text")
							.attr("x", textData.xOffset)
							.attr("y", textData.yOffset)
							.attr("dx", function() {
								return isLeftSide ? "-2em" : "2em";
							})
							.attr("dy", function() {
								return isDownSide ? "2em" : "-1em";
							})
							.attr("class", "")
							.style("font-size", "10px")
							.style("font-weight", "bold")
							.text(label);
					};

					var yAxisLabels = rvAnalyticsHelperSrv.getYAxisValues(axisValues, x, y);

					for (var i = 0; i <= yAxisLabels.length - 1; i++) {
						addAxisLabelsToChart(yAxisLabels[i]);
					};

					var xAxisLabels = rvAnalyticsHelperSrv.getXAxisValues(axisValues, x, y);

					for (var i = 0; i <= xAxisLabels.length - 1; i++) {
						addAxisLabelsToChart(xAxisLabels[i], true);
					};

					var labelMappings;

					var addClickEvents = function(position, isRedraw) {
						var animationDuration = isRedraw ? 200 : 1000;

						$timeout(function() {
							$("#" + position + "-adr-rect").click(onClickOnLabel);
							$("#" + position + "-adr-label1").click(onClickOnLabel);
							$("#" + position + "-adr-label2").click(onClickOnLabel);
							$("#" + position + "-rev-par-rect").click(onClickOnLabel);
							$("#" + position + "-rev-par-label1").click(onClickOnLabel);
							$("#" + position + "-rev-par-label2").click(onClickOnLabel);
						}, animationDuration);
					};

					var onClickOnLabel = function(e) {
						console.log(e.target.id);
						var position;

						if (e.target.id && e.target.id.includes("left-top")) {
							position = "left-top";
						} else if (e.target.id && e.target.id.includes("right-top")) {
							position = "right-top";
						} else if (e.target.id && e.target.id.includes("left-bottom")) {
							position = "left-bottom";
						} else if (e.target.id && e.target.id.includes("right-bottom")) {
							position = "right-bottom";
						}
						var labelAttrs = labelMappings[position]

						if (position) {
							$("#" + position + "-adr-rect").remove();
							$("#" + position + "-adr-label1").remove();
							$("#" + position + "-adr-label2").remove();
							$("#" + position + "-rev-par-rect").remove();
							$("#" + position + "-rev-par-label1").remove();
							$("#" + position + "-rev-par-label2").remove();

							if (e.target.id.includes("rev-par")) {
								addLabelToChart(labelAttrs.revPar, labelAttrs.isLeftSide, labelAttrs.isDownSide, true);
								addLabelToChart(labelAttrs.adr, labelAttrs.isLeftSide, labelAttrs.isDownSide, true);
							} else {
								addLabelToChart(labelAttrs.adr, labelAttrs.isLeftSide, labelAttrs.isDownSide, true);
								addLabelToChart(labelAttrs.revPar, labelAttrs.isLeftSide, labelAttrs.isDownSide, true);
							}

							addClickEvents(position, true);
						}
					};


					var addLabelToChart = function(label, isLeftSide, isDownSide, isRedraw) {

						if (parseFloat(label.value) === 0) {
							// don't Draw
							return;
						}
						var xValue = 0.5 + (parseInt(label.value) - parseInt(roundedInvidual)) * valueOfOne;
						
						xValue = isLeftSide ? -1 * xValue : xValue;
						var rectYvalue = 0.5 + (parseInt(label.value) - parseInt(roundedInvidual)) * valueOfOne;
						
						rectYvalue = isDownSide ? -1 * rectYvalue : rectYvalue;

						var rectWidth = x(0.3) - x(0);
						var xOffset = x(xValue) - rectWidth / 2,
							yOffset = y(rectYvalue) - (y(0) - y(0.15)) / 2,

							xOffsetText = x(xValue) - rectWidth / 4,

							yOffsetText = y(rectYvalue) - (y(0) - y(0.15)) / 6,
							yOffsetText2 = y(rectYvalue) + (y(0) - y(0.15)) / 4;


						var textLabelGroup = svg.append("g");
						var animationDuration = isRedraw ? 200 : 1000;
						
						textLabelGroup.append('rect')
							.attr("class", "rect-bars")
							.attr('x', function(d, i) {
								return xOffset; // xOffset + some margin
							})
							.style("margin-right", "10px")
							.attr('y', function(d) {
								return yOffset;
							})
							.transition()
							.duration(animationDuration)
							.attr('width', function() {
								return rectWidth;
							})
							.attr('height', function() {
								return y(0) - y(0.15);
							})
							.attr("id", label.id + "-rect")
							.attr("fill", label.backgroundColor)
							.attr("stroke-width", "1")
							.attr("stroke", "#000")
							.style("cursor", "pointer");

						$("#" + label.id + "-rect").click(onClickOnLabel);

						textLabelGroup.append("text")
							.attr('x', xOffsetText)
							.attr('y', yOffsetText)
							.attr("id", label.id + "-label1")
							.style("font-size", "15px")
							.style("fill", "white")
							.text(label.label)
							.style("cursor", "pointer");

						$("#" + label.id + "-label1").click(onClickOnLabel);

						var labelText = label.value;
						if (baseValue >= 1000) {
							var factor = 1 / 1000;

							labelText = labelText * factor;
						};
						labelText = parseFloat(labelText).toFixed(2);
						if (baseValue >= 1000) {
							labelText = labelText + "k";
						}

						textLabelGroup.append("text")
							.attr('x', xOffsetText)
							.attr('y', yOffsetText2)
							.attr("id", label.id + "-label2")
							.style("font-size", "15px")
							.style("fill", "white")
							.text($rootScope.currencySymbol + labelText)
							.style("cursor", "pointer");

						$("#" + label.id + "-label2").click(onClickOnLabel);
					}

					var lowestValue = maxValueForChart / 5;
					var oneDivisonConversion = .0001;

					/**  ****************************  Let Top Quadrant ******************************/
					var yesterDaysOccupany = parseFloat(chartData.yesterday.occupancy);

					yesterDaysOccupany = yesterDaysOccupany > 25 ? yesterDaysOccupany : parseInt(yesterDaysOccupany);

					svg.append("circle").
					attr("cx", x(-1 * yesterDaysOccupany * 0.1 / 25))
						.attr("cy", y(yesterDaysOccupany * 0.1 / 25))
						.attr("r",  yesterDaysOccupany > 25 ? 8 : 4)
						.attr("fill", "#89BD55");

					var leftTopQuadrantOccupany = {
						"type": "occupany",
						"label": yesterDaysOccupany,
						"xOffset": x(-1 * yesterDaysOccupany * 0.1 / 25),
						"yOffset": y(yesterDaysOccupany * 0.1 / 25)
					};

					addTextToTheChart(leftTopQuadrantOccupany, true, false);

					var leftTopQuadrantADR = {
						"top": y(0.6) + "px",
						"backgroundColor": "#E63838",
						"label": "ADR",
						"value": chartData.yesterday.adr,
						"id": "left-top-adr"
					};

					addLabelToChart(leftTopQuadrantADR, true, false);

					var leftTopQuadrantRevPar = {
						"backgroundColor": "#E63838",
						"label": "REVPAR",
						"value": chartData.yesterday.rev_par,
						"id": "left-top-rev-par"
					};

					addLabelToChart(leftTopQuadrantRevPar, true, false);
					addClickEvents("left-top", false);
					


					/**  ****************************  Let Top Quadrant ends here ******************************/

					/**  ****************************  Right Top Quadrant ******************************/

					var todaysOccupany = parseFloat(chartData.today.occupancy);

					todaysOccupany = todaysOccupany > 25 ? todaysOccupany : parseInt(todaysOccupany);
					svg.append("circle").
					attr("cx", x(todaysOccupany * 0.1 / 25))
						.attr("cy", y(todaysOccupany * 0.1 / 25))
						.attr("r", todaysOccupany > 25 ? 8 : 4)
						.attr("fill", "#E63838");

					var rightTopQuadrantOccupany = {
						"type": "occupany",
						"label": todaysOccupany,
						"xOffset": x(todaysOccupany * 0.1 / 25),
						"yOffset": y(todaysOccupany * 0.1 / 25)
					};

					addTextToTheChart(rightTopQuadrantOccupany, false, false);

					var rightTopQuadrantAdr = {
						"class": "bottomRight",
						"backgroundColor": "#89BD55",
						"label": "ADR",
						"value": chartData.today.adr,
						"id": "right-top-adr"
					};

					var rightTopQuadrantRevPar = {
						"class": "bottomRight",
						"top": y(0.5) + "px",
						"backgroundColor": "#89BD55",
						"label": "REVPAR",
						"value": chartData.today.rev_par,
						"id": "right-top-rev-par"
					};

					addLabelToChart(rightTopQuadrantAdr, false, false);
					addLabelToChart(rightTopQuadrantRevPar, false, false);
					addClickEvents("right-top", false);

					/**  ****************************  Right Top Quadrant ends here ******************************/

					/**  ****************************  Let Bottom Quadrant ******************************/

					var mtdOccupany = parseFloat(chartData.mtd.occupancy);

					mtdOccupany = mtdOccupany > 25 ? mtdOccupany : parseInt(mtdOccupany);

					svg.append("circle").
					attr("cx", x(-1 * mtdOccupany * 0.1 / 25))
						.attr("cy", y(-1 * mtdOccupany * 0.1 / 25))
						.attr("r", mtdOccupany > 25 ? 8 : 4)
						.attr("fill", "#0000FF");

					var leftBottomOccupancy = {
						"type": "occupany",
						"label": mtdOccupany,
						"xOffset": x(-1 * mtdOccupany * 0.1 / 25),
						"yOffset": y(-1 * mtdOccupany * 0.1 / 25)
					};

					addTextToTheChart(leftBottomOccupancy, true, true);

					var leftBottomAdr = {
						"class": "bottomRight",
						"top": y(-0.8) + "px",
						"backgroundColor": "#F6991B",
						"label": "ADR",
						"value": chartData.mtd.adr,
						"id": "left-bottom-adr"
					};
					addLabelToChart(leftBottomAdr, true, true);

					var leftBottomRevPar = {
						"class": "bottomRight",
						"top": y(-0.5) + "px",
						"backgroundColor": "#F6991B",
						"label": "REVPAR",
						"value": chartData.mtd.rev_par,
						"id": "left-bottom-rev-par"
					};

					addLabelToChart(leftBottomRevPar, true, true);
					addClickEvents("left-bottom", false);

					/**  ****************************  Left Bottom Quadrant ends here ******************************/

					/**  ****************************  Right Bottom Quadrant ******************************/
					var ytdOccupany = parseFloat(chartData.ytd.occupancy);

					ytdOccupany = ytdOccupany > 25 ? ytdOccupany : parseInt(ytdOccupany);
					svg.append("circle").
					attr("cx", x(ytdOccupany * 0.1 / 25))
						.attr("cy", y(-1 * ytdOccupany * 0.1 / 25))
						.attr("r", ytdOccupany > 25 ? 8 : 4)
						.attr("fill", "#F6991B");

					var rightBottomOccupancy = {
						"type": "occupany",
						"label": ytdOccupany,
						"xOffset": x(ytdOccupany * 0.1 / 25),
						"yOffset": y(-1 * ytdOccupany * 0.1 / 25)
					};

					addTextToTheChart(rightBottomOccupancy, false, true)

					var rightBottomAdr = {
						"class": "bottomRight",
						"top": y(-0.7) + "px",
						"backgroundColor": "#89BD55",
						"label": "ADR",
						"value": chartData.ytd.adr,
						"id": "right-bottom-adr"
					};

					addLabelToChart(rightBottomAdr, false, true);

					var rightBottomRevPar = {
						"class": "bottomRight",
						"top": y(-0.5) + "px",
						"backgroundColor": "#89BD55",
						"label": "REVPAR",
						"value": chartData.ytd.rev_par,
						"id": "right-bottom-rev-par"
					};

					addLabelToChart(rightBottomRevPar, false, true);
					addClickEvents("right-bottom", false);

					/**  ****************************  Right Bottom Quadrant ends here ******************************/

					labelMappings = {
						"right-top": {
							"position": "right-top",
							"adr": rightTopQuadrantAdr,
							"revPar": rightTopQuadrantRevPar,
							"isLeftSide": false,
							"isDownSide": false
						},
						"left-top": {
							"position": "left-top",
							"adr": leftTopQuadrantADR,
							"revPar": leftTopQuadrantRevPar,
							"isLeftSide": true,
							"isDownSide": false
						},
						"left-bottom": {
							"position": "left-bottom",
							"adr": leftBottomAdr,
							"revPar": leftBottomRevPar,
							"isLeftSide": true,
							"isDownSide": true
						},
						"right-bottom": {
							"position": "right-bottom",
							"adr": rightBottomAdr,
							"revPar": rightBottomRevPar,
							"isLeftSide": false,
							"isDownSide": true
						}
					};
					/**  ****************************  Let Bottom Quadrant ******************************/


					var addMainLabelsOnGraph = function(label) {

						var xValue = label.isLeftSide ? -0.3 : 0;
						var rectYvalue = label.isDownSide ? -0.9 : 1;
						var textrectYvalue = label.isDownSide ? -0.95 : 0.95;

						var textLabelGroup = svg.append("g");

						textLabelGroup.append('rect')
							.attr("class", "rect-bars")
							.attr('x', x(xValue))
							.style("margin-right", "10px")
							.attr('y', y(rectYvalue))
							.attr('width', x(0.3) - x(0))
							.attr('height', y(0) - y(0.1))
							.attr("fill", "#6B6C6E")
							.style("fill-opacity", "0.8");

						textLabelGroup.append("text")
							.attr('x', x(xValue + 0.05))
							.attr('y', y(textrectYvalue))
							.style("font-size", "15px")
							.style("fill", "white")
							.text(label.text);
					};

					var chartMainLabels = [{
						"text": "YESTERDAY",
						"isLeftSide": true,
						"isDownSide": false
					}, {
						"text": "TODAY",
						"isLeftSide": false,
						"isDownSide": false
					}, {
						"text": "MTD",
						"isLeftSide": true,
						"isDownSide": true
					}, {
						"text": "YTD",
						"isLeftSide": false,
						"isDownSide": true
					}];

					_.each(chartMainLabels, function(mainLabel) {
						addMainLabelsOnGraph(mainLabel);
					});
				} catch (e) {
					console.log(e);
				}

				$scope.$emit('REFRESH_ANALTICS_SCROLLER');
				$scope.screenData.hideChartData = false;
			};
		}
	]);