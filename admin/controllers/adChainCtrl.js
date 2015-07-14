admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){

	BaseCtrl.call(this, $scope);
	$scope.chainsList = [];
	$scope.editData   = {};

	$scope.isAddmode = false;
	$scope.isEditmode = false;
   /*
    * To fetch hotel chains list
    */
	$scope.fetchHotelChains = function(){
		var fetchChainsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.chainsList = data.chain_list;
		};
		$scope.invokeApi(adChainsSrv.fetch, {},fetchChainsSuccessCallback);
	};
	$scope.fetchHotelChains();
	$scope.currentClickedElement = -1;
	$scope.addFormView = false;
  /*
   * To render edit screen
   * @param {int} index index of selected chain
   * @paran {string} id - chain id
   */
	$scope.editSelected = function(index,id)	{
		$scope.isAddmode = false;
		$scope.errorMessage ="";
		$scope.currentClickedElement = index;
		$scope.editId = id;
		var editID = { 'editID' : id };
		var editChainSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.editData   = data;
			$scope.formTitle = 'Edit'+' '+$scope.editData.name;
			if($scope.editData.lov.length === 0)
				$scope.editData.lov.push({'value':'','name':''});
			$scope.isEditmode = true;
			$scope.fileName = ($scope.editData.ca_certificate_exists)  ? 'Certificate Attached' :'Choose file ...';
			$scope.apns_file = (typeof $scope.editData.apns_certificate != 'undefined')  ? 'Certificate Attached' :'Choose file ...';
		};
		$scope.invokeApi(adChainsSrv.edit,editID,editChainSuccessCallback);
	};
  /*
   * To render add screen
   */
	$scope.addNew = function(){
		$scope.editData   = {};
		$scope.errorMessage ="";
		$scope.editData.lov  = [{'value':'','name':''}];
		$scope.formTitle = 'Add';
		$scope.isAddmode = true;
		$scope.isEditmode = false;
		$scope.fileName = 'Choose file ...';
		$scope.apns_file = 'Choose file ...';
	};
   /*
    * To fetch the template for chains details add/edit screens
    */
 	$scope.getTemplateUrl = function(){
 		return "/assets/partials/chains/adChainForm.html";
 	};
   /*
    * To save new chain
    */
 	$scope.addNewChain = function (){

 		var lovNames = [];
 		angular.forEach($scope.editData.lov, function(item, index) {
 			if (item.name === "") {
 				$scope.editData.lov.splice(index, 1);
 			}
 			else{
 				lovNames.push(item.name);
 			}
 		});
 		var oldLov = $scope.editData.lov;
 		$scope.editData.lov = lovNames;
 		var addChainSuccessCallback = function(data) {
 			$scope.$emit('hideLoader');
 			$scope.fetchHotelChains();
 			$scope.isAddmode = false;

 		};
 		var addChainFailureCallback = function(errorMessage){
 			$scope.$emit('hideLoader');
 			$scope.errorMessage = errorMessage;

 			if(oldLov.length > 0){
 				$scope.editData.lov = oldLov;
 			}
 			//if the length is zero, we are reverting to initial one
 			else{
 				$scope.editData.lov = [{'value':'','name':''}];
 			}
 		};
 		$scope.invokeApi(adChainsSrv.post, $scope.editData, addChainSuccessCallback, addChainFailureCallback);

 	};
   /*
    * To update chain details
    * @param {string} id - chain id
    */
 	$scope.updateChain = function(id){
 		angular.forEach($scope.editData.lov,function(item, index) {
 			if (item.name === "") {
 				$scope.editData.lov.splice(index, 1);
 			}
 			if (item.value === "") {
 				 delete item.value;
 			}
 		});

 		var updateData = {'id' : id ,'updateData' :$scope.editData };




 		var updateChainFailureCallback = function(errorMessage){
 			$scope.$emit('hideLoader');
 			$scope.errorMessage = errorMessage;
 			//scroll to top of the page where error message is shown
			if(angular.element( document.querySelector('.content')).find(".error_message").length) {
	  			angular.element( document.querySelector('.content')).scrollTop(0);
			};

			if($scope.editData.lov.length === 0)
				$scope.editData.lov = [{'value':'','name':''}];

 		}

 		var updateChainSuccessCallback = function(data) {
 			$scope.$emit('hideLoader');
 			$scope.fetchHotelChains();
 			$scope.isEditmode = false;
 		};
 		$scope.invokeApi(adChainsSrv.update, updateData, updateChainSuccessCallback, updateChainFailureCallback);
 	};
   /*
    * To handle cancel click event
    */
	$scope.cancelClicked = function (){
		if($scope.isAddmode)
			$scope.isAddmode = false;
		else if($scope.isEditmode)
			$scope.isEditmode = false;
	};
   /*
    * To handle save button click - Add/Update action
    */
	$scope.saveClicked = function(){
		if($scope.isAddmode){
			$scope.addNewChain();
		}
		else{
			$scope.updateChain($scope.editId);
		}
	};
   /*
    * To handle focus event on lov levels
    */
	$scope.onFocus = function(index){
		if((index === $scope.editData.lov.length-1) || ($scope.editData.lov.length===1)){
			$scope.newOptionAvailable = true;
			// exclude first two fields
			if($scope.editData.lov.length > 2){
				angular.forEach($scope.editData.lov,function(item, index) {
					if (item.name === "" && index < $scope.editData.lov.length-1 ) {
						$scope.newOptionAvailable = false;
					}
				});
			}
			if($scope.newOptionAvailable)
				$scope.editData.lov.push({'value':'','name':''});
		}
	};
   /*
    * To handle text change on lov levels
    */
	$scope.textChanged = function(index){

		if($scope.editData.lov.length>1){
			if($scope.editData.lov[index].name === "")
				$scope.editData.lov.splice(index, 1);
		}
	};
   /*
    * To handle blur event on lov levels
    */
	$scope.onBlur = function(index){
		if($scope.editData.lov.length>1){
			if($scope.editData.lov[index].name === "")
				$scope.editData.lov.splice(index, 1);
			angular.forEach($scope.editData.lov,function(item, i) {
				if (item.name === "" && i != $scope.editData.lov.length-1) {
					$scope.editData.lov.splice(i, 1);
				}
			});
		}
	};
}]);

