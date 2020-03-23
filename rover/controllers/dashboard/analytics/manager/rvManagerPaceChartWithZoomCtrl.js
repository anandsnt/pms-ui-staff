angular.module('sntRover')
	.controller('rvManagerPaceChartWithZoomCtrl', ['$scope',
		function($scope) {

			$scope.drawPaceChartWithZoom = function(data) {

				// sizing information, including margins so there is space for labels, etc
				var margin = {
						top: 40,
						right: 20,
						bottom: 100,
						left: 40
					},
					width = document.getElementById("dashboard-analytics-chart").clientWidth,
					height = 600 - margin.top - margin.bottom,
					marginOverview = {
						top: 530,
						right: margin.right,
						bottom: 20,
						left: margin.left
					},
					heightOverview = 600 - marginOverview.top - marginOverview.bottom;

				// set up a date parsing function for future use
				var parseDate = d3.timeParse("%Y-%m-%d");

				// some colours to use for the bars
				var colour = d3.scaleOrdinal()
					.range(["green", "blue", "red"]);

				// mathematical scales for the x and y axes
				var x = d3.scaleTime()
					.range([0, width]);
				var y = d3.scaleLinear()
					.range([height - 200, 0]);
				var xOverview = d3.scaleTime()
					.range([0, width]);
				var yOverview = d3.scaleLinear()
					.range([heightOverview, 0]);

				// rendering for the x and y axes
				var xAxis = d3.axisBottom()
					.scale(x).tickFormat(function() {
						return ""
					})
					.tickSizeOuter(0)
					.tickSizeInner(0);
				var xAxisBottom = d3.axisBottom()
					.scale(x);
				var yAxis = d3.axisLeft()
					.scale(y);
				var xAxisOverview = d3.axisBottom()
					.scale(xOverview);

				// something for us to render the chart into
				var svg = d3.select("#d3-plot")
					.append("svg") // the overall space
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom);
				var main = svg.append("g")
					.attr("class", "main")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				var overview = svg.append("g")
					.attr("class", "overview")
					.attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");

				// brush tool to let us zoom and pan using the overview chart
				// var brush = d3.brushX()
				//                     .x(xOverview)
				//                     .on("brush", brushed);

				// by habit, cleaning/parsing the data and return a new object to ensure/clarify data object structure
				function parse(d) {
					if (!d.date) {
						return;
					}
					// console.log(d);
					var value = {
						date: parseDate(d.date)
					}; // turn the date string into a date object

					// adding calculated data to each count in preparation for stacking
					var y0 = 0; // keeps track of where the "previous" value "ended"
					value.counts = ["on_the_books", "new", "cancellation"].map(function(name) {
						return {
							name: name,
							y0: name === "cancellation" ? (d[name]) : y0,
							// add this count on to the previous "end" to create a range, and update the "previous end" for the next iteration
							y1: name === "cancellation" ? 0 : (y0 += +d[name])
						};
					});
					// console.log(value.counts);
					// quick way to get the total from the previous calculations
					// value.total = value.counts[value.counts.length - 1].y1;

					var onBooks = _.find(value.counts, function(count) {
						return count.name === 'on_the_books';
					});
					var newBookings = _.find(value.counts, function(count) {
						return count.name === 'new';
					});
					var cancellations = _.find(value.counts, function(count) {
						return count.name === 'cancellation';
					});
					value.total = newBookings.y1;
					value.cancellation = -1 * cancellations.y0;
					// console.log(value.total);
					return value;
				}

				// try {
				// zooming/panning behaviour for overview chart
				function brushed() {
					if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
					var s = d3.event.selection || xOverview.range();
					x.domain(s.map(xOverview.invert, xOverview));
					main.selectAll(".bar.stack")
						.attr("transform", function(d) {
							//console.log(d.date);
							return "translate(" + x(d.date) + ",0)";
						})
					// redraw the x axis of the main chart
					main.select(".x.axis").call(xAxis);
					main.select(".x.axis").call(xAxisBottom);
				}

				var brush = d3.brushX()
					.extent([
						[xOverview.range()[0], 0],
						[xOverview.range()[1], heightOverview]
					])
					// .extent([[0, 0], [width, heightOverview]])
					.on("start brush end", brushed);

				// } catch(e) {
				// 	console.log(e);
				// }


				// d3.csv("ii.csv", function(data) {
				//     console.log(JSON.stringify(data));
				//     var a = [];
				//     _.each(data, function(d) {
				//         a.push(parse(d));
				//     })
				//      console.log(JSON.stringify(a));
				// });
				// setup complete, let's get some data!
				// d3.csv("ii.csv", parse, function(data) {

				_.each(data, function(item){
					item.cancellation = item.cancellation === 0 ? 0 : -1*item.cancellation;
				});
				console.log(data)
				var sampleData = [{
					"date": "2020-02-20",
					"new": "3",
					"cancellation": "-10",
					"on_the_books": "1"
				}, {
					"date": "2019-11-20",
					"new": "8",
					"cancellation": "-5",
					"on_the_books": "2"
				}, {
					"date": "2020-03-21",
					"new": "3",
					"cancellation": "-3",
					"on_the_books": "5"
				}, {
					"date": "2019-09-29",
					"new": "5",
					"cancellation": "-2",
					"on_the_books": "5"
				}, {
					"date": "2019-11-16",
					"new": "1",
					"cancellation": "-2",
					"on_the_books": "4"
				}, {
					"date": "2020-02-09",
					"new": "4",
					"cancellation": "-1",
					"on_the_books": "6"
				}, {
					"date": "2019-12-14",
					"new": "8",
					"cancellation": "0",
					"on_the_books": "3"
				}, {
					"date": "2020-01-13",
					"new": "6",
					"cancellation": "0",
					"on_the_books": "8"
				}, {
					"date": "2020-01-16",
					"new": "6",
					"cancellation": "-3",
					"on_the_books": "8"
				}, {
					"date": "2019-10-21",
					"new": "6",
					"cancellation": "-1",
					"on_the_books": "7"
				}, {
					"date": "2020-01-11",
					"new": "2",
					"cancellation": "-1",
					"on_the_books": "4"
				}, {
					"date": "2020-01-31",
					"new": "9",
					"cancellation": "-2",
					"on_the_books": "6"
				}, {
					"date": "2019-10-18",
					"new": "7",
					"cancellation": "0",
					"on_the_books": "4"
				}, {
					"date": "2019-10-31",
					"new": "3",
					"cancellation": "-2",
					"on_the_books": "7"
				}, {
					"date": "2019-12-19",
					"new": "8",
					"cancellation": "-4",
					"on_the_books": "7"
				}, {
					"date": "2020-02-10",
					"new": "5",
					"cancellation": "-1",
					"on_the_books": "10"
				}, {
					"date": "2020-01-20",
					"new": "2",
					"cancellation": "-4",
					"on_the_books": "5"
				}, {
					"date": "2020-02-19",
					"new": "2",
					"cancellation": "-1",
					"on_the_books": "1"
				}, {
					"date": "2020-03-04",
					"new": "4",
					"cancellation": "-3",
					"on_the_books": "6"
				}, {
					"date": "2019-12-27",
					"new": "9",
					"cancellation": "-1",
					"on_the_books": "3"
				}, {
					"date": "2020-03-04",
					"new": "7",
					"cancellation": "-3",
					"on_the_books": "4"
				}, {
					"date": "2019-09-24",
					"new": "2",
					"cancellation": "-4",
					"on_the_books": "1"
				}, {
					"date": "2019-11-16",
					"new": "4",
					"cancellation": "-3",
					"on_the_books": "10"
				}, {
					"date": "2020-02-27",
					"new": "7",
					"cancellation": "-1",
					"on_the_books": "9"
				}, {
					"date": "2019-11-19",
					"new": "2",
					"cancellation": "-1",
					"on_the_books": "4"
				}, {
					"date": "2019-10-30",
					"new": "8",
					"cancellation": "-5",
					"on_the_books": "9"
				}, {
					"date": "2020-01-22",
					"new": "8",
					"cancellation": "-5",
					"on_the_books": "7"
				}, {
					"date": "2019-12-17",
					"new": "5",
					"cancellation": "-4",
					"on_the_books": "2"
				}, {
					"date": "2019-11-08",
					"new": "6",
					"cancellation": "0",
					"on_the_books": "10"
				}, {
					"date": "2019-10-13",
					"new": "6",
					"cancellation": "0",
					"on_the_books": "2"
				}, {
					"date": "2019-09-29",
					"new": "9",
					"cancellation": "-5",
					"on_the_books": "4"
				}, {
					"date": "2019-10-30",
					"new": "1",
					"cancellation": "-1",
					"on_the_books": "9"
				}, {
					"date": "2019-10-30",
					"new": "6",
					"cancellation": "-2",
					"on_the_books": "9"
				}, {
					"date": "2019-12-04",
					"new": "3",
					"cancellation": "-2",
					"on_the_books": "10"
				}, {
					"date": "2019-09-27",
					"new": "4",
					"cancellation": "-4",
					"on_the_books": "10"
				}, {
					"date": "2020-03-14",
					"new": "1",
					"cancellation": "-1",
					"on_the_books": "5"
				}, {
					"date": "2019-10-15",
					"new": "5",
					"cancellation": "-4",
					"on_the_books": "1"
				}, {
					"date": "2020-02-13",
					"new": "8",
					"cancellation": "0",
					"on_the_books": "3"
				}, {
					"date": "2020-03-03",
					"new": "10",
					"cancellation": "-5",
					"on_the_books": "7"
				}, {
					"date": "2019-12-14",
					"new": "8",
					"cancellation": "0",
					"on_the_books": "9"
				}, {
					"date": "2020-01-23",
					"new": "6",
					"cancellation": "-2",
					"on_the_books": "10"
				}, {
					"date": "2019-12-04",
					"new": "8",
					"cancellation": "-1",
					"on_the_books": "3"
				}, {
					"date": "2019-11-07",
					"new": "5",
					"cancellation": "-5",
					"on_the_books": "4"
				}, {
					"date": "2020-03-08",
					"new": "1",
					"cancellation": "-3",
					"on_the_books": "5"
				}, {
					"date": "2020-02-24",
					"new": "5",
					"cancellation": "0",
					"on_the_books": "2"
				}, {
					"date": "2019-10-10",
					"new": "1",
					"cancellation": "-1",
					"on_the_books": "3"
				}, {
					"date": "2020-03-17",
					"new": "7",
					"cancellation": "-1",
					"on_the_books": "3"
				}, {
					"date": "2019-12-16",
					"new": "8",
					"cancellation": "0",
					"on_the_books": "6"
				}, {
					"date": "2019-12-22",
					"new": "3",
					"cancellation": "-3",
					"on_the_books": "8"
				}, {
					"date": "2019-09-24",
					"new": "7",
					"cancellation": "-4",
					"on_the_books": "4"
				}, {
					"date": "2020-02-09",
					"new": "4",
					"cancellation": "-3",
					"on_the_books": "10"
				}, {
					"date": "2020-03-14",
					"new": "6",
					"cancellation": "-1",
					"on_the_books": "5"
				}, {
					"date": "2019-12-12",
					"new": "5",
					"cancellation": "-4",
					"on_the_books": "4"
				}, {
					"date": "2020-02-12",
					"new": "8",
					"cancellation": "-2",
					"on_the_books": "1"
				}, {
					"date": "2019-11-12",
					"new": "7",
					"cancellation": "-2",
					"on_the_books": "7"
				}, {
					"date": "2020-01-15",
					"new": "4",
					"cancellation": "0",
					"on_the_books": "5"
				}, {
					"date": "2019-10-06",
					"new": "6",
					"cancellation": "-3",
					"on_the_books": "4"
				}, {
					"date": "2020-01-01",
					"new": "9",
					"cancellation": "-2",
					"on_the_books": "9"
				}, {
					"date": "2020-02-17",
					"new": "2",
					"cancellation": "-4",
					"on_the_books": "8"
				}, {
					"date": "2020-03-14",
					"new": "5",
					"cancellation": "-5",
					"on_the_books": "5"
				}];

				//var sampleData = data;
				var data = [];
				_.each(sampleData, function(d) {
					data.push(parse(d));
				});
				//console.log(JSON.stringify(data));
				//console.log(JSON.stringify(data));
				// data ranges for the x and y axes
				x.domain(d3.extent(data, function(d) {
					//console.log(d);
					return d.date;
				}));

				var maxYValue = d3.max(data, function(d) {
					return d.total;
				});
				var minYValue = d3.max(data, function(d) {
					return d.cancellation;
				})

				y.domain([-1 * minYValue, maxYValue]);


				xOverview.domain(x.domain());
				yOverview.domain(y.domain());

				// data range for the bar colours
				// (essentially maps attribute names to colour values)
				// console.log(d3.keys(data[0]));
				colour.domain(["on_the_books", "new", "cancellation"]);

				// draw the axes now that they are fully set up
				main.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + (height - 150) + ")")
					.call(xAxisBottom);

				main.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + y(0) + ")")
					.call(xAxis);

				// main.append("g")
				//     .attr("class", "x axis")
				//     .attr("transform", "translate(0," + height + ")")
				//     .call(xAxisBottom);

				main.append("g")
					.attr("class", "y axis")
					.call(yAxis);
				overview.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + heightOverview + ")")
					.call(xAxisOverview);

				// draw the bars
				main.append("g")
					.attr("class", "bars")
					// a group for each stack of bars, positioned in the correct x position
					.selectAll(".bar.stack")
					.data(data)
					.enter().append("g")
					.attr("class", "bar stack")
					.attr("transform", function(d) {
						return "translate(" + x(d.date) + ",0)";
					})
					// a bar for each value in the stack, positioned in the correct y positions
					.selectAll("rect")
					.data(function(d) {
						return d.counts;
					})
					.enter().append("rect")
					.attr("class", "bar")
					.attr("width", 6)
					.attr("y", function(d) {
						return y(d.y1);
					})
					.attr("height", function(d) {

						return y(d.y0) - y(d.y1);
					})
					.style("cursor", "pointer")
					.style("fill", function(d) {
						// console.log(d.name);
						return colour(d.name);
					}).on("mouseover", function() {
						tooltip.style("display", "block");
					})
					.on("mouseout", function() {
						tooltip.style("display", "none");
					})
					.on("mousemove", function(d) {
						var xPosition = d3.mouse(this)[0] - 15;
						var yPosition = d3.mouse(this)[1] - 25;
						// tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
						//console.log(d)
						tooltip.select("text").text(d.y1 - d.y0);
					});
				// Prep the tooltip bits, initial display is hidden
				var tooltip = svg.append("g")
					.attr("class", "tooltip")
					.style("display", "none");

				tooltip.append("rect")
					.attr("width", 50)
					.attr("height", 50)
					.attr("fill", "orange")
					.style("opacity", 0.5)
					.attr("transform", "translate(" + width / 2 + "," + 0 + ")");;

				tooltip.append("text")
					.attr("x", 15)
					.attr("dy", "1.2em")
					.style("text-anchor", "middle")
					.style("color", "black")
					.attr("font-size", "30px")
					.attr("font-weight", "bold")
					.attr("transform", "translate(" + width / 2 + "," + 0 + ")");;

				overview.append("g")
					.attr("class", "bars")
					.selectAll(".bar")
					.data(data)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function(d) {
						return xOverview(d.date) - 3;
					})
					.attr("width", 6)
					.attr("y", function(d) {
						// console.log(d)
						return yOverview(d.total);
					})
					.style("fill","black")
					.attr("height", function(d) {
						// console.log(d);
						// console.log(yOverview(d.total));
						// console.log(yOverview(d.cancellation));
						// console.log(heightOverview);

						// return (yOverview(d.cancellation + d.total));
						return (heightOverview - (yOverview(d.cancellation + d.total)));
					});

				// add the brush target area on the overview chart
				overview.append("g")
					.attr("class", "x brush")
					.call(brush)
					.on("click", brushed)
					.selectAll("rect")
					// -6 is magic number to offset positions for styling/interaction to feel right
					.attr("y", -6)
					// need to manually set the height because the brush has
					// no y scale, i.e. we should see the extent being marked
					// over the full height of the overview chart
					.attr("height", heightOverview + 7); // +7 is magic number for styling

				// });
			

			};
		}
	]);