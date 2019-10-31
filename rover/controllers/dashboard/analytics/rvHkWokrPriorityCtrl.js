angular.module('sntRover')
    .controller('rvHkWokrPriorityCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var cssClassMappings = {
                "Checked In": "bar bar-green bar-light",
                "Early Check in": "bar bar-green bar-dark",
                "Remaining": "bar bar-green",

                "Checked Out": "bar bar-red bar-light",
                "Late checkout": "bar bar-red bar-dark",
                "Pending": "bar bar-red",

                "Dirty": "bar bar-red",
                "Pickup": "bar bar-orange",
                "Clean": "bar bar-green",
                "Inspected": "bar bar-green bar-dark"
            };

            var colorMappings = {
                "arrivals_perfomed": rvAnalyticsHelperSrv.gradientMappings['greenLight'],
                "arrivals_early_checkin": rvAnalyticsHelperSrv.gradientMappings['greenDark'],
                "arrivals_remaining": rvAnalyticsHelperSrv.gradientMappings['green'],

                "departures_perfomed": rvAnalyticsHelperSrv.gradientMappings['redLight'],
                "departures_pending": rvAnalyticsHelperSrv.gradientMappings['red'],
                "departures_late_checkout": rvAnalyticsHelperSrv.gradientMappings['redDark'],

                "vacant_clean": rvAnalyticsHelperSrv.gradientMappings['green'],
                "vacant_inspected": rvAnalyticsHelperSrv.gradientMappings['greenDark'],
                "vacant_dirty": rvAnalyticsHelperSrv.gradientMappings['red'],
                "vacant_pickup": rvAnalyticsHelperSrv.gradientMappings['orange']
            };

            $scope.drawHkWorkPriorityChart = function(chartDetails) {
                $scope.screenData.mainHeading = $filter('translate')(chartDetails.chartData.label);
                var chartAreaWidth = document.getElementById("analytics-chart").clientWidth;
                var margin = {
                        top: 50,
                        right: 20,
                        bottom: 30,
                        left: 50
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
                    .tickFormat(function() {
                        return "";
                    });

                var svg = d3.select("#d3-plot").append("svg")
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
                var secondHorizontalLineYoffset = 1.5 * yInnerPadding + yScale.bandwidth();

                // second line
                rvAnalyticsHelperSrv.drawRectLines(_.extend(rectCommonAttrs, {
                    yOffset: secondHorizontalLineYoffset
                }));

                var thirdHorizontalLineYoffset = 2.5 * yInnerPadding + 2 * yScale.bandwidth();

                // third line
                rvAnalyticsHelperSrv.drawRectLines(_.extend(rectCommonAttrs, {
                    yOffset: thirdHorizontalLineYoffset
                }));
                // fourth line
                rectCommonAttrs.height = 3;
                rvAnalyticsHelperSrv.drawRectLines(_.extend(rectCommonAttrs, {
                    yOffset: height - 3
                }));

                /************************** DRAW HORIZONTAL LINES IN GRAPH ENDS ************************/

                if (maxValueInBotheDirections > 0) {
                    var textOffset = xScale(-1 * maxValueInBotheDirections);

                    svg.append("text")
                        .attr("x", textOffset)
                        .attr("y", 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("ARRIVALS");

                    svg.append("text")
                        .attr("x", textOffset)
                        .attr("y", secondHorizontalLineYoffset + 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("VACANT");

                    svg.append("text")
                        .attr("x", textOffset)
                        .attr("y", thirdHorizontalLineYoffset + 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("DEPARTURES");
                }

                /************************** LEFT LEGEND STARTS HERE ************************/

                var leftSideLegendDiv = d3.select("#left-side-legend");
                var yBandwidth = yScale.bandwidth();

                var arrivalsLeftLegendData = {
                    "title": "Arrivals",
                    "id": "arrivals-right-title-left",
                    "margin_top": secondHorizontalLineYoffset - yInnerPadding / 2 - yBandwidth / 2,
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

                var vacantLeftLegendData = {
                    "title": "Vacant",
                    "id": "vacant-left-title",
                    "margin_top": yBandwidth - singleLegendTitleHeightPlusMargin,
                    "items": [{
                        "id": "left-legend-dirty",
                        "class": cssClassMappings["Dirty"],
                        "label": "Dirty",
                        "count": chartDetails.dirty_vacant_count
                    }, {
                        "id": "left-legend-pickup",
                        "class": cssClassMappings["Pickup"],
                        "label": "Pickup",
                        "count": chartDetails.pickup_vacant_count
                    }, {
                        "id": "left-legend-clean",
                        "class": cssClassMappings["Clean"],
                        "label": "Clean",
                        "count": chartDetails.clean_vacant_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, leftSideLegendDiv, vacantLeftLegendData);
                var calculatedMarginTop = yBandwidth - 3 * singleLegendTitleHeightPlusMargin;

                var departuresLeftLegendData = {
                    "title": "Departures",
                    "id": "departures-left-title",
                    "margin_top": calculatedMarginTop > 0 ? calculatedMarginTop : 0,
                    "items": [{
                        "id": "left-legend-departures",
                        "class": cssClassMappings["Checked Out"],
                        "label": "Checked Out",
                        "count": chartDetails.perfomed_departures_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, leftSideLegendDiv, departuresLeftLegendData);

                /************************** LEFT LEGEND END HERE ************************/

                /************************** RIGHT LEGEND STARTS HERE ************************/

                var rightSideLegendDiv = d3.select("#right-side-legend");

                var arrivalsRightLegendData = {
                    "title": "Arrivals",
                    "id": "arrivals-right-title",
                    "margin_top": secondHorizontalLineYoffset - yInnerPadding / 2 - yBandwidth / 2,
                    "items": [{
                        "id": "right-legend-early-checkin",
                        "class": cssClassMappings["Early Check in"],
                        "label": "Early Check in",
                        "count": chartDetails.early_checkin_arrivals_count
                    }, {
                        "id": "right-legend-remaining",
                        "class": cssClassMappings["Remaining"],
                        "label": "Remaining",
                        "count": chartDetails.remaining_arrivals_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, rightSideLegendDiv, arrivalsRightLegendData);

                var vacantRightLegendData = {
                    "title": "Vacant",
                    "id": "vacnt-right-title",
                    "margin_top": yBandwidth - 2 * singleLegendTitleHeightPlusMargin,
                    "items": [{
                        "id": "right-legend-dirty",
                        "class": cssClassMappings["Inspected"],
                        "label": "Inspected",
                        "count": chartDetails.inspected_vacant_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, rightSideLegendDiv, vacantRightLegendData);

                var departuresRightLegendData = {
                    "title": "Departures",
                    "id": "departures-right-title",
                    "margin_top": yBandwidth - singleLegendTitleHeightPlusMargin,
                    "items": [{
                        "id": "right-legend-pending",
                        "class": cssClassMappings["Pending"],
                        "label": "Pending",
                        "count": chartDetails.pending_departures_count
                    }, {
                        "id": "right-legend-lc",
                        "class": cssClassMappings["Late checkout"],
                        "label": "Late checkout",
                        "count": chartDetails.late_checkout_departures_count
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItems(cssClassMappings, rightSideLegendDiv, departuresRightLegendData);

                /************************** RIGHT LEGEND ENDS HERE ************************/

                $scope.$emit('REFRESH_ANALTICS_SCROLLER');
                $scope.screenData.hideChartData = false;
            };
        }
    ]);