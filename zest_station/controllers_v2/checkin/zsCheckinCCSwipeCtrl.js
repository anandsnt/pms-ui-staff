sntZestStation.controller('zsCheckinCCSwipeCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$controller',
	'$timeout',
	'zsCheckinSrv',
	'zsModeConstants',
	'zsGeneralSrv',
	'zsPaymentSrv',
	function($scope, $stateParams, $state, zsEventConstants,$controller,$timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv, zsPaymentSrv) {
        BaseCtrl.call(this, $scope);
        /**********************************************************************************************
        **      Please note that, not all the stateparams passed to this state will not be used in this state, 
        **      however we will have to pass this so as to pass again to future states which will use these.
        **       
        **      Expected state params -----> mode, id, guest_id, swipe, guest_email, guest_email_blacklisted, 
        **      room_no and room_status           
        **      Exit function -> goToCardSign                              
        **                                                                       
        ***********************************************************************************************/


        /*
         *  Card Signature View - Used for Credit Card or Deposit via Credit Card
         *  
         *  take MLI actions out and place in zsUtils.js, inherit common (swipe/functionality for depoist + cc )
         *  -> switch from invoke to callAPI
         *  
         */

        $scope.continue = function(){
            var inProduction = $scope.inProd();
            if (inProduction){return;}
            
            $scope.$emit('hideLoader');
            if (isDepositMode()){
                $scope.payDeposit();
            } else {
                goToCardSign();
            }

        };

        $scope.swipeData = {};
        $scope.paidDeposit = false;
        // $scope.proceedToDeposit = function(){
        //     $state.go('zest_station.checkInCardSwipe',{
        //         'mode': 'DEPOSIT',
        //         'swipe': 'true',
        //         'id': $stateParams.reservation_id,
        //         'room_no':$stateParams.room_no,
        //         'room_status':$stateParams.room_status,
        //         'guest_email': $stateParams.guest_email,
        //         'guest_email_blacklisted': $stateParams.guest_email_blacklisted
        //     }); 
        // };
        
        $scope.reTryCardSwipe = function(){
            $scope.resetTime();
            init();
        };
        
        var onActivityTimeout = function(){
            if (isCCAuthMode()){
                swipeTimeoutCC();
            } else if (isDepositMode()){
                swipeTimeoutDeposit();
            } else {
                
            }
        };
        
        var onClickBack = function(event) {
            if (!$scope.zestStationData.kiosk_display_terms_and_condition) {
                $state.go('zest_station.checkInReservationDetails');
            } else {
                var stateParams = {
                    'guest_id': $stateParams.guest_id,
                    'reservation_id': $stateParams.reservation_id,
                    'deposit_amount': $stateParams.deposit_amount,
                    'room_no': $stateParams.room_no,
                    'room_status': $stateParams.room_status,
                    'payment_type_id': $stateParams.payment_type_id,
                    'guest_email': $stateParams.guest_email,
                    'guest_email_blacklisted': $stateParams.guest_email_blacklisted,
                    'first_name': $stateParams.first_name,
                    'balance_amount': $stateParams.balance_amount,
                    'pre_auth_amount_at_checkin' : $stateParams.pre_auth_amount_at_checkin,
                    'authorize_cc_at_checkin' : $stateParams.authorize_cc_at_checkin
                };
                
                
                //need to go to [ last viewed ] screen, terms&conditions may be turned off...
                $state.go('zest_station.checkInTerms', stateParams);
            }
        };
        
        
        $scope.swipeData;
        
        var onFetchMLITokenResponse = function(response){
                if (response && response.status !== 'failure'){
                    $scope.$emit('hideLoader');
                    console.info('general callback');
                    console.info(response);
                    $scope.swipeData.token = response.data;

                    saveSwipedCardMLI($scope.swipeData);
                } else {
                    console.warn(response);
                    $scope.$emit('hideLoader');
                    goToSwipeError();
                }
                        
        };
        
        
        var payDeposit = function(){
                console.info("paying deposit");
               // $scope.$emit('hideLoader');
                   var params = {
                       'is_emv_request': true,//the current session workstation emv terminal (from setWorkstation) will be used
                       'reservation_id':$stateParams.reservation_id, 
                       'add_to_guest_card': false,
                       'amount': $stateParams.deposit_amount,
                       'bill_number': 1,
                       'payment_type': "CC",
                       'payment_type_id': $stateParams.payment_type_id
                    };
                    console.info(params);
                    if ($scope.inDemoMode()){
                        setTimeout(function(){
                            $scope.successDeposit();
                        },2000);

                   } else {
                       setTimeout(function(){
                           $scope.invokeApi(zsPaymentSrv.submitDeposit, params, successSixSwipe, onSwipeError, "NONE"); //dont show loader using "NONE"
                       },500);
                   }
        };
        
        
        var processSwipeCardData = function(swipedCardData){
                if (typeof swipedCardData === typeof 'str'){
                    $scope.swipeData = JSON.parse(swipedCardData);
                } else if (typeof swipedCardData === typeof {'object':true}){
                    $scope.swipeData = swipedCardData;
                } else {
                    $scope.swipeData = {};
                }
                var swipeOperationObj = new SwipeOperation();
                var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
                    
                console.info('fetching token...from tokenize...');
                $scope.invokeApi(zsGeneralSrv.tokenize, getTokenFrom, onFetchMLITokenResponse);
        };
        
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
        };
        var onCardSwipeResponse = function(evt, swipedCardData){
            if (readLocally()){
                console.log('processing local read from local reader: '+JSON.stringify(swipedCardData));
                processSwipeCardData(swipedCardData);
            }
        };
        
        
        var goToCardSign = function(){
            console.log('show signature');
            var params = {
                'reservation_id':$stateParams.reservation_id,
                'guest_id': $stateParams.guest_id,
                'mode':'SIGNATURE',
                'payment_type_id':$stateParams.payment_type_id,
                'room_no':$stateParams.room_no,
                'room_status':$stateParams.room_status,
                'deposit_amount':$stateParams.deposit_amount,
                'email':$stateParams.guest_email,
                'guest_email_blacklisted':$stateParams.guest_email_blacklisted
                
            };
            console.warn('params: ',params)
            $state.go('zest_station.checkInSignature',params);
        };
        
        var goToSwipeError = function(){
            $scope.waitingForSwipe = false;
            $scope.swipeTimeout = false;
            $scope.swipeError = true;
        };

        var successSavePayment = function(response){
            if (response.status === 'success'){
                $scope.$emit('hideLoader');
                goToCardSign();
            } else {
                failSavePayment(response);
            }
        };

        var failSavePayment = function(response){
            $scope.$emit('hideLoader');
            console.warn(response);
            $state.go('zest_station.error');
        };

        var saveSwipedCardMLI = function(data){ 
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
            var swipeOperationObj = new SwipeOperation();
            var postData = swipeOperationObj.createSWipedDataToSave(data);
                postData.reservation_id = $stateParams.reservation_id;
                
            $scope.invokeApi(zsPaymentSrv.savePayment, postData, successSavePayment, goToSwipeError); 
        };
                
        var isDepositMode = function(){
            if ($stateParams.mode === 'DEPOSIT') {
                return true;
            } else return false;
        };
        var isCCAuthMode = function(){
            if ($stateParams.mode === 'CREDIT_CARD_AUTH') {
                return true;
            } else return false;
        };
        
        var setTimeOutFunctionToEnsureSocketIsOpened = function() {
                $timeout(function() {
                        // so inorder to avoid a possible error because of
                        // wrong timing adding a buffer of 1.5 seconds
                        $scope.socketBeingConnected = false; //connection success
                }, 1000);

        };

        var setDepositSettings = function(){
            $scope.currencySymbol = $scope.zestStationData.currencySymbol;
            $scope.depositAmount = $stateParams.deposit_amount;
            $scope.showSwipeNav = true;
        };
        var setCCAuthSettings = function(){
            $scope.waitingForSwipe = true;
            $scope.swipeError = false;
            $scope.swipeTimeout = false;
        };
        
        var swipeTimeoutCC = function(){
            $scope.waitingForSwipe = false;
            $scope.swipeError = false;
            $scope.swipeTimeout = true;
        };

        var swipeTimeoutDeposit = function(){
            $scope.waitingForSwipe = false;
            $scope.swipeError = false;
            $scope.swipeTimeout = true;
        };
                
        var listenForSwipe = function(){
            $timeout(function(){
                console.log('waiting for swipe..')
                $scope.waitingForSwipe = true;
                $scope.swipeError = false;
                $scope.swipeTimeout = false;
            },1000);
            $scope.socketOperator.observe();
        };
        
        var initWsSwipe = function(){
			setTimeOutFunctionToEnsureSocketIsOpened();
			console.info("websocket: readyState -> " + $scope.socketOperator.returnWebSocketObject().readyState);
			//open socket if not in open state
            
            var socketReady = $scope.socketOperator.returnWebSocketObject().readyState === 1;
                !socketReady ? $scope.$emit('CONNECT_WEBSOCKET') : listenForSwipe();
		
        };
        var atCardSwipeScreen = function(){
            if ($state.current.name==='zest_station.checkInCardSwipe'){//using for debugging & demo mode, 
                // please leave this here until next release as it wont hurt any functionality currently
                return true;
            } else {
                return false;
            }
        };
        
        
        var initiateiPadCardReader = function(){
           if (atCardSwipeScreen()){//check which screen we're at,
                                    // some delay in request could cause the error / success to come back when at another screen, 
                                    // typically when developing or in demo mode
                if (readLocally() && $scope.isIpad === true) {
                    $scope.cardReader.startReader({'successCallBack':$scope.successCallBackSwipe,'failureCallBack': $scope.failureCallBackSwipe,'test':true});
                } else if ($scope.isIpad) {
                    //If cordova not loaded in server, or page is not yet loaded completely
                    //One second delay is set so that call will repeat in 1 sec delay
                    if ($scope.numberOfCordovaCalls < 50) {
                        setTimeout(function() {
                            $scope.numberOfCordovaCalls = parseInt($scope.numberOfCordovaCalls) + parseInt(1);
                            initiateiPadCardReader();
                        }, 2000);
                    }
                }
            }
        };
        var isSixpay = function(){
            if ($scope.zestStationData.paymentGateway === 'sixpayments'){
                return true;
            } else {
                return false;
            }
        };
        
        var reader = $scope.zestStationData.ccReader, writer = $scope.zestStationData.keyWriter;
            console.info(':: reader :: ',reader,', :: writer :: ',writer);
            
        
        var needCCAuthForCheckin = function(){
            var needToAuthorizeAtCheckin = $stateParams.authorize_cc_at_checkin,
                    authCCAmount = $stateParams.pre_auth_amount_at_checkin;
            
                getCCAuthorization(needToAuthorizeAtCheckin, authCCAmount, true);
        };
        
        var fetchAuthorizationAmountDue = function(){//remaining authorization required for reservation
            var onSuccess = function(response){
                if (response.status !== 'success'){
                    onSwipeError(response);
                } else {
                    console.info(':: fetchAuthorizationAmountDue :: ');
                    console.info('response :-> ',response);
                    var amount = response.data.reservation_card.pre_auth_amount_at_checkin,
                        needToAuthorizeAtCheckin = response.data.reservation_card.authorize_cc_at_checkin;
                    console.info('amount :-> ',amount);
                    console.info('needToAuthorizeAtCheckin :-> ',needToAuthorizeAtCheckin);

                    if (needToAuthorizeAtCheckin){
                            captureAuthorization(amount, true);
                    } else {
                        goToCardSign();
                    }
                }
            };
            
            console.log('$stateParams: ',$stateParams)
            $scope.callAPI(zsCheckinSrv.fetchReservationDetails, {
                params: {
                    'id': $stateParams.confirmation_number
                },
                'successCallBack': onSuccess,
                'failureCallBack': onSwipeError
            });
            
        };
         var getCCAuthorization = function(needToAuthorizeAtCheckin, amount, isEmv){
            console.info('getCCAuthorization: ',arguments);
            console.warn('::need to check if deposit paid on reservation @ getCCAuthorization call :: ');
            
            if ($scope.paidDeposit){//paid deposit successful
                fetchAuthorizationAmountDue();
            } else {
                //if deposit was captured, we have the card on file,
                //if authorization is required still (due to settings), 
                //we will again prompt for the card, but for the authorization amount


                //if no deposit was captured, and we do not need to authorize at checkin,
                //then we still need to capture the card, sending a $1.00 amount to the emv terminal

                //true + true
                if(isDepositMode() && needToAuthorizeAtCheckin) {
                    captureAuthorization(amount, isEmv);
                }
                //true + false
                else if(isDepositMode() && !needToAuthorizeAtCheckin) {
                    goToCardSign();
                }
                //false + true
                else if (!isDepositMode() && needToAuthorizeAtCheckin){
                    captureAuthorization(amount, isEmv);
                }
                //false + false
                else if (!isDepositMode() && !needToAuthorizeAtCheckin){
                    amount = 0;
                    captureAuthorization(amount, isEmv);
                }
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
                data.reservation_id = $stateParams.reservation_id;
                data.is_emv_request = isEmv;
                console.info('sending: ',data);
            var onSuccess = function(){
                    //goToCardSign();
                    if ($state.current.name==='zest_station.checkInCardSwipe'){
                        goToCardSign();
                    }
            };
            
            if (isDepositMode()){
                $scope.headingText = 'RES_AUTH_REMAIN';
                $scope.subHeadingText = 'RES_AUTH_REMAIN_SUB ';
            } else {
                $scope.headingText = 'RES_AUTH';
                $scope.subHeadingText = 'RES_AUTH_SUB ';
            }
            
            
           //onSuccess({'status':'success'});
           //onSwipeError({'status':'failure'});
            $scope.invokeApi(zsCheckinSrv.authorizeCC, data, onSuccess, onSwipeError, "NONE"); 
        };
        
        var initSixPaySuccess = function(response){
            $scope.paidDeposit = true;
            //check if the reservation needs to authorize card at checkin
            //and send the amount to the emv terminal for the amount if needed
            needCCAuthForCheckin();
        };
        var onSwipeError = function(error){
            console.info('FAILED: ',error);
            $scope.$emit('hideLoader');
            $scope.errorMessage = error;
            
            
            if ($state.current.name==='zest_station.checkInCardSwipe'){//this appears to be breaking...getting "Could not resolve 'zest_station.swipe_pay_error' from state 'zest_station.checkInCardSwipe"
                goToSwipeError();
            }
            
        };
        
        var sixPaymentSwipe = function(){
            console.info('is deposit mode: ',isDepositMode());
            if (isDepositMode()){
                console.info('submit payment');
                payDeposit();
                
            } else {
                console.info('authorize');
		var data = {};
                    data.reservation_id = $stateParams.reservation_id;
                    data.is_emv_request = true;
                    console.log('listening for C&P or swipe...');
                
                var successGetToken = function(response){
                        $scope.$emit('hideLoader');
                        console.info('success: ',response);
			successSixSwipe(response);
		};
                
                
                //successGetToken({'status':'success'});
                //onSwipeError({'status':'failure'});
                $scope.invokeApi(zsCheckinSrv.authorizeCC, data, successGetToken, onSwipeError, "NONE"); 
            };
	};
        
         $scope.successCallBackSwipe = function(data) {
            if (atCardSwipeScreen()){
                if (readLocally()){
                    $scope.$broadcast('SWIPE_ACTION', {'evt':null, 'data':data});
                } else {
                    $scope.$broadcast('SWIPE_ACTION', data);
                }
            }
        };

        $scope.failureCallBackSwipe = function(errorMessage) {
            if (atCardSwipeScreen()){
                if (readLocally()){
                    goToSwipeError();
                } else {
                    $scope.errorMessage = errorMessage;
                    goToSwipeError();
                }
            }
        };
        
        var startLocalCardReader = function(){

            $scope.numberOfCordovaCalls = 0;

            $scope.cardReader = new CardOperation();
            initiateiPadCardReader();
        };
        
	var successSixSwipe = function(response){
                initSixPaySuccess(response);
	};
        
        /**
         * [setup controller]
         */
		var init = function() {
                    
                    
            console.warn('$stateParams: ',$stateParams)
            //if at the deposit screen, set the currency symbol and amount due, which should be passed from reservation details
            if (isDepositMode()){
                setDepositSettings();
            }
            if (isCCAuthMode()){
                setCCAuthSettings();
            }
            var sixPay = isSixpay();
            console.log('sixPay: '+sixPay);
            if (!sixPay){//mli
                if (swipeFromSocket()){
                    console.log('init websocket swipe');
                    initWsSwipe();
                }
                if (readLocally()){
                    console.log('init local (ingenico/infinea) swipe');
                    console.info('reading locally');
                    setTimeout(function() {
                        startLocalCardReader();
                    }, 800);
                }
            } else {//sixpay
                sixPaymentSwipe();
                
            }
            
                
                };


        init();
        
        
		/**
		 * [initializeMe description]
		 */
                
		var initializeMe = function() {
			 BaseCtrl.call(this, $scope);
             $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
                    
		}();
                
                /**************** Listeners ****************/
                
            //back button action
            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onClickBack);
            $scope.$on('SWIPE_ACTION',onCardSwipeResponse);
            $scope.$on('USER_ACTIVITY_TIMEOUT',onActivityTimeout);

	}
]);