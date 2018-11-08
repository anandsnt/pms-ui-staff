admin.controller('ADTaxExemptDetailsCtrl', ['$scope', '$state', '$timeout', '$stateParams', 'ADTaxExemptSrv',
function($scope, $state, $timeout, $stateParams, ADTaxExemptSrv) {
	BaseCtrl.call(this, $scope);

	$scope.$emit("changedSelectedMenu", 5);	
	
	$scope.addData = {
		queryParam: null,
		charge_code_ids: []
	};
	$scope.isAddMode = true;
	/*
	 * To set the data if it is edit mode
	 */ 
	$scope.setTaxExemptData = function() {
		var fetchSuccess = function(data) {
				$scope.addData.name = data.name;
				$scope.addData.is_default = data.is_default;
				$scope.addData.charge_code_ids = [];
				angular.forEach($scope.chargeCodes, function(item) {
					var indexValue = _.findIndex(data.charge_codes, function(chargeCodeItem) {
						return chargeCodeItem.id === parseInt(item.value);
					});

					item.is_selected = (indexValue !== -1);    
					if (item.is_selected) {
						$scope.addData.charge_code_ids.push(item.value);
					}  
				});
			},
			options = {
				successCallBack: fetchSuccess,
				params: {
					"id": $stateParams.taxExemptId
				}
			};

		$scope.callAPI(ADTaxExemptSrv.getTaxExemptDetails, options);
	};

	/*
	 * Load all tax charge codes
	 */
	$scope.searchChargeCodes = function() {
		var fetchChargeCodeSuccess = function(data) { 
				$scope.chargeCodes = [];
				$scope.chargeCodes = data.data.charge_codes;
				angular.forEach($scope.chargeCodes, function(item) {
					item.is_selected = false;
				});
				if ($stateParams.taxExemptId) {
					$scope.isAddMode = false;
					$scope.setTaxExemptData();
				}
			},
			options = {
				successCallBack: fetchChargeCodeSuccess
			};

		$scope.callAPI(ADTaxExemptSrv.fetchChargeCodes, options);
	};
	/* 
	 * Handle charge code selection
	 */
	$scope.selectedChargeCode = function() {
		$scope.addData.charge_code_ids = [];
		angular.forEach($scope.chargeCodes, function(item) {

			if (item.is_selected) {
				$scope.addData.charge_code_ids.push(item.value);
			}
		});
	};
	/*
	 * Save/Update tax exempt
	 */
	$scope.saveTaxExempt = function() {
		var saveSuccess = function() {
				$state.go('admin.taxExemptTypes');
			},
			options = {
				successCallBack: saveSuccess,
				params: {
					"name": $scope.addData.name,
					"charge_code_ids": $scope.addData.charge_code_ids,
					"is_default": $scope.addData.is_default
				}
			};
			
		if ($stateParams.taxExemptId) {
			options.params.id = $stateParams.taxExemptId;
			$scope.callAPI(ADTaxExemptSrv.updateTaxExempts, options);
		} else {
			$scope.callAPI(ADTaxExemptSrv.saveTaxExempts, options);
		}		
	};
	/*
	 * Go back to list screen
	 */
	$scope.goBack = function() {
		$state.go('admin.taxExemptTypes');
	};
	// Call initial API
	$scope.searchChargeCodes();
}]);