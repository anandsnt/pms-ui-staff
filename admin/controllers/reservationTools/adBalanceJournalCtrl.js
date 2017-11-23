// list all the reservation tools list
// since we can only bring the main menu states from db

admin.controller('ADBalanceJournalCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'allJobs',
	'ADReservationToolsSrv',
	'ngDialog',
	'$filter',
	function($scope, $rootScope, $state, allJobs, ADReservationToolsSrv, ngDialog, $filter) {
		BaseCtrl.call(this, $scope);

		$scope.errorMessage = "";

		$scope.balanceJournalJob = _.findWhere(allJobs, {"job_name": "SYNC DailyBalanceCorrection"});

		$scope.anyJobRunning = false;
		$scope.lastRunStatus = '';

		$scope.payload = {
			'id': $scope.balanceJournalJob.id,
			'begin_date': '',
			'end_date': ''
		};

		$scope.previousDayOfBusinessDate = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days').format($rootScope.hotelDateFormat);

		$scope.previousDayOfBusinessDateInDbFormat = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days');
		

		$scope.startJob = function() {
			var _callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.anyJobRunning = true;
			};

			var _error = function(error) {
				$scope.$emit('hideLoader');
			};

			$scope.invokeApi(ADReservationToolsSrv.postScheduleJob, $scope.payload, _callback, _error);
		};

		$scope.popupCalendar = function(dateNeeded) {
			$scope.dateNeeded = dateNeeded;

		    ngDialog.open({
		        template: '/assets/partials/reservationTools/jobDatePicker.html',
		        controller: 'ADJobDatePickerBalanceJournalController',
		        className: 'ngdialog-theme-default single-calendar-modal',
		        scope: $scope,
		        closeByDocument: true
		    });
		};

		// $rootScope.$on('datepicker.update', function(event, chosenDate) {
		// 	if ( $scope.dateNeeded === 'from' ) {
		// 		$scope.payload.begin_date = chosenDate;

		// 		// make sure the dates are valid -> end is after begin
		// 		if ( $scope.payload.end_date ) {
		// 			$scope.payload.end_date = checkDates($scope.payload.begin_date, $scope.payload.end_date);
		// 		}
		// 	} else {
		// 		$scope.payload.end_date = chosenDate;
		// 	}
		// });


	}
]);