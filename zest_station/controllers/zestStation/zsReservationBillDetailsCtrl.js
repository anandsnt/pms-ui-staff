sntZestStation.controller('zsReservationBillDetailsCtrl', [
	'$scope',
	'$state',
	'zsCheckoutSrv','zsEventConstants','$stateParams','zsModeConstants',
	function($scope, $state, zsCheckoutSrv,zsEventConstants,$stateParams,zsModeConstants) {

	BaseCtrl.call(this, $scope);
    console.log(JSON.stringify($stateParams.checked_out));
    
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
        $state.go('zest_station.reservation_search', {
            mode: zsModeConstants.CHECKOUT_MODE
        });
	});

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
                $('#textual').css('max-height', $textualHeight + 'px');
        }
    };

    var refreshScroller = function(){
        $scope.refreshScroller('bill-list');
    }

    var fetchBillSuccess = function(response){

        //process bill data
        var billsData     = response.bill_details.fee_details;
        $scope.billData   = [];
        $scope.currency   = response.bill_details.currency;
        $scope.net_amount = response.bill_details.total_fees;
        $scope.deposit    = response.bill_details.credits;
        $scope.balance    = $scope.zestStationData.reservationData.balance = response.bill_details.balance;

        angular.forEach(billsData, function(billData, key) {
          angular.forEach(billData.charge_details, function(chargeDetail, key) {
                var bill_details = {"date" : billData.date,"description":chargeDetail.description,"amount":chargeDetail.amount};
                $scope.billData.push(bill_details);
          });
        });

        //scroller setup
        setTermsConditionsHeight();
        refreshScroller();
    };


    var setupBillData = function(){
       
        var options = {
            params:             {"reservation_id":$scope.zestStationData.reservationData.reservation_id},
            successCallBack:    fetchBillSuccess,
            failureCallBack:    $scope.failureCallBack
        };
        $scope.callAPI(zsCheckoutSrv.fetchBillDetails, options);
    };
  

    var init = function(){

        if($scope.zestStationData.reservationData.is_checked_out){
            $scope.alreadyCheckedOut = true;
        }
        else{
            $scope.alreadyCheckedOut = false;
            setupBillData();
            
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
                
        init();
	}();

    /**
     *  We check if the balance is greater than 0 and has no CC.
     *  If so we redirect to the staff
     */
    $scope.nextClicked = function(){
        if(!$scope.zestStationData.reservationData.has_cc && $scope.billData.balance > 0){
            $state.go('zest_station.speak_to_staff');
        }
        else{
             $state.go('zest_station.reservation_checked_out');
        }
    };
        
        

}]);