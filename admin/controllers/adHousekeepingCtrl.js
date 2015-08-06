admin.controller('adHousekeepingCtrl',['$state', '$scope', '$rootScope', 'ADHotelSettingsSrv', '$state', function($state, $scope, $rootScope, ADHotelSettingsSrv, $state){

	BaseCtrl.call(this, $scope);
	$scope.isRoverCheckinRFID = false;
	var fetchSuccess = function(data){
		$scope.data = data.housekeeping;
		$scope.$emit('hideLoader');
		$scope.watchInspectedStatus();
	};
	$scope.invokeApi(ADHotelSettingsSrv.fetch, {}, fetchSuccess);


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
		var dict = {};
		dict.housekeeping = $scope.data;

		$scope.invokeApi(ADHotelSettingsSrv.update, dict, successCallbackSave);
	};

	$scope.watchInspectedStatus = function(){
		$scope.$watch('data.use_inspected', function() {
	       if(!$scope.data.use_inspected){
	       		$scope.data.checkin_inspected_only = false;
	       }

	   	});
	};
	/**
    *   Method to go back to previous state.
    */
	$scope.backClicked = function(){

		$scope.goBack($rootScope, $state);

	};


}]);