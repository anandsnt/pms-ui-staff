sntRover.controller('rvOccupancyRevenueReportCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'RVreportsSrv',
	'$timeout',
	'dateFilter',
	function($scope, $rootScope, $filter, RVreportsSrv, $timeout, dateFilter) {
		$scope.occupanyRevenueState = {
			name: "Occupancy & Revenue Summary"
		}

		$scope.stateStore = {
			occupancy: [{
				key: "available_rooms",
				name: "Available Rooms"
			}, {
				key: "occupied_rooms",
				name: "Occupied Rooms"
			}, {
				key: "complimentary_rooms",
				name: "Complimentary Rooms"
			}, {
				key: "occupied_minus_comp",
				name: "Occupied Rooms (Excl. Comp.)"
			}],
			occupancyTotals: [{
				key: "total_occupancy_in_percentage",
				name: "Total Occ."
			}, {
				key: "total_occupancy_minus_comp_in_percentage",
				name: "Total Occ. (Excl. Comp.)"
			}],
			revenues: [{
				key: "rev_par",
				name: "RevPar"
			}, {
				key: "adr_inclusive_complimentary_rooms",
				name: "ADR (Incl. Comp.)"
			}, {
				key: "adr_exclusive_complimentatry_rooms",
				name: "ADR (Excl. Comp.)"
			}],
			revenueTotals: [{
				key: "total_revenue",
				name: "Total Revenue"
			}]
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

		$scope.selectedDays = [];

		$scope.absoulte = Math.abs;

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

		$scope.getNumber = function() {
			return new Array((1 + !!$scope.chosenReport.chosenLastYear + !!$scope.chosenReport.chosenVariance) * $scope.selectedDays.length);
		}

		$scope.getHeader = function(indexValue) {
			if (!!$scope.chosenReport.chosenLastYear && !!$scope.chosenReport.chosenVariance) {
				return (indexValue % 3 == 0) ? "This Year" : (indexValue % 3 == 2) ? "Variance" : "Last Year"
			} else if (!!$scope.chosenReport.chosenLastYear || !!$scope.chosenReport.chosenVariance) {
				return (indexValue % 2 == 0) ? "This Year" : !!$scope.chosenReport.chosenVariance ? "Variance" : "Last Year"
			} else {
				return "This Year"
			}
		}

		$scope.getValue = function(key, columnIndex) {
			var candidate = $scope.results[key][$scope.selectedDays[parseInt(columnIndex / (1 + !!$scope.chosenReport.chosenLastYear + !!$scope.chosenReport.chosenVariance))]];
			if (candidate) {
				if (!!$scope.chosenReport.chosenLastYear && !!$scope.chosenReport.chosenVariance) {
					return (columnIndex % 3 == 0) ? candidate.this_year : (columnIndex % 3 == 2) ? (candidate.this_year - candidate.last_year) : candidate.last_year;
				} else if (!!$scope.chosenReport.chosenLastYear || !!$scope.chosenReport.chosenVariance) {
					return (columnIndex % 2 == 0) ? candidate.this_year : !!$scope.chosenReport.chosenVariance ? (candidate.this_year - candidate.last_year) : candidate.last_year;
				} else {
					return candidate.this_year;
				}
			} else {
				return -1;
			}
		}

		$scope.getClass = function(columnIndex) {
			if (!!$scope.chosenReport.chosenLastYear && !!$scope.chosenReport.chosenVariance) {
				return (columnIndex % 3 == 0) ? "" : (columnIndex % 3 == 2) ? "day-end" : "last-year";
			} else if (!!$scope.chosenReport.chosenLastYear || !!$scope.chosenReport.chosenVariance) {
				return (columnIndex % 2 == 0) ? "" : !!$scope.chosenReport.chosenVariance ? "day-end" : "last-year day-end";
			} else {
				return "day-end";
			}
		}

		$scope.getChargeCodeValue = function(chargeCodeIndex, columnIndex) {
			var candidate = $scope.results.charge_codes[chargeCodeIndex][$scope.selectedDays[parseInt(columnIndex / (1 + !!$scope.chosenReport.chosenLastYear + !!$scope.chosenReport.chosenVariance))]];
			if (candidate) {
				if (!!$scope.chosenReport.chosenLastYear && !!$scope.chosenReport.chosenVariance) {
					return (columnIndex % 3 == 0) ? candidate.this_year : (columnIndex % 3 == 2) ? (candidate.this_year - candidate.last_year) : candidate.last_year;
				} else if (!!$scope.chosenReport.chosenLastYear || !!$scope.chosenReport.chosenVariance) {
					return (columnIndex % 2 == 0) ? candidate.this_year : !!$scope.chosenReport.chosenVariance ? (candidate.this_year - candidate.last_year) : candidate.last_year;
				} else {
					return candidate.this_year;
				}
			} else {
				return '';
			}
		}

		$scope.getMarketOccupancyValue = function(marketIndex, columnIndex) {
			var candidate = $scope.results.market_room_number[marketIndex][$scope.selectedDays[parseInt(columnIndex / (1 + !!$scope.chosenReport.chosenLastYear + !!$scope.chosenReport.chosenVariance))]];
			if (candidate) {
				if (!!$scope.chosenReport.chosenLastYear && !!$scope.chosenReport.chosenVariance) {
					return (columnIndex % 3 == 0) ? candidate.this_year : (columnIndex % 3 == 2) ? (candidate.this_year - candidate.last_year) : candidate.last_year;
				} else if (!!$scope.chosenReport.chosenLastYear || !!$scope.chosenReport.chosenVariance) {
					return (columnIndex % 2 == 0) ? candidate.this_year : !!$scope.chosenReport.chosenVariance ? (candidate.this_year - candidate.last_year) : candidate.last_year;
				} else {
					return candidate.this_year;
				}
			} else {
				return -1;
			}
		}

		$scope.getMarketRevenueValue = function(marketIndex, columnIndex) {
			var candidate = $scope.results.market_revenue[marketIndex][$scope.selectedDays[parseInt(columnIndex / (1 + !!$scope.chosenReport.chosenLastYear + !!$scope.chosenReport.chosenVariance))]];
			if (candidate) {
				if (!!$scope.chosenReport.chosenLastYear && !!$scope.chosenReport.chosenVariance) {
					return (columnIndex % 3 == 0) ? candidate.this_year : (columnIndex % 3 == 2) ? (candidate.this_year - candidate.last_year) : candidate.last_year;
				} else if (!!$scope.chosenReport.chosenLastYear || !!$scope.chosenReport.chosenVariance) {
					return (columnIndex % 2 == 0) ? candidate.this_year : !!$scope.chosenReport.chosenVariance ? (candidate.this_year - candidate.last_year) : candidate.last_year;
				} else {
					return candidate.this_year;
				}
			} else {
				return '';
			}
		}

		function refreshScrollers() {
			$scope.refreshScroller('rightPanelScroll');
			$scope.refreshScroller('leftPanelScroll');
		}

		function init() {
			var chosenReport = RVreportsSrv.getChoosenReport();
			$scope.selectedDays = [];
			for (var ms = new tzIndependentDate(chosenReport.fromDate) * 1, last = new tzIndependentDate(chosenReport.untilDate) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
				$scope.selectedDays.push(dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd'));
			}
			$timeout(function() {
				refreshScrollers();
			}, 400)

		};

		init();

		$rootScope.$on('report.updated', function() {
			init();
		});

		$rootScope.$on('report.filter.change', function() {
			$timeout(function() {
				refreshScrollers();
			}, 400)
		});
	}
])