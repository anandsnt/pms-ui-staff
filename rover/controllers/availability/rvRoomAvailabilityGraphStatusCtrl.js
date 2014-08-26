sntRover.controller('rvRoomAvailabilityGraphStatusController', [
	'$scope', 
	'rvAvailabilitySrv', 

	function($scope, rvAvailabilitySrv){
		BaseCtrl.call(this, $scope);


  		$scope.hideMeBeforeFetching = true;	

  		$scope.availabilityGraphCongif = {
	 		chart: {
	            type: 'areaspline',
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            categories: ['Bookable Rooms', 'Out of Order Rooms', 'Total Reserved', 'Available Rooms', 'Occupancy Actual', 'Occupancy Target'],
	         	labels: {
	            	stroke: 'red',
	            	enabled: false, 
	    		},
				tickPosition: 'inside',
				tickWidth: 0
	        },
	        yAxis: {
	        	categories: [0,25,50,75,100,125,150,175],
	            title: {
	                text: ''
	            },
	            stackLabels: {
	                enabled: true,
	                style: {
	                    fontWeight: 'bold',
	                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
	                }
	            },
	            labels: {
	                
	            },
				tickPosition: 'inside',
				tickWidth: 0
	        },
	        series: [{
	            name: 'Bookable Rooms',
	            data: [5, 3, 4, 7, 2]
	        }, {
	            name: 'Out of Order Rooms',
	            data: [2, 2, 3, 2, 1]
	        }, {
	            name: 'Total Reserved',
	            data: [3, 4, 4, 2, 5]
	        }, {
	            name: 'Available Rooms',
	            data: [3, 4, 7, 2, 2]
	        }, {
	            name: 'Occupancy Actual',
	            data: [1, 2, 7, 5, 4]
	        }, {
	            name: 'Occupancy Target',
	            data: [3, 4, 7, 2, 2]
	        }]
    	}


	}
]);