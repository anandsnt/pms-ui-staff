sntRover.controller('RVMoveChargeCtrl', ['$scope','$timeout',
	function($scope,$timeout) {
		console.log($scope.moveChargeData);

		var initiate = function(){
			$scope.numberQuery = "";
			$scope.textQuery = "";
			$scope.searchResults = [];
			$scope.targetSelected = false;
			$scope.selectedTarget = {};
			$scope.targetBillId = "";
			$scope.setScroller('search_results',{'click':true, 'tap':true});
		};
		initiate();


		var refreshSearchList = function() { 			
			$timeout(function() {
				$scope.refreshScroller('search_results');
			}, 2000);
		};


		var fetchFilterdData = function(){

			var fetchSucces = function(){
				$scope.searchResults =  [
        {
            "conf_num": 343645,
            "room": "334",
            "type": "RESERVATION",
            "first_name": "Resheil",
            "last_name": "mohammed",
            "number_of_bills": 1,
            "bills":[{bill_number: 1, id: 1235},{bill_number: 2, id: 1235},{bill_number: 3, id: 1235}]
        },
        {
            "account_id": 4324,
            "type": "ACCOUNT",
            "account_num": "1235435346346",
            "account_name": "testaccount",
            "bills":[{bill_number: 1, id: 1235}]
        },
        {
            "account_id": 46523784,
            "type": "GROUP",
            "account_num": "12354423",
            "account_name": "testaccount",
            "bills":[{bill_number: 1, id: 1235}]
        },
        {
            "conf_num": 333645,
            "room": "123",
            "type": "RESERVATION",
            "first_name": "Steve",
            "last_name": "G",
            "number_of_bills": 2,
            "bills":[{bill_number: 1, id: 1235}]
        },
        {
            "conf_num": 5845,
            "room": "123",
            "type": "RESERVATION",
            "first_name": "Steve",
            "last_name": "G",
            "number_of_bills": 2,
            "bills":[{bill_number: 1, id: 1235}]
        },
        {
            "conf_num": 545,
            "room": "123",
            "type": "RESERVATION",
            "first_name": "grdgre",
            "last_name": "G",
            "number_of_bills": 2,
            "bills":[{bill_number: 1, id: 1235}]
        }
    ];



    			_.each($scope.searchResults, function(result,index) {
    				result.entity_id = index;
    			});
    			refreshSearchList();
			}
			fetchSucces();
		};

		/**
		 * function to perform filtering/request data from service in change event of query box
		 */
		$scope.queryEntered = function() {
			if (($scope.textQuery === "" || $scope.textQuery.length < 3) && ($scope.numberQuery === "" || $scope.numberQuery.length < 3 )) {
				$scope.searchResults = [];
			} else {
				fetchFilterdData();
			}
		};

		$scope.targetClicked =  function(selectedId){
			_.each($scope.searchResults, function(result) {
				if(result.entity_id === selectedId){
					$scope.selectedTarget = result;
					$scope.selectedTarget.displayNumber = (result.type ==="ACCOUNT" ||result.type ==="GROUP") ? result.account_num : result.conf_num;
					$scope.selectedTarget.displaytext = (result.type ==="ACCOUNT" ||result.type ==="GROUP") ? result.account_name : (result.last_name+' ,'+result.first_name);
					// _.each($scope.selectedTarget.bills, function(bill) {
					// 	if(bill.bill_number ===1){
					// 		console.log(bill.bill_number+bill.id);
							$scope.targetBillId =$scope.selectedTarget.bills[0].id;
						// }
					// });
					$scope.targetSelected = true;
				}
		    });
		};


		$scope.changeSelection =  function(){
			$scope.selectedTarget = {};
			$scope.targetSelected = false;
		};
	}
]);