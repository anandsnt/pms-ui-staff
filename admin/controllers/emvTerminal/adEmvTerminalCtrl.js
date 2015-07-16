admin.controller('ADEmvTerminalCtrl', ['$scope','$rootScope', 'ADEmvTerminalsSrv', 'ngTableParams', '$filter','$timeout', function($scope, $rootScope, ADEmvTerminalsSrv, ngTableParams, $filter, $timeout){
   /*
	* Controller class for Room List
	*/
	$scope.errorMessage = '';
	$scope.data = {};
	//inheriting from base controller
	BaseCtrl.call(this, $scope);
   /*
    * Success call back of fetch
    * @param {object} items list
    */
	var fetchSuccessOfItemList = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;
		//applying sorting functionality in item list
		$scope.itemListTerminals = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.results.length ? $scope.data.results.length : 1,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		    	counts: [], // hide page counts control
		        total: 0, // hides the pagingation for now
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.results, params.orderBy()) :
		                                $scope.data.results;
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });

	};

	//To list items
	$scope.invokeApi(ADEmvTerminalsSrv.fetchItemList, {}, fetchSuccessOfItemList);


   /*
    * Function to delete item
    * @param {int} index of the item
    * @param {string} id of the selected item
    */
	$scope.deleteItem = function(index, id){

		var successCallBack = function(){

			$scope.$emit('hideLoader');
			angular.forEach($scope.data.results, function(value, key) {
				if(value.id === id) $scope.data.results.splice(key, 1);
			});
			$scope.itemListTerminals.reload();
		};
		$scope.invokeApi(ADEmvTerminalsSrv.deleteItem, {'item_id': id}, successCallBack);
	};

}]);