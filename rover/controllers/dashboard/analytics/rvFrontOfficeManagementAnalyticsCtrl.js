angular.module('sntRover')
    .controller('rvFrontOfficeManagementAnalyticsCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var cssClassMappings = {
                "Checked In": "bar bar-green bar-light",
                "Early Check in": "bar bar-green bar-dark",
                "Remaining": "bar bar-green",

                "Checked out": "bar bar-red bar-light",
                "Late checkout": "bar bar-red bar-dark",
                "Pending": "bar bar-red",

                "Clean": "bar bar-green",
                "Inspected": "bar bar-green bar-dark",
                "Dirty": "bar bar-red",
                "Pickup": "bar bar-orange"
            };

            var colorMappings = {
                "arrivals_perfomed": {
                    "legend_class": "bar bar-green bar-light",
                    "fill": "greenLight",
                    "onmouseover_fill": "greenLightHover",
                    "onmouseout_fill": "greenLight"
                },
                "arrivals_early_checkin": {
                    "legend_class": "bar bar-green bar-dark",
                    "fill": "greenDark",
                    "onmouseover_fill": "greenDarkHover",
                    "onmouseout_fill": "greenDark"
                },
                "arrivals_remaining": {
                    "legend_class": "bar bar-green",
                    "fill": "green",
                    "onmouseover_fill": "greenHover",
                    "onmouseout_fill": "green"
                },
                "departures_perfomed": {
                    "legend_class": "bar bar-red bar-light",
                    "fill": "redLight",
                    "onmouseover_fill": "redLightHover",
                    "onmouseout_fill": "redLight"
                },
                "departures_pending": {
                    "legend_class": "bar bar-red",
                    "fill": "red",
                    "onmouseover_fill": "redHover",
                    "onmouseout_fill": "red"
                },
                "departures_late_checkout": {
                    "legend_class": "bar bar-red bar-dark",
                    "fill": "redDark",
                    "onmouseover_fill": "redDarkHover",
                    "onmouseout_fill": "redDark"
                },
                "rooms_clean": {
                    "legend_class": "bar bar-green",
                    "fill": "green",
                    "onmouseover_fill": "greenHover",
                    "onmouseout_fill": "green"
                },
                "rooms_inspected": {
                    "legend_class": "bar bar-green bar-dark",
                    "fill": "greenDark",
                    "onmouseover_fill": "greenDarkHover",
                    "onmouseout_fill": "greenDark"
                },
                "rooms_dirty": {
                    "legend_class": "bar bar-red",
                    "fill": "red",
                    "onmouseover_fill": "redHover",
                    "onmouseout_fill": "red"
                },
                "rooms_pickup": {
                    "legend_class": "bar bar-orange",
                    "fill": "orange",
                    "onmouseover_fill": "orangeHover",
                    "onmouseout_fill": "orange"
                }
            };

            $scope.drawArrivalManagementChart = function(chartDetails) {
                $scope.screenData.mainHeading = $filter('translate')(chartDetails.chartData.label);
                var chartAreaWidth = document.getElementById("analytics-chart").clientWidth;
                var margin = {
                        top: 50,
                        right: 20,
                        bottom: 30,
                        left: 150
                    },
                    width = chartAreaWidth - margin.left - margin.right,
                    maxHeight = 500,
                    calculatedHeight = window.innerHeight * (1 / 2 + 2 / 3) / 2 - margin.top - margin.bottom,
                    height = calculatedHeight > maxHeight ? maxHeight : calculatedHeight;

                var yScale = d3.scaleBand()
                    .rangeRound([0, height + 10])
                    .padding(.4);

                var xScale = d3.scaleLinear()
                    .rangeRound([0, width]);

                var xAxis = d3.axisBottom()
                    .scale(xScale)
                    .tickSizeOuter(0)
                    .ticks(10)
                    .tickSizeInner(-height)
                    .tickFormat(function(d) {
                        // X axis... treat -ve values as positive
                        return (d < 0) ? (d * -1) : d === 0 ? "" : d;
                    });

                var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5)
                    .tickSizeOuter(0)
                    .tickPadding(10)
                    .tickFormat("");

                var svg = d3.select("#d3-plot").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("id", "d3-plot")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // DEBUGING CODE
                // chartDetails = rvAnalyticsHelperSrv.addRandomNumbersForTesting(chartDetails);

                chartDetails = rvAnalyticsHelperSrv.processBiDirectionalChart(chartDetails);
                console.log(chartDetails);

                var maxValueInBotheDirections = chartDetails.maxValueInOneSide;

                // set scales for x axis
                xScale.domain([-1 * maxValueInBotheDirections, maxValueInBotheDirections]).nice();
                yScale.domain(chartDetails.chartData.data.map(function(chart) {
                    return chart.type;
                }));

                var yInnerPadding = (height - yScale.bandwidth() * 3) / 4;

                // Add x axis
                svg.append("g")
                    .attr("class", "x axis bottom-axis")
                    .attr("id", "bottom-axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                // Add left side axis
                svg.append("g")
                    .style("font-size", "18px")
                    .attr("class", "y axis left-most")
                    .call(yAxis);

                var dataForDrawingBars = {
                    svg: svg,
                    yScale: yScale,
                    xScale: xScale,
                    chartDetails: chartDetails,
                    // colorScheme: colorScheme,
                    maxValue: maxValueInBotheDirections,
                    colorMappings: colorMappings
                };

                rvAnalyticsHelperSrv.drawBarChart(dataForDrawingBars);

                // Add extra Y axis to the middle of the graph
                svg.append("g")
                    .append("rect")
                    .attr("class", "chart-breakpoint-line")
                    .attr("x", xScale(0))
                    .attr("y", -40)
                    .attr("height", height + margin.top + 40)
                    .attr("width", 4);


                var topHorizontalLine = 0;
                var horizontalRectWidths = xScale(maxValueInBotheDirections) - xScale(-1 * maxValueInBotheDirections) + 2 * xScale(50);
                var lineXOffset = xScale(-1 * (maxValueInBotheDirections + 50));

                svg.append("g")
                    .append("rect")
                    .attr("class", "chart-breakpoint-line")
                    .attr("x", lineXOffset)
                    .attr("y", topHorizontalLine)
                    .attr("height", 4)
                    .attr("width", horizontalRectWidths);

                var firstLineHeight = 1.5 * yInnerPadding + yScale.bandwidth();

                svg.append("g")
                    .append("rect")
                    .attr("class", "chart-breakpoint-line")
                    .attr("x", lineXOffset)
                    .attr("y", firstLineHeight)
                    .attr("height", 4)
                    .attr("width", horizontalRectWidths);

                var secondLineHeight = 2.5 * yInnerPadding + 2 * yScale.bandwidth();

                svg.append("g")
                    .append("rect")
                    .attr("class", "chart-breakpoint-line")
                    .attr("x", lineXOffset)
                    .attr("y", secondLineHeight)
                    .attr("height", 4)
                    .attr("width", horizontalRectWidths);

                var finalHorizontalLine = height - 3;

                svg.append("g")
                    .append("rect")
                    .attr("class", "chart-breakpoint-line")
                    .attr("x", lineXOffset)
                    .attr("y", finalHorizontalLine)
                    .attr("height", 3)
                    .attr("width", horizontalRectWidths);

                if (maxValueInBotheDirections > 0) {

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3 / 4))
                        .attr("y", 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("PERFORMED");

                    svg.append("text")
                        .attr("x", xScale(maxValueInBotheDirections / 4))
                        .attr("y", 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("REMAINING");

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3 / 4))
                        .attr("y", firstLineHeight + 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("VACANT NOT READY");

                    svg.append("text")
                        .attr("x", xScale(maxValueInBotheDirections / 4))
                        .attr("y", firstLineHeight + 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("VACANT READY");

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3 / 4))
                        .attr("y", secondLineHeight + 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("PERFORMED");

                    svg.append("text")
                        .attr("x", xScale(maxValueInBotheDirections / 4))
                        .attr("y", secondLineHeight + 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("REMAINING");
                }

                // Left side Legends
                var leftSideLegendDiv = d3.select("#left-side-legend");
                var leftSideLegendColor = d3.scaleOrdinal()
                    .range(["#C2D6AE", "#DE3636", "#ED9319", "#84B651", "#E29D9D"])
                    .domain(["Checked In", "Dirty", "Pickup", "Clean", "Checked out"]);

                var setMarginForLeftSideLegends = function(legend, singleLegendHeightPlusMargin) {
                    var yBandwidth = yScale.bandwidth();

                    if (legend === "Checked In") {
                        return margin.top + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Dirty") {
                        return yBandwidth / 2 - singleLegendHeightPlusMargin + yInnerPadding;
                    } else if (legend === "Checked out") {
                        var marginTopOfPerfomed = yBandwidth - (singleLegendHeightPlusMargin * 3) + yInnerPadding + yBandwidth / 2;

                        return marginTopOfPerfomed;
                    }
                };

                var leftSideLegendEntries = leftSideLegendDiv.selectAll("dd")
                    .data(leftSideLegendColor.domain().slice())
                    .enter()
                    .append("dd")
                    .attr("class", "legend-item")
                    .attr("id", function(item) {
                        var itemName = item.replace(' ', '-');

                        return "left-legend-" + itemName.toLowerCase();
                    });

                leftSideLegendEntries.append("span")
                    .attr("class", function(label) {
                        return cssClassMappings[label];
                    })
                    .html(function(label) {
                        var text;

                        if (label === "Checked In") {
                            text = chartDetails.perfomed_arrivals_count;
                        } else if (label === "Dirty") {
                            text = chartDetails.dirty_rooms_count;
                        } else if (label === "Pickup") {
                            text = chartDetails.pickup_rooms_count;
                        } else if (label === "Clean") {
                            text = chartDetails.clean_rooms_count;
                        } else if (label === "Checked out") {
                            text = chartDetails.perfomed_departures_count;
                        }
                        return text;
                    });

                leftSideLegendEntries.append("span")
                    .attr("class", "bar-label")
                    .html(function(label) {
                        return label;
                    });

                // TODO: For now lets assume all legends are of same height. So we will take one and use as reference.
                var singleLegendHeightPlusMargin = $("#left-legend-checked-in").height() + 10;

                leftSideLegendEntries.style("margin-top", function(legend) {
                    return setMarginForLeftSideLegends(legend, singleLegendHeightPlusMargin);
                });

                // right side legends
                var rightSideLegendDiv = d3.select("#right-side-legend");
                var rightSideLegendColor = d3.scaleOrdinal()
                    .range(["#557A2F", "#83B450", "#567D30", "#DC3535", "#AB2727"])
                    .domain(["Early Check in", "Remaining", "Inspected", "Pending", "Late checkout"]);

                var setMarginForRightSideLegends = function(legend, singleLegendHeightPlusMargin) {
                    var yBandwidth = yScale.bandwidth();

                    if (legend === "Early Check in") {
                        return margin.top + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Inspected") {
                        return yBandwidth / 2 - (singleLegendHeightPlusMargin * 2) + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Pending") {
                        return yBandwidth / 2 - singleLegendHeightPlusMargin + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Pickup") {
                        return 2 * yBandwidth - singleLegendHeightPlusMargin;
                    }
                };
                var rightSideLegendEntries = rightSideLegendDiv.selectAll("dd")
                    .data(rightSideLegendColor.domain().slice())
                    .enter()
                    .append("dd")
                    .attr("class", "legend-item")
                    .attr("id", function(item) {
                        var itemName = item.replace(' ', '-');

                        return "right-legend-" + itemName.toLowerCase();
                    });

                rightSideLegendEntries.append("span")
                    .attr("class", function(label) {
                        return cssClassMappings[label];
                    })
                    .html(function(label) {
                        var text;

                        if (label === "Early Check in") {
                            text = chartDetails.early_checkin_arrivals_count;
                        } else if (label === "Remaining") {
                            text = chartDetails.remaining_arrivals_count;
                        } else if (label === "Inspected") {
                            text = chartDetails.inspected_rooms_count;
                        } else if (label === "Late checkout") {
                            text = chartDetails.late_checkout_departures_count;
                        } else if (label === "Pending") {
                            text = chartDetails.pending_departures_count;
                        }
                        return text;
                    });

                rightSideLegendEntries.append("span")
                    .attr("class", "bar-label")
                    .html(function(label) {
                        return label;
                    });

                $("#right-side-legend").css({
                    'margin-top': '0px'
                });

                rightSideLegendEntries.style("margin-top", function(legend) {
                    return setMarginForRightSideLegends(legend, singleLegendHeightPlusMargin);
                });

                $scope.$emit('REFRESH_ANALTICS_SCROLLER');
                $scope.screenData.hideChartData = false;
            };
        }
    ]);
