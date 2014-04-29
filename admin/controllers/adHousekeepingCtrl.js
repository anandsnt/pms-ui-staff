admin.controller('adHousekeepingCtrl',['$state', '$scope', 'ADHousekeepingSrv', '$state', function($state, $scope, ADHousekeepingSrv, $state){
	
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
		var successCallbackSave = function(data) {
			$scope.$emit('hideLoader');
			$state.go('admin.dashboard', {
				menu: 4
			});
		};

		$scope.invokeApi(ADHousekeepingSrv.update, $scope.data, successCallbackSave);
	};

	$scope.watchInspectedStatus = function(){
		$scope.$watch('data.use_inspected', function() {
	       if(!$scope.data.use_inspected){
	       		$scope.data.checkin_inspected_only = false;
	       }
	       
	   	});
	};
	
   	
}]);