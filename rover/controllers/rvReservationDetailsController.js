sntRover.controller('reservationDetailsController',['$scope','RVReservationCardSrv',  '$stateParams', 'reservationListData','reservationDetails', 'ngDialog', 'RVSaveWakeupTimeSrv','$filter', function($scope, RVReservationCardSrv, $stateParams, reservationListData, reservationDetails, ngDialog, RVSaveWakeupTimeSrv,$filter){
	BaseCtrl.call(this, $scope);
	/*
	 * success call back of fetch reservation details
	 */
	//Data fetched using resolve in router
	$scope.reservationData = reservationDetails;
	$scope.currencySymbol = getCurrencySign($scope.reservationData.reservation_card.currency_code);
	$scope.selectedLoyalty = {};
	$scope.$watch(
        function() { return (typeof $scope.reservationData.reservation_card.wake_up_time.wake_up_time != 'undefined')?$scope.reservationData.reservation_card.wake_up_time.wake_up_time:$filter('translate')('NOT_SET'); },
        function(wakeuptime) { $scope.wake_up_time = wakeuptime; }
    );
	// $scope.wake_up_time = ;
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
	$scope.$on("updateWakeUpTime",function(e,data){

		$scope.reservationData.reservation_card.wake_up_time = data;

		$scope.wake_up_time = (typeof $scope.reservationData.reservation_card.wake_up_time.wake_up_time != 'undefined')?$scope.reservationData.reservation_card.wake_up_time.wake_up_time:$filter('translate')('NOT_SET');
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

  	 $scope.showWakeupCallDialog = function () {
            	if(!$scope.isWakeupCallFeatureAvailable){
            		var errorMessage = "Feature not available";
            		if($scope.hasOwnProperty("errorMessage")){ 	
						$scope.errorMessage = [errorMessage];
						$scope.successMessage = '';
					}else {
						$scope.$emit("showErrorMessage", errorMessage);
					}
            		return;
            	}
            		
                $scope.wakeupData = $scope.reservationData.reservation_card.wake_up_time;
            	ngDialog.open({
                template: '/assets/partials/reservationCard/rvSetWakeupTimeDialog.html',
                controller: 'rvSetWakeupcallController',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
            
        };
        $scope.isWakeupCallFeatureAvailable = function(){
        	var status = $scope.reservationData.reservation_card.reservation_status;
        	return status == "CHECKEDIN" || status == "CHECKING_OUT" || status == "CHECKING_IN";
        };
}]);