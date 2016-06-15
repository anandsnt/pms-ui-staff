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
               /**
                * for testing purpsosed commenting out
                *  need to revert back
                */
                //$scope.afterGuestCheckinCallback({'status':'success'});
                setTimeout(function(){
                    $scope.invokeApi(zsTabletSrv.checkInGuest, checkinParams, $scope.afterGuestCheckinCallback, $scope.afterGuestCheckinCallback); 
                },500);
        };
        $scope.clearSignature = function(){
            $scope.signatureData = '';
            $("#signature").jSignature("clear");
        };
        
        
	var MLISessionId = "";
	try {
                HostedForm.setMerchant($scope.zestStationData.MLImerchantId);
        }
        catch(err) {
            console.warn('mli set session err: ',err);
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
            console.info('inProduction: ',inProduction);
            if (inProduction){
                $scope.isSimulated = false;
                return;
            }
            $scope.$emit('showLoader');
            $scope.isSimulated = true;
                
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
            console.info('response from guest check-in : response :',response)
                $scope.$emit('hideLoader');       
                var haveValidGuestEmail = $scope.guestEmailOnFile();//also sets the email to use for delivery
                
                var successfulCheckIn;
//                var debugCheckinResponse = JSON.parse('{"status":"success","data":{"check_in_status":"Success","cc_auth_amount":"0.00","cc_auth_code":null},"errors":[],"is_eod_in_progress":false,"is_eod_manual_started":false}');
  //              console.info('debugCheckinResponse: ',debugCheckinResponse);
                
                console.info('check-in failure test: response.status :',response.status);
                if (response.status === "success"){
                    successfulCheckIn = true;
                } else {
                    successfulCheckIn = false;
                }
                console.info('successfulCheckIn: ',successfulCheckIn);
                
                //detect if coming from email input
                
                if (haveValidGuestEmail && successfulCheckIn){
                    console.info('haveValidGuestEmail && successfulCheckIn: ');
                        $state.go('zest_station.check_in_keys',{'mode':zsModeConstants.CHECKIN_MODE});
                    return;
                    
                } else if (!successfulCheckIn) {
                    
                    console.info('!successfulCheckIn: ');
                    console.warn(response);
                    $scope.$emit('hideLoader');
                    $state.go('zest_station.error');
                    
                } else {//successful check-in but missing email on reservation
                    
                    console.info('input_reservation_email_after_swipe: ');
                    $state.go('zest_station.input_reservation_email_after_swipe');
                }
                
            };
        
        $scope.failDeposit = function(response){
            console.warn(response);
            $state.go('zest_station.error');
            $scope.$emit('hideLoader');
        };
        var onSuccessDeposit = function(response){
            console.info('onsuccess deposit: ',response);
                //saving payment success, continue...
                if ($scope.isSixPayPayment() || $scope.isSimulated){
                    needCCAuthForCheckin();
                }
        };
        $scope.successDeposit = function(response){
            $state.paidDeposit = true;
            if ($scope.inDemoMode()){
                onSuccessDeposit();
                        
            } else {
                console.info('success deposit (payment): ',response);
                var postData = getCardSaveData(response);
                console.info("saving payment",postData);
            
                $scope.invokeApi(zsPaymentSrv.savePayment, postData, onSuccessDeposit, $scope.failSavePayment, "NONE"); 
            }
            $scope.$emit('hideLoader');
        };
        $scope.payDeposit = function(){
            console.info('$state.paidDeposit: ',$state.paidDeposit)
            if ($state.paidDeposit){
                needCCAuthForCheckin();
            } else {
                console.info("paying deposit");
                $scope.$emit('hideLoader');
                
                 var reservation_id = $scope.selectedReservation.id,
                        //payment_type = $scope.selectedReservation.payment_type,
                        depositAmount = $scope.selectedReservation.reservation_details.data.reservation_card.deposit_amount;

                    var params = {
                        'is_emv_request': true,//the current session workstation emv terminal (from setWorkstation) will be used
                        'reservation_id':reservation_id, 
                        'add_to_guest_card': false,
                        'amount': depositAmount,
                        'bill_number': 1,
                        'payment_type': "CC",
                        'payment_type_id': $scope.selectedReservation.reservation_details.data.reservation_card.payment_type
                     };
                     console.info(params);
                     if ($scope.inDemoMode()){
                        $scope.successDeposit();
                        
                    } else {
                        setTimeout(function(){
                            $scope.invokeApi(zsPaymentSrv.submitDeposit, params, $scope.successDeposit, reTryCardSwipe, "NONE"); //dont show loader using "NONE"
                        },500);
                    }
            };
        };
        
        
        var reTryCardSwipe = function(response){
            var current = $state.current.name;
            $scope.$emit('hideLoader');
            if (current !== 'zest_station.card_sign'){
                console.warn('submit payment failed: ',response);
                
                $state.go('zest_station.swipe_pay_error');
            }
        };
        $scope.depositProceed = function(){
            console.info('clicked deposit proceed, go to card swipe');
            $state.go('zest_station.card_swipe'); 
        };
        $scope.skipForLocal = function(){
            $state.go('zest_station.card_sign'); 
        };
        
        
        
        $scope.initStaff = function(){
            $state.go('zest_station.speak_to_staff');
        };
        $scope.depositAmountValue = '';
        var initCardSwipeScreen = function(){
                $scope.at = 'card-swipe';
                $scope.setInitSwipeSettings();
                $scope.initCardReaders();
                if ($scope.inDemoMode()){
                    setTimeout(function(){
                        $scope.goToCardSign();    
                    },3000);
                }
                setTimeout(function(){
                    try{
                        $scope.$digest();
                    }catch(er){
                        
                    }
                },200);
        };
        var initDepositScreen = function(){
            console.info('init deposit screen');
                $scope.at = 'deposit-agree';
                $scope.headingText = 'DEPOSIT_REMAIN';
                $scope.subHeadingText = 'DEPOSIT_REMAIN_SUB ';
                $scope.depositAmountValue = $scope.zestStationData.currencySymbol+$state.selectedReservation.reservation_details.data.reservation_card.deposit_amount;
                $scope.subsubheadingText = 'DEPOSIT_REMAIN_SUB_SUB';
        }
        var initCardSignScreen = function(){
                $scope.$emit('hideLoader');
                 $scope.signaturePluginOptions = {
                    height : 230,
                    width : $(window).width() - 120,
                    lineWidth : 1
                };
                $scope.at = 'cc-sign';
        }
        var resetSignature = function(){
            $scope.signatureData = "";
        }
        $scope.init = function(r){ 
            var debugging = false;
            $scope.selectedReservation = $state.selectedReservation;
           
            var current=$state.current.name;
            console.log('current: ',current)
            
            if (current === 'zest_station.card_sign'){
                initCardSignScreen();
                
            } else if (current === 'zest_station.deposit_agree'){
                initDepositScreen();
                
            } else {
                if (debugging){
                    initCardSignScreen();
                } else {
                    initCardSwipeScreen();
                }
                
            }
            
            
            $state.from = $scope.at;
            if (current !== 'zest_station.deposit_agree'){
                console.info('current: ',current);
                $scope.headingText = 'RES_AUTH_DEPOSIT';
                $scope.subHeadingText = 'RES_AUTH_DEPOSIT_SUB';
            }
            resetSignature();
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
        
        
        var getCardSaveData = function(data){
            console.log('getCardSaveData data: ',data);
            var expirYear, expirMonth;
            if (!data.expiry_date && data.payment_method.expiry_date){
                //check if settings inside payment_method or not
                //this is different per sixpay response for the card type
                data = data.payment_method;
            } 
            
            expirYear = '20'+data.expiry_date.split('/')[0];
            expirMonth = data.expiry_date.split('/')[1];
            
            var postData = {
                 card_code: data.card_type.toLowerCase(),
                 card_type: data.card_type,
                 card_expiry: data.expirYear,
                 payment_type: "CC",
                 reservation_id: $scope.selectedReservation.id,
                 expirMonth: expirMonth,
                 expirYear: expirYear,
                 card_number: "xxxx-xxxx-xxxx-" + data.token.slice(-4),
                 token: data.token
             };
             return postData;
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
                    
            var current = $state.current.name;
            $scope.$emit('hideLoader');
                if (current !== 'zest_station.card_sign'){
                        $state.go('zest_station.swipe_pay_error');
                }
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
            if ($scope.inDemoMode()){
                return;
            }
            setTimeout(function(){
                    try{
                        $scope.$digest();
                    }catch(er){
                        
                    }
                },200);
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
                    console.log('::init sixpay C&P reader::');
                    if (!$scope.zestStationData.waitingForSwipe){
                        console.info('reader available, please swipe');
                        /*
                         * if collecting deposit, make payment (submit payment) - which will collect CC, run auth, then submit payment
                         * 
                         * if not collecting deposit, just collect the CC using cc_auth, then continue;
                         * 
                         */
                        console.info('checking here...',$state.showDeposit)
                        if ($state.showDeposit && !$state.paidDeposit){
                           $scope.payDeposit();
                       } else {
                            $scope.sixPaymentSwipe();//calls get_token.json, to capture card info from sixpay C&P device
                           
                       }
                     
                    } else {
                        console.log('waiting for reader to complete previous swipe request');
                    }
                }
        };
        
        
	 $scope.sixPaymentSwipe = function(){
             var debugging = false;
             if (debugging){
                 continueToSign();
             } else {
		var data = {};
                    //data.amount = $state.selectedReservation.reservation_details.balance;
                    console.info('**********$state.showDeposit: ',$state.showDeposit)
                    if ($state.showDeposit && !$state.paidDeposit){
                        data.amount = $scope.selectedReservation.reservation_details.data.reservation_card.deposit_amount;
                    } else {
                        //this will check if authorization is required and send the amount to terminal
                        //will update this in new codebase
                        needCCAuthForCheckin();
                        return;
                    }
                    
                    data.reservation_id = $state.selectedReservation.id;
                    data.is_emv_request = true;
                    
                    console.log('listening for C&P or swipe...');
                
                var successAuthorizeCC = function(response){
                        $scope.$emit('hideLoader');
                        console.info('successAuthorizeCC response: ',response);
			successSixSwipe(response);
		};
                var onFailureAuthorizeCC = function(error){
                        console.warn('FAILED authorize cc: ',error);
                        $scope.$emit('hideLoader');
			$scope.errorMessage = error;
                        $state.swipe_error_msg = error;
                        
                        var current = $state.current.name;
                        if (current !== 'zest_station.card_sign'){
                                $state.go('zest_station.swipe_pay_error');
                        }
                
		};
                console.log('authorizeCC @ sixPaymentSwipe: ',$scope, ' :: data, ',data)
                if ($scope.inDemoMode()){
                    successAuthorizeCC();
                } else {
                    $scope.invokeApi(zsPaymentSrv.authorizeCC, data, successAuthorizeCC, onFailureAuthorizeCC, "NONE"); 
                }
            };
	};
        
	var successSixSwipe = function(response){
                if ($state.showDeposit){
                    $scope.payDeposit();
                } else {
                    needCCAuthForCheckin();
                }
	};
        
        
        
        var captureAuthorization = function(amount, isEmv){
            if ($scope.inDemoMode()){
                continueToSign();
            } else {
            console.info(': captureAuthorization : ',amount)
            var data = {};
                if (amount > 0){
                    data.amount = amount;
                } else {
                    data.amount = "1.00";
                }
                data.reservation_id = $state.selectedReservation.id;
                data.is_emv_request = isEmv;
                console.info('sending: ',data);
                
            var onSuccessCaptureAuth = function(response){
                console.info('onSuccessCaptureAuth @ captureAuthorization',response)
                    continueToSign();
            }
            
            if ($state.paidDeposit){
                $scope.headingText = 'RES_AUTH_REMAIN';
                $scope.subHeadingText = 'RES_AUTH_REMAIN_SUB ';
            } else {
                $scope.headingText = 'RES_AUTH';
                $scope.subHeadingText = 'RES_AUTH_SUB ';
            }
            
            
            setTimeout(function(){
                    try{
                        $scope.$digest();
                    }catch(er){
                        
                    }
                },200);
                
                console.log('authorizeCC @ captureAuthorization: ',$scope, ' :: data, ',data);
            $scope.invokeApi(zsPaymentSrv.authorizeCC, data, onSuccessCaptureAuth, onSwipeError, "NONE"); 
        }
        }
        
        var onSwipeError = function(error){
                console.info('FAILED: ',error);
                $scope.$emit('hideLoader');
                $scope.errorMessage = error;
                $state.swipe_error_msg = error;
                var current = $state.current.name;
                if (current !== 'zest_station.card_sign'){
                    $state.go('zest_station.swipe_pay_error');
                }
                
        }
        
        var fetchAuthorizationAmountDue = function(){
            
            var params = {
                'id':$scope.selectedReservation.id,
                'by_reservation_id': true
            };
            var onSuccessFetchAuthorizationAmountDue = function(response){
                console.info('refetched details: ',response);
               setTimeout(function(){
                    try{
                        $scope.$digest();
                    }catch(er){
                        
                    }
                },200);
                var amount = response.data.reservation_card.pre_auth_amount_at_checkin,
                    needToAuthorizeAtCheckin = response.data.reservation_card.authorize_cc_at_checkin;
                console.info('response: ',response);
                
                if (needToAuthorizeAtCheckin){
                        captureAuthorization(amount, true);
                } else {
                    continueToSign();
                }
                
            }
            if ($scope.inDemoMode()){
                continueToSign();
            } else {
                $scope.invokeApi(zsTabletSrv.fetchReservationDetails, params, onSuccessFetchAuthorizationAmountDue, onSwipeError, "NONE");
            }
            
            //captureAuthorization
        };
        
        var getCCAuthorization = function(needToAuthorizeAtCheckin, amount, isEmv){
            console.info('getCCAuthorization: ',arguments);
            
            if ($state.paidDeposit){
                console.info('$state.paidDeposit: ',$state.paidDeposit)
                fetchAuthorizationAmountDue();
            } else {
                //if deposit was captured, we have the card on file,
                //if authorization is required still (due to settings), 
                //we will again prompt for the card, but for the authorization amount


                //if no deposit was captured, and we do not need to authorize at checkin,
                //then we still need to capture the card, sending a $1.00 amount to the emv terminal

                //true + true
                if($state.showDeposit && needToAuthorizeAtCheckin) {
                    captureAuthorization(amount, isEmv);
                } 
                //true + false
                else if($state.showDeposit && !needToAuthorizeAtCheckin) {
                    continueToSign();
                }
                //false + true
                else if (!$state.showDeposit && needToAuthorizeAtCheckin){
                    captureAuthorization(amount, isEmv);
                }
                //false + false
                else if (!$state.showDeposit && !needToAuthorizeAtCheckin){
                    amount = 0;
                    captureAuthorization(amount, isEmv);
                } 
            } 
            
        }
        
        var needCCAuthForCheckin = function(){
            var needToAuthorizeAtCheckin = $scope.selectedReservation.reservation_details.data.reservation_card.authorize_cc_at_checkin,
                    authCCAmount = $scope.selectedReservation.reservation_details.data.reservation_card.pre_auth_amount_at_checkin;
            
                getCCAuthorization(needToAuthorizeAtCheckin, authCCAmount, true);
        };
        
        var continueToSign = function(){
            $scope.$emit("hideLoader");
            $scope.goToCardSign();
        };
        
       // $scope.initSixPaySuccess = function(){
            //check if the reservation needs to authorize card at checkin
            //and send the amount to the emv terminal for the amount if needed
          //  needCCAuthForCheckin();
       // };
        
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