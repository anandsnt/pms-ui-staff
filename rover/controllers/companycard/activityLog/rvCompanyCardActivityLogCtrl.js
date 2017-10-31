
sntRover.controller('RVCompanyCardActivityLogCtrl',
	['$scope',
	'$rootScope',
	'$stateParams',
	'ngDialog',
	'$timeout',
	'rvAccountsArTransactionsSrv',
	'RVReservationCardSrv',
	'$window',
    '$filter',
    'rvPermissionSrv',
	function($scope, $rootScope, $stateParams, ngDialog, $timeout, rvAccountsArTransactionsSrv, RVReservationCardSrv, $window, $filter, rvPermissionSrv) {
		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';

		/*
		 * Initial loading of the screen
		 *
		 */
		var init = function() {
			$scope.fetchTransactions();
		};

		/*
		 * Initial loading of this AR transactions tab
		 */
		$scope.$on("activityLogTabActive", function() {
			init();
		});

		// -------/ PAGINATION LOGIC /----------- //

		/*
		 * Fetch transactions APIs
		 * @param pageType { String } , Page No { String }to API
		 */
		var loadAPIData = function ( pageType, pageNo ) {
			
			$scope.invokeApi(rvAccountsArTransactionsSrv.fetchTransactionDetails, createParametersFetchTheData(), successCallbackOfFetchAPI );
		};

		// Pagination options for Activity Log
		$scope.activityLogPagination = {
			id: 'ACTIVITY_LOG',
			api: loadAPIData,
			perPage: 50
		};

		// -------/ PAGINATION LOGIC /----------- //

}]);
