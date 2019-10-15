angular.module('sntRover')
    .controller('rvAnalyticsBaseCtrl', ['$scope', 'sntActivity', '$timeout',
        function($scope, sntActivity, $timeout) {

            // Draw bidirectional chart
            $scope.drawBidirectionalChart = function reportWindowSize(chartDetails) {

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
                    .tickFormat(function(d) {
                        // X axis... treat -ve values as positive
                        return (d < 0) ? (d * -1) : d;
                    });

                var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5)
                    .tickSizeInner(-width)
                    .tickSizeOuter(0)
                    .tickPadding(10);

                var svg = d3.select("#analytics-chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("id", "d3-plot")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var combinedItemsCountArray = [];

                _.each(chartDetails.chartData, function(chart) {
                    _.each(chart.contents.left_side, function(item) {
                        combinedItemsCountArray.push(item.count);
                    });
                    _.each(chart.contents.right_side, function(item) {
                        combinedItemsCountArray.push(item.count);
                    });
                });

                var largestItemCount = _.max(combinedItemsCountArray, function(count) {
                    return count;
                });

                chartDetails.chartData.forEach(function(chart) {

                    var chartName = chart.type;
                    // sort left side items in descending order
                    chart.contents.left_side = _.sortBy(chart.contents.left_side, function(item) {
                        return -1 * item.count;
                    });
                    // sort right side items in ascending order
                    chart.contents.right_side = _.sortBy(chart.contents.right_side, function(item) {
                        return item.count;
                    });
                    // Join left side and right arrays and start chart from left side
                    var combinedArray = chart.contents.left_side.concat(chart.contents.right_side);

                    // Let count be 90, 40, 30 - based on calculation below the following will the calculated values
                    // item 1 = { xOrigin : -160 , xFinal : -70 }
                    // item 2 = { xOrigin : -70 , xFinal : -30 }
                    // item 2 = { xOrigin : -30 , xFinal : 0 }

                    var totalCountInLeftSide =  _.reduce(chart.contents.left_side, function(totalCount, item) {              
                        return item.count + totalCount;            
                    }, 0);

                    chart.contents.left_side = _.each(chart.contents.left_side, function(item, index) {
                        if (index === 0) {
                            item.origin = -1 * totalCountInLeftSide;
                            item.xFinal = -1 * (totalCountInLeftSide - item.count);
                        } else {
                            item.origin = chart.contents.left_side[index - 1].xFinal;
                            item.xFinal = -1 * (-1 * item.origin - item.count);
                        }
                    });

                    // Let count be 10, 25, 35 - based on calculation below the following will the calculated values
                    // item 1 = { xOrigin : 0  , xFinal : 10 }
                    // item 2 = { xOrigin : 10 , xFinal : 25 }
                    // item 2 = { xOrigin : 25 , xFinal : 35 }

                    chart.contents.right_side = _.each(chart.contents.right_side, function(item, index) {
                        // For first item X origin is 0 and xFinal is count 
                        if (index === 0) {
                            item.origin = 0;
                            item.xFinal = item.count;
                        } else {
                            // For all other elements, X origin  is count of previous item and X final is count of the item
                            item.origin = chart.contents.right_side[index - 1].count;
                            item.xFinal = item.origin + chart.contents.right_side[index].count;
                        }
                    });

                    chart.boxes = combinedArray.map(function(item) {
                        return {
                            type: item.type,
                            label: item.label,
                            xOrigin: item.origin,
                            xFinal: item.xFinal,
                            count: item.count,
                            chartName: chartName
                        }
                    });
                });

                // get minimum and maximum values to plot
                var min_val = d3.min(chartDetails.chartData, function(chart) {
                    return chart.boxes["0"].xOrigin;
                });
                var max_val = d3.max(chartDetails.chartData, function(chart) {
                    return chart.boxes[chart.boxes.length - 1].xFinal;
                });

                var maxValueInBotheDirections = min_val > max_val ? min_val : max_val;

                // set scales for x axis
                xScale.domain([-1 * maxValueInBotheDirections, maxValueInBotheDirections]).nice();
                yScale.domain(chartDetails.chartData.map(function(chart) {
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


                var vakken = svg.selectAll(".type")
                    .data(chartDetails.chartData)
                    .enter().append("g")
                    .attr("class", "bar")
                    .attr("transform", function(chart) {
                        return "translate(0," + yScale(chart.type) + ")";
                    });

                var bars = vakken.selectAll("rect")
                    .data(function(mainItem) {
                        return mainItem.boxes;
                    })
                    .enter()
                    .append("g")
                    .attr("class", "subbar");

                bars.append("rect")
                    .attr("height", yScale.bandwidth())
                    .attr("x", function(item) {
                        return xScale(item.xOrigin);
                    })
                    .attr("width", function(item) {
                        return xScale(item.xFinal) - xScale(item.xOrigin);
                    })
                    .style("fill", function(item) {
                        return chartDetails.chartColorScheme[item.chartName + 'ColorScheme'](item.type);
                    })
                    .on("click", function(e) {
                        chartDetails.onBarChartClick(e);
                    });

                bars.append("text")
                    .attr("x", function(chart) {
                        return ((xScale(chart.xOrigin) + xScale(chart.xFinal)) / 2) - 10;
                    })
                    .attr("y", yScale.bandwidth() / 2)
                    .attr("dy", "0.5em")
                    .attr("dx", "0.5em")
                    .style("font-size", "15px")
                    .style("text-anchor", "begin")
                    .text(function(item) {
                        var itemPercantage = item.count * 100 / maxValueInBotheDirections;

                        // show text only if there is enough space
                        return (itemPercantage > 8 || itemPercantage > 4 && item.count < 10) ? item.count : "";
                    });

                // Add extra Y axis to the middle of the graph
                svg.append("g")
                    .attr("class", "y axis")
                    .append("line")
                    .attr("x1", xScale(0))
                    .attr("x2", xScale(0))
                    .attr("y2", height);
            }

        }
    ]);