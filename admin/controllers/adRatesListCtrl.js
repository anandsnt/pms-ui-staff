admin.controller('ADRatesListCtrl',['$scope', '$state', 'ADRatesSrv', 'ngTableParams','$filter',  function($scope, $state, ADRatesSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.roomTypeData = {};
	//For pagination
	$scope.currentPage = 1;
	$scope.rateTypeList = [];
	$scope.rateTypeSelected = "";
	$scope.displayCountList = ['1', '2', '3', '4', '5'];
	$scope.displyCount = 2;
	$scope.numOfPages = 1;
	$scope.searchTerm = "";


    /**
    * To fetch list of room types
    */
	$scope.fetchAndListRates = function(){
		postParams = {};
		postParams.page = $scope.currentPage;
		postParams.per_page = $scope.displyCount;
		//postParams.query = $scope.searchTerm;
		//postParams.rate_type_id = $scope.rateTypeSelected;

		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.totalCount = data.total_count;
			$scope.data = data.results;
			console.log(JSON.stringify($scope.data));
			$scope.currentClickedElement = -1;
			$scope.numOfPages = Math.ceil($scope.totalCount / $scope.displyCount);	
			console.log($scope.data.length);
			console.log($scope.displyCount);

			console.log($scope.numOfPages);
			console.log("hree");
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
		            console.log(orderedData);
		                              
		            $scope.orderedData =  orderedData;
		            // console.log($scope.orderedData);
		                       
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });
		   
		};

	$scope.invokeApi(ADRatesSrv.fetchRates, postParams , successCallbackFetch);
	};

	/**
    * To fetch all rate types
    */
	$scope.fetchRateTypes = function(){
		var fetchSuccess = function(data) {
			$scope.rateTypeList = data;
			$scope.$emit('hideLoader');
		};

		$scope.invokeApi(ADRatesSrv.fetchRateTypes, {}, fetchSuccess);
	};

	$scope.rateTypeChanged = function(){
		console.log($scope.rateTypeSelected.id);
		$scope.fetchAndListRates();
	};

	//To list room types
	$scope.fetchAndListRates(); 
	//Fetch all rate types to populate the dropdown
	$scope.fetchRateTypes();

	$scope.paginate = function(page){
		console.log(page);
		$scope.currentPage = page;
		$scope.fetchAndListRates();
		 $scope.tableParams.reload();
	};

	$scope.displayCountChanged = function(){
		console.log($scope.displyCount);
		$scope.numOfPages = Math.ceil($scope.totalCount / $scope.displyCount);
		$scope.fetchAndListRates();
	};
   
}]);

