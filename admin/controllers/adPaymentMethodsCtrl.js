admin.controller('ADPaymentMethodsCtrl',['$scope','$state', 'ADPaymentMethodsSrv',  function($scope, $state, ADPaymentMethodsSrv){
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 5);
	var fetchSuccess = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	
	$scope.invokeApi(ADPaymentMethodsSrv.fetch, {}, fetchSuccess);
	
	/**
    *   A post method to activate/inactivate hotel payments
    *   @param {String} index value for the credit card list.
    */
	$scope.toggleClickedPayment = function(index){
      	var toggleOn = $scope.data.payments[index].is_active == 'true' ? 'false' : 'true';
      	var data = { 'id' :  $scope.data.payments[index].id,  'set_active': toggleOn };
      	var postSuccess = function(){
      		$scope.data.payments[index].is_active = ($scope.data.payments[index].is_active == 'true') ? 'false' : 'true';
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADPaymentMethodsSrv.toggleSwitchPayment, data, postSuccess);
	};	
    /**
    *   A post method to activate/inactivate credit_cards.
    *   @param {String} index value for the credit card list.
    */
	$scope.toggleClickedCC = function(index){
      	var toggleOn = $scope.data.credit_card_types[index].is_active == 'true' ? 'false' : 'true';
      	var data = { 'id' :  $scope.data.credit_card_types[index].id,  'set_active': toggleOn };
      	var postSuccess = function(){
      		$scope.data.credit_card_types[index].is_active = ($scope.data.credit_card_types[index].is_active == 'true') ? 'false' : 'true';
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADPaymentMethodsSrv.toggleSwitchCC, data, postSuccess);
	};
}]);