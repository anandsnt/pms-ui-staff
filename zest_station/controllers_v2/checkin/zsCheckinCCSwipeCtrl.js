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
            //this is a debugging function, user will touch the icon to skip payment screen,
            //the device itself may have been activated, so once we are at a different screen-
            //we should not go to the error page, ie. on card swipe failure, or timeout, if user has
            //skipped the page, then ignore going to error screen
            //*used for develop and release environment where we are testing other screens
            var inProduction = $scope.inProd();
            if (inProduction){return;}
            
            $scope.$emit('hideLoader');
            console.info('isDepositMode(): ',isDepositMode(),',  $scope.paidDeposit: ',$scope.paidDeposit);
            if (isDepositMode() && !$scope.paidDeposit){
                payDeposit(true);
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
                $state.go('zest_station.checkInReservationDetails', $stateParams);
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
        
        
        $scope.payingDeposit = false;
        var payDeposit = function(debugging){
            $scope.payingDeposit = true;
                console.info("paying deposit");
                   var params = {
                       'is_emv_request': true,//the current session workstation emv terminal (from setWorkstation) will be used
                       'reservation_id':$stateParams.reservation_id, 
                       'add_to_guest_card': false,
                       'amount': $stateParams.deposit_amount,
                       'bill_number': 1,
                       'payment_type': "CC",
                       'payment_type_id': $stateParams.payment_type_id
                    };
                    console.info('paying deposit params: ',params);
                    if ($scope.inDemoMode() || debugging){
                        setTimeout(function(){
                            successSixPayDeposit();
                        },3500);

                   } else {
                       setTimeout(function(){
                            $scope.callAPI(zsPaymentSrv.submitDeposit, {
                                params: params,
                                'successCallBack': successSixPayDeposit,
                                'failureCallBack': onSwipeError,
                                'loader': 'none'
                            });   
                               //$scope.invokeApi(zsPaymentSrv.submitDeposit, params, successSixPayDeposit, onSwipeError, "NONE"); //dont show loader using "NONE"
                           
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
                console.info('$scope.inDemoMode() && atCardSwipeScreen(): ',$scope.inDemoMode(), atCardSwipeScreen());
                if ($scope.inDemoMode() && atCardSwipeScreen()){
                    onFetchMLITokenResponse({'status':'success'});
                } else {
                    $scope.invokeApi(zsGeneralSrv.tokenize, getTokenFrom, onFetchMLITokenResponse);
                }
                
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
                'first_name':$stateParams.first_name,
                'room_status':$stateParams.room_status,
                'deposit_amount':$stateParams.deposit_amount,
                'email':$stateParams.guest_email,
                'guest_email_blacklisted':$stateParams.guest_email_blacklisted
                
            };
            console.warn('params: ',params)
            $state.go('zest_station.checkInSignature',params);
        };
        
        var goToSwipeError = function(){
            if (atCardSwipeScreen()){
                $scope.waitingForSwipe = false;
                $scope.swipeTimeout = false;
                $scope.swipeError = true;
            }
        };

        var successSavePayment = function(response){
            if (atCardSwipeScreen()){
                if (response.status === 'success'){
                    $scope.$emit('hideLoader');
                    goToCardSign();
                } else {
                    failSavePayment(response);
                }
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
            console.log('swipe card mli: $scope.inDemoMode() && atCardSwipeScreen(), ',$scope.inDemoMode(), atCardSwipeScreen());
            if ($scope.inDemoMode() && atCardSwipeScreen()){
                setTimeout(function(){
                    successSavePayment({'status':'success'});
                },3500);
            } else {
                $scope.invokeApi(zsPaymentSrv.savePayment, postData, successSavePayment, goToSwipeError); 
            }
        };
                
        var isDepositMode = function(){
            if ($stateParams.mode === 'DEPOSIT' && !$scope.paidDeposit) {
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
            $scope.waitingForSwipe = true;
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
            
        
        var fetchNonDepositAuthorizationForCheckin = function(){
            var authAtCheckinRequired = $stateParams.authorize_cc_at_checkin,
                    authCCAmount = $stateParams.pre_auth_amount_at_checkin;
            
                getCCAuthorization(authAtCheckinRequired, authCCAmount, true);
        };
        
        
        var needCCAuthForCheckin = function(){
            var needToAuthorizeAtCheckin = $stateParams.authorize_cc_at_checkin,
                    authCCAmount = $stateParams.pre_auth_amount_at_checkin;
            
                getCCAuthorization(needToAuthorizeAtCheckin, authCCAmount, true);
        };
        var fetchRemainingAuthForCheckinAfterDeposit = function(){
            var needToAuthorizeAtCheckin = $stateParams.authorize_cc_at_checkin,
                    authCCAmount = $stateParams.pre_auth_amount_at_checkin;
                    console.log(' :: fetchRemainingAuthForCheckinAfterDeposit ::',needToAuthorizeAtCheckin,authCCAmount);
                getCCAuthAfterDeposit(needToAuthorizeAtCheckin, authCCAmount, true);
        };
        
        var onSuccessFetchRemainingAuth = function(response){
            console.log(':: onSuccessFetchRemainingAuth :: ',response);
            if (response.status !== 'success'){
                onSwipeError(response);
                
            } else {
                
                var amount, needToAuthorizeAtCheckin;
                if ($scope.inDemoMode()){
                    amount = 35.00;
                    needToAuthorizeAtCheckin = true;

                } else {
                    amount = response.data.reservation_card.pre_auth_amount_at_checkin;
                    needToAuthorizeAtCheckin = response.data.reservation_card.authorize_cc_at_checkin;

                }
                console.info('amount :-> ',amount);
                console.info('needToAuthorizeAtCheckin :-> ',needToAuthorizeAtCheckin);

                if (needToAuthorizeAtCheckin){
                    captureAuthorization(amount, true, true);

                } else {
                    goToCardSign();
                }
            }
        };
        var fetchRemainingAuthAmountDue = function(){//remaining authorization required for reservation
            console.log(':: fetchRemainingAuthAmountDue :: $stateParams: ',$stateParams);
            
            if ($scope.inDemoMode()){
                    onSuccessFetchRemainingAuth({'status':'success'});
                    
            } else {
                $scope.callAPI(zsCheckinSrv.fetchReservationDetails, {
                    params: {
                        'id': $stateParams.confirmation_number
                    },
                    'successCallBack': onSuccessFetchRemainingAuth,
                    'failureCallBack': onSwipeError
                });   
            }
        };
        
        
        
         var getCCAuthAfterDeposit = function(){
             //will check for further auth amount needed & if required during checkin, 
             // then go to capture auth or card sign
            console.log('successful deposit paid, :: fetch auth amount due ::');
            fetchRemainingAuthAmountDue();
         };
         
         var getCCAuthorization = function(authAtCheckinRequired, amount, isEmv){
            console.info('getCCAuthorization: ',arguments);
            if(!authAtCheckinRequired) {
                console.log('!authAtCheckinRequired, to signature');
                goToCardSign();
            } else {
                amount = 0;
                captureAuthorization(amount, isEmv, false);
            }
        };
        
        
        
        
        
        $scope.capturingAuth = false;
        $scope.authAfterDeposit = false;
        
        var onSuccessCaptureAuth = function(){
            if ($state.current.name==='zest_station.checkInCardSwipe'){
                goToCardSign();
            }
        };
        var captureAuthorization = function(amount, isEmv, afterSuccessfulDeposit){
            console.log(':: captureAuthorization :: ',arguments);
            $scope.capturingAuth = true;
            
            var data = {};
                if (amount > 0){
                    data.amount = amount;
                } else {
                    data.amount = "1.00";
                }
                data.reservation_id = $stateParams.reservation_id;
                data.is_emv_request = isEmv;
                console.info('authorizing with: ',data);
            
            if (afterSuccessfulDeposit){
                $scope.authAfterDeposit = true;
            } else {
                $scope.authAfterDeposit = false;
            }
            
            if ($scope.inDemoMode() && atCardSwipeScreen()){
                onSuccess({'status':'success'});
                
            } else {
                
                $scope.callAPI(zsCheckinSrv.authorizeCC, {
                    params: data,
                    'successCallBack': onSuccessCaptureAuth,
                    'failureCallBack': onSwipeError,
                    'loader': 'none'
                });   
//                $scope.invokeApi(zsCheckinSrv.authorizeCC, data, onSuccessCaptureAuth, onSwipeError, "NONE"); 
            }
            
        };
        
        var successSixPayDeposit = function(response){
            console.log(':: successSixPayDeposit :: ',response);
            $scope.payingDeposit = false;
            $scope.paidDeposit = true;
            //check if the reservation needs to authorize card at checkin
            //and send the amount to the emv terminal for the amount if needed
            fetchRemainingAuthForCheckinAfterDeposit();
        };
        var onSwipeError = function(error){
            console.info('FAILED: ',error);
            $scope.$emit('hideLoader');
            $scope.errorMessage = error;
            
            if ($state.current.name==='zest_station.checkInCardSwipe'){
                goToSwipeError();
            }
            
        };
        
        var startSixPayPayment = function(){
            console.log(':: starting six pay payment ::');
            console.log('isDepositMode(): ',isDepositMode());
            if (isDepositMode()){
                console.info('payDeposit()');
                payDeposit();
                
            } else {
                console.info('fetchNonDepositAuthorizationForCheckin()');
                fetchNonDepositAuthorizationForCheckin();
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
                console.info('sixpay payment');
                startSixPayPayment();
                
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