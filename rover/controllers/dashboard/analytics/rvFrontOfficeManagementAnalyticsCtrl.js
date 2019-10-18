angular.module('sntRover')
    .controller('rvFrontOfficeManagementAnalyticsCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var arrivalsColorScheme = d3.scaleOrdinal()
                .range(["#B5D297", "#54792F", "#84B751"])
                .domain(["perfomed", "early_checkin", "remaining"]);

            var departuresColorScheme = d3.scaleOrdinal()
                .range(["#DBA1A1", "#AD2727", "#DC3535"])
                .domain(["perfomed", "late_checkout", "pending"]);

            var roomsColorScheme = d3.scaleOrdinal()
                .range(["#DC3535", "#EE931B", "#84B551", "#547A2F"])
                .domain(["dirty", "pickup", "clean", "inspected"]);

            var colorScheme = {
                arrivalsColorScheme: arrivalsColorScheme,
                roomsColorScheme: roomsColorScheme,
                departuresColorScheme: departuresColorScheme
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
                    .tickFormat(function(d) {
                        return d.toUpperCase();
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

                var maxValueInBotheDirections = chartDetails.min_val > chartDetails.max_val ?
                    chartDetails.min_val : chartDetails.max_val;

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

                svg.append("line") // attach a line
                    .style("stroke", "#000000") // colour the line
                    .style("stroke-width", "2px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", height) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", height);

                // Left side Legends
                var leftSideLegendDiv = d3.select("#left-side-legend");
                var leftSideLegendColor = d3.scaleOrdinal()
                    .range(["#C2D6AE", "#DE3636", "#ED9319", "#84B651", "#E29D9D"])
                    .domain(["Arrivals", "Dirty", "Pickup", "Clean", "Perfomed"]);

                var setMarginForLeftSideLegends = function(legend, singleLegendHeightPlusMargin) {
                    var yBandwidth = yScale.bandwidth();

                    if (legend === "Arrivals") {
                        return margin.top + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Dirty") {
                        return yBandwidth / 2 - singleLegendHeightPlusMargin + yInnerPadding;
                    } else if (legend === "Perfomed") {
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
                        return "left-legend-" + item.toLowerCase();
                    });

                leftSideLegendEntries.append("span")
                    .attr("class", "rect")
                    .style("background-color", leftSideLegendColor);

                leftSideLegendEntries.append("span")
                    .attr("class", "rect-label")
                    .html(function(label) {
                        return label;
                    });

                // TODO: For now lets assume all legends are of same height. So we will take one and use as reference.
                var singleLegendHeightPlusMargin = $("#left-legend-arrivals").height() + 10;

                leftSideLegendEntries.style("margin-top", function(legend) {
                    return setMarginForLeftSideLegends(legend, singleLegendHeightPlusMargin);
                });

                // right side legends
                var rightSideLegendDiv = d3.select("#right-side-legend");
                var rightSideLegendColor = d3.scaleOrdinal()
                    .range(["#84B652", "#83B450", "#567D30", "#AB2727", "#DC3535"])
                    .domain(["Early Check in", "Remaining", "Inspected", "Late checkout", "Pending"]);

                var setMarginForRightSideLegends = function(legend, singleLegendHeightPlusMargin) {
                    var yBandwidth = yScale.bandwidth();

                    if (legend === "Early Check in") {
                        return margin.top + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Inspected") {   
                        return yBandwidth / 2 - (singleLegendHeightPlusMargin * 2) + yInnerPadding + yBandwidth / 2;
                    } else if (legend === "Late checkout") {                        
                        return yBandwidth / 2 - singleLegendHeightPlusMargin + yInnerPadding + yBandwidth / 2;;
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
                        return "left-legend-" + item.toLowerCase();
                    });

                rightSideLegendEntries.append("span")
                    .attr("class", "rect")
                    .style("background-color", rightSideLegendColor);

                rightSideLegendEntries.append("span")
                    .attr("class", "rect-label")
                    .html(function(label) {
                        return label;
                    });

                rightSideLegendEntries.style("margin-top", function(legend) {
                    return setMarginForRightSideLegends(legend, singleLegendHeightPlusMargin);
                });
            };
        }
    ]);