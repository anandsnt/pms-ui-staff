  admin.controller('ADCheckinCtrl',['$scope','adCheckinSrv','$state', function($scope,adCheckinSrv,$state){
    
    $scope.errorMessage = '';

  	BaseCtrl.call(this, $scope);

      $scope.init = function(){
          $scope.checkinData = {};
          $scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
          $scope.minutes = ["00","15","30","45"];
          $scope.primeTimes = ["AM","PM"];
          $scope.isLoading = true;
          $scope.hideAlertOption = false;
      };

      $scope.init();
  
     /*
      * To fetch checkin details
      */
      $scope.fetchCheckinDetails = function(){

         var fetchCheckinDetailsFailureCallback = function(data) {
          $scope.$emit('hideLoader');
           $scope.isLoading = false;

        };
        var fetchCheckinDetailsSuccessCallback = function(data) {
          $scope.$emit('hideLoader');
           $scope.isLoading = false;
          $scope.checkinData = data;
          $scope.checkinData.is_send_alert_flag = ($scope.checkinData.is_send_alert === 'true') ? true:false;
          $scope.checkinData.is_send_checkin_staff_alert_flag = ($scope.checkinData.is_send_checkin_staff_alert === 'true') ? true:false;
          $scope.checkinData.is_notify_on_room_ready_flag = ($scope.checkinData.is_notify_on_room_ready === 'true') ? true:false;
          $scope.checkinData.require_cc_for_checkin_email_flag = ($scope.checkinData.require_cc_for_checkin_email=== 'true') ? true:false;


          $scope.$watch('checkinData.is_send_checkin_staff_alert_flag',function(){
             $scope.hideAlertOption = $scope.checkinData.is_send_checkin_staff_alert_flag ? false : true;
          })
              //to be confirmed 
              $scope.checkinData.checkin_alert_primetime = (!$scope.checkinData.checkin_alert_primetime)? "AM":$scope.checkinData.checkin_alert_primetime;
          };
          $scope.invokeApi(adCheckinSrv.fetch, {},fetchCheckinDetailsSuccessCallback,fetchCheckinDetailsFailureCallback);
      };

      $scope.fetchCheckinDetails();
  
   /*
      * To save checkin details
      * @param {data} 
      *
      */
      $scope.saveCheckin = function(){

         $scope.checkinData.is_send_alert = ($scope.checkinData.is_send_alert_flag) ? 'true':'false';
         $scope.checkinData.is_send_checkin_staff_alert = ($scope.checkinData.is_send_checkin_staff_alert_flag) ? 'true':'false';
         $scope.checkinData.is_notify_on_room_ready = ($scope.checkinData.is_notify_on_room_ready_flag) ?'true':'false';
         $scope.checkinData.require_cc_for_checkin_email = ($scope.checkinData.require_cc_for_checkin_email_flag) ? 'true':'false';

         var uploadData = {
          'checkin_alert_message': $scope.checkinData.checkin_alert_message,
          'checkin_staff_alert_option':$scope.checkinData.checkin_staff_alert_option,
          'emails':$scope.checkinData.emails,
          'is_notify_on_room_ready':$scope.checkinData.is_notify_on_room_ready,
          'is_send_alert':$scope.checkinData.is_send_alert,
          'is_send_checkin_staff_alert':$scope.checkinData.is_send_checkin_staff_alert,
          'prime_time':$scope.checkinData.checkin_alert_primetime,
          'checkin_alert_time':$scope.checkinData.checkin_alert_time_hour+":"+$scope.checkinData.checkin_alert_time_minute,
          'require_cc_for_checkin_email' : $scope.checkinData.require_cc_for_checkin_email
      };
      var saveCheckinDetailsFailureCallback = function(data) {
        $scope.$emit('hideLoader');
     };

      var saveCheckinDetailsSuccessCallback = function(data) {
        $scope.$emit('hideLoader');
     };
    $scope.invokeApi(adCheckinSrv.save, uploadData,saveCheckinDetailsSuccessCallback,saveCheckinDetailsFailureCallback);
  };

    $scope.gotToDashboard = function(){

      $state.go('admin.dashboard', {
          menu : 1
      });
  };

  }]);