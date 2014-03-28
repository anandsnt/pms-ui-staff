
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
		var fetchChainsFailCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			console.log("error controller");

			angular.forEach(errorMessage,function(error,index) {

				if(index ==0)
					$scope.errorMessage = error;
				else
					$scope.errorMessage += ','+ error;
			});
			
		};

		$scope.invokeApi(adChainsSrv.fetch, {},fetchChainsSuccessCallback, fetchChainsFailCallback);

	}

	
	$scope.fetchHotelChains();


	$scope.currentClickedElement = -1;
	$scope.addFormView = false;

	// inline edit

	$scope.editSelected = function(index,id)	{


		
		$scope.isAddmode = false;
		$scope.errorMessage ="";


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
		var editChainsFailCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			console.log("error controller");
					
			angular.forEach(errorMessage,function(error,index) {

				if(index ==0)
					$scope.errorMessage = error;
				else
					$scope.errorMessage += ','+ error;
			});
		};

		$scope.invokeApi(adChainsSrv.edit,editID,editChainSuccessCallback,editChainsFailCallback);



	};

	//add button clicked

	$scope.addNew = function(){


		$scope.editData   = {};
		$scope.errorMessage ="";


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
 		var addChainFailCallback = function(errorMessage){
 			$scope.$emit('hideLoader');
 			console.log("error controller");
 					
			angular.forEach(errorMessage,function(error,index) {

				if(index ==0)
					$scope.errorMessage = error;
				else
					$scope.errorMessage += ','+ error;
			});
 		};

 		$scope.invokeApi(adChainsSrv.post,$scope.editData, addChainSuccessCallback,addChainFailCallback);


 	}

 	// update existing chain

 	$scope.updateChain = function(id){


 		angular.forEach($scope.editData.lov,function(item, index) {
 			if (item.name == "") {
 				$scope.editData.lov.splice(index, 1);
 			}
 			if (item.value == "") {
 				 delete item.value;
 			}
 		});

 		var updateData = {'id' : id ,'updateData' :$scope.editData }


 		var updateChainSuccessCallback = function(data) {
 			$scope.$emit('hideLoader');
 			$scope.fetchHotelChains();
 			$scope.isEditmode = false;
 		};
 		var updateChainFailCallback = function(errorMessage){
 			$scope.$emit('hideLoader');
 			console.log("error controller");

 					
			angular.forEach(errorMessage,function(error,index) {

				if(index ==0)
					$scope.errorMessage = error;
				else
					$scope.errorMessage += ','+ error;
			});
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




// on focus event create new option if focussed field is last

	$scope.onFocus = function(index){



		if((index === $scope.editData.lov.length-1) || ($scope.editData.lov.length==1)){

			$scope.newOptionAvailable = true;

			// exclude first two fields

			if($scope.editData.lov.length > 2){

				angular.forEach($scope.editData.lov,function(item, index) {
					if (item.name == "" && index < $scope.editData.lov.length-1 ) {
						$scope.newOptionAvailable = false;

					}
				});

			}

			if($scope.newOptionAvailable)
				$scope.editData.lov.push({'value':'','name':''});


		}
		
	}
// if content is deleted fully remove the input field

	$scope.textChanged = function(index){

		if($scope.editData.lov.length>1){
			if($scope.editData.lov[index].name == "")
				$scope.editData.lov.splice(index, 1);
		}
	}

// on blur check for blank fields and delete

	$scope.onBlur = function(index){



		if($scope.editData.lov.length>1){


			if($scope.editData.lov[index].name == "")
				$scope.editData.lov.splice(index, 1);

			angular.forEach($scope.editData.lov,function(item, i) {
				if (item.name == "" && i != $scope.editData.lov.length-1) {
					$scope.editData.lov.splice(i, 1);
				}
			});



		}
	}




}]);

