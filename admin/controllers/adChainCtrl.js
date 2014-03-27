
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	

	$scope.chainsList = [];
	$scope.editData   = {};

	$scope.isAddmode = false;
	$scope.isEditmode = false;

	// fetch chain list

	adChainsSrv.fetch().then(function(data) {
		$scope.chainsList = data.chain_list;

	},function(){
		console.log("error controller");
	});	


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


 	$scope.updateChain = function(id){

 	// 	var updatedData = {};
		// updatedData.name = $scope.editData.name;
		// updatedData.hotel_code = $scope.editData.hotel_code;
		// updatedData.loyalty_program_name = $scope.editData.loyalty_program_name;
		// updatedData.loyalty_program_code = $scope.editData.loyalty_program_code;
		// updatedData.terms_cond_phone = $scope.editData.terms_cond_phone;
		// updatedData.terms_cond_email = $scope.editData.terms_cond_email;
		// updatedData.terms_cond = $scope.editData.terms_cond;
		// updatedData.lov = $scope.editData.lov;	
		// updatedData.import_frequency = $scope.editData.import_frequency;
		// updatedData.sftp_location = $scope.editData.sftp_location;
		// updatedData.sftp_port = $scope.editData.sftp_port;
		// updatedData.sftp_user = $scope.editData.sftp_user;
		// updatedData.sftp_password = $scope.editData.sftp_password;		
		// updatedData.sftp_respath = $scope.editData.sftp_respath;		


		
		// var options = {
			
		// 		   requestParameters: updatedData,
	    	
		// };

 		adChainsSrv.update(id+1,$scope.editData).then(function(data) {
		
			console.log(data)

		},function(){
			console.log("error controller");
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
			alert("add mode")
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

