sntRover.controller('RVShowPaymentListCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	$scope.showNoValues = false;
	$scope.paymentListSuccess = function(data){
		$scope.$emit('hideLoader');
		$scope.paymentListData = data;
		
		//To remove non cc payments
		angular.forEach($scope.paymentListData.existing_payments, function(obj, index){
			if (!obj.is_credit_card) {
	 		 	$scope.paymentListData.existing_payments.splice(index, 1);
	  			return;
			};
		});

		$scope.paymentListLength = $scope.paymentListData.existing_payments.length;
		if($scope.paymentListLength == 0){
			$scope.showNoValues = true;
		}
		// console.log($scope.paymentListLength);
	};

	 // console.log(JSON.stringify($scope.dataToPaymentList));
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