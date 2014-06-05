sntRover.controller('RVShowPaymentListCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.paymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.paymentListData = data;
	};
	$scope.invokeApi(RVPaymentSrv.getPaymentList, $scope.reservationData.reservation_card.reservation_id, $scope.paymentListSuccess);  
	
	$scope.clickPaymentItem = function(paymentId, cardCode, cardNumberEndingWith, expiryDate){
		var data = {
			"reservation_id":	$scope.reservationData.reservation_card.reservation_id,
			"user_payment_type_id":	paymentId
		};
		var paymentMapFailure = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		var paymentMapSuccess = function(){
			$scope.$emit('hideLoader');
			ngDialog.close();
			$scope.reservationData.reservation_card.payment_details.card_type_image = cardCode.toLowerCase()+".png";
			$scope.reservationData.reservation_card.payment_details.card_number = cardNumberEndingWith;
			$scope.reservationData.reservation_card.payment_details.card_expiry = expiryDate;
		};
		$scope.invokeApi(RVPaymentSrv.mapPaymentToReservation, data, paymentMapSuccess, paymentMapFailure);  
	};
	
	
	
	$scope.$parent.myScrollOptions = {		
	    'paymentList': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    }
	};

	
	
	$scope.$on('$viewContentLoaded', function() {
		setTimeout(function(){
			$scope.$parent.myScroll['paymentList'].refresh();
			}, 
		3000);
		
     });
	
}]);