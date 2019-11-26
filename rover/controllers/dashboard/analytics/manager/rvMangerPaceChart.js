angular.module('sntRover')
	.controller('rvMangerPaceChart', ['$scope', 'sntActivity', '$timeout', '$filter', 'rvManagersAnalyticsSrv', 'rvAnalyticsHelperSrv', '$rootScope',
		function($scope, sntActivity, $timeout, $filter, rvManagersAnalyticsSrv, rvAnalyticsHelperSrv, $rootScope) {

			var checkIfDayIsToday = function(dateToCompare) {
				var today = $rootScope.businessDate;
				var date = moment(dateToCompare).format('YYYY-MM-DD');

				return today === date;
			};
			$scope.drawPaceChart = function(chartData) {

				var chartDataMaxArray = [];

				// find maximum value that will appear in both side of X- axis
				_.each(chartData, function(data) {

					if (parseInt(data.new) + parseInt(data.on_the_books) > parseInt(data.cancellation)) {
						chartDataMaxArray.push(parseInt(data.new) + parseInt(data.on_the_books));
					} else {
						chartDataMaxArray.push(parseInt(data.cancellation));
					}
					// consider cancellation as -ve
					if (data.cancellation > 0) {
						data.cancellation = -1 * data.cancellation;
					}

				});

				var data = chartData;
				var stackKeys = ["on_the_books", "new", "cancellation"];
				var stackKeysTags = ["On the books", "New", "Cancellation"];

				var series = d3.stack()
					.keys(stackKeys)
					.offset(d3.stackOffsetDiverging)
					(data);
				var maxValueInBothDirections = _.max(chartDataMaxArray);

				maxValueInBothDirections = maxValueInBothDirections + 1; // to add some extra spacing

				var margin = {
						top: 20,
						right: 30,
						bottom: 30,
						left: 60
					},
					width = document.getElementById("analytics-chart").clientWidth,
					height = 500 - margin.top - margin.bottom;

				var svg = d3.select("#d3-plot").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var xScale = d3.scaleBand()
					.domain(data.map(function(d) {
						return d.date;
					}))
					.rangeRound([margin.left, width - 350])
					.padding(0.5);

				var yScale = d3.scaleLinear()
					.domain([-1 * maxValueInBothDirections, maxValueInBothDirections])
					.rangeRound([height - margin.bottom, margin.top]);

				var colors = ["#4185F4", "#6AA84F", "#FF0A00"];

				svg.append("g")
					.selectAll("g")
					.data(series)
					.enter().append("g")
					.attr("fill", function(d, i) {
						return colors[i];
					})
					.selectAll("rect")
					.data(function(d) {
						return d;
					})
					.enter()
					.append("rect")
					.attr("class", "rect-bars")
					.attr("width", xScale.bandwidth)
					.attr("x", function(d) {
						return xScale(d.data.date);
					})
					.attr("y", function(d) {
						return yScale(d[1]);
					})
					.style("cursor", "pointer")
					.on("mouseover", function() {
						tooltip.style("display", null);
					})
					.on("mouseout", function() {
						tooltip.style("display", "none");
					})
					.on("mousemove", function(d) {
						var xPosition = d3.mouse(this)[0] - 15;
						var yPosition = d3.mouse(this)[1] - 25;

						tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
						tooltip.select("text").text(d[1] - d[0]);
					});

				// Add transition before setting height for animation
				d3.selectAll(".rect-bars")
					.transition()
					.duration(800)
					.attr("height", function(d) {
						return yScale(d[0]) - yScale(d[1]);
					});

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

				var xAxis = d3.axisBottom(xScale)
					.tickSizeOuter(0)
					.tickSizeInner(0)
					.tickFormat(function() {
						return "";
					});

				var xAxisBottom = d3.axisBottom(xScale)
					.tickSizeOuter(0)
					.tickFormat(function(date) {
						if (checkIfDayIsToday(date)) {
							return "Today";
						}

						return moment(date).format('DD MMM');
					})
					.tickPadding(20)
					.tickSizeInner(0);

				var yAxis = d3.axisLeft(yScale)
					.tickSizeOuter(0)
					.tickPadding(10)
					.tickSizeInner(0);

				// Original X axis
				svg.append("g")
					.attr("transform", "translate(0," + yScale(0) + ")")
					.call(xAxis);
				// Original Y axis
				svg.append("g")
					.attr("transform", "translate(" + margin.left + ",0)")
					.call(yAxis);
				// Extra X axis to show ticks
				svg.append("g")
					.attr("transform", "translate(0," + yScale(-1 * maxValueInBothDirections) + ")")
					.call(xAxisBottom)
					.selectAll("text")
					.style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", data.length > 20 ? "-.7em" : "-.15em")
					.attr("transform", "rotate(-65)")
					.attr("fill", function(date) {
						return checkIfDayIsToday(date) ? "#FFAB18" : "#000";
					})
					.attr("font-weight", function(date) {
						return checkIfDayIsToday(date) ? "bold" : "normal";
					});

				// Draw rect on top of the original X axis
				rvAnalyticsHelperSrv.drawRectLines({
					svg: svg,
					xOffset: margin.left,
					height: 4,
					width: width - 350,
					yOffset: yScale(0)
				});
				// Draw rect on top of the extra X axis
				rvAnalyticsHelperSrv.drawRectLines({
					svg: svg,
					xOffset: margin.left,
					height: 4,
					width: width - 350,
					yOffset: yScale(-1 * maxValueInBothDirections)
				});
				// Draw rect on top of the Y axis
				rvAnalyticsHelperSrv.drawRectLines({
					svg: svg,
					xOffset: margin.left,
					height: yScale(-1 * maxValueInBothDirections) - yScale(maxValueInBothDirections),
					width: 4,
					yOffset: margin.top
				});

				var legend = svg.selectAll(".legend")
					.data(colors)
					.enter().append("g")
					.attr("class", "legend")
					.attr("transform", function(d, i) {
						return "translate(-300," + i * 30 + ")";
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
					.style("font-size", "15px")
					.text(function(d, i) {
						return rvAnalyticsHelperSrv.textTruncate(stackKeysTags[i], 35, '...');
					});
			};
		}
	]);