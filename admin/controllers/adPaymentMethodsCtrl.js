admin.controller('ADPaymentMethodsCtrl', ['$scope', '$state', 'ADPaymentMethodsSrv',
function($scope, $state, ADPaymentMethodsSrv) {
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	$scope.editData = {};
	
	var fetchSuccess = function(data) {
		$scope.data = data;
		$scope.$emit('hideLoader');
	};

	$scope.invokeApi(ADPaymentMethodsSrv.fetch, {}, fetchSuccess);

	/**
	 *   A post method to activate/inactivate hotel payments
	 *   @param {String} index value for the credit card list.
	 */
	$scope.toggleClickedPayment = function(index) {
		var toggleOn = $scope.data.payments[index].is_active == 'true' ? 'false' : 'true';
		var data = {
			'id' : $scope.data.payments[index].id,
			'set_active' : toggleOn
		};
		var postSuccess = function() {
			$scope.data.payments[index].is_active = ($scope.data.payments[index].is_active == 'true') ? 'false' : 'true';
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
	};

	/*
	 * To handle click event
	 */
	$scope.clickCancel = function() {
		$scope.currentClickedElement = -1;
	};

	/*
	 * To save/Update payment method details
	 */
	$scope.savePaymentMethod = function() {
		
		var successCallbackSave = function(data){
			if($scope.currentClickedElement === "new"){
				$scope.addData.id = data.id;
				$scope.data.payments.push($scope.addData);
			}
			else{
				//To update data with new value
		    	$scope.data.payments[parseInt($scope.currentClickedElement)].description = $scope.editData.description;
		    	$scope.data.payments[parseInt($scope.currentClickedElement)].value = $scope.editData.value;
	    	}	
    		$scope.$emit('hideLoader');
    		$scope.currentClickedElement = -1;
    	};
    	if($scope.currentClickedElement === "new"){
			var data = $scope.addData;
		}
		else{
			var data = $scope.editData;
		}
		$scope.invokeApi(ADPaymentMethodsSrv.savePaymentMethod, data , successCallbackSave);
	};
	/*
	 * To render edit payment method screen
	 * @param {index} index of selected payment method
	 */
	$scope.editPaymentMethod = function(index) {
		$scope.currentClickedElement = index;
		$scope.editData = dclone($scope.data.payments[index],["is_active","is_system_defined"]);
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

	/*
	 * To delete payment method
	 * @param {string} id of the selected payment method
	 */
	$scope.deletePaymentMethod = function(id) {
		console.log("delete id"+id);
		var successCallbackDelete = function(data) {
			$scope.$emit('hideLoader');
			$scope.data.payments.splice($scope.currentClickedElement, 1);
			$scope.currentClickedElement = -1;
		};
		$scope.invokeApi(ADPaymentMethodsSrv.deletePaymentMethod, id , successCallbackDelete);
	};
}]);
