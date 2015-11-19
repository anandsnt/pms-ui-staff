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
            console.info('called go back')	
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
		return ($stateParams.mode === zsModeConstants.PICKUP_KEY_MODE);
	};

        $scope.goToKeySuccess = function(){
            setTimeout(function(){
                $state.go('zest_station.key_success')
            },500);
            
        };
        
        $scope.makeKeys = function(){
            $state.passParams = $scope.input;
            $state.go('zest_station.make_keys');
          
        };
        $scope.initKeySuccess = function(){
            $state.passParams = $scope.input;
          
            $scope.headingText = 'Success!';
            $scope.subHeadingText = 'Please grab your key from the target below';
            $scope.modalBtn1 = 'Next';
            $scope.input.madeKey = 1;
            $scope.input.makeKeys = 1;
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

            var oneKeySetup = function(){
                $scope.at = 'make-keys';

                $scope.headingText = 'Make your key.';
                $scope.subHeadingText = 'Select a blank key from the bowl and place it on the target below. When the green light appears, the key is made';
                $scope.modalBtn1 = 'Next';
                $scope.input.madeKey = 0;
            };
            
            


            var keyOneOfTwoSetup = function(){
                $scope.input.madeKey = 0;
                $scope.at = 'make-keys';

                $scope.setLast('select-keys-after-checkin');
                $scope.headingText = 'Make your first key!';
                $scope.subHeadingText = 'Select a Blank Key from the Bowl and place it on the target below. \n\
                                                When the green light appears, the key is made.';
            };
            var keyOneOfTwoSuccess = function(){
                setTimeout(function(){
                    $scope.input.madeKey = 1;
                    $scope.goToKeySuccess();

                    $scope.headingText = 'Success! Make your second key';
                    $scope.subHeadingText = 'Remove the first key, select a Blank Key from the Bowl and place it on the target below.\n\
                                                When the green light appears, the key is made.';
                    $scope.modalBtn1 = 'Make Key 2/2';

                },2500);
            };


            var keyTwoOfTwoSetup = function(){
                $scope.at = 'make-keys';

                $scope.headingText = 'Make your second key';
                $scope.subHeadingText = 'Remove the first key, select a Blank Key from the Bowl and place it on the target below.\n\
                                            When the green light appears, the key is made.';
            };
            var keyTwoOfTwoSuccess = function(){
                setTimeout(function(){
                    $scope.input.madeKey = 2;
                    $scope.goToScreen(null, 'key-success', true, $scope.from);

                    $scope.headingText = 'Success!';
                    $scope.subHeadingText = 'Please grab your keys from the target below';
                    $scope.modalBtn1 = 'Next';
                },2500);
            };


            if (make_1_key){
                oneKeySetup();
                $scope.initMakeKey(1);
                //oneKeySuccess();
                
            } else if (make_2_keys){
                //at first key
                if ($scope.input.madeKey === 0){
                    keyOneOfTwoSetup();
                    keyOneOfTwoSuccess();
                } else if($scope.input.madeKey === 1) {
                    keyTwoOfTwoSetup();
                    keyTwoOfTwoSuccess();
                } 
            }
            
            
        };
        
       $scope.oneKeySuccess = function(){
            $scope.goToKeySuccess();

            $scope.headingText = 'Success!';
            $scope.subHeadingText = 'Please grab your key from the target below';
            $scope.modalBtn1 = 'Next';
            $scope.input.madeKey = 1;
        };
        
        
        
        $scope.$watch('encoder',function(){
           console.info(arguments) 
        });
        $scope.makingKey = 1;
        $scope.initMakeKey = function(n){
            $scope.makingKey = n;
            var successMakeKey = function(response){
                console.info('success!');
                console.info(response);
                $scope.oneKeySuccess();
            };
            var failureMakeKey = function(response){
                //$scope.$emit('GENERAL_ERROR',response);
                $scope.$emit('MAKE_KEY_ERROR',response);
                
            };
            var options = {
                card_info: "",
                is_additional: true,
                key: $scope.makingKey,
                key_encoder_id: $scope.zestStationData.encoder,
                reservation_id: $scope.selectedReservation.id
            };
            $scope.callAPI(zsTabletSrv.encodeKey, {
                params: options,
                'successCallBack':successMakeKey,
                'failureCallBack':failureMakeKey
            });
            
        };

        $scope.deliverRegistration = function(){
            $state.go('zest_station.delivery_options');
        };



        $scope.init = function(){
            $scope.selectedReservation = $state.selectedReservation;
            
            console.info('$state',$state);
            console.log('$state.current',$state.current)
            if ($state.current.name === 'zest_station.make_keys'){
                console.log('going to make keys')
                $scope.at = 'make-keys';
                $scope.initKeyCreate();
            } else if($state.current.name === 'zest_station.key_success'){
                $scope.at = 'key-success';
                $scope.initKeySuccess();
            } else {
                $scope.at = 'select-keys-after-checkin';
                console.info('select keys ')
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