admin.controller('ADTaxExemptCtrl', ['$scope', '$state', '$timeout', 'ADTaxExemptSrv',
function($scope, $state, $timeout, ADTaxExemptSrv) {
	BaseCtrl.call(this, $scope);

	$scope.$emit("changedSelectedMenu", 5);

	$scope.deleteTaxExempt = function(taxExemptId) {
		var successCallBack = function(data) {
			$scope.fetchTaxExempts();
		};
		var options = {
			params: {
				"id": taxExemptId
			},
			onSuccess: successCallBack
		};

		$scope.callAPI(ADTaxExemptSrv.deleteTaxExempts, options);
	};
	
	$scope.fetchTaxExempts =  function() {
		$scope.chargeCodes = [];
		var successCallBack = function(data) {
			$scope.taxExempts = data.results;
		};
		var options = {
			onSuccess: successCallBack
		};

		$scope.callAPI(ADTaxExemptSrv.fetchTaxExempts, options);
	};
	$scope.fetchTaxExempts();	
}]);
