sntZestStation.controller('zsReservationBillDetailsCtrl', [
	'$scope',
	'$state',
	'zsTabletSrv','zsEventConstants','$stateParams','zsModeConstants',
	function($scope, $state, zsTabletSrv,zsEventConstants,$stateParams,zsModeConstants) {

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
    *  To delete
    */

    var setupBillData = function(){
        $scope.billData = {"guest_name":"resheil","days_of_stay":3,"email":"","has_cc":true,"currency":"$",
        "charge_codes":[{"date":"11/10/15","type":"night","value":200},
        {"date":"11/10/15","type":"night","value":300},
        {"date":"11/10/15","type":"night","value":400},
        {"date":"11/10/15","type":"night","value":500},
        {"date":"11/10/15","type":"night","value":600}],
        "sub-total":100,
        "deposit":40,
        "balance":60};
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
                $('#textual').css('max-height', $textualHeight + 'px');
        }
    };

    var refreshScroller = function(){
        $scope.refreshScroller('bill-list');
    }
  

    var init = function(){

        if($stateParams.checked_out === "true"){
            $scope.alreadyCheckedOut = true;
        }
        else{
            $scope.alreadyCheckedOut = false;
            setupBillData();
            setTermsConditionsHeight();
            refreshScroller();
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
        if(!$scope.billData.has_cc && $scope.billData.balance > 0){
            $state.go('zest_station.speak_to_staff');
        }
        else{
             $state.go('zest_station.reservation_checked_out',{'res_id':$stateParams.res_id,'email':$scope.billData.email});
        }
    };
        
        

}]);