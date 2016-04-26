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
                if ($state.showDeposit){
                    $state.go ('zest_station.deposit_agree');
                } else {
                    $state.go ('zest_station.card_swipe');
                }
            } else if(current === 'zest_station.card_swipe'){
                $state.go ('zest_station.terms_conditions');
            } else if(current === 'zest_station.deposit_agree'){
                $state.go ('zest_station.terms_conditions');
            }
            
            
            
            
	});

	$scope.clickedOnBackButton = function() {
		$scope.$broadcast (zsEventConstants.CLICKED_ON_BACK_BUTTON);
	};

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
                var checkinParams = {
                     'reservation_id':reservation_id, 
                     'workstation_id':$state.workstation_id, 
                     "authorize_credit_card": false,
                     "do_not_cc_auth": false,
                     "is_promotions_and_email_set": false,
                     "no_post": "",
                     "is_kiosk":true,
                     'signature':signature
                 };
                  $scope.afterGuestCheckinCallback({'status':'success'});
                // setTimeout(function(){
                //     $scope.invokeApi(zsTabletSrv.checkInGuest, checkinParams, $scope.afterGuestCheckinCallback, $scope.afterGuestCheckinCallback); 
                // },500);
                
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
        
	var MLISessionId = "";
	try {
                HostedForm.setMerchant($scope.zestStationData.MLImerchantId);
        }
        catch(err) {
            console.warn('mli set session err: ',err);
        };
        
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
                 credit_card: data.RVCardReadCardType,
                 card_name: $scope.sixpay_data.card_holder_name,
                 payment_type: "CC",
                 reservation_id: reservationId,
                 mli_token: $scope.sixpay_data.token_no
             };
             
             /*
              var data = {
                    "is_promotions_and_email_set" : $scope.saveData.promotions,
                    "signature" : signatureData,
                    "reservation_id" : $scope.reservationBillData.reservation_id,
                    "payment_type": "CC",
                    "mli_token": swipedTrackDataForCheckin.token,
                    "et2": swipedTrackDataForCheckin.RVCardReadTrack2,
                    "etb": swipedTrackDataForCheckin.RVCardReadETB,
                    "ksn": swipedTrackDataForCheckin.RVCardReadTrack2KSN,
                    "pan": swipedTrackDataForCheckin.RVCardReadMaskedPAN,
                    "card_name": swipedTrackDataForCheckin.RVCardReadCardName,
                    "name_on_card": swipedTrackDataForCheckin.RVCardReadCardName,
                    "card_expiry": cardExpiry,
                    "credit_card" : swipedTrackDataForCheckin.RVCardReadCardType,
                    "do_not_cc_auth" : true,
                    "no_post" : ($scope.reservationBillData.roomChargeEnabled === "") ? "": !$scope.reservationBillData.roomChargeEnabled,
                    "add_to_guest_card" : addToGuest
            };*/
             
             
             
        };
        
        $scope.getMLISession = function(){
                this.MLIOperator = new MLIOperation();
                $scope.saveSwipedCardMLI();
        }
        
        
        
        
        $scope.successSavePayment = function(response){
            if (response.status === 'success'){
                $scope.$emit('hideLoader');
                $scope.goToCardSign();
            } else {
                $scope.failSavePayment(response);
            }
        };
        $scope.failSavePayment = function(response){
            $scope.$emit('hideLoader');
            console.warn(response);
            $state.go('zest_station.error');
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
            $scope.iFrameUrl = '';
            var absoluteUrl = $location.$$absUrl;
            domainUrl = absoluteUrl.split("/zest_station#/")[0];
            var time = new Date().getTime();
            var firstName = guestData.guest_details[0].first_name;
            var lastName = guestData.guest_details[0].last_name;
            $scope.iFrameUrl = domainUrl + "/api/ipage/index.html?card_holder_first_name=" +firstName + "&card_holder_last_name=" + lastName + "&service_action=createtoken&time="+time;
            
            setTimeout(function(){
                /////on slow networks this iframe may be an issue, we can attempt to do some re-try actions looking for the .src of the iframe
                    //need more testing on this (simulated slow networks)
                    var iFrame = {};
                    iFrame.src = document.getElementById('sixIframe').src;
                    iFrame.src = $scope.iFrameUrl;
                    $scope.sixPaymentSwipe();
            },800);
        };
        
        $scope.shouldShowWaiting = false;
        $scope.pageloadingOver = false;
        $scope.inProd = function(){
            var notProd = false;
            var url = true ? document.location : window.location;
            if (url.hostname){
                if (typeof url.hostname === typeof 'str'){
                    if (url.hostname.indexOf('pms-dev') !==-1 || 
                        url.hostname.indexOf('pms-release') !==-1 || 
                        url.hostname.indexOf('192.168.1.218') !==-1 || 
                        url.hostname.indexOf('localhost') !==-1){
                        notProd = true;
                    }
                }
            }
            if (!notProd){//in production, dont allow this function
                return true;
            } else return false;
        };
        $scope.simulateSixPay = function(){
            var inProduction = $scope.inProd();
            if (inProduction){
                return;
            }
            $scope.$emit('showLoader');
            $scope.isSimulated = true;
            $scope.shouldShowWaiting = true;
            $scope.pageloadingOver = true;
                $scope.shouldShowWaiting = false;
                $scope.pageloadingOver = false;
                
                setTimeout(function(){
                    $scope.$emit('hideLoader');
                    if ($state.showDeposit){
                        $scope.payDeposit();
                    } else {
                        $scope.goToCardSign();
                    }
                    
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
                    if (useEmail !== '' && zsUtilitySrv.isValidEmail(useEmail)&&!$scope.selectedReservation.guest_details[0].is_email_blacklisted){
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
                        $state.go('zest_station.check_in_keys',{'mode':zsModeConstants.CHECKIN_MODE});
                    return;
                } else if (!successfulCheckIn) {
                    console.warn(response);
                    $scope.$emit('hideLoader');
                    $state.go('zest_station.error');
                    
                } else {//successful check-in but missing email on reservation
                    $state.go('zest_station.input_reservation_email_after_swipe');
                }
                
            };
        
        $scope.failDeposit = function(response){
            console.warn(response);
            $state.go('zest_station.error');
            $scope.$emit('hideLoader');
        };
        $scope.successDeposit = function(response){
            console.info(response);
            if ($scope.isSixPayPayment() || $scope.isSimulated){
                console.info('init sixpay payment!')
                $scope.initSixPaySuccess(response);
            }
            $scope.$emit('hideLoader');
        };
        $scope.payDeposit = function(){
            $scope.$emit('showLoader');
             var reservation_id = $scope.selectedReservation.id,
                    //payment_type = $scope.selectedReservation.payment_type,
                    depositAmount = $scope.selectedReservation.reservation_details.data.reservation_card.deposit_amount;
                var params = {
                    'reservation_id':reservation_id, 
                    'add_to_guest_card': false,
                    'amount': depositAmount,
                    'bill_number': 1,
                    'payment_type': "CC",
                    'payment_type_id': $scope.selectedReservation.reservation_details.data.reservation_card.payment_type
                 };
                setTimeout(function(){
                    $scope.invokeApi(zsPaymentSrv.submitDeposit, params, $scope.successDeposit,$scope.failDeposit); 
                },500);
        };
        $scope.depositProceed = function(){
            $state.go('zest_station.card_swipe'); 
        };
        
        
        
        $scope.initStaff = function(){
            $state.go('zest_station.speak_to_staff');
        };
        $scope.depositAmountValue = '';
        $scope.init = function(r){ 
           $scope.selectedReservation = $state.selectedReservation;
           
            var current=$state.current.name;
            if (current === 'zest_station.card_sign'){
                
                $scope.$emit('hideLoader');
                 $scope.signaturePluginOptions = {
                    height : 230,
                    width : $(window).width() - 120,
                    lineWidth : 1
                };
                $scope.at = 'cc-sign';
            } else if (current === 'zest_station.deposit_agree'){
                $scope.at = 'deposit-agree';
                $scope.headingText = 'DEPOSIT_REMAIN';
                $scope.subHeadingText = 'DEPOSIT_REMAIN_SUB ';
                $scope.depositAmountValue = $scope.zestStationData.currencySymbol+$state.selectedReservation.reservation_details.data.reservation_card.deposit_amount;
                $scope.subsubheadingText = 'DEPOSIT_REMAIN_SUB_SUB';
            } else {
                $scope.at = 'card-swipe';
            }
            
            $state.from = $scope.at;
            $scope.show = {
                swipecardScreen: true
            };
            if (current !== 'zest_station.deposit_agree'){
                $scope.headingText = 'TO_COMPLETE';
            }
            $scope.signatureData = "";
            
            $scope.initCardReaders();
            
         //   $scope.refreshIframeWithGuestData($scope.selectedReservation); //used only for manual entry
        };
        
        $scope.initCardReaders = function(){
            console.log('$scope.zestStationData.payment_gateway: ',$scope.zestStationData.payment_gateway);
            if ($scope.zestStationData.payment_gateway === "sixpayments") {
                $scope.initiateCardReader();//sixpay
            } else {
                console.info(':: Not Sixpay ::');
            }
        };
        
        $scope.token = '';
        $scope.swipeData;
        $scope.$on('SWIPE_ACTION',function(evt, swipedCardData){
            console.info('swipedCardData: ');
            console.info(swipedCardData)
                var swipeOperationObj = new SwipeOperation();
                $scope.swipeData = JSON.parse(swipedCardData);
                
                var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
                    
                    var cb = function(response){
                        if (response && response.status !== 'failure'){
                            $scope.$emit('hideLoader');
                            console.info('general callback');
                            console.info(response);
                            $scope.token = response.data;
                            $scope.swipeData.token = response.data;
                            tokenizeSuccessCallback();
                        } else {
                            failcb(response);
                        }
                    };
                    
                    var tokenizeSuccessCallback = function(){
                        $scope.$emit('hideLoader');
                        $scope.swippedCard = true;
                        
                        $scope.getMLISession();
                    };
                var failcb = function(response){
                    $scope.$emit('hideLoader');
                    console.warn('failed to get token from MLI');
                };
                $scope.invokeApi(zsPaymentSrv.tokenize, getTokenFrom, cb);
        });
        
        
        $scope.getCardDataToSave = function(swipedTrackDataForCheckin){
            var cardExpiry = "20"+swipedTrackDataForCheckin.RVCardReadExpDate.substring(0, 2)+"-"+swipedTrackDataForCheckin.RVCardReadExpDate.slice(-2)+"-01";
            var data = {
                    "is_promotions_and_email_set" : $scope.saveData.promotions,
                    "signature" : signatureData,
                    "reservation_id" : $scope.reservationBillData.reservation_id,
                    "payment_type": "CC",
                    "mli_token": swipedTrackDataForCheckin.token,
                    "et2": swipedTrackDataForCheckin.RVCardReadTrack2,
                    "etb": swipedTrackDataForCheckin.RVCardReadETB,
                    "ksn": swipedTrackDataForCheckin.RVCardReadTrack2KSN,
                    "pan": swipedTrackDataForCheckin.RVCardReadMaskedPAN,
                    "card_name": swipedTrackDataForCheckin.RVCardReadCardName,
                    "name_on_card": swipedTrackDataForCheckin.RVCardReadCardName,
                    "card_expiry": cardExpiry,
                    "credit_card" : swipedTrackDataForCheckin.RVCardReadCardType,
                    "do_not_cc_auth" : true,
                    "no_post" : ($scope.reservationBillData.roomChargeEnabled === "") ? "": !$scope.reservationBillData.roomChargeEnabled,
                    "add_to_guest_card" : true
            };
            //CICO-12554 indicator if the track data is encrypted or not
            data.is_encrypted = true;
            if(swipedTrackDataForCheckin.RVCardReadIsEncrypted === 0 || swipedTrackDataForCheckin.RVCardReadIsEncrypted === '0'){
                    data.is_encrypted = false;
                    data.card_number = swipedTrackDataForCheckin.RVCardReadPAN;
            }
            //CICO-12554 Adding the KSN conditionally
            data.ksn = swipedTrackDataForCheckin.RVCardReadTrack2KSN;
            
            if(swipedTrackDataForCheckin.RVCardReadETBKSN !== "" && typeof swipedTrackDataForCheckin.RVCardReadETBKSN !== "undefined"){
                    data.ksn = swipedTrackDataForCheckin.RVCardReadETBKSN;
            }
            return data;
        }
        
        $scope.createSWipedDataToRender = function(swipedCardData){
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
        
        $scope.saveSwipedCardMLI = function(data){
            if (!data){
                data = $scope.swipeData;
                console.log(data)
            }
            var cardCode = data.RVCardReadCardType;
            //save the payment to guest card/reservation
            var reservationId = $scope.selectedReservation.id;
            var expirYear = '20'+data.RVCardReadExpDate.substring(0, 2);
            var expirMonth = data.RVCardReadExpDate.substring(2, 4);
            
            var postData = {
                 add_to_guest_card: true,
                 card_code: cardCode,
                 card_type: cardCode,
                 card_expiry: expirYear+'-01-'+expirMonth,
                 card_name: data.RVCardReadCardName,
                 payment_type: "CC",
                 reservation_id: reservationId,
                 expirMonth: expirMonth,
                 expirYear: expirYear,
                 card_number: "xxxx-xxxx-xxxx-" + data.token.slice(-4),
                 token: data.token
             };
             
             
             
			 var sessionDetails = {};
			 sessionDetails.cardNumber = postData.card_number;
			 //sessionDetails.cardSecurityCode = $scope.postData.cvv;
			 sessionDetails.cardExpiryMonth = $scope.expirMonth;
			 sessionDetails.cardExpiryYear = $scope.expirYear;

			 var callback = function(response){
                             console.info(response);
			 	$scope.$emit("hideLoader");

			 	if(response.status ==="ok"){
                                    MLISessionId = response.session;
                                    postData.session_id = MLISessionId;
                                    console.info('sessionId: ',postData);
                                    $scope.invokeApi(zsPaymentSrv.savePayment, postData, $scope.successSavePayment, $scope.failSavePayment); 
			 	}
			 	else{
                                    console.warn('there was a problem with the card');
			 	}
			 };

			try {
                            console.info('trying updatesession')
			    HostedForm.updateSession(sessionDetails, callback);
			    $scope.$emit("showLoader");  
			}
			catch(err) {
                            console.warn(err);
			};
             
             
        };
        
       $scope.saveCardDataFromSwipe = function(){
           console.log('saveCardDataFromSwipe: ',$scope.swipeData);
          
           var swipedCardDataToSave = $scope.createSWipedDataToRender($scope.swipeData);
           console.log(swipedCardDataToSave);
           $scope.saveSwipedCardMLI(swipedCardDataToSave);//onsuccess proceeds to signature
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

    $scope.serviceStarted = false;
    $scope.initWsSwipe = function(){
        
        $scope.serviceStarted = true;
        var config = {
          "swipeService":"wss://localhost:4649/CCSwipeService"   ,
          "connected_alert":"[ WebSocket Connected ]. Warning : Clicking on Connect multipple times will create multipple connections to the server",
          "close_alert":"Socket Server is no longer connected.",
          "swipe_alert":"Please swipe.",
          "connect_delay":1000//ms after opening the app, which will then attempt to connect to the service, should only be a second or two
        };
    
	var ws;
	function observe() {
	    ws.send("{\"Command\" : \"cmd_observe_for_swipe\"}");
	}
	function connect() {
            ws = new WebSocket(config['swipeService']);
	    //Triggers when websocket connection is established.
            ws.onopen = function () {
                console.log(':: WS Connected :: ');
		//alert(config['connected_alert']);
            };
            
	    // Triggers when there is a message from websocket server.
	    ws.onmessage = function (evt) {
                if (evt){
                    var received_msg = evt.data;
                    console.info(':: WS Received MSG :: ',received_msg);

                    $scope.$emit('SWIPE_ACTION',received_msg);
                    ws.close();
                    $scope.goToCardSign();
                } else {
                    $scope.$emit('hideLoader');
                    $state.go('zest_station.swipe_pay_error');
                    $scope.shouldShowWaiting = false;
                }
            };

	    // Triggers when the server is down.
            ws.onclose = function () {
                console.log(':: WS Disconnected :: ');
            };
            return ws;
        };
        setTimeout(function(){
            connect();    
        },config['connect_delay']);
        
            
        setTimeout(function(){
            observe();    
        },5000);
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

        $scope.initiateCardReader = function() {
            console.info('init card reader for sixpay');
            //if ((sntapp.browser === 'rv_native') && sntapp.cordovaLoaded) {
            if (true) {//debugging ?
              setTimeout(function() {
                  console.warn('start card reader');
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
        
        $scope.setInitSwipeSettings = function(){
            console.info('Attempting to connec to Card Readers');
                if ($scope.zestStationData.payment_gateway !== "sixpayments") {
                /* Enabling desktop Swipe if we access the app from desktop ( not from devices) and
                 * desktopSwipeEnabled flag is true
                 */
                console.info('WS Startup');
                    $scope.initWsSwipe();

                    if($scope.zestStationData.hotel_settings.allow_desktop_swipe && !zsPaymentSrv.checkDevice.any()){
                        initiateDesktopCardReader();
                    } else {
                        //Time out is to call set Browser
                          setTimeout(function() {
                            $scope.initiateCardReader();
                          }, 2000);
                      }
                } else {
                    console.warn('refresh iframe with: ',$state.selectedReservation);
                    $scope.refreshIframeWithGuestData($state.selectedReservation);
                }
        };
        $scope.fetchDoorLockSettings = function(){
            var onResponse = function(response){
                console.info(response);
                if (response.enable_remote_encoding !== typeof undefined){
                    $scope.enable_remote_encoding = response.enable_remote_encoding;
                    //$scope.enable_remote_encoding = false;
                }
                $scope.setInitSwipeSettings();
            };
            
            
          $scope.callAPI(zsTabletSrv.getDoorLockSettings, {
                params: {},
                'successCallBack':onResponse,
                'failureCallBack':onResponse
            });  
        };
        $scope.fetchDoorLockSettings();
        
        
	 $scope.sixPaymentSwipe = function(){
		var data = {};
                    
                    data.amount = $state.selectedReservation.reservation_details.balance;
                    data.reservation_id = $state.selectedReservation.id;
                    data.guest_id = $state.selectedReservation.guest_details[0].id;
                    //data.add_to_guest_card = true;
                    //data.guest_id = $state.selectedReservation.guest_details[0].id;
                    data.is_emv_request = true;
                    data.payment_type = "CC";
                    
                data.emv_terminal_id = $state.emv_terminal_id;
                console.log('listening for C&P or swipe...');
		$scope.shouldShowWaiting = true;
		zsPaymentSrv.chipAndPinGetToken(data).then(function(response) {
                        console.info('success: ',response);
			$scope.shouldShowWaiting = false;
			successSixSwipe(response);
		},function(error){
                        console.info('FAILED: ',error);
                        $scope.$emit('hideLoader');
			$scope.errorMessage = error;
                        $state.swipe_error_msg = error;
                        $state.go('zest_station.swipe_pay_error');
			$scope.shouldShowWaiting = false;
		});
	};
        
	var successSixSwipe = function(response){
                if ($state.showDeposit){
                    $scope.payDeposit(response);
                } else {
                    $scope.initSixPaySuccess(response);
                }
            

	};
        $scope.initSixPaySuccess = function(response){
		$scope.$emit("hideLoader");
                $scope.goToCardSign();

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
                                        successCallBack(data, successCallBackParameters);
                                        that.callRecursively(options);
                                }
                                else{
                                        successCallBack(data);
                                        that.callRecursively(options);
                                }

                        },
                        // if failure/error call back require any parameters
                        function(error){
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
            if (typeof swipedCardData === typeof 'str'){
                swipedCardData = JSON.parse(swipedCardData);
            }
			var ksn = swipedCardData.RVCardReadTrack2KSN;
                        if(swipedCardData.RVCardReadETBKSN !== "" && typeof swipedCardData.RVCardReadETBKSN !== "undefined"){
				ksn = swipedCardData.RVCardReadETBKSN;
			}
			var getTokenFrom = {
				'ksn': ksn,
				'pan': swipedCardData.RVCardReadMaskedPAN
			};
                        
			if(swipedCardData.RVCardReadTrack2!==''){
				getTokenFrom.et2 = swipedCardData.RVCardReadTrack2;
			} else if(swipedCardData.RVCardReadETB !==""){
				getTokenFrom.etb = swipedCardData.RVCardReadETB;
			}
                        
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