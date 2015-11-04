sntZestStation.controller('zsReservationCheckedOutCtrl', [
	'$scope',
	'$state',
    'zsUtilitySrv',
	'zsTabletSrv',
    'zsEventConstants',
    '$stateParams',
    'zsModeConstants',
	function($scope, $state,zsUtilitySrv, zsTabletSrv,zsEventConstants,$stateParams,zsModeConstants) {

	BaseCtrl.call(this, $scope);
    
	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
        $state.go('zest_station.review_bill',{"res_id":$stateParams.res_id});
	});


  

    var init = function(){

       $scope.email = "";

       if($stateParams.email.length !== 0){
            $scope.mode       = "print-mode";
            $scope.email      = $stateParams.email;
       }else{
            $scope.mode       = "email-mode";
            $scope.emailError = false;
       }
       
       $scope.printOpted = false;
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
                
        init();
	}();


    $scope.clickedPrint = function(){
        $scope.mode = "final-mode";
        $scope.printOpted = true;
    };
    
    $scope.clickedNoThanks = function(){
        $scope.mode = "final-mode";
    };

    $scope.goToNext = function(){
        $scope.mode = "final-mode";
    };
        
    $scope.saveEmail = function(){
        if($scope.email.length === 0){
            return;
        }
        else{
            if(zsUtilitySrv.isValidEmail($scope.email)){
                $scope.mode = "print-mode";
            }
            else{
                $scope.emailError = true;
            }
        }
    };

    $scope.reTypeEmail = function(){
        $scope.emailError = false;
    };
    $scope.printBill= function(){
        $scope.mode = "final-mode";
    };  

}]);