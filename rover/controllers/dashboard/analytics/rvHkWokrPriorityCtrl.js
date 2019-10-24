angular.module('sntRover')
    .controller('rvHkWokrPriorityCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var arrivalsColorScheme = d3.scaleOrdinal()
                .range(["#B5D297", "#54792F", "#84B751"])
                .domain(["perfomed", "early_checkin", "remaining"]);

            var vacantColorScheme = d3.scaleOrdinal()
                .range(["#DC3535", "#EE931B", "#84B551", "#547A2F"])
                .domain(["dirty", "pickup", "clean", "inspected"]);

            var departuresColorScheme = d3.scaleOrdinal()
                .range(["#DBA1A1", "#AD2727", "#DC3535"])
                .domain(["perfomed", "late_checkout", "pending"]);

            var colorScheme = {
                arrivalsColorScheme: arrivalsColorScheme,
                vacantColorScheme: vacantColorScheme,
                departuresColorScheme: departuresColorScheme
            };

            var cssClassMappings = {
                "Checked In": "bar bar-green bar-light",
                "Early Check in": "bar bar-green",
                "Remaining": "bar bar-green bar-light",

                "Dirty": "bar bar-orange",
                "Pickup": "bar bar-red",
                "Clean": "bar bar-green",
                "Inspected": "bar bar-green bar-dark",

                "Checked Out": "bar bar-red bar-light",
                "Late checkout": "bar bar-red",
                "Pending": "bar bar-soft-red"
            };

            $scope.drawHkWorkPriorityChart = function(chartDetails) {
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
                    .tickFormat(function() {
                        return "";
                    });

                var svg = d3.select("#analytics-chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("id", "d3-plot")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // DEBUGING CODE
                // chartDetails = rvAnalyticsHelperSrv.addRandomNumbersForTesting(chartDetails);

                chartDetails = rvAnalyticsHelperSrv.processBiDirectionalChart(chartDetails);

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

                // Left side Legends
                var leftSideLegendDiv = d3.select("#left-side-legend");
                var leftSideLegendColor = d3.scaleOrdinal()
                    .range(["#C2D6AE", "#DE3636", "#ED9319", "#84B651", "#E29D9D"])
                    .domain(["Checked In", "Dirty", "Pickup", "Clean", "Checked Out"]);

                var setMarginForLegends = function(legend, singleLegendHeightPlusMargin) {
                    var yBandwidth = yScale.bandwidth();

                    if (legend === "Checked In") {
                        return margin.top + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Dirty") {
                        return yBandwidth / 2 - singleLegendHeightPlusMargin + yInnerPadding;
                    } else if (legend === "Checked Out") {
                        var heightOfThreeLegends = singleLegendHeightPlusMargin * 3;

                        return yBandwidth - heightOfThreeLegends + yInnerPadding + yBandwidth / 2;
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
                            text = chartDetails.dirty_vacant_count;
                        } else if (label === "Pickup") {
                            text = chartDetails.pickup_vacant_count;
                        } else if (label === "Clean") {
                            text = chartDetails.clean_vacant_count;
                        } else if (label === "Checked Out") {
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
                    return setMarginForLegends(legend, singleLegendHeightPlusMargin);
                });

                // right side legends
                var rightSideLegendDiv = d3.select("#right-side-legend");
                var rightSideLegendColor = d3.scaleOrdinal()
                    .range(["#84B652", "#83B450", "#567D30", "#AB2727", "#DC3535"])
                    .domain(["Early Check in", "Remaining", "Inspected", "Late checkout", "Pending"]);

                var setMarginForRightLegends = function(legend) {
                    var yBandwidth = yScale.bandwidth();

                    if (legend === "Early Check in") {
                        return margin.top + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Inspected") {
                        var heightOfTwoLegends = singleLegendHeightPlusMargin * 2;
                        return yBandwidth / 2 - heightOfTwoLegends + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Late checkout") {
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
                            text = chartDetails.inspected_vacant_count;
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

                rightSideLegendEntries.style("margin-top", function(legend) {
                    return setMarginForRightLegends(legend);
                });
            };
        }
    ]);