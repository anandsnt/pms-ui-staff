admin.controller('ADContentManagementGridviewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 'ngDialog',
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location,ngDialog){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);

   $scope.selectedView = "homescreen";
   $scope.fromSection = "all";
   $scope.fromCategory = "all";
   $scope.showUnMappedList = false;
   $scope.sections = [];
   $scope.home_screens = [];
   $scope.category_options = [];
   $scope.categories = [];
   $scope.items = [];
   $scope.searchText = "";
   /* Function to fetch the components to be listed in the gridview
    */
   $scope.fetchGridViewList= function(){
   		var successCallbackGridFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.setUpLists();
			$scope.setHomeScreens();
			$scope.setSections();
			$scope.setCategories();
			$scope.setItems();
		};
	   $scope.invokeApi(ADContentManagementSrv.fetchGridViewList, {} , successCallbackGridFetch);
   };
   /* Function to split the fetch components to sections, categories and items
    */
   $scope.setUpLists =function(){
   		for(var i= 0; i < $scope.data.length; i++){
   			$scope.data[i].last_updated = new Date($scope.data[i].last_updated);
   			if($scope.data[i].component_type === 'SECTION'){
   				$scope.sections.push($scope.data[i]);
   			}else if($scope.data[i].component_type === 'HOME SCREEN'){
   				$scope.home_screens.push($scope.data[i]);
   			}else if($scope.data[i].component_type === 'CATEGORY'){
   				$scope.categories.push($scope.data[i]);
   				$scope.category_options.push($scope.data[i]);
   			}else if($scope.data[i].component_type === 'PAGE'){
   				$scope.items.push($scope.data[i]);
   			}
   		}
   };

    /* Function to set the table params for sections
    */
   $scope.setHomeScreens =function(){
   		// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.homeScreenParams = new ngTableParams({
		       page: 1,            // show first page
		       	count: $scope.home_screens.length,    // count per page - Need to change when on pagination implemntation
		        sorting: { name: 'asc'     // initial sorting
		        }
		    }, {

		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.home_screens, params.orderBy()) :
		                                $scope.home_screens;

		            $scope.orderedHomeScreens =  orderedData;

		            $defer.resolve(orderedData);
		        }
		    });
   };



   /* Function to set the table params for sections
    */
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
   };
   /* Function to set the table params for categories
    */
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
   };
   /* Function to set the table params for items
    */
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
   };
   /* Function to filter the data set by section and category and unmapped items
    */
   $scope.filterBySectionAndCategory = function(){
   		$scope.filteredData = [];
   		if($scope.showUnMappedList){
   				$scope.fromSection = 'all';
   				$scope.fromCategory = 'all';
   				for(var i=0; i < $scope.data.length; i++){
			   			if($scope.data[i].parent_section.length === 0 && $scope.data[i].parent_category.length === 0){
			   				$scope.filteredData.push($scope.data[i]);
			   			}
		   			}
   		}else{
	   			if($scope.fromSection === 'all' && $scope.fromCategory === 'all'){
	   				$scope.filteredData = $scope.data;
	   			}else if($scope.fromSection !== 'all' && $scope.fromCategory !== 'all'){
		   			for(var i=0; i < $scope.data.length; i++){
			   			if($scope.data[i].parent_section.indexOf(parseInt($scope.fromSection)) !== -1 && $scope.data[i].parent_category.indexOf(parseInt($scope.fromCategory)) !== -1 ){
			   				$scope.filteredData.push($scope.data[i]);
			   			}
		   			}
	   			}else if($scope.fromSection !== 'all'){
	   				for(var i=0; i < $scope.data.length; i++){
			   			if($scope.data[i].parent_section.indexOf(parseInt($scope.fromSection)) !== -1){
			   				$scope.filteredData.push($scope.data[i]);
			   			}
		   			}
	   			}else{
	   				for(var i=0; i < $scope.data.length; i++){
			   			if($scope.data[i].parent_category.indexOf(parseInt($scope.fromCategory)) !== -1){
			   				$scope.filteredData.push($scope.data[i]);
			   			}
		   			}
	   			}
   		}


   		$scope.applyFiltersToSectionsAndItems();

   };
   /* Function to apply the filterd data to the current list of categories and items
    */
   $scope.applyFiltersToSectionsAndItems = function(){
   		$scope.categories = [];
   		$scope.items = [];
   		for(var i= 0; i < $scope.filteredData.length; i++){
   			if($scope.filteredData[i].component_type === 'CATEGORY'){
   				$scope.categories.push($scope.filteredData[i]);
   			}else if($scope.filteredData[i].component_type === 'PAGE'){
   				$scope.items.push($scope.filteredData[i]);
   			}
   		}


   		$scope.itemParams.reload();
   		$scope.categoryParams.reload();
   };
   /* Function to set the filter params, when the view selection changes
    */
   $scope.viewSelected = function(){
   		$scope.fromSection = 'all';
   		$scope.fromCategory = 'all';
   		$scope.showUnMappedList = false;
   		$scope.filterBySectionAndCategory();
   };

   $scope.fetchGridViewList();
   /* Listener for the component deletion.
    * Need to delete from all the lists that has dependancy to the filtered data
    */
	$scope.$on('componentDeleted', function(event, data) {
	//delete item from correspondong list


		angular.forEach($scope.sections, function(section, index) {
			if (section.id === data.id) {
				$scope.sections.splice(index,1);
			}
		});
		$scope.sectionParams.reload();



		angular.forEach($scope.categories, function(category, index) {
			if (category.id === data.id) {
				$scope.categories.splice(index,1);
			}
		});
		$scope.categoryParams.reload();


		angular.forEach($scope.items, function(item, index) {
			if (item.id === data.id) {
				$scope.items.splice(index,1);
			}
		});
		$scope.itemParams.reload();

		angular.forEach($scope.data, function(component, index) {
			if (component.id === data.id) {
				$scope.data.splice(index,1);
			}
		});

		angular.forEach($scope.category_options, function(component, index) {
			if (component.id === data.id) {
				$scope.category_options.splice(index,1);
			}
		});
	});

	/* Listener for the component status update.
    * Need to delete from all the lists that has dependancy to the filtered data
    */
	$scope.$on('statusUpdated', function(event, data) {
	//delete item from correspondong list


		angular.forEach($scope.sections, function(section, index) {
			if (section.id === data.id) {
				section.status = data.status;
			}
		});




		angular.forEach($scope.categories, function(category, index) {
			if (category.id === data.id) {
				category.status = data.status;
			}
		});



		angular.forEach($scope.items, function(item, index) {
			if (item.id === data.id) {
				item.status = data.status;
			}
		});


		angular.forEach($scope.data, function(component, index) {
			if (component.id === data.id) {
				component.status = data.status;
			}
		});

		angular.forEach($scope.category_options, function(component, index) {
			if (component.id === data.id) {
				component.status = data.status;
			}
		});
		$scope.sectionParams.reload();
		$scope.categoryParams.reload();
		$scope.itemParams.reload();

	//refresh tree

	});

	/* delete component ends here*/

}]);

