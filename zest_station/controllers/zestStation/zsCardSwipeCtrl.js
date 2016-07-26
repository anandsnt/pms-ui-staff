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
               // alert('saving swipped card');
                //this.MLIOperator = new MLIOperation();
                $scope.saveSwipedCardMLI($scope.swipeData);
        };
        
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
        
        $scope.simulateSixPay = function(){
            var debuggingCardPmt = $scope.debuggingCardPayment(true);
            console.info('debuggingCardPayment: ',debuggingCardPmt);
            if (!debuggingCardPmt){
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
            
            //$scope.invokeApi(zsPaymentSrv.savePayment, postData, onSuccessDeposit, $scope.failSavePayment, "NONE"); 
        
            //we need not save the payment once submit payment is called
        
            	onSuccessDeposit(response);
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
                         setTimeout(function(){
                             $scope.successDeposit();
                         },2000);
                        
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
                //debugging
                //$scope.zestStationData.payment_gateway = 'mli';
                //done
                
                $scope.setInitSwipeSettings();
                initCardReaders();
                if ($scope.inDemoMode()){
                    setTimeout(function(){
                        $scope.goToCardSign();    
                    },3000);
                }
                digest();
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
                console.info('just card sign...')
                initCardSignScreen();
            } else if (current === 'zest_station.deposit_agree'){
                console.info('now go to card deposit ...')
                initDepositScreen();
            } else {
                if (debugging){
                    initCardSignScreen();
                } else {
                    console.info('now go to card swipe...')
                    initCardSwipeScreen();
                }
                
            }
            $state.from = $scope.at;
            if (current !== 'zest_station.deposit_agree'){
                console.info('current: ',current);
                $scope.headingText = 'RES_AUTH_DEPOSIT';
                $scope.subHeadingText = 'RES_AUTH_DEPOSIT_SUB';
            }
            $scope.signatureData = "";
            resetSignature();
        };
        
        initCardReaders = function(){
            if ($state.current.name==='zest_station.card_swipe'){
                console.log('$scope.zestStationData.payment_gateway: ',$scope.zestStationData.payment_gateway);
                if ($scope.zestStationData.payment_gateway === "sixpayments") {
                    $scope.initiateCardReader();//sixpay
                } else {
                    console.info(':: Not Sixpay ::');
                }
            }
        };
        
        var debugSwipeData = {"RVCardReadCardIIN":"541300","RVCardReadCardName":" PPC MCD 01","RVCardReadCardType":"MC","RVCardReadETB":"","RVCardReadETBKSN":"","RVCardReadExpDate":"2512","RVCardReadIsEncrypted":"1","RVCardReadMaskedPAN":"5413000040000010","RVCardReadPAN":"5413000040000010","RVCardReadTrack1":"4D3BCB8ABE04C61B7F42A2CCAFF7A7DD89EE7B7C655C9030194CF5A55C3B85DB12EF454586FB172CAEDA58C222B19C5B5735CDA7B03F97B5","RVCardReadTrack1KSN":"9012080B2ACA76000370","RVCardReadTrack2":"535F8CCA3F29F0DC896D063A897DA78FBA0504237B65713BA4367D9B366973B59667D7B12637D863","RVCardReadTrack2KSN":"9012080B2ACA76000370","RVCardReadTrack3":"","RVCardReadTrack3KSN":"9012080B2ACA76000370"};
        
        $scope.token = '';
        $scope.swipeData;
        var swipeOperationObj = new SwipeOperation();
        var processWebsocketSwipe = function(swipedCardData){
                
                
                if (typeof swipedCardData === typeof 'str'){
                    $scope.swipeData = JSON.parse(swipedCardData);
                } else if (typeof swipedCardData === typeof {'object':true}){
                    $scope.swipeData = swipedCardData;
                } else {
                    $scope.swipeData = {};
                }
                    var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
                    console.warn('getTokenFrom: '+JSON.stringify(getTokenFrom));
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
                        $state.go('zest_station.swipe_pay_error');
                    };
                    
                    console.info('fetching token...from tokenize...');
                $scope.invokeApi(zsPaymentSrv.tokenize, getTokenFrom, cb);
        };
        $scope.$on('SWIPE_ACTION',function(evt, swipedCardData){
            console.info('swipe action response: ',swipedCardData);
            console.info('other',arguments);
            
            if (readLocally()){
                //swipedCardData = evt;
                //('processing local read from ingenico: '+JSON.stringify(swipedCardData));
                processWebsocketSwipe(swipedCardData);
            } else {
                //desktop mli swipe (websocket)
                processWebsocketSwipe(swipedCardData);
            }
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
            var token;
            if (data){
                if (data.token){
                    data.data.token = data.token;
                }
                if (data.evt === null && data.data){
                    token = data.token;
                    data = data.data;
                } else {
                    data = $scope.swipeData;
                }
            }
            //save the payment to guest card/reservation
            var reservationId = $scope.selectedReservation.id;
            var postData = swipeOperationObj.createSWipedDataToSave(data);
            postData.reservation_id = reservationId;
                try {
                    $scope.invokeApi(zsPaymentSrv.savePayment, postData, $scope.successSavePayment, $scope.failSavePayment); 
                } catch(err){
                    $state.go('zest_station.swipe_pay_error');
                }
             
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
            if ($state.current.name === 'zest_station.card_swipe'){
                if (readLocally()){
                   // alert(JSON.stringify(data));
                    $scope.$broadcast('SWIPE_ACTION', {'evt':null, 'data':data});
                  //  $scope.goToCardSign();
                } else {
                    $scope.$broadcast('SWIPE_ACTION', data);
                }
            }
        };

        $scope.failureCallBackSwipe = function(errorMessage) {
            if ($state.current.name === 'zest_station.card_swipe'){
                if (readLocally()){
                    $state.go('zest_station.swipe_pay_error');
                } else {
                    $scope.errorMessage = errorMessage;
                    $state.go('zest_station.swipe_pay_error');
                }
            }
        };

        var options = {};
        options["successCallBack"] = $scope.successCallBackSwipe;
        options["failureCallBack"] = $scope.failureCallBackSwipe;

        $scope.numberOfCordovaCalls = 0;
        
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
            if ($state.current.name==='zest_station.card_swipe'){
                digest();
                console.info('init card reader for sixpay');
                var isIpad = (navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null) && window.cordova;
                console.info('is ipad: ',isIpad)
                if (readLocally() && isIpad) {
                    console.warn('start card reader');
                    $scope.cardReader.startReader(options);
                } else if (isIpad) {
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
        };

        /*
         * Start Card reader now!.
         */
        var swipeFromSocket = function(){
            if ($scope.zestStationData.ccReader === 'websocket'){
                return true;
            } else {
                return false;
            }
        };
        var readLocally = function(){
            if ($scope.zestStationData.ccReader === 'local'){
                return true;
            } else {
                return false;
            }
        }
         $scope.setInitSwipeSettings = function(){
             var debugging = false;
             if ($state.current.name==='zest_station.card_swipe'){
                console.info('Attempting to connect to Card Readers');
                
                //$scope.zestStationData.payment_gateway = 'mli';//debugging
                if ($scope.zestStationData.payment_gateway !== "sixpayments") {
                    if (debugging){
                    setTimeout(function(){
                        console.info('emitting debug data...');
                        $scope.$emit('SWIPE_ACTION',JSON.stringify(debugSwipeData));
                    },5000);
                }
                /* Enabling desktop Swipe if we access the app from desktop ( not from devices) and
                 * desktopSwipeEnabled flag is true
                 */
                    if (swipeFromSocket()){
                        $scope.initWsSwipe();
                        
                    } else if (readLocally()){
                        console.info('reading locally');
                        setTimeout(function() {
                            $scope.initiateCardReader();
                        }, 800);
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
            }
        };
        
        
	 $scope.sixPaymentSwipe = function(){
             var debugging = false;
             if (debugging){
                 continueToSign();
             } else {
		var data = {};
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
                        console.info(response)
                        console.info('success: ',response);
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
                
            if ($scope.inDemoMode()){
                setTimeout(function(){
                    continueToSign();
                },3500);
                    
            } else {
                console.log('authorizeCC @ captureAuthorization: ',$scope, ' :: data, ',data);
                $scope.invokeApi(zsPaymentSrv.authorizeCC, data, onSuccessCaptureAuth, onSwipeError, "NONE"); 
            }
        };
        
        
        var onSwipeError = function(error){
                console.info('FAILED: ',error);
                $scope.$emit('hideLoader');
                $scope.errorMessage = error;
                $state.swipe_error_msg = error;
                var current = $state.current.name;
                if (current !== 'zest_station.card_sign'){
                    $state.go('zest_station.swipe_pay_error');
                }
        };
        
        var fetchAuthorizationAmountDue = function(){
            
            var params = {
                'id':$scope.selectedReservation.id,
                'by_reservation_id': true
            };
            var onSuccessFetchAuthorizationAmountDue = function(response){
                console.info('refetched details: ',response);
               digest();
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
        var digest = function(){
            setTimeout(function(){
                try{
                    $scope.$digest();
                }catch(er){

                }
            },200);
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
                    console.log('true + true')
                    captureAuthorization(amount, isEmv);
                } 
                //true + false
                else if($state.showDeposit && !needToAuthorizeAtCheckin) {
                    console.log('true + false')
                    $scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
                    continueToSign();
                }
                //false + true
                else if (!$state.showDeposit && needToAuthorizeAtCheckin){
                    console.log('false + true')
                    captureAuthorization(amount, isEmv);
                }
                //false + false
                else if (!$state.showDeposit && !needToAuthorizeAtCheckin){
                    console.log('false + false')
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
            if (swipedCardData.evt === null && swipedCardData.data){
                swipedCardData = swipedCardData.data;
            }
            //alert('tokenize from: ');
            //alert(JSON.stringify(swipedCardData));
            
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
                       // alert('tokenize form...'+JSON.stringify(getTokenFrom));
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
			"cardType": swipedCardData.RVCardReadCardType,
                        "et2": swipedCardData.RVCardReadTrack2,
                        'ksn': swipedCardData.RVCardReadTrack2KSN,
			'pan': swipedCardData.RVCardReadMaskedPAN,
			"mli_token": swipedCardData.token,
			"payment_type": "CC",
                        "cardExpiryMonth": swipedCardData.cardExpiryMonth,
                        "cardExpiryYear": swipedCardData.cardExpiryYear,//2-digit
                        "cardNumber": "xxxx-xxxx-xxxx-" + swipedCardData.token.slice(-4),//xxxx-xxxx-xxxx-0123
                        "addToGuestCard":false,
			"card_name": swipedCardData.RVCardReadCardName,
                        "payment_credit_type":swipedCardData.RVCardReadCardType,
			"credit_card":swipedCardData.RVCardReadCardType,//VA / AX
			"card_expiry": '20'+swipedCardData.RVCardReadExpDate.substring(0, 2)+'-01-'+swipedCardData.RVCardReadExpDate.slice(-2),//2017-12-01
                        "add_to_guest_card":false
		};
		return swipedCardDataToSave;
	};



};