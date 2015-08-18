admin.controller('ADAccountReceivablesCtrl',['$scope', '$state', 'ADHotelSettingsSrv', function($scope, $state, ADHotelSettingsSrv){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);

	$scope.fetchAccountReceivableStatus = function(){

		var successCallbackFetch = function(data){
			$scope.data = data;
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADHotelSettingsSrv.fetch, "", successCallbackFetch);

	};

	$scope.saveAccountReceivableStatus = function(){

			var data = {};
			data.ar_number_settings = $scope.data.ar_number_settings;
			var postSuccess = function(){
				$scope.$emit('hideLoader');

			};
			$scope.invokeApi(ADHotelSettingsSrv.update, data, postSuccess);
	};
	$scope.fetchAccountReceivableStatus();


}]);

