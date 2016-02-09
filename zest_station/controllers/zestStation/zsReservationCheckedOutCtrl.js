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
      if ($state.printOpted){
          $scope.printOpted = true;
      } else {
          $scope.printOpted = false;
      }
      
      $scope.toCheckoutFinal();
      
  };
  $scope.toCheckoutFinal = function(){
        
      $state.checkout_finalmode = true;
      $scope.mode = "final-mode";
      setTimeout(function(){
          $state.go('zest_station.reservation_checked_out');
      },50);
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
    if($scope.cashReservationBalanceDue()){
        console.warn("reservation has balance due");
        $state.go('zest_station.speak_to_staff');
    }
    else{
      $scope.callAPI(zsCheckoutSrv.checkoutGuest, options);
    }
    
  };
  
  $scope.cashReservationBalanceDue = function(){
      return (!$scope.zestStationData.reservationData.has_cc && $scope.zestStationData.reservationData.balance >0);
  };

    $scope.editEmailAddress = function(){
        $scope.zestStationData.reservationData.edit_email = true;
        $scope.zestStationData.reservationData.edit_email_ad = $scope.zestStationData.reservationData.email;
        $state.go('zest_station.reservation_checked_out');
    };

    $scope.toBillDelivery = function(){
        $scope.at = 'email-delivery';
        $scope.headingText = "SEND_BILL_TO";
        $scope.subHeadingText = $scope.zestStationData.reservationData.email;
    };
    
    $scope.toEditEmail = function(){
        $scope.email = $scope.zestStationData.reservationData.edit_email_ad;
        $scope.mode       = "email-mode";
        $scope.emailError = false;
        $scope.emailOpted = $scope.zestStationData.guest_bill.email;  
    };
    $scope.initFinalMode = function(){
        $state.checkout_finalmode = false;
        $scope.mode       = "final-mode";
        $scope.printOpted = false;
        $scope.emailOpted = $scope.zestStationData.emailEnabled;
    };
    
  var init = function(){
      if ($state.checkout_finalmode){
            $scope.initFinalMode();
            $scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);
            $scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
      } else {
      
        var current = $state.current.name;
        $scope.emailEnabled = false;
        $scope.email = "";

        //first check if we are editing the email address, then test the other stuff as usual
        if ($scope.zestStationData.reservationData.edit_email && $scope.zestStationData.guest_bill.email){
              $scope.toEditEmail();
            return;
        } else if ($scope.zestStationData.guest_bill.email && 
                current === 'zest_station.bill_delivery_options' &&
                !$scope.zestStationData.guest_bill.print){
            if($scope.emailMode()){
                $scope.mode       = "email-mode";
                $scope.emailError = false;
                if ($scope.zestStationData.reservationData.email === null){
                    $state.go('zest_station.reservation_checked_out');
                } else if ($scope.zestStationData.reservationData.email.length === 0){
                    $state.go('zest_station.reservation_checked_out');
                } 
            }
            else {
                $scope.toBillDelivery();
            }
            return;
        }  else if ($scope.zestStationData.guest_bill.email && current === 'zest_station.bill_delivery_options'){
                $scope.toBillDelivery();
                return;
         }
         // we check if the reservation has an email id and the admin settings for 
         // email bill is set as true
         if($scope.emailMode()){
              $scope.mode       = "email-mode";
              $scope.emailError = false;
         }
         //else we check if admin settings for print bill is set as true
         else if($scope.zestStationData.guest_bill.print && current === 'zest_station.reservation_checked_out'){
              $scope.mode       = "print-mode";
              $scope.email      = $stateParams.email;
         } else{
               checkOutGuest();
         }

         $scope.printOpted = false;
         $scope.emailOpted = $scope.zestStationData.emailEnabled;
    };
  };

    $scope.emailMode = function(){
      return ((!$scope.zestStationData.reservationData.email || $scope.zestStationData.reservationData.email.length === 0 ) && $scope.zestStationData.guest_bill.email);
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
  $scope.clickedNoThanks = function(printed){//from print
      if (!printed){
            $scope.printOpted = false;
            $state.printOpted = false;
        } else {
            $scope.printOpted = true;
            $state.printOpted = true;
        }
      var guest_bill = $scope.zestStationData.guest_bill;
        if (!guest_bill.email){
            checkOutGuest();

        } else if (guest_bill.email){
            $state.go('zest_station.bill_delivery_options');

        } 
      
  };

$scope.send = function(){
    checkOutGuest();
};

$scope.afterEmailSave = function(){
    if ($scope.zestStationData.reservationData.edit_email){
        $scope.zestStationData.reservationData.edit_email = false;
        $state.go('zest_station.bill_delivery_options');
    } else {
        $scope.zestStationData.reservationData.edit_email = false;
        checkOutGuest();
    }
};
  var emailSaveSuccess = function(){
      $scope.zestStationData.reservationData.email = $scope.email;
      //check if admin settings for print bill is set as true
      if ($scope.zestStationData.reservationData.edit_email){
          $scope.afterEmailSave();
      } else {//email was input before print screen
          if ($scope.zestStationData.guest_bill.print){
            $scope.mode = "print-mode";
          } else {
              $scope.afterEmailSave();
          }
      }
      
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
                  $scope.clickedNoThanks(true);//now checking for email update / send
                  //checkOutGuest();
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