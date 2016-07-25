admin.controller('ADCheckoutCtrl',['$scope','$rootScope','adCheckoutSrv','$state','roomTypes', function($scope,$rootScope,adCheckoutSrv,$state,roomTypes){

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
        $scope.roomTypes = roomTypes.room_types;
        $scope.excludedRoomTypes = [];
    };

    $scope.init();


    // to add to excluded room types
    $scope.clickExcludeRoomType = function(){
      $scope.excludedRoomTypes = [];
      angular.forEach($scope.roomTypes, function( value, key ) {
        if ( (value.ticked === true) && ( $scope.excludedRoomTypes.indexOf(value) === -1)) {
            $scope.excludedRoomTypes.push(value);
        }
      });
    };

    //remove exclude room type
    $scope.deleteRoomType = function(id){
      //remove from final array
      angular.forEach($scope.excludedRoomTypes,function(item, index) {
        if(item.id === id){
          $scope.excludedRoomTypes.splice(index,1);
        }
      });
      //untick from list
       angular.forEach($scope.roomTypes,function(item, index) {
        if(item.id === id){
          item.ticked = false;
        }
      });

    };

    /*
    * To fetch array after slicing from the index of the given value
    */
    $scope.getArrayAfterValue = function(value){
        if(typeof value !== 'undefined'){
            var index = $scope.hours.indexOf(value);
            var arrayAfterValue = ["HH"];
            for(var i = index; i < $scope.hours.length; i++){
                arrayAfterValue.push($scope.hours[i]);
            }

            return arrayAfterValue;
        }else{
            return [];
        }

    };

  /*
    * To fetch checkin details
    */
	$scope.fetchCheckoutDetails = function(){
        var fetchCheckoutDetailsFailureCallback = function(data) {
            $scope.$emit('hideLoader');
            $scope.isLoading = false;
        };
		var fetchCheckoutDetailsSuccessCallback = function(data) {

			$scope.$emit('hideLoader');
            $scope.isLoading = false;
			$scope.checkoutData = data;
            $scope.checkoutData.checkout_email_alert_time_hour = $scope.checkoutData.checkout_email_alert_time_hour === null? "HH":$scope.checkoutData.checkout_email_alert_time_hour;
            $scope.checkoutData.zest_checkout_alert_time_hour = $scope.checkoutData.zest_checkout_alert_time_hour === null? "HH":$scope.checkoutData.zest_checkout_alert_time_hour;
            $scope.checkoutData.zest_hourly_checkout_alert_time_hour = $scope.checkoutData.zest_hourly_checkout_alert_time_hour === null? "HH":$scope.checkoutData.zest_hourly_checkout_alert_time_hour;
            $scope.checkoutData.weekends_zest_hourly_checkout_alert_time_hour = $scope.checkoutData.weekends_zest_hourly_checkout_alert_time_hour === null? "HH":$scope.checkoutData.weekends_zest_hourly_checkout_alert_time_hour;
            $scope.checkoutData.weekends_checkout_email_alert_time_hour = $scope.checkoutData.weekends_checkout_email_alert_time_hour === null? "HH":$scope.checkoutData.weekends_checkout_email_alert_time_hour;
            $scope.checkoutData.weekends_zest_checkout_alert_time_hour = $scope.checkoutData.weekends_zest_checkout_alert_time_hour === null? "HH":$scope.checkoutData.weekends_zest_checkout_alert_time_hour;
            $scope.checkoutData.alternate_checkout_email_alert_time_hour = $scope.checkoutData.alternate_checkout_email_alert_time_hour === null? "HH":$scope.checkoutData.alternate_checkout_email_alert_time_hour;
            $scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour = $scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour === null? "HH":$scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour;


            $scope.checkoutData.checkout_email_alert_time_minute = $scope.checkoutData.checkout_email_alert_time_minute === null? "MM":$scope.checkoutData.checkout_email_alert_time_minute;
            $scope.checkoutData.zest_checkout_alert_time_minute = $scope.checkoutData.zest_checkout_alert_time_minute === null? "MM":$scope.checkoutData.zest_checkout_alert_time_minute;
            $scope.checkoutData.zest_hourly_checkout_alert_time_minute = $scope.checkoutData.zest_hourly_checkout_alert_time_minute === null? "MM":$scope.checkoutData.zest_hourly_checkout_alert_time_minute;
            $scope.checkoutData.weekends_zest_hourly_checkout_alert_time_minute = $scope.checkoutData.weekends_zest_hourly_checkout_alert_time_minute === null? "MM":$scope.checkoutData.weekends_zest_hourly_checkout_alert_time_minute;
            $scope.checkoutData.weekends_checkout_email_alert_time_minute = $scope.checkoutData.weekends_checkout_email_alert_time_minute === null? "MM":$scope.checkoutData.weekends_checkout_email_alert_time_minute;
            $scope.checkoutData.weekends_zest_checkout_alert_time_minute = $scope.checkoutData.weekends_zest_checkout_alert_time_minute === null? "MM":$scope.checkoutData.weekends_zest_checkout_alert_time_minute;
            $scope.checkoutData.alternate_checkout_email_alert_time_minute = $scope.checkoutData.alternate_checkout_email_alert_time_minute === null? "MM":$scope.checkoutData.alternate_checkout_email_alert_time_minute;
            $scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute = $scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute === null? "MM":$scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute;

            $scope.is_send_checkout_staff_alert_flag = ($scope.checkoutData.is_send_checkout_staff_alert === 'true') ? true:false;
            $scope.is_send_zest_checkout_alert_flag = ($scope.checkoutData.is_send_zest_checkout_alert === 'true') ? true:false;
			$scope.require_cc_for_checkout_email_flag = ($scope.checkoutData.require_cc_for_checkout_email === 'true') ? true:false;
			$scope.include_cash_reservationsy_flag = ($scope.checkoutData.include_cash_reservations === 'true') ? true:false;
		    angular.forEach($scope.roomTypes,function(roomType, index) {
                angular.forEach($scope.checkoutData.excluded_room_types,function(excludedRoomType, index) {
                if(parseInt(roomType.id) === parseInt(excludedRoomType)){
                    $scope.excludedRoomTypes.push(roomType);
                    roomType.ticked = true;// for the multi-select implementation
                }
            });
        });
            setWatchers();
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
        if($scope.checkoutData.checkout_email_alert_time_hour==='HH' || $scope.checkoutData.checkout_email_alert_time_minute === 'MM'){
            $scope.checkoutData.checkout_email_alert_time_hour = 'HH';
            $scope.checkoutData.checkout_email_alert_time_minute = 'MM';
            $scope.checkoutData.alternate_checkout_email_alert_time_hour = 'HH';
            $scope.checkoutData.alternate_checkout_email_alert_time_minute = 'MM';
        }
        if($scope.checkoutData.weekends_checkout_email_alert_time_hour === 'HH' || $scope.checkoutData.weekends_checkout_email_alert_time_minute === 'MM'){
            $scope.checkoutData.weekends_checkout_email_alert_time_minute = 'MM';
            $scope.checkoutData.weekends_checkout_email_alert_time_hour = 'HH';
            $scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute = 'MM';
            $scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour = 'HH';
        }
    };

  /*
    * To save checkout details
    * @param {data}
    *
    */

    $scope.saveCheckout = function(){

    	    $scope.checkoutData.is_send_checkout_staff_alert = ($scope.is_send_checkout_staff_alert_flag) ? 'true':'false';
            $scope.checkoutData.is_send_zest_checkout_alert = ($scope.is_send_zest_checkout_alert_flag) ? 'true':'false';
			$scope.checkoutData.require_cc_for_checkout_email = ($scope.require_cc_for_checkout_email_flag) ? 'true':'false';
			$scope.checkoutData.include_cash_reservations = ($scope.include_cash_reservationsy_flag) ?'true':'false';
			$scope.validateAlertTimings();
            var excluded_room_types = [];
            angular.forEach($scope.excludedRoomTypes,function(excludedRoomType, index) {
                excluded_room_types.push(excludedRoomType.id);
            });
            var uploadData = {
				'checkout_email_alert_time':$scope.checkoutData.checkout_email_alert_time_hour+":"+$scope.checkoutData.checkout_email_alert_time_minute,
                'zest_checkout_alert_time':$scope.checkoutData.zest_checkout_alert_time_hour+":"+$scope.checkoutData.zest_checkout_alert_time_minute,
                'zest_hourly_checkout_alert_time':$scope.checkoutData.zest_hourly_checkout_alert_time_hour+":"+$scope.checkoutData.zest_hourly_checkout_alert_time_minute,
                'alternate_checkout_email_alert_time':$scope.checkoutData.alternate_checkout_email_alert_time_hour+":"+$scope.checkoutData.alternate_checkout_email_alert_time_minute,
                'weekends_checkout_email_alert_time':$scope.checkoutData.weekends_checkout_email_alert_time_hour+":"+$scope.checkoutData.weekends_checkout_email_alert_time_minute,
                'weekends_zest_checkout_alert_time':$scope.checkoutData.weekends_zest_checkout_alert_time_hour+":"+$scope.checkoutData.weekends_zest_checkout_alert_time_minute,
                'weekends_zest_hourly_checkout_alert_time':$scope.checkoutData.weekends_zest_hourly_checkout_alert_time_hour+":"+$scope.checkoutData.weekends_zest_hourly_checkout_alert_time_minute,
                'alternate_weekends_checkout_email_alert_time':$scope.checkoutData.alternate_weekends_checkout_email_alert_time_hour+":"+$scope.checkoutData.alternate_weekends_checkout_email_alert_time_minute,
				'checkout_staff_alert_option':$scope.checkoutData.checkout_staff_alert_option,
				'emails':$scope.checkoutData.emails,
				'include_cash_reservations':$scope.checkoutData.include_cash_reservations,
				'is_send_checkout_staff_alert':$scope.checkoutData.is_send_checkout_staff_alert,
                'is_send_zest_checkout_alert' : $scope.checkoutData.is_send_zest_checkout_alert,
				'require_cc_for_checkout_email':$scope.checkoutData.require_cc_for_checkout_email,
                'staff_emails_for_late_checkouts':$scope.checkoutData.staff_emails_for_late_checkouts,
                'room_verification_instruction':$scope.checkoutData.room_verification_instruction,
                'excluded_room_types':excluded_room_types,
                'checkout_static_uri':$scope.checkoutData.checkout_static_uri
			};

        
    	var saveCheckoutDetailsSuccessCallback = function(data) {
    		$scope.$emit('hideLoader');
    	};
    	$scope.invokeApi(adCheckoutSrv.save, uploadData,saveCheckoutDetailsSuccessCallback);
    };

    var setWatchers = function(){
                $scope.$watch(function(){
                return $scope.checkoutData.zest_hourly_checkout_alert_time_hour;
            }, function(value) {
                    if($scope.checkoutData.zest_hourly_checkout_alert_time_hour === 4 ){
                         $scope.checkoutData.zest_hourly_checkout_alert_time_minute = "00";
                    }

                }
            );
            $scope.$watch(function(){
                return $scope.checkoutData.weekends_zest_hourly_checkout_alert_time_hour;
            }, function(value) {
                    if($scope.checkoutData.weekends_zest_hourly_checkout_alert_time_hour === 4 ){
                         $scope.checkoutData.weekends_zest_hourly_checkout_alert_time_minute = "00";
                    }

                }
            );
    }
    

}]);