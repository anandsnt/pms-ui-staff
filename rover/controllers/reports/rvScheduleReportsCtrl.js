angular.module('sntRover').controller('RVScheduleReportsCtrl', [
	'$rootScope',
	'$scope',
	'RVreportsSrv',
	'RVReportUtilsFac',
	'RVReportParamsConst',
	'RVReportMsgsConst',
	'RVReportNamesConst',
	'$filter',
	'$timeout',
	'rvUtilSrv',
	function($rootScope, $scope, reportsSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout, util) {
		BaseCtrl.call(this, $scope);

		$scope.reportSchedules = [];

		$scope.selectedSchedule = undefined;
		$scope.selectedScheduleParams = undefined;
		$scope.selectSchedule = function(item, index) {
			var success = function(data) {
				$scope.selectedScheduleParams = data;

				if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
					$scope.selectedSchedule.active = false;
				}
				$scope.selectedSchedule = $scope.reportSchedules[index];
				$scope.selectedSchedule.active = true;

				$scope.setViewCol( $scope.viewCols[3] );

				$scope.$emit( 'hideLoader' );
			};

			var failed = function(errors) {
				$scope.errors = errors;
				$scope.$emit( 'hideLoader' );
			};

			var params = {
				id: item.id
			};

			$scope.invokeApi( reportsSrv.fetchOneSchedule, params, success, failed );
		};

		var REPORT_SCHEDULES_SCROLL = 'REPORT_SCHEDULES_SCROLL';
		var setUpScrolls = function() {
			var scrollerOptions = {
			    tap: true,
			    preventDefault: false
			};

			$scope.setScroller(REPORT_SCHEDULES_SCROLL, scrollerOptions);
		};
		var refreshScrolls = function() {
			$scope.refreshScroller(REPORT_SCHEDULES_SCROLL);
			if ( $scope.myScroll.hasOwnProperty(REPORT_SCHEDULES_SCROLL) ) {
			    $scope.myScroll[REPORT_SCHEDULES_SCROLL].scrollTo(0, 0, 100);
			}
		};

		var fetchReportSchedules = function() {
			var success = function(data) {
				$scope.reportSchedules = data;
				refreshScrolls();
				$scope.$emit( 'hideLoader' );

				console.log( $scope.reportSchedules );
			};

			var failed = function(errors) {
				$scope.errors = errors;
				$scope.$emit( 'hideLoader' );
			};

			if ( ! $scope.reportSchedules.length ) {
				$scope.invokeApi( reportsSrv.fetchSchedules, {}, success, failed );
			}
		};

		var init = function() {
			$scope.reportSchedules = [];

			setUpScrolls();

			fetchReportSchedules();
		};

		init();
	}
]);