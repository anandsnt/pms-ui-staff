sntRover.controller('RVCompanyCardArTransactionsCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout',
	function($scope, RVCompanyCardSrv, $timeout) {

		BaseCtrl.call(this, $scope);

		// $scope.setScroller('cardAccountsScroller');

		// var refreshScroller = function() {
		// 	$timeout(function() {
		// 		if ($scope.myScroll && $scope.myScroll['cardAccountsScroller']) {
		// 			$scope.myScroll['cardAccountsScroller'].refresh();
		// 		}
		// 		$scope.refreshScroller('cardAccountsScroller');
		// 	}, 500)
		// };

		// $scope.$on('refreshAccountsScroll', refreshScroller);

		

	}
]);