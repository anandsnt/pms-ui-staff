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
            $scope.modalBtn1 = 'NEXT_BTN';
            $scope.input.madeKey = 1;
            $scope.input.makeKeys = 1;
        };
        $scope.makeKeyTwo = function(){
            $scope.input.makeKeys = 2;
            initKeyCreate();  
        };
        $scope.initKeyCreate = function(){
            
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
            console.info('success, made key: [ 1 ] of [ 1 ]');
        };
       $scope.keyOneOfTwoSuccess = function(){
            $scope.input.madeKey = 1;
            console.info('success, made key: [ 1 ] of [ 2 ]');
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
            console.log($scope.zestStationData)
            console.log('$scope.zestStationData',$scope.selectedReservation)
            var options = {
                card_info: "",
                key: $scope.makingKey,
                key_encoder_id: sntZestStation.encoder,
                reservation_id: $scope.selectedReservation.id
            };
            console.warn('$scope.isInPickupKeyMode(): ',$scope.isInPickupKeyMode())
            if ($scope.isInPickupKeyMode()){
                options.reservation_id = $scope.selectedReservation.reservation_id;
            }
            
            
            if ($scope.makingKey === 1){
                options.is_additional = false;
            } else {
                options.is_additional = true;
            }
            
            $scope.callAPI(zsTabletSrv.encodeKey, {
                params: options,
                'successCallBack':$scope.successMakeKey,
                'failureCallBack':$scope.emitKeyError
            });
            
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
            console.info('init: with reservation: ',$scope.selectedReservation);
            console.info('$state.current.name: ',$state.current.name)
            if ($state.current.name === 'zest_station.make_keys'){
                $scope.at = 'make-keys';
                $scope.initKeyCreate();
            } else if($state.current.name === 'zest_station.key_success'){
                $scope.at = 'key-success';
                $scope.initKeySuccess();
            } else if ($state.current.name === 'zest_station.pickup_keys'){
                $stateParams.mode = zsModeConstants.PICKUP_KEY_MODE;
                console.info('$stateParams.mode: ',$stateParams.mode)
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