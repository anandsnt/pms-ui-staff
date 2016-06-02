sntZestStation.controller('zsReservationBillDetailsCtrl', [
	'$scope',
	'$state',
	'zsCheckoutSrv','zsEventConstants','$stateParams','zsModeConstants',
	function($scope, $state, zsCheckoutSrv,zsEventConstants,$stateParams,zsModeConstants) {

	BaseCtrl.call(this, $scope);
    
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            if ($state.current.name === 'zest_station.review_bill'){
                $state.from = $state.current.name;
                $state.lastAt = 'review_bill';
            }

            if($scope.zestStationData.isKeyCardLookUp){
                 //if key card was inserted we need to eject that
                  if($scope.zestStationData.keyCardInserted){
                    $scope.socketOperator.EjectKeyCard();
                  };
                $state.go('zest_station.checkout_options');
            }
            else{
                $state.go('zest_station.reservation_search', {
                   mode: zsModeConstants.CHECKOUT_MODE
                });
            };
            
	});

    /**
     * [clickedOnCloseButton description]
     * @return {[type]} [description]
     */
    $scope.clickedOnCloseButton = function() {
        //if key card was inserted we need to eject that
        if($scope.zestStationData.keyCardInserted){
            $scope.socketOperator.EjectKeyCard();
        };
        $state.go ('zest_station.home');
    };

    /* 
    *  To setup scroll
    */
    $scope.setScroller('bill-list');

    var setTermsConditionsHeight = function(){
        if($('#textual').length) {
            var $contentHeight = ($('#content').outerHeight()),
                $h1Height = $('#content h1').length ? $('#content h1').outerHeight(true) : 0,
                $h2Height = $('#content h2').length ? $('#content h2').outerHeight(true) : 0,
                $h3Height = $('#content h3').length ? $('#content h3').outerHeight(true) : 0,
                $headingsHeight = parseFloat($h1Height + $h2Height + $h3Height),
                $textualHeight = parseFloat($contentHeight-$headingsHeight);        
                //$('#textual').css('height', $textualHeight + 'px');
                $('#textual').css('height', '45%');
                $('#textual').css('max-height', '100%');
        }
    };

    var refreshScroller = function(){
        $scope.refreshScroller('bill-list');
    };

    $scope.fetchBillSuccess = function(response){

        //process bill data
        var billsData     = response.bill_details.fee_details;
        $scope.zestStationData.billData   = [];
        $scope.zestStationData.currency   = response.bill_details.currency;
        $scope.zestStationData.net_amount = response.bill_details.total_fees;
        $scope.zestStationData.deposit    = response.bill_details.credits;
        $scope.zestStationData.balance    = response.bill_details.balance;

        angular.forEach(billsData, function(billData, key) {
          angular.forEach(billData.charge_details, function(chargeDetail, key) {
                var bill_details = {"date" : billData.date,"description":chargeDetail.description,"amount":chargeDetail.amount};
                $scope.zestStationData.billData.push(bill_details);
          });
        });

        //scroller setup
        setTermsConditionsHeight();
        refreshScroller();
    };


        $scope.setupBillData = function(){
            var options = {
                params:             {"reservation_id":$scope.zestStationData.reservationData.reservation_id},
                successCallBack:    $scope.fetchBillSuccess,
                failureCallBack:    $scope.failureCallBack
            };
            $scope.callAPI(zsCheckoutSrv.fetchBillDetails, options);
        };
  

    /**
     *  We check if the balance is greater than 0 and has no CC.
     *  If so we redirect to the staff
     */
    
    cashReservationBalanceDue = function(){
        return (!$scope.zestStationData.reservationData.has_cc && $scope.zestStationData.reservationData.balance >0);
    };
    var goToReservationCheckedOut = function(){
        $state.go('zest_station.reservation_checked_out');
    };
    var goToDeliveryOptions = function(){
        $state.go('zest_station.bill_delivery_options');  
    };
    var talkToStaff = function(){
        $state.go('zest_station.speak_to_staff');
    };

    
    $scope.nextClicked = function(){
        console.info('next clicked');
        $state.justCheckout = false;
        $scope.zestStationData.reservationData.edit_email = false;
        console.log('cashReservationBalanceDue(): ',cashReservationBalanceDue());
        if(cashReservationBalanceDue()){
            console.warn("reservation has balance due");
            talkToStaff();
        } else {
            
            var guest_bill = $scope.zestStationData.guest_bill;
            
            var emailEnabled  = guest_bill.email ? true : false;
            var printEnabled  = guest_bill.print ? true : false;
            
            console.info('Update Email setting: ',(emailEnabled ? 'on': 'off'));
            
            if (!emailEnabled && !printEnabled){//no email, no print, just_checkout  |  off / off
                console.info('dont email, dont print.. ~just checkout');
                $state.justCheckout = true;
                goToReservationCheckedOut();
                
            } else if (emailEnabled && !printEnabled){//email_only, not print        |  on  /  off
                 console.info('email then print, then checkout');
                $state.at = 'edit-email';
                $scope.zestStationData.reservationData.edit_email = true;
                goToReservationCheckedOut();
                
            } else if ( !emailEnabled && printEnabled ){//go to print nav               | off  /  on 
                console.info('print bill, then checkout');
                
                $state.at = 'print-nav';
                $state.from = 'print-nav';
                
                goToReservationCheckedOut();
            } else if ( emailEnabled && printEnabled ){//go to print nav                              | on  /  on 
                console.info('email then print, then checkout');
                $state.at = 'edit-email';
                $scope.zestStationData.reservationData.edit_email = true;
                goToReservationCheckedOut();
                //goToDeliveryOptions();
            }
            
        };
    };

    $scope.alreadyCheckedOutActions = function(){
        $state.go('zest_station.home');
        $scope.socketOperator.EjectKeyCard();
    };
        

    $scope.init = function(){
        if($scope.zestStationData.reservationData.is_checked_out){
            $scope.alreadyCheckedOut = true;
        }
        else{
            $scope.alreadyCheckedOut = false;
            $scope.setupBillData();
            
        }
    };
    
	/**
	 * [initializeMe description]
	 * @return {[type]} [description]
	 */
	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
                
        $scope.init();
	}();

}]);