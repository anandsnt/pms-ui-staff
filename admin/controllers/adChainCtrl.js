
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	
	// $scope.menuOpen = false;
	$scope.chainsList = [];


	adChainsSrv.fetch().then(function(data) {
		$scope.chainsList = data.chain_list;

	},function(){
		console.log("error controller");
	});	


			$scope.isAddmode = false;
			$scope.isEditmode = false;
    
 	// $scope.isMenuOpen = function(){
  //       return $scope.menuOpen ? true : false;
  //   };


    $scope.addNew = function(index, department)	{
			$scope.showAddChainForm = true;
			
	};


    $scope.currentClickedElement = -1;
	$scope.addFormView = false;
	$scope.editDepartments = function(index, department)	{
			$scope.currentClickedElement = index;
			
	};

	$scope.addNew = function(){
		$scope.formTitle = 'Add';	
		$scope.isAddmode = true;
		$scope.isEditmode = false;
	}

	$scope.getAddChainTemplateUrl = function(){

			
			
			return "/assets/partials/chains/adChainForm.html";

	}
	$scope.getEditChainTemplateUrl = function(index,name){

			
			
			return "/assets/partials/chains/adChainForm.html";

	}
	$scope.cancelClicked = function (){

	if($scope.isAddmode)
		$scope.isAddmode = false;
	else if($scope.isEditmode)
		$scope.isEditmode = false;

	}

	$scope.currentClickedElement = -1;

	$scope.editChain = function(index, id)	{
			$scope.currentClickedElement = index;
			$scope.formTitle = 'Edit StayNTouch Demo Chain';
			$scope.isAddmode = false;
			$scope.isEditmode = true;
	};

	$scope.saveClicked = function(){


		if($scope.isAddmode)
			alert("add mode")
		else
			alert("edit mode")
	}

	
// remaining

// 1.get chain list api
// 2.add chain api
// 3.edit mode api
// 4. update mode api 


}]);

    