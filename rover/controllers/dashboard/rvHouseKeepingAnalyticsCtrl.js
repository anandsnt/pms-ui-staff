sntRover.controller('RVHouseKeepingAnalyticsCtrlController', ['$scope',
	'$rootScope',
	'$state',
	'$timeout',
	function($scope, $rootScope, $state, $timeout) {
		BaseCtrl.call(this, $scope);

		var renderGraph = function() {
			function reportWindowSize() {

				var margin = {
						top: 50,
						right: 20,
						bottom: 30,
						left: 150
					},
					width = document.getElementById("analytics-chart").clientWidth - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom;

				var y = d3.scaleBand()
					.rangeRound([0, height + 10])
					.padding(.3);

				var x = d3.scaleLinear()
					.rangeRound([0, width]);

				var color = d3.scaleOrdinal()
					.range(["#B5D398", "#557B2F", "#B7D599"])
					.domain(["Perfomed", "EC", "Remaining"]);

				var vacantColor = d3.scaleOrdinal()
					.range(["#DC3535", "#EC9319", "#B7D599"])
					.domain(["DIRTY", "PICKUP", "CLEAN"]);

				var departGraphColor = d3.scaleOrdinal()
					.range(["#DAA0A1", "#DE3635", "#AE2828", "#B7D599"])
					.domain(["PERFOMED", "LATECHECKOUT", "REMAINING", "SOMETHING ELSE"]);

				// X axis... treat -ve values as positive
				var xAxis = d3.axisBottom()
					.scale(x)
					.tickSizeInner(-height)
					.tickSizeOuter(0)
					// .tickPadding(10)
					.ticks(10)
					.tickFormat(function(d) {
						return (d < 0) ? (d * -1) : d;
					});

				var yAxis = d3.axisLeft()
					.scale(y)
					.tickSizeInner(-width)
					.tickSizeOuter(0)
					.tickPadding(10);


				var svg = d3.select("#analytics-chart").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.attr("id", "d3-plot")
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


				var data = [{
					"1": "110",
					"2": "0",
					"3": "110",
					"graphType": "hidden",
					"N": "220"
				}, {
					"1": "50",
					"2": "20",
					"3": "70",
					"graphType": "ARRIVALS",
					"N": "140"
				}, {
					"1": "70",
					"2": "40",
					"3": "20",
					"graphType": "VACANT",
					"N": "130"
				}, {
					"1": "40",
					"2": "30",
					"3": "10",
					"4": "35",
					"graphType": "DEPARTURES",
					"N": "105"
				}];

				// data = [{
				//   "1": "70",
				//   "2": "40",
				//   "3": "20",
				//   "graphType": "VACANT",
				//   "N": "130"
				// }];

				/************************** DIRTY CODE - TO CLEAN ************************/

				data.forEach(function(d) {

					var setElements = function(element1, element2, element3, element4) {
						d[element1] = +d[1] * 100 / d.N;
						d[element2] = +d[2] * 100 / d.N;

						d[element3] = +d[3] * 100 / d.N;
						if (element4) {
							d[element4] = +d[4] * 100 / d.N;
						}
					};

					var selectedGraphColor;
					var x0;

					if (d.graphType === 'ARRIVALS') {
						selectedGraphColor = color;
						setElements("Perfomed", "EC", "Remaining");
						// x0 = -1 * (d["Perfomed"] + d["EC"]);
						x0 = (d["Perfomed"] > d["EC"]) ? -1 * d[1] : -1 * d[2];
					} else if (d.graphType === 'VACANT') {
						selectedGraphColor = vacantColor;
						setElements("DIRTY", "PICKUP", "CLEAN");
						x0 = (d["DIRTY"] > d["PICKUP"]) ? -1 * d[1] : -1 * d[2];
					} else if (d.graphType === 'DEPARTURES') {
						selectedGraphColor = departGraphColor;
						setElements("PERFOMED", "LATECHECKOUT", "REMAINING", "SOMETHING ELSE");
						//x0 = -1 * (d["PERFOMED"] + d["LATECHECKOUT"]);
						x0 = (d["PERFOMED"] > d["LATECHECKOUT"]) ? -1 * d[1] : -1 * d[2];
					} else {
						selectedGraphColor = color;
						d["Perfomed"] = 70;
						d["EC"] = 0;
						d["Remaining"] = 70;
						x0 = -1 * (d["Perfomed"]);
					}

					var idx = 0;

					d.boxes = selectedGraphColor.domain().map(function(name) {
						console.log("\n\n");
						console.log(x0);
						console.log(d[name]);
						// console.log(x0 += +d[name]);
						console.log("\n\n");

						var returnX1 = function() {
							var next_item;

							if (d.graphType === 'hidden') {
								return (x0 === -70) ? (x0 += 70) : 70;
							} else if (d.graphType === 'VACANT') {
								next_item = name === 'DIRTY' ? (d[1] - d[2]) : (name === 'PICKUP' ? d[2] : d[3]);
							} else if (d.graphType === 'ARRIVALS') {
								next_item = name === 'Perfomed' ? (d[1] - d[2]) : (name === 'EC' ? d[2] : d[3]);
							} else if (d.graphType === 'DEPARTURES') {

								if (name === 'PERFOMED') {
									next_item = (d[1] - d[2]);
								} else if (name === 'LATECHECKOUT') {
									next_item = d[2];
								} else if (name === 'REMAINING') {
									next_item = d[3];
								} else {
									next_item = d[4] - d[3];
								}
							}
							return x0 += +next_item;
						};

						return {
							name: name,
							x0: x0,
							x1: returnX1(),
							N: +d.N,
							n: +d[idx += 1],
							graphType: d.graphType
						};
					});
					console.log(d)
				});

				/************************** DIRTY CODE - TO CLEAN ENDS HERE ************************/

				var min_val = d3.min(data, function(d) {
					// console.log(d.boxes["0"]);
					return d.boxes["0"].x0;
				});

				var max_val = d3.max(data, function(d) {
					return d.boxes["2"].x1;
				});

				x.domain([min_val, max_val]).nice();
				y.domain(data.map(function(d) {
					return d.graphType === 'hidden' ? '' : d.graphType;
				}));

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);


				svg.append("g")
					.style("font-size", "18px")
					.attr("class", "y axis left-most")
					.call(yAxis);


				var vakken = svg.selectAll(".graphType")
					.data(data)
					.enter().append("g")
					.attr("class", "bar")
					.attr("transform", function(d) {
						console.log(y(d.graphType) + "....");
						console.log(d);
						return "translate(0," + y(d.graphType) + ")";
					})
					.style("display", function(d) {
						// console.log(d.graphType)
						return d.graphType == 'hidden' ? 'none' : 'block';
					})

				var bars = vakken.selectAll("rect")
					.data(function(d) {
						return d.boxes;
					})
					.enter().append("g").attr("class", "subbar");

				bars.append("rect")
					.attr("height", y.bandwidth())
					.attr("x", function(d) {
						return x(d.x0);
					})
					.attr("width", function(d) {
						return x(d.x1) - x(d.x0);
					})
					.style("fill", function(d) {
						console.log(d.graphType)
						return d.graphType == 'ARRIVALS' ? color(d.name) : (d.graphType == 'VACANT' ? vacantColor(d.name) : departGraphColor(d.name));
					})
					.on({
						"mouseover": function(e) {
							//console.log(e)
							/* do stuff */
						},
						"mouseout": function(e) { /* do stuff */ },
						"click": function(e) {
							console.log(e);
							document.getElementById("message").innerHTML = "<h2>Clicked On:- " + JSON.stringify(e) + "</h2>";

							/* do stuff */
						},
					});

				bars
					//.append("div")
					.append("text")
					.attr("x", function(d) {
						return ((x(d.x0) + x(d.x1)) / 2) - 10;
					})
					// .attr("x", x.rangeBand() / 2)
					.attr("y", y.bandwidth() / 2)
					.attr("dy", "0.5em")
					.attr("dx", "0.5em")
					.style("font-size", "15px")
					.style("text-anchor", "begin")
					.text(function(d) {
						return d.n !== 0 ? d.n : ""
					});

				svg.append("g")
					.attr("class", "y axis")
					.append("line")
					.attr("x1", x(0))
					.attr("x2", x(0))
					.attr("y2", height);


				/***************** RIGHT SIDE LEGEND *************************/

				var leftSideLegend = d3.select("#left-side-legend");

				var leftSideLegendColor = d3.scaleOrdinal()
					.range(["#B5D398", "#557B2F", "#DC3535", "#EC9319", "#DC3535", "#DAA0A1"])
					.domain(["Perfomed", "EC", "DIRTY", "PICKUP", "PERFOMED", "LATECHECKOUT"]);

				// leftSideLegend.append("p")
				//   .text("csc");

				var leftSideLegendList = leftSideLegend.append("ul");

				var leftSideLegendEntries = leftSideLegendList.selectAll("li")
					.data(leftSideLegendColor.domain().slice())
					.enter()
					.append("li");

				// append rectangle and text:
				leftSideLegendEntries.append("span")
					.attr("class", "rect")
					.style("background-color", leftSideLegendColor);

				leftSideLegendEntries.append("span")
					.attr("class", "label")
					.html(function(d) {
						return d;
					})


				/***************** RIGHT SIDE LEGEND *************************/

				var rightSideLegend = d3.select("#right-side-legend");

				var rightSideLegendColor = d3.scaleOrdinal()
					.range(["#B7D599", "#B7D599", "#AE2828", "#B7D599"])
					.domain(["Remaining", "CLEAN", "REMAINING", "SOMETHING ELSE"]);


				var rightSideLegendList = rightSideLegend.append("ul");

				var rightSideLegendEntries = rightSideLegendList.selectAll("li")
					.data(rightSideLegendColor.domain().slice())
					.enter()
					.append("li");


				// append rectangle and text:
				rightSideLegendEntries.append("span")
					.attr("class", "rect")
					.style("background-color", rightSideLegendColor);

				rightSideLegendEntries.append("span")
					.attr("class", "label")
					.html(function(d) {
						return d;
					});


			}

			reportWindowSize();

			function resize() {
				d3.select('#analytics-chart').selectAll('svg').remove();
				d3.select('#left-side-legend').selectAll('ul').remove();
				d3.select('#right-side-legend').selectAll('ul').remove();
				reportWindowSize();
			};

			window.onresize = resize;


		};
		$timeout(function() {
			renderGraph();
		}, 100);

	}
]);