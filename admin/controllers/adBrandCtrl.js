admin.controller('ADBrandListCtrl',['$scope', '$rootScope','adBrandsSrv', function($scope, $rootScope,adBrandsSrv){

	BaseCtrl.call(this, $scope);

	$scope.data = [];
	$scope.brandDetails   = {};

	$scope.isAddmode = false;
	$scope.isEditmode = false;

	$scope.fetchHotelBrands = function(){
		var fetchBrandsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data.brands;
		};
		$scope.invokeApi(adBrandsSrv.fetch, {},fetchBrandsSuccessCallback);
	};

	$scope.fetchHotelBrands();
	$scope.currentClickedElement = -1;
	$scope.addFormView = false;

	$scope.editBrand = function(index,id)	{
		$scope.isAddmode = false;
		$scope.errorMessage ="";
		$scope.currentClickedElement = index;
		$scope.editId = id;

		var editID = { 'editID' : id };


		var editBrandsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.brandDetails   = data;
			$scope.formTitle = $scope.brandDetails.name;
			$scope.isEditmode = true;
		};		

		$scope.invokeApi(adBrandsSrv.editRender,editID,editBrandsSuccessCallback);
	};







	$scope.getTemplateUrl = function(){
		return "/assets/partials/brands/adBrandForm.html";
	};





	//add button clicked

	$scope.addNew = function(){
		$scope.brandDetails   = {};
		$scope.errorMessage ="";
		$scope.formTitle = "";
		$scope.isAddmode = true;
		$scope.isEditmode = false;
		var addBrandsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.brandDetails   = data;
		};	
		$scope.invokeApi(adBrandsSrv.addRender,{},addBrandsSuccessCallback);
	};



	$scope.cancelClicked = function (){
		if($scope.isAddmode)
			$scope.isAddmode = false;
		else if($scope.isEditmode)
			$scope.isEditmode = false;
	};


	$scope.saveClicked = function(){
		
		var successSave = function(){
			$scope.fetchHotelBrands();
 			$scope.isAddmode = false;
 			$scope.isEditmode = false;
		};
		var	unwantedKeys = ["chains"];
		
		var data = dclone($scope.brandDetails, unwantedKeys);
		if($scope.isAddmode){
			$scope.invokeApi(adBrandsSrv.post,data, successSave);
		} else {
			$scope.invokeApi(adBrandsSrv.update,data, successSave);
		}
			
	};






}]);