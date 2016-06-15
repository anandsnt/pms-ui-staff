sntZestStation.controller('zsCheckInKeysCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants',
	'zsTabletSrv',
	'zsUtilitySrv',
	'$stateParams',
	'$sce',
    '$filter',
	function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv, zsUtilitySrv, $stateParams, $sce, $filter) {

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
            
            if ($state.isPickupKeys && $state.qr_code){
                $state.mode = zsModeConstants.PICKUP_KEY_MODE;
                $state.lastAt = 'home';
                $state.isPickupKeys = true;
                $state.mode = zsModeConstants.PICKUP_KEY_MODE;
                $state.go('zest_station.reservation_search', {
                    mode: zsModeConstants.PICKUP_KEY_MODE
                });
            }
            
            if (current === 'zest_station.check_in_keys'){
                console.info('back called: go to card sign--> from: ',$state.current.name);
                $state.go ('zest_station.card_sign');
            }
            //$state.go ('zest_station.home');//go back to reservation search results
	});


        var hideNavButtons = function(){
            $scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);
            $scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
	};
        var hideBackButton = function(){
            $scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);
	};
        var showCloseButton = function(){
            $scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
        };
        
        var keyFromSocket = function(){
            if ($scope.zestStationData.keyWriter === 'websocket'){
                return true;
            } else {
                return false;
            }
        };
        var writeLocally = function(){
            if ($scope.zestStationData.keyWriter === 'local'){
                return true;
            } else {
                return false;
            }
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
		if ($stateParams.mode === zsModeConstants.PICKUP_KEY_MODE){
                    return true;
                } else if ($scope.isPickupKeys || $state.isPickupKeys){
                    return true;
                } else return false;
	};

        $scope.goToKeySuccess = function(){
            $scope.$emit("hideLoader");
            $state.go('zest_station.key_success');
            $scope.$emit("hideLoader");
        };

        $scope.makeKeys = function(n){
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
            if (!$scope.selectedReservation){
                if ($state.selectedReservation.room){
                    $scope.selectedReservation = $state.selectedReservation;
                }
            }
            if ($scope.zestStationData.show_room_number && $scope.selectedReservation.room){
                $scope.showRoomNumberOnKeySuccess = true;
            } else {
                $scope.showRoomNumberOnKeySuccess = false;
            }
        };
        $scope.showRoomNumberOnKeySuccess = false;

        $scope.fetchDoorLockSettings = function(){

            var onResponse = function(response){
                if (response.status !== 'failure'){
                    var remote  = (response.enable_remote_encoding) ? 'enabled'
                                                                    : 'disabled';
                                                                    console.info('remote: ',remote)
                    $scope.remoteEncoding = response.enable_remote_encoding;
                    console.info('$scope.remoteEncoding: ',$scope.remoteEncoding);
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
                $scope.oneKeySetup();
                
            } else {
                if ($state.input.madeKey === 0){
                    $scope.keyOneOfTwoSetup();//sets up screen and runs init to make first key

                } 
            }





        };
        $scope.initKeyCreate = function(){
            $scope.fetchDoorLockSettings();//get fresh settings on each call to ensure latest door lock settings are used, then continue using beginKeyEncode
        };
        $scope.keyTwoOfTwoSetup = function(){
                $scope.at = 'make-keys';

                $scope.headingText = 'MADE_FIRST_KEY_MSG';
                $scope.subHeadingText = 'MADE_FIRST_KEY_MSG_SUB';

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
            $scope.keyTwoOfTwoSetup();
        };


        $scope.makingKey = 1;
        $scope.successfulKeyEncode = function(response){
            console.info('$scope.successfulKeyEncode::response:: ',response);
            var success = (response.status === "success")? true : false;
            console.info('-->success? :: ',success);
            return success;
        };


        $scope.successMakeKey = function(response){
            console.info('success make key: ',response);
                var makeKeySuccess = $scope.successfulKeyEncode(response);
                if (makeKeySuccess){
                    $scope.prepForInService();
                    $state.selectedReservation.keySuccess = true;
                    $scope.zestStationData.wsIsOos = false;//after going home, reset this flag on success to overwrite any previous fail
                
                    if ($scope.makingKey === 1 && $scope.input.makeKeys === 1){
                        $scope.oneKeySuccess();

                    } else if($scope.makingKey === 1 && $scope.input.makeKeys === 2) {
                        $scope.keyOneOfTwoSuccess();

                    } else if($scope.makingKey === 2 && $scope.input.makeKeys === 2) {
                        $scope.keyTwoOfTwoSuccess();
                    }
                } else {
                    $scope.emitKeyError(response);
                };
        };
        
        var setFailureReason = function(response){
            var emptyHopper = 'card from hopper',
                    dateInPast = 'date is in the past',//ie. Reservation Check-out date is in the past, not a hardware failure
                    failedSocketConnectionText = 'SOCKET_FAILED',
                            hardwareFailure = false;
                    
                    var hopperIsEmpty = response.indexOf(emptyHopper) !== -1,
                            reservationDateInPast = response.indexOf(dateInPast) !== -1,
                            websocketFailure = response.indexOf(failedSocketConnectionText) !== -1;
                            
                    
            
            if($scope.isInCheckinMode()){
                
                if ( hopperIsEmpty ){
                    $scope.prepForOOS($filter('translate')('CHECKIN_KEY_FAIL_EMPTY'), true);
                    hardwareFailure = true;
                } else if ( reservationDateInPast ){
                    $scope.prepForOOS($filter('translate')('CHECKIN_KEY_FAIL_RESERVATION'), false);
                    hardwareFailure = false;
                } else {
                    $scope.prepForOOS($filter('translate')('CHECKIN_KEY_FAIL'), true);
                    hardwareFailure = true;
                }
                
            } else if ($scope.isInPickupKeyMode()){
                 
                if ( hopperIsEmpty ){
                    $scope.prepForOOS($filter('translate')('PICKUP_KEY_FAIL_EMPTY'), true);
                    hardwareFailure = true;
                } else if ( reservationDateInPast ){
                    $scope.prepForOOS($filter('translate')('PICKUP_KEY_FAIL_RESERVATION'), false);
                    hardwareFailure = false;
                } else {
                    $scope.prepForOOS($filter('translate')('PICKUP_KEY_FAIL'), true);
                    hardwareFailure = true;
                }
            }
            
            //if related to websocket failure, append info
            if ( websocketFailure ){
                hardwareFailure = true;
                $scope.prepForOOS($filter('translate')('SERVICE_FAILURE'), true);
            } 
            
            if ( hardwareFailure ){
                $state.selectedReservation.keySuccess = false;
                $scope.zestStationData.wsIsOos = true;//after going home, kiosk will be placed oos
            }
        };
        
        $scope.emitKeyError = function(response){
            console.info('detected error in make key',response);
            response = !!response ? "" :response;
            setFailureReason(response);
            $scope.$emit('MAKE_KEY_ERROR',response);
            showCloseButton();
            //$scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS,{'status':false,'reason':$scope.zestStationData.workstationOooReason});
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
        
        var options = {};
        options["successCallBack"] = $scope.successCallBackSwipe;
        options["failureCallBack"] = $scope.failureCallBackSwipe;

        $scope.numberOfCordovaCalls = 0;
        
        $scope.cardwriter = new CardOperation();
        var initCardWrite = function(data){
                var isIpad = (navigator.userAgent.match(/iPad/i) !== null || navigator.userAgent.match(/iPhone/i) !== null) && window.cordova;
                if (writeLocally() && isIpad) {
                    $scope.cardwriter.retrieveCardInfo({'successCallBack':onSuccessLocalKeyWrite,'failureCallBack': $scope.emitKeyError});
                } else if (isIpad) {
                    //If cordova not loaded in server, or page is not yet loaded completely
                    //One second delay is set so that call will repeat in 1 sec delay
                    if ($scope.numberOfCordovaCalls < 50) {
                        setTimeout(function() {
                            $scope.numberOfCordovaCalls = parseInt($scope.numberOfCordovaCalls) + parseInt(1);
                            initCardWrite(data);
                        }, 2000);
                    }
        };
        };
        $scope.initMakeKey = function(n){
            $scope.makingKey = n;
            $state.nextKey = n+1;
            var options = $scope.getKeyOpts();
            
                setTimeout(function(){
                    $state.keyDispenseUID = '';//used if

                    var onResponseSuccess;
                        options.is_kiosk = true;
                        
                    if (!$scope.remoteEncoding){
                        options.uid = null;//for sankyo key card encoding
                        
                        //local encoding + sankyo
                        if (keyFromSocket()){
                            onResponseSuccess = $scope.printLocalKey;
                        } else if (writeLocally()){
                            //local encoding + infinea
                            $scope.printLocalKeyCordova();
                            return;
                        }
                    } else {
                        //remote + remote
                        onResponseSuccess = $scope.successMakeKey;
                    }
                    console.info('options.is_additional: ',options.is_additional);
                        var printAPI = {
                            "is_additional":options.is_additional,
                            //"is_additional":false,
                            "is_kiosk":true,
                            "key":1,
                            "reservation_id":options.reservation_id
                        };

                        if (!$scope.remoteEncoding){
                            printAPI.uid = null;
                        } else {
                            printAPI.key_encoder_id = $state.encoder;
                        }

                        if ($scope.inDemoMode()){
                            onResponseSuccess({'status':'success'});
                        } else {
                            $scope.callAPI(zsTabletSrv.encodeKey, {
                                params: printAPI,
                                'successCallBack':onResponseSuccess,
                                'failureCallBack':$scope.emitKeyError
                            });
                        }
                        
                      
                },2000);
        };
       
        $scope.$on('DISPENSE_SUCCESS',function(event, data) {
             $scope.initSankyoCmd(data.cmd, data.msg);
        });
        $scope.$on('DISPENSE_FAILED',function(event, data) {
             $scope.initSankyoCmd(data.cmd, data.msg);
        });
        var dispenseKey = function(){
            $scope.socketOperator.DispenseKey($scope.dispenseKeyData);
        };
        $scope.$on('SOCKET_FAILED',function(){ 
             $scope.emitKeyError('Dispense Key failed, SOCKET_FAILED');
        });
        $scope.$on('SOCKET_CONNECTED',function(){ 
            dispenseKey();
        });
        $scope.DispenseKey = function(){
            //check if socket is open
            console.info('dispense called :: socketOperator: ',$scope.socketOperator.returnWebSocketObject());
            if($scope.socketOperator.returnWebSocketObject().readyState === 1){
                dispenseKey();
            }
            else{
                $scope.$emit('CONNECT_WEBSOCKET'); // connect socket
            }
            console.log($scope.dispenseKeyData);
            
        };
        $scope.getKeyInfoFromResponse = function(response){
            if (response && response.data){
                if (response.data.key_info && response.data.key_info[0]){
                    if (response.data.key_info[0].base64){
                        return response.data.key_info[0].base64;
                    }
                }
                
            }
            return "";
          
        };
        $scope.printLocalKey = function(response){
            console.info('print local key success, ',response);
           if ($scope.successfulKeyEncode(response)){//This may need to go away, read response differently than encode success from print_key
               $scope.prepForInService();
                $state.selectedReservation.keySuccess = true;
                $scope.zestStationData.wsIsOos = false;//after going home, reset this flag on success to overwrite any previous fail
                
                if ($scope.inDemoMode()){
                    setTimeout(function(){
                        initKeySuccessFlowForLocal();
                    },1200)//add some delay for demo purposes
                    
                } else {
                    $scope.dispenseKeyData = $scope.getKeyInfoFromResponse(response);
                    //$scope.connectWebSocket();//after the connect delay, will open and connect to the rover windows service, to use the sankyo device
                    setTimeout(function(){//starts the key dispense/write/eject functions in sankyo
                        //$scope.UUIDforDevice();
                            $scope.DispenseKey();
                    },2500);
                }
            } else {
                console.info('print local key, actually was a failure...');
                $scope.emitKeyError(response);
            }
        };
        
        
        
        var callKeyFetchAPI = function(cardInfo){
            var reservationId = $scope.selectedReservation.reservation_id;

	    var postParams = {"reservation_id": reservationId, "key": 1, "is_additional": true};
            if ($scope.makingKey === 1){
                postParams.is_additional = false;
            } else {
                postParams.is_additional = true;
            }
            
	    if(typeof cardInfo !== 'undefined'){
	    	postParams.card_info = cardInfo;
	    } else {
	    	postParams.card_info = "";
	    }
            $scope.callAPI(zsTabletSrv.encodeKey, {
                params: postParams,
                'successCallBack':keyFetchSuccess,
                'failureCallBack':$scope.emitKeyError
            });
	};
        
        var keyFetchSuccess = function(response){
            $scope.keyData = response.data;
            printKeys();
            
        };
        
        /*
	* Calculate the keyWrite data from the API response and call the write key method for key writing.
	*/
	var printKeys = function(){
	    writeKey($scope.keyData, $scope.makingKey);
	};
        
	/*
	* Calls the cordova service to write the keys
	*/
       var onSuccessWriteKeyDataLocal = function(response){
            //if the setting of smart band create along with key creation enabled, we will create a smartband with open room charge
            continueFromCordovaKeyWrite(response);
       };
       
	var writeKey = function(keyWriteData, index){
		var keyData = [];
		keyData.push(JSON.stringify(keyWriteData));

		var options = {
			//Cordova write success callback. If all the keys were written sucessfully, show key success message
			//If keys left to print, call the cordova write key function to write the pending key
			'successCallBack': onSuccessWriteKeyDataLocal,
			'failureCallBack': $scope.emitKeyError,
			'arguments': keyData
		};
                $scope.cardwriter.writeKeyData(options);
	};
        
        
        var continueFromCordovaKeyWrite = function(response){
            $scope.prepForInService();
            switch ($scope.makeKeyParam()){
                case 'one':
                $scope.input.madeKey = 1;
                
                $scope.goToKeySuccess();
                break;

                case 'first':
                $scope.keyOneOfTwoSuccess();
                break;

                case 'second':
                $scope.keyTwoOfTwoSuccess();
                break;

                case 'done':
                break;
            };
        };
        var onSuccessLocalKeyWrite = function(card_info){
            callKeyFetchAPI(card_info);
            //then, continueFromCordovaKeyWrite();
        };
        $scope.printLocalKeyCordova = function(response){
            initCardWrite(response);
        };

        $scope.makeKeyParam = function(){
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


        $scope.saveUIDToReservation = function(uid){
                var onResponse = function(){
                    $scope.$emit("hideLoader");
                };
             $scope.callAPI(zsTabletSrv.saveUIDtoRes, {
                params: {
                    reservation_id: $scope.selectedReservation.reservation_id,
                    uid: uid
                },
                'successCallBack':onResponse,
                'failureCallBack':onResponse
            });
        };
         
        $scope.initSankyoCmd = function(cmd, msg){//should only init this if a dispense was called...
            if (typeof msg === typeof "str"){
                if (msg.toLowerCase().indexOf('invalid') !== -1){//bad setting, etc..
                    $scope.emitKeyError(msg);
                    return;
                    
                } else if (msg.toLowerCase().indexOf('unable') !== -1){//unable to connect / initialize for some reason..
                    $scope.emitKeyError(msg);
                    return;
                    
                } else if (msg.toLowerCase().indexOf('failed') !== -1){//failed to connec to sankyo [ com port?]
                    $scope.emitKeyError(msg);
                    return;
                    
                } else if (msg.toLowerCase().indexOf('card from hopper') !== -1){
                    $scope.prepForOOS($filter('translate')('PICKUP_KEY_FAIL_EMPTY'), true);//root ctrl, hardware failure, put oos
                    console.warn('Setting out of order due to empty key dispenser');
                    $scope.emitKeyError(msg);
                    return;
                } 
            }


            if (cmd === 'cmd_dispense_key_card'){
                $scope.saveUIDToReservation(msg);//msg is the uid of the card, which needs to be saved to the reservation
            };
            initKeySuccessFlowForLocal();

        };


        var initKeySuccessFlowForLocal = function(){
            switch ($scope.makeKeyParam()){
                case 'one':
                $scope.input.madeKey = 1;
                
                $scope.goToKeySuccess();
                break;

                case 'first':
                $scope.keyOneOfTwoSuccess();
                break;

                case 'second':
                $scope.keyTwoOfTwoSuccess();
                break;

                case 'done':
                break;
            };
        }



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
            
            //hideNavButtons();
            hideBackButton();
            showCloseButton();

            if (view === 'zest_station.make_keys'){
                $scope.at = 'make-keys';
                $scope.initKeyCreate();

            } else if(view === 'zest_station.key_success'){
                $scope.initKeySuccess();

            } else if (view === 'zest_station.pickup_keys'){
                $stateParams.mode = zsModeConstants.PICKUP_KEY_MODE;
                $scope.at = 'select-keys-after-checkin';
                $scope.isPickupKeys = true;
                $state.isPickupKeys = true;

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
