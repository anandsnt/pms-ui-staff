
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	
	// $scope.menuOpen = false;
	$scope.chainsList = [];


	adChainsSrv.fetch().then(function(data) {
		$scope.chainsList = data;

	},function(){
		console.log("error controller");
	});	


	
    
 	// $scope.isMenuOpen = function(){
  //       return $scope.menuOpen ? true : false;
  //   };


    $scope.addNew = function(index, department)	{
			$scope.showAddChainForm = true;
			$scope.formTitle = 'Add';
	};


    $scope.currentClickedElement = -1;
	$scope.addFormView = false;
	$scope.editDepartments = function(index, department)	{
			$scope.currentClickedElement = index;
			$scope.formTitle ='Edit StayNTouch Demo Chain';
	};


		//Function to get the template for edit url
	$scope.getTemplateUrl = function(index){
		if(index!="undefined"){
			if($scope.currentClickedElement == index){
			 	// $scope.value = department.value;
			 	// $scope.departmentName = department.name;
			 	return "/assets/partials/chains/adChainForm.html";
			 } 
		}
		if(index == ""	){
		
			 	return "/assets/partials/chains/adChainForm.html";
		}
		 
	};

}]);

    