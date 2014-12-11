sntRover.controller('RVCompanyCardArTransactionsCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout',
	function($scope, RVCompanyCardSrv, $timeout) {

		BaseCtrl.call(this, $scope);

		var init = function(){
			var arAccountsFetchSuccess = function(data) {
			    $scope.$emit('hideLoader');
			    alert("fetch success");
			    $console.log(data);
			};
			$scope.invokeApi(RVCompanyCardSrv.fetchArAccountsList, {}, arAccountsFetchSuccess);

		}

		init();





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

		$scope.filterActive = true;

		$scope.clickedFilter = function(){
			$scope.filterActive = !$scope.filterActive;
		};

	}
]);