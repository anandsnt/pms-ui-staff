sntRover.controller('RVPaymentGuestCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog','RVReservationCardSrv', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog, RVReservationCardSrv){
	BaseCtrl.call(this, $scope);
	/*
	 * To open new payment modal screen from guest card
	 */
	$scope.openAddNewPaymentModel = function(data){
  	 	
  	 	if(data === undefined){
  	 			 	var passData = {
			  	 		"user_id": $scope.paymentData.user_id,
			  	 		"guest_id": $scope.paymentData.guest_id,
			  	 		"fromView": "guestcard"
			  	 	};
			  	 	var paymentData = $scope.paymentData;
			  	 	$scope.showAddNewPaymentModal(passData, paymentData);
  	 	} else {
  	 		
           var  getTokenFrom = {
              'et2': data.RVCardReadTrack2,
              'ksn': data.RVCardReadTrack2KSN,
              'pan': data.RVCardReadMaskedPAN
           };
         
         var tokenizeSuccessCallback = function(tokenData){
         	data.token = tokenData;
         		var passData = {
		  	 		"user_id": $scope.paymentData.user_id,
			  	 	"guest_id": $scope.paymentData.guest_id,
		  	 		"fromView": "guestcard",
		  	 		"credit_card": data.RVCardReadCardType,
		  	 		"card_number": "xxxx-xxxx-xxxx-"+tokenData.slice(-4),
		  	 		"name_on_card": data.RVCardReadCardName,
		  	 		"card_expiry":data.RVCardReadExpDate,
		  	 		"et2": data.RVCardReadTrack2,
	             	'ksn': data.RVCardReadTrack2KSN,
	              	'pan': data.RVCardReadMaskedPAN,
	              	'token': tokenData,
		  	 		"is_swiped": true  
		  	 	};
		  	 	
         	var paymentData = $scope.paymentData;
  	 		$scope.showAddNewPaymentModal(passData, paymentData);
         };
         $scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);	
          
  	 	}
  	 
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
	 		$scope.openAddNewPaymentModel(data);
	 	}
	 	
	 });
	 
	 $scope.$on('ADDEDNEWPAYMENTTOGUEST', function(event, data){
	 	$scope.paymentData.data.push(data);
	 });
	 
	 

	
}]);