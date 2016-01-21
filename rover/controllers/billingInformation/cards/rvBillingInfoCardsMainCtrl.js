sntRover.controller('rvBillingInfoCardsMainCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	
    BaseCtrl.call(this, $scope);

    /**
     * Function to initialize the controller
     * @return {undefined}
     */
    var init = function() {

        $scope.selectedEntity = {};
        $scope.bills = [];
        $scope.routes = [];
        $scope.errorMessage = '';

        $scope.billingInfoFlags = {
            shouldShowWaiting : false,
            isReloadNeeded    : false,
            showChargeCodes   : false,
            isBillingGroup    : true
        }; 

        $scope.saveData = {
            payment_type             :  "",
            payment_type_description :  "",
            newPaymentFormVisible    : false
        };

        setSelectedEntityType();
    };

    /**
     * Function to set type of selected entity
     * @return {undefined}
     */
    var setSelectedEntityType = function() {
        if ($scope.billingEntity === "TRAVEL_AGENT_DEFAULT_BILLING") {
            $scope.setSelectedEntity('TRAVEL_AGENT');
        }
        else {
            $scope.setSelectedEntity('COMPANY_CARD');
        }
    };

	$scope.$on('UPDATE_SHOULD_SHOW_WAITING', function(e, value) {
		$scope.billingInfoFlags.shouldShowWaiting = value;
	});

    /**
     * Function to close the billing information popup
     * @return {undefined}
     */
	$scope.closeDialog = function() {
		ngDialog.close();
	};

    /**
     * Function to set the reload option
     * @param {Boolean}
     * @return {undefined}
     */
    $scope.setReloadOption = function(option) {
        $scope.billingInfoFlags.isReloadNeeded = option;
    };

    /**
     * Function to get the class for the 'li' according to the entity role
     * @param {Object} selected route
     * @return {String} class of 'li'
     */
    $scope.getEntityRole = function(route) {
        if (route.entity_type === 'TRAVEL_AGENT') {
            return 'travel-agent'; 
        }
        else {
            return 'company';
        }
    };

    /**
     * Function to get the class for the 'icon' according to the entity role
     * @param {Object} selected route
     * @return {String} class of 'icon'
     */
    $scope.getEntityIconClass = function(route) {
        if (route.entity_type === 'COMPANY_CARD') {
            return '';
        }
        else {
            return 'icons icon-travel-agent';
        } 
    };

    /**
     * Function that converts a null value to a desired string.
     * if no replace value is passed, it returns an empty string.
     * @return {String}
     */
    $scope.escapeNull = function(value, replaceWith) {
        return escapeNull(value, replaceWith);
    };

    /*
     * Function to set the selected entity details
     * @param {String} entity type
     * @return {undefined}
     */
    $scope.setSelectedEntity = function(type) {
        $scope.errorMessage = "";

        $scope.selectedEntity = {
            "attached_charge_codes": [],
            "attached_billing_groups": [],
            "is_new" : true,
            "credit_card_details": {}
        };

        if (type === 'COMPANY_CARD') {
            $scope.selectedEntity.id     = $scope.attachedEntities.company_card.id;
            $scope.selectedEntity.name   = $scope.attachedEntities.company_card.name;
            $scope.selectedEntity.images = [{
                "is_primary"  : true,
                "guest_image" : $scope.attachedEntities.company_card.logo
            }];
            $scope.selectedEntity.entity_type = "COMPANY_CARD";
        }
        else {
            $scope.selectedEntity.id     = $scope.attachedEntities.travel_agent.id;
            $scope.selectedEntity.name   = $scope.attachedEntities.travel_agent.name;
            $scope.selectedEntity.images = [{
                "is_primary"  : true,
                "guest_image" : $scope.attachedEntities.travel_agent.logo
            }];
            $scope.selectedEntity.entity_type = "TRAVEL_AGENT";
        } 
    };

    /**
     * Function to save the route
     * @return {undefined}
     */
    $scope.saveRoute = function() {
        $rootScope.$broadcast('routeSaveClicked');
    };

    /**
    * Listener to show error messages for child views
    */
    $scope.$on("displayErrorMessage", function(event, error){
        $scope.errorMessage = error;

    });

    /**
    * CICO-14951 :function to delete routing info from default billing info
    */

    /**
    * Function to delete the routing
    * @return {undefined}
    */
    $scope.deleteDefaultRouting = function() {

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
        data.id  = $scope.contactInformation.id;
        $scope.invokeApi(RVBillinginfoSrv.deleteDefaultRouting, data, successCallback, errorCallback);
    };

    init();

}]);
