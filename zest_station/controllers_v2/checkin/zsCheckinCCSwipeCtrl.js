sntZestStation.controller('zsCheckinCCSwipeCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$controller',
	'$timeout',
	'zsPaymentSrv',
	function($scope, $stateParams, $state, zsEventConstants,$controller,$timeout,zsPaymentSrv) {
                
            $scope.continue = function(){
                var inProduction = $scope.inProd();
                if (inProduction){
                    return;
                }
                
                $scope.$emit('hideLoader');
                if ($scope.showDeposit){
                    $scope.payDeposit();
                } else {
                    goToCardSign();
                }

            };
            var goToCardSign = function(){
                $state.go('zest_station.card_sign');
            };


            $scope.swipeData = {};
            $scope.$on('SWIPE_ACTION',function(evt, swipedCardData){
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
                        getMLISession();
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

                    $scope.invokeApi(zsPaymentSrv.tokenize, getTokenFrom, callback);
            });
            
        var getMLISession = function(){
                this.MLIOperator = new MLIOperation();
                saveSwipedCardMLI();
        }
        
        var saveSwipedCardMLI = function(data){
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
                    $scope.invokeApi(zsPaymentSrv.savePayment, postData, successSavePayment, failSavePayment); 
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

            
		var setTimeOutFunctionToEnsureSocketIsOpened = function() {
			$timeout(function() {
				// so inorder to avoid a possible error because of
				// wrong timing adding a buffer of 1.5 seconds
				$scope.socketBeingConnected = false; //connection success
			}, 1000);

		};
		var init = function() {
                    //$scope.$emit('SWIPE_ACTION',{});
			setTimeOutFunctionToEnsureSocketIsOpened();
			console.info("websocket: readyState -> " + $scope.socketOperator.returnWebSocketObject().readyState);
			//open socket if not in open state
                        console.info('listening for card swipe: ',$scope.socketOperator.returnWebSocketObject().readyState);
                        
                        var socketReady = $scope.socketOperator.returnWebSocketObject().readyState === 1, listenForSwipe = $scope.socketOperator.observe;
                            !socketReady ? $scope.$emit('CONNECT_WEBSOCKET') : listenForSwipe();
		};
                init();
		/**
		 * [initializeMe description]
		 */
                
		var initializeMe = function() {
			// All the common actions for dispensing keys are to be included in
			// zsKeyDispenseCtrl
			$controller('zsKeyDispenseCtrl', {$scope: $scope});
		}();

        /*
         * Sets variables for deposit navigation
         */    
        var initDepositScreen = function(){
            $scope.showDeposit = true;
            $scope.currencySymbol = '$';//get from settings
            $scope.depositAmount = '122.99';//from reservation details
            
            
            
        };
        /*
         * Sets variables for Credit Card Screen
         */
        var initCCNavScreen = function(){
            $scope.showDeposit = false;
            
        };


		/**
		 * [Screen navigations]
		 */
		
		var navigateToNextScreen = function(){
		   
		};

		/**
		 * when the back button clicked
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			
		});

	}
]);