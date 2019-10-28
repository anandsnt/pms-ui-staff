angular.module('sntRover')
    .controller('rvFrontOfficeManagementAnalyticsCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var arrivalsColorScheme = d3.scaleOrdinal()
                .range(["#ABD77B", "#4A9115", "#65D31B"])
                .domain(["perfomed", "early_checkin", "remaining"]);

            var departuresColorScheme = d3.scaleOrdinal()
                .range(["#E6987B", "#BB4119", "#E62711"])
                .domain(["perfomed", "late_checkout", "pending"]);

            var roomsColorScheme = d3.scaleOrdinal()
                .range(["#E62A13", "#FFA316", "#7FD726", "#448E13"])
                .domain(["dirty", "pickup", "clean", "inspected"]);

            var colorScheme = {
                arrivalsColorScheme: arrivalsColorScheme,
                roomsColorScheme: roomsColorScheme,
                departuresColorScheme: departuresColorScheme
            };

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
                    height = window.innerHeight * 2 / 3 - margin.top - margin.bottom;

                var yScale = d3.scaleBand()
                    .rangeRound([0, height + 10])
                    .padding(.3);

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
                    .tickFormat("");

                var svg = d3.select("#analytics-chart").append("svg")
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
                    .attr("class", "x axis")
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
                    colorScheme: colorScheme,
                    maxValue: maxValueInBotheDirections
                };

                rvAnalyticsHelperSrv.drawBarsOfBidirectonalChart(dataForDrawingBars);

                // Add extra Y axis to the middle of the graph
                svg.append("g")
                    .attr("class", "y axis inner")
                    .append("line")
                    .attr("x1", xScale(0))
                    .attr("x2", xScale(0))
                    .attr("y2", height);


                var topHorizontalLine = 0;

                svg.append("line") // attach a line
                    .style("stroke", "#A0A0A0") // colour the line
                    .style("stroke-width", "1px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", topHorizontalLine) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", topHorizontalLine);


                var firstLineHeight = 1.5 * yInnerPadding + yScale.bandwidth();

                svg.append("line") // attach a line
                    .style("stroke", "#A0A0A0") // colour the line
                    .style("stroke-width", "0.5px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", firstLineHeight) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", firstLineHeight);

                var secondLineHeight = 2.5 * yInnerPadding + 2 * yScale.bandwidth();

                svg.append("line") // attach a line
                    .style("stroke", "#A0A0A0") // colour the line
                    .style("stroke-width", "0.5px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", secondLineHeight) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", secondLineHeight);

                // svg.append("line") // attach a line
                //     .style("stroke", "#A0A0A0") // colour the line
                //     .style("stroke-width", "2px")
                //     .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                //     .attr("y1", height) // y position of the first end of the line
                //     .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                //     .attr("y2", height);

                if (maxValueInBotheDirections > 0) {
                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3/ 4))
                        .attr("y", 12.5)
                        .attr("dy", ".35em")
                        .style("font-size", "15px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("PERFOMED");

                    svg.append("text")
                        .attr("x", xScale(maxValueInBotheDirections / 4))
                        .attr("y", 12.5)
                        .attr("dy", ".35em")
                        .style("font-size", "15px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("REMAINING");

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3/ 4))
                        .attr("y", firstLineHeight + 12.5)
                        .attr("dy", ".35em")
                        .style("font-size", "15px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("VACANT NOT READY");

                    svg.append("text")
                        .attr("x", xScale(maxValueInBotheDirections / 4))
                        .attr("y", firstLineHeight + 12.5)
                        .attr("dy", ".35em")
                        .style("font-size", "15px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("VACANT READY");

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3/ 4))
                        .attr("y", secondLineHeight + 12.5)
                        .attr("dy", ".35em")
                        .style("font-size", "15px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("PERFOMED");

                    svg.append("text")
                        .attr("x", xScale(maxValueInBotheDirections / 4))
                        .attr("y", secondLineHeight + 12.5)
                        .attr("dy", ".35em")
                        .style("font-size", "15px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
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
            };
        }
    ]);