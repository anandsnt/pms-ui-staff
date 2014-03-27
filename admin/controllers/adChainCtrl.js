
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	

	$scope.chainsList = [];
	$scope.editData   = {};

	$scope.isAddmode = false;
	$scope.isEditmode = false;

	// fetch chain list

	adChainsSrv.fetch().then(function(data) {
		$scope.chainsList = data.chain_list;

	},function(){
		console.log("error controller");
	});	


	$scope.currentClickedElement = -1;
	$scope.addFormView = false;

	// inline edit

	$scope.editSelected = function(id)	{

		$scope.formTitle = 'Edit StayNTouch Demo Chain ';	
		$scope.isAddmode = false;
		
		
		$scope.currentClickedElement = id;

		
		adChainsSrv.edit(id+1).then(function(data) {
			$scope.editData   = data;

			if($scope.editData.lov.length === 0)
				$scope.editData.lov.push({'value':'','name':''});
			$scope.isEditmode = true;
			console.log(data)
			
		},function(){
			console.log("error controller");
		});	
		
	};

	//add button clicked

	$scope.addNew = function(){


		$scope.editData   = {};


		$scope.editData.lov  = [{'value':'','name':''}];

		$scope.formTitle = 'Add';	
		$scope.isAddmode = true;
		$scope.isEditmode = false;
	}

 	// template for add/edit

 	$scope.getTemplateUrl = function(){

 		
 		
 		return "/assets/partials/chains/adChainForm.html";

 	}

 	


	// form actions

	$scope.cancelClicked = function (){

		if($scope.isAddmode)
			$scope.isAddmode = false;
		else if($scope.isEditmode)
			$scope.isEditmode = false;

	}


	$scope.saveClicked = function(){


		if($scope.isAddmode)
			alert("add mode")
		else
			alert("edit mode")
	}


	$scope.addNewoption = function(){

		if($scope.editData.lov.length <= 5)
			$scope.editData.lov.push({'value':'','name':''});

	}
	
// remaining


// 1.add chain api
// 2.edit mode api
// 3. update mode api 


}]);

