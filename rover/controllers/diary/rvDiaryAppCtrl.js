sntRover.controller('RVDiaryAppCtrl', 
	['$scope', 
	 '$rootScope', 
	 '$state', 
	 '$stateParams',
	 'rvDiaryReservationCompatSrv', 
	 'rvDiaryStoreSrv',
	 'rvDiaryUtilSrv',
	 'ngDialog',
	function($scope, $rootScope, $state, $stateParams, rvDiaryStoreSrv, ngDialog) {
		var slice 	= Array.prototype.slice,
			has 	= Object.prototype.hasOwnProperty,
			define 	= Object.defineProperty;

		function PerfTimer(name) {
			var _start, _end, _elapsed = [], _start_date;

			this.name = name;

			return {
				startTimer: function() {
					_start = _.now();
					_start_date = new Date();
				},
				endTimer: function() {
					_end = _.now();

					_elapsed.push( { elasped: ((_end - _start) / 1000).toFixed(6) + 's',
									 start_time: _start_time } );

					_start = _end = _start_date = null;

					return _.last(_elapsed);
				},
				statistics: function() {
					var runningTotal = 0;

					_elapsed.forEach(function(time_span_ms, idx) {
						runningTotal += time_span_ms;
					});

					return (runningTotal / _elapsed.length).toFixed(6);
				}
			}
		}

		BaseCtrl.call(this, $scope);

		$scope.setTitle('Reservations');

		$scope.$emit('updateRoverLeftMenu', 'diaryReservation')

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			// Show a loading message until promises are not resolved

			alert(slice.call(arguments));

			$scope.$emit('showLoader');
		});

		$rootScope.$on('$stateChangeSuccess', function(e, curr, prev) {
			// Hide loading message
			
			console.log(arguments);

			$scope.$emit('hideLoader');
		});

		$rootScope.$on('$stateNotFound', function() {
			var args = slice.call(arguments);

			alert('State Not Found', args);
		});

		$rootScope.$on('$stateChangeError', function() {
			var args = slice.call(arguments);

			alert('State Change Error', args);
		});

		$rootScope.$on('$viewContentLoaded', function() {
			var args = slice.call(arguments);

			console.log('view content loaded', args);
		});

		$rootScope.$on('$viewContentLoadeding', function() {
			var args = slice.call(arguments);

			alert('view content load in progress', args);
		});
	}]
);