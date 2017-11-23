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

		$scope.previousDayOfBusinessDate = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days').format($rootScope.hotelDateFormat);

		$scope.previousDayOfBusinessDateInDbFormat = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days').format("YYYY-MM-DD");
		$scope.payload = {
			'id': $scope.balanceJournalJob.id,
			'end_date': $scope.previousDayOfBusinessDateInDbFormat
		};

		/*
		 * API when clicks start job
		 */
		$scope.startJob = function() {
			var successCallback = function(data) {
				$scope.anyJobRunning = true;
			};

			var options = {
				params: $scope.payload,
				successCallBack: successCallback
			};

			$scope.callAPI(ADReservationToolsSrv.postScheduleJob, options);
		};
		/*
		 * Click calender icon handled
		 */
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
		/*
		 * Action when select date from calender
		 */
		$rootScope.$on('datepicker.update', function(event, chosenDate) {
			if ( $scope.dateNeeded === 'from' ) {
				$scope.payload.begin_date = chosenDate;

				// make sure the dates are valid -> end is after begin
				if ( $scope.payload.end_date ) {
					$scope.payload.end_date = checkDates($scope.payload.begin_date, $scope.payload.end_date);
				}
			} else {
				$scope.payload.end_date = chosenDate;
			}
		});
		/*
		 * Check the job status on refresh
		 */
		$scope.refreshStatus = function() {
			var _param = {
				'id': $scope.balanceJournalJob.id
			};

			var successCallback = function(status) {

				if ( status === 'INPROGRESS' ) {
					$scope.anyJobRunning = true;
				} else {
					$scope.anyJobRunning = false;
				}

				$scope.lastRunStatus = status;
			};

			var options = {
				params: $scope.payload,
				successCallBack: successCallback
			};
			
			$scope.callAPI(ADReservationToolsSrv.checkJobStatus, options);
		};


	}
]);