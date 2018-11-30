admin.controller('ADCoTaMandatoryFieldsCtrl', ['$scope', '$state', 'ADCoTaMandatorySrv',
function($scope, $state, ADCoTaMandatorySrv) {
	BaseCtrl.call(this, $scope);
	/*
	 * Save Mandatory fields
	 */
	$scope.saveMandatoryFields = function() {
		var options = {
			params: $scope.coTaMandatoryFields			
		};

		$scope.callAPI(ADCoTaMandatorySrv.saveCoTaMandatoryFields, options);
	};
	/*
	 * To fetch mandatory fields
	 */
	$scope.loadCoTaMandatoryFields =  function($defer, params) {

		var successCallBack = function(data) {
			$scope.coTaMandatoryFields = data;
		},
		options = {
			onSuccess: successCallBack
		};

		$scope.callAPI(ADCoTaMandatorySrv.fetchCoTaMandatoryFields, options);
	};
	
	$scope.loadCoTaMandatoryFields();
}]);
