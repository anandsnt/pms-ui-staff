sntRover.controller('RVMoveChargeCtrl', 
	['$scope','$timeout','RVBillCardSrv',
	function($scope,$timeout,RVBillCardSrv) {

		var initiate = function(){
			$scope.numberQuery = "";
			$scope.textQuery = "";
			$scope.searchResults = [];
			$scope.targetSelected = false;
			$scope.selectedTarget = {};
			$scope.targetBillId = "";
			$scope.setScroller('search_results');
		};
		initiate();

		// $scope.clearTextQuery = function(){
		// 	console.log($scope.textQuery)
		// 	$scope.textQuery = "";
		// 	console.log($scope.textQuery)
		// };
		// $scope.clearNumberQuery = function(){
		// 	console.log($scope.numberQuery)
		// 	$scope.numberQuery = "";
		// 	console.log($scope.numberQuery)
		// };



		var refreshSearchList = function() { 			
			$timeout(function() {
				$scope.refreshScroller('search_results');
			}, 2000);
		};


		var fetchFilterdData = function(){
			var fetchSucces = function(data){
				$scope.$emit("hideLoader");
				$scope.searchResults = data.results;
    			_.each($scope.searchResults, function(result,index) {
    				result.entity_id = index;
    			});
    			refreshSearchList();
			}
			$scope.invokeApi(RVBillCardSrv.fetchSearchedItems, {}, fetchSucces);
		};

		/**
		 * function to perform filtering/request data from 
		 * service in change event of query box
		 */
		$scope.queryEntered = function() {
			if (($scope.textQuery === "" || $scope.textQuery.length < 3) && ($scope.numberQuery === "" || $scope.numberQuery.length < 3 )) {
				$scope.searchResults = [];
			} else {
				fetchFilterdData();
			}
		};

		/**
		 * function to select one item from the filtered list
		 * 
		 */

		$scope.targetClicked =  function(selectedId){
			_.each($scope.searchResults, function(result) {
				if(result.entity_id === selectedId){
					$scope.selectedTarget = result;
					$scope.selectedTarget.displayNumber = (result.type ==="ACCOUNT" ||result.type ==="GROUP") ? result.account_num : result.conf_num;
					$scope.selectedTarget.displaytext = (result.type ==="ACCOUNT" ||result.type ==="GROUP") ? result.account_name : (result.last_name+' ,'+result.first_name);
					$scope.targetBillId =$scope.selectedTarget.bills[0].id;
					$scope.targetSelected = true;
				}
		    });
		};


		$scope.changeSelection =  function(){
			$scope.selectedTarget = {};
			$scope.targetSelected = false;
		};
}]);