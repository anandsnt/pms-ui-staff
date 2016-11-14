admin.directive('adFilterTable', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		scope: {
			filterConfig: '='
		},
		templateUrl: '/assets/directives/filterTable/adFilterTable.html',
		controller: 'adFilterTableController'
	};
});