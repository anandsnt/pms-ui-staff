sntRover.controller('RVReservationRoomTypeCtrl', ['$rootScope', '$scope', 'RVReservationBaseSearchSrv',
	function($scope, RVReservationBaseSearchSrv) {
		//BaseCtrl.call(this, $scope);
		data = {
			tax: 20,
			rooms: [{
				"room_type": [{
					"level" : 1,
					"category_name": "Standard Room",
					"avg_rate": 149,
					"rates": [{
						"rate_name": "Best Available Rate",
						"summary": ["Winter Promotional Rate - Room Only. Taxes included. Different daily rates listed.",
							"Cancel by 4PM on 27-DEC-12 to avoid a penalty charge of 05.00.",
							"Cancel by 4:00 PM on 12/27/2014 to avoid a penalty charge of 105.00.",
							"A deposit is not required to guarantee your reservation."
						],
						"rate_breakdown": [100, 100]
					},{
						"rate_name": "Second Best Available Rate",
						"summary": ["Winter Promotional Rate - Room Only. Taxes included. Different daily rates listed.",
							"Cancel by 4PM on 27-DEC-12 to avoid a penalty charge of 05.00.",
							"Cancel by 4:00 PM on 12/27/2014 to avoid a penalty charge of 105.00.",
							"A deposit is not required to guarantee your reservation."
						],
						"rate_breakdown": [100, 100]
					}]
				},{
					"level" : 1,
					"category_name": "Second Room",
					"avg_rate": 189,
					"rates": [{
						"rate_name": "Best Available Rate",
						"summary": ["Winter Promotional Rate - Room Only. Taxes included. Different daily rates listed.",
							"Cancel by 4PM on 27-DEC-12 to avoid a penalty charge of 05.00.",
							"Cancel by 4:00 PM on 12/27/2014 to avoid a penalty charge of 105.00.",
							"A deposit is not required to guarantee your reservation."
						],
						"rate_breakdown": [100, 100, 100]
					}]
				}],
				"recommended": [],
				"rate": []
			},]
		}

		var init = function() {
			$scope.tax = data.tax;
			$scope.rooms = data.rooms;
			$scope.activeRoom = 0;
			$scope.activeCriteria = "ROOM_TYPE";
			$scope.selectedRoomType = 1;
		};

		init();

		$scope.setSelectedType = function(val){
			$scope.selectedRoomType = $scope.selectedRoomType == val ? -1 : val;
		}
	}
]);