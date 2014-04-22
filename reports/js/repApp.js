
var reports = angular.module('reports', ['ngSanitize', 'mgcrea.ngStrap.datepicker']);

reports.config([
	'$datepickerProvider',
	function($datepickerProvider) {
		angular.extend($datepickerProvider.defaults, {
			dateFormat: 'MM/dd/yyyy',
			startWeek: 0,
			autoclose: true
		});
	}
]);

reports.filter('splitName', function() {
	return function(input, option) {
		if ( !input ) {
			return;
		};

		var name = input.split(' by ')[0];
		var by   = 'by ' + input.split(' by ')[1] + (input.split(' by ')[2] ? ' by ' + input.split(' by ')[2] : '');

		if ( option === 'name' ) {
			return name;
		};

		if ( option === 'by' ) {
			return by;
		};
	};
});

reports.controller('reporstList', [
	'$scope',
	'RepFetchSrv',
	'RepUserSrv',
	function($scope, RepFetchSrv, RepUserSrv) {

		sntapp.activityIndicator.showActivityIndicator('BLOCKER');

		// get today's date
		var t = new Date();
		var today = t.getMonth() + '-' + t.getDate() + '-' + t.getFullYear();
		$scope.isCal     = false;
		$scope.minDate   = '';
		$scope.maxDate   = today;
		$scope.currCal   = '';

		$scope.showReports = false;
		$scope.reportList  = [];
		$scope.reportCount = 0;
		$scope.userList    = [];

		// fetch the reports list with the filters to be used
		RepFetchSrv.fetch()
			.then(function(response) {
				sntapp.activityIndicator.hideActivityIndicator();
				$scope.showReports = true;

				$scope.reportList = response.results;
				$scope.reportCount = response.total_count;

				var hasDateFilter, hasCicoFilter, hasUserFilter;
				for (var i = 0, j = $scope.reportList.length; i < j; i++) {

					// include show_filter
					$scope.reportList[i]['show_filter'] = false;

					// has date filter
					hasDateFilter = _.find($scope.reportList[i]['filters'], function(item) {
						return item.value === 'DATE_RANGE';
					});
					$scope.reportList[i]['hasDateFilter'] = hasDateFilter ? true : false;

					// has cico filter
					hasCicoFilter = _.find($scope.reportList[i]['filters'], function(item) {
						return item.value === 'CICO';
					});
					$scope.reportList[i]['hasCicoFilter'] = hasCicoFilter ? true : false;

					// has user filter
					hasUserFilter = _.find($scope.reportList[i]['filters'], function(item) {
						return item.value === 'USER';
					});
					$scope.reportList[i]['hasUserFilter'] = hasUserFilter ? true : false;

					// for date filters
					$scope.reportList[i].today = new Date();
					$scope.reportList[i].allowedUntilDate = new Date();
				};
			});

		// fetch the users list
		RepUserSrv.fetch()
			.then(function(response) {
				sntapp.activityIndicator.hideActivityIndicator();
				$scope.showReports = true;

				$scope.userList = response;
			});

		// show hide filter
		$scope.toggleFilter = function() {
			// DO NOT flip as scuh could endup in infinite $digest loop
			this.item.show_filter = this.item.show_filter ? false : true; 
		};

	}
]);

reports.controller('reportItemCtrl', [
	'$scope',
	function($scope) {
		
	}
]);














reports.factory('RepFetchSrv', [
	'$http',
	'$q',
	function($http, $q) {
		var factory = {};

		factory.fetch = function() {
			var deferred = $q.defer();
			var url = '/api/reports';
				
			$http.get(url)
				.success(function(response, status) {
					deferred.resolve(response);
				})
				.error(function(response, status) {
					// please note the type of error expecting is array
					// so form error as array if you modifying it
					if(status == 406){ // 406- Network error
						deferred.reject(errors);
					}
					else if(status == 500){ // 500- Internal Server Error
						deferred.reject(['Internal server error occured']);
					}
					else if(status == 401){ // 401- Unauthorized
						console.log('lets redirect');
						// so lets redirect to login page
						$window.location.href = '/logout' ;
					}else{
						deferred.reject(errors);
					}
				});

			return deferred.promise;
		};

		return factory;
	}
]);


reports.factory('RepUserSrv', [
	'$http',
	'$q',
	function($http, $q) {
		var factory = {};

		factory.fetch = function() {
			var deferred = $q.defer();
			var url = '/api/users/active';
				
			$http.get(url)
				.success(function(response, status) {
					deferred.resolve(response);
				})
				.error(function(response, status) {
					// please note the type of error expecting is array
					// so form error as array if you modifying it
					if(status == 406){ // 406- Network error
						deferred.reject(errors);
					}
					else if(status == 500){ // 500- Internal Server Error
						deferred.reject(['Internal server error occured']);
					}
					else if(status == 401){ // 401- Unauthorized
						console.log('lets redirect');
						// so lets redirect to login page
						$window.location.href = '/logout' ;
					}else{
						deferred.reject(errors);
					}
				});

			return deferred.promise;
		};

		return factory;
	}
]);



// need manual bootstraping app
angular.bootstrap( angular.element('#reports'), ['reports'] );

// create iscroll
createVerticalScroll( '#reports', {} );