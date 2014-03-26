
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	
	// $scope.menuOpen = false;
	$scope.chainsList = [];

	$scope.isAddmode = false;
	$scope.isEditmode = false;


	adChainsSrv.fetch().then(function(data) {
		$scope.chainsList = data.chain_list;

	},function(){
		console.log("error controller");
	});	


    $scope.currentClickedElement = -1;
	$scope.addFormView = false;

	$scope.editSelected = function(id)	{

			$scope.formTitle = 'Edit StayNTouch Demo Chain ';	
			$scope.isAddmode = false;
			$scope.isEditmode = true;
	
			$scope.currentClickedElement = id;

					
			adChainsSrv.edit(id+1).then(function(data) {
				console.log(data)

			},function(){
				console.log("error controller");
			});	
			
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


// 1.add chain api
// 2.edit mode api
// 3. update mode api 


}]);

    