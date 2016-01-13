sntRover.controller('rvChargeCodesAndBillingGroupCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'RVGuestCardSrv', 'ngDialog', 'RVBillCardSrv', 'RVPaymentSrv', function($scope, $rootScope,$filter, RVBillinginfoSrv, RVGuestCardSrv, ngDialog, RVBillCardSrv, RVPaymentSrv){
    /**
    * function to switch between the charge code and billing groups views
    */
    $scope.toggleChargeType = function(){
        $scope.isBillingGroup = !$scope.isBillingGroup;
        if($scope.isBillingGroup){
            $scope.refreshScroller('billingGroups');
        }
        else {
            $scope.refreshScroller('chargeCodes');
        }
        $scope.showChargeCodes = false;
    };
    /**
    * function to know if the billing grup is selected or not, to adjust the UI
    */
    $scope.isBillingGroupSelected = function(billingGroup){
        for(var i=0; i < $scope.selectedEntity.attached_billing_groups.length; i++){
            if($scope.selectedEntity.attached_billing_groups[i].id === billingGroup.id ) {
                return true;
            }
        }
        return false;
    };
    /**
    * function to switch the billing group selection
    */
    $scope.toggleSelectionForBillingGroup = function(billingGroup){
        for(var i=0; i < $scope.selectedEntity.attached_billing_groups.length; i++){
            if($scope.selectedEntity.attached_billing_groups[i].id === billingGroup.id ){
                $scope.selectedEntity.attached_billing_groups.splice(i, 1);
                return;
            }
        }
        $scope.selectedEntity.attached_billing_groups.push(billingGroup);
        $scope.refreshScroller('billingGroups');
    };
    /**
    * function to remove the charge code
    */
    $scope.removeChargeCode = function(chargeCode){
        for(var i=0; i < $scope.selectedEntity.attached_charge_codes.length; i++){
            if($scope.selectedEntity.attached_charge_codes[i].id === chargeCode.id ){
                $scope.selectedEntity.attached_charge_codes.splice(i, 1);
                return;
            }
        }
    };
    /**
    * function to show available charge code list on clicking the dropdown
    */
    $scope.showAvailableChargeCodes = function(){
        $scope.clearResults ();
        displayFilteredResultsChargeCodes();
        $scope.showChargeCodes = !$scope.showChargeCodes;
    };

    /**
    * function to select charge code
    */
    $scope.addChargeCode = function(){
        for(var i=0; i < $scope.availableChargeCodes.length; i++){
            if($scope.availableChargeCodes[i].id === $scope.chargeCodeToAdd){
                for(var j=0; j < $scope.selectedEntity.attached_charge_codes.length; j++){

                    if($scope.selectedEntity.attached_charge_codes[j].id === $scope.chargeCodeToAdd ){
                        return;
                    }
                }
                $scope.selectedEntity.attached_charge_codes.push($scope.availableChargeCodes[i]);
                $scope.refreshScroller('chargeCodes');
                return;
            }
        }
    };
    /**
    * function to select the charge code to be used in UI
    */
    $scope.selectChargeCode = function(selected_chargecode_id){
        $scope.chargeCodeToAdd = selected_chargecode_id;
        $scope.addChargeCode();
        $scope.chargeCodeSearchText = '';
        $scope.showChargeCodes = false;
    };

    /**
    * function to clear the charge code search text
    */
    $scope.clearResults = function(){
        $scope.chargeCodeSearchText = "";
    };

    /**
    * function to perform filering on results.
    * if not fouund in the data, it will request for webservice
    */
    var displayFilteredResultsChargeCodes = function(){
        //if the entered text's length < 3, we will show everything, means no filtering
        if($scope.chargeCodeSearchText.length < 3){
          //based on 'is_row_visible' parameter we are showing the data in the template
          for(var i = 0; i < $scope.availableChargeCodes.length; i++){
            if($scope.isChargeCodeSelected($scope.availableChargeCodes[i])){
                $scope.availableChargeCodes[i].is_row_visible = false;
                $scope.availableChargeCodes[i].is_selected = false;
            } else {
                $scope.availableChargeCodes[i].is_row_visible = true;
                $scope.availableChargeCodes[i].is_selected = true;
            }

          }
          $scope.refreshScroller('chargeCodesList');
          // we have changed data, so we are refreshing the scrollerbar

        }
        else{
            var value = "";
            //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
            //if it is zero, then we will request for webservice
            for(var i = 0; i < $scope.availableChargeCodes.length; i++){
                value = $scope.availableChargeCodes[i];
                if ((($scope.escapeNull(value.code).toUpperCase()).indexOf($scope.chargeCodeSearchText.toUpperCase()) >= 0 ||
                    ($scope.escapeNull(value.description).toUpperCase()).indexOf($scope.chargeCodeSearchText.toUpperCase()) >= 0) && (!$scope.isChargeCodeSelected($scope.availableChargeCodes[i])))
                    {
                        $scope.availableChargeCodes[i].is_row_visible = true;
                    }
                    else {
                        $scope.availableChargeCodes[i].is_row_visible = false;
                    }
                }
            $scope.refreshScroller('chargeCodesList');
        }
    };

    $scope.escapeNull = function(value, replaceWith){
        return escapeNull(value, replaceWith);
    };
    /**
    * function to know if the charge code is selected, to adjust in UI
    */
    $scope.isChargeCodeSelected = function(chargeCode){
        for(var i=0; i < $scope.selectedEntity.attached_charge_codes.length; i++){
            if($scope.selectedEntity.attached_charge_codes[i].id === chargeCode.id ) {
                return true;
            }
        }
        return false;
    };

}]);