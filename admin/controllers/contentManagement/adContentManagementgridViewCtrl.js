admin.controller('ADContentmanagementGridviewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADFloorSetupSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.floorListData = {};
   
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

