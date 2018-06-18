admin.controller('ADTaxExemptCtrl', ['$scope', '$state', '$timeout', 'ADTaxExemptSrv',
function($scope, $state, $timeout, ADTaxExemptSrv) {
	BaseCtrl.call(this, $scope);

	$scope.$emit("changedSelectedMenu", 5);
	
	// $scope.editData = {};
	// $scope.addData = {};
	$scope.currentClickedElementCC = -1;
	$scope.currentClickedElement = -1;
	// $scope.addData.charge_code_ids = [];


	$scope.addNewTaxExempt = function() {
		$scope.currentClickedElement = 'new';	
		$scope.addData = {
			queryParam: null,
			selectedCount: 0,
			charge_code_ids: []
		}		
	};

	$scope.searchChargeCodes = function() {
		var fetchChargeCodeSuccess = function(data) {
			$scope.chargeCodes = [];
			$scope.chargeCodes = data.data.charge_codes;
			angular.forEach($scope.chargeCodes, function(item) {
		        item.is_selected = false;
		  	});

			$scope.$emit('hideLoader');
		};
		var options = {
			params: {
				query: $scope.addData.queryParam
			},
			successCallBack: fetchChargeCodeSuccess
		};

		$scope.callAPI(ADTaxExemptSrv.fetchChargeCodes, options);
	};

	$scope.selectedChargeCode = function() {
		$scope.addData.selectedCount = 0;
		$scope.addData.charge_code_ids = [];
		angular.forEach($scope.chargeCodes, function(item) {
	    	if(item.is_selected) {
	    		$scope.addData.selectedCount++;
	    		$scope.addData.charge_code_ids.push(item.value);
	    	}
	  	});
	};

	$scope.saveTaxExempt = function() {
		var saveSuccess = function(data) {

			$scope.$emit('hideLoader');
		};
		var options = {
			successCallBack: saveSuccess,
			params: {
				"name": $scope.addData.name,
				"charge_code_ids": $scope.addData.charge_code_ids
			}
		};

		$scope.callAPI(ADTaxExemptSrv.saveTaxExempts, options);
	};

	$scope.init =  function() {
		$scope.chargeCodes = [];
		var successCallBack = function(data) {
			$scope.taxExempts = data;
		};
		var options = {
			onSuccess: successCallBack
		};

		$scope.callAPI(ADTaxExemptSrv.fetchTaxExempts, options);
	};
	$scope.init();
	

	
}]);
