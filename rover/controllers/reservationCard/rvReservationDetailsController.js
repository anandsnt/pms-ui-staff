
sntRover.controller('reservationDetailsController',['$scope', '$rootScope','RVReservationCardSrv',  '$stateParams', 'reservationListData','reservationDetails', 'ngDialog', 'RVSaveWakeupTimeSrv','$filter', 'RVNewsPaperPreferenceSrv', 'RVLoyaltyProgramSrv', function($scope, $rootScope, RVReservationCardSrv, $stateParams, reservationListData, reservationDetails, ngDialog, RVSaveWakeupTimeSrv,$filter, RVNewsPaperPreferenceSrv, RVLoyaltyProgramSrv){

	BaseCtrl.call(this, $scope);
	$scope.reservationCardSrv = RVReservationCardSrv;
	/*
	 * success call back of fetch reservation details
	 */
	//Data fetched using resolve in router
	$scope.reservationData = reservationDetails;
	$scope.$parent.$parent.reservation = reservationDetails;
	$scope.reservationnote = "";
	$scope.currencySymbol = getCurrencySign($scope.reservationData.reservation_card.currency_code);
	$scope.selectedLoyalty = {};
	$scope.$emit('HeaderChanged', $filter('translate')('STAY_CARD_TITLE'));
	$scope.$watch(
        function() { return (typeof $scope.reservationData.reservation_card.wake_up_time.wake_up_time != 'undefined')?$scope.reservationData.reservation_card.wake_up_time.wake_up_time:$filter('translate')('NOT_SET'); },
        function(wakeuptime) { $scope.wake_up_time = wakeuptime; }
    );
    console.log($scope.reservationData);
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
		RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
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
		$scope.$parent.$parent.reservation = data;
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

  	 
  	 $scope.openAddNewPaymentModel = function(data){
  	 	if(data === undefined){
  	 			var passData = {
		  	 		"reservationId": $scope.reservationData.reservation_card.reservation_id,
		  	 		"fromView": "staycard",
		  	 		"is_swiped": false 
		  	 	};
		  	 	var paymentData = $scope.reservationData;
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
		  	 		"reservationId": $scope.reservationData.reservation_card.reservation_id,
		  	 		"fromView": "staycard",
		  	 		"credit_card": data.RVCardReadCardType,
		  	 		"card_number": "xxxx-xxxx-xxxx-"+tokenData.slice(-4),
		  	 		"name_on_card": data.RVCardReadCardName,
		  	 		"card_expiry":data.RVCardReadExpDate,
		  	 		"et2": data.RVCardReadTrack2,
	             	 'ksn': data.RVCardReadTrack2KSN,
	              	'pan': data.RVCardReadMaskedPAN,
	              	'token': tokenData,
		  	 		 "is_swiped": true   // Commenting for now
		  	 	};
	         	var paymentData = $scope.reservationData;
	  	 		$scope.showAddNewPaymentModal(passData, paymentData);
         	};
         	$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);	
  	 	}
  	 	
  	 };
  	
  	 $scope.openPaymentList = function(){
  	 	$scope.reservationData.currentView = "stayCard";
	 	$scope.$emit('SHOWPAYMENTLIST', $scope.reservationData);
  	 };
	 /*
	  * Handle swipe action in reservationdetails card
	  */
	 $scope.$on('SWIPEHAPPENED', function(event, data){
	 	if(!$scope.isGuestCardVisible){
	 		$scope.openAddNewPaymentModel(data);
	 	}
	 	
	 });

	 $scope.failureNewspaperSave = function(errorMessage){
	 	$scope.errorMessage = errorMessage;
	 	$scope.$emit('hideLoader');
	 };
	 $scope.successCallback = function(){
	 	RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
	 	$scope.$emit('hideLoader');
	 };
	 $scope.isNewsPaperPreferenceAndWakeupCallAvailable = function(){
        	var status = $scope.reservationData.reservation_card.reservation_status;
        	return status == "CHECKEDIN" || status == "CHECKING_OUT" || status == "CHECKING_IN";
        };
  	 $scope.saveNewsPaperPreference = function(){
		
		var params = {};
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
		params.selected_newspaper= $scope.reservationData.reservation_card.news_paper_pref.selected_newspaper;
		
		$scope.invokeApi(RVNewsPaperPreferenceSrv.saveNewspaperPreference, params, $scope.successCallback, $scope.failureNewspaperSave);

	};
	$scope.showFeatureNotAvailableMessage = function(){
		var errorMessage = "Feature not available";
            		if($scope.hasOwnProperty("errorMessage")){ 	
						$scope.errorMessage = [errorMessage];
						$scope.successMessage = '';
					}else {
						$scope.$emit("showErrorMessage", errorMessage);
					}
	};

  	 $scope.showWakeupCallDialog = function () {
            	if(!$scope.isNewsPaperPreferenceAndWakeupCallAvailable()){
            		$scope.showFeatureNotAvailableMessage();
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
        
}]);