
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	

	$scope.chainsList = [];
	$scope.editData   = {};

	$scope.isAddmode = false;
	$scope.isEditmode = false;

	// fetch chain list


	$scope.fetchHotelChains = function(){

		adChainsSrv.fetch().then(function(data) {
			$scope.chainsList = data.chain_list;

		},function(){
			console.log("error controller");
		});	
	}

	
	$scope.fetchHotelChains();


	$scope.currentClickedElement = -1;
	$scope.addFormView = false;

	// inline edit

	$scope.editSelected = function(index,id)	{


		$scope.formTitle = 'Edit StayNTouch Demo Chain ';	
		$scope.isAddmode = false;


		$scope.currentClickedElement = index;
		$scope.editId = id;


		adChainsSrv.edit(id).then(function(data) {
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
 	$scope.addNewChain = function (){


 		adChainsSrv.post($scope.editData).then(function(data) {
		
			console.log(data)
			$scope.fetchHotelChains();
			$scope.isAddmode = false;

		},function(){
			console.log("error controller");
			$scope.isAddmode = false;
		});	

 	}


 	$scope.updateChain = function(id){


 		adChainsSrv.update(id,$scope.editData).then(function(data) {
		
			console.log(data)
			$scope.fetchHotelChains();
			$scope.isEditmode = false;

		},function(){
			console.log("error controller");
			$scope.isEditmode = false;
		});	


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
			$scope.addNewChain();
		else
			$scope.updateChain($scope.editId);
	}


	$scope.addNewoption = function(index){

	if( $scope.editData.lov.length>2){
		if(index != $scope.editData.lov.length-1){


			$scope.editData.lov.pop({'value':'','name':''});
		}
	}


	if($scope.editData.lov[$scope.editData.lov.length-1].name.length >0 || $scope.editData.lov.length==1)
			$scope.editData.lov.push({'value':'','name':''});

	}
	
// remaining


// implement base webservice


}]);

