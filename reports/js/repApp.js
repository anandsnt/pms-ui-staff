// create iscroll
createVerticalScroll('#reports');

var reports = angular.module('reports', ['pickadate']);

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

		$scope.isCal     = false;
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

		// show cal
		$scope.showCal = function() {
			$scope.isCal = $scope.isCal ? false : true; 
		};
	}
]);

reports.controller('reportItemCtrl', [
	'$scope',
	function($scope) {

		$scope.genReport = function() {
			console.log( $scope.$parent.item.chosenUsers );
		};
	}
]);