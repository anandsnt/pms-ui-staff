admin.controller('ADContentManagementGridviewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
   $scope.selectedView = "section";
   $scope.fromSection = "all";
   $scope.fromCategory = "all";
   $scope.showUnMappedList = false;
   $scope.sections = [];
   $scope.category_options = [];
   $scope.categories = [];
   $scope.items = [];
   $scope.searchText = "";

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
   				$scope.category_options.push($scope.data[i]);
   			}else if($scope.data[i].type == 'PAGE'){
   				$scope.items.push($scope.data[i]);
   			}
   		}
   }
   $scope.setSections =function(){
   		// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.sectionParams = new ngTableParams({
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
		    $scope.categoryParams = new ngTableParams({
		       page: 1,            // show first page
		       	count: $scope.categories.length,    // count per page - Need to change when on pagination implemntation
		        sorting: { name: 'asc'     // initial sorting 
		        }
		    }, {
		     
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.categories, params.orderBy()) :
		                                $scope.categories;
		                              
		            $scope.orderedCategories =  orderedData;
		                                 
		            $defer.resolve(orderedData);
		        }
		    });
   }
   $scope.setItems =function(){
   		// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.itemParams = new ngTableParams({
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

   $scope.filterBySectionAndCategory = function(){
   		$scope.filteredData = [];
   		if($scope.showUnMappedList){
   				$scope.fromSection = 'all';
   				$scope.fromCategory = 'all';
   				for(var i=0; i < $scope.data.length; i++){
			   			if($scope.data[i].parent_section.length == 0 && $scope.data[i].parent_category.length == 0){
			   				$scope.filteredData.push($scope.data[i]);
			   			}
		   			}
   		}else{
	   			if($scope.fromSection == 'all' && $scope.fromCategory == 'all'){
	   				$scope.filteredData = $scope.data;
	   			}else if($scope.fromSection != 'all' && $scope.fromCategory != 'all'){
		   			for(var i=0; i < $scope.data.length; i++){
			   			if($scope.data[i].parent_section.indexOf(parseInt($scope.fromSection)) != -1 && $scope.data[i].parent_category.indexOf(parseInt($scope.fromCategory)) != -1 ){
			   				$scope.filteredData.push($scope.data[i]);
			   			}
		   			}
	   			}else if($scope.fromSection != 'all'){
	   				for(var i=0; i < $scope.data.length; i++){
			   			if($scope.data[i].parent_section.indexOf(parseInt($scope.fromSection)) != -1){
			   				$scope.filteredData.push($scope.data[i]);
			   			}
		   			}
	   			}else{
	   				for(var i=0; i < $scope.data.length; i++){
			   			if($scope.data[i].parent_category.indexOf(parseInt($scope.fromCategory)) != -1){
			   				$scope.filteredData.push($scope.data[i]);
			   			}
		   			}
	   			}
   		}
   		
   		
   		$scope.applyFiltersToSectionsAndItems();
   		
   }

   $scope.applyFiltersToSectionsAndItems = function(){
   		$scope.categories = [];
   		$scope.items = [];
   		for(var i= 0; i < $scope.filteredData.length; i++){
   			if($scope.filteredData[i].type == 'CATEGORY'){
   				$scope.categories.push($scope.filteredData[i]);
   			}else if($scope.filteredData[i].type == 'PAGE'){
   				$scope.items.push($scope.filteredData[i]);
   			}
   		}
   		// $scope.setCategories();
   		// $scope.setItems();
   		$scope.itemParams.reload();
   		$scope.categoryParams.reload();
   }

   $scope.viewSelected = function(){
   		$scope.fromSection = 'all';
   		$scope.fromCategory = 'all';
   		$scope.showUnMappedList = false;
   		$scope.filterBySectionAndCategory();
   }

   $scope.fetchGridViewList();

   
	

}]);

