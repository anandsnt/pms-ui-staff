angular.module('sntRover')
    .controller('rvHKOverviewAnalticsCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var arrivalsColorScheme = d3.scaleOrdinal()
                // .range(["#B5D398", "#84B652", "#B7D599"])
                .range(['#98D371', '#84B652'])
                .domain(["perfomed", "remaining"]);

            var vacantColorScheme = d3.scaleOrdinal()
                .range(["#DC3535", "#EC9319", "#B7D599"])
                .domain(["dirty", "pickup", "clean"]);

            var departuresColorScheme = d3.scaleOrdinal()
                // .range(["#DBA1A2", "#E13939"])
                .range(['#E57F70', '#E42012'])
                .domain(["perfomed", "pending"]);

            var stayoversColorScheme = d3.scaleOrdinal()
                // .range(["#BBE0ED", "#7FBED7"])
                .range(["#C7DCE5", "#7FBED7"])
                .domain(["perfomed", "remaining"]);

            var roomsColorScheme = d3.scaleOrdinal()
                // .range(["#84B652", "#557B30", "#EA9219", "#DF3635"])
                .range(["#6DD420", "#408B10", "#FF920F", "#E44B1C"])
                .domain(["clean", "inspected", "pickup", "dirty"]);

            var colorScheme = {
                arrivalsColorScheme: arrivalsColorScheme,
                vacantColorScheme: vacantColorScheme,
                departuresColorScheme: departuresColorScheme,
                roomsColorScheme: roomsColorScheme,
                stayoversColorScheme: stayoversColorScheme
            };

            var cssClassMappings = {
                "Checked In": "bar bar-green bar-light",
                "Arrivals": "bar bar-green",

                "Checked Out": "bar bar-red bar-light",
                "Departures": "bar bar-red",

                "Stays Clean": "bar bar-blue bar-light",
                "Stays Dirty": "bar bar-blue",

                "Clean": "bar bar-green",
                "Inspected": "bar bar-green bar-dark",
                "Dirty": "bar bar-red",
                "Pickup": "bar bar-orange"
            };

            $scope.drawHkOverviewChart = function(chartDetails) {

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
                console.log(chartDetails);

                var maxValueInBotheDirections = chartDetails.maxValueInOneSide;

                // set scales for x axis
                xScale.domain([-1 * maxValueInBotheDirections, maxValueInBotheDirections]).nice();
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


                var dataForDrawingBars = {          
                    svg: svg,
                    yScale: yScale,
                    xScale: xScale,
                    chartDetails: chartDetails,
                    colorScheme: colorScheme,
                    maxValue: maxValueInBotheDirections,
                    // cssClassMappings: cssClassMappings,
                    onBarChartClick: chartDetails.onBarChartClick
                };

                        
                rvAnalyticsHelperSrv.drawBarsOfBidirectonalChart(dataForDrawingBars);

                // Add extra Y axis to the middle of the graph
                svg.append("g")
                    .attr("class", "y axis inner")
                    .append("line")
                    .attr("x1", xScale(0))
                    .attr("x2", xScale(0))
                    .attr("y2", height);

                var firstLineHeight = yScale.bandwidth() * 2.5;

                svg.append("line") // attach a line
                    .style("stroke", "#A0A0A0") // colour the line
                    .style("stroke-width", "1px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", firstLineHeight) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", firstLineHeight);

                var firstLineHeight1 = yScale.bandwidth() * 4.5;

                svg.append("line") // attach a line
                    .style("stroke", "#B1B1B1") // colour the line
                    .style("stroke-width", "2px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", firstLineHeight1) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", firstLineHeight1);

                var firstLineHeight2 = yScale.bandwidth() * 6.5;

                svg.append("line") // attach a line
                    .style("stroke", "#A0A0A0") // colour the line
                    .style("stroke-width", "1px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", firstLineHeight2) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", firstLineHeight2);

                // Left side Legends
                var leftSideLegendDiv = d3.select("#left-side-legend");
                var leftSideLegendColor = d3.scaleOrdinal()
                    .range(["#b7d499", "#dba2a2", "#bbe0ee", "#85b752", "#547a2f"])
                    .domain(["Checked In", "Checked Out", "Stays Clean", "Clean", "Inspected"]);

                var setMarginForLegends = function(legend, singleLegendHeightPlusMargin) {
                    var yBandwidth = yScale.bandwidth();

                    if (legend === "Checked In") {
                        return margin.top + 1.5 * yBandwidth;
                    } else if (legend === "Checked Out" || legend === "Stays Clean" || legend === "Clean") {
                        return (2 * yBandwidth - singleLegendHeightPlusMargin);
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
                        } else if (label === "Checked Out") {
                            text = chartDetails.perfomed_departures_count;
                        } else if (label === "Stays Clean") {
                            text = chartDetails.perfomed_stayovers_count;
                        } else if (label === "Clean") {
                            text = chartDetails.clean_rooms_count;
                        } else if (label === "Inspected") {
                            text = chartDetails.inspected_rooms_count;
                        }
                        return text;
                    });
                // .style("background-color", leftSideLegendColor);

                leftSideLegendEntries.append("span")
                    .attr("class", "bar-label")
                    .html(function(label) {
                        return label;
                    });

                if (maxValueInBotheDirections > 0) {
                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections / 2))
                        .attr("y", -20)
                        .attr("dy", ".35em")
                        .style("font-size", "20px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("PERFOMED");

                    svg.append("text")
                        .attr("x", xScale(maxValueInBotheDirections / 2))
                        .attr("y", -20)
                        .attr("dy", ".35em")
                        .style("font-size", "20px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("REMAINING");
                }
               

                // TODO: For now lets assume all legends are of same height. So we will take one and use as reference.
                var singleLegendHeightPlusMargin = $("#left-legend-checked-in").height() + 10;

                leftSideLegendEntries.style("margin-top", function(legend) {
                    return setMarginForLegends(legend, singleLegendHeightPlusMargin);
                });

                // right side legends
                var rightSideLegendDiv = d3.select("#right-side-legend");
                var rightSideLegendColor = d3.scaleOrdinal()
                    .range(["#84b652", "#e13939", "#7cbad3", "#de3838", "#ed941a"])
                    .domain(["Arrivals", "Departures", "Stays Dirty", "Dirty", "Pickup"]);

                var setMarginForRightSideLegends = function(legend, singleLegendHeightPlusMargin) {
                    var yBandwidth = yScale.bandwidth();

                    if (legend === "Arrivals") {
                        return margin.top + 1.5 * yBandwidth;
                    } else if (legend === "Departures" || legend === "Stays Dirty" || legend === "Dirty") {
                        return (2 * yBandwidth - singleLegendHeightPlusMargin);
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

                        if (label === "Arrivals") {
                            text = chartDetails.remaining_arrivals_count;
                        } else if (label === "Departures") {
                            text = chartDetails.pending_departures_count;
                        } else if (label === "Stays Dirty") {
                            text = chartDetails.remaining_stayovers_count;
                        } else if (label === "Pickup") {
                            text = chartDetails.pickup_rooms_count;
                        } else if (label === "Dirty") {
                            text = chartDetails.dirty_rooms_count;
                        }
                        return text;
                    });

                rightSideLegendEntries.append("span")
                    .attr("class", "bar-label")
                    .html(function(label) {
                        return label;
                    });

                rightSideLegendEntries.style("margin-top", function(legend) {
                    return setMarginForRightSideLegends(legend, singleLegendHeightPlusMargin);
                });
            };
        }
    ]);