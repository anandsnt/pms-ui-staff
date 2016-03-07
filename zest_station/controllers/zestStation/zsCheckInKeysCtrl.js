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
        $state.simkey = false;//use for debugging, simulate success responses
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
            $state.go('zest_station.key_success');
        };

        $scope.makeKeys = function(n){
            console.info('[called: make 1 key]');
            console.info('---: change screen to make_keys');
            console.info('---: makeKeys = 1');
            console.info('---: nextKey  = 1');
            $state.input.makeKeys = n;
            $state.input.madeKey = 0;
            $state.input.nextKey = 1;
            $state.go('zest_station.make_keys');
        };

        $scope.initKeySuccess = function(){
            $scope.at = 'key-success';
            $scope.headingText = 'SUCCESS_HDR';
            $scope.subHeadingText = 'GRAB_KEYS';

            if ($scope.isInPickupKeyMode()){
                $scope.modalBtn1 = 'DONE_BTN';//if you were just picking up keys, you are done!
            } else {
                $scope.modalBtn1 = 'NEXT_BTN';//otherwise keep goin!
            }

        };

        $scope.fetchDoorLockSettings = function(){

            var onResponse = function(response){
                console.info('---> Door Lock Setting Fetch [Complete], Response: ',response);
                if (response.status !== 'failure'){
                    var remote  = (response.enable_remote_encoding) ? 'enabled'
                                                                    : 'disabled';
                    $scope.remoteEncoding = response.enable_remote_encoding;
                    console.info('---> Remote Encoding is: ',remote);
                    $scope.beginKeyEncode();
                };

            };


          $scope.callAPI(zsTabletSrv.getDoorLockSettings, {
                params: {},
                'successCallBack':onResponse,
                'failureCallBack':onResponse
            });
        };

        $scope.beginKeyEncode = function(){//after fetching door lock interface settings
            //init key create, set # of keys from the input object
            /*
             * all the below text and button text needs to be moved out to the locale files
             */
            $scope.at = 'make-keys';
            if ($state.input.makeKeys === 1){
                console.log('make uno keys');

                console.info('[ONLY 1 KEY]')
                $scope.oneKeySetup();
                console.log('$scope.oneKeySetup();')
            } else {
                console.log('make dos keys');
                console.info('[2 KEYS !!]')
                //at first key
                console.log('$state.input',$state.input);
                if ($state.input.madeKey === 0){
                    console.log('$scope.keyOneOfTwoSetup();');//sets up screen and runs init to make first key
                    $scope.keyOneOfTwoSetup();//sets up screen and runs init to make first key

                } else if($state.input.madeKey === 1) {
                    //$scope.keyTwoOfTwoSetup();//sets up screen and runs init to make second key
                    console.log('$scope.keyTwoOfTwoSetup();')//sets up screen and runs init to make second key
                }
            }





        };
        $scope.initKeyCreate = function(){
            console.log('[: Fetching DoorLock Settings: ...]');
            $scope.fetchDoorLockSettings();//get fresh settings on each call to ensure latest door lock settings are used, then continue using beginKeyEncode
        };
        $scope.keyTwoOfTwoSetup = function(){
                $scope.at = 'make-keys';

                $scope.headingText = 'MADE_FIRST_KEY_MSG';
                $scope.subHeadingText = 'MADE_FIRST_KEY_MSG_SUB';
                $scope.$digest();

                $scope.initMakeKey(2);

            };
        $scope.oneKeySetup = function(){
                $scope.at = 'make-keys';

                $scope.headingText = 'MAKE_KEY';
                $scope.subHeadingText = 'MAKE_KEY_MSG';
                $scope.modalBtn1 = 'Next';
                $state.input.madeKey = 0;

                $scope.initMakeKey(1);
            };
        $scope.keyTwoOfTwoSuccess = function(){
                    $state.input.madeKey = 2;
                    $scope.goToKeySuccess();
            };

        $scope.keyOneOfTwoSetup = function(){
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
            $state.input.madeKey = 1;
        };
       $scope.keyOneOfTwoSuccess = function(){
            $state.input.madeKey = 1;
            $state.input.nextKey = 2;
            console.info($state.input)
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
                    $state.selectedReservation.keySuccess = true;
                } else {
                    $scope.emitKeyError(response);
                    console.info('[:: Success Made Remote Key ::]');
                    /*
                     * when using websockets / sankyo to dispense keys, we can the print_key first to
                     * get card data ready to write reservation info
                     */
                    console.info(response);
                    if ($state.simkey){
                        console.info('::: SIMULATE SUCCESS > Make Key :::');
                        response.status = 'success';
                    }

                    $scope.wsOpen = false;//by default dont use websockets, only if local encoding with sankyo device

                    if ($scope.successfulKeyEncode(response)){//due to backend sending 200 with status == failure, need to verify..

                        if ($scope.makingKey === 1 && $state.input.nextKey === 1){

                            $scope.oneKeySuccess();

                        } else if($scope.makingKey === 1 && $state.input.nextKey === 2) {
                            $scope.keyOneOfTwoSuccess();

                        } else if($scope.makingKey === 2 && $state.input.nextKey === 2) {
                            $scope.keyTwoOfTwoSuccess();
                        }

                    } else {
                        $scope.emitKeyError(response);
                    }
                };
        };
        $scope.emitKeyError = function(response){
            $scope.$emit('MAKE_KEY_ERROR',response);
        };


        $scope.getKeyOpts = function(){
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

            return options;
        };

        $scope.initMakeKey = function(n){
            console.info('::KEY [',n,'] Init Encode::');
            $scope.makingKey = n;
            $state.nextKey = n+1;
            var options = $scope.getKeyOpts();
                //console.info('encode key and set UID')
                setTimeout(function(){
                    $state.keyDispenseUID = '';//used if

                    var onResponseSuccess;
                    if (!$scope.remoteEncoding){
                        options.is_kiosk = true;
                        onResponseSuccess = $scope.printLocalKey;
                    } else {
                        onResponseSuccess = $scope.successMakeKey;
                    }
                    

                    if ($state.simkey){
                        onResponseSuccess({});
                    } else {
                        $scope.callAPI(zsTabletSrv.encodeKey, {
                            params: options,
                            'successCallBack':onResponseSuccess,
                            'failureCallBack':$scope.emitKeyError
                        });
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
                $scope.DispenseKey = function() {//write to key after successful encodeKey call
                    console.info('dispense called : [',$state.keyDispenseUID,']')
                    $scope.ws.send("{\"Command\" : \"cmd_dispense_key_card\", \"Data\" : \""+$state.keyDispenseUID+"\"}");
                };
                 $scope.EjectKeyCard = function() {//reject key on failure
                    $scope.ws.send("{\"Command\" : \"cmd_eject_key_card\"}");
                };
                $scope.CaptureKeyCard = function() {//dumps key into internal bucket after insert key
                    $scope.ws.send("{\"Command\" : \"cmd_capture_key_card\"}");
                };
                 $scope.InsertKeyCard = function() {//use key for checkout takes key in
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
                                    $scope.initSankyoCmd(cmd, msg);
                                }
                    };

                    // Triggers when the server is down.
                    $scope.ws.onclose = function () {
                        // websocket is closed.
                        $scope.wsOpen = false;
                        console.warn('[::: WebSocket Closed :::]');
                    };
                    return $scope.ws;
                };



        };


        $scope.connectWebSocket = function(){
            console.info('--> Connecting WebSocket...');
            $scope.setupWebSocketForSankyo();
            setTimeout(function(){
                console.info('[:: Connecting ... .. .  ::]');
                $scope.connect();
            },$scope.wsConfig['connect_delay']);
        };

        $scope.printLocalKey = function(response){
            console.info('[:: Print Local Key ::]');

            console.info(response);
            if ($state.simkey){//this and the below may need to change
                console.info('::: SIMULATE SUCCESS > Print Local Key :::');
                response.status = 'success';
            }

            if ($scope.successfulKeyEncode(response)){//This may need to go away, read response differently than encode success from print_key
                $scope.wsOpen = true;
                console.info('[ :Local Key Print via Websocket: ]');
                $scope.connectWebSocket();//after the connect delay, will open and connect to the rover windows service, to use the sankyo device
                setTimeout(function(){//starts the key dispense/write/eject functions in sankyo
                    //$scope.UUIDforDevice();
                    if ($state.simkey){
                        $scope.initSankyoCmd('cmd_dispense_key_card', '[fake:simluated sankyo response]');//fake the returning msg
                    } else {
                        $scope.DispenseKey();
                    }
                },3500);

            } else {
                $scope.emitKeyError(response);
            }
        };



        $scope.makeKeyParam = function(){
            console.info('$state.input: ',$state.input);
            if ($state.input.makeKeys === 1){
                //* dispense one key
                return 'one';
            } else if ($state.input.makeKeys === 2 && $state.input.nextKey === 1){
                //* dispense first key (of 2)
                return 'first';
            } else if ($state.input.makeKeys === 2 && $state.input.nextKey === 2){
                //* dispense second key (2 of 2)
                return 'second';
            }  else return 'done';

        };
        /*
         * dispense one key
         * dispense first key (of 2)
         * dispense second key (2 of 2)
         */

        $scope.initSankyoCmd = function(cmd, msg){//should only init this if a dispense was called...
            console.info('[:: WebSocket Received Message from CMD ('+cmd+') ::]');
            console.info('---> "' +msg+ '"');

            switch ($scope.makeKeyParam()){
                case 'one':
                    console.info('handle one');
                    $scope.input.madeKey = 1;
                    $scope.goToKeySuccess();
                    break;

                case 'first':
                    console.info('handle first');
                    $scope.keyOneOfTwoSuccess();
                    break;

                case 'second':
                    console.info('handle second');
                    $scope.keyTwoOfTwoSuccess();
                    break;

                case 'done':
                    break;
            };
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
            var view = $state.current.name;
            $scope.input = $state.input;

            if (view === 'zest_station.make_keys'){
                $scope.at = 'make-keys';
                console.log('[ INIT ]');
                console.info('[ :Start Key Create Process: ]')
                $scope.initKeyCreate();

            } else if(view === 'zest_station.key_success'){
                $scope.initKeySuccess();

            } else if (view === 'zest_station.pickup_keys'){
                console.info('at : ',view);
                $stateParams.mode = zsModeConstants.PICKUP_KEY_MODE;
                $scope.at = 'select-keys-after-checkin';
                $scope.isPickupKeys = true;
                $state.isPickupKeys = true;


            } else {
                console.info('select-keys-after-checkin');
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
