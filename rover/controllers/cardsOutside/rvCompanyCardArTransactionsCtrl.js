sntRover.controller('RVCompanyCardArTransactionsCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout',
	function($scope, RVCompanyCardSrv, $timeout) {

		BaseCtrl.call(this, $scope);

		$scope.filterData = {};
		$scope.filterData.filterActive = true;
		$scope.filterData.showFilterFlag = 'OPEN';
		$scope.arTransactionDetails = {};

		var init = function(){
			var arAccountsFetchSuccess = function(data) {
			    $scope.$emit('hideLoader');
			    $scope.arTransactionDetails = data;
			    console.log(data);
			};

			var failure = function(){
			    $scope.$emit('hideLoader');
			};
			$scope.invokeApi(RVCompanyCardSrv.fetchArAccountsList, {}, arAccountsFetchSuccess, failure);

		};

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


		$scope.clickedFilter = function(){
			$scope.filterData.filterActive = !$scope.filterData.filterActive;
		};

		var showAll = function(){
			
		};

		var showOnlyOpen = function(){
			
		};

		$scope.chagedShowFilter = function(){
			console.log($scope.filterData.showFilterFlag);
			if($scope.filterData.showFilterFlag == 'ALL') showAll();
			else showOnlyOpen();
		};

	}
]);