
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	

	BaseCtrl.call(this, $scope);

	$scope.chainsList = [];
	$scope.editData   = {};

	$scope.isAddmode = false;
	$scope.isEditmode = false;

	// fetch chain list


	$scope.fetchHotelChains = function(){


		$scope.invokeApi(adChainsSrv.fetch, {}, function(data) {
			$scope.$emit('hideLoader');
			$scope.chainsList = data.chain_list;

		}, function(){
			$scope.$emit('hideLoader');
			console.log("error controller");
		});

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

		$scope.invokeApi(adChainsSrv.edit,editID, function(data) {
			$scope.$emit('hideLoader');
			$scope.editData   = data;
			$scope.formTitle = 'Edit'+' '+$scope.editData.name;

			if($scope.editData.lov.length === 0)
				$scope.editData.lov.push({'value':'','name':''});
			$scope.isEditmode = true;
			console.log(data)

		}, function(){
			$scope.$emit('hideLoader');
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


 		$scope.invokeApi(adChainsSrv.post,$scope.editData, function(data) {
			$scope.$emit('hideLoader');
				console.log(data)
			$scope.fetchHotelChains();
			$scope.isAddmode = false;

		}, function(){
			$scope.$emit('hideLoader');
			$scope.isAddmode = false;
			console.log("error controller");
		});


 	}


 	$scope.updateChain = function(id){


		angular.forEach($scope.editData.lov,function(item, index) {
		  if (item.name == "") { // not divisible by two, remove.
		    $scope.editData.lov.splice(index, 1);
		  }
		});

		var updateData = {'id' : id ,'updateData' :$scope.editData }

 		$scope.invokeApi(adChainsSrv.update,updateData, function(data) {
			$scope.$emit('hideLoader');
				console.log(data)
			$scope.fetchHotelChains();
			$scope.isEditmode = false;

		}, function(){
			$scope.$emit('hideLoader');
			$scope.isEditmode = false;
			console.log("error controller");
		});

 	// 	adChainsSrv.update(id,$scope.editData).then(function(data) {
		
		// 	console.log(data)
		// 	$scope.fetchHotelChains();
		// 	$scope.isEditmode = false;

		// },function(){
		// 	console.log("error controller");
		// 	$scope.isEditmode = false;
		// });	


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



	if((index === $scope.editData.lov.length-1) || ($scope.editData.lov.length==1))
			$scope.editData.lov.push({'value':'','name':''});

	
	}
// remaining


// implement base webservice


}]);

