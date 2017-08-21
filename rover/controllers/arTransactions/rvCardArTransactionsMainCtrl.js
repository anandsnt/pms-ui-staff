
sntRover.controller('RVCompanyCardArTransactionsMainCtrl', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', '$stateParams', 'ngDialog', '$state', '$vault', '$window', 'RVReservationCardSrv', '$filter',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv, $filter) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';
		$scope.arFlags = {};
		$scope.arFlags.currentSelectedArTab = 'balance';
		$scope.arFlags.isAddBalanceScreenVisible = false;

		$rootScope.$on("arTransactionTabActive", function(event) {
			console.log("----------------")
			// refreshArTabScroller();
		});

		$scope.switchArTransactionTab = function(tab) {
			$scope.arFlags.currentSelectedArTab = tab;
			if (tab !== 'balance') {
				$scope.arFlags.isAddBalanceScreenVisible = false;
			}
		};	
		
		$scope.showAddBalanceScreen = function () {
			$scope.arFlags.isAddBalanceScreenVisible = true;
		};	

		$scope.clickedCancelAddBalance = function () {
			$scope.arFlags.isAddBalanceScreenVisible = false;
		}

		var init = function() {
			console.log("--init")
		}

		init();
		
}]);
