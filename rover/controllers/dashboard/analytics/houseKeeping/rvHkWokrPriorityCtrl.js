angular.module('sntRover')
    .controller('rvHkWokrPriorityCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var colorMappings = {
                "arrivals_perfomed": rvAnalyticsHelperSrv.constructColorMappings('arrivals_perfomed', 'greenLight'),
                "arrivals_early_checkin": rvAnalyticsHelperSrv.constructColorMappings('arrivals_perfomed', 'greenDark'),
                "arrivals_remaining": rvAnalyticsHelperSrv.constructColorMappings('arrivals_remaining', 'green'),

                "departures_perfomed": rvAnalyticsHelperSrv.constructColorMappings('departures_perfomed', 'redLight'),
                "departures_pending": rvAnalyticsHelperSrv.constructColorMappings('departures_pending', 'red'),
                "departures_late_checkout": rvAnalyticsHelperSrv.constructColorMappings('departures_late_checkout', 'redDark'),

                "vacant_clean": rvAnalyticsHelperSrv.constructColorMappings('vacant_clean', 'green'),
                "vacant_inspected": rvAnalyticsHelperSrv.constructColorMappings('vacant_inspected', 'greenDark'),
                "vacant_dirty": rvAnalyticsHelperSrv.constructColorMappings('vacant_dirty', 'red'),
                "vacant_pickup": rvAnalyticsHelperSrv.constructColorMappings('vacant_pickup', 'orange'),

                "vacant_pending_inspected_rooms": rvAnalyticsHelperSrv.constructColorMappings('pending_inspected_rooms', 'blueLight')
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
                    .attr("id", "d3-plot")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // DEBUGING CODE
                // chartDetails = rvAnalyticsHelperSrv.addRandomNumbersForTesting(chartDetails);

                var arrivalsPendingPlusEarlyCheckin = _.find(chartDetails.chartData.data, function(chart) {
                    return chart.type === "arrivals";
                });
                var arrivalsPendingPlusEarlyCheckinCount = _.reduce(arrivalsPendingPlusEarlyCheckin.contents.right_side, function(memo, item) {
                    return memo.count + item.count;
                });

                var vacantRoomsData = _.find(chartDetails.chartData.data, function(chart) {
                    return chart.type === "vacant";
                });
                var InspectedVacantRooms = vacantRoomsData.contents.right_side[0].count;

                // if Inspected rooms are less than sum of Early checkin and remaining arrivals, we need to indicate the 
                // remaining Inspected rooms that needs to be ready by the time guests arrives
                if (arrivalsPendingPlusEarlyCheckinCount > InspectedVacantRooms) {
                    var pendingInspectedRooms = {
                        type: "pending_inspected_rooms",
                        count: parseInt(arrivalsPendingPlusEarlyCheckinCount) - parseInt(InspectedVacantRooms)
                    };

                    vacantRoomsData.contents.right_side.push(pendingInspectedRooms);
                };

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
                    colorMappings: colorMappings,
                    onBarChartClick: chartDetails.onBarChartClick
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
                var leftLegendCommonData = {
                    parentElement: leftSideLegendDiv,
                    onLegendClick: chartDetails.onLegendClick
                };

                var arrivalsLeftLegendData = {
                    "title": "Arrivals",
                    "id": "arrivals-right-title-left",
                    "margin_top": secondHorizontalLineYoffset - yInnerPadding / 2 - yBandwidth / 2,
                    "items": [{
                        "id": "left-legend-arrivals",
                        "class": colorMappings.arrivals_perfomed.legend_class,
                        "label": "Checked In",
                        "count": chartDetails.perfomed_arrivals_count,
                        "item_name": colorMappings.arrivals_perfomed.item_name,
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItemsToChart(_.extend(leftLegendCommonData, {
                    legendData: arrivalsLeftLegendData
                }));

                var singleLegendTitleHeightPlusMargin = $("#arrivals-right-title-left").height() + 10;
                var singleLegendItemHeightPlusMargin = $("#left-legend-arrivals").height() + 10;

                var vacantLeftLegendData = {
                    "title": "Vacant",
                    "id": "vacant-left-title",
                    "margin_top": yBandwidth - singleLegendTitleHeightPlusMargin,
                    "items": [{
                        "id": "left-legend-dirty",
                        "class": colorMappings.vacant_dirty.legend_class,
                        "label": "Dirty",
                        "count": chartDetails.dirty_vacant_count,
                        "item_name": colorMappings.vacant_dirty.item_name
                    }, {
                        "id": "left-legend-pickup",
                        "class": colorMappings.vacant_pickup.legend_class,
                        "label": "Pickup",
                        "count": chartDetails.pickup_vacant_count,
                        "item_name": colorMappings.vacant_pickup.item_name
                    }, {
                        "id": "left-legend-clean",
                        "class": colorMappings.vacant_clean.legend_class,
                        "label": "Clean",
                        "count": chartDetails.clean_vacant_count,
                        "item_name": colorMappings.vacant_clean.item_name
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItemsToChart(_.extend(leftLegendCommonData, {
                    legendData: vacantLeftLegendData
                }));

                var calculatedMarginTop = yBandwidth - 3 * singleLegendTitleHeightPlusMargin;

                var departuresLeftLegendData = {
                    "title": "Departures",
                    "id": "departures-left-title",
                    "margin_top": calculatedMarginTop > 0 ? calculatedMarginTop : 0,
                    "items": [{
                        "id": "left-legend-departures",
                        "class": colorMappings.departures_perfomed.legend_class,
                        "label": "Checked Out",
                        "count": chartDetails.perfomed_departures_count,
                        "item_name": colorMappings.departures_perfomed.item_name
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItemsToChart(_.extend(leftLegendCommonData, {
                    legendData: departuresLeftLegendData
                }));

                /************************** LEFT LEGEND END HERE ************************/

                /************************** RIGHT LEGEND STARTS HERE ************************/

                var rightSideLegendDiv = d3.select("#right-side-legend");
                var rightLegendCommonData = {
                    parentElement: rightSideLegendDiv,
                    onLegendClick: chartDetails.onLegendClick
                };

                var arrivalsRightLegendData = {
                    "title": "Arrivals",
                    "id": "arrivals-right-title",
                    "margin_top": secondHorizontalLineYoffset - yInnerPadding / 2 - yBandwidth / 2,
                    "items": [{
                        "id": "right-legend-early-checkin",
                        "class": colorMappings.arrivals_early_checkin.legend_class,
                        "label": "Early Check in",
                        "count": chartDetails.early_checkin_arrivals_count,
                        "item_name": colorMappings.arrivals_early_checkin.item_name
                    }, {
                        "id": "right-legend-remaining",
                        "class": colorMappings.arrivals_remaining.legend_class,
                        "label": "Remaining",
                        "count": chartDetails.remaining_arrivals_count,
                        "item_name": colorMappings.arrivals_remaining.item_name
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItemsToChart(_.extend(rightLegendCommonData, {
                    legendData: arrivalsRightLegendData
                }));

                var vacantRightLegendData = {
                    "title": "Vacant",
                    "id": "vacnt-right-title",
                    "margin_top": yBandwidth - 2 * singleLegendTitleHeightPlusMargin,
                    "items": [{
                        "id": "right-legend-inspected",
                        "class": colorMappings.vacant_inspected.legend_class,
                        "label": "Inspected",
                        "count": chartDetails.inspected_vacant_count,
                        "item_name": colorMappings.vacant_inspected.item_name
                    }]
                };

                var marginTopForRightSideDeps;

                if (arrivalsPendingPlusEarlyCheckinCount > InspectedVacantRooms) {
                    var pendingInspected = {
                        "id": "right-legend-pending-inspected",
                        "class": colorMappings.vacant_pending_inspected_rooms.legend_class,
                        "label": "To Inspect",
                        "count": parseInt(arrivalsPendingPlusEarlyCheckinCount) - parseInt(InspectedVacantRooms),
                        "item_name": colorMappings.vacant_pending_inspected_rooms.item_name
                    };

                    vacantRightLegendData.items.push(pendingInspected);
                    marginTopForRightSideDeps = yBandwidth - 2 * singleLegendTitleHeightPlusMargin;
                } else {
                    marginTopForRightSideDeps = yBandwidth - singleLegendTitleHeightPlusMargin;
                }

                rvAnalyticsHelperSrv.addLegendItemsToChart(_.extend(rightLegendCommonData, {
                    legendData: vacantRightLegendData
                }));

                var departuresRightLegendData = {
                    "title": "Departures",
                    "id": "departures-right-title",
                    "margin_top": marginTopForRightSideDeps,
                    "items": [{
                        "id": "right-legend-pending",
                        "class": colorMappings.departures_pending.legend_class,
                        "label": "Pending",
                        "count": chartDetails.pending_departures_count,
                        "item_name": colorMappings.departures_pending.item_name
                    }, {
                        "id": "right-legend-lc",
                        "class": colorMappings.departures_late_checkout.legend_class,
                        "label": "Late checkout",
                        "count": chartDetails.late_checkout_departures_count,
                        "item_name": colorMappings.departures_late_checkout.item_name
                    }]
                };

                rvAnalyticsHelperSrv.addLegendItemsToChart(_.extend(rightLegendCommonData, {
                    legendData: departuresRightLegendData
                }));

                /************************** RIGHT LEGEND ENDS HERE ************************/

                $scope.$emit('REFRESH_ANALTICS_SCROLLER');
                $scope.screenData.hideChartData = false;
            };
        }
    ]);