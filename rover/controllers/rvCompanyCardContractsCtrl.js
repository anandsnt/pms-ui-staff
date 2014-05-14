sntRover.controller('companyCardContractsCtrl',['$scope', 'RVCompanyCardSrv', '$stateParams','ngDialog','dateFilter', function($scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter){

	$scope.isAddMode = false;
	$scope.contractsData = {};
	$scope.contractList = {};
	$scope.fetchData = function(){   
  	    var fetchContractsDetailsSuccessCallback = function(data){
  	    	console.log("sucss dettls");
  	    	console.log(data);
  	    	$scope.contractsData = data;
  	    };
  	    var fetchContractsListSuccessCallback = function(data){
  	    	console.log("sucss list");
  	    	console.log(data);
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
			 className: 'ngdialog-theme-default calendar-modal',
			 scope: $scope
		});
	};
	
	$scope.contractEnd = function(){
		ngDialog.open({
			 template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
			 controller: 'contractEndCalendarCtrl',
			 className: 'ngdialog-theme-default calendar-modal',
			 scope: $scope
		});
	};
}]);