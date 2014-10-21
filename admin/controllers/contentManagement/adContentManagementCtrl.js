admin.controller('ADContentManagementCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.isGridView = true;
	 

	 /*
    * To add new section
    * 
    */		
	$scope.addNewSection = function(){
		
	};

	 /*
    * To add new Category
    * 
    */		
	$scope.addNewCategory = function(){
		
	};

	 /*
    * To add new Item
    * 
    */		
	$scope.addNewItem = function(){
		
	};

}]);