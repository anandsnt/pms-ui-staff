angular.module('sntRover')
    .controller('rvHkWokrPriorityCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvAnalyticsHelperSrv',
        function($scope, sntActivity, $timeout, $filter, rvAnalyticsHelperSrv) {

            var arrivalsColorScheme = d3.scaleOrdinal()
                .range(["#97D470", "#468F14", "#7CD724"])
                .domain(["perfomed", "early_checkin", "remaining"]);

            var vacantColorScheme = d3.scaleOrdinal()
                .range(["#E62A13", "#D67F11", "#66D41D", "#448E13"])
                .domain(["dirty", "pickup", "clean", "inspected"]);

            var departuresColorScheme = d3.scaleOrdinal()
                .range(["#E57D70", "#B92C13", "#E62A13"])
                .domain(["perfomed", "late_checkout", "pending"]);

            var colorScheme = {
                arrivalsColorScheme: arrivalsColorScheme,
                vacantColorScheme: vacantColorScheme,
                departuresColorScheme: departuresColorScheme
            };

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

                /************************** DRAW HORIZONTAL LINES IN GRAPH ************************/

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


                if (maxValueInBotheDirections > 0) {
                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3/ 4))
                        .attr("y", 12.5)
                        .attr("dy", ".35em")
                        .style("font-size", "15px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("ARRIVALS");

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3/ 4))
                        .attr("y", firstLineHeight + 12.5)
                        .attr("dy", ".35em")
                        .style("font-size", "15px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("VACANT");

                    svg.append("text")
                        .attr("x", xScale(-1 * maxValueInBotheDirections * 3/ 4))
                        .attr("y", secondLineHeight + 12.5)
                        .attr("dy", ".35em")
                        .style("font-size", "15px")
                        .style("font-style", "italic")
                        .style("fill", "#B1B1B1")
                        .text("DEPARTURES");
                }

                /************************** LEFT LEGEND STARTS HERE ************************/
                var leftSideLegendDiv = d3.select("#left-side-legend");
                var yBandwidth = yScale.bandwidth();

                var arrivalsLeftLegendData = {
                    "title": "Arrivals",
                    "id": "arrivals-right-title-left",
                    "margin_top": firstLineHeight - yInnerPadding/2 - yBandwidth/2,
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
                    "margin_top": firstLineHeight - yInnerPadding/2 - yBandwidth/2,
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
                    "margin_top": yBandwidth -  singleLegendTitleHeightPlusMargin,
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
            };
        }
    ]);