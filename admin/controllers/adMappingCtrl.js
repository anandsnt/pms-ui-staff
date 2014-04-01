admin.controller('ADMappingCtrl', ['$scope', '$state', '$stateParams', 'ADMappingSrv', function($scope, $state, $stateParams, ADMappingSrv) {
	
	BaseCtrl.call(this, $scope);
	$scope.id = $stateParams.id
	$scope.isEdit = false;
	$scope.isAdd = false;
	$scope.editData   = {};
	$scope.currentClickedElement = -1;
	$scope.addFormView = false;
	
	
	var fetchSuccess = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	
	$scope.invokeApi(ADMappingSrv.fetch, {'id':$scope.id}, fetchSuccess);
	
	$scope.editSelected = function(index,id)	{
		
		$scope.errorMessage ="";
		$scope.currentClickedElement = index;
		$scope.editId = id;

		var data = { 'editId' : id }

		var editMappingSuccessCallback = function(data) {
			
			console.log(data);
			$scope.$emit('hideLoader');
			$scope.editData = data;
			$scope.formTitle = 'Edit'+' '+$scope.editData.name;
			$scope.isEdit = true;
			$scope.isAdd = false;
		};
		var editMappingFailureCallback = function(errorMessage) {
			console.log("errr"+errorMessage);
			$scope.$emit('hideLoader');
		};
		
		$scope.invokeApi(ADMappingSrv.editMapping, data, editMappingSuccessCallback ,editMappingFailureCallback );
	};
	
	// template for add/edit
 	$scope.getTemplateUrl = function(){
 		return "/assets/partials/mapping/adExternalMappingDetails.html";
 	};
 	
 	
 	$scope.addNew = function(){
		// fetch add data
		$scope.editData = {};
		$scope.errorMessage = "";
		$scope.isAdd = true;
		$scope.isEdit = false;
	};
	
	
	
	$scope.clickedCancel = function (){

		if($scope.isAdd)
			$scope.isAdd = false;
		else if($scope.isEdit)
			$scope.isEdit = false;
			
	};


	$scope.saveClicked = function(){
		
	};

}]);
