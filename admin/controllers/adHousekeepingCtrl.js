admin.controller('adHousekeepingCtrl',['$state', '$scope', 'ADHousekeepingSrv', function($state, $scope, ADHousekeepingSrv){
	
	BaseCtrl.call(this, $scope);
	$scope.isRoverCheckinRFID = false;
	console.log("here");
	var fetchSuccess = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
		$scope.watchInspectedStatus();
	};
	$scope.invokeApi(ADHousekeepingSrv.fetch, {}, fetchSuccess);
	

	/*
    * To handle save button click.
    */
	$scope.save = function(){
		$scope.invokeApi(ADHousekeepingSrv.update, data);
	};

	$scope.watchInspectedStatus = function(){
		$scope.$watch('data.use_inspected', function() {
	       if(!$scope.data.use_inspected){
	       		$scope.data.checkin_to_inspected_rooms_only = false;
	       }
	       
	   	});
	};
	
   	
}]);