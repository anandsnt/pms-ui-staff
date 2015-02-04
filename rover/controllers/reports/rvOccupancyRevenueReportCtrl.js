sntRover.controller('rvOccupancyRevenueReportCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'RVreportsSrv',
	'$timeout',
	function($scope, $rootScope, $filter, RVreportsSrv, $timeout) {
		$scope.occupanyRevenueState = {
			name: "Occupancy & Revenue Summary"
		}

		$scope.setScroller('leftPanelScroll', {
			preventDefault: false,
			probeType: 3
		});

		$scope.setScroller('rightPanelScroll', {
			preventDefault: false,
			probeType: 3,
			scrollX: true
		});

		$timeout(function() {
			$scope.$parent.myScroll['leftPanelScroll'].on('scroll', function() {
				var yPos = this.y;
				$scope.$parent.myScroll['rightPanelScroll'].scrollTo(0, yPos);
			})
			$scope.$parent.myScroll['rightPanelScroll'].on('scroll', function() {
				var yPos = this.y;
				$scope.$parent.myScroll['leftPanelScroll'].scrollTo(0, yPos);
			})

		}, 1000);

		$scope.tabularData = {
			hotelName: "Sample Hotel",
			markets: [{
				id: "1",
				name: "MarketOne"
			}, {
				id: "2",
				name: "MarketTwo"
			}, {
				id: "3",
				name: "MarketThree"
			}],
			chargeCodes: [{
				id: "1",
				name: "ChargeCodeOne"
			}, {
				id: "2",
				name: "ChargeCodeTwo"
			}, {
				id: "3",
				name: "ChargeCodeThree"
			}],
			displayValues: [
				[5650, 5650, 5650],
				[2401, 2401, 2401],
				[5928, 5928, 5928],
				[3080, 3080, 3080],
				[1698, 1698, 1698],
				[2024, 2024, 2024],
				[3254, 2024, 2024],
				[4698, 4698, 4698],
				[5650, 5650, 5650],
				[2401, 2401, 2401],
				[5928, 5928, 5928],
				[3080, 3080, 3080],
				[1698, 1698, 1698],
				[2024, 2024, 2024],
				[3254, 2024, 2024],
				[4698, 4698, 4698],
				[2024, 2024, 2024],
				[3254, 2024, 2024],
				[4698, 4698, 4698]
			],
			table: {
				"2014-12-01": {
					availableRooms: 5650,
					occupiedRooms: 2401,
					complimentaryRooms: 5928,
					occupiedRoomsMinusComp: 3080,
					markets: {
						1: 1698,
						2: 2024,
						3: 3254
					},
					chargeCodes: {
						1: 4698,
						2: 5024,
						3: 6254
					},
					totalOccupancy: 1234,
					totalOccupancyMinusComp: 2568,
					RevPar: 456,
					ADRInclComp: 3245,
					ADRExclComp: 4245,
					TotalRevenue: 8562
				},
				"2014-12-02": {
					availableRooms: 5650,
					occupiedRooms: 2401,
					complimentaryRooms: 5928,
					occupiedRoomsMinusComp: 3080,
					markets: {
						1: 1698,
						2: 2024,
						3: 3254
					},
					chargeCodes: {
						1: 4698,
						2: 5024,
						3: 6254
					},
					totalOccupancy: 1234,
					totalOccupancyMinusComp: 2568,
					RevPar: 456,
					ADRInclComp: 3245,
					ADRExclComp: 4245,
					TotalRevenue: 8562
				},
				"2014-12-03": {
					availableRooms: 5650,
					occupiedRooms: 2401,
					complimentaryRooms: 5928,
					occupiedRoomsMinusComp: 3080,
					markets: {
						1: 1698,
						2: 2024,
						3: 3254
					},
					chargeCodes: {
						1: 4698,
						2: 5024,
						3: 6254
					},
					totalOccupancy: 1234,
					totalOccupancyMinusComp: 2568,
					RevPar: 456,
					ADRInclComp: 3245,
					ADRExclComp: 4245,
					TotalRevenue: 8562
				}
			}


		}

		$scope.refreshScroller('rightPanelScroll');
		$scope.refreshScroller('leftPanelScroll');
	}
])