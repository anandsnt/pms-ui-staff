sntRover.controller('rvRouteDetailsCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.isAddPayment = false;

	$scope.showPaymentList = function(){
		$scope.isAddPayment = false;
	}

	$scope.showAddPayment = function(){
		$scope.isAddPayment = true;
	}	

	$scope.toggleChargeType = function(){
		$scope.isBillingGroup = !$scope.isBillingGroup;
	}

	$scope.setChargeType = function(){
		if(($scope.selectedEntity.attached_charge_codes.length == 0 && $scope.selectedEntity.attached_billing_groups.length == 0) || $scope.selectedEntity.attached_billing_groups.length > 0){
			$scope.isBillingGroup = true;
		}else if($scope.selectedEntity.attached_charge_codes.length > 0 ){
			$scope.isBillingGroup = false;
		}
	}	

    $scope.isBillingGroupSelected = function(billingGroup){
        for(var i=0; i < $scope.selectedEntity.attached_billing_groups.length; i++){
            if($scope.selectedEntity.attached_billing_groups[i].id == billingGroup.id )
                return true;
        }
        return false;
    }   

    $scope.toggleSelectionForBillingGroup = function(billingGroup){
        for(var i=0; i < $scope.selectedEntity.attached_billing_groups.length; i++){
            if($scope.selectedEntity.attached_billing_groups[i].id == billingGroup.id ){
                $scope.selectedEntity.attached_charge_codes = [];
                $scope.selectedEntity.attached_billing_groups.splice(i, 1);
                return;                
            }
        }
        $scope.selectedEntity.attached_charge_codes = [];
        $scope.selectedEntity.attached_billing_groups.push(billingGroup);
    };

	$scope.setChargeType();

	$scope.fetchAvailableChargeCodes = function(){
        
            var successCallback = function(data) {
                $scope.availableChargeCodes = data;
                $scope.fetchAvailableBillingGroups();
            };
            var errorCallback = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           
            $scope.invokeApi(RVBillinginfoSrv.fetchAvailableChargeCodes, {}, successCallback, errorCallback);
    };	

    $scope.fetchAvailableBillingGroups = function(){
        
            var successCallback = function(data) {
                $scope.availableBillingGroups = data;
                $scope.$parent.$emit('hideLoader');
            };
            var errorCallback = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
           
            $scope.invokeApi(RVBillinginfoSrv.fetchAvailableBillingGroups, {}, successCallback, errorCallback);
    };	
    $scope.fetchAvailableChargeCodes();
	
}]);