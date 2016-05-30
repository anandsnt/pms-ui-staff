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
	function($scope, $stateParams, $state, zsEventConstants,$controller,$timeout, zsCheckinSrv, zsModeConstants, zsGeneralSrv) {
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
            if ($scope.showDeposit){
                $scope.payDeposit();
            } else {
                goToCardSign();
            }

        };

        $scope.swipeData = {};

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
                    'first_name': $stateParams.first_name
                };
                
                
                //need to go to [ last viewed ] screen, terms&conditions may be turned off...
                $state.go('zest_station.checkInTerms', stateParams);
            }
        };
        
        var onCardSwipeResponse = function(evt, swipedCardData){
            console.info(swipedCardData)
                var swipeOperationObj = new SwipeOperation();
                $scope.swipeData = swipedCardData;

                var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
                var tokenizeFailed = function(response){
                    $scope.$emit('hideLoader');
                    console.warn('failed to get token from MLI');
                    //need to go to error screen here
                };
                
                var tokenizeSuccessCallback = function(){
                    $scope.$emit('hideLoader');
                    $scope.swippedCard = true;
                    initMLISessionThenSave();//get MLI session and save
                };

                var callback = function(response){
                    if (response && response.status !== 'failure'){
                        $scope.$emit('hideLoader');
                        cardToken = response.data;
                        $scope.swipeData.token = response.data;

                        tokenizeSuccessCallback();
                    } else {
                        tokenizeFailed(response);
                    }
                };

                $scope.invokeApi(zsGeneralSrv.tokenize, getTokenFrom, callback);
        };
        
        var goToCardSign = function(){
            console.log('show signature');
            $state.go('zest_station.checkInSignature',{
                'reservation_id':$stateParams.reservation_id,
                'guest_id': $stateParams.guest_id,
                'mode':'SIGNATURE',
                'payment_type_id':$stateParams.payment_type_id,
                'room_no':$stateParams.room_no,
                'room_status':$stateParams.room_status,
                'deposit_amount':$stateParams.deposit_amount,
                'email':$stateParams.guest_email,
                'guest_email_blacklisted':$stateParams.guest_email_blacklisted
                
            });
        };

        
        var initMLISessionThenSave = function(){
                this.MLIOperator = new MLIOperation();
                saveSwipedCardMLI();
        };
        
        var saveSwipedCardMLI = function(data){
            if (!data){
                data = $scope.swipeData;
                console.log(data)
            }
            var cardCode = data.RVCardReadCardType;
            //save the payment to guest card/reservation
            var reservationId = $stateParams.id;
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

			try {
                console.info('trying updatesession')
			    HostedForm.updateSession(sessionDetails, updateSessionCallback);
			    $scope.$emit("showLoader");  
			}
			catch(err) {
                console.warn(err);
			};
             
             
        };
        var updateSessionCallback = function(response){
            console.info(response);
            $scope.$emit("hideLoader");

            if(response.status ==="ok"){
                MLISessionId = response.session;
                postData.session_id = MLISessionId;
                console.info('sessionId: ',postData);
                $scope.invokeApi(zsPaymentSrv.savePayment, postData, successSavePayment, failSavePayment); 
            }
            else{
                console.warn('there was a problem with the card');
            }
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
        var initiateiPadCardReader = function(){
            if (readLocally()) {
                    console.warn('start card reader');
                    $scope.cardReader.startReader(options);
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
        }
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
            var needToAuthorizeAtCheckin = $scope.selectedReservation.reservation_details.data.reservation_card.authorize_cc_at_checkin,
                    authCCAmount = $scope.selectedReservation.reservation_details.data.reservation_card.pre_auth_amount_at_checkin;
            
                getCCAuthorization(needToAuthorizeAtCheckin, authCCAmount, true);
        };
        
        var fetchAuthorizationAmountDue = function(){
            
            var params = {
                'id':$scope.selectedReservation.id,
                'by_reservation_id': true
            };
            var onSuccess = function(response){
                console.info('refetched details: ',response);
                var amount = response.data.reservation_card.pre_auth_amount_at_checkin,
                    needToAuthorizeAtCheckin = response.data.reservation_card.authorize_cc_at_checkin;
                console.info('response: ',response);
                
                if (needToAuthorizeAtCheckin){
                        captureAuthorization(amount, true);
                } else {
                    continueToSign();
                }
                
            }
            $scope.invokeApi(zsTabletSrv.fetchReservationDetails, params, onSuccess, onSwipeError, "NONE");
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
            var onSuccess = function(){
                    //continueToSign();
                    if ($state.current.name==='zest_station.checkInCardSwipe'){
                        goToCardSign();
                    }
            };
            
            if ($state.paidDeposit){
                $scope.headingText = 'RES_AUTH_REMAIN';
                $scope.subHeadingText = 'RES_AUTH_REMAIN_SUB ';
            } else {
                $scope.headingText = 'RES_AUTH';
                $scope.subHeadingText = 'RES_AUTH_SUB ';
            }
            
            
           digest();
            $scope.invokeApi(zsCheckinSrv.authorizeCC, data, onSuccess, onSwipeError, "NONE"); 
        };
        
        var initSixPaySuccess = function(response){
            //check if the reservation needs to authorize card at checkin
            //and send the amount to the emv terminal for the amount if needed
            needCCAuthForCheckin();
        };
        var onSwipeError = function(error){
            console.info('FAILED: ',error);
            $scope.$emit('hideLoader');
            $scope.errorMessage = error;
            if ($state.current.name==='zest_station.checkInCardSwipe'){
                $state.go('zest_station.swipe_pay_error');
            }
            
        };
        
        var sixPaymentSwipe = function(){
		var data = {};
                //to do 
                //integrate with deposit references (verify if need to show deposit)
               /*     if ($state.showDeposit && !$state.paidDeposit){
                        data.amount = $scope.selectedReservation.reservation_details.data.reservation_card.deposit_amount;
                    } else {
                        //this will check if authorization is required and send the amount to terminal
                        //will update this in new codebase
                        initSixPaySuccess();
                        return;
                    }
            */
                    
                    data.reservation_id = $state.selectedReservation.id;
                    data.is_emv_request = true;
                    console.log('listening for C&P or swipe...');
                
                var successGetToken = function(response){
                        $scope.$emit('hideLoader');
                        console.info('success: ',response);
			successSixSwipe(response);
		};
                $scope.invokeApi(zsCheckinSrv.authorizeCC, data, successGetToken, onSwipeError, "NONE"); 
	};
        
	var successSixSwipe = function(response){
            //    if ($state.showDeposit){
            //        $scope.payDeposit(response);
             //   } else {
                    initSixPaySuccess(response);
             //   }
	};
        
        /**
         * [setup controller]
         */
		var init = function() {
                    
                    
            console.log($stateParams)
            //if at the deposit screen, set the currency symbol and amount due, which should be passed from reservation details
            if (isDepositMode()){
                setDepositSettings();
            }
            if (isCCAuthMode()){
                setCCAuthSettings();
            }
            
            if (!isSixpay()){//mli
                if (swipeFromSocket()){
                    initWsSwipe();
                }
                if (readLocally()){
                    console.info('reading locally');
                    setTimeout(function() {
                        initiateiPadCardReader();
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