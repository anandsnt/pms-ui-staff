// list all the reservation tools list
// since we can only bring the main menu states from db

admin.controller('ADBalanceJournalCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'allJobs',
	'ADReservationToolsSrv',
	'ngDialog',
	'ngTableParams',
	'$timeout',
	'$filter',
	function($scope, $rootScope, $state, allJobs, ADReservationToolsSrv, ngDialog, ngTableParams, $timeout, $filter) {
		BaseCtrl.call(this, $scope);

		$scope.errorMessage = "";
		$scope.showPercentage = false;
		ADBaseTableCtrl.call(this, $scope, ngTableParams);

		$scope.balanceJournalJob = _.findWhere(allJobs, {"job_name": "SYNC DailyBalanceCorrection"});

		$scope.anyJobRunning = false;
		$scope.lastRunStatus = '';

		$scope.previousDayOfBusinessDate = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days')
											.format($rootScope.hotelDateFormat);

		$scope.previousDayOfBusinessDateInDbFormat = moment(tzIndependentDate($rootScope.businessDate)).subtract(1, 'days')
													.format("YYYY-MM-DD");
		$scope.payload = {
			'id': $scope.balanceJournalJob.id,
			'end_date': $scope.previousDayOfBusinessDateInDbFormat,
			'first_date': ''
		};

		/*
		 * API when clicks start job
		 */
		$scope.startJob = function() {
			var successCallback = function(data) {
				var startDate = moment(tzIndependentDate($scope.payload.first_date)).format("YYYY-DD-MM");
				$(".balance-status").addClass('notice');
				$(".balance-status").removeClass('success');
				$(".balance-status").removeClass('error');
				$scope.anyJobRunning = true;
				$scope.showPercentage = false;
				$scope.balanceJournalJobId = data.job_id;
				$scope.jobStatusTitle = "Balancing started";
				$scope.jobStatusText = "Balancing journal from " + startDate + " to " + $scope.payload.end_date;
				$scope.cancelOrChangeBtnTxt = "CANCEL JOB";
				$scope.runButtonText = "REFRESH STATUS";
				$scope.runForDiffDatesText = "";
			};

			var unwantedKeys = ["first_date"],			
				data = dclone($scope.payload, unwantedKeys);

			var options = {
				params: data,
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
				$scope.payload.first_date = moment(tzIndependentDate(chosenDate)).format($rootScope.hotelDateFormat);
			} 
		});
		/*
		 * Check the job status on refresh
		 */

		$scope.cancelOrChange = function() {
			$scope.anyJobRunning = false;
		}

		$scope.refreshStatus = function() {
			var params = {
				'id': $scope.balanceJournalJobId
			},
			successCallback = function(status) {
				$scope.anyJobRunning = true;
				$scope.statusData = status;
				$scope.showPercentage = true;
				$scope.progressPercentage = $scope.statusData.progress_percent;
				if ( $scope.progressPercentage === "100" ) {
					$(".balance-status").addClass('success');
					$(".balance-status").removeClass('notice');
					$(".balance-status").removeClass('error');
					$scope.jobStatusTitle = "Journal in balance";
					$scope.jobStatusText = "Balancing journal from " + $scope.statusData.begin_date + " to " + $scope.statusData.end_date + " completed successfully";
					$scope.runButtonText = "";
					$scope.cancelOrChangeBtnTxt = "";
					$scope.runForDiffDatesText = "RUN FOR DIFFERENT DATE";
				} 
				else if ($scope.statusData.job_failed_date != "" || $scope.statusData.error != "") {
					$(".balance-status").addClass('error');
					$(".balance-status").removeClass('success');
					$(".balance-status").removeClass('notice');
					$scope.jobStatusTitle = "Journal not in balance";
					$scope.jobStatusText = "Balancing journal from " + $scope.statusData.begin_date + " to " + $scope.statusData.end_date + " failed because " + $scope.statusData.error;
					$scope.cancelOrChangeBtnTxt = "CHANGE DATES";
					$scope.runForDiffDatesText = "";
					$scope.runButtonText = "TRY AGAIN";
				} 
				else {
					$(".balance-status").addClass('notice');
					$(".balance-status").removeClass('success');
					$(".balance-status").removeClass('error');
					$scope.jobStatusTitle = "Balancing in progress...";
					$scope.jobStatusText = "Balancing journal from " + $scope.statusData.begin_date + " to " + $scope.statusData.end_date;
					$scope.cancelOrChangeBtnTxt = "CANCEL JOBS";
					$scope.runButtonText = "REFRESH STATUS";
					$scope.runForDiffDatesText = "";
				}
			},
			options = {
				params: params,
				successCallBack: successCallback
			};
			
			$scope.callAPI(ADReservationToolsSrv.checkJobStatus, options);
		};

		$scope.toggleActivityLog = function() {
            if ($scope.detailsMenu !== 'adRateActivityLog') {
                $scope.detailsMenu = 'adRateActivityLog';
				$scope.loadTable();
            } else {
                $scope.detailsMenu = '';
            }
		};
		
		$scope.getActivityLog = function($defer, params) {
			$scope.showActivityLog = true;
			var getParams = $scope.calculateGetParams(params),
            successCallback = function(data) {
				$timeout(function() {
					$scope.currentClickedElement = -1;
					$scope.totalCount = data.total_count;
					$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
					$scope.activityLogData = data.results;
					$scope.currentPage = params.page();
					params.total(data.total_count);
					// params.total(data.results.length);
					$defer.resolve($scope.data);
				}, 500);
            },
			options = {
				params: getParams,
				successCallBack: successCallback
			};

            $scope.callAPI(ADReservationToolsSrv.fetchActivityLog, options);
		};

		$scope.loadTable = function() {
			$scope.tableParams = new ngTableParams({
					page: 1,  // show first page
					count: 5, // count per page
				}, {
					total: 1000, // length of data
					getData: $scope.getActivityLog
				}
			);
		};
	}
]);