angular.module('sntRover').service('rvAnalyticsHelperSrv', ['$q', function($q) {

	this.processBiDirectionalChart = function(chartDetails) {

		chartDetails.chartData.data.forEach(function(chart) {

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
					chartName: chartName,
					elementId: chartName + "-" + item.type
				}
			});
		});

		// get minimum and maximum values to plot
		chartDetails.min_val = d3.min(chartDetails.chartData.data, function(chart) {
			return chart.boxes["0"].xOrigin;
		});
		chartDetails.max_val = d3.max(chartDetails.chartData.data, function(chart) {
			return chart.boxes[chart.boxes.length - 1].xFinal;
		});


		return chartDetails;
	};


	this.drawBarsOfBidirectonalChart = function(barData) {
		var svg = barData.svg,
			yScale = barData.yScale,
			xScale = barData.xScale,
			chartDetails = barData.chartDetails,
			colorScheme = barData.colorScheme,
			maxValue = barData.maxValue;

		var vakken = svg.selectAll(".type")
			.data(chartDetails.chartData.data)
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
			.attr("class", "subbar")
			.attr("id", function(item) {
				return item.elementId;
			});

		bars.append("rect")
			.attr("height", yScale.bandwidth())
			.attr("x", function(item) {
				return xScale(item.xOrigin);
			})
			.attr("width", function(item) {
				return xScale(item.xFinal) - xScale(item.xOrigin);
			})
			.style("fill", function(item) {
				console.log(item.chartName);
				console.log(colorScheme[item.chartName + 'ColorScheme']);
				return colorScheme[item.chartName + 'ColorScheme'](item.type);
			})
			.on("click", function(e) {
				chartDetails.onBarChartClick(e);
			});

		var isSmallBarItem = function(item) {
			var itemPercantage = item.count * 100 / maxValue;
			return (itemPercantage < 8 || itemPercantage > 4 && item.count < 10);
		};
		bars.append("text")
			.attr("x", function(item) {
				return ((xScale(item.xOrigin) + xScale(item.xFinal)) / 2);
			})
			.attr("y", function(item) {
				return yScale.bandwidth() / 2;
			})
			.attr("dy", function(item) {
				return isSmallBarItem(item) ? -1 * (yScale.bandwidth() / 2 + 10) : "0.5em";
			})
			.attr("dx", function(item) {
				return isSmallBarItem(item) && item.xOrigin < 0 ? "-0.5em" : "0em";
			})
			.style("font-size", function(item) {
				return isSmallBarItem(item) ? "10px" : "15px";
			})
			.style("text-anchor", "middle")
			.text(function(item) {
				return item.count !== 0 ? item.count : '';
			});
	};


	this.addRandomNumbersForTesting = function(chartDetails) {
		var combinedItemsCountArray = [];

		_.each(chartDetails.chartData.data, function(chart) {
		    _.each(chart.contents.left_side, function(item) {
		        // to delete
		        item.count = item.count < 3 ?  _.random(20, 100) : item.count;
		        combinedItemsCountArray.push(item.count);
		    });
		    _.each(chart.contents.right_side, function(item) {
		        //to delete
		        item.count = item.count < 3 ?  _.random(20, 100) : item.count;
		        combinedItemsCountArray.push(item.count);
		    });
		});

		var largestItemCount = _.max(combinedItemsCountArray, function(count) {
		    return count;
		});
		return chartDetails;
	};
}]);