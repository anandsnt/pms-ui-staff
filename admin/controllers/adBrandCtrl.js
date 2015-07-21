admin.controller('ADBrandCtrl',['$scope', '$rootScope','adBrandsSrv', function($scope, $rootScope,adBrandsSrv){

	BaseCtrl.call(this, $scope);
	$scope.data = [];
	$scope.brandDetails   = {};
   /*
    * Variables set to show/hide forms
    */
	$scope.isAddmode = false;
	$scope.isEditmode = false;
   /*
    * Method to fetch all hotel brands
    */
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
   /*
    * Function to render edit screen with brands data
    * @param {index} index of the clicked brand
    * @param {id} id of the brand
    */
	$scope.editBrand = function(index,id)	{
		$scope.isAddmode = false;
		$scope.errorMessage ="";
		$scope.currentClickedElement = index;
		$scope.editId = id;
		var editID = { 'editID' : id };
		var editBrandsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.brandDetails   = data;
			$scope.formTitle = $scope.brandDetails.name;//To show brand name in title
			$scope.isEditmode = true;
		};
		$scope.invokeApi(adBrandsSrv.editRender,editID,editBrandsSuccessCallback);
	};
   /*
    * To get brand details form - used for both add and edit
    */
	$scope.getTemplateUrl = function(){
		return "/assets/partials/brands/adBrandForm.html";
	};
   /*
    * Function to render add new brand screen
    */
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
   /*
    * To handle cancel button click
    */
	$scope.cancelClicked = function (){
		if($scope.isAddmode) {
			$scope.isAddmode = false;
		}
		else if($scope.isEditmode) {
			$scope.isEditmode = false;
		}
	};
   /*
    * To handle save button click
    */
	$scope.saveClicked = function(){
		var successSave = function(){
			$scope.fetchHotelBrands();
 			$scope.isAddmode = false;
 			$scope.isEditmode = false;
		};
		//chains list not required on update/save data
		var	unwantedKeys = ["chains"];
		var data = dclone($scope.brandDetails, unwantedKeys);
		if($scope.isAddmode){
			$scope.invokeApi(adBrandsSrv.post,data, successSave);
		} else {
			$scope.invokeApi(adBrandsSrv.update,data, successSave);
		}
	};
}]);