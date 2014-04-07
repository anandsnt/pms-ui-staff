admin.controller('ADRatesListCtrl',['$scope', '$state', 'ADRatesSrv', 'ngTableParams','$filter',  function($scope, $state, ADRatesSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.roomTypeData = {};
	

   /*
    * To fetch list of room types
    */
	$scope.listRates = function(){
		console.log("upto list room type");
		var successCallbackFetch = function(data){
			console.log(data);
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
			console.log($scope.data);
			// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data, params.orderBy()) :
		                                $scope.data;
		                              
		            $scope.orderedData =  orderedData;
		            // console.log($scope.orderedData);
		                       
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });
		};
		$scope.invokeApi(ADRatesSrv.fetchRates, {} , successCallbackFetch);	
	};
	//To list room types
	$scope.listRates(); 
   
}]);

