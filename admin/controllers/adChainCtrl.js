
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	

	BaseCtrl.call(this, $scope);

	$scope.chainsList = [];
	$scope.editData   = {};

	$scope.isAddmode = false;
	$scope.isEditmode = false;

	// fetch chain list


	$scope.fetchHotelChains = function(){




		var fetchChainsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.chainsList = data.chain_list;
		};
		var fetchChainsFailCallback = function(){
			$scope.$emit('hideLoader');
			console.log("error controller");
		};

		$scope.invokeApi(adChainsSrv.fetch, {},fetchChainsSuccessCallback, fetchChainsFailCallback);

	}

	
	$scope.fetchHotelChains();


	$scope.currentClickedElement = -1;
	$scope.addFormView = false;

	// inline edit

	$scope.editSelected = function(index,id)	{


		
		$scope.isAddmode = false;


		$scope.currentClickedElement = index;
		$scope.editId = id;


		var editID = { 'editID' : id }


		var editChainSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.editData   = data;
			$scope.formTitle = 'Edit'+' '+$scope.editData.name;

			if($scope.editData.lov.length === 0)
				$scope.editData.lov.push({'value':'','name':''});
			$scope.isEditmode = true;
			console.log(data)
		};
		var editChainsFailCallback = function(){
			$scope.$emit('hideLoader');
			console.log("error controller");
		};

		$scope.invokeApi(adChainsSrv.edit,editID,editChainSuccessCallback,editChainsFailCallback);



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

 	// add new chain

 	$scope.addNewChain = function (){

 		var lovNames = [];
 		angular.forEach($scope.editData.lov,function(item, index) {
 			if (item.name == "") {
 				$scope.editData.lov.splice(index, 1);
 			}
 			else{
 				lovNames.push(item.name)
 			}
 		});
 		$scope.editData.lov = lovNames;
 		console.log(lovNames)

 		var addChainSuccessCallback = function(data) {
 			$scope.$emit('hideLoader');
 			console.log(data)
 			$scope.fetchHotelChains();
 			$scope.isAddmode = false;

 		};
 		var addChainFailCallback = function(){
 			$scope.$emit('hideLoader');
 			$scope.isAddmode = false;
 			console.log("error controller");
 		};

 		$scope.invokeApi(adChainsSrv.post,$scope.editData, addChainSuccessCallback,addChainFailCallback);


 	}

 	// update existing chain

 	$scope.updateChain = function(id){


 		angular.forEach($scope.editData.lov,function(item, index) {
 			if (item.name == "") {
 				$scope.editData.lov.splice(index, 1);
 			}
 		});

 		var updateData = {'id' : id ,'updateData' :$scope.editData }


 		var updateChainSuccessCallback = function(data) {
 			$scope.$emit('hideLoader');
 			$scope.fetchHotelChains();
 			$scope.isEditmode = false;
 		};
 		var updateChainFailCallback = function(){
 			$scope.$emit('hideLoader');
 			$scope.isEditmode = false;
 			console.log("error controller");
 		};


 		$scope.invokeApi(adChainsSrv.update,updateData,updateChainSuccessCallback,updateChainFailCallback);

 		


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





		if((index === $scope.editData.lov.length-1) || ($scope.editData.lov.length==1)){

			$scope.newOptionAvailable = true;


			if($scope.editData.lov.length > 2){

				angular.forEach($scope.editData.lov,function(item, index) {
					if (item.name == "" && index < $scope.editData.lov.length-1 ) {
		
		  	 $scope.editData.lov.splice(index, 1);
		  	$scope.newOptionAvailable = false;

		  }
		});

			}

			if($scope.newOptionAvailable)
				$scope.editData.lov.push({'value':'','name':''});


		}
		else{

			angular.forEach($scope.editData.lov,function(item, index) {
				if (item.name == "") {
					$scope.editData.lov.splice(index, 1);
				}
			});

		}
	}
// remaining


// levels  ???



}]);

