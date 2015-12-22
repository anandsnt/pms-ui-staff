sntZestStation.controller('zsCardSwipeCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'zsPaymentSrv',
	'$stateParams',
	'$location',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, zsPaymentSrv, $stateParams, $location) {

	BaseCtrl.call(this, $scope);
        sntZestStation.filter('unsafe', function($sce) {
                return function(val) {
                    return $sce.trustAsHtml(val);
                };
            });
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
             var current=$state.current.name;
            if (current === 'zest_station.card_sign'){
                $state.go ('zest_station.card_swipe');
            } else if(current === 'zest_station.card_swipe'){
                $state.go ('zest_station.terms_conditions');
                
            }
            
            
            
            
	});


	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInCheckinMode = function() {
		return ($stateParams.mode === zsModeConstants.CHECKIN_MODE);
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInCheckoutMode = function() {
		return ($stateParams.mode === zsModeConstants.CHECKOUT_MODE);
	};

	/**
	 * [isInCheckinMode description]
	 * @return {Boolean} [description]
	 */
	$scope.isInPickupKeyMode = function() {
		return ($stateParams.mode === zsModeConstants.PICKUP_KEY_MODE);
	};


        $scope.submitSignature = function(){
            /*
             * this method will check the guest in after swiping a card
             */
            $scope.signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
            if ($scope.signatureData !== [] && $scope.signatureData !== null && $scope.signatureData !== '' && $scope.signatureData !== '[]'){
                $scope.checkInGuest();
            }
        };
        $scope.setCheckInMessage = function(){
            $state.go('zest_station.checking_in_guest');
        };
        $scope.checkInGuest = function(){
             var reservation_id = $scope.selectedReservation.id,
                    //payment_type = $scope.selectedReservation.payment_type,
                    signature = $scope.signatureData;

                $scope.setCheckInMessage();
                setTimeout(function(){
                    $scope.invokeApi(zsTabletSrv.checkInGuest, {
                     'reservation_id':reservation_id, 
                     "authorize_credit_card": false,
                     "do_not_cc_auth": false,
                     "is_promotions_and_email_set": false,
                     "no_post": "",
                     'signature':signature
                 }, $scope.afterGuestCheckinCallback, $scope.afterGuestCheckinCallback); 
                },500);
                
        };
        $scope.clearSignature = function(){
            $scope.signatureData = '';
            $("#signature").jSignature("clear");
        };
        
        $scope.$on('six_token_recived',function(evt, data){
            if (data){
                $scope.sixpay_data = data.six_payment_data;
                $scope.receivedCardSwipeOrChipSuccess();
            }
        });
        
        $scope.receivedCardSwipeOrChipSuccess = function(){
            var cardCode = getSixCreditCardType($scope.sixpay_data.card_type).toLowerCase();//from Utils.js
            //save the payment to guest card/reservation
            var reservationId = $scope.selectedReservation.id;
            var expirYear = '20'+$scope.sixpay_data.expiry.substring(0, 2);
            var expirMonth = $scope.sixpay_data.expiry.substring(2, 4);
            
            var postData = {
                 add_to_guest_card: true,
                 card_code: cardCode,
                 card_expiry: expirYear+'-01-'+expirMonth,
                 card_name: $scope.sixpay_data.card_holder_name,
                 payment_type: "CC",
                 reservation_id: reservationId,
                 token: $scope.sixpay_data.token_no
             };
             console.info('postData: ',postData);
             $scope.invokeApi(zsPaymentSrv.savePayment, postData, $scope.successSavePayment, $scope.failSavePayment); 
        };
        
        $scope.successSavePayment = function(response){
          console.log(response);
            if (response.status === 'success'){
                $scope.$emit('hideLoader');
                $scope.goToCardSign();
            } else {
                $scope.failSavePayment(response);
            }
        };
        $scope.failSavePayment = function(response){
          console.info('failed to save card details');
          $scope.$emit('hideLoader');
          console.warn(response);
        };
        /* what needs to be save to post to guest card
                    add_to_guest_card: true
                    card_code: "ds"
                    card_expiry: "2016-01-01"
                    card_name: "Arun Kumar"
                    payment_type: "CC"
                    reservation_id: 1335665
                    token: "6388120183124190515"
        
        */
        
        //handle six payment iFrame communication
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

        eventer(messageEvent, function(e) {
            var responseData = e.data;
            if (responseData.response_message === "token_created") {
              $scope.$broadcast('six_token_recived', {
                'six_payment_data': responseData
              });
              $scope.$digest();
            }
        }, false);
        
        
        
        $scope.iFrameUrl = '';
        var absoluteUrl = $location.$$absUrl;
        domainUrl = absoluteUrl.split("/zest_station#/")[0];
        $scope.refreshIframeWithGuestData = function(guestData){
            var time = new Date().getTime();
            var firstName = guestData.guest_details[0].first_name;
            var lastName = guestData.guest_details[0].last_name;
            $scope.iFrameUrl = domainUrl + "/api/ipage/index.html?card_holder_first_name=" +firstName + "&card_holder_last_name=" + lastName + "&service_action=createtoken&time="+time;
            var iFrame = document.getElementById('sixIframe');
            try{
                iFrame.src = iFrameUrl;
            }catch(ex){
                // CICO-21044
                // Hiding ugly exception thrown in console
                // happens when MLI is shown and no sixpayment iFrame is configured
                // TODO: Investigate further and elimitate this function call
                console.warn(ex.name, ex.message);
            }
        };
        
        $scope.shouldShowWaiting = false;
        $scope.pageloadingOver = false;
        $scope.simulateSixPay = function(){
            $scope.shouldShowWaiting = true;
            $scope.pageloadingOver = true;
                $scope.shouldShowWaiting = false;
                $scope.pageloadingOver = false;
                
                setTimeout(function(){
                    $scope.$emit('hideLoader');
                    $scope.goToCardSign();
                },2000);
                
        };
        
        $scope.isSixPayPayment = function(){
           if ($scope.zestStationData){
               if ($scope.zestStationData.payment_gateway === "sixpayments"){
                   console.info('making sixpay pmt');
                   return true;
               }
           }
           return false;
        };
        
        $scope.goToCardSign = function(){
            $state.go('zest_station.card_sign');
        };
        
         
        $scope.skipEmailEntryAfterSwipe = function(){
                if ($scope.from === 'card-swipe'){
                    $scope.clearInputText();
                    $scope.from = 'input-email';
                    $scope.setLast('input-email');
                    
                    //$scope.goToScreen(null, 'select-keys-after-checkin', true, 'input-email');
                    $state.go('zest_station.input_reservation_email_after_swipe');
                }
            };
            
            $scope.getLastInputEmail = function(){
                if ($state.input && $state.input.lastEmailValue){
                    return $state.input.lastEmailValue;
                } else return '';
            };
            $scope.setLastInputEmail = function(str){
                if (!$state.input){
                    $state.input = {
                        'lastEmailValue':str
                    };
                } else {
                    $state.input.lastEmailValue = str;
                }
            };
            
            $scope.guestEmailOnFile = function(){
                    var useEmail = '';
                    
                    if ($scope.getLastInputEmail() !== ''){
                        useEmail = $scope.getLastInputEmail();
                    }
                    
                    if ($scope.selectedReservation.guest_details[0].email !== ''){
                        useEmail = $scope.selectedReservation.guest_details[0].email;
                        $scope.setLastInputEmail($scope.selectedReservation.guest_details[0].email);
                    };
                    
                    $scope.useEmail = useEmail;
                    if (useEmail !== '' && zsUtilitySrv.isValidEmail(useEmail)){
                        return true;
                    } else {
                        return false;
                    }
                };
            
        $scope.afterGuestCheckinCallback = function(response){
            console.info('response from guest check-in',response)
                $scope.$emit('hideLoader');
                
                var haveValidGuestEmail = $scope.guestEmailOnFile();//also sets the email to use for delivery
                var successfulCheckIn = (response.status === "success")? true : false;
                console.info('successfulCheckIn: ',successfulCheckIn);
                //detect if coming from email input
                if (haveValidGuestEmail && successfulCheckIn){
                        $state.go('zest_station.check_in_keys');
                    return;
                } else if (!successfulCheckIn) {
                    console.warn(response);
                    $scope.$emit('hideLoader');
                    $state.go('zest_station.error');
                    
                } else {//successful check-in but missing email on reservation
                    $state.go('zest_station.input_reservation_email_after_swipe');
                }
                
            };
        
        
        
        $scope.init = function(r){ 
           $scope.selectedReservation = $state.selectedReservation;
           
            var current=$state.current.name;
            if (current === 'zest_station.card_sign'){
                 $scope.signaturePluginOptions = {
                    height : 230,
                    width : $(window).width() - 120,
                    lineWidth : 1
                };
                $scope.at = 'cc-sign';
            } else {
                $scope.at = 'card-swipe';
            }
            $scope.show = {
                swipecardScreen: true
            };
            $scope.headingText = 'To Complete Check-in...';
            $scope.signatureData = "";
            $scope.initiateCardReader();
         //   $scope.refreshIframeWithGuestData($scope.selectedReservation); //used only for manual entry
        };
        



















        $scope.$on('SWIPE_ACTION',function(swipedCardData){
                var swipeOperationObj = new SwipeOperation();
                var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
                    
                var tokenizeSuccessCallback = function(tokenValue){
                  //  alert('token success: ',tokenValue);
                    $scope.$emit('hideLoader');
                        swipedCardData.token = tokenValue;
                        console.info('got token from sixpay swipe/chip');
                        console.info('swipedCardData, ',swipedCardData);
                        
                        //$scope.addNewPaymentModal(swipedCardData);
                        $scope.swippedCard = true;
                        $scope.saveCardDataFromSwipe(swipedCardData);
                };
                var failcb = function(response){
                    alert('failed to tokenize');
                };
                $scope.invokeApi(zsPaymentSrv.tokenize, getTokenFrom, tokenizeSuccessCallback, failcb);
        });
        
       $scope.saveCardDataFromSwipe = function(swipedCardData){
            //post to guest card/reservation then change screens
            //var obj = $scope.alertProps(swipedCardData.token);
            //alert(obj);
            $scope.goToCardSign();
       };
       $scope.alertProps = function(o){//to assist in debugging from ipad
           var propsNumber = Object.keys(o).length;
            var obj = "";
            for (var i = 0; i < propsNumber; i++){
                obj += '   |   ';
                obj += (Object.keys(o)[i]+' : '+o[Object.keys(o)[i]]);
            }
            return(obj);
       };


        //sixpay c&p or mli swipe
        $scope.successCallBackSwipe = function(data) {
          //  alert('swipe happened success');
            $scope.$broadcast('SWIPE_ACTION', data);
        };


        $scope.failureCallBackSwipe = function(errorMessage) {
           // alert('swipe happened fail');
           // alert('data.status: ',errorMessage);
            $scope.errorMessage = errorMessage;
           // if($rootScope.desktopSwipeEnabled){
                
            //}
        };

        var options = {};
        options["successCallBack"] = $scope.successCallBackSwipe;
        options["failureCallBack"] = $scope.failureCallBackSwipe;

        $scope.numberOfCordovaCalls = 0;
        
        var initiateDesktopCardReader = function(){
            //var listeningPort = $scope.zestStationData.hotel_settings.cc_swipe_listening_port;
            //zestSntApp.desktopCardReader.startDesktopReader(listeningPort, options);
        };
        $scope.cardReader = new CardOperation();

        $scope.initiateCardReader = function() {
            console.info('init card reader for sixpay');
            //if ((sntapp.browser === 'rv_native') && sntapp.cordovaLoaded) {
            if (true) {
              setTimeout(function() {
                  $scope.cardReader.startReader(options);
              }, 1500);
            } else {
                //If cordova not loaded in server, or page is not yet loaded completely
                //One second delay is set so that call will repeat in 1 sec delay
                if ($scope.numberOfCordovaCalls < 50) {
                    setTimeout(function() {
                        $scope.numberOfCordovaCalls = parseInt($scope.numberOfCordovaCalls) + parseInt(1);
                        $scope.initiateCardReader();
                    }, 2000);
                }
            }
        };

        /*
         * Start Card reader now!.
         */
        //alert('$scope.zestStationData.payment_gateway : '+$scope.zestStationData.payment_gateway)
        if ($scope.zestStationData.payment_gateway !== "sixpayments") {
        /* Enabling desktop Swipe if we access the app from desktop ( not from devices) and
         * desktopSwipeEnabled flag is true
         */
            if($scope.zestStationData.hotel_settings.allow_desktop_swipe && !zsPaymentSrv.checkDevice.any()){
                initiateDesktopCardReader();
            }
          else {
            //Time out is to call set Browser
                setTimeout(function() {
                  $scope.initiateCardReader();
                }, 2000);
            }
        }

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


var CardOperation = function(){
	// class for handling operations with payment device

	var that = this;
	// function for start reading from device
	// Note down: Currently it is recursive


	this.startReader = function(options){
		options['shouldCallRecursively'] = true;
		that.listenForSingleSwipe(options);
	};

	// function used to call cordova services
	this.callCordovaService = function(options){
		// cordova.exec function require success and error call back
		var successCallBack = options["successCallBack"] ? options["successCallBack"] : null;
		var failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : null;

		// if success call back require additional parameters
		var successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null;

		// if error call back require additional parameters
		var failureCallBackParameters =  options["failureCallBackParameters"] ? options["failureCallBackParameters"] : null;

		var service = options["service"] ? options["service"] : null;
		var action = options["action"] ? options["action"] : null;
		var arguments = options["arguments"] ? options["arguments"] : [];

		if(successCallBack === null){
			return false;
		}
		else if(failureCallBack === null){
			return false;
		}
		else if(service === null){
			return false;
		}
		else if(action === null){
			return false;
		}
		else{
                    if (cordova){
			//calling cordova service
			cordova.exec(
                        // if success call back require any parameters
                        function(data){
                                if(successCallBackParameters !== null){
                                        alert('card read success');
                                        successCallBack(data, successCallBackParameters);
                                        that.callRecursively(options);
                                }
                                else{
                                        alert('card read success!');
                                        console.info('reader data', data);
                                        successCallBack(data);
                                        that.callRecursively(options);
                                }

                        },
                        // if failure/error call back require any parameters
                        function(error){
                            alert('failed!')
                                if(failureCallBackParameters !== null){
                                        failureCallBack(error, failureCallBackParameters);
                                }
                                else{
                                        failureCallBack(error);
                                }

                                that.callRecursively(options);
                        },

                        // service name
                        service,
                        // function name
                        action,
                        // arguments to native
                        arguments
                    );
                    }
                }
	};

	this.callRecursively = function(options){
            setTimeout(function(){
                // TODO: Have to find better way of implementing this if not.
		var shouldCallRecursively = options["shouldCallRecursively"] ? options["shouldCallRecursively"] : false;
		if(shouldCallRecursively) {
                    that.callCordovaService(options);
		}
            },2000);
		
	};

	//function for get single swipe
	this.listenForSingleSwipe = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "observeForSwipe";
		that.callCordovaService(options);
	};

	// function for writing the key data
	this.writeKeyData = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "processKeyWriteOperation";
		that.callCordovaService(options);
	};

	// function for stop reading from device
	this.stopReader = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "cancelSwipeObservation";
		that.callCordovaService(options);

	};

	/**
	* method for stop/cancel writing operation
	*/
	this.cancelWriteOperation = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "cancelWriteOperation";
		that.callCordovaService(options);
	};
	/**
	* method To set the wrist band type- fixed amount/open room charge
	*/
	this.setBandType = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "setBandType";
		that.callCordovaService(options);
	};

	/**
	* method for checking the device connected status
	* will call success call back if it is fail or connected (bit confusing?)
	* success call back with data as false if disconnected
	* success call back with data as true if connected
	*/
	// function to check device status
	this.checkDeviceConnected = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "checkDeviceConnectionStatus";
		that.callCordovaService(options);
	};

	/*
	* method for retrieving the UID (Unique ID) from Card for Safe lock
	* will call the success call back with user id
	* if any error occured, will call the error call back
	*/
	this.retrieveUserID = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "getCLCardUID";
		that.callCordovaService(options);
	};
	


	/**
	* method for retrieving the UID (User ID) from Card for Safe lock
	* will call the success call back with user id
	* if any error occured, will call the error call back
	*/
	this.retrieveCardInfo = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "getCLCardInfo";
		that.callCordovaService(options);
	};


	//function for linking iBeacon
	this.linkiBeacon = function(options){
		options['service'] = "RVCardPlugin";
		options['action'] = "writeBeaconID";
		that.callCordovaService(options);
	};

};





var SwipeOperation = function(){
	var that = this;
	/*
	 * Function to create the token - Swipe.
	 * @param {obj} swipedCardData - initial swiped data to create token
	 */
	this.createDataToTokenize = function(swipedCardData){
                alert('createDataToTokenize')
			var ksn = swipedCardData.RVCardReadTrack2KSN;
      		if(swipedCardData.RVCardReadETBKSN !== "" && typeof swipedCardData.RVCardReadETBKSN !== "undefined"){
				ksn = swipedCardData.RVCardReadETBKSN;
			}
                        alert('ksn: [ '+ksn+' ]');
			var getTokenFrom = {
				'ksn': ksn,
				'pan': swipedCardData.RVCardReadMaskedPAN
			};
                        
                        alert('pan: [ '+getTokenFrom.pan+' ]');

			if(swipedCardData.RVCardReadTrack2!==''){
				getTokenFrom.et2 = swipedCardData.RVCardReadTrack2;
			} else if(swipedCardData.RVCardReadETB !==""){
				getTokenFrom.etb = swipedCardData.RVCardReadETB;
			}
                        
                        
                        alert('et2: [ '+getTokenFrom.et2+' ]');
                        alert('etb: [ '+getTokenFrom.etb+' ]');
                        
                        
			getTokenFrom.is_encrypted = true;
			if(swipedCardData.RVCardReadIsEncrypted === 0 || swipedCardData.RVCardReadIsEncrypted === '0'){
				getTokenFrom.is_encrypted = false;
			}
			return getTokenFrom;
	};
	/*
	 * Function to create the data to render in screens
	 */
	this.createSWipedDataToRender = function(swipedCardData){
            alert('createSWipedDataToRender')
		var swipedCardDataToRender = {
			"cardType": swipedCardData.RVCardReadCardType,
			"cardNumber": "xxxx-xxxx-xxxx-" + swipedCardData.token.slice(-4),
			"nameOnCard": swipedCardData.RVCardReadCardName,
			"cardExpiry": swipedCardData.RVCardReadExpDate,
			"cardExpiryMonth": swipedCardData.RVCardReadExpDate.slice(-2),
			"cardExpiryYear": swipedCardData.RVCardReadExpDate.substring(0, 2),
			"et2": swipedCardData.RVCardReadTrack2,
			'ksn': swipedCardData.RVCardReadTrack2KSN,
			'pan': swipedCardData.RVCardReadMaskedPAN,
			'etb': swipedCardData.RVCardReadETB,
			'swipeFrom': swipedCardData.swipeFrom,
			'token': swipedCardData.token
		};

		return swipedCardDataToRender;
	};
	/*
	 * Function to create the data to save which is passed to API
	 */
	this.createSWipedDataToSave = function(swipedCardData){
            alert('createSWipedDataToSave')
		var swipedCardDataToSave = {
			"cardType": swipedCardData.cardType,
			"et2": swipedCardData.et2,
			"ksn": swipedCardData.ksn,
			"pan": swipedCardData.pan,
			"mli_token": swipedCardData.token,
			"payment_type": "CC",
			"cardExpiryMonth": swipedCardData.cardExpiryMonth,
			"cardExpiryYear": swipedCardData.cardExpiryYear,
			"cardNumber": swipedCardData.cardNumber
		};
		return swipedCardDataToSave;
	};



};