sntRover.controller('RVJournalRevenueController', ['$scope','$rootScope', 'RVJournalSrv',function($scope, $rootScope, RVJournalSrv) {
	BaseCtrl.call(this, $scope);
	$scope.setScroller('revenue-content');

	$scope.initRevenueData = function(){
		var successCallBackFetchRevenueData = function(data){
			console.log(data);
			$scope.data.revenueData = {};
			$scope.data.revenueData = data;
			$scope.$emit('hideLoader');
			setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200);
		};
		$scope.invokeApi(RVJournalSrv.fetchRevenueData, {"from":$scope.data.fromDate , "to":$scope.data.toDate}, successCallBackFetchRevenueData);
	};
	$scope.initRevenueData();

	$rootScope.$on('REFRESHREVENUECONTENT',function(){
      setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200);
  });
	
  $rootScope.$on('fromDateChanged',function(){
      console.log("fromDateChanged"+$scope.data.fromDate);
      $scope.initRevenueData();
  });

  $rootScope.$on('toDateChanged',function(){
      console.log("toDateChanged"+$scope.data.toDate);
      $scope.initRevenueData();
  });

  /** Handle Expand/Collapse on each revenue level items **/
  $scope.clickedFirstLevel = function(index1){
  	$scope.data.revenueData.charge_groups[index1].active = !$scope.data.revenueData.charge_groups[index1].active;
    setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200); 
  };
  
  $scope.clickedSecondLevel = function(index1, index2){
  	$scope.data.revenueData.charge_groups[index1].charge_codes[index2].active = !$scope.data.revenueData.charge_groups[index1].charge_codes[index2].active;
    setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200);
  };
 	
 	$scope.isShowTableHeading = function(index1, index2){
 		var isShowTableHeading = false;
 		var data = $scope.data.revenueData.charge_groups[index1].charge_codes[index2].transactions;
 		if(data.length>0){
   		angular.forEach(data,function(transactions, index) {
    		if(transactions.show) isShowTableHeading=true;
    	});
   	}
  	return isShowTableHeading;
 	};

}]);