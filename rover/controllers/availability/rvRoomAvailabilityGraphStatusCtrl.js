sntRover.controller('rvRoomAvailabilityGraphStatusController', [
	'$scope', 
	'rvAvailabilitySrv', 
	'dateFilter', 
	function($scope, rvAvailabilitySrv, dateFilter){
		BaseCtrl.call(this, $scope);

		plottedChart = null;

  		$scope.hideMeBeforeFetching = false;	

		//we need horizonat scroller so adding option 'scrollX', also need to get the click event on toggling button on available room
		var scrollerOptions = {scrollX: true, click: true, preventDefault: false};
  		$scope.setScroller ('graph-scroller', scrollerOptions);

 		var colors = ['#c1c1c1', '#dc829c', '#83c3df', '#82de89', '#f6981a', '#f2d6af'];

 		var legendClasses = [];

 		for(var i = 0 ;i < colors.length; i++){ 			
 			legendClasses.push("background-image: none !important;"  + 
			"background-color: "+colors[i]+" !important; " +
			"background-repeat: repeat;");
			}

		$scope.returnLegendStyle  = function(index, legendModel){
			if(legendModel){
				return legendClasses[index];
			}
			else{
				return "";
			}
		}

		var resizedWindow = function(){
			/*
				Caution, DOM accessing, TODO: try to convert it into angular way
			*/
        	$("#nav-listing").css("left", plottedChart.plotLeft);
        	$("#nav-listing").css("width", plottedChart.plotSizeX);
        	var labelWidthToSet = 0;
        	if(getMaxSeriesLengthData() != 0){
        		labelWidthToSet = parseInt((plottedChart.plotSizeX)/getMaxSeriesLengthData());
        	}
        	else{
        		$("#nav-listing").css("width", 0);
        	}
        	$("#nav-listing ul li").css("width", labelWidthToSet);
        	$scope.refreshScroller('graph-scroller');			

		}
		var getMaxSeriesLengthData = function(){
			var max = 0;
			for(var i = 0; i < plottedChart.series.length; i++){
				if(plottedChart.series[i].visible){
					max = max < plottedChart.series[i].data.length ? plottedChart.series[i].data.length  : max;
				}
			}
			return max;
		}

		var formGraphData = function(){
 				$scope.graphData = [{
					name: 'Bookable Rooms',
					data: $scope.data.bookableRooms,
					yAxis: 0,
					checked: false
				}, {
					name: 'Out of Order Rooms',
					data: $scope.data.outOfOrderRooms,
					yAxis: 0,
					checked: false
				}, {
					name: 'Total Reserved',
					data: $scope.data.reservedRooms,
					yAxis: 0,
					checked: true
				}, {
					name: 'Available Rooms',
					data: $scope.data.availableRooms,
					yAxis: 0,
					checked: false
				}, {
					name: 'Occupancy Actual',
					data: $scope.data.occupancies,
					yAxis: 1,
					checked: false,
					marker: {
						symbol: 'circle',
						radius: 5
					}
				}, {
					name: 'Occupancy Target',
					data: [0, 20, 18, 15, 14, 10,0],
					yAxis: 1,
					checked: false
				}];				
 		};

 		$scope.clickedOnLegend = function(legendName, model){
 			for(var i = 0; i < plottedChart.series.length; i++){
 				if(plottedChart.series[i].name == legendName){
 					if (model){
 						plottedChart.series[i].hide();
 					}
 					else{
 						plottedChart.series[i].show();
 					}
 				}
 			}
 			resizedWindow();
 		};


		var doInitialOperation = function(){
			$scope.data = rvAvailabilitySrv.getData();
			formGraphData();
			var mainDiff = parseInt($scope.data.totalRooms / 10);
			var yAxisLabels = [];
			for(var i = 0; i < parseInt($scope.data.totalRooms); i+=mainDiff){
				yAxisLabels.push(i);
			}
			
			Highcharts.theme = {
				colors: colors,
				chart: {
					backgroundColor: 'white'  ,
					borderColor: '#FFFF',
					borderWidth: 2,
					plotBackgroundColor: '#F7F7F7',
					plotBorderColor: '#FFF',
					plotBorderWidth: 2,
					marginLeft:4

				},

				xAxis: {
					gridLineColor: '#FFF',
					gridLineWidth: 2,
					labels: {
						useHTML: true,
					},
					lineColor: '#FFF',
					tickColor: '#FFF',
					title: {
						style: {
							color: '#CCC',
							fontWeight: 'bold',
							fontSize: '12px',
							fontFamily: 'Trebuchet MS, Verdana, sans-serif'

						}
					},
					opposite: true
				},
				yAxis: [{
					gridLineColor: '#dedede',
					labels: {

					},
					lineColor: '#A0A0A0',
					minorTickInterval: null,
					tickColor: '#A0A0A0',
					tickWidth: 1,
					title: {
						style: {
							color: '#CCC',
							fontWeight: 'bold',
							fontSize: '12px',
							fontFamily: 'Trebuchet MS, Verdana, sans-serif'
						}
					}
				},
				{
					gridLineColor: '#dedede',
					labels: {
			            style: {
				            color: '#f6981a',
				            fontWeight: 'bold'
				         }
					},
					lineColor: '#A0A0A0',
					minorTickInterval: null,
					tickColor: '#A0A0A0',
					tickWidth: 1,
					title: {
						style: {
							color: '#CCC',
							fontWeight: 'bold',
							fontSize: '12px',
							fontFamily: 'Trebuchet MS, Verdana, sans-serif'
						}
					}
				}],
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.75)',
					style: {
						color: '#F0F0F0'
					}
				},
				
				plotOptions: {
					series: {
						fillOpacity: .25
					}
					

				},
				

			   // scroll charts
			   
			};

			
			// Apply the theme
			var highchartsOptions = Highcharts.setOptions(Highcharts.theme);  
			$scope.availabilityGraphCongif = { 
				options : {
					chart: {
						type: 'areaspline',
					},
					legend : {
						enabled : false
					},	
				},
				title: {
					text: ''
				},
				xAxis: {
					showLastLabel: true,
    				endOnTick: true,					
					min: 0,
					categories: $scope.data.dates,
					type: 'category',
					labels: {
						enabled: false,
						x: 0,
						y: -50,
						useHTML: true,
						opposite: true
					},            
					tickPosition: 'inside',
					tickWidth: 0
				},
				yAxis: [{
					showLastLabel: true,
    				endOnTick: true,
					min: 0,
					title:{
						text: ''
					},
					labels: {
						    align: 'left',
                			x: 0,
               				y: -2,
					},
					tickPosition: 'inside',
					tickWidth: 0,
					
					floor : 0,
					ceiling : $scope.data.totalRooms,
					tickInterval : Math.ceil($scope.data.totalRooms/10),
					minRange : $scope.data.totalRooms
				},
				{
					showLastLabel: true,
    				endOnTick: true,					
					floor : 0,
					ceiling : 100,
					title:{
						text: ''
					},
					minRange : 100,
					tickInterval : 10,
					labels: {
						    align: 'right',
                			x: 0,
               				y: -2,
               				style: {
				            	color: '#f6981a',
				         	}
					},
					tickPosition: 'outside',
					tickWidth: 0,					
					opposite: true,			
				}
				],
							
				series: $scope.graphData,
			    func: function (chart) { // on complete
			        	plottedChart = chart;
			        	setTimeout(function(){
			        		$scope.$apply(function(){
			        			resizedWindow();
					        	for(var i = 0; i < $scope.graphData.length; i++){
					        		$scope.clickedOnLegend($scope.graphData[i].name, !$scope.graphData[i].checked)
					        	}
					        	
					        	$scope.hideMeBeforeFetching = true;	

			        		})
	        				$(window).resize();
			        	}, 150)

			        	$(window).resize(function(){
			        		setTimeout(function(){
			        			resizedWindow();
			        			$scope.refreshScroller('graph-scroller');		
			        		}, 500);
			        	});
			        	
			        }


			    }	
			$scope.$emit("hideLoader");
		}

		$scope.data = rvAvailabilitySrv.getData();
  		//if already fetched we will show without calling the API
		if(!isEmptyObject($scope.data)){
			formGraphData();
			doInitialOperation();
        	for(var i = 0; i < $scope.graphData.length; i++){
        		$scope.clickedOnLegend($scope.graphData[i].name, $scope.graphData[i].checked)
        	}			
			$scope.$emit("hideLoader");

		

		}

		/**
		* when data changed from super controller, it will broadcast an event 'changedRoomAvailableData'
		*/
		$scope.$on("changedRoomAvailableData", function(event){		
			doInitialOperation();
			$(window).resize();
		});
  	

	}
]);