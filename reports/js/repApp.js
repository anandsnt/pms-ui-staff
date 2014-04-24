
// create iscroll
var reportScroll = createVerticalScroll( '#reports', {} );
var reportContent = createVerticalScroll( '#report-content', {} );


var reports = angular.module('reports', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap.datepicker']);

reports.config([
	'$datepickerProvider',
	function($datepickerProvider) {
		angular.extend($datepickerProvider.defaults, {
			dateFormat: 'yyyy/MM/dd',
			startWeek: 0,
			autoclose: true,
			container: 'body'
		});
	}
]);

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

		$scope.showReports = false;
		$scope.reportList  = [];
		$scope.reportCount = 0;
		$scope.userList    = [];

		// lets fix the results per page to, user can't edit this for now
		// 25 is the current number set by backend server
		$rootScope.resultsPerPage = 25;

		// fetch the reports list with the filters to be used
		RepFetchSrv.fetch()
			.then(function(response) {
				sntapp.activityIndicator.hideActivityIndicator();
				$scope.showReports = true;

				$scope.reportList = response.results;
				$scope.reportCount = response.total_count;

				// looping through results to add more features
				var hasDateFilter, hasCicoFilter, hasUserFilter, hasSortDate, hasSortUser;
				for (var i = 0, j = $scope.reportList.length; i < j; i++) {

					// add report icon class

					if ($scope.reportList[i]['title'] == 'Upsell') {
						$scope.reportList[i]['reportIconCls'] = 'icon-upsell';
					} else if ($scope.reportList[i]['title'] == 'Late Check Out') {
						$scope.reportList[i]['reportIconCls'] = 'icon-late-check-out';
					} else {
						// lets have cico icon as
						$scope.reportList[i]['reportIconCls'] = 'icon-check-in-check-out';
					}

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
							{value: 'BOTH', label: 'Show Check Ins and  Check Outs'},
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
				checked_out: this.item.chosenCico === 'OUT' || this.item.chosenCico === 'BOTH',
				page: 1,
				per_page: $rootScope.resultsPerPage
			}

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

		// common methods to do things after fetch report
		var afterFetch = function(response) {
			// fill in data for ng-grid
			$scope.totals = response.totals;
			$scope.headers = response.headers;
			$scope.results = response.results;

			$scope.totalCount = response.total_count;
			$scope.currCount = response.results.length;

			// hide the loading indicator
			sntapp.activityIndicator.hideActivityIndicator();

			// lets slide in the details view
			$rootScope.showReportDetails = true;

			// refesh the report scroll
			refreshVerticalScroll( reportContent );
		};

		// we are gonna need to drop some pagination
		// this is done only once when the report details is loaded
		// and when user updated the filters
		var calPagination = function(response) {
			$scope.pagination = [];
			if (response.results.length < response.total_count) {
				var pages = Math.floor( response.total_count / response.results.length );
				var extra = response.total_count % response.results.length;

				if (extra > 0) {
					pages++;
				};

				for (var i = 1; i <= pages; i++) {
					$scope.pagination.push({
						no: i,
						active: i === 1 ? true : false
					})
				};
			};
		};

		// listen for report submit form dashboard view
		var submitBind = $rootScope.$on('report.submit', function(event, item, id, params) {	

			// let show the loading indicator
			sntapp.activityIndicator.showActivityIndicator('BLOCKER');

			// we already know which user has chosen
			$scope.chosenReport = item;

			// let save the report id
			$scope.reportID = id;

			// make calls to the data service with passed down args
			RepFetchReportsSrv.fetch( id, params )
				.then(function(response) {
					afterFetch( response );
					calPagination( response );
				});
		});

		// the listner must be destroyed when no needed anymore
		$scope.$on( '$destroy', submitBind );

		// back btn 
		$scope.returnBack = function() {
			$rootScope.showReportDetails = false;
		};

		// fetch next page on pagination change
		$scope.fetchNextPage = function() {

			// user tried to reload the current page
			if (this.page.active) {
				return;
			};

			// change the current active number
			var currPage = _.find($scope.pagination, function(page) {
				return page.active === true
			});
			currPage.active = false;
			this.page.active = true;

			var params = {
				from_date: $scope.chosenReport.fromDate,
				to_date: $scope.chosenReport.untilDate,
				user_ids: $scope.chosenReport.chosenUsers,
				checked_in: $scope.chosenReport.chosenCico === 'IN' || $scope.chosenReport.chosenCico === 'BOTH',
				checked_out: $scope.chosenReport.chosenCico === 'OUT' || $scope.chosenReport.chosenCico === 'BOTH',
				page: this.page.no,
				per_page: $rootScope.resultsPerPage
			}

			// let show the loading indicator
			sntapp.activityIndicator.showActivityIndicator('BLOCKER');

			// and make the call
			RepFetchReportsSrv.fetch( $scope.reportID, params )
				.then(function(response) {
					afterFetch( response );
				});
		};

		// fetch the updated result based on the filter changes
		$scope.fetchUpdatedReport = function() {

			// now sice we are gonna update the filter
			// we are gonna start from page one
			var params = {
				from_date: $scope.chosenReport.fromDate,
				to_date: $scope.chosenReport.untilDate,
				user_ids: $scope.chosenReport.chosenUsers,
				checked_in: $scope.chosenReport.chosenCico === 'IN' || $scope.chosenReport.chosenCico === 'BOTH',
				checked_out: $scope.chosenReport.chosenCico === 'OUT' || $scope.chosenReport.chosenCico === 'BOTH',
				page: 1,
				per_page: $rootScope.resultsPerPage
			}

			// let show the loading indicator
			sntapp.activityIndicator.showActivityIndicator('BLOCKER');

			// and make the call
			RepFetchReportsSrv.fetch( $scope.reportID, params )
				.then(function(response) {
					afterFetch( response );
					calPagination( response );
				});
		};
	}
]);














reports.factory('RepFetchSrv', [
	'$http',
	'$q',
	'$window',
	function($http, $q, $window) {
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
						$window.location.href = '/logout';
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
	'$window',
	function($http, $q, $window) {
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
	'$window',
	function($http, $q, $window) {
		var factory = {};

		factory.fetch = function(id, params) {
			var deferred = $q.defer();
			var url = '/api/reports/' + id + '/submit';
				
			$http.get(url, { params: params })
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
angular.bootstrap( angular.element('#reprots-wrapper'), ['reports'] );

