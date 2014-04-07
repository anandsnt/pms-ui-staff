admin.controller('ADItemListCtrl', ['$scope','ADItemSrv', 'ngTableParams', '$filter', function($scope, ADItemSrv, ngTableParams, $filter){
	/*
	* Controller class for Room List
	*/

	$scope.errorMessage = '';

	
	//inheriting from base controller
	BaseCtrl.call(this, $scope);
	


	var fetchSuccessOfItemList = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;
		//applying sorting functionality in item list
		$scope.itemList = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.items.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.items.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.items, params.orderBy()) :
		                                $scope.data.items;
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });		
		
	};
	
	var fetchFailedOfItemList = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};
	
	$scope.invokeApi(ADItemSrv.fetchItemList, {}, fetchSuccessOfItemList, fetchFailedOfItemList);	

	/*
	* function for toggle the favourite status
	* @param {intger} item's id
	* @param {boolean} checked status
	* will call the web service for toggling status
	*/
	$scope.toggleFavourite = function(itemId, isFavourite){
		$scope.invokeApi(ADItemSrv.toggleFavourite, {'item_id': itemId, 'toggle_status': isFavourite});
	};

	$scope.deleteItem = function(index, id){	
		
		var successCallBack = function(){
			console.log(index);
			console.log(JSON.stringify($scope.data.items[index]));
			$scope.$emit('hideLoader');
			$scope.data.items.splice(index, 1);	
			console.log(JSON.stringify($scope.data.items[index]));	
			$scope.itemList = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.items.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.items.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.items, params.orderBy()) :
		                                $scope.data.items;
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });						
		}
		$scope.invokeApi(ADItemSrv.deleteItem, {'item_id': id}, successCallBack);		
	}

}]);