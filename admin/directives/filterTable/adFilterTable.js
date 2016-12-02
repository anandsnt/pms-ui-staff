admin.directive('adFilterTable', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		scope: {
			filterConfig: '=',
			hideSubTitle: '=',
			singleTab: '=',
			responseKey: '='
		},
		templateUrl: '/assets/directives/filterTable/adFilterTable.html',
		controller: 'adFilterTableController'
	};
});