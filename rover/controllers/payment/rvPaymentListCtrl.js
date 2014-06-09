sntRover.controller('RVShowPaymentListCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.paymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.paymentListData = data;
	};

	 console.log(JSON.stringify($scope.dataToPaymentList));
	// return false;
	var reservationId = "";
	if($scope.dataToPaymentList.currentView == "billCard"){
		reservationId = $scope.dataToPaymentList.reservation_id;
	} else {
		reservationId =  $scope.dataToPaymentList.reservation_card.reservation_id;
	}
	$scope.invokeApi(RVPaymentSrv.getPaymentList, reservationId, $scope.paymentListSuccess);  
	
	$scope.clickPaymentItem = function(paymentId, cardCode, cardNumberEndingWith, expiryDate){
		var data = {
			"reservation_id":	reservationId,
			"user_payment_type_id":	paymentId
		};
		if($scope.dataToPaymentList.currentView == "billCard"){
			data.bill_number = $scope.dataToPaymentList.bills[$scope.dataToPaymentList.currentActiveBill].bill_number;
		}

		
		
		var paymentMapFailure = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		var paymentMapSuccess = function(){
			$scope.$emit('hideLoader');
			ngDialog.close();
			
			if($scope.dataToPaymentList.currentView == "billCard"){
				var billIndex = $scope.dataToPaymentList.currentActiveBill;
				$scope.dataToPaymentList.bills[billIndex].credit_card_details.card_code = cardCode.toLowerCase();
				$scope.dataToPaymentList.bills[billIndex].credit_card_details.card_number = cardNumberEndingWith;
				$scope.dataToPaymentList.bills[billIndex].credit_card_details.card_expiry = expiryDate;
			} else {
				$scope.dataToPaymentList.reservation_card.payment_details.card_type_image = cardCode.toLowerCase()+".png";
				$scope.dataToPaymentList.reservation_card.payment_details.card_number = cardNumberEndingWith;
				$scope.dataToPaymentList.reservation_card.payment_details.card_expiry = expiryDate;
			}
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