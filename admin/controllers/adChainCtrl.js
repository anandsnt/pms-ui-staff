
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


		$scope.editData.lov  = [{'value':'','name':'frfr'}];

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


 		adChainsSrv.update(id+1,$scope.editData).then(function(data) {
		
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
			$scope.updateChain($scope.currentClickedElement);
	}


	$scope.addNewoption = function(){


// var count = 0;
// console.log($scope.editData.lov)

//  angular.forEach($scope.editData.lov,function(value,index){
            

            	

//                 if(value.name.length ===0){
//                 	alert(count)
//                 	count++;
//                 	if(count == 2)
//                 	$scope.addNewoption = false;
//             	}
//                 else
//                 	$scope.addNewoption = true;
//             });

// 		 if($scope.addNewoption)
			$scope.editData.lov.push({'value':'','name':''});

	}
	
// remaining


// 1.add chain api
// 2.edit mode api
// 3. update mode api 


}]);

