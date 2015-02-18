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

            $scope.tableParams = new ngTableParams({
		       page: 1,            // show first page
		       	count: 100,    // count per page - Need to change when on pagination implemntation
		        sorting: { email: 'asc'     // initial sorting 
		        }
		    }, {
		     
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.emailList, params.orderBy()) :
		                                $scope.emailList;
		                              
		            $scope.orderedData =  orderedData;
		                                 
		            $defer.resolve(orderedData);
		        }
		    });

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
    		$scope.tableParams.reload();
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
    		$scope.tableParams.reload();
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

