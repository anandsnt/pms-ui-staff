admin.controller('ADPaymentMethodsCtrl', ['$scope', '$state', 'ADPaymentMethodsSrv',
function($scope, $state, ADPaymentMethodsSrv) {
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	$scope.paymentData = {};
	$scope.isAddMode = false;

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
		//$scope.paymentData={};
		$scope.currentClickedElement = "new";
		//$scope.isAddMode = true;
	};

	/*
	 * To handle click event
	 */
	$scope.clickCancel = function() {
		$scope.currentClickedElement = -1;
	};

	/*
	 * To save/update payment method details
	 */
	$scope.savePaymentMethod = function() {

	};

	/*
	 * To render edit payment method screen
	 * @param {index} index of selected payment method
	 * @param {id} id of the payment method
	 */
	$scope.editPaymentMethod = function(index, id) {
		$scope.paymentData = {};
		$scope.currentClickedElement = index;
		$scope.isAddMode = false;
	};

	/*
	 * To get the template of edit screen
	 * @param {int} index of the selected payment method
	 * @param {string} id of the payment method
	 */
	$scope.getTemplateUrl = function(index, id) {
		if ( typeof index === "undefined" || typeof id === "undefined")
			return "";
		if ($scope.currentClickedElement == index) {
			return "/assets/partials/paymentMethods/adEditPaymentMethod.html";
		}
	};

	/*
	 * To delete payment method
	 * @param {int} index of the selected payment method
	 * @param {string} id of the selected payment method
	 */
	$scope.deletePaymentMethod = function(index, id) {
		var successCallbackDelete = function(data) {
			$scope.$emit('hideLoader');
			$scope.data.departments.splice(index, 1);
			$scope.currentClickedElement = -1;
		};
	};
}]);
