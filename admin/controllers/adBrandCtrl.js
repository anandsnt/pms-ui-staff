admin.controller('ADBrandListCtrl',['$scope', '$state',   function($scope, $state){
	BaseCtrl.call(this, $scope);

	$scope.brandsList = [];
	$scope.editData   = {};

	$scope.isAddmode = false;
	$scope.isEditmode = false;

	$scope.fetchHotelBrands = function(){
		var fetchBrandsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.brandsList = data.brand_list;
		};
		var fetchBrandsFailCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage[0];
		};
		$scope.invokeApi(adBrandsSrv.fetch, {},fetchBrandsSuccessCallback, fetchBrandsFailCallback);
	}

	$scope.fetchHotelBrands();
	$scope.currentClickedElement = -1;
	$scope.addFormView = false;

	$scope.editSelected = function(index,id)	{
		$scope.isAddmode = false;
		$scope.errorMessage ="";
		$scope.currentClickedElement = index;
		$scope.editId = id;

		var editID = { 'editID' : id }


		var editBrandsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.editData   = data;
			$scope.formTitle = 'Edit'+' '+$scope.editData.name;

			if($scope.editData.lov.length === 0)
				$scope.editData.lov.push({'value':'','name':''});
			$scope.isEditmode = true;
			console.log(data)
		};
		var editBrandsFailCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			console.log("error controller");
			$scope.errorMessage = errorMessage[0];
		};

		$scope.invokeApi(adBrandsSrv.edit,editID,editBrandsSuccessCallback,editBrandsFailCallback);
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
 		return "/assets/partials/brands/adBrandForm.html";
 	}

 	// add new brand

 	$scope.addNewBrand = function (){

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

 		var addBrandSuccessCallback = function(data) {
 			$scope.$emit('hideLoader');
 			console.log(data)
 			$scope.fetchHotelBrands();
 			$scope.isAddmode = false;

 		};
 		var addBrandFailCallback = function(errorMessage){
 			$scope.$emit('hideLoader');
 			console.log("error controller");
 			$scope.errorMessage = errorMessage[0];
 		};

 		$scope.invokeApi(adBrandsSrv.post,$scope.editData, addBrandSuccessCallback,addBrandFailCallback);
 	}

 	// update existing Brand

 	$scope.updateBrand = function(id){

 		angular.forEach($scope.editData.lov,function(item, index) {
 			if (item.name == "") {
 				$scope.editData.lov.splice(index, 1);
 			}
 			if (item.value == "") {
 				 delete item.value;
 			}
 		});

 		var updateData = {'id' : id ,'updateData' :$scope.editData }

 		var updateBrandSuccessCallback = function(data) {
 			$scope.$emit('hideLoader');
 			$scope.fetchHotelBrands();
 			$scope.isEditmode = false;
 		};
 		var updateBrandFailCallback = function(errorMessage){
 			$scope.$emit('hideLoader');
 			console.log("error controller");
 			$scope.errorMessage = errorMessage[0];
 		};

 		$scope.invokeApi(adBrandsSrv.update,updateData,updateBrandSuccessCallback,updateBrandFailCallback);
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
			$scope.addNewBrand();
		else
			$scope.updateBrand($scope.editId);
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
}