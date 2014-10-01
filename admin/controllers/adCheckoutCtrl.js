admin.controller('ADCheckoutCtrl',['$scope','$rootScope','adCheckoutSrv','$state', function($scope,$rootScope,adCheckoutSrv,$state){

	$scope.errorMessage = '';

    BaseCtrl.call(this, $scope);

    /*
    * To fetch checkin details
    */
    $rootScope.previousState = 'admin.dashboard';
    $rootScope.previousStateParam = '1';

    $scope.init = function(){
    	$scope.checkoutData = {};
      	$scope.hours = ["HH","01","02","03","04","05","06","07","08","09","10","11","12"];
        $scope.minutes = ["MM","00","15","30","45"];
        $scope.primeTimes = ["AM","PM"];
        $scope.isLoading = true;
    };

    $scope.init();

    /*
    * To fetch array after slicing from the index of the given value
    */
    $scope.getArrayAfterValue = function(value){
        if(typeof value != 'undefined'){
            var index = $scope.hours.indexOf(value);
            var arrayAfterValue = ["HH"];
            for(var i = index; i < $scope.hours.length; i++){
                arrayAfterValue.push($scope.hours[i]);
            }
            
            return arrayAfterValue;
        }else{
            return [];
        }
        
    }
	
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
            $scope.checkoutData.checkout_email_alert_time_hour = $scope.checkoutData.checkout_email_alert_time_hour == null? "HH":$scope.checkoutData.checkout_email_alert_time_hour;
            $scope.checkoutData.weekends_checkout_email_alert_time_hour = $scope.checkoutData.weekends_checkout_email_alert_time_hour == null? "HH":$scope.checkoutData.weekends_checkout_email_alert_time_hour;
            $scope.checkoutData.alternate_checkout_email_alert_time_hour = $scope.checkoutData.alternate_checkout_email_alert_time_hour == null? "HH":$scope.checkoutData.alternate_checkout_email_alert_time_hour;            
            $scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour = $scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour == null? "HH":$scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour;

            $scope.checkoutData.checkout_email_alert_time_minute = $scope.checkoutData.checkout_email_alert_time_minute == null? "MM":$scope.checkoutData.checkout_email_alert_time_minute;
            $scope.checkoutData.weekends_checkout_email_alert_time_minute = $scope.checkoutData.weekends_checkout_email_alert_time_minute == null? "MM":$scope.checkoutData.weekends_checkout_email_alert_time_minute;
            $scope.checkoutData.alternate_checkout_email_alert_time_minute = $scope.checkoutData.alternate_checkout_email_alert_time_minute == null? "MM":$scope.checkoutData.alternate_checkout_email_alert_time_minute;
            $scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute = $scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute == null? "MM":$scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute;
			 
             $scope.is_send_checkout_staff_alert_flag = ($scope.checkoutData.is_send_checkout_staff_alert === 'true') ? true:false;       
			 $scope.require_cc_for_checkout_email_flag = ($scope.checkoutData.require_cc_for_checkout_email === 'true') ? true:false;
			 $scope.include_cash_reservationsy_flag = ($scope.checkoutData.include_cash_reservations === 'true') ? true:false;
		};
		$scope.invokeApi(adCheckoutSrv.fetch, {},fetchCheckoutDetailsSuccessCallback,fetchCheckoutDetailsFailureCallback);
	};

	$scope.fetchCheckoutDetails();

    /*
    * To validate the time entries
    * @param {data} 
    *
    */

    $scope.validateAlertTimings = function(){
        if($scope.checkoutData.checkout_email_alert_time_hour=='HH' || $scope.checkoutData.checkout_email_alert_time_minute == 'MM'){
            $scope.checkoutData.checkout_email_alert_time_hour = 'HH';
            $scope.checkoutData.checkout_email_alert_time_minute = 'MM';
            $scope.checkoutData.alternate_checkout_email_alert_time_hour = 'HH';
            $scope.checkoutData.alternate_checkout_email_alert_time_minute = 'MM';
        }
        if($scope.checkoutData.weekends_checkout_email_alert_time_hour == 'HH' || $scope.checkoutData.weekends_checkout_email_alert_time_minute == 'MM'){
            $scope.checkoutData.weekends_checkout_email_alert_time_minute = 'MM';
            $scope.checkoutData.weekends_checkout_email_alert_time_hour = 'HH';
            $scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute = 'MM';
            $scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour = 'HH';
        }
    }

  /*
    * To save checkout details
    * @param {data} 
    *
    */

    $scope.saveCheckout = function(){

    	    $scope.checkoutData.is_send_checkout_staff_alert = ($scope.is_send_checkout_staff_alert_flag) ? 'true':'false';
			$scope.checkoutData.require_cc_for_checkout_email = ($scope.require_cc_for_checkout_email_flag) ? 'true':'false';
			$scope.checkoutData.include_cash_reservations = ($scope.include_cash_reservationsy_flag) ?'true':'false';
			$scope.validateAlertTimings();
            var uploadData = {
				'checkout_email_alert_time':$scope.checkoutData.checkout_email_alert_time_hour+":"+$scope.checkoutData.checkout_email_alert_time_minute,
                'alternate_checkout_email_alert_time':$scope.checkoutData.alternate_checkout_email_alert_time_hour+":"+$scope.checkoutData.alternate_checkout_email_alert_time_minute,
                'weekends_checkout_email_alert_time':$scope.checkoutData.weekends_checkout_email_alert_time_hour+":"+$scope.checkoutData.weekends_checkout_email_alert_time_minute,
                'alternate_weekends_checkout_email_alert_time':$scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour+":"+$scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute,
				'checkout_staff_alert_option':$scope.checkoutData.checkout_staff_alert_option,
				'emails':$scope.checkoutData.emails,
				'include_cash_reservations':$scope.checkoutData.include_cash_reservations,
				'is_send_checkout_staff_alert':$scope.checkoutData.is_send_checkout_staff_alert,
				'require_cc_for_checkout_email':$scope.checkoutData.require_cc_for_checkout_email,
                'staff_emails_for_late_checkouts':$scope.checkoutData.staff_emails_for_late_checkouts
			};

        var saveCheckoutDetailsFailureCallback = function(data) {
             $scope.$emit('hideLoader');
          };
    	var saveCheckoutDetailsSuccessCallback = function(data) {
    		$scope.$emit('hideLoader');
    	}
    	$scope.invokeApi(adCheckoutSrv.save, uploadData,saveCheckoutDetailsSuccessCallback,saveCheckoutDetailsFailureCallback);
    };

}]);