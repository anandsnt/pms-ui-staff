angular.module('sntRover').service('rvAnalyticsHelperSrv', ['$q', function($q) {

	this.processBiDirectionalChart = function(chartDetails) {

		chartDetails.chartData.data.forEach(function(chart) {

			var chartName = chart.type;

			// // sort left side items in descending order
			// chart.contents.left_side = _.sortBy(chart.contents.left_side, function(item) {
			// 	return -1 * item.count;
			// });
			// // sort right side items in ascending order
			// chart.contents.right_side = _.sortBy(chart.contents.right_side, function(item) {
			// 	return item.count;
			// });
			// Join left side and right arrays and start chart from left side
			var combinedArray = chart.contents.left_side.concat(chart.contents.right_side);

			// DEBUG CODE
			// chart.contents.left_side = _.each(chart.contents.left_side, function(item, index) {
			// 	item.count = item.count < 10 ? 30 : item.count; 
			// });
			// chart.contents.right_side = _.each(chart.contents.right_side, function(item, index) {
			// 	item.count = item.count < 10 ? 30 : item.count; 
			// });
			// DEBUG CODE


			// Let count be 90, 40, 30 - based on calculation below the following will the calculated values
			// item 1 = { xOrigin : -1 * ( 90 + 40 + 30) = -160 , xFinal : -1 * (160 - 90) = -70 }
			// item 2 = { xOrigin : item 1 xFinal = -70 , xFinal : -1 * (70-40) = -30 }
			// item 2 = { xOrigin : -30 , xFinal : 0 }

			var totalCountInLeftSide =  _.reduce(chart.contents.left_side, function(totalCount, item) {              
				return item.count + totalCount;            
			}, 0);

			//chart.maxValueInOneSie = totalCountInLeftSide > totalCountInRightSide ? totalCountInLeftSide : totalCountInRightSide;

			chart.contents.left_side = _.each(chart.contents.left_side, function(item, index) {
				chartDetails[item.type + "_" + chartName + "_count"] = item.count;
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
			// item 2 = { xOrigin : item 1 xFinal = 10 , xFinal : item 2 xOrigin + count = 10 + 25 = 35 }
			// item 2 = { xOrigin : item 2 xFinal = 35 , xFinal : item 3 xOrigin + count = 35 + 35 = 70 }

			chart.contents.right_side = _.each(chart.contents.right_side, function(item, index) {
				chartDetails[item.type + "_" + chartName + "_count"] = item.count;
				// For first item X origin is 0 and xFinal is count 
				if (index === 0) {
					item.origin = 0;
					item.xFinal = item.count;
				} else {
					// For all other elements, X origin  is count of previous item and X final is count of the item
					item.origin = chart.contents.right_side[index - 1].xFinal;
					item.xFinal = item.origin + item.count;
				}
			});

			var totalCountInRightSide = chart.contents.right_side.length ? chart.contents.right_side[chart.contents.right_side.length - 1].xFinal : 0;

			chart.maxValueInOneSide = totalCountInLeftSide > totalCountInRightSide ? totalCountInLeftSide : totalCountInRightSide;

			chart.boxes = combinedArray.map(function(item) {
				return {
					type: item.type,
					label: item.label,
					xOrigin: item.origin,
					xFinal: item.xFinal,
					count: item.count,
					chartName: chartName,
					elementId: item.type === "pending_inspected_rooms" ? "rooms-short" : chartName + "-" + item.type
				};
			});
		});

		var barGraphWithMaxValue = _.max(chartDetails.chartData.data, function(chartDetail) {
			return chartDetail.maxValueInOneSide;
		});

		chartDetails.maxValueInOneSide = barGraphWithMaxValue.maxValueInOneSide;

		return chartDetails;
	};

	this.addLegendItems = function(cssClassMappings, parentElement, legendData, onLegendClick) {

		parentElement
			.append("dt")
			.attr("class", "legend-title")
			.attr("id", legendData.id)
			.html(legendData.title)
			.style("margin-top", legendData.margin_top + "px");

		_.each(legendData.items, function(item) {
			parentElement
				.append("dd")
				.attr("class", "legend-item")
				.attr("id", item.id).append("span")
				.attr("class", function(label) {
					return cssClassMappings[item.label];
				})
				.html(item.count);

			d3.select("#" + item.id)
				.append("span")
				.attr("class", "bar-label")
				.html(item.label)
		});
	};

	this.addLegendItemsToChart = function(legendItem) {

		// cssClassMappings, parentElement, legendData, onLegendClick

		legendItem.parentElement
			.append("dt")
			.attr("class", "legend-title")
			.attr("id", legendItem.legendData.id)
			.html(legendItem.legendData.title)
			.style("margin-top", legendItem.legendData.margin_top + "px");

		_.each(legendItem.legendData.items, function(item) {
			legendItem.parentElement
				.append("dd")
				.attr("class", "legend-item")
				.attr("id", item.id)
				.append("span")
				.attr("id", item.id + "-count")
				.attr("class", function(label) {
					return item.class;
				})
				.html(item.count);

			d3.select("#" + item.id)
				.append("span")
				.attr("class", "bar-label")
				.attr("id", item.id + "-label")
				.html(item.label);

			var onClickEvent = function() {
				legendItem.onLegendClick(item.item_name);
			};

			$("#" + item.id + "-label").click(onClickEvent);
			$("#" + item.id + "-count").click(onClickEvent);
		});
	};

	this.drawBarChart = function(barData) {
		var svg = barData.svg,
			yScale = barData.yScale,
			xScale = barData.xScale,
			chartDetails = barData.chartDetails,
			maxValue = barData.maxValue,
			cssClassMappings = barData.cssClassMappings,
			colorMappings = barData.colorMappings;

		var vakken = svg.selectAll(".type")
			.data(chartDetails.chartData.data)
			.enter()
			.append("g")
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
			.attr("class", function(item) {
				return cssClassMappings ? cssClassMappings[item.chartName + "_" + item.type] : "";
			})
			.attr("id", function(item) {
				return item.elementId;
			});

		bars.append("rect")
			.attr("class", function (item) {
				return (item.type === "pending_inspected_rooms"  || item.type === "overbooked_rooms")? "bar-warning rect-bars" : "rect-bars";
			})
			.attr("height", yScale.bandwidth())
			.attr("x", function(item) {
				return xScale(item.xOrigin);
			})
			.attr("fill", function(item) {
				var fillColor = colorMappings[item.chartName + "_" + item.type].fill;

				return "url(#" + fillColor + ")"
			})
			.attr("onmouseover", function(item) {
				var mouseoverColor = colorMappings[item.chartName + "_" + item.type].onmouseover_fill;

				return "evt.target.setAttribute('fill', 'url(#" + colorMappings[item.chartName + "_" + item.type].onmouseover_fill + " )');"
			})
			.attr("onmouseout", function(item) {
				var mouseoutColor = colorMappings[item.chartName + "_" + item.type].onmouseout_fill;

				return "evt.target.setAttribute('fill', 'url(#" + mouseoutColor + " )');"
			})
			.on("click", function(e) {
				var clickeElement = e.elementId ? e.elementId.replace("-", "_") : "";

				barData.onBarChartClick(clickeElement);
			});

		d3.selectAll(".rect-bars")
			.transition()
			.duration(300)
			.attr("width", function(item) {
				return xScale(item.xFinal) - xScale(item.xOrigin);
			});
	};

	this.drawRectLines = function(rect) {
		rect.svg.append("g")
			.append("rect")
			.attr("class", "chart-breakpoint-line")
			.attr("x", rect.xOffset)
			.attr("y", rect.yOffset)
			.attr("height", rect.height)
			.attr("width", rect.width);
	};

	this.gradientMappings = {
		"greenLight": {
			"legend_class": "bar bar-green bar-light",
			"fill": "greenLight",
			"onmouseover_fill": "greenLightHover",
			"onmouseout_fill": "greenLight"
		},
		"greenDark": {
			"legend_class": "bar bar-green bar-dark",
			"fill": "greenDark",
			"onmouseover_fill": "greenDarkHover",
			"onmouseout_fill": "greenDark"
		},
		"green": {
			"legend_class": "bar bar-green",
			"fill": "green",
			"onmouseover_fill": "greenHover",
			"onmouseout_fill": "green"
		},
		"redLight": {
			"legend_class": "bar bar-red bar-light",
			"fill": "redLight",
			"onmouseover_fill": "redLightHover",
			"onmouseout_fill": "redLight"
		},
		"red": {
			"legend_class": "bar bar-red",
			"fill": "red",
			"onmouseover_fill": "redHover",
			"onmouseout_fill": "red"
		},
		"redDark": {
			"legend_class": "bar bar-red bar-dark",
			"fill": "redDark",
			"onmouseover_fill": "redDarkHover",
			"onmouseout_fill": "redDark"
		},
		"orange": {
			"legend_class": "bar bar-orange",
			"fill": "orange",
			"onmouseover_fill": "orangeHover",
			"onmouseout_fill": "orange"
		},
		"blueLight": {
			"legend_class": "bar bar-blue bar-light",
			"fill": "blueLight",
			"onmouseover_fill": "blueLightHover",
			"onmouseout_fill": "blueLight"
		},
		"blue": {
			"legend_class": "bar bar-blue",
			"fill": "blue",
			"onmouseover_fill": "blueHover",
			"onmouseout_fill": "blue"
		},
		"warning": {
			"legend_class": "bar bar-warning",
			"id": "room_short",
			"rect_class": "bar-warning"
		}
	};

	this.constructColorMappings = function(item_name, color) {
		return _.extend({
			item_name: item_name
		}, this.gradientMappings[color]);
	};

	this.addTextsToChart = function(textData) {
		textData.svg.append("text")
			.attr("x", textData.xOffset)
			.attr("y", textData.yOffset)
			.attr("dy", ".35em")
			.attr("class", "chart-area-label")
			.text(textData.label);
	};

	this.getYAxisValues = function(axisValues, x, y) {

		var yAxisValues = [{
				"type": "occupany",
				"label": "",
				"xOffset": x(0),
				"yOffset": y(0)
			}, {
				"type": "occupany",
				"label": "25",
				"xOffset": x(0),
				"yOffset": y(0.1)
			}, {
				"type": "occupany",
				"label": "50",
				"xOffset": x(0),
				"yOffset": y(0.2)
			}, {
				"type": "occupany",
				"label": "75",
				"xOffset": x(0),
				"yOffset": y(0.3)
			}, {
				"type": "occupany",
				"label": "",
				"xOffset": x(0),
				"yOffset": y(0.4)
			}, {
				"type": "occupany",
				"label": "25",
				"xOffset": x(0),
				"yOffset": y(-0.1)
			}, {
				"type": "occupany",
				"label": "50",
				"xOffset": x(0),
				"yOffset": y(-0.2)
			}, {
				"type": "occupany",
				"label": "75",
				"xOffset": x(0),
				"yOffset": y(-0.3)
			}, {
				"type": "occupany",
				"label": "",
				"xOffset": x(0),
				"yOffset": y(-0.4)
			},

			{
				"type": "revenue",
				"label": axisValues[0],
				"xOffset": x(0),
				"yOffset": y(-0.5)
			}, {
				"type": "revenue",
				"label": axisValues[1],
				"xOffset": x(0),
				"yOffset": y(-0.6)
			}, {
				"type": "revenue",
				"label": axisValues[2],
				"xOffset": x(0),
				"yOffset": y(-0.7)
			}, {
				"type": "revenue",
				"label": axisValues[3],
				"xOffset": x(0),
				"yOffset": y(-0.8)
			}, {
				"type": "revenue",
				"label": axisValues[4],
				"xOffset": x(0),
				"yOffset": y(-0.9)
			}, {
				"type": "revenue",
				"label": axisValues[5],
				"xOffset": x(0),
				"yOffset": y(-1)
			}, {
				"type": "revenue",
				"label": axisValues[0],
				"xOffset": x(0),
				"yOffset": y(0.5)
			}, {
				"type": "revenue",
				"label": axisValues[1],
				"xOffset": x(0),
				"yOffset": y(0.6)
			}, {
				"type": "revenue",
				"label": axisValues[2],
				"xOffset": x(0),
				"yOffset": y(0.7)
			}, {
				"type": "revenue",
				"label": axisValues[3],
				"xOffset": x(0),
				"yOffset": y(0.8)
			}, {
				"type": "revenue",
				"label": axisValues[4],
				"xOffset": x(0),
				"yOffset": y(0.9)
			}, {
				"type": "revenue",
				"label": axisValues[5],
				"xOffset": x(0),
				"yOffset": y(1)
			}
		];

		return yAxisValues;
	};


	this.getXAxisValues = function(axisValues, x, y) {
		var xAxisLabels = [{
			"type": "occupany",
			"label": "",
			"xOffset": x(0),
			"yOffset": y(0)
		}, {
			"type": "occupany",
			"label": "25",
			"xOffset": x(0.1),
			"yOffset": y(0)
		}, {
			"type": "occupany",
			"label": "50",
			"xOffset": x(0.2),
			"yOffset": y(0)
		}, {
			"type": "occupany",
			"label": "75",
			"xOffset": x(0.3),
			"yOffset": y(0)
		}, {
			"type": "occupany",
			"label": "",
			"xOffset": x(0.4),
			"yOffset": y(0)
		}, {
			"type": "occupany",
			"label": "25",
			"xOffset": x(-0.1),
			"yOffset": y(0)
		}, {
			"type": "occupany",
			"label": "50",
			"xOffset": x(-0.2),
			"yOffset": y(0)
		}, {
			"type": "occupany",
			"label": "75",
			"xOffset": x(-0.3),
			"yOffset": y(0)
		}, {
			"type": "occupany",
			"label": "",
			"xOffset": x(-0.4),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[0],
			"xOffset": x(-0.5),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[1],
			"xOffset": x(-0.6),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[2],
			"xOffset": x(-0.7),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[3],
			"xOffset": x(-0.8),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[4],
			"xOffset": x(-0.9),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[5],
			"xOffset": x(-1),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[0],
			"xOffset": x(0.5),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[1],
			"xOffset": x(0.6),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[2],
			"xOffset": x(0.7),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[3],
			"xOffset": x(0.8),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[4],
			"xOffset": x(0.9),
			"yOffset": y(0)
		}, {
			"type": "revenue",
			"label": axisValues[5],
			"xOffset": x(1),
			"yOffset": y(0)
		}];

		return xAxisLabels;
	};

	this.addRandomNumbersForTesting = function(chartDetails) {
		var combinedItemsCountArray = [];

		var workPriority = chartDetails.chartData.label === 'AN_WORKLOAD';;

		if (workPriority) {
			var b = {
				"type": "jena",
				"label": "jena",
				"contents": {
					"right_side": [{
						"type": "early_checkin",
						"label": "AN_EARLY_CHECKIN",
						"count": 0
					}, {
						"type": "checkin",
						"label": "AN_CHECKIN",
						"count": 1
					}, {
						"type": "vip_checkin",
						"label": "AN_VIP_CHECKIN",
						"count": 0
					}, {
						"type": "vip_checkout",
						"label": "AN_VIP_CHECKOUT",
						"count": 0
					}, {
						"type": "checkout",
						"label": "AN_CHECKOUT",
						"count": 0
					}, {
						"type": "late_checkout",
						"label": "AN_LATE_CHECKOUT",
						"count": 0
					}]
				}
			};


			var i = 0;
			var c = {};
			for (i = 0; i <= 10; i++) {
				c[i] = angular.copy(b);
				c[i].type = c[i].type + i;
				c[i].label = c[i].label + i;
				c[i].count = _.random(20, 100);
				chartDetails.chartData.data.push(c[i]);
			}

		}

		_.each(chartDetails.chartData.data, function(chart) {
			_.each(chart.contents.left_side, function(item) {
				// to delete
				item.count = item.count < 3 ? _.random(20, 100) : item.count;
				combinedItemsCountArray.push(item.count);
			});
			_.each(chart.contents.right_side, function(item) {
				// to delete
				if (item.type == "early_checkin") {
					item.count = 30;
				} 
				else if (item.type == "remaining") {
					item.count = 90;
				} else if(item.type === 'inspected'){
					item.count = 15;
				} else{
				item.count = item.count < 3 ? _.random(20, 100) : item.count;

				}
				combinedItemsCountArray.push(item.count);
			});
			// chart.contents.right_side.push(chart.contents.right_side[0]);
			// chart.contents.right_side.push(chart.contents.right_side[0]);
			// chart.contents.right_side.push(chart.contents.right_side[0]);
		});

		// var largestItemCount = _.max(combinedItemsCountArray, function(count) {
		//     return count;
		// });

		return chartDetails;
	};

	this.addDebugDataForFoActivity = function(chartData) {
		_.each(chartData.todays_data, function(item) {
			item.earlyCheckin = item.earlyCheckin < 2 ? _.random(1, 10) : item.earlyCheckin;
			item.checkin = item.checkin < 2 ? _.random(1, 10) : item.checkin;
			item.vipCheckin = item.vipCheckin < 2 ? _.random(1, 10) : item.vipCheckin;
			item.vipCheckout = item.vipCheckout < 2 ? _.random(1, 10) : item.vipCheckout;
			item.checkout = item.checkout < 2 ? _.random(1, 10) : item.checkout;
			item.lateCheckout = item.lateCheckout < 2 ? _.random(1, 10) : item.lateCheckout;
		});

		_.each(chartData.yesterdays_data, function(item) {
			item.earlyCheckin = item.earlyCheckin < 2 ? _.random(1, 10) : item.earlyCheckin;
			item.checkin = item.checkin < 2 ? _.random(1, 10) : item.checkin;
			item.vipCheckin = item.vipCheckin < 2 ? _.random(1, 10) : item.vipCheckin;
			item.vipCheckout = item.vipCheckout < 2 ? _.random(1, 10) : item.vipCheckout;
			item.checkout = item.checkout < 2 ? _.random(1, 10) : item.checkout;
			item.lateCheckout = item.lateCheckout < 2 ? _.random(1, 10) : item.lateCheckout;
		});

		return chartData;
	};

	this.textTruncate = function(str, length, ending) {
		if (length == null) {
			length = 100;
		}
		if (ending == null) {
			ending = '...';
		}
		if (str.length > length) {
			return str.substring(0, length - ending.length) + ending;
		} else {
			return str;
		}
	};

	this.getClosetDayOftheYearInPastYear = function(date) {
		
		var thisYearDate = moment(date);
		var lastYearDateRef = moment(date).subtract(1, 'years');
		var lastYearDate = moment(date).subtract(1, 'years');
		var thisYearDay = thisYearDate.day();
		var lastyearDay = lastYearDate.day();
		var lastYearClosestDay;

		if (thisYearDay == lastyearDay) {
			lastYearClosestDay = lastYearDate;
		} else if (lastyearDay == 0) {
			lastYearClosestDay = thisYearDay <= 3 ? lastYearDate.add(thisYearDay, 'days') : lastYearDate.subtract(thisYearDay, 'days');
		} else if (thisYearDay == 0) {
			lastYearClosestDay = lastyearDay <= 3 ? lastYearDate.subtract(lastyearDay, 'days') : lastYearDate.add(lastyearDay === 6 ? 1 : lastyearDay === 5 ? 2 : 3, 'days');
		} else if (thisYearDay > lastyearDay) {
			lastYearClosestDay = lastYearDate.add(thisYearDay - lastyearDay, 'days');
		} else if (thisYearDay < lastyearDay) {
			lastYearClosestDay = lastYearDate.subtract(lastyearDay - thisYearDay, 'days');
		}
		// day = lastYearClosestDay.day();
		var formatedDay = lastYearClosestDay.format("YYYY-MM-DD");

		return formatedDay;
	};

	this.addChartHeading = function(title, updatedTime) {
		$("#d3-plot").append("<p style='margin-top:10px'><strong>" + title + "</strong></p>");
		$("#d3-plot").append("<p>Last update:" + updatedTime + "</strong></p>");
	};


	this.findSelectedFilter = function(dataSet, selectedItem) {
		var selectedFilter = _.find(dataSet, function(item) {
			return item.value == selectedItem || item.code == selectedItem;
		});

		return selectedFilter;
	};

	this.addToAndSortArray = function(array, newItem) {
		array.push(newItem);
		array = _.sortBy(array, function(item) {
			return item.name;
		});
		return array;
	};

	this.samplePaceData = function () {
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

				var sampleData = [{"new":1,"cancellation":0,"on_the_books":0,"date":"2019-07-12"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-13"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-14"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-15"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-16"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-17"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-18"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-19"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-20"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-21"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-22"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-23"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-24"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-25"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-26"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-27"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-28"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-29"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-30"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-07-31"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-01"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-02"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-03"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-04"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-05"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-06"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-07"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-08"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-09"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-10"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-11"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-12"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-13"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-14"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-15"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-16"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-17"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-18"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-19"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-20"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-21"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-22"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-23"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-24"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-25"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-26"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-27"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-28"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-29"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-30"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-08-31"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-01"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-02"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-03"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-04"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-05"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-06"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-07"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-08"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-09"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-10"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-11"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-12"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-13"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-14"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-15"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-16"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-17"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-18"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-19"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-09-20"},{"new":1,"cancellation":0,"on_the_books":1,"date":"2019-09-21"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-09-22"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-09-23"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-09-24"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-09-25"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-09-26"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-09-27"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-09-28"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-09-29"},{"new":0,"cancellation":1,"on_the_books":2,"date":"2019-09-30"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-01"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-02"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-03"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-04"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-05"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-06"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-07"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-08"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-09"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-10"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-11"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-12"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-13"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-14"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-15"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-16"},{"new":0,"cancellation":0,"on_the_books":1,"date":"2019-10-17"},{"new":1,"cancellation":0,"on_the_books":1,"date":"2019-10-18"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-19"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-20"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-21"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-22"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-23"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-24"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-25"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-26"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-27"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-28"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-29"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-30"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-10-31"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-11-01"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-11-02"},{"new":0,"cancellation":0,"on_the_books":2,"date":"2019-11-03"},{"new":1,"cancellation":0,"on_the_books":2,"date":"2019-11-04"},{"new":0,"cancellation":0,"on_the_books":3,"date":"2019-11-05"},{"new":1,"cancellation":0,"on_the_books":3,"date":"2019-11-06"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-07"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-08"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-09"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-10"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-11"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-12"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-13"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-14"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-15"},{"new":0,"cancellation":0,"on_the_books":4,"date":"2019-11-16"},{"new":1,"cancellation":0,"on_the_books":4,"date":"2019-11-17"},{"new":0,"cancellation":0,"on_the_books":5,"date":"2019-11-18"},{"new":0,"cancellation":0,"on_the_books":5,"date":"2019-11-19"},{"new":10,"cancellation":1,"on_the_books":5,"date":"2019-11-20"},{"new":0,"cancellation":0,"on_the_books":14,"date":"2019-11-21"},{"new":2,"cancellation":0,"on_the_books":14,"date":"2019-11-22"},{"new":0,"cancellation":0,"on_the_books":16,"date":"2019-11-23"},{"new":0,"cancellation":0,"on_the_books":16,"date":"2019-11-24"},{"new":1,"cancellation":1,"on_the_books":16,"date":"2019-11-25"},{"new":1,"cancellation":0,"on_the_books":16,"date":"2019-11-26"},{"new":7,"cancellation":14,"on_the_books":17,"date":"2019-11-27"},{"new":1,"cancellation":0,"on_the_books":10,"date":"2019-11-28"},{"new":2,"cancellation":0,"on_the_books":11,"date":"2019-11-29"},{"new":3,"cancellation":0,"on_the_books":13,"date":"2019-11-30"},{"new":3,"cancellation":1,"on_the_books":16,"date":"2019-12-01"},{"new":1,"cancellation":0,"on_the_books":18,"date":"2019-12-02"},{"new":0,"cancellation":0,"on_the_books":19,"date":"2019-12-03"},{"new":0,"cancellation":0,"on_the_books":19,"date":"2019-12-04"},{"new":0,"cancellation":1,"on_the_books":19,"date":"2019-12-05"},{"new":0,"cancellation":0,"on_the_books":18,"date":"2019-12-06"},{"new":0,"cancellation":0,"on_the_books":18,"date":"2019-12-07"},{"new":3,"cancellation":1,"on_the_books":18,"date":"2019-12-08"},{"new":1,"cancellation":0,"on_the_books":20,"date":"2019-12-09"},{"new":3,"cancellation":0,"on_the_books":21,"date":"2019-12-10"},{"new":0,"cancellation":0,"on_the_books":24,"date":"2019-12-11"},{"new":0,"cancellation":0,"on_the_books":24,"date":"2019-12-12"},{"new":0,"cancellation":0,"on_the_books":24,"date":"2019-12-13"},{"new":0,"cancellation":0,"on_the_books":24,"date":"2019-12-14"},{"new":0,"cancellation":0,"on_the_books":24,"date":"2019-12-15"},{"new":0,"cancellation":0,"on_the_books":24,"date":"2019-12-16"},{"new":0,"cancellation":0,"on_the_books":24,"date":"2019-12-17"},{"new":2,"cancellation":2,"on_the_books":24,"date":"2019-12-18"},{"new":3,"cancellation":2,"on_the_books":24,"date":"2019-12-19"},{"new":1,"cancellation":2,"on_the_books":25,"date":"2019-12-20"},{"new":4,"cancellation":3,"on_the_books":24,"date":"2019-12-21"},{"new":0,"cancellation":0,"on_the_books":25,"date":"2019-12-22"},{"new":1,"cancellation":0,"on_the_books":25,"date":"2019-12-23"},{"new":1,"cancellation":0,"on_the_books":26,"date":"2019-12-24"},{"new":0,"cancellation":0,"on_the_books":27,"date":"2019-12-25"},{"new":0,"cancellation":0,"on_the_books":27,"date":"2019-12-26"},{"new":1,"cancellation":0,"on_the_books":27,"date":"2019-12-27"},{"new":1,"cancellation":0,"on_the_books":28,"date":"2019-12-28"},{"new":0,"cancellation":0,"on_the_books":29,"date":"2019-12-29"},{"new":0,"cancellation":0,"on_the_books":29,"date":"2019-12-30"},{"new":1,"cancellation":0,"on_the_books":29,"date":"2019-12-31"},{"new":0,"cancellation":0,"on_the_books":30,"date":"2020-01-01"},{"new":1,"cancellation":1,"on_the_books":30,"date":"2020-01-02"},{"new":2,"cancellation":0,"on_the_books":30,"date":"2020-01-03"},{"new":0,"cancellation":0,"on_the_books":32,"date":"2020-01-04"},{"new":0,"cancellation":0,"on_the_books":32,"date":"2020-01-05"},{"new":1,"cancellation":0,"on_the_books":32,"date":"2020-01-06"},{"new":0,"cancellation":1,"on_the_books":33,"date":"2020-01-07"},{"new":2,"cancellation":1,"on_the_books":32,"date":"2020-01-08"},{"new":0,"cancellation":0,"on_the_books":33,"date":"2020-01-09"},{"new":3,"cancellation":3,"on_the_books":33,"date":"2020-01-10"},{"new":0,"cancellation":0,"on_the_books":33,"date":"2020-01-11"},{"new":2,"cancellation":2,"on_the_books":33,"date":"2020-01-12"},{"new":0,"cancellation":0,"on_the_books":33,"date":"2020-01-13"},{"new":1,"cancellation":0,"on_the_books":33,"date":"2020-01-14"},{"new":0,"cancellation":0,"on_the_books":34,"date":"2020-01-15"},{"new":1,"cancellation":0,"on_the_books":34,"date":"2020-01-16"},{"new":2,"cancellation":1,"on_the_books":35,"date":"2020-01-17"},{"new":0,"cancellation":0,"on_the_books":36,"date":"2020-01-18"},{"new":0,"cancellation":1,"on_the_books":36,"date":"2020-01-19"},{"new":0,"cancellation":0,"on_the_books":35,"date":"2020-01-20"},{"new":0,"cancellation":0,"on_the_books":35,"date":"2020-01-21"},{"new":1,"cancellation":0,"on_the_books":35,"date":"2020-01-22"},{"new":2,"cancellation":0,"on_the_books":36,"date":"2020-01-23"},{"new":3,"cancellation":1,"on_the_books":38,"date":"2020-01-24"},{"new":2,"cancellation":2,"on_the_books":40,"date":"2020-01-25"},{"new":0,"cancellation":0,"on_the_books":40,"date":"2020-01-26"},{"new":1,"cancellation":0,"on_the_books":40,"date":"2020-01-27"},{"new":1,"cancellation":0,"on_the_books":41,"date":"2020-01-28"},{"new":0,"cancellation":0,"on_the_books":42,"date":"2020-01-29"},{"new":0,"cancellation":0,"on_the_books":42,"date":"2020-01-30"},{"new":5,"cancellation":0,"on_the_books":42,"date":"2020-01-31"},{"new":0,"cancellation":0,"on_the_books":47,"date":"2020-02-01"},{"new":0,"cancellation":0,"on_the_books":47,"date":"2020-02-02"},{"new":0,"cancellation":0,"on_the_books":47,"date":"2020-02-03"},{"new":1,"cancellation":0,"on_the_books":47,"date":"2020-02-04"},{"new":1,"cancellation":0,"on_the_books":48,"date":"2020-02-05"},{"new":2,"cancellation":0,"on_the_books":49,"date":"2020-02-06"},{"new":0,"cancellation":0,"on_the_books":51,"date":"2020-02-07"},{"new":0,"cancellation":0,"on_the_books":51,"date":"2020-02-08"},{"new":1,"cancellation":0,"on_the_books":51,"date":"2020-02-09"},{"new":1,"cancellation":0,"on_the_books":52,"date":"2020-02-10"},{"new":1,"cancellation":2,"on_the_books":53,"date":"2020-02-11"},{"new":3,"cancellation":0,"on_the_books":52,"date":"2020-02-12"},{"new":2,"cancellation":0,"on_the_books":55,"date":"2020-02-13"},{"new":2,"cancellation":0,"on_the_books":57,"date":"2020-02-14"},{"new":0,"cancellation":0,"on_the_books":59,"date":"2020-02-15"},{"new":1,"cancellation":0,"on_the_books":59,"date":"2020-02-16"},{"new":3,"cancellation":2,"on_the_books":60,"date":"2020-02-17"},{"new":1,"cancellation":0,"on_the_books":61,"date":"2020-02-18"},{"new":2,"cancellation":0,"on_the_books":62,"date":"2020-02-19"},{"new":1,"cancellation":0,"on_the_books":64,"date":"2020-02-20"},{"new":2,"cancellation":1,"on_the_books":65,"date":"2020-02-21"},{"new":1,"cancellation":0,"on_the_books":66,"date":"2020-02-22"},{"new":1,"cancellation":0,"on_the_books":67,"date":"2020-02-23"},{"new":14,"cancellation":1,"on_the_books":68,"date":"2020-02-24"},{"new":1,"cancellation":0,"on_the_books":81,"date":"2020-02-25"},{"new":0,"cancellation":0,"on_the_books":82,"date":"2020-02-26"},{"new":2,"cancellation":0,"on_the_books":82,"date":"2020-02-27"},{"new":0,"cancellation":0,"on_the_books":84,"date":"2020-02-28"},{"new":1,"cancellation":0,"on_the_books":84,"date":"2020-02-29"},{"new":2,"cancellation":1,"on_the_books":85,"date":"2020-03-01"},{"new":4,"cancellation":2,"on_the_books":86,"date":"2020-03-02"},{"new":2,"cancellation":2,"on_the_books":88,"date":"2020-03-03"},{"new":0,"cancellation":4,"on_the_books":88,"date":"2020-03-04"},{"new":5,"cancellation":1,"on_the_books":84,"date":"2020-03-05"},{"new":1,"cancellation":0,"on_the_books":88,"date":"2020-03-06"},{"new":0,"cancellation":0,"on_the_books":89,"date":"2020-03-07"},{"new":0,"cancellation":0,"on_the_books":89,"date":"2020-03-08"},{"new":0,"cancellation":0,"on_the_books":89,"date":"2020-03-09"},{"new":2,"cancellation":0,"on_the_books":89,"date":"2020-03-10"},{"new":2,"cancellation":0,"on_the_books":91,"date":"2020-03-11"},{"new":3,"cancellation":0,"on_the_books":93,"date":"2020-03-12"},{"new":2,"cancellation":2,"on_the_books":96,"date":"2020-03-13"},{"new":4,"cancellation":7,"on_the_books":96,"date":"2020-03-14"},{"new":1,"cancellation":3,"on_the_books":93,"date":"2020-03-15"},{"new":1,"cancellation":1,"on_the_books":91,"date":"2020-03-16"},{"new":1,"cancellation":0,"on_the_books":91,"date":"2020-03-17"},{"new":2,"cancellation":0,"on_the_books":92,"date":"2020-03-18"},{"new":0,"cancellation":0,"on_the_books":94,"date":"2020-03-19"},{"new":3,"cancellation":1,"on_the_books":94,"date":"2020-03-20"},{"new":3,"cancellation":0,"on_the_books":96,"date":"2020-03-21"},{"new":3,"cancellation":2,"on_the_books":99,"date":"2020-03-22"},{"new":2,"cancellation":3,"on_the_books":100,"date":"2020-03-23"}];

				return sampleData;
	};

}]);