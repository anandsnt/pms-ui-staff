sntZestStation.controller('zsReservationCheckedOutCtrl', [
	'$scope',
	'$state',
    'zsUtilitySrv',
	'zsCheckoutSrv',
    'zsEventConstants',
    '$stateParams',
    'zsModeConstants',
    '$window','$timeout',
	function($scope, $state,zsUtilitySrv, zsCheckoutSrv,zsEventConstants,$stateParams,zsModeConstants,$window,$timeout) {

	BaseCtrl.call(this, $scope);
    
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
        $state.go('zest_station.review_bill');
	});

  var checkOutSuccess = function(){
      $scope.mode = "final-mode"
  };

  var checkOutGuest = function(){

    var params   = {
                    "reservation_id":$scope.zestStationData.reservationData.reservation_id,
                    "is_kiosk":true
                  };
    var options = {
                    params:             params     ,
                    successCallBack:    checkOutSuccess,
                    failureCallBack:    $scope.failureCallBack
                  };
    //if user has no CC and a positive balance, checkout is not allowed
    if(!$scope.zestStationData.reservationData.has_cc && $scope.zestStationData.reservationData.balance >0){
      $state.go('zest_station.speak_to_staff');
    }
    else{
      $scope.callAPI(zsCheckoutSrv.checkoutGuest, options);
    }
    
  };


  var init = function(){
     $scope.email = "";

     // we check if the reservation has an email id and the admin settings for 
     // email bill is set as true
     if((!$scope.zestStationData.reservationData.email || $scope.zestStationData.reservationData.email.length === 0 ) && $scope.zestStationData.guest_bill.email){
          $scope.mode       = "email-mode";
          $scope.emailError = false;
     }
     //else we check if admin settings for print bill is set as true
     else if($scope.zestStationData.guest_bill.print){
          $scope.mode       = "print-mode";
          $scope.email      = $stateParams.email;
     }
     else{
           checkOutGuest();
     }
     
     $scope.printOpted = false;
     $scope.emailOpted = $scope.zestStationData.emailEnabled;
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
   * [clickedNoThanks description]
   * @return {[type]} [description]
   */
  $scope.clickedNoThanks = function(){
      checkOutGuest();
  };

  var emailSaveSuccess = function(){
      //check if admin settings for print bill is set as true
      $scope.zestStationData.guest_bill.print ? $scope.mode = "print-mode" : checkOutGuest();
  };


  var callSaveEmail = function(){
    var params   = {
                    "guest_detail_id":$scope.zestStationData.reservationData.guest_detail_id,
                    "email":$scope.email
                   };
    var options = {
                params:             params,
                successCallBack:    emailSaveSuccess,
                failureCallBack:    $scope.failureCallBack
            };
    $scope.callAPI(zsCheckoutSrv.saveEmail, options);
  };

  /**
   * [saveEmail to save the email to the reservation]
   * @return {[type]} [description]
   */
  $scope.saveEmail = function(){
    
    if($scope.email.length === 0){
          return;
      }
      else{
          // check if email is valid
          zsUtilitySrv.isValidEmail($scope.email) ? callSaveEmail() : $scope.emailError = true;
      }
  };

  $scope.reTypeEmail = function(){
      $scope.emailError = false;
  };
  // add the print orientation before printing
    var addPrintOrientation = function() {
      $( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
    };

    var fetchBillSuccess = function(response){
        $scope.$emit(zsEventConstants.HIDE_LOADER);
        $scope.printData = response;

        // add the orientation
        addPrintOrientation();
          // print section - if its from device call cordova.
        try{

            // this will show the popup with full bill
        $timeout(function() {

          /*
          * ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
          */
          $window.print();
          if ( sntZestStation.cordovaLoaded ) {
              var printer = (sntZestStation.selectedPrinter);
              cordova.exec(function(success) {
                  checkOutGuest();
              }, function(error) {
                  $state.go('zest_station.error');
              }, 'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
          };
          $scope.printOpted = true;
          // provide a delay for preview to appear
        }, 100);

        
        }
        catch(e){
          
        }
    
    };

   var setupBillData = function(){
     
      var data = {
              "reservation_id" : $scope.zestStationData.reservationData.reservation_id,
              "bill_number" : 1
      };
      var options = {
          params:            data,
          successCallBack:    fetchBillSuccess,
          failureCallBack:    $scope.failureCallBack
      };
      $scope.callAPI(zsCheckoutSrv.fetchBillPrintData, options);
  };
  

  $scope.printBill= function(){
      setupBillData();
  };  

}]);