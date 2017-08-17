
sntRover.controller('RVCompanyCardArTransactionsMainCtrl', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', '$stateParams', 'ngDialog', '$state', '$vault', '$window', 'RVReservationCardSrv', '$filter',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv, $filter) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';
		$scope.currentSelectedArTab = 'balance';
		// Refresh the scroller when the tab is active.

		$rootScope.$on("arTransactionTabActive", function(event) {
			console.log("----------------")
			// refreshArTabScroller();
		});

		$scope.switchArTransactionTab = function(tab) {
			$scope.currentSelectedArTab = tab;
		};

		var init = function() {
			console.log("--init")
		}

		init();
		
}]);
