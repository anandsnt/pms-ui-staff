sntRover.controller('RVReportsMainCtrl', [
	'$rootScope',
	'$scope',
	'reportsResponse',
	function($rootScope, $scope, reportsResponse) {

		BaseCtrl.call(this, $scope);

		// set a back button, by default keep hidden
		$rootScope.setPrevState = {
		    hide: true,
		    title: 'Report List',
		    callback: 'goBackReportList',
		    scope: $scope
		};

		$scope.setTitle( 'Stats & Reports' );

		$scope.$emit("updateRoverLeftMenu", "reports");

		$scope.reportList = reportsResponse.results;

		$scope.reportCount = reportsResponse.total_count;

		$scope.showReportDetails = false;

		$scope.goBackReportList = function() {
			$rootScope.setPrevState.hide = true;

			$scope.showReportDetails = false;
		};

		// off again with another dirty hack to resolve an iPad issue
		// when picking the date, clicking on the black mask doesnt close calendar 
		var closeMask = function(e) {
		    if ( $(e.target).hasClass('datepicker-mask') || $(e.target).is('body') ) {
		        $( 'body' ).find( '.datepicker-mask' ).trigger( 'click' );
		    }
		};
		$( 'body' ).on( 'click', closeMask );
		$scope.$on( '$destroy', function() {
		    $( 'body' ).off( closeMask );
		} );
	}
]);
