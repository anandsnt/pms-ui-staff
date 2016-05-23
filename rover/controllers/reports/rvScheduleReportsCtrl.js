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

		$scope.removeEmail = function(index) {
			$scope.emailList = [].concat(
				$scope.emailList.slice(0, index),
				$scope.emailList.slice(index + 1)
			);
		};
		$scope.userAutoCompleteSimple = {
			source: function(request, response) {
				var mapedUsers, found;

				mapedUsers = _.map($scope.activeUserList, function(user) {
					return {
						label: user.full_name || user.email,
						value: user.email
					};
				});
				found = $.ui.autocomplete.filter(mapedUsers, request.term);
				response(found);
			},
			select: function(event, ui) {
				var alreadyPresent = _.find($scope.emailList, function(email) {
					return email === ui.item.value;
				});

				if ( ! alreadyPresent ) {
					$scope.emailList.push( ui.item.value ); 
				}

				this.value = '';

				return false;
			},
			focus: function(event, ui) {
				return false;
			}
		};

		$scope.selectSchedule = function(item, index) {
			var success = function(data) {
				$scope.selectedScheduleDetails = data;

				if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
					$scope.selectedSchedule.active = false;
				}
				$scope.selectedSchedule = $scope.schedulesList[index];
				$scope.selectedSchedule.active = true;

				$scope.setViewCol( $scope.viewCols[3] );

				processScheduleDetails();

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

		$scope.getRepeatPer = function() {
			var found = _.find($scope.scheduleFreqType, { id: $scope.saveParams.frequency_id });
			return !! found ? found.value : 'Per';
		};

		var REPORT_SCHEDULES_SCROLL = 'REPORT_SCHEDULES_SCROLL';
		var setupScrolls = function() {
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

		var processScheduleDetails = function() {
			$scope.saveParams = {};

			if ( $scope.selectedScheduleDetails.hasOwnProperty('frequency') ) {
				$scope.saveParams.frequency_id = $scope.selectedScheduleDetails.frequency.id;
			} else {
				$scope.saveParams.frequency_id = undefined;
			}

			if ( $scope.selectedScheduleDetails.hasOwnProperty('repeates_every') ) {
				$scope.saveParams.repeats_every = $scope.selectedScheduleDetails.repeates_every;
			} else {
				$scope.saveParams.repeats_every = undefined;
			}
		};

		var fetchReportSchedulesFrequency = function() {
			var success = function(payload) {
				$scope.schedulesList = payload.schedulesList;
				$scope.scheduleFrequency = payload.scheduleFrequency;

				var getValue = function(value) {
					switch(value) {
						case 'DAILY':
							return 'Day';
						case 'HOURLY':
							return 'Hour';
						case 'WEEKLY':
							return 'Week';
						case 'MONTHLY':
							return 'Month';
						default:
							return 'Per';
					}
				};
				$scope.scheduleFreqType = _.map($scope.scheduleFrequency, function(freq) {
					return {
						id: freq.id,
						value: getValue(freq.value)
					};
				});

				refreshScrolls();
				$scope.$emit( 'hideLoader' );
			};

			var failed = function(errors) {
				$scope.errors = errors;
				$scope.$emit( 'hideLoader' );
			};

			if ( ! $scope.schedulesList.length ) {
				$scope.invokeApi( reportsSrv.reportSchedulesPayload, {}, success, failed );
			}
		};

		var init = function() {
			$scope.selectedSchedule = undefined;
			$scope.selectedScheduleDetails = undefined;

			$scope.schedulesList = [];
			$scope.scheduleFrequency = [];
			$scope.scheduleFreqType = [];
			$scope.emailList = [];

			$scope.saveParams = {};

			setupScrolls();

			fetchReportSchedulesFrequency();
		};

		init();
	}
]);