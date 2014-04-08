admin.controller('ADCheckinCtrl',['$scope','adCheckinSrv', function($scope,adCheckinSrv){

	BaseCtrl.call(this, $scope);
	$scope.checkinData = {};
	$scope.showingEmailOptions = false;
	$scope.emailDatas = {};
	
   /*
    * To fetch checkin details
    */
	$scope.fetchCheckinDetails = function(){
		var fetchCheckinDetailsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.checkinData = data;

			$scope.checkinData.is_send_alert_flag = ($scope.checkinData.is_send_alert === 'true') ? true:false;
			$scope.checkinData.is_send_checkin_staff_alert_flag = ($scope.checkinData.is_send_checkin_staff_alert === 'true') ? true:false;
			$scope.checkinData.is_notify_on_room_ready_flag = ($scope.checkinData.is_send_alert === 'true') ? true:false;
			$scope.checkinData.require_cc_for_checkin_email_flag = ($scope.checkinData.require_cc_for_checkin_email=== 'true') ? true:false;


			//to be deleted 
			

			 $scope.checkinData.checkin_alert_primetime = (!$scope.checkinData.checkin_alert_primetime)? "AM":$scope.checkinData.checkin_alert_primetime;
		
		};
		$scope.invokeApi(adCheckinSrv.fetch, {},fetchCheckinDetailsSuccessCallback);
	};

	$scope.fetchCheckinDetails();

	$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    $scope.minutes = ["00","15","30","45"];
    $scope.primeTimes = ["AM","PM"];


    $scope.saveCheckin = function(){

    	    $scope.checkinData.is_send_alert = ($scope.checkinData.is_send_alert_flag) ? 'true':'false';
			$scope.checkinData.is_send_checkin_staff_alert = ($scope.checkinData.is_send_checkin_staff_alert_flag) ? 'true':'false';
			$scope.checkinData.is_notify_on_room_ready = ($scope.checkinData.is_send_alert_flag) ?'true':'false';
			$scope.checkinData.require_cc_for_checkin_email = ($scope.checkinData.require_cc_for_checkin_email_flag) ? 'true':'false';

			var uploadData = {


				'checkin_alert_message': $scope.checkinData.checkin_alert_message,
				'checkin_staff_alert_option':$scope.checkinData.checkin_staff_alert_option,
				'emails':$scope.checkinData.emails,
				'is_notify_on_room_ready':$scope.checkinData.is_notify_on_room_ready,
				'is_send_alert':$scope.checkinData.is_send_alert,
				'is_send_checkin_staff_alert':$scope.checkinData.is_send_checkin_staff_alert,
				'prime_time':$scope.checkinData.checkin_alert_primetime,
				'checkin_alert_time':$scope.checkinData.checkin_alert_time_hour+":"+$scope.checkinData.checkin_alert_time_minute



			}

    	var saveCheckinDetailsSuccessCallback = function(data) {
    		$scope.$emit('hideLoader');
    	}
    	$scope.invokeApi(adCheckinSrv.save, uploadData,saveCheckinDetailsSuccessCallback);

    }


    $scope.showSendEmailOptions = function(){

    	$scope.showingEmailOptions = true;
    	$scope.emailTitle = 'Guests Checking In';
    	$scope.selectAllOption = false;


    	 var fetchEmailListSuccessCallback = function(data) {
    		$scope.$emit('hideLoader');
    		$scope.emailDatas  = data.due_out_guests;

    	angular.forEach($scope.emailDatas,function(item, index) {
 			   item.is_selected = false;
 		});

		console.log($scope.emailDatas)

    	}
    	$scope.invokeApi(adCheckinSrv.fetchEmailList, {},fetchEmailListSuccessCallback);
    	
    }


     $scope.$watch('emailDatas',function(){

    	$scope.disableSave = true;
    	angular.forEach($scope.emailDatas,function(item, index) {
 			  if(item.is_selected){
 			  
 			  	$scope.disableSave = false;
 			  }
 		});


    }, true);

    $scope.backActionFromEmail = function(){
    	$scope.showingEmailOptions = false;
    }




    $scope.toggleAllOptions = function(){

    	$scope.selectAllOption = $scope.selectAllOption ? false:true;

    	if($scope.selectAllOption){

    			angular.forEach($scope.emailDatas,function(item, index) {
 			   item.is_selected = true;
 			});


    	}
    	else{

    			angular.forEach($scope.emailDatas,function(item, index) {
 			   item.is_selected = false;
 			});


    	}
    }

   

    $scope.sendMailClicked = function(){

 
    	reservations = [];

    	angular.forEach($scope.emailDatas,function(item, index) {
 			   if(item.is_selected)
 			   	 reservations.push(item.reservation_id)
 		});
 		
    	var emailSendingData = {'reservations' : reservations}

    	 var sendMailClikedSuccessCallback = function(data) {
    		$scope.$emit('hideLoader');
   
    	}
    	$scope.invokeApi(adCheckinSrv.sendMail, emailSendingData,sendMailClikedSuccessCallback);
    	
    }


}]);