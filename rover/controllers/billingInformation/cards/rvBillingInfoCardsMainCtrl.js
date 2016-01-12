sntRover.controller('rvBillingInfoCardsMainCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	BaseCtrl.call(this, $scope);

    $scope.isEntitySelected = false;
    $scope.selectedEntity = {};
	$scope.results = {};
    $scope.bills = [];
    $scope.isReloadNeeded = false;
    $scope.routes = [];
    $scope.errorMessage = '';
    $scope.saveData = {};
    $scope.saveData.payment_type =  "";
    $scope.saveData.payment_type_description =  "";
    $scope.saveData.newPaymentFormVisible = false;
	$scope.shouldShowWaiting = false;

	$scope.$on('UPDATE_SHOULD_SHOW_WAITING', function(e, value){
		$scope.shouldShowWaiting = value;
	});

	$scope.closeDialog = function(){
		ngDialog.close();
        $scope.$emit('routingPopupDismissed');
	};

	$scope.dimissLoaderAndDialog = function(){
		$scope.$emit('hideLoader');
		$scope.closeDialog();
	};

    /**
    * function to set the reload option
    param option is boolean
    */
    $scope.setReloadOption = function(option){
        $scope.isReloadNeeded = option;
    };
    
    /*function to select the attached entity
    */
    $scope.selectAttachedEntity = function(index,type){

        $scope.errorMessage = "";
        $scope.isEntitySelected = true;
        $scope.isInitialPage = false;
        //TODO: Remove commented out code
        $scope.selectedEntity = {

            "bill_no": "",
            "has_accompanying_guests" : false,
            "attached_charge_codes": [],
            "attached_billing_groups": [],
            "is_new" : true,
            "credit_card_details": {}
        };

        if(type === 'COMPANY_CARD'){
            $scope.selectedEntity.id = $scope.attachedEntities.company_card.id;
            $scope.selectedEntity.name = $scope.attachedEntities.company_card.name;
            $scope.selectedEntity.images = [{
                "is_primary":true,
                "guest_image": $scope.attachedEntities.company_card.logo
            }];
            $scope.selectedEntity.entity_type = "COMPANY_CARD";
        }else {
            $scope.selectedEntity.id = $scope.attachedEntities.travel_agent.id;
            $scope.selectedEntity.name = $scope.attachedEntities.travel_agent.name;
            $scope.selectedEntity.images = [{
                "is_primary":true,
                "guest_image": $scope.attachedEntities.travel_agent.logo
            }];
            $scope.selectedEntity.entity_type = "TRAVEL_AGENT";
        }            
    };

    /**
    * function to get the class for the 'li' according to the entity role
    */
    $scope.getEntityRole = function(route){
        
        if(route.entity_type === 'TRAVEL_AGENT') {
            return 'travel-agent'; 
        }
        else {
            return 'company';
        }
    };

    /**
    * function to get the class for the 'icon' according to the entity role
    */
    $scope.getEntityIconClass = function(route){
        if(route.entity_type === 'COMPANY_CARD') {
            return '';
        }
        else {
            return 'icons icon-travel-agent';
        } 
    };

    $scope.escapeNull = function(value, replaceWith){
        return escapeNull(value, replaceWith);
    };

    /**
    * function to save the new route
    */
    $scope.saveRoute = function(){
        $rootScope.$broadcast('routeSaveClicked');
    };
    /**
    * Listener to show error messages for child views
    */
    $scope.$on("displayErrorMessage", function(event, error){
        $scope.errorMessage = error;

    });


	$scope.handleCloseDialog = function(){
		$scope.$emit('HANDLE_MODAL_OPENED');
		$scope.closeDialog();
        if(!!$scope.billingData) {// NOTE: CICO-17123 When the billing information popup is called from the Group Summary Tab, there wont be a billingData object in $scope. This was throwing "TypeError: Cannot set property 'billingInfoTitle' of undefined"
            $scope.billingData.billingInfoTitle = ($scope.routes.length > 0 )? $filter('translate')('BILLING_INFO_TITLE'):$filter('translate')('ADD_BILLING_INFO_TITLE');
        }
	};

    /**
    * CICO-14951 :function to delete routing info from default billing info
    */
    $scope.deleteDefaultRouting = function(){
        var successCallback = function(data) {
            $scope.$emit('hideLoader');
            $scope.$emit('BILLINGINFODELETED');
            $scope.closeDialog();
            
        };
        var errorCallback = function(errorMessage) {
            $scope.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        var data = {};
        data.id = $scope.contactInformation.id;
        $scope.invokeApi(RVBillinginfoSrv.deleteDefaultRouting, data, successCallback, errorCallback);
    };

    var init = function() {    
        if ($scope.billingEntity === "TRAVEL_AGENT_DEFAULT_BILLING") {
            $scope.selectAttachedEntity('', 'TRAVEL_AGENT');
        }
        else {
            $scope.selectAttachedEntity('', 'COMPANY_CARD');
        }        
    };
    
    init();
}]);