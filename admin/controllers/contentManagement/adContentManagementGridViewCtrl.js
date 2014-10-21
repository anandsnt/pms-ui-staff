admin.controller('ADContentManagementGridviewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
   $scope.selectedView = "section";
   $scope.fromSection = "all";
   $scope.fromCategory = "all";
   $scope.sections = [];
   $scope.categories = [];
   $scope.items = [];

   $scope.fetchGridViewList= function(){
   		var successCallbackGridFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.setUpLists();
			$scope.setSections();
			$scope.setCategories();
			$scope.setItems();			
		};
	   $scope.invokeApi(ADContentManagementSrv.fetchGridViewList, {} , successCallbackGridFetch);
   }

   $scope.setUpLists =function(){
   		for(var i= 0; i < $scope.data.length; i++){
   			if($scope.data[i].type == 'SECTION'){
   				$scope.sections.push($scope.data[i]);
   			}else if($scope.data[i].type == 'CATEGORY'){
   				$scope.categories.push($scope.data[i]);
   			}else if($scope.data[i].type == 'ITEM'){
   				$scope.items.push($scope.data[i]);
   			}
   		}
   }
   $scope.setSections =function(){
   		// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		       page: 1,            // show first page
		       	count: $scope.sections.length,    // count per page - Need to change when on pagination implemntation
		        sorting: { name: 'asc'     // initial sorting 
		        }
		    }, {
		     
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.sections, params.orderBy()) :
		                                $scope.sections;
		                              
		            $scope.orderedSections =  orderedData;
		                                 
		            $defer.resolve(orderedData);
		        }
		    });
   }
   $scope.setCategories =function(){
   		// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		       page: 1,            // show first page
		       	count: $scope.categories.length,    // count per page - Need to change when on pagination implemntation
		        sorting: { name: 'asc'     // initial sorting 
		        }
		    }, {
		     
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.sections, params.orderBy()) :
		                                $scope.sections;
		                              
		            $scope.orderedCategories =  orderedData;
		                                 
		            $defer.resolve(orderedData);
		        }
		    });
   }
   $scope.setItems =function(){
   		// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		       page: 1,            // show first page
		       	count: $scope.items.length,    // count per page - Need to change when on pagination implemntation
		        sorting: { name: 'asc'     // initial sorting 
		        }
		    }, {
		     
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.items, params.orderBy()) :
		                                $scope.items;
		                              
		            $scope.orderedItems =  orderedData;
		                                 
		            $defer.resolve(orderedData);
		        }
		    });
   }

   $scope.fetchGridViewList();

   
	

}]);

