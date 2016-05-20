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
			setTimeOutFunctionToEnsureSocketIsOpened();
			console.info("websocket: readyState -> " + $scope.socketOperator.returnWebSocketObject().readyState);
			//open socket if not in open state
            
            var socketReady = $scope.socketOperator.returnWebSocketObject().readyState === 1;
                !socketReady ? $scope.$emit('CONNECT_WEBSOCKET') : listenForSwipe();
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