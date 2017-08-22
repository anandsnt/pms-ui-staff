
sntRover.controller('RVCompanyCardArTransactionsMainCtrl', 
	['$scope', 
	'$rootScope', 
	'rvAccountsArTransactionsSrv', 
	function($scope, $rootScope, rvAccountsArTransactionsSrv) {

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

		var successCallbackOfsaveARDetailsWithoutARNumber = function (){
			console.log("reached succes");
		}

		var init = function() {
			console.log("--init")
			console.log($scope.accountId)
			//$scope.invokeApi(rvAccountsArTransactionsSrv.fetchTransactionDetails, dataToSend, successCallbackOfsaveARDetailsWithoutARNumber );
		}

		init();
		
}]);
