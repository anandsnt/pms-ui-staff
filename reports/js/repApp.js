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

		$scope.fetch().then(function(response) {
			$scope.list = response.results;
			$scope.listCount = response.total_count;

			// include show_filter
			for (var i = 0, j = $scope.list.length; i < j; i++) {
				$scope.list[i]['show_filter'] = false;
			};
		});

		// show hide filter
		$scope.toggleFilter = function() {
			// DO NOT flip as scuh could endup in infinite $digest loop
			this.item.show_filter = this.item.show_filter ? false : true; 
		};
	}
]);