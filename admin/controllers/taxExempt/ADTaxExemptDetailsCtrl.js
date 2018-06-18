admin.controller('ADTaxExemptDetailsCtrl', ['$scope', '$state', '$timeout', '$stateParams', 'ADTaxExemptSrv',
function($scope, $state, $timeout, $stateParams, ADTaxExemptSrv) {
	BaseCtrl.call(this, $scope);

	$scope.$emit("changedSelectedMenu", 5);	
	
	$scope.addData = {
		queryParam: null,
		selectedCount: 0,
		charge_code_ids: []
	}	

	$scope.setTaxExemptData = function() {
		var fetchSuccess = function(data) {
			$scope.addData.name = data.name;
			angular.forEach($scope.chargeCodes, function(item) {
				var indexValue = _.findIndex(data.charge_codes, function(chargeCodeItem) {
					return chargeCodeItem.id === parseInt(item.value);
				});
		        item.is_selected = (indexValue != -1);
		        if (item.is_selected) {
		        	$scope.addData.selectedCount++;
		        }		        
		  	});
		};
		var options = {
			successCallBack: fetchSuccess,
			params: {
				"id": $stateParams.taxExemptId
			}
		};

		$scope.callAPI(ADTaxExemptSrv.getTaxExemptDetails, options);
	}	


	$scope.searchChargeCodes = function() {
		var fetchChargeCodeSuccess = function(data) {
			$scope.chargeCodes = [];
			$scope.chargeCodes = data.data.charge_codes;
			angular.forEach($scope.chargeCodes, function(item) {
		        item.is_selected = false;
		  	});
			if($stateParams.taxExemptId) {
				$scope.setTaxExemptData();
			}
		};
		var options = {
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
				$state.go('admin.taxExemptTypes');
			},
			options = {
				successCallBack: saveSuccess,
				params: {
					"name": $scope.addData.name,
					"charge_code_ids": $scope.addData.charge_code_ids
				}
			};
			
		if($stateParams.taxExemptId) {
			params.id = $stateParams.taxExemptId;
			$scope.callAPI(ADTaxExemptSrv.updateTaxExempts, options);
		} else {
			$scope.callAPI(ADTaxExemptSrv.saveTaxExempts, options);
		}
		
	};

	$scope.searchChargeCodes();
}]);
