var reports = angular.module('reports', []);

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
	'$http',
	'$q',
	'$scope',
	function($http, $q, $scope) {

		sntapp.activityIndicator.showActivityIndicator('BLOCKER');

		$scope.showReports = false;
		$scope.list = [];
		$scope.listCount = 0;

		$scope.fetch = function() {
			var deferred = $q.defer();
			var url = '/api/reports';
				
			$http.get(url)
				.success(function(response, status) {
					console.log( response );
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

		$scope.fetch()
			.then(function(response) {
				sntapp.activityIndicator.hideActivityIndicator();
				$scope.showReports = true;

				$scope.list = response.results;
				$scope.listCount = response.total_count;

				for (var i = 0, j = $scope.list.length; i < j; i++) {

					// include show_filter
					$scope.list[i]['show_filter'] = false;
				};
			});

		// show hide filter
		$scope.toggleFilter = function() {
			// DO NOT flip as scuh could endup in infinite $digest loop
			this.item.show_filter = this.item.show_filter ? false : true; 
		};

		// show date range
		$scope.hasDateRange = function(item) {
			var dateRange = _.find(item.filters, function(filter) {
				return filter.value = 'DATE_RANGE';
			});

			return dateRange ? true : false;
		};

		// show tranction type
		$scope.hasTransactionType = function(item) {
			var transactionType = _.find(item.filters, function(filter) {
				return filter.value = 'CICO';
			});

			return transactionType ? true : false;
		};

		$scope.hasStaff = function(item) {
			var staff = _.find(item.filters, function(filter) {
				return filter.value = 'STAFF';
			});

			return staff ? true : false;
		};
	}
]);