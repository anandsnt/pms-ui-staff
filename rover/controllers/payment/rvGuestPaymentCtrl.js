sntRover.controller('RVPaymentGuestCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	/*
	 * To open new payment modal screen from guest card
	 */
	$scope.openAddNewPaymentModel = function(){
  	 	var passData = {
  	 		"user_id": $scope.paymentData.user_id,
  	 		"guest_id": $scope.paymentData.guest_id,
  	 		"fromView": "guestcard"
  	 	};
  	 	var paymentData = $scope.paymentData;
  	 	$scope.showAddNewPaymentModal(passData, paymentData);
  	 };
  	 /*
	 * To open set as as primary or delete payment
	 */
  	 $scope.openDeleteSetAsPrimaryModal = function(id, index){
  	 	  $scope.paymentData.payment_id = id;
  	 	  $scope.paymentData.index = index;
		  ngDialog.open({
	               template: '/assets/partials/payment/rvDeleteSetAsPrimary.html',
	               controller: 'RVDeleteSetAsPrimaryCtrl',
	               scope:$scope
	          });
  	 };
  	 
  	 $scope.$parent.myScrollOptions = {		
	    'paymentList': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    },
	};

	$scope.$on('SWIPEHAPPENED', function(event, data){
	 	if($scope.isGuestCardVisible){
	 		
	 		$scope.openAddNewPaymentModel();
	 	}
	 	
	 });

	
}]);