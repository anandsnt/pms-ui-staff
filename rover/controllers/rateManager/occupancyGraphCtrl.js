sntRover.controller('RateMgrOccupancyGraphCtrl', ['$q', '$scope', 'RateMgrOccupancyGraphSrv', 'ngDialog', 'dateFilter',
	function($q, $scope, RateMgrOccupancyGraphSrv, ngDialog, dateFilter) {
		$scope.$parent.myScrollOptions = {
			RateMgrOccupancyGraphCtrl: {
				scrollX: true,
				scrollbars: true,
				interactiveScrollbars: true,
				click: true
			}
		};

		BaseCtrl.call(this, $scope);

		$scope.setScroller('RateMgrOccupancyGraphCtrl');
		$scope.refreshScroller('RateMgrOccupancyGraphCtrl');

		$scope.targetData = [];	
		$scope.weekCommonTargets = [];

		$scope.seriesActualVisible = true;
		$scope.seriesTargetVisible = true;

		toolTipLookUp = $scope.toolTipLookUp = Object.create(null);

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

		function generateSeries(data) {
			var categories = [],
			  	actualData = [],
			  	targetData = [], start;

			toolTipLookUp = {};

			angular.forEach(data.results, function(item, index) {
				var valueActual, valueTarget;

				itemDate = Date.parse(item.date); //parse string datetime value to locale ms
				
				if(index === 0) {
					start = itemDate;
				}

				toolTipLookUp[itemDate] = Object.create(null); //lookup hash
				
				categories.push(dateFilter(itemDate, "EEEE") + "<br>" + dateFilter(itemDate, "MMMM dd"));

				// NOTE :: Check if replaced harcoded 10 with item.actual
				// var valueActual = Math.floor((Math.random() * 100) + 1);
				actualData.push(item.actual || 0); 
				toolTipLookUp[itemDate].actual = valueActual;

				// NOTE :: Check if replaced harcoded 10 with item.target
				// var valueTarget = Math.floor((Math.random() * 100) + 1);
				targetData.push(item.target || 0); 
				toolTipLookUp[itemDate].target = valueTarget;
			});

			return {
				series: [{
						name: 'Actual',
						data: actualData,
						pointStart: start,
						pointInterval: 86400000,
						color: 'rgba(247,153,27,0.9)',
						marker: {
							symbol: 'circle',
							radius: 5
						}
					}, 
					{
						name: 'Target',
						data: targetData,
						pointStart: start,
						pointInterval: 86400000,
						color: 'rgba(130,195,223,0.9)',
						marker: {
							symbol: 'triangle',
							radius: 5
						}
				}]//,
				//xAxis: {
				//		categories: categories
				//}	
			};	
		}

		function manipulateTargetData(data) {
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
		}

		function appendRemainingWeekDays(targetData) {
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
		}

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
			var params = {
				"from_date": $scope.currentFilterData.begin_date,
				"to_date": $scope.currentFilterData.end_date
			};

			return $scope.invokeApi(RateMgrOccupancyGraphSrv.fetch, 
									params, 
									function() { 
										$scope.$emit('hideLoader'); 

										return Array.prototype.slice.call(arguments).shift(); 
									})
			.then(function() {
				var args = Array.prototype.slice.call(arguments),
					data = args.shift(),
					graphDim, //  = $scope.graphDimensions,
					interval_width; // = graphDim.containerWidth / 7 - 8;

				(function() {
					var container = $('.occgraph-outer'),
						viewport = Object.create(null);

					if(container.length > 0) {
						viewport = container[0].getBoundingClientRect();
					}

					$scope.graphDimensions = { 
						containerWidth: viewport.width, //|| $(window).width() - 280,
						containerHeight: viewport.height, //$(window).height(),
						width: $scope.uiOptions.tableWidth - 280,
						height: $scope.uiOptions.tableHeight
					};

					graphDim = $scope.graphDimensions;
					interval_width =(graphDim.containerWidth - 8) / (parseFloat($scope.currentFilterData.zoom_level_selected);

					$scope.graphDimensions.width = interval_width * data.results.length;
				})();

				$scope.highchartsNG = {	
					options: {
						chart: {
							type: 'area',
							className: 'rateMgrOccGraph',
							backgroundColor: 'rgba(0,0,0,0.05)',
							width: graphDim.width,
							height: graphDim.height
						},
						xAxis: {
							title: { enabled: false },
							//tickInterval: 86400000,
							//tickPixelInterval: interval_width,
							tickPosition: 'outside',
							opposite: true,
							type: 'datetime',
							dateTimeLabelFormats: {
								day: '%A <br/>%B %b'		
							},
							gridLineWidth: 5,
							gridLineColor: '#FCFCFC',
							minTickInterval: 86400000,
							labels: {
								x: 0,
								y: -50,
								style: {
									class: 'uppercase-label',
									display: 'block',
									textAlign: 'center',							
									textTransform: 'uppercase',
									backgroundColor: '#393c41',
									color: '#fcfcfc',
									height: '60px',
									lineHeight: 'normal',
									border: '3px solid rgba(0,0,0,0.05)',
									margin: '0px',
									fontSize: '14px',
									fontWeight: '600',
									borderRadius: '3px',
									boxSizing: 'border-box',
									padding: '10px ' + (interval_width) / 5 + 'px'
								},								
								useHTML: true
							}
						},
						yAxis: {
							title: { enabled: false },
							tickInterval: 1,
							minTickInterval: 1,
							//tickPixelInterval: graphDim.height / 20,
							tickPosition: 'inside',
							showLastLabel: false,
							labels: {
								align: 'left',
								x: 0,
								y: -2,
								style: {
									color: '#868788',
									fontWeight: 'bold'
								},
								useHTML: true
							},
							min: 0,
							max: 110,
							minRange: 5	
						},
						legend: {
							enabled: false
						},
						plotOptions: {
							series: {
								fillOpacity: 0.1
							}
							/*area: {
								stacking: 'percent',
								lineColor: '#aaa',
								lineWidth: 1
							}*/
						}
					}
				};

				_.extend($scope.highchartsNG, generateSeries(data));

				$scope.targetData = manipulateTargetData(data);

				$scope.$emit('computeColumWidth');	

				return $scope.highchartsNG;
			});
		};

		$scope.$on("updateOccupancyGraph", function() {
			$scope.fetchGraphData();
		});

		$scope.fetchGraphData();
	}
]);