admin.controller('ADCheckoutCtrl',['$scope','$rootScope','adCheckoutSrv','$state', function($scope,$rootScope,adCheckoutSrv,$state){

	$scope.errorMessage = '';

    BaseCtrl.call(this, $scope);

    $scope.init = function(){
    	$scope.checkoutData = {};
      	$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        $scope.minutes = ["00","15","30","45"];
        $scope.primeTimes = ["AM","PM"];
        $scope.isLoading = true;
    };

    $scope.init();
	
  /*
    * To fetch checkin details
    */
	$scope.fetchCheckoutDetails = function(){
        var fetchCheckoutDetailsFailureCallback = function(data) {
            $scope.$emit('hideLoader');
            $scope.isLoading = false;
        }
		var fetchCheckoutDetailsSuccessCallback = function(data) {
			
			$scope.$emit('hideLoader');
            $scope.isLoading = false;
			$scope.checkoutData = data;
			 $scope.is_send_checkout_staff_alert_flag = ($scope.checkoutData.is_send_checkout_staff_alert === 'true') ? true:false;
			 $scope.require_cc_for_checkout_email_flag = ($scope.checkoutData.require_cc_for_checkout_email === 'true') ? true:false;
			 $scope.include_cash_reservationsy_flag = ($scope.checkoutData.include_cash_reservations === 'true') ? true:false;
		};
		$scope.invokeApi(adCheckoutSrv.fetch, {},fetchCheckoutDetailsSuccessCallback,fetchCheckoutDetailsFailureCallback);
	};

	$scope.fetchCheckoutDetails();


  /*
    * To save checkout details
    * @param {data} 
    *
    */

    $scope.saveCheckout = function(){

    	    $scope.checkoutData.is_send_checkout_staff_alert = ($scope.is_send_checkout_staff_alert_flag) ? 'true':'false';
			$scope.checkoutData.require_cc_for_checkout_email = ($scope.require_cc_for_checkout_email_flag) ? 'true':'false';
			$scope.checkoutData.include_cash_reservations = ($scope.include_cash_reservationsy_flag) ?'true':'false';
			var uploadData = {
				'checkout_email_alert_time':$scope.checkoutData.checkout_email_alert_time_hour+":"+$scope.checkoutData.checkout_email_alert_time_minute,
				'checkout_staff_alert_option':$scope.checkoutData.checkout_staff_alert_option,
				'emails':$scope.checkoutData.emails,
				'include_cash_reservations':$scope.checkoutData.include_cash_reservations,
				 'is_send_checkout_staff_alert':$scope.checkoutData.is_send_checkout_staff_alert,
				'require_cc_for_checkout_email':$scope.checkoutData.require_cc_for_checkout_email
			};

        var saveCheckoutDetailsFailureCallback = function(data) {
             $scope.$emit('hideLoader');
          };
    	var saveCheckoutDetailsSuccessCallback = function(data) {
    		$scope.$emit('hideLoader');
    	}
    	$scope.invokeApi(adCheckoutSrv.save, uploadData,saveCheckoutDetailsSuccessCallback,saveCheckoutDetailsFailureCallback);
    };
  
 /**
    *   Method to go back to previous state.
    */
    $scope.backClicked = function(){
        
        if($rootScope.previousStateParam){
            $state.go($rootScope.previousState, { menu:$rootScope.previousStateParam});
        }
        else if($rootScope.previousState){
            $state.go($rootScope.previousState);
        }
        else 
        {
            $state.go('admin.dashboard', {menu : 0});
        }
    
    };
 

}]);