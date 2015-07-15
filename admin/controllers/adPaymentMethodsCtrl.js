admin.controller('ADPaymentMethodsCtrl', ['$scope', '$state', 'ADPaymentMethodsSrv', '$anchorScroll', '$timeout', '$location', 
function($scope, $state, ADPaymentMethodsSrv, $anchorScroll, $timeout, $location) {
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	$scope.editData = {};
	$scope.currentClickedElementCC = -1;
	$scope.currentClickedElement = -1;

	var fetchSuccess = function(data) {
		$scope.data = data;
		$scope.$emit('hideLoader');
	};

	$scope.invokeApi(ADPaymentMethodsSrv.fetch, {}, fetchSuccess);

	/**
	 *   A post method to activate/inactivate hotel payments
	 *   @param {String} index value for the credit card list.
	 */
	$scope.toggleClickedPayment = function(index,isFromCCGroup) {
		
		if(isFromCCGroup){
			var item = $scope.data.credit_card_types[index];
		}
		else{
			var item = $scope.data.payments[index];
		}

		var toggleOn = item.is_active == 'true' ? 'false' : 'true';
		var data = {
			'id' : item.id,
			'set_active' : toggleOn
		};
		var postSuccess = function() {
			item.is_active = toggleOn;
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADPaymentMethodsSrv.toggleSwitchPayment, data, postSuccess);
	};

	/**
	 *   A post method to activate/inactivate credit_cards.
	 *   @param {String} index value for the credit card list.
	 */
	$scope.toggleClickedCC = function(index) {
		var toggleOn = $scope.data.credit_card_types[index].is_active == 'true' ? 'false' : 'true';
		var data = {
			'id' : $scope.data.credit_card_types[index].id,
			'set_active' : toggleOn
		};
		var postSuccess = function() {
			$scope.data.credit_card_types[index].is_active = ($scope.data.credit_card_types[index].is_active == 'true') ? 'false' : 'true';
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADPaymentMethodsSrv.toggleSwitchCC, data, postSuccess);
	};
        
	/*
	 * Render add payment method screen
	 */
	$scope.addNew = function() {
		$scope.addData = {};
		$scope.currentClickedElement = "new";
		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
	};

	/*
	 * To handle click event
	 */
	$scope.clickCancel = function() {
		$scope.currentClickedElement = -1;
		$scope.currentClickedElementCC = -1;
	};

	$scope.activeCCTab = function(){
		angular.forEach($scope.data.payments,function(item, index) {
			if(item.value == "CC" && item.is_active == "false")
				$scope.toggleClickedPayment(index,false);
		});
	};
	/*
	 * To save/Update payment method details
	 */
	$scope.savePaymentMethod = function() {

		var successCallbackSaveCC = function(data){
			$scope.data.credit_card_types[parseInt($scope.currentClickedElementCC)] = data;
			$scope.$emit('hideLoader');
    		$scope.currentClickedElementCC = -1;
		};

		var successCallbackSavePaymentMethod = function(data){

			if(data.value == "CC"){
				// Edited CC - LINKED RESERVATION TYPE only
				console.log("Edited the Main Credit Card Payment method");
				$scope.data.payments[parseInt($scope.currentClickedElement)] = data;
			}
			else if($scope.currentClickedElement === "new"){
				if(data.is_cc){
				// Added new credit card type item ( ie,'is_cc = true' )
					$scope.data.credit_card_types.push(data);
				}
				else{
					// Added new payment item ( ie,'is_cc = false' ).
					$scope.data.payments.push(data);
				}
			}
			else if(!data.is_cc && $scope.currentClickedElement != -1){
				// Edited from 'payments list' with 'is_cc = false'.
				$scope.data.payments[parseInt($scope.currentClickedElement)] = data;
	    	}
	    	else if(data.is_cc && $scope.currentClickedElement != -1){
	    		// Edited from 'payments list' - made as 'is_cc = true' : moving data to 'credit card type list'.
	    		// Remove data from $scope.data.payments[] list.
	    		// push this data to $scope.data.credit_card_types[] list.
	    		$scope.data.payments.splice( $scope.currentClickedElement, 1 );
	    		$scope.data.credit_card_types.push(data);
	    		// Active the toggle button for payment method -Credit card.
	    		$scope.activeCCTab();
	    	}
	    	else if(data.is_cc && $scope.currentClickedElementCC != -1){
	    		// Edited from 'credit card type list' with 'is_cc = true'.
	    		$scope.data.credit_card_types[parseInt($scope.currentClickedElementCC)] = data;
	    	}
	    	else if(!data.is_cc && $scope.currentClickedElementCC != -1){
	    		// Edited from 'credit card type list'  - made as 'is_cc = false' : moving data to 'payments list'.
	    		// Remove data from $scope.data.credit_card_types[] list.
	    		// push this data to $scope.data.payments[] list.
	    		$scope.data.credit_card_types.splice( $scope.currentClickedElementCC, 1 );
	    		$scope.data.payments.push(data);
	    	}
    		$scope.$emit('hideLoader');
    		
	    	$scope.currentClickedElement = -1;
	    	$scope.currentClickedElementCC = -1;
	    	
    	};

    	var dataToSend = {};

    	if($scope.currentClickedElement === "new") dataToSend = $scope.addData;
		else dataToSend = $scope.editData;
		
		// If we edit system defined credit card type - call api to update credit card.
		if( $scope.currentClickedElementCC != -1 && dataToSend.is_system_defined ){
			$scope.invokeApi(ADPaymentMethodsSrv.saveCreditCardMethod, dataToSend , successCallbackSaveCC);
		}
		// Else we call api to update payment types.
		else{
			$scope.invokeApi(ADPaymentMethodsSrv.savePaymentMethod, dataToSend , successCallbackSavePaymentMethod);
		}
	};

	/*
	 * To render edit payment method screen
	 * @param {index} index of selected payment method
	 */
	$scope.editPaymentMethod = function(index) {
		//if($scope.data.payments[index].value !== 'CC'){
			$scope.currentClickedElement = index;
			$scope.editData = dclone($scope.data.payments[index],["is_active"]);
			$scope.editData.isEditCC = false;
		//}
	};

	$scope.editPaymentMethodCC = function(index) {
		$scope.currentClickedElementCC = index;
		$scope.editData = dclone($scope.data.credit_card_types[index],["is_active"]);
		$scope.editData.isEditCC = true;
	};

	/*
	 * To get the template of edit screen
	 * @param {int} index of the selected payment method
	 */
	$scope.getTemplateUrl = function(index) {
		if ( typeof index === "undefined")
			return "";
		if ($scope.currentClickedElement == index) {
			return "/assets/partials/paymentMethods/adEditPaymentMethod.html";
		}
	};

	$scope.getTemplateUrlCC = function(index) {
		if ( typeof index === "undefined")
			return "";
		if ($scope.currentClickedElementCC == index) {
			return "/assets/partials/paymentMethods/adEditPaymentMethod.html";
		}
	};

	/*
	 * To delete payment method
	 * @param {string} id of the selected payment method
	 */
	$scope.deletePaymentMethod = function(id) {
		var successCallbackDelete = function(data) {
			$scope.$emit('hideLoader');
			$scope.data.payments.splice($scope.currentClickedElement, 1);
			$scope.currentClickedElement = -1;
		};
		$scope.invokeApi(ADPaymentMethodsSrv.deletePaymentMethod, id , successCallbackDelete);
	};



	$scope.roverOnlyChanged = function(){
		if($scope.currentClickedElement === "new"){
			$scope.addData.is_web_only = $scope.addData.is_rover_only ? false: $scope.addData.is_web_only;
		}
		else{
			$scope.editData.is_web_only = $scope.editData.is_rover_only ? false: $scope.editData.is_web_only;
		};
	};

	$scope.webOnlyChanged = function(){
		if($scope.currentClickedElement === "new"){
			$scope.addData.is_rover_only = $scope.addData.is_web_only ? false: $scope.addData.is_rover_only;
		}
		else{
			$scope.editData.is_rover_only = $scope.editData.is_web_only ? false: $scope.editData.is_rover_only;
		};
	};
}]);
