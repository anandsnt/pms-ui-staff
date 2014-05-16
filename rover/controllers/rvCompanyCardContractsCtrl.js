sntRover.controller('companyCardContractsCtrl',['$scope', 'RVCompanyCardSrv', '$stateParams','ngDialog','dateFilter', function($scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter){

	$scope.isAddMode = false;
	$scope.contractList = {};
	$scope.errorMessage = "";
	
	var fetchContractsDetailsSuccessCallback = function(data){
		$scope.contractsData = {};
    	$scope.contractData = data;
    	$scope.$emit('hideLoader');
    	//setTimeout(function(){refreshScroller();}, 750);
    };
  	var fetchFailureCallback = function(data){
        $scope.$emit('hideLoader');
    };    
  	    
    var fetchContractsListSuccessCallback = function(data){
    	$scope.contractList = data;
    	$scope.contractSelected = data.contract_selected;
    	$scope.invokeApi(RVCompanyCardSrv.fetchContractsDetails,{"account_id":$stateParams.id,"contract_id":$scope.contractSelected},fetchContractsDetailsSuccessCallback,fetchFailureCallback);  
    };
    var fetchContractsDetailsFailureCallback = function(data){
        $scope.$emit('hideLoader');
    };
	
	/**
  	* function used for refreshing the scroller
  	*/
  	var refreshScroller = function(){

	    $scope.$parent.myScroll['contracts_scroll'].refresh();
	    //scroller options
	    $scope.$parent.myScrollOptions = {
	        snap: false,
	        scrollbars: true,
	        bounce: true,
	        vScroll: true,
	        vScrollbar: true,
	        hideScrollbar: false
	    };
  	};
  	
	$scope.invokeApi(RVCompanyCardSrv.fetchContractsList,{"account_id":$stateParams.id},fetchContractsListSuccessCallback,fetchFailureCallback);  
	
	/*
    * Function to handle data change in 'Contract List'.
    */
    $scope.clickedContractList = function(contract_id){
		console.log("clickedContractList"+contract_id);
		$scope.invokeApi(RVCompanyCardSrv.fetchContractsDetails,{"account_id":$stateParams.id,"contract_id":contract_id},fetchContractsDetailsSuccessCallback,fetchContractsDetailsFailureCallback);  
    };
   
	$scope.contractStart = function(){
		ngDialog.open({
			 template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
			 controller: 'contractStartCalendarCtrl',
			 className: 'ngdialog-theme-default calendar-modal1',
			 scope: $scope
		});
	};
	
	$scope.contractEnd = function(){
		ngDialog.open({
			 template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
			 controller: 'contractEndCalendarCtrl',
			 className: 'ngdialog-theme-default calendar-modal1',
			 scope: $scope
		});
	};
	
	$scope.clickedContractedNights = function(){
		ngDialog.open({
			 template: '/assets/partials/companyCard/rvContractedNightsPopup.html',
			 controller: 'contractedNightsCtrl',
			 className: 'ngdialog-theme-default calendar-modal1',
			 scope: $scope
		});
	};
	
	
	$scope.saveContract= function(){
	    var saveContractSuccessCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    var saveContractFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	        $scope.errorMessage = data;
	         $scope.$emit('contactInfoError',true);
	    };
	   
		/**
	  	* change date format for API call 
	  	*/
	    var dataToUpdate =  JSON.parse(JSON.stringify($scope.contractData));
	    var dataUpdated = false;
	    if(angular.equals(dataToUpdate, presentContract)) {
				dataUpdated = true;
		}
		else{
			presentContract = dataToUpdate;
		};	    	
	    //dataToUpdate.birthday = $scope.birthdayText;
	    var data ={'data':dataToUpdate,
	    			'userId':$scope.guestCardData.contactInfo.user_id
	    		};
	    if(!dataUpdated)
	     	$scope.invokeApi(RVCompanyCardSrv.saveContract,data,saveContractSuccessCallback,saveContractFailureCallback);  	
	};

	$scope.$on('saveContract',function(){
	 	console.log("outside clkkk");
	 	$scope.saveContract();
	});
	
	$scope.AddNewContract = function(){
		console.log("data to save");
		console.log($scope.contractData);
	};
	
}]);