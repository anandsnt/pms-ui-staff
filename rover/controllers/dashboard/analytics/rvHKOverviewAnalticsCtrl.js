angular.module('sntRover')
    .controller('rvHKOverviewAnalticsCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var legendColorMappings = {
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

            var colorMappings = {
                "arrivals_perfomed": rvAnalyticsHelperSrv.gradientMappings['greenLight'],
                "arrivals_remaining": rvAnalyticsHelperSrv.gradientMappings['green'],
                "departures_perfomed": rvAnalyticsHelperSrv.gradientMappings['redLight'],
                "departures_pending": rvAnalyticsHelperSrv.gradientMappings['red'],
                "stayovers_perfomed": rvAnalyticsHelperSrv.gradientMappings['blueLight'],
                "stayovers_remaining" : rvAnalyticsHelperSrv.gradientMappings['blue'],
                "rooms_clean": rvAnalyticsHelperSrv.gradientMappings['green'],
                "rooms_inspected": rvAnalyticsHelperSrv.gradientMappings['greenDark'],
                "rooms_dirty": rvAnalyticsHelperSrv.gradientMappings['red'],
                "rooms_pickup":rvAnalyticsHelperSrv.gradientMappings['orange']
            };

            $scope.drawHkOverviewChart = function(chartDetails) {

                $scope.screenData.mainHeading = $filter('translate')(chartDetails.chartData.label);
                var chartAreaWidth = document.getElementById("analytics-chart").clientWidth;
                var margin = {
                        top: 50,
                        right: 50,
                        bottom: 30,
                        left: 50
                    },
                    width = chartAreaWidth - margin.left - margin.right,
                    maxHeight = 500,
                    calculatedHeight = window.innerHeight * (1 / 2 + 2 / 3) / 2 - margin.top - margin.bottom,
                    height = calculatedHeight > maxHeight ? maxHeight : calculatedHeight;

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
                        return (d < 0) ? (d * -1) : d === 0 ? "" : d;
                    })
                    .tickPadding(15);

                var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5)
                    .tickSizeOuter(0)
                    .tickPadding(10)
                    .tickFormat(function() {
                        return "";
                    });

                var svg = d3.select("#d3-plot").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
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
                    maxValue: maxValueInBotheDirections,
                    onBarChartClick: chartDetails.onBarChartClick,
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

                /************************** DRAW HORIZONTAL LINES IN GRAPH ************************/

                var horizontalRectWidths = xScale(maxValueInBotheDirections) - xScale(-1 * maxValueInBotheDirections) + 2 * xScale(50);
                var lineXOffset = xScale(-1 * (maxValueInBotheDirections + 50));
                var rectCommonAttrs = {
                    svg: svg,
                    xOffset: lineXOffset,
                    height: 4,
                    width: horizontalRectWidths
                };

                // first line 
                rvAnalyticsHelperSrv.drawRectLines(_.extend(rectCommonAttrs, {
                    yOffset: 0
                }));
                // second line
                rvAnalyticsHelperSrv.drawRectLines(_.extend(rectCommonAttrs, {
                    yOffset: yScale.bandwidth() * 2.5
                }));
                // third line
                rvAnalyticsHelperSrv.drawRectLines(_.extend(rectCommonAttrs, {
                    yOffset: yScale.bandwidth() * 4.5
                }));
                // fourth line
                rvAnalyticsHelperSrv.drawRectLines(_.extend(rectCommonAttrs, {
                    yOffset: yScale.bandwidth() * 6.5
                }));
                // fifth line
                rvAnalyticsHelperSrv.drawRectLines(_.extend(rectCommonAttrs, {
                    yOffset: height - 3
                }));

                /************************** DRAW HORIZONTAL LINES IN GRAPH ENDS ************************/

                if (maxValueInBotheDirections > 0) {

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3 / 4))
                        .attr("y", -20)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("Perfomed");

                    svg.append("text")
                        .attr("x", xScale(maxValueInBotheDirections / 4))
                        .attr("y", -20)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("Remaining");
                }

                /************************** LEFT LEGEND STARTS HERE ************************/

                var leftSideLegendDiv = d3.select("#left-side-legend");
                var yBandwidth = yScale.bandwidth();
                var leftLegendCommonData = {
                    cssClassMappings: legendColorMappings,
                    parentElement: leftSideLegendDiv,
                    onLegendClick: chartDetails.onLegendClick
                };

                // ARRIVALS LEFT LEGEND
                var arrivalsLeftLegendData = {
                    "title": "Arrivals",
                    "id": "arrivals-right-title-left",
                    "margin_top": margin.top + yBandwidth,
                    "items": [{
                        "id": "left-legend-arrivals",
                        "class": legendColorMappings["Checked In"],
                        "label": "Checked In",
                        "count": chartDetails.perfomed_arrivals_count
                    }]
                };

                try {
                rvAnalyticsHelperSrv.addLegendItemsToChart(_.extend(leftLegendCommonData, {
                    legendData: arrivalsLeftLegendData
                }));

            } catch(e){
                console.log(e)
            }
                //rvAnalyticsHelperSrv.addLegendItems(legendColorMappings, leftSideLegendDiv, arrivalsLeftLegendData);

                var singleLegendTitleHeightPlusMargin = $("#arrivals-right-title-left").height() + 10;
                var singleLegendItemHeightPlusMargin = $("#left-legend-arrivals").height() + 10;

                // DEPARTURES LEFT LEGEND
                var departuresLeftLegendData = {
                    "title": "Departures",
                    "id": "departures-left-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "left-legend-departures",
                        "class": legendColorMappings["Checked Out"],
                        "label": "Checked Out",
                        "count": chartDetails.perfomed_departures_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(legendColorMappings, leftSideLegendDiv, departuresLeftLegendData);

                // STAYOVERS LEFT LEGEND
                var stayOversLeftLegendData = {
                    "title": "Stayovers",
                    "id": "stayovers-left-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "left-legend-stayovers",
                        "class": legendColorMappings["Stays Dirty"],
                        "label": "Stays Clean",
                        "count": chartDetails.perfomed_stayovers_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(legendColorMappings, leftSideLegendDiv, stayOversLeftLegendData);

                // ROOMS LEFT LEGEND
                var roomsLeftLegendData = {
                    "title": "Rooms",
                    "id": "rooms-right-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "left-legend-clean",
                        "class": legendColorMappings["Clean"],
                        "label": "Clean",
                        "count": chartDetails.clean_rooms_count
                    }, {
                        "id": "left-legend-pickup",
                        "class": legendColorMappings["Inspected"],
                        "label": "Inspected",
                        "count": chartDetails.inspected_rooms_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(legendColorMappings, leftSideLegendDiv, roomsLeftLegendData);

                /************************** LEFT LEGEND END HERE ************************/

                /************************** RIGHT LEGEND STARTS HERE ************************/

                var rightSideLegendDiv = d3.select("#right-side-legend");

                // ARRIVALS RIGHT LEGEND
                var arrivalsRightLegendData = {
                    "title": "Arrivals",
                    "id": "arrivals-right-title",
                    "margin_top": margin.top + yBandwidth,
                    "items": [{
                        "id": "right-legend-arrivals",
                        "class": legendColorMappings["Arrivals"],
                        "label": "Arrivals",
                        "count": chartDetails.remaining_arrivals_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(legendColorMappings, rightSideLegendDiv, arrivalsRightLegendData);

                // DEPARTURES RIGHT LEGEND
                var departuresRightLegendData = {
                    "title": "Departures",
                    "id": "departures-right-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "right-legend-departures",
                        "class": legendColorMappings["Departures"],
                        "label": "Departures",
                        "count": chartDetails.pending_departures_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(legendColorMappings, rightSideLegendDiv, departuresRightLegendData);

                // STAYOVERS RIGHT LEGEND
                var stayOversLegendData = {
                    "title": "Stayovers",
                    "id": "departures-right-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "right-legend-stayovers",
                        "class": legendColorMappings["Stays Dirty"],
                        "label": "Stays Dirty",
                        "count": chartDetails.remaining_stayovers_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(legendColorMappings, rightSideLegendDiv, stayOversLegendData);

                // ROOMS RIGHT LEGEND
                var roomsLegendData = {
                    "title": "Rooms",
                    "id": "rooms-right-title",
                    "margin_top": 2 * yBandwidth -
                        (singleLegendTitleHeightPlusMargin + singleLegendItemHeightPlusMargin),
                    "items": [{
                        "id": "right-legend-dirty",
                        "class": legendColorMappings["Dirty"],
                        "label": "Dirty",
                        "count": chartDetails.dirty_rooms_count
                    }, {
                        "id": "right-legend-pickup",
                        "class": legendColorMappings["Pickup"],
                        "label": "Pickup",
                        "count": chartDetails.pickup_rooms_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(legendColorMappings, rightSideLegendDiv, roomsLegendData);

                /************************** RIGHT LEGEND ENDS HERE ************************/

                $scope.$emit('REFRESH_ANALTICS_SCROLLER');
                $scope.screenData.hideChartData = false;
            };
        }
    ]);