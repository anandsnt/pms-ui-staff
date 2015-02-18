admin.controller('ADEmailBlackListCtrl',['$scope', '$state', 'ADEmailBlackListSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout', '$location',
  function($scope, $state, ADEmailBlackListSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
    $scope.isAddMode = false;
	$scope.emailData= {};
	$scope.emailData.email = "";
	
	

   /*
    * To fetch list of blacklisted emails
    */
	$scope.listEmailBlackList = function(){
		
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.emailList = data;			
		};
	   $scope.invokeApi(ADEmailBlackListSrv.fetch, {} , successCallbackFetch);	
	};
	// To list blacklisted emails
	$scope.listEmailBlackList(); 
   
   
   /*
    * To get the template of edit screen
    * @param {int} index of the selected room type
    * @param {string} id of the room type
    */
	$scope.getTemplateUrl = function(){		
		return "/assets/partials/EmailBlackList/adAddBlackListedEmail.html";
	};

	$scope.addNewClicked = function(){
		$scope.isAddMode = true;
	}
  /*
   * To save/update room type details
   */
   $scope.saveEmail = function(){		
		
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		$scope.emailList.push(data);
    		$scope.emailData = {};
    		$scope.emailData.email = "";	
    		$scope.isAddMode =false;
    	};

    	if($scope.emailData.email == ""){
    		$scope.errorMessage = ["The email field is empty"];
    	}else    	
    	    $scope.invokeApi(ADEmailBlackListSrv.saveBlackListedEmail, $scope.emailData, successCallbackSave);
    	
    	
    };

    /*
   * To delete an email
   */
   $scope.deleteEmail = function(index){
		
		var param = $scope.emailList[index].id;
    	var successCallbackDelete = function(){
    		$scope.$emit('hideLoader');    		
    		$scope.emailList.splice(index, 1);
    	};
    	$scope.invokeApi(ADEmailBlackListSrv.deleteBlacklistedEmail, param, successCallbackDelete);
    };
	/*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		
		$scope.isAddMode =false;
	};	

}]);

