sntRover.controller('RVMoveChargeCtrl', 
	['$scope','$timeout','RVMoveChargeSrv',
	function($scope,$timeout,RVMoveChargeSrv) {

		var initiate = function(){			
			$scope.numberQuery    = "";
			$scope.textQuery      = "";
			$scope.searchResults  = [];
			$scope.targetSelected = false;
			$scope.selectedTarget = {};
			$scope.targetBillId   = "";
			$scope.setScroller('search_results');
		};

		initiate();

		var refreshSearchList = function() { 			
			$timeout(function() {
				$scope.refreshScroller('search_results');
			}, 4000);
		};

		var unsetSearhList = function(){
			$scope.searchResults = [];
			refreshSearchList();
		};

		$scope.clearTextQuery = function(){
			$scope.textQuery = '';
			unsetSearhList();
		};


		$scope.clearNumberQuery = function(){
			$scope.numberQuery = '';
			unsetSearhList();
		};

		/**
		 * function to fetch reservation and account lists
		 * 
		 */

		var fetchFilterdData = function(){

			var fetchSucces = function(data){
				$scope.$emit("hideLoader");
				$scope.searchResults = data.results;
    			_.each($scope.searchResults, function(result,index) {
    				result.entity_id = index;
    				(result.type === 'RESERVATION') ? result.displaytext = result.last_name+', '+result.first_name : '';
    			});
    			refreshSearchList();
    			
			};

			$scope.invokeApi(RVMoveChargeSrv.fetchSearchedItems, {"text_search":$scope.textQuery,"number_search":$scope.numberQuery}, fetchSucces);
		};

		/**
		 * function to perform filtering/request data from 
		 * service in change event of query box
		 */
		$scope.queryEntered = function() {

			if (($scope.textQuery === "" || $scope.textQuery.length < 3) && ($scope.numberQuery === "" || $scope.numberQuery.length < 3 )) {
				unsetSearhList();
				refreshSearchList();
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
					$scope.selectedTarget               = result;
					$scope.selectedTarget.displayNumber = (result.type ==="ACCOUNT" ||result.type ==="GROUP") ? result.account_number : result.confirm_no;
					$scope.selectedTarget.displaytext   = (result.type ==="ACCOUNT" ||result.type ==="GROUP") ? result.account_name : (result.last_name+' ,'+result.first_name);
					$scope.targetBillId                 = $scope.selectedTarget.bills[0].id;
					$scope.targetSelected               = true;
				}
		    });
		};

		/**
		 * Discard current selection and go to search list
		 * 
		 */
		$scope.changeSelection =  function(){
			$scope.selectedTarget = {};
			$scope.targetSelected = false;
		};


		/**
		 * function to move transaction codes to another
		 * reservation or account
		 * 
		 */
		$scope.moveCharges = function(){

			var params = {
				 "from_bill": $scope.moveChargeData.fromBillId, 
   				 "to_bill": $scope.targetBillId,
    			 "financial_transaction_ids":$scope.moveChargeData.selectedTransactionIds
			};
			var chargesMovedSuccess = function(){
				$scope.$emit("hideLoader");
				$scope.closeDialog();
				$scope.$emit('moveChargeSuccsess');
			};
			$scope.invokeApi(RVMoveChargeSrv.moveChargesToTargetEntity, params, chargesMovedSuccess);
		};
}]);