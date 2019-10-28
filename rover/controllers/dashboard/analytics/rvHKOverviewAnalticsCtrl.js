angular.module('sntRover')
    .controller('rvHKOverviewAnalticsCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var arrivalsColorScheme = d3.scaleOrdinal()
                .range(['#ADD87E', '#81D828'])
                .domain(["perfomed", "remaining"]);

            var vacantColorScheme = d3.scaleOrdinal()
                .range(["#DC3535", "#EC9319", "#B7D599"])
                .domain(["dirty", "pickup", "clean"]);

            var departuresColorScheme = d3.scaleOrdinal()
                .range(['#E68E77', '#E62D13'])
                .domain(["perfomed", "pending"]);

            var stayoversColorScheme = d3.scaleOrdinal()
                .range(["#BED4E6", "#63AFE5"])
                .domain(["perfomed", "remaining"]);

            var roomsColorScheme = d3.scaleOrdinal()
                .range(["#60D318", "#3B890F", "#FFA716", "#E62A13"])
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

                /************************** DRAW HORIZONTAL LINES IN GRAPH ************************/

                var firstHorizontalLine = yScale.bandwidth() * 2.5;

                svg.append("line") // attach a line
                    .style("stroke", "#A0A0A0") // colour the line
                    .style("stroke-width", "1px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", firstHorizontalLine) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", firstHorizontalLine);

                var secondHorizontalLine = yScale.bandwidth() * 4.5;

                svg.append("line") // attach a line
                    .style("stroke", "#B1B1B1") // colour the line
                    .style("stroke-width", "2px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", secondHorizontalLine) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", secondHorizontalLine);

                var thirdHorizontalLine = yScale.bandwidth() * 6.5;

                svg.append("line") // attach a line
                    .style("stroke", "#A0A0A0") // colour the line
                    .style("stroke-width", "1px")
                    .attr("x1", xScale(-1 * maxValueInBotheDirections)) // x position of the first end of the line
                    .attr("y1", thirdHorizontalLine) // y position of the first end of the line
                    .attr("x2", xScale(maxValueInBotheDirections)) // x position of the second end of the line
                    .attr("y2", thirdHorizontalLine);

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

                /************************** LEFT LEGEND STARTS HERE ************************/

                var leftSideLegendDiv = d3.select("#left-side-legend");
                var yBandwidth = yScale.bandwidth();

                var arrivalsLeftLegendData = {
                    "title": "Arrivals",
                    "id": "arrivals-right-title-left",
                    "margin_top": margin.top + yBandwidth,
                    "items": [{
                        "id": "left-legend-arrivals",
                        "class": cssClassMappings["Checked In"],
                        "label": "Checked In",
                        "count": chartDetails.perfomed_arrivals_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, leftSideLegendDiv, arrivalsLeftLegendData);

                var singleLegendTitleHeightPlusMargin = $("#arrivals-right-title-left").height() + 10;
                var singleLegendItemHeightPlusMargin = $("#left-legend-arrivals").height() + 10;

                var departuresLeftLegendData = {
                    "title": "Departures",
                    "id": "departures-left-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "left-legend-departures",
                        "class": cssClassMappings["Checked Out"],
                        "label": "Checked Out",
                        "count": chartDetails.perfomed_departures_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, leftSideLegendDiv, departuresLeftLegendData);

                var stayOversLeftLegendData = {
                    "title": "Stayovers",
                    "id": "stayovers-left-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "left-legend-stayovers",
                        "class": cssClassMappings["Stays Dirty"],
                        "label": "Stays Clean",
                        "count": chartDetails.perfomed_stayovers_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, leftSideLegendDiv, stayOversLeftLegendData);


                var roomsLeftLegendData = {
                    "title": "Rooms",
                    "id": "rooms-right-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "left-legend-clean",
                        "class": cssClassMappings["Clean"],
                        "label": "Clean",
                        "count": chartDetails.clean_rooms_count
                    }, {
                        "id": "left-legend-pickup",
                        "class": cssClassMappings["Inspected"],
                        "label": "Inspected",
                        "count": chartDetails.inspected_rooms_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, leftSideLegendDiv, roomsLeftLegendData);

                /************************** LEFT LEGEND END HERE ************************/

                /************************** RIGHT LEGEND STARTS HERE ************************/

                var rightSideLegendDiv = d3.select("#right-side-legend");

                var yBandwidth = yScale.bandwidth();
                var arrivalsRightLegendData = {
                    "title": "Arrivals",
                    "id": "arrivals-right-title",
                    "margin_top": margin.top + yBandwidth,
                    "items": [{
                        "id": "right-legend-arrivals",
                        "class": cssClassMappings["Arrivals"],
                        "label": "Arrivals",
                        "count": chartDetails.remaining_arrivals_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, rightSideLegendDiv, arrivalsRightLegendData);

                var departuresRightLegendData = {
                    "title": "Departures",
                    "id": "departures-right-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "right-legend-departures",
                        "class": cssClassMappings["Departures"],
                        "label": "Departures",
                        "count": chartDetails.pending_departures_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, rightSideLegendDiv, departuresRightLegendData);

                var stayOversLegendData = {
                    "title": "Stayovers",
                    "id": "departures-right-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "right-legend-stayovers",
                        "class": cssClassMappings["Stays Dirty"],
                        "label": "Stays Dirty",
                        "count": chartDetails.remaining_stayovers_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, rightSideLegendDiv, stayOversLegendData);

                var roomsLegendData = {
                    "title": "Rooms",
                    "id": "rooms-right-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "right-legend-dirty",
                        "class": cssClassMappings["Dirty"],
                        "label": "Dirty",
                        "count": chartDetails.dirty_rooms_count
                    }, {
                        "id": "right-legend-pickup",
                        "class": cssClassMappings["Pickup"],
                        "label": "Pickup",
                        "count": chartDetails.pickup_rooms_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, rightSideLegendDiv, roomsLegendData);

                /************************** RIGHT LEGEND ENDS HERE ************************/
            };
        }
    ]);