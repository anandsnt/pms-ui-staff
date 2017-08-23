
sntRover.controller('RVCompanyCardArTransactionsMainCtrl', ['$scope', '$rootScope', 'RVCompanyCardSrv', '$timeout', '$stateParams', 'ngDialog', '$state', '$vault', '$window', 'RVReservationCardSrv', '$filter',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv, $filter) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';

		$scope.arFlags = {
			'currentSelectedArTab': 'balance',
			'isAddBalanceScreenVisible': false
		};

		/*
		 * Data Object set to handle various AR transaction lists.
		 */
		$scope.arDataObj = {
			'balanceList': [],
			'paidList': [],
			'unallocatedList': [],
			'allocatedList': [],

			'unpaidAmount': '',
			'paidAmount': '',
			'allocatedCredit': '',
			'unallocatedCredit': ''
		};

		/*
		 * Successcallback of API after fetching Ar Transaction details.
		 * Handling data based on tabs currently active.
		 */
		var successCallbackOfAPIcall = function( data ) {

			$scope.arDataObj.unpaidAmount = data.unpaid_amount;
			$scope.arDataObj.paidAmount = data.paid_amount;
			$scope.arDataObj.allocatedCredit = data.allocated_credit;
			$scope.arDataObj.unallocatedCredit = data.unallocated_credit;

			switch($scope.arFlags.currentSelectedArTab) {
			    case 'balance':
			        $scope.arDataObj.balanceList = data.ar_transactions;
			        break;
			    case 'paid-bills':
			        $scope.arDataObj.paidList = data.ar_transactions;
			        break;
			    case 'unallocated':
			        $scope.arDataObj.unallocatedList = data.ar_transactions;
			        break;
			    case 'allocated':
			        $scope.arDataObj.allocatedList = data.ar_transactions;
			        break;
			}
			$scope.$emit('hideLoader');
		};

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
