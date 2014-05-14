sntRover.controller('companyCardContractsCtrl',['$scope', 'RVCompanyCardSrv', '$stateParams','ngDialog','dateFilter', function($scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter){

	$scope.isAddMode = false;
	$scope.contractsData = {};
	$scope.contractList = {};
	$scope.fetchData = function(){   
  	    var fetchContractsDetailsSuccessCallback = function(data){
  	    	console.log("sucss dettls");
  	    	console.log(data);
  	    	$scope.contractData = data;
  	    	console.log($scope.contractData.occupancy)
  	    };
  	    var fetchContractsListSuccessCallback = function(data){
  	    	$scope.contractList = data.results;
  	    	$scope.contractSelected = data.contract_selected;
  	    };
  	    var fetchContractsDetailsFailureCallback = function(data){
  	        $scope.$emit('hideLoader');
  	    };
  	    var fetchContractsListFailureCallback = function(data){
  	        $scope.$emit('hideLoader');
  	    };
  	    $scope.invokeApi(RVCompanyCardSrv.fetchContractsDetails,{},fetchContractsDetailsSuccessCallback,fetchContractsDetailsFailureCallback);  
		
		$scope.invokeApi(RVCompanyCardSrv.fetchContractsList,{},fetchContractsListSuccessCallback,fetchContractsListFailureCallback);  

    };
	$scope.fetchData();
	
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
}]);