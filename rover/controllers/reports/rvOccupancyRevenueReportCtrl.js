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
			preventDefault: false
		});


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
			}]


		}
	}
])