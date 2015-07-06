sntRover.controller('RVComparisonReportCtrl', [
	'$rootScope',
	'$scope',
	'$filter',
	'RVReportUtilsFac',
	function($rootScope, $scope, $filter, reportUtils) {

		var currencySymbol = $rootScope.currencySymbol;
		
		// initial data process
		init();
		
		// re-render must be initiated before for taks like printing.
		// thats why timeout time is set to min value 50ms
		$scope.$on('report.submit', function() {
			init();
		});
		$scope.$on('report.printing', function() {
			init();
		});
		$scope.$on('report.updated', function() {
			init();
		});
		$scope.$on('report.page.changed', function() {
			init();
		});
		
		function init () {
			var results = $scope.$parent.results,
				processed,
				i,
				j;
	
			$scope.staticEntries = [];
			$scope.totalEntry = [];
			$scope.cgEntries = [];
	
			for (i = 0, j = results.length; i < j; i++) {
				if ( !!results[i]['is_total_revenue'] ) {
					$scope.totalEntry.push( results[i] );
				} else if ( !!results[i]['is_charge_group'] ) {
					$scope.cgEntries.push( results[i] );
				} else if ( !!results[i]['is_static'] ) {
					processed = postProcess(results[i]);
					$scope.staticEntries.push( processed );
				};
			};	
		};

		function postProcess (entry) {
			switch ( entry.section ) {
				case 'Total Occupancy %':
				case 'Total Occupancy % (Excl Comp)':
					entry.today         += '%';
					entry.mtd           += '%';
					entry.last_year_mtd += '%';
					entry.ytd           += '%';
					entry.last_year_ytd += '%';
					break;

				case 'ADR':
				case 'ADR (Excl Comp)':
				case 'Revpar':
					entry.today         = $filter('currency')(entry.today, currencySymbol, 2);
					entry.mtd           = $filter('currency')(entry.mtd, currencySymbol, 2);
					entry.last_year_mtd = $filter('currency')(entry.last_year_mtd, currencySymbol, 2);
					entry.ytd           = $filter('currency')(entry.ytd, currencySymbol, 2);
					entry.last_year_ytd = $filter('currency')(entry.last_year_ytd, currencySymbol, 2);
					break;

				default:
					// no op
					break;
			};

			return entry;
		};
    }
]);
