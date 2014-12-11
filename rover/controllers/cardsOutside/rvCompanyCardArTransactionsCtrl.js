sntRover.controller('RVCompanyCardArTransactionsCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout',
	function($scope, RVCompanyCardSrv, $timeout) {

		BaseCtrl.call(this, $scope);
		$scope.filterData = {};
		$scope.filterData.filterActive = true;
		$scope.filterData.showFilterFlag = 'OPEN';

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


		$scope.clickedFilter = function(){
			$scope.filterData.filterActive = !$scope.filterData.filterActive;
		};

		var showAll = function(){
			angular.forEach($scope.data.bills,function(item, index) {
                item.show = true;
            }
		};

		var showOnlyOpen = function(){
			angular.forEach($scope.data.bills,function(item, index) {
                if(item.paid) item.show = false;
                else item.show = true;
            }
		};

		$scope.chagedShowFilter = function(){
			console.log($scope.filterData.showFilterFlag);
			if($scope.filterData.showFilterFlag == 'ALL') showAll();
			else showOnlyOpen();
		};

	}
]);