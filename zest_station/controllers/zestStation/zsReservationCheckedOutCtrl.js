sntZestStation.controller('zsReservationCheckedOutCtrl', [
	'$scope',
	'$state',
    'zsUtilitySrv',
	'zsTabletSrv',
    'zsEventConstants',
    '$stateParams',
    'zsModeConstants',
    '$window',
	function($scope, $state,zsUtilitySrv, zsTabletSrv,zsEventConstants,$stateParams,zsModeConstants,$window) {

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

       // we check if the reservation has an email id and the admin settings for 
       // email bill is set as true
       if($stateParams.email.length === 0 && $scope.zestStationData.guest_bill.email){
            $scope.mode       = "email-mode";
            $scope.emailError = false;
       }
       //else we check if admin settings for print bill is set as true
       else if($scope.zestStationData.guest_bill.print){
            $scope.mode       = "print-mode";
            $scope.email      = $stateParams.email;
       }
       else{
             $scope.mode = "final-mode";
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
            $scope.zestStationData.guest_bill.print ? $scope.mode = "print-mode" : $scope.mode = "final-mode";;
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
        
        try{
          $window.print();
          if ( sntapp.cordovaLoaded ) {
              cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
          };
          $scope.printOpted = true;
          $scope.mode = "final-mode";
        }
        catch(e){
          
        }
    };  

}]);