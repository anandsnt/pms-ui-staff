sntRover.controller('RateMgrOccupancyGraphCtrl', ['$q', '$scope', 'RateMgrOccupancyGraphSrv', 'ngDialog',
function($q, $scope, RateMgrOccupancyGraphSrv, ngDialog) {

	$scope.$parent.myScrollOptions = {
		'RateMgrOccupancyGraphCtrl' : {
			scrollX : true,
			scrollbars : true,
			interactiveScrollbars : true,
			click : true			
		},

	};

	BaseCtrl.call(this, $scope);
	$scope.highchartsNG = {};
	$scope.graphDimensions = {};
	$scope.targetData = "";
	$scope.weekCommonTargets = [];
	$scope.seriesActualVisible = true;
	$scope.seriesTargetVisible = true;
	$scope.graphDimensions.containerWidth = $(window).width() - 280;
	clientHeight = $(window).height();
	
	var drawGraph = function() {
		$scope.highchartsNG = {
			options : {
				chart : {
					type : 'area',
					className : "rateMgrOccGraph",
					plotBackgroundColor : '#e0e0e0',
					width : $scope.uiOptions.tableWidth,
					backgroundColor : null,					
					height : clientHeight - 175
				},
				tooltip : {
					shared : true,
					formatter : function() {
						if ($scope.seriesActualVisible && $scope.seriesTargetVisible) {
							return 'ACTUAL <b>' + (( typeof this.points[1] == 'undefined' ) ? '0' : this.points[1].y ) + '%</b>' + '<br/>TARGET <b>' + (( typeof this.points[0].y == 'undefined' ) ? '0' : this.points[0].y ) + '%</b>';
						}
						if ($scope.seriesActualVisible) {
							return 'ACTUAL <b>' + (( typeof this.points[0].y == 'undefined' ) ? '0' : this.points[0].y ) + '%';
						}
						if ($scope.seriesTargetVisible) {
							return 'TARGET <b>' + (( typeof this.points[0].y == 'undefined' ) ? '0' : this.points[0].y ) + '%';
						}
					}
				},
				legend : {
					enabled : false
				},
				plotOptions : {
					series : {
						fillOpacity : 0.1
					}
				},
				xAxis : {
					gridLineWidth : 5,
					gridLineColor : '#FCFCFC',
					opposite : true,
					tickPosition : 'inside',
					tickWidth : 0,
					type : 'datetime',
					minTickInterval : 24 * 3600 * 1000,
					dateTimeLabelFormats : {
						day : '%A <br/> %B %d'
					},
					labels : {
						x : 0,
						y : -25,
						style : {
							'class' : 'uppercase-label',
							'textAlign' : 'center',
							'display' : 'block',
							'color' : '#868788',
							'fontWeight' : 'bold',
							'textTransform' : 'uppercase'
						},
						useHTML : true
					},
				},
				yAxis : {
					tickPosition : "inside",
					showLastLabel : false,
					style : {
						color : 'red'
					},
					useHTML : true,
					labels : {
						align : 'left',
						x : 0,
						y : -2,
						style : {
							color : '#868788',
							fontWeight : 'bold'
						}
					},
					floor : 0,
					ceiling : 110,
					tickInterval : 10,
					minRange : 110,
					title : {
						text : ''
					},
					min: 0,
					max: 110
				},
				title : {
					text : ''
				}
			},
			series : $scope.graphData
		}
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
	}
	var manipulateGraphData = function(data) {
		var graphData = [];
		var actualData = [];
		var targetData = [];
		angular.forEach(data.results, function(item) {
			itemDate = Date.parse(item.date);
			//actualData.push([itemDate, Math.floor((Math.random() * 100) + 1)]); // TODO :: replace harcoded 10 with item.actual
			actualData.push([itemDate, item.actual]);
			//targetData.push([itemDate, Math.floor((Math.random() * 100) + 1)]); // TODO :: replace harcoded 10 with item.target
			targetData.push([itemDate, item.target]);
		});
		graphData = [{
			"name" : "Actual",
			"data" : actualData,
			"color" : "rgba(247,153,27,0.9)",
			"marker" : {
				symbol : 'circle',
				radius : 5
			}
		}, {
			"name" : "Target",
			"data" : targetData,
			"color" : "rgba(130,195,223,0.9)",
			"marker" : {
				symbol : 'triangle',
				radius : 5
			}
		}]
		return graphData
	}
	var manipulateTargetData = function(data) {
		var targetData = [];
		var targetItem = {};
		angular.forEach(data.results, function(item) {
			itemDate = tzIndependentDate(item.date).getTime();
			target_value = item.target
			targetItem = {
				"date" : itemDate,
				"value" : target_value,
				"is_editable" : true
			};
			targetData.push(targetItem);
		});
		targetData = appendRemainingWeekDays(targetData);
		var formattedTargetData = [];
		var targetWeeklyItem = [];
		for (var i = 0; i <= targetData.length; i++) {
			item = targetData[i];
			if (i % 7 == 0 && i != 0) {
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
	var appendRemainingWeekDays = function(targetData) {
		from_date = tzIndependentDate(targetData[0].date); 
		to_date = tzIndependentDate(targetData[targetData.length - 1].date);
		var remainingStartWeekDays = [];
		var remainingEndWeekDays = [];
		// append missing week days before from date
		if (from_date.getDay() != 0) {
			limit = from_date.getDay();
			for (var i = limit; i > 0; i--) {
				var itemDate = angular.copy(from_date);
				itemDate.setDate(from_date.getDate() - i);
				remainingStartWeekDays.push({
					"date" : itemDate.getTime(),
					"value" : null,
					"is_editable" : false
				})
			}
		}

		// append missing week days after to date
		if (to_date.getDay() != 6) {
			limit = 6 - to_date.getDay();
			for (var j = 1; j <= limit; j++) {
				var itemDate = angular.copy(to_date);
				itemDate.setDate(to_date.getDate() + j);
				remainingEndWeekDays.push({
					"date" : itemDate.getTime(),
					"value" : null,
					"is_editable" : false
				})
			}

		}
		targetData = remainingStartWeekDays.concat(targetData, remainingEndWeekDays);
		return targetData;
	}

	$scope.showSetTargetDialog = function() {
		ngDialog.open({
			template : '/assets/partials/rateManager/setTargetPopover.html',
			className : 'ngdialog-theme-default settarget',
			closeByDocument : true,
			scope : $scope
		});
	};

	$scope.copyTargetToAllWeekDays = function(index) {
		angular.forEach($scope.targetData[index], function(item, key) {
			if (item.hasOwnProperty("value") && item.is_editable) {
				item.value = $scope.weekCommonTargets[index];
			}
		});
	}

	$scope.setTargets = function() {
		var params = {};
		var dates = [];
		var weekDate = "";
		var formatted_date = "";
		angular.forEach($scope.targetData, function(week) {
			angular.forEach(week, function(weekDays) {
				if(weekDays.value != null){
					weekDate = new Date(weekDays.date)
					formatted_date = weekDate.getFullYear() + '-' + (weekDate.getMonth() + 1) + '-' + weekDate.getDate()
					dates.push({
						"date" : formatted_date,
						"target" : weekDays.value
					});
				}
			});
		});
		params = {
			"dates" : dates
		}
		var setTargetsSuccess = function(data) {
			ngDialog.close();
			$scope.fetchGraphData();
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(RateMgrOccupancyGraphSrv.setTargets, params, setTargetsSuccess);
	}

	$scope.cancelClicked = function() {
		ngDialog.close();
	};

	$scope.fetchGraphData = function(params) {
		var fetchGraphDataSuccess = function(data) {
			$scope.graphData = manipulateGraphData(data);
			drawGraph();
			$scope.targetData = manipulateTargetData(data);
			$scope.$emit('hideLoader');
		};
		var params = {
			"from_date" : $scope.currentFilterData.begin_date,
			"to_date" : $scope.currentFilterData.end_date
		}
		$scope.invokeApi(RateMgrOccupancyGraphSrv.fetch, params, fetchGraphDataSuccess);
	};

	$scope.$on("updateOccupancyGraph", function(){
		$scope.fetchGraphData();
	});

	$scope.fetchGraphData();
}]); 
