angular.module('sntRover')
    .controller('rvHkWokrPriorityCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var cssClassMappings = {
                "Checked In": "bar bar-green bar-light",
                "Early Check in": "bar bar-green bar-dark",
                "Remaining": "bar bar-green",

                "Dirty": "bar bar-red",
                "Pickup": "bar bar-orange",
                "Clean": "bar bar-green",
                "Inspected": "bar bar-green bar-dark",

                "Checked Out": "bar bar-red bar-light",
                "Late checkout": "bar bar-red bar-dark",
                "Pending": "bar bar-red"
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
                "vacant_clean": {
                    "legend_class": "bar bar-green",
                    "fill": "green",
                    "onmouseover_fill": "greenHover",
                    "onmouseout_fill": "green"
                },
                "vacant_inspected": {
                    "legend_class": "bar bar-green bar-dark",
                    "fill": "greenDark",
                    "onmouseover_fill": "greenDarkHover",
                    "onmouseout_fill": "greenDark"
                },
                "vacant_dirty": {
                    "legend_class": "bar bar-red",
                    "fill": "red",
                    "onmouseover_fill": "redHover",
                    "onmouseout_fill": "red"
                },
                "vacant_pickup": {
                    "legend_class": "bar bar-orange",
                    "fill": "orange",
                    "onmouseover_fill": "orangeHover",
                    "onmouseout_fill": "orange"
                }
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
                    maxValue: maxValueInBotheDirections,
                    colorMappings: colorMappings
                };

                rvAnalyticsHelperSrv.drawBarChart(dataForDrawingBars);

                // rvAnalyticsHelperSrv.drawBarsOfBidirectonalChart(dataForDrawingBars);

                // Add extra Y axis to the middle of the graph
                svg.append("g")
                    .append("rect")
                    .attr("class", "chart-breakpoint-line")
                    .attr("x", xScale(0))
                    .attr("y", -40)
                    .attr("height", height + margin.top + 40)
                    .attr("width", 4);
                /************************** DRAW HORIZONTAL LINES IN GRAPH ************************/

                svg.append("g")
                    .append("rect")
                    .attr("class", "chart-breakpoint-line")
                    .attr("x", xScale(-1 * maxValueInBotheDirections))
                    .attr("y", 0)
                    .attr("height", 4)
                    .attr("width", 2 * xScale(maxValueInBotheDirections));

                var firstHorizontalLine = 1.5 * yInnerPadding + yScale.bandwidth();

                svg.append("g")
                    .append("rect")
                    .attr("class", "chart-breakpoint-line")
                    .attr("x", xScale(-1 * maxValueInBotheDirections))
                    .attr("y", firstHorizontalLine)
                    .attr("height", 4)
                    .attr("width", 2 * xScale(maxValueInBotheDirections));

                var secondHorizontalLine = 2.5 * yInnerPadding + 2 * yScale.bandwidth();

                svg.append("g")
                    .append("rect")
                    .attr("class", "chart-breakpoint-line")
                    .attr("x", xScale(-1 * maxValueInBotheDirections))
                    .attr("y", secondHorizontalLine)
                    .attr("height", 4)
                    .attr("width", 2 * xScale(maxValueInBotheDirections));


                if (maxValueInBotheDirections > 0) {
                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections))
                        .attr("y", 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("ARRIVALS");

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections))
                        .attr("y", firstHorizontalLine + 15)
                        .attr("dy", ".35em")
                        .attr("class", "chart-area-label")
                        .text("VACANT");

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections))
                        .attr("y", secondHorizontalLine + 15)
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
                    "margin_top": firstHorizontalLine - yInnerPadding / 2 - yBandwidth / 2,
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

                var departuresLeftLegendData = {
                    "title": "Departures",
                    "id": "departures-left-title",
                    "margin_top": yBandwidth - 3 * singleLegendTitleHeightPlusMargin,
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
                    "margin_top": firstHorizontalLine - yInnerPadding / 2 - yBandwidth / 2,
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