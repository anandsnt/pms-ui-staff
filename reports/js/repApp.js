
// create iscroll
var reportScroll = createVerticalScroll( '#reports', {} );
// refreshVerticalScroll

var reports = angular.module('reports', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap.datepicker']);

reports.config([
	'$datepickerProvider',
	function($datepickerProvider) {
		angular.extend($datepickerProvider.defaults, {
			dateFormat: 'yyyy/MM/dd',
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
	'$rootScope',
	'RepFetchSrv',
	'RepUserSrv',
	'RepFetchReportsSrv',
	function($scope, $rootScope, RepFetchSrv, RepUserSrv, RepFetchReportsSrv) {

		// hide the details page
		$rootScope.showReportDetails = false;

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
				console.log( response );

				sntapp.activityIndicator.hideActivityIndicator();
				$scope.showReports = true;

				$scope.reportList = response.results;
				$scope.reportCount = response.total_count;

				var hasDateFilter, hasCicoFilter, hasUserFilter, hasSortDate, hasSortUser;
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
					if (hasCicoFilter) {
						$scope.reportList[i]['cicoOptions'] = [
							{value: 'BOTH', label: 'Show only Check Ins and  Check Outs'},
							{value: 'IN', label: 'Show only Check Ins'},
							{value: 'OUT', label: 'Show only Check Outs'}
						]
					};

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

			refreshVerticalScroll( reportScroll );
		};

		$scope.genReport = function() {
			var params = {
				from_date: this.item.fromDate,
				to_date: this.item.untilDate,
				user_ids: this.item.chosenUsers,
				checked_in: this.item.chosenCico === 'IN' || this.item.chosenCico === 'BOTH',
				checked_out: this.item.chosenCico === 'OUT' || this.item.chosenCico === 'BOTH'
			}

			console.log( this.item.fromDate )

			// emit that the user wish to see report details
			$rootScope.$emit( 'report.submit', this.item, this.item.id, params );
		};

	}
]);



reports.controller('reportDetails', [
	'$scope',
	'$rootScope',
	'RepUserSrv',
	'RepFetchReportsSrv',
	function($scope, $rootScope, RepUserSrv, RepFetchReportsSrv) {

		// track the user list
		RepUserSrv.fetch()
			.then(function(response) {
				$scope.userList = response;
			});

		// listen for report submit form dashboard view
		var submitBind = $rootScope.$on('report.submit', function(event, item, id, params) {	

			// let show the loading indicator
			sntapp.activityIndicator.showActivityIndicator('BLOCKER');

			// we already know which user has chosen
			$scope.chosenReport = item;

			// make calls to the data service with passed down args
			RepFetchReportsSrv.fetch( id, params )
				.then(function(response) {

					console.log( response );

					// hide the loading indicator
					sntapp.activityIndicator.hideActivityIndicator();

					// lets slide in the details view
					$rootScope.showReportDetails = true;
				});
		});

		// the listner must be destroyed when no needed anymore
		$scope.$on( '$destroy', submitBind );

		// back btn 
		$scope.returnBack = function() {
			$rootScope.showReportDetails = false;
		};
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

		factory.users = [];

		factory.fetch = function() {
			var deferred = $q.defer();

			// if we have already fetched the user list already
			if ( this.users.length ) {
				deferred.resolve( this.users );
				return deferred.promise;
			};

			
			var url = '/api/users/active';
				
			$http.get(url)
				.success(function(response, status) {
					this.users = response;
					deferred.resolve(response);
				}.bind(this))
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


reports.factory('RepFetchReportsSrv', [
	'$http',
	'$q',
	function($http, $q) {
		var factory = {};

		factory.fetch = function(id, params) {
			var deferred = $q.defer();
			var url = '/api/reports/' + id + '/submit';
				
			$http.get(url, { params: params })
				.success(function(response, status) {
					deferred.resolve(response);
					console.log( response );
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
angular.bootstrap( angular.element('#reprots-wrapper'), ['reports'] );

