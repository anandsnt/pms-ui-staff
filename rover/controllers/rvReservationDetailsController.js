sntRover.controller('reservationDetailsController',['$scope','RVReservationCardSrv',  '$stateParams', 'reservationListData','reservationDetails', 'ngDialog', function($scope, RVReservationCardSrv, $stateParams, reservationListData, reservationDetails, ngDialog){
	BaseCtrl.call(this, $scope);
	/*
	 * success call back of fetch reservation details
	 */
	//Data fetched using resolve in router
	$scope.reservationData = reservationDetails;
	$scope.currencySymbol = getCurrencySign($scope.reservationData.reservation_card.currency_code);
	$scope.selectedLoyalty = {};
	angular.forEach($scope.reservationData.reservation_card.loyalty_level.frequentFlyerProgram, function(item, index) {
		if($scope.reservationData.reservation_card.loyalty_level.selected_loyalty == item.id){
			$scope.selectedLoyalty = item;
			$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
		}
	});
	angular.forEach($scope.reservationData.reservation_card.loyalty_level.hotelLoyaltyProgram, function(item, index) {
		if($scope.reservationData.reservation_card.loyalty_level.selected_loyalty == item.id){
			$scope.selectedLoyalty = item;
			$scope.selectedLoyalty.membership_card_number = $scope.selectedLoyalty.membership_card_number.substr($scope.selectedLoyalty.membership_card_number.length - 4);
		}
	});
	
	$scope.$parent.myScrollOptions = {		
	    'resultDetails': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    },
	};

	
	
	$scope.$on('$viewContentLoaded', function() {
		setTimeout(function(){
			$scope.$parent.myScroll['resultDetails'].refresh();
			}, 
		3000);
		
     });
		
	
	$scope.reservationDetailsFetchSuccessCallback = function(data){
		
		$scope.$emit('hideLoader');
		$scope.reservationData = data;
	};
	/*
	 * Fetch reservation details on selecting or clicking each reservation from reservations list
	 * @param {int} confirmationNumber => confirmationNumber of reservation
	 */
	$scope.$on("RESERVATIONDETAILS", function(event, confirmationNumber){
	 	if(confirmationNumber){
	 		  $scope.invokeApi(RVReservationCardSrv.fetchReservationDetails, confirmationNumber, $scope.reservationDetailsFetchSuccessCallback);	
	 	} else {
	 		$scope.reservationData = {};
	 	}
	  
  	});
  	//To pass confirmation number and resrvation id to reservation Card controller.
  	 // var passData = {confirmationNumber: $stateParams.confirmationId, reservationId: $stateParams.id};
  	 var passData = reservationListData;
  	 passData.avatar=reservationListData.guest_details.avatar;
  	 passData.vip=reservationListData.guest_details.vip;
  	 $scope.$emit('passReservationParams', passData);
  	 
  	 $scope.openAddNewPaymentModel = function(){
  	 	var passData = {
  	 		"reservationId": $scope.reservationData.reservation_card.reservation_id,
  	 		"fromView": "staycard"
  	 	};
  	 	var paymentData = $scope.reservationData;
  	 	$scope.showAddNewPaymentModal(passData, paymentData);
  	 };
  	 $scope.openPaymentList = function(){
	 //	$scope.paymentData.payment_id = id;
  	 	//  $scope.paymentData.index = index;
		  ngDialog.open({
	               template: '/assets/partials/payment/rvShowPaymentList.html',
	               controller: 'RVShowPaymentListCtrl',
	               scope:$scope
	          });
	 };
}]);