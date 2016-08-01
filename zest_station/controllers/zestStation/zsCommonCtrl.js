sntZestStation.controller('zsCommonCtrl', [
	'$scope',
	'$state',
	'zsModeConstants',
	'zsEventConstants','$stateParams','ngDialog','zsTabletSrv',
	function($scope, $state, zsModeConstants, zsEventConstants,$stateParams,ngDialog,zsTabletSrv) {

	/**
	 * when we clicked on pickup key from home screen
	 */
	$scope.clickedOnPickUpKey = function() {
            $state.mode = zsModeConstants.PICKUP_KEY_MODE;
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.PICKUP_KEY_MODE
            });
	};

	/**
	 * when we clicked on checkin from home screen
	 */
	$scope.clickedOnCheckinButton = function() {
            $state.mode = zsModeConstants.CHECKIN_MODE;
            $state.go('zest_station.find_reservation_input_last', {
                mode: zsModeConstants.CHECKIN_MODE
            });
	};

	/**
	 * when we clicked on checkout from home screen
	 */
	$scope.clickedOnCheckoutButton = function() {
            $state.mode = zsModeConstants.CHECKOUT_MODE;
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.CHECKOUT_MODE
            });
	};
        
        $scope.navToHome = function(){
          $state.go('zest_station.home');
        };

        $scope.setTalkToStaff = function(){
            $scope.at = 'talk-to-staff';
            $scope.headingText = 'SPEAK_TO_STAFF';
            $scope.subHeadingText = 'SPEAK_TO_STAFF_SUB';

            $scope.modalBtn1 = 'SPEAK_TO_STAFF_RETURN';
            $scope.modalBtn2 = '';
            
            if($scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2 === "" ){
                console.info('wait...');
                $scope.messageOverride = false;
            } else{
                console.info('messageOverride: ',$scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2)
                $scope.messageOverride = true;//need to turn off translate 
                $scope.messageOverrideSpeak = $scope.zestStationData.zest_station_message_texts.speak_to_crew_mod_message2;
            }
            
            
        };


        $scope.init = function(){
            var current = $state.current.name;
          
            switch(current){
                case "zest_station.talk_to_staff":
                    $scope.setTalkToStaff();
                    break;
            }
            
            
        };
	/**
	 * [initializeMe description]
	 */
	var initializeMe = function() {
		//show back button
		$scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
                $scope.init();
	}();


}]);