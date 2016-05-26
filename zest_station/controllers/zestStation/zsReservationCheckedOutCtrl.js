sntZestStation.controller('zsReservationCheckedOutCtrl', [
  '$scope',
  '$state',
  'zsUtilitySrv',
  'zsCheckoutSrv',
  'zsEventConstants',
  '$stateParams',
  'zsModeConstants',
  '$window', '$timeout','$filter',
  function($scope, $state, zsUtilitySrv, zsCheckoutSrv, zsEventConstants, $stateParams, zsModeConstants, $window, $timeout,$filter) {

    BaseCtrl.call(this, $scope);

    /**
     * when the back button clicked
     * @param  {[type]} event
     * @return {[type]} 
     */
    $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
      if ($scope.emailError) {
        $state.at = 'edit-email'; //back to email by way of print-nav, 
        $state.from = 'review-bill';
        $scope.init();
        return;
      }

      if ($state.at === 'email-nav' && $state.from === 'print-nav') {
        $state.at = 'print-nav';
        $state.go('zest_station.reservation_checked_out');

      } else if ($state.at === 'edit-email' && $state.from === 'email-nav') {
        if ($scope.zestStationData.guest_bill.print) {
          $state.from = 'print-nav';
        } else {
          $state.from === 'edit-email';
        }
        $state.emailEdited = false;
        $state.at = 'email-nav';
        $scope.afterEmailSave();
      } else {
        if ($state.at === 'print-nav' && $stateParams.from === 'email-skip') { //coming from email skip means email IS enabled and user doesnt have an email on file
          $state.at = 'edit-email'; //back to email by way of print-nav, 
          $state.from = 'review-bill';
          $scope.init();
        } else {
          $state.go('zest_station.review_bill');
        }
      }
    });
    $scope.$watch('emailError',function(to, from){
        if (typeof to === typeof undefined){
            if ($state.emailError){
                $scope.emailError = true;
            } else {
                $scope.emailError = false;
            }
        }
    });
    var sendBill = function() {
        
        var sendBillSuccess = function(response) {
            $scope.emailOpted = $scope.zestStationData.guest_bill.email;
            $state.emailError = false;
          if ($state.printOpted) {
            $scope.printOpted = true;
          } else {
            $scope.printOpted = false;
          }
          $scope.toCheckoutFinal();
        };
        var sendBillFailure = function(response) {
            $state.emailError = true;
            $scope.emailOpted = $scope.zestStationData.guest_bill.email;
            $scope.toCheckoutFinal();
        };
      
      
      
      var params = {
        reservation_id: $scope.zestStationData.reservationData.reservation_id,
        bill_number: "1"
      };
      var options = {
        params: params,
        successCallBack: sendBillSuccess,
        failureCallBack: sendBillFailure
      };
      $scope.callAPI(zsCheckoutSrv.sendBill, options);
    };

    $scope.zestStationData.keyCaptureDone = false;
    
    var checkOutSuccess = function() {
      //if key card was inserted we need to capture that
      if($scope.zestStationData.keyCardInserted){
        $scope.zestStationData.keyCaptureDone = true;
        $scope.socketOperator.CaptureKeyCard();
      };
      sendBill();
    };
    $scope.toCheckoutFinal = function() {
      if ($stateParams.from === 'email-skip') {
        $scope.emailSkipped = true;
      } else {
        $scope.emailSkipped = false;
      }
      $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
      $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
      $state.checkout_finalmode = true;
      $scope.mode = "final-mode";
      setTimeout(function() {
        $state.go('zest_station.reservation_checked_out');
      }, 50);
    };
    //the callback for failure case
    $scope.failureCallBack = function(){
      //if key card was inserted we need to eject that
      if($scope.zestStationData.keyCardInserted){
        $scope.socketOperator.EjectKeyCard();
      };
      $state.go('zest_station.error_page');
    };

    var checkOutGuest = function() {
      var params = {
        "reservation_id": $scope.zestStationData.reservationData.reservation_id,
        "is_kiosk": true
      };
      var options = {
        params: params,
        successCallBack: checkOutSuccess,
        failureCallBack: $scope.failureCallBack
      };
      //if user has no CC and a positive balance, checkout is not allowed
      if ($scope.cashReservationBalanceDue()) {
        console.warn("reservation has balance due");
        $state.go('zest_station.speak_to_staff');
      } else {
        $scope.callAPI(zsCheckoutSrv.checkoutGuest, options);
      }

    };

    $scope.cashReservationBalanceDue = function() {
      return (!$scope.zestStationData.reservationData.has_cc && $scope.zestStationData.reservationData.balance > 0);
    };

    $scope.editEmailAddress = function() {
      $state.emailEdited = true;
      $state.at = 'edit-email';
      $state.from = 'email-nav';
      $scope.zestStationData.reservationData.edit_email = true;
      $scope.zestStationData.reservationData.edit_email_ad = $scope.zestStationData.reservationData.email;
      $state.go('zest_station.reservation_checked_out');
    };

    $scope.toBillDelivery = function() {
      $scope.at = 'email-delivery';
      $scope.headingText = "SEND_BILL_TO";
      $scope.subHeadingText = $scope.zestStationData.reservationData.email;
    };
    $scope.hasEmailSetting = function(){
        console.info('theme: ',$scope.zestStationData.theme);
        var validEmail = false;
        if (!$scope.email || $scope.email === '' || $scope.email === ' '){
            
        } else if($scope.email.length > 1) {
            validEmail = true;
        }
        
        console.info('has email: "',$scope.email,'" : ',validEmail);
        $scope.hasEmail = validEmail;
    };
    $scope.toEditEmail = function() {
      $scope.email = $scope.zestStationData.reservationData.edit_email_ad;
      if ($scope.email === null){
          $scope.email = '';
      }
      $scope.hasEmailSetting();
      $scope.setEmailMode();
      $scope.emailOpted = $scope.zestStationData.guest_bill.email;
    };
    $scope.initFinalMode = function() {
      $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
      $scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
      $state.checkout_finalmode = false;
      $scope.mode = "final-mode";
      $scope.printOpted = false;
      $scope.emailOpted = false;
      if ($scope.zestStationData.guest_bill.email) {
        $scope.emailOpted = true;
      }
    };

    $scope.editEmailRequested = function() {
      return ($scope.zestStationData.reservationData.edit_email && $scope.zestStationData.guest_bill.email);
    };

    $scope.emailOnly = function() {
      return ($scope.zestStationData.guest_bill.email &&
        $scope.current === 'zest_station.bill_delivery_options' &&
        !$scope.zestStationData.guest_bill.print);
    };

    $scope.directToEditIfNoEmail = function() {
      if ($scope.zestStationData.reservationData.email === null) {
        $state.go('zest_station.reservation_checked_out');
      } else if ($scope.zestStationData.reservationData.email.length === 0) {
        $state.go('zest_station.reservation_checked_out');
      }
    };
    $scope.goEditEmail = function() {
      $scope.setEmailMode();
      $scope.directToEditIfNoEmail();
    };
    $scope.resetEmailVars = function() {
      $scope.emailEnabled = false;
      $scope.email = "";
      $scope.hasEmailSetting();
    };

    $scope.setEmailMode = function() {
      $scope.mode = "email-mode";
      $scope.emailError = false;
    };

    $scope.emailEnabledAndNeeded = function() {
      return ((!$scope.zestStationData.reservationData.email || $scope.zestStationData.reservationData.email.length === 0) && $scope.zestStationData.guest_bill.email);
    };

    /**
     * [clickedNoThanks description]
     * @return {[type]} [description]
     */

    $scope.skipEmailEntryAfterSwipe = function() {
      $state.skipCheckoutEmail = true;
      if ($state.updatedEmail) {
        $stateParams.from = 'updated-email';
        $scope.afterEmailSave();
      } else {
        if ($scope.zestStationData.guest_bill.print && !$state.emailEdited) {
          $stateParams.from = 'email-skip';
          $scope.mode = "print-mode";
        } else {
          if (!$state.emailEdited) {
            $stateParams.from = 'email-skip';
          }
          $scope.afterEmailSave();
        }
      }
    };

    $scope.clickedNoThanks = function(printed) { //from print
      if (!printed) {
        $scope.printOpted = false;
        $state.printOpted = false;
      } else {
        $scope.printOpted = true;
        $state.printOpted = true;
      }

      var guest_bill = $scope.zestStationData.guest_bill;

      if (!guest_bill.email) {
        $scope.emailOpted = false;
        checkOutGuest();

      } else if (guest_bill.email && !$state.skipCheckoutEmail) {
        $state.at = 'email-nav';
        $state.go('zest_station.bill_delivery_options');
      } else {
        if ($state.skipCheckoutEmail) {
          $scope.emailOpted = false;
        } else {}
        checkOutGuest();
      }

    };

    $scope.send = function() {
      checkOutGuest();
    };

    $scope.afterEmailSave = function() {
      if ($scope.zestStationData.reservationData.edit_email && !$state.skipCheckoutEmail) {
        $scope.zestStationData.reservationData.edit_email = false;
        $state.go('zest_station.bill_delivery_options');
      } else {
        $scope.zestStationData.reservationData.edit_email = false;
        checkOutGuest();
      }
    };
    var emailSaveSuccess = function() {
      $scope.zestStationData.reservationData.email = $scope.email;
      $scope.hasEmailSetting();
      //check if admin settings for print bill is set as true
      if ($scope.zestStationData.reservationData.edit_email) {
        $scope.afterEmailSave();
      } else { //email was input before print screen
        if ($scope.zestStationData.guest_bill.print) {
          $scope.mode = "print-mode";
        } else {
          $scope.afterEmailSave();
        }
      }

    };


    var callSaveEmail = function() {
      var params = {
        "guest_detail_id": $scope.zestStationData.reservationData.guest_detail_id,
        "email": $scope.email
      };
      var options = {
        params: params,
        successCallBack: emailSaveSuccess,
        failureCallBack: $scope.failureCallBack
      };
      $scope.callAPI(zsCheckoutSrv.saveEmail, options);
    };

    /**
     * [saveEmail to save the email to the reservation]
     * @return {[type]} [description]
     */
    $scope.saveEmail = function() {
      if ($scope.email.length === 0) {
        return;
      } else {
        // check if email is valid
        zsUtilitySrv.isValidEmail($scope.email) ? callSaveEmail() : $scope.emailError = true;
      }
    };

    $scope.reTypeEmail = function() {
      $scope.emailError = false;
    };
    // add the print orientation before printing
    var addPrintOrientation = function() {
      $('head').append("<style id='print-orientation'>@page { size: portrait; }</style>");
    };

    // add the print orientation after printing
    var removePrintOrientation = function() {
      $( '#print-orientation' ).remove();
    };

    var fetchBillSuccess = function(response) {
      $scope.$emit(zsEventConstants.HIDE_LOADER);
      $scope.printData = response;

      // add the orientation
      addPrintOrientation();
      // print section - if its from device call cordova.
      $scope.handleBillPrint();
    };

  $scope.handleBillPrint = function() {
    $scope.$emit('hideLoader');
    $scope.errorMessage = "";

    // CICO-9569 to solve the hotel logo issue
    $("header .logo").addClass('logo-hide');
    $("header .h2").addClass('text-hide');

    $('.popup').hide(); //hide timeout elements
    $('.invis').hide(); //hide timeout elements
    $('#popup-overlay').hide(); //hide timeout elements
    var printFailedActions = function(){
       $scope.zestStationData.workstationOooReason = $filter('translate')('CHECKOUT_PRINT_FAILED');
       $scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS,{'status':'out-of-order','reason':$scope.zestStationData.workstationOooReason});
       $state.go('zest_station.error');
    };
    try {
      // this will show the popup with full bill
      $timeout(function() {
        /*
         * ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
         */
        $window.print();
        if (sntapp.cordovaLoaded) {
          var printer = (sntZestStation.selectedPrinter);
          cordova.exec(function(success) {
            $scope.clickedNoThanks(true); //now checking for email update / send
            //checkOutGuest();
          }, function(error) {
            printFailedActions();
          }, 'RVCardPlugin', 'printWebView', ['filep', '1', printer]);
        };
        $scope.printOpted = true;
        // provide a delay for preview to appear 

      }, 100);
    } catch (e) {
      console.info("something went wrong while attempting to print");
    };
    setTimeout(function() {
      $scope.isPrintRegistrationCard = false;

      // CICO-9569 to solve the hotel logo issue
      $("header .logo").removeClass('logo-hide');
      $("header .h2").addClass('text-hide');

      // remove the orientation after similar delay
      removePrintOrientation();
      $scope.clickedNoThanks(true); //now checking for email update / send
    }, 100);
  };

    $scope.fetchBillData = function() {
      var data = {
        "reservation_id": $scope.zestStationData.reservationData.reservation_id,
        "bill_number": 1
      };
      var options = {
        params: data,
        successCallBack: fetchBillSuccess,
        failureCallBack: $scope.failureCallBack
      };
      $scope.callAPI(zsCheckoutSrv.fetchBillPrintData, options);
    };

    $scope.printBill = function() {
      $scope.fetchBillData();
    };

    $scope.init = function() {
        console.info('theme: [ ',$scope.theme,' ]');
      var current = $state.current.name;
      console.info('testing:: ',current);
      if ($scope.zestStationData.reservationData.email === null){
          $scope.zestStationData.reservationData.email = '';
      }
        if ($scope.zestStationData.reservationData && $scope.zestStationData.reservationData.email !== null){
            $scope.email = $scope.zestStationData.reservationData.email;
        } else {
            $scope.email = '';
        }
        if (!$scope.email){
            $scope.email = '';
        }
              $scope.hasEmailSetting();
        
      console.info('$scope.zestStationData:: ',$scope.zestStationData);
      console.info('$scope.zestStationData.reservationData.email :',$scope.zestStationData.reservationData.email);
      console.info('email : [ ',$scope.email,' ]');
      console.info('typeof email : [ ',typeof $scope.email,' ]');
      console.info(' length of email : [ ',$scope.email.length,' ]');
      if ($state.checkout_finalmode) {
        $scope.initFinalMode();
      } else {

        $scope.resetEmailVars();

        //first check if we are editing the email address, then test the other stuff as usual
        if ($scope.editEmailRequested()) {
          $scope.toEditEmail();
          return;
        } else if ($scope.emailOnly()) {

          if ($scope.emailEnabledAndNeeded()) {
            $scope.goEditEmail();

          } else {
            $scope.toBillDelivery();
          }
          return;
        } else if ($scope.zestStationData.guest_bill.email && $scope.current === 'zest_station.bill_delivery_options') {
          $scope.toBillDelivery();
          return;
        }
        // we check if the reservation has an email id and the admin settings for 
        // email bill is set as true
        if ($scope.emailEnabledAndNeeded()) {
          $scope.setEmailMode();
        }
        //else we check if admin settings for print bill is set as true
        else if ($scope.zestStationData.guest_bill.print && $scope.current === 'zest_station.reservation_checked_out') {
          $scope.mode = "print-mode";
          $scope.email = $stateParams.email;
          if ($scope.email === null){
              $scope.email = '';
          }
            $scope.hasEmailSetting();
          if ($state.emailError){
                $scope.emailError = true;
          } else {
                $scope.emailError = false;
          }
        } else {
            $scope.emailError = false;
            checkOutGuest();
        }

        $scope.printOpted = false;
        $scope.emailOpted = $scope.zestStationData.guest_bill.email;
      };
    };

    /**
     * [initializeMe description]
     * @return {[type]} [description]
     */
    var initializeMe = function() {
      //show back button
      $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

      //show close button
      $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

      $scope.init();
    }();


  }
]);