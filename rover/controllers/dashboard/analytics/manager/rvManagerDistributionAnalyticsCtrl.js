angular.module('sntRover')
	.controller('rvManagerDistributionAnalyticsCtrl', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvManagersAnalyticsSrv', 'rvAnalyticsHelperSrv', '$rootScope',
		function($scope, sntActivity, $timeout, $filter, rvManagersAnalyticsSrv, rvAnalyticsHelperSrv, $rootScope) {
			var getPrefinedValuesForDate = function(date) {
            var today = $rootScope.businessDate;
            var definedDates = [{
                "value": "Yesterday",
                "date": moment(today).subtract(1, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-2",
                "date": moment(today).subtract(2, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-3",
                "date": moment(today).subtract(3, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-4",
                "date": moment(today).subtract(4, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-5",
                "date": moment(today).subtract(5, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-6",
                "date": moment(today).subtract(6, 'day').format("YYYY-MM-DD")
            }];

            var isPredefinedDate = function(date) {
                return _.find(definedDates, function(definedDate) {
                    return definedDate.date === date;
                });
            };

            if (date === today) {
                return "Today";
            } else if (isPredefinedDate(date)) {
                return isPredefinedDate(date).value;
            }

            return $filter('date')(date,  $rootScope.dateFormat);

        };
			$scope.drawDistributionChart = function(data) {
				$scope.$emit('CHART_TYPE_CHANGED');
				try {
					var initStackedBarChart = {
						draw: function(config) {
							var me = this,
								domEle = config.element,
								stackKey = config.key,
								data = config.data,
								colors = config.colors,
								margin = {
									top: 20,
									right: 20,
									bottom: 30,
									left: 50
								},
								parseDate = d3.timeParse("%Y-%m-%d"),
								width = document.getElementById("analytics-chart").clientWidth - margin.left - margin.right,
								height = 500 - margin.top - margin.bottom,
								xScale = d3.scaleBand()
								.range([0, width - 350])
								.padding(0.5),
								yScale = d3.scaleLinear()
								.range([height, 0]);

							var xAxis = d3.axisBottom(xScale)
								// .tickFormat(d3.timeFormat("%b"))
								.tickFormat(function(d){
									var a = moment(d).format('YYYY-MM-DD');
									console.log(d)
									console.log(a)
									return getPrefinedValuesForDate(a);
								})
								.tickSizeOuter(0)
								.tickPadding(15),
								yAxis = d3.axisLeft(yScale)
								.tickSizeOuter(0)
								.tickPadding(15),
								svg = d3.select("#" + domEle)
								.append("svg")
								.attr("width", width + margin.left + margin.right)
								.attr("height", height + margin.top + margin.bottom)
								.append("g")
								.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

							var stack = d3.stack()
								.keys(stackKey)
								.order(d3.stackOrderNone)
								.offset(d3.stackOffsetNone);

							var layers = stack(data);

							xScale.domain(data.map(function(d) {
								console.log(d.date);
								console.log(parseDate(d.date))

								return parseDate(d.date);
							}));

							var maxValue = d3.max(layers[layers.length - 1], function(d) {
								return d[1];
							});

							yScale.domain([0, maxValue]).nice();

							var layer = svg.selectAll(".layer")
								.data(layers)
								.enter().append("g")
								.attr("class", "layer")
								.style("fill", function(d, i) {
									return colors[i];
								});

							layer.selectAll("rect")
								.data(function(d) {
									return d;
								})
								.enter().append("rect")
								.attr("class", "rect-bars")
								.attr("x", function(d) {
									return xScale(parseDate(d.data.date));
								})
								.attr("y", function(d) {
									return yScale(d[1]);
								})
								.attr("width", xScale.bandwidth())
								.on("mouseover", function() {
									tooltip.style("display", null);
								})
								.on("mouseout", function() {
									tooltip.style("display", "none");
								})
								.on("mousemove", function(d) {
									console.log(d)
									var xPosition = d3.mouse(this)[0] - 15;
									var yPosition = d3.mouse(this)[1] - 25;
									tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
									tooltip.select("text").text(d[1] - d[0]);
								});

							d3.selectAll(".rect-bars")
								.transition()
								.duration(800)
								.attr("height", function(d) {
									return yScale(d[0]) - yScale(d[1]);
								});

							svg.append("g")
								.attr("class", "axis axis--x")
								.attr("transform", "translate(0," + height + ")")
								.call(xAxis);

							svg.append("g")
								.attr("class", "axis axis--y")
								.attr("transform", "translate(0,0)")
								.call(yAxis);

							rvAnalyticsHelperSrv.drawRectLines({
								svg: svg,
								xOffset: 0,
								height: 4,
								width: width - 350,
								yOffset: height
							});
							rvAnalyticsHelperSrv.drawRectLines({
								svg: svg,
								xOffset: 0,
								height: height,
								width: 4,
								yOffset: 0
							});


							// Prep the tooltip bits, initial display is hidden
							var tooltip = svg.append("g")
								.attr("class", "tooltip")
								.style("display", "none");

							tooltip.append("rect")
								.attr("width", 30)
								.attr("height", 20)
								.attr("fill", "white")
								.style("opacity", 0.5);

							tooltip.append("text")
								.attr("x", 15)
								.attr("dy", "1.2em")
								.style("text-anchor", "middle")
								.attr("font-size", "12px")
								.attr("font-weight", "bold");

							// var legendSvg = d3.select("#right-side-legend").append("svg")
							var legend = svg.selectAll(".legend")
								.data(colors)
								.enter().append("g")
								.attr("class", "legend")
								.attr("transform", function(d, i) {
									return "translate(-250," + i * 30 + ")";
								});

							legend.append("rect")
								.attr("x", width - 18)
								.attr("width", 18)
								.attr("height", 18)
								.style("fill", function(d, i) {
									return colors[i];
								});

							legend.append("text")
								.attr("x", width + 5)
								.attr("y", 9)
								.attr("dy", ".35em")
								.style("text-anchor", "start")
								.text(function(d, i) {
									return stackKey[i];
								});

						}
					}
					var data = [{
						"date": "2018-10-12",
						"adr": 0,
						"rev par": 10,
						"occupancy": 10,
						"occupied_rooms": 20
					}, {
						"date": "2018-10-11",
						"adr": 10,
						"rev par": 10,
						"occupancy": 20,
						"occupied_rooms": 20
					},
					{
						"date": "2018-10-10",
						"adr": 0,
						"rev par": 10,
						"occupancy": 50,
						"occupied_rooms": 40
					},
					{
						"date": "2018-10-09",
						"adr": 0,
						"rev par": 60,
						"occupancy": 25,
						"occupied_rooms": 20
					},
					{
						"date": "2018-10-08",
						"adr": 0,
						"rev par": 60,
						"occupancy": 25,
						"occupied_rooms": 20
					},
					{
						"date": "2018-10-07",
						"adr": 0,
						"rev par": 60,
						"occupancy": 25,
						"occupied_rooms": 20
					},
					{
						"date": "2018-10-06",
						"adr": 0,
						"rev par": 60,
						"occupancy": 50,
						"occupied_rooms": 20
					},
					{
						"date": "2018-10-05",
						"adr": 0,
						"rev par": 60,
						"occupancy": 50,
						"occupied_rooms": 20
					}

					// {
					// 	"date": "6/1854",
					// 	"total": 50,
					// 	"rev par": 10,
					// 	"occupancy": 10,
					// 	"occupied_rooms": 15
					// }, {
					// 	"date": "7/1854",
					// 	"total": 50,
					// 	"rev par": 10,
					// 	"occupancy": 10,
					// 	"occupied_rooms": 15
					// }, {
					// 	"date": "8/1854",
					// 	"total": 50,
					// 	"rev par": 10,
					// 	"occupancy": 10,
					// 	"occupied_rooms": 15
					// }, {
					// 	"date": "9/1854",
					// 	"total": 50,
					// 	"rev par": 10,
					// 	"occupancy": 10,
					// 	"occupied_rooms": 15
					// }, {
					// 	"date": "10/1854",
					// 	"total": 50,
					// 	"rev par": 10,
					// 	"occupancy": 10,
					// 	"occupied_rooms": 15
					// }, {
					// 	"date": "11/1854",
					// 	"total": 70,
					// 	"rev par": 10,
					// 	"occupancy": 10,
					// 	"occupied_rooms": 15
					// }

					];

					var data = [{
						"date": "2018-10-12",
						"adr": 12,
					},
					{
						"date": "2018-10-11",
						"adr": 12
					}];

					var data = [{
						"date": "2018-10-12",
						"occupancy": 15,
					},
					{
						"date": "2018-10-11",
						"occupancy": 26
					}];

					var data = [{
						"date": "2018-10-12",
						"standard king": 15,
						"Deluxe king": 20,
					},
					{
						"date": "2018-10-11",
						"standard king": 35,
						"Deluxe king": 34,
					}];

					var ii = 0;
					var key = ["adr", "rev par", "occupancy", "occupied_rooms"];
					var key = ["occupancy"];
					var key = ["standard king", "Deluxe king"];
					//var key = ["adr"];
					if (ii > 0) {
						_.each(data, function(d) {
							for (var i = 0; i <= ii; i++) {
								//  d["fruit__"+i] = _.random(1,20);
								d["fruit__" + i] = _.random(20, 50);
							}
						});

						for (var i = 0; i <= ii; i++) {
							key.push("fruit__" + i);
						};
					}


					var colors = ["#ff0029", "#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f", "#c4eaff", "#cf8c00", "#1b9e77", "#d95f02", "#e7298a", "#e6ab02", "#a6761d", "#0097ff", "#00d067", "#000000", "#252525", "#525252", "#737373", "#969696", "#bdbdbd", "#f43600", "#4ba93b", "#5779bb", "#927acc", "#97ee3f", "#bf3947", "#9f5b00", "#f48758", "#8caed6", "#f2b94f", "#eff26e", "#e43872", "#d9b100", "#9d7a00", "#698cff", "#d9d9d9"]

					if (colors.length > key.length) {
						colors = colors.slice(0, key.length)
					} else {
						for (var i = colors.length; i <= key.length - 1; i++) {
							colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
						}
					}

					initStackedBarChart.draw({
						data: data,
						key: key,
						colors: colors,
						element: 'd3-plot'
					});

					$scope.screenData.hideChartData = false;
				} catch (E) {
					console.log(E)
				}
			}
		}
	]);