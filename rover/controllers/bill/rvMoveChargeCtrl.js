sntRover.controller('RVMoveChargeCtrl', ['$scope',
	function($scope) {
		console.log($scope.moveChargeData);

		var initiate = function(){
			$scope.numberQuery = "";
			$scope.textQuery = "";
			$scope.searchResults = [];
			$scope.targetSelected = false;
		};
		initiate();


		var fetchFilterdData = function(){

			var fetchSucces = function(){
				$scope.searchResults =  [
       
    ];
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
	}
]);