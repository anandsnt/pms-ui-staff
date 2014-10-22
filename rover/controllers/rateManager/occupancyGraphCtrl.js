sntRover.controller('RateMgrOccupancyGraphCtrl', ['$q', '$scope', 'RateMgrOccupancyGraphSrv', 'ngDialog', 'dateFilter',
	function($q, $scope, RateMgrOccupancyGraphSrv, ngDialog, dateFilter) {

		$scope.$parent.myScrollOptions = {
			'RateMgrOccupancyGraphCtrl': {
				scrollX: true,
				scrollbars: true,
				interactiveScrollbars: true,
				click: true
			}
		};

		BaseCtrl.call(this, $scope);

		$scope.highchartsNG = {};
		$scope.graphDimensions = {};
		$scope.targetData = "";
		$scope.dateRange = [];
		$scope.weekCommonTargets = [];
		$scope.seriesActualVisible = true;
		$scope.seriesTargetVisible = true;
		$scope.graphDimensions.containerWidth = $(window).width() - 280;
		$scope.graphDimensions.graphWidth = $scope.uiOptions.tableWidth - 280; 

		clientHeight = $(window).height();

		var toolTipLookUp = {},
			drawGraph = function() {
				$scope.highchartsNG = {		
					title: {
						text: ''
					},			
					chart: {
						type: 'area',
						className: "rateMgrOccGraph",
						plotBackgroundColor: 'rgba(0,0,0,0.05)',
						width: $scope.uiOptions.tableWidth - 280,
						backgroundColor: null,
						height: clientHeight //- 175
					},
					tooltip : {
						shared: false,
						formatter: function() {
							if ($scope.seriesActualVisible && $scope.seriesTargetVisible) {
									// return 'ACTUAL <b>' + (( typeof this.points[0].y == 'undefined' ) ? '0' : this.points[0].y ) + '%</b>' + '<br/>TARGET <b>' + (( typeof this.points[1] == 'undefined' ) ? '0' : this.points[1].y ) + '%</b>';
								if (this.series.name === "Actual") {
									return 'ACTUAL <b>' + this.y + '%</b>' + '<br/>TARGET <b>' + toolTipLookUp[this.x].target + '%</b>';
								} else {
									return 'ACTUAL <b>' + toolTipLookUp[this.x].actual + '%</b>' + '<br/>TARGET <b>' + this.y + '%</b>';
								}
							}
							
							if ($scope.seriesActualVisible) {
								return 'ACTUAL <b>' + this.y + '%';
							}
							if ($scope.seriesTargetVisible) {
								return 'TARGET <b>' + this.y + '%';
							}
						}
					},
					legend: {
						enabled: false
					},
					plotOptions: {
						series: {
							fillOpacity: 0.1
						}
					},
					xAxis: {
						type: 'datetime',
						title: {
							text: 'Date'
						},
						gridLineWidth: 5,
						gridLineColor: '#FCFCFC',
						opposite: true,
						tickPosition: 'outside',
						tickWidth: 0,
						minTickInterval: 86400000,
						dateTimeLabelFormats: {
							days: '%e %b, %Y'
						},
						useHTML: true,
						labels: {
							x: 0,
							y: -50,
							style: {
								/*'class': 'uppercase-label',
								'textAlign': 'center',
								'display': 'block',
								'fontWeight': 'bold',
								'textTransform': 'uppercase',
								'backgroundColor': '#393c41',
								'color': '#fcfcfc',
								'padding': (function() {
									var totalWidth = $scope.uiOptions.tableWidth - 280;
									var totalColumns = $scope.currentFilterData.zoom_level_selected;
									var paddingOffsets = 30;
									var perColumnWidth = totalWidth / totalColumns - paddingOffsets;
									var existingTextWidth = 80;

									var perSidePadding = (perColumnWidth - existingTextWidth) / 2;
								
									return "10px " + perSidePadding + "px";
								})()*/
							},
							useHTML: true
						}
					},
					yAxis: {
						tickPosition: "inside",
						showLastLabel: false,
						style: {
							color: 'red'
						},
						title: {
							text: 'Occupancy'
						},
						useHTML: true,
						labels: {
							align: 'left',
							x: 0,
							y: -2,
							style: {
								color: '#868788',
								fontWeight: 'bold'
							}
						},
						floor: 0,
						ceiling: 110,
						tickInterval: 10,
						minRange: 110,
						min: 0,
						max: 110
					},
					series: $scope.graphData
					
				};
			};
		//};

		function flatten(data) {
			var arr = [];

			for(var i = 0, len = data.length; i < len; i++) {
				arr.push(new Date(data[i][0]).toLocaleDateString());
			}

			return arr;
		}

		$scope.legendToggled = function(legendName) {
			var chart = $('#occGraphContainer').highcharts();

			if (legendName === 'actual') {
				$scope.seriesActualVisible = !$scope.seriesActualVisible;
				if ($scope.seriesActualVisible) {
					chart.series[0].show();
				} else {
					chart.series[0].hide();
				}
			} else {
				$scope.seriesTargetVisible = !$scope.seriesTargetVisible;
				if ($scope.seriesTargetVisible) {
					chart.series[1].show();
				} else {
					chart.series[1].hide();
				}
			}
		};

		var manipulateGraphData = function(data) {
			var graphData = [],
			  	actualData = [],
			  	targetData = [];

			toolTipLookUp = {};

			angular.forEach(data.results, function(item, index) {
				var valueActual, valueTarget;

				itemDate = Date.parse(item.date);
				toolTipLookUp[itemDate] = {};
				
				$scope.dateRange.push(dateFilter(itemDate, "EEEE") + "<br>" + dateFilter(itemDate, "MMMM dd"));

				// NOTE :: Check if replaced harcoded 10 with item.actual
				// var valueActual = Math.floor((Math.random() * 100) + 1);
				valueActual = +item.actual || 0;
				actualData.push([itemDate, parseInt(valueActual)]); 
				toolTipLookUp[itemDate].actual = valueActual;

				// NOTE :: Check if replaced harcoded 10 with item.target
				// var valueTarget = Math.floor((Math.random() * 100) + 1);
				valueTarget = +item.target || 0;
				targetData.push([itemDate, parseInt(valueTarget)]); 
				toolTipLookUp[itemDate].target = valueTarget;
			});

			//$scope.dateRange = { start: actualData[0][0], end: actualData[actualData.length - 1][0] };

			graphData = [{
				"name": "Actual",
				"data": actualData,
				"color": "rgba(247,153,27,0.9)",
				"marker": {
					symbol: 'circle',
					radius: 5
				}
			}, 
			{
				"name": "Target",
				"data": targetData,
				"color": "rgba(130,195,223,0.9)",
				"marker": {
					symbol: 'triangle',
					radius: 5
				}
			}];

			return graphData;
		};

		var manipulateTargetData = function(data) {
			var targetData = [],
			    targetItem = {};

			angular.forEach(data.results, function(item) {
				itemDate = tzIndependentDate(item.date).getTime();
				target_value = item.target;
				targetItem = {
						"date": itemDate,
						"value": target_value,
						"is_editable": true
				};
				targetData.push(targetItem);
			});

			targetData = appendRemainingWeekDays(targetData);

			var formattedTargetData = [],
			    targetWeeklyItem = [];

			for (var i = 0; i <= targetData.length; i++) {
				item = targetData[i];

				if (i % 7 === 0 && i !== 0) {
					formattedTargetData.push(targetWeeklyItem);
					targetWeeklyItem = [];
					targetWeeklyItem.push(item);
				} else {
					targetWeeklyItem.push(item);
				}
			}

			$scope.weekCommonTargets = [];

			for (var i = 0; i <= formattedTargetData.length; i++) {
				$scope.weekCommonTargets.push('');
			}

			return formattedTargetData;
		};

		var appendRemainingWeekDays = function(targetData) {
			from_date = tzIndependentDate(targetData[0].date); 
			to_date = tzIndependentDate(targetData[targetData.length - 1].date);

			var remainingStartWeekDays = [],
			   remainingEndWeekDays = [];
			// append missing week days before from date
			if (from_date.getDay() !== 0) {
				limit = from_date.getDay();

				for (var i = limit; i > 0; i--) {
					var itemDate = angular.copy(from_date);

					itemDate.setDate(from_date.getDate() - i);

					remainingStartWeekDays.push({
							"date": itemDate.getTime(),
							"value": null,
							"is_editable": false
					});
				}
			}

			// append missing week days after to date
			if (to_date.getDay() != 6) {
				limit = 6 - to_date.getDay();

				for (var j = 1; j <= limit; j++) {
					var itemDate = angular.copy(to_date);

					itemDate.setDate(to_date.getDate() + j);

					remainingEndWeekDays.push({
							"date": itemDate.getTime(),
							"value": null,
							"is_editable": false
					});
				}

			}

			targetData = remainingStartWeekDays.concat(targetData, remainingEndWeekDays);

			return targetData;
		};

		$scope.showSetTargetDialog = function() {
			ngDialog.open({
					template: '/assets/partials/rateManager/setTargetPopover.html',
					className: 'ngdialog-theme-default settarget',
					closeByDocument: true,
					scope: $scope
			});
		};

		$scope.copyTargetToAllWeekDays = function(index) {
			angular.forEach($scope.targetData[index], function(item, key) {
				if (item.hasOwnProperty("value") && item.is_editable) {
					item.value = $scope.weekCommonTargets[index];
				}
			});
		};

		$scope.setTargets = function() {
			var params = {},
			 	dates = [],
			 	weekDate = "",
			 	formatted_date = "";

			angular.forEach($scope.targetData, function(week) {
				angular.forEach(week, function(weekDays) {
					if (weekDays.value !== null) {

						weekDate = new Date(weekDays.date);
						formatted_date = weekDate.getFullYear() + '-' + (weekDate.getMonth() + 1) + '-' + weekDate.getDate();

						dates.push({
							"date": formatted_date,
							"target": weekDays.value
						});
					}
				});
			});

			params = {
					"dates": dates
			};

			var setTargetsSuccess = function(data) {
				ngDialog.close();
				$scope.fetchGraphData();
				$scope.$emit('hideLoader');
			};

			$scope.invokeApi(RateMgrOccupancyGraphSrv.setTargets, params, setTargetsSuccess);
		};

		$scope.cancelClicked = function() {
			ngDialog.close();
		};

		$scope.fetchGraphData = function(params) {
			var fetchGraphDataSuccess = function(data) {
				setTimeout(function() {
					$scope.$emit('computeColumWidth');		
					
				}, 1000);
				$scope.graphData = manipulateGraphData(data);
				drawGraph();

				$scope.targetData = manipulateTargetData(data);
				$scope.$emit('hideLoader');
				
			};

			var params = {
					"from_date": $scope.currentFilterData.begin_date,
					"to_date": $scope.currentFilterData.end_date
			};

			$scope.invokeApi(RateMgrOccupancyGraphSrv.fetch, params, fetchGraphDataSuccess);
		};

		$scope.$on("updateOccupancyGraph", function() {
			$scope.fetchGraphData();
		});

		$scope.fetchGraphData();
	}
]);