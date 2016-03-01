sntZestStation.controller('zsCheckInKeysCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$sce',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, $stateParams, $sce) {

	BaseCtrl.call(this, $scope);
        sntZestStation.filter('unsafe', function($sce) {
                return function(val) {
                    return $sce.trustAsHtml(val);
                };
            });
        $scope.input = {};
        
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            var current=$state.current.name;
            if (current === 'zest_station.check_in_keys'){
                $state.go ('zest_station.card_sign')
            }
            //$state.go ('zest_station.home');//go back to reservation search results
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
		if ($stateParams.mode === zsModeConstants.PICKUP_KEY_MODE){
                    return true;
                } else if ($scope.isPickupKeys || $state.isPickupKeys){
                    return true;
                } else return false;
	};

        $scope.goToKeySuccess = function(){
          //  setTimeout(function(){
                $state.go('zest_station.key_success');
           // },500);
            
        };
        
        $scope.makeKeys = function(){
            $state.passParams = $scope.input;
            $state.go('zest_station.make_keys');
        };
        $scope.initKeySuccess = function(){
            $state.passParams = $scope.input;
          
            $scope.headingText = 'SUCCESS_HDR';
            $scope.subHeadingText = 'GRAB_KEYS';
            
            if ($scope.isInPickupKeyMode()){
                $scope.modalBtn1 = 'DONE_BTN';//if you were just picking up keys, you are done!
            } else {
                $scope.modalBtn1 = 'NEXT_BTN';//otherwise keep goin!
            }
            
            $scope.input.madeKey = 1;
            $scope.input.makeKeys = 1;
        };
        $scope.makeKeyTwo = function(){
            $scope.input.makeKeys = 2;
            initKeyCreate();  
        };
        
        $scope.fetchDoorLockSettings = function(){
            var onResponse = function(response){
                console.info(response);
                if (response.status!== 'failure'){
                    if (response.data){
                        $scope.enable_remote_encoding = response.enable_remote_encoding;
                    }
                };
                
                $scope.finInit();
            };
            
            
          $scope.callAPI(zsTabletSrv.getDoorLockSettings, {
                params: {},
                'successCallBack':onResponse,
                'failureCallBack':onResponse
            });  
        };
        $scope.finInit = function(){//after fetching door lock interface settings
            $scope.input =  $state.passParams;
            //init key create, set # of keys from the input object
            /*
             * all the below text and button text needs to be moved out to the locale files
             */
            $scope.at = 'make-keys';
            var make_1_key = false, make_2_keys = false;

            if ($scope.input.makeKeys === 1){
                make_1_key = true;
                make_2_keys = false;
            } else {
                make_1_key = false;
                make_2_keys = true;
            }
            console.info('make key ( '+$scope.input.makeKeys+' )');

            
            if (make_1_key){
                $scope.oneKeySetup();
                $scope.initMakeKey(1);
                //oneKeySuccess();
                
            } else if (make_2_keys){
                console.info('called make 2 keys, madeKey: '+$scope.input.madeKey)
                //at first key
                if ($scope.input.madeKey === 0 || typeof $scope.input.madeKey === typeof undefined){
                    $scope.keyOneOfTwoSetup();//sets up screen and runs init to make first key
                    
                } else if($scope.input.madeKey === 1) {
                    $scope.keyTwoOfTwoSetup();//sets up screen and runs init to make second key
                } 
            }
        };
        $scope.initKeyCreate = function(){
            $scope.fetchDoorLockSettings();//get fresh settings on each call to ensure latest door lock settings are used, then continue using finInit
        };
        $scope.keyTwoOfTwoSetup = function(){
                $scope.at = 'make-keys';
                
                $scope.headingText = 'MADE_FIRST_KEY_MSG';
                $scope.subHeadingText = 'MADE_FIRST_KEY_MSG_SUB';
            
                setTimeout(function(){
                    $scope.initMakeKey(2);
                },2500);
            };
        $scope.oneKeySetup = function(){
                $scope.at = 'make-keys';

                $scope.headingText = 'MAKE_KEY';
                $scope.subHeadingText = 'MAKE_KEY_MSG';
                $scope.modalBtn1 = 'Next';
                $scope.input.madeKey = 0;
            };
        $scope.keyTwoOfTwoSuccess = function(){
                    $scope.input.madeKey = 2;
                    $scope.goToKeySuccess();
            };
            
        $scope.keyOneOfTwoSetup = function(){
                $scope.input.madeKey = 0;
                $scope.at = 'make-keys';

                $scope.from = 'select-keys-after-checkin';
                $scope.headingText = 'MAKE_FIRST_KEY';
                $scope.subHeadingText = 'MAKE_FIRST_KEY_SUB';
                $scope.initMakeKey(1);
            };
        
       $scope.oneKeySuccess = function(){
           
            $scope.goToKeySuccess();

            $scope.headingText = 'SUCCESS_HDR';
            $scope.subHeadingText = 'GRAB_KEY_BELOW';
            $scope.modalBtn1 = 'NEXT_BTN';
            $scope.input.madeKey = 1;
        };
       $scope.keyOneOfTwoSuccess = function(){
            $scope.input.madeKey = 1;
            $scope.keyTwoOfTwoSetup();
        };
        
        
        $scope.makingKey = 1;
        $scope.successfulKeyEncode = function(response){
            var success = (response.status === "success")? true : false;
            return success;
        };
        
        $scope.successMakeKey = function(response){
                var makeKeySuccess = $scope.successfulKeyEncode(response);
                if (makeKeySuccess){
                    if ($scope.makingKey === 1 && $scope.input.makeKeys === 1){
                        $scope.oneKeySuccess();
                        
                    } else if($scope.makingKey === 1 && $scope.input.makeKeys === 2) {
                        $scope.keyOneOfTwoSuccess();
                        
                    } else if($scope.makingKey === 2 && $scope.input.makeKeys === 2) {
                        $scope.keyTwoOfTwoSuccess();
                    }
                    
                } else {
                    $scope.emitKeyError(response);
                }
            };
        $scope.emitKeyError = function(response){
            $scope.$emit('MAKE_KEY_ERROR',response);
        };
        $scope.initMakeKey = function(n){
            $scope.makingKey = n;
            var options = {
                card_info: "",
                key: $scope.makingKey,
                key_encoder_id: $state.encoder,
                reservation_id: $scope.selectedReservation.id
            };
            if ($scope.isInPickupKeyMode()){
                options.reservation_id = $scope.selectedReservation.reservation_id;
            }
            
            
            if ($scope.makingKey === 1){
                options.is_additional = false;
            } else {
                options.is_additional = true;
            }
                
                
                
                
                if (!$scope.enable_remote_encoding){
                    $scope.initDispenseKey();
                } else {
                    $scope.wsOpen = false;
                }
                setTimeout(function(){
                    if (!$scope.wsOpen){
                        console.info('not using websockets');
                        $scope.callAPI(zsTabletSrv.encodeKey, {
                            params: options,
                            'successCallBack':$scope.successMakeKey,
                            'failureCallBack':$scope.emitKeyError
                        });
                    } else {
                        console.info('using websockets')
                    }
                },2000);
                
            
            
        };
        
        $scope.wsConfig = {
            "swipeService":"wss://localhost:4649/CCSwipeService"   ,
            "connected_alert":"[ WebSocket Connected ]. Warning : Clicking on Connect multipple times will create multipple connections to the server",
            "close_alert":"Socket Server is no longer connected.",
            "swipe_alert":"Please swipe.",
            "connect_delay":1000//ms after opening the app, which will then attempt to connect to the service, should only be a second or two
        };
        $scope.lastCardUid;//used to save off uuid of card when writing new keys
        $scope.ws = new WebSocket($scope.wsConfig['swipeService']);
        
        $scope.setupWebSocketForSankyo = function(){
                $scope.simulateSwipe = function() {
                    $scope.ws.send("{\"Command\" : \"cmd_simulate_swipe\"}");
                };
                $scope.observe = function() {
                    $scope.ws.send("{\"Command\" : \"cmd_observe_for_swipe\"}");
                };
                $scope.UUIDforDevice = function() {
                    $scope.ws.send("{\"Command\" : \"cmd_device_uid\"}");
                };
                $scope.DispenseKey = function() {
                    $scope.ws.send("{\"Command\" : \"cmd_dispense_key_card\", \"Data\" : \"25CC2CDA31A70E87AF3731961096C90CA0\"}");
                };
                 $scope.EjectKeyCard = function() {
                    $scope.ws.send("{\"Command\" : \"cmd_eject_key_card\"}");
                };
                $scope.CaptureKeyCard = function() {
                    $scope.ws.send("{\"Command\" : \"cmd_capture_key_card\"}");
                };
                 $scope.InsertKeyCard = function() {
                    $scope.ws.send("{\"Command\" : \"cmd_insert_key_card\"}");
                };
                $scope.connect = function() {
                    //Triggers when websocket connection is established.
                    $scope.ws.onopen = function () {
                        $scope.wsOpen = true;
                        console.info($scope.wsConfig['connected_alert']);
                    };

                    // Triggers when there is a message from websocket server.
                    $scope.ws.onmessage = function (evt) {
                                var received_msg = evt.data;
                                if (received_msg){
                                    received_msg = JSON.parse(received_msg);
                                    var cmd = received_msg.Command, msg = received_msg.Message;
                                    console.info('[ '+cmd+' ]');

                                    $scope.initSankyoCmd(cmd, msg);
                                }
                    };

                    // Triggers when the server is down.
                    $scope.ws.onclose = function () {
                        // websocket is closed.
                        $scope.wsOpen = false;
                    };
                    return $scope.ws;
                };
            
            
            
        };
        
        
        $scope.connectWebSocket = function(){
            setTimeout(function(){
                $scope.ws.connect();    
            },$scope.wsConfig['connect_delay']);
        };
        $scope.initDispenseKey = function(){
            $scope.connectWebSocket();//after the connect delay, will open and connect to the rover windows service, to use the sankyo device
            setTimeout(function(){//starts the key dispense/write/eject functions in sankyo
                $scope.UUIDforDevice();    
            },4000);
        };
        
        
        /*
         * dispense one key
         * dispense first key (of 2)
         * dispense second key (2 of 2)
         */
        
        $scope.initSankyoCmd = function(cmd, msg){
                if (cmd === 'cmd_device_uid'){
                    if ($scope.input.madeKey > $scope.input.makeKeys){
                        if ($scope.input.makeKeys === 1){
                            $scope.goToKeySuccess();
                        } else {
                            $scope.keyTwoOfTwoSuccess();
                        }
                        return;
                    }
                    $scope.lastCardUid = msg;
                    DispenseKey();
                    setTimeout(function(){
                        EjectKeyCard();
                        if ($scope.input.madeKey < $scope.input.makeKeys){
                            $scope.keyOneOfTwoSuccess();
                            $scope.makingKey = 2;
                        } else {
                            $scope.oneKeySuccess();
                        }
                        ++$scope.input.madeKey;
                    },2000);
                } else if (cmd === 'cmd_eject_key_card'){
                    if ($scope.input.madeKey < $scope.input.makeKeys){
                        $scope.keyOneOfTwoSuccess();
                        $scope.makingKey = 2;
                    } else {
                        $scope.keyTwoOfTwoSuccess();
                    }


                    if ($scope.input.madeKey < $scope.input.makeKeys){
                        setTimeout(function(){
                            DispenseKey();
                            setTimeout(function(){
                                EjectKeyCard();
                            },2000);
                        },2000);
                    }
                }  
            
            
        };
        
        
        
        
        
        
        $scope.deliverRegistration = function(){
            if ($scope.isInPickupKeyMode()){
                $state.go ('zest_station.home');
            } else {
                if ($scope.zestStationData.emailEnabled || $scope.zestStationData.printEnabled){
                    $state.go('zest_station.delivery_options');
                } else {
                    $state.go('zest_station.last_confirm');
                }
            }
            
        };


        $scope.init = function(){
            $scope.selectedReservation = $state.selectedReservation;
            if ($state.current.name === 'zest_station.make_keys'){
                $scope.at = 'make-keys';
                $scope.initKeyCreate();
            } else if($state.current.name === 'zest_station.key_success'){
                $scope.at = 'key-success';
                $scope.initKeySuccess();
            } else if ($state.current.name === 'zest_station.pickup_keys'){
                $stateParams.mode = zsModeConstants.PICKUP_KEY_MODE;
                $scope.at = 'select-keys-after-checkin';
                $scope.isPickupKeys = true;
                $state.isPickupKeys = true;
              //  $scope.initKeyCreate();
            } else {
                $scope.at = 'select-keys-after-checkin';
            }
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