// list all the reservation tools list
// since we can only bring the main menu states from db

admin.controller('ADBalanceInventoryCtrl', [
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

		$scope.balanceInventoryJob =  _.findWhere(allJobs, {"job_name": "SYNC INventoryDetails"});

		$scope.anyJobRunning = false;
		$scope.lastRunStatus = '';

		$scope.payload = {
			'id': $scope.balanceInventoryJob.id,
			'begin_date': '',
			'end_date': '',
			'first_date': '', 
			'last_date': ''
		};


		var calWeekAfter = function(fromDate) {
		    var _stringDate = $filter('date')(fromDate, 'yyyy-MM-dd'),
		    	_dateParts  = _stringDate.match(/(\d+)/g),
		        _year  = parseInt( _dateParts[0] ),
		        _month = parseInt( _dateParts[1] ) - 1,
		        _date  = parseInt( _dateParts[2] );

		    return new Date(_year, _month, _date + 7);
		};

		var checkDates = function(begin, end) {
			var beginDate = tzIndependentDate(begin),
				endDate   = tzIndependentDate(end);

			if ( +endDate < +beginDate ) {
				return $filter('date')(calWeekAfter(beginDate), 'yyyy-MM-dd');
			} else {
				return end;
			}
		};


		$scope.refreshStatus = function() {
			var _param = {
				'id': $scope.balanceInventoryJob.id
			};

			var _callback = function(status) {
				$scope.$emit('hideLoader');

				if ( status === 'INPROGRESS' ) {
					$scope.anyJobRunning = true;
				} else {
					$scope.anyJobRunning = false;
				}

				$scope.lastRunStatus = status;
			};

			var _error = function(error) {
				$scope.$emit('hideLoader');
			};

			$scope.invokeApi(ADReservationToolsSrv.checkJobStatus, _param, _callback, _error);
		};

		$scope.refreshStatus();

		$scope.startJob = function() {
			var _callback = function(data) {
				$scope.$emit('hideLoader');

				$scope.anyJobRunning = true;
			};

			var _error = function(error) {
				$scope.$emit('hideLoader');
			};

			var unwantedKeys = ["first_date", "last_date"],			
			    data = dclone($scope.payload, unwantedKeys);

			$scope.invokeApi(ADReservationToolsSrv.postScheduleJob, data, _callback, _error);
		};

		$scope.popupCalendar = function(dateNeeded) {
			$scope.dateNeeded = dateNeeded;

		    ngDialog.open({
		        template: '/assets/partials/reservationTools/jobDatePicker.html',
		        controller: 'ADJobDatePicker',
		        className: 'ngdialog-theme-default single-calendar-modal',
		        scope: $scope,
		        closeByDocument: true
		    });
		};

		$rootScope.$on('datepicker.update', function(event, chosenDate) {
			if ( $scope.dateNeeded === 'from' ) {
				$scope.payload.begin_date = chosenDate;
				$scope.payload.first_date = moment(tzIndependentDate(chosenDate))
											.format($rootScope.hotelDateFormat);

				// make sure the dates are valid -> end is after begin
				if ( $scope.payload.last_date ) {
					$scope.payload.last_date = checkDates($scope.payload.begin_date, $scope.payload.end_date);
				}
			} else {
				$scope.payload.last_date = moment(tzIndependentDate(chosenDate))
											.format($rootScope.hotelDateFormat);
				$scope.payload.end_date = chosenDate;
			}
		});


	}
]);