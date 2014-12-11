sntRover.controller('RVCompanyCardArTransactionsCtrl', ['$scope', 'RVCompanyCardSrv', '$timeout',
	function($scope, RVCompanyCardSrv, $timeout) {

		BaseCtrl.call(this, $scope);

		$scope.filterData = {};
		$scope.filterData.filterActive = true;
		$scope.filterData.showFilterFlag = 'OPEN';
		

		var fetchData = function(params){
			var arAccountsFetchSuccess = function(data) {
			    $scope.$emit('hideLoader');
			    $scope.arTransactionDetails = {};
			    $scope.arTransactionDetails = data;
			};

			var failure = function(){
			    $scope.$emit('hideLoader');
			};

			$scope.invokeApi(RVCompanyCardSrv.fetchArAccountsList, params, arAccountsFetchSuccess, failure);
		};

		var initParams = {
			"id": 17,
			"paid" : false,
			"from_date":"",
			"to_date": ""
		};

		fetchData( initParams );

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
			var params = {
				"id": 17,
				"paid" : true,
				"from_date":"",
				"to_date": ""
			};
			fetchData( params );
		};

		var showOnlyOpen = function(){
			var params = {
				"id": 17,
				"paid" : false,
				"from_date":"",
				"to_date": ""
			};
			fetchData( params );
		};

		$scope.chagedShowFilter = function(){
			console.log($scope.filterData.showFilterFlag);
			if($scope.filterData.showFilterFlag == 'ALL') showAll();
			else showOnlyOpen();
		};

	}
]);