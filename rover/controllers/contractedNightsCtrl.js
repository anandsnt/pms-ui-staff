
sntRover.controller('contractedNightsCtrl',['$scope','dateFilter','ngDialog',function($scope,dateFilter,ngDialog){

	$scope.saveContractedNights = function(){
		ngDialog.close();
		
	};
	
	$scope.clickedCancel = function(){
		ngDialog.close();
		
	};
	
}]);