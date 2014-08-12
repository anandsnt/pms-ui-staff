admin.controller('ADAccountReceivablesCtrl',['$scope', '$state', 'ADHotelSettingsSrv', function($scope, $state, ADHotelSettingsSrv){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
	$scope.fetchAccountReceivableStatus = function(){

		var successCallbackFetch = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
		}
		$scope.invokeApi(ADHotelSettingsSrv.fetch, "", successCallbackFetch);

	}

	$scope.saveAccountReceivableStatus = function(){
		
			
			var postSuccess = function(){
				$scope.$emit('hideLoader');
				
			};
			$scope.data.ar_number_settings.is_auto_assign_ar_numbers;
			$scope.invokeApi(ADHotelSettingsSrv.update, $scope.data, postSuccess);
	}
	$scope.fetchAccountReceivableStatus();
   

}]);

