  admin.controller('ADCheckinCtrl',['$scope','$rootScope','adCheckinSrv','$state', function($scope,$rootScope,adCheckinSrv,$state){
    
    $scope.errorMessage = '';

  	BaseCtrl.call(this, $scope);

     /*
    * To set the preveous state as admin.dashboard/Zest in all cases
    */
    $rootScope.previousState = 'admin.dashboard';
    $rootScope.previousStateParam = '1';

      $scope.init = function(){
          $scope.checkinData = {};
          $scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
          $scope.minutes = -["00","15","30","45"];
          $scope.primeTimes = ["AM","PM"];
          $scope.isLoading = true;
          $scope.hideAlertOption = false;
          $scope.prior_minutes = [];
            for (var i=15; i<=300; i=i+15){
              $scope.prior_minutes.push(i);
            }
            $scope.excludedRateCodes=[];
            $scope.excludedBlockCodes=[];

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
          //$scope.checkinData.is_precheckin_only_flag = ($scope.checkinData.is_precheckin_only=== 'true') ? true:false;
          //$scope.checkinData.is_sent_to_que_flag = ($scope.checkinData.is_sent_to_que=== 'true') ? true:false;
$scope.checkinData.is_precheckin_only_flag = true;
$scope.checkinData.is_sent_to_que_flag = true;
$scope.checkinData.rate_codes=[{"value":"1", "name":"aaa", "code":"AAA"}, {"value":"2", "name":"bbb", "code":"BBB"}];
$scope.checkinData.block_codes=[{"value":"1", "name":"aaa", "code":"AAA"}, {"value":"2", "name":"bbb", "code":"BBB"}];
          $scope.$watch('checkinData.is_send_checkin_staff_alert_flag',function(){
             $scope.hideAlertOption = $scope.checkinData.is_send_checkin_staff_alert_flag ? false : true;
          })

          $scope.$watch('checkinData.is_precheckin_only_flag',function(){
             $scope.hideAddOption = $scope.checkinData.is_precheckin_only_flag ? false : true;
          })

          $scope.$watch('checkinData.is_sent_to_que_flag',function(){
             $scope.hidePriorMinutes = ($scope.checkinData.is_sent_to_que_flag === 'yes') ? false : true;
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
  $scope.clickExcludeRateCode = function(){
    //Removing the selected room type from dropdown of room type list.
    angular.forEach($scope.checkinData.rate_codes,function(item, index) {
    if((item.value == $scope.checkinData.selected_rate_code) && ( $scope.excludedRateCodes.indexOf(item) == -1) ){
      $scope.excludedRateCodes.push(item);
    }
    });
   
    $scope.checkinData.selected_rate_code = "";
};

  $scope.clickExcludeBlockCode = function(){
    //Removing the selected room type from dropdown of room type list.
    angular.forEach($scope.checkinData.block_codes,function(item, index) {
    if((item.value == $scope.checkinData.selected_block_code) && ( $scope.excludedBlockCodes.indexOf(item) == -1) ){
      $scope.excludedBlockCodes.push(item);
    }
    });
   
    $scope.checkinData.selected_block_code = "";
};


  $scope.deleteBlockCode = function(id){
    //Removing the selected room type from dropdown of room type list.
    angular.forEach($scope.excludedBlockCodes,function(item, index) {
    if(item.value == id){
      $scope.excludedBlockCodes.splice(index,1);
    }
    });
   
};

  $scope.deleteRateCode = function(id){
    //Removing the selected room type from dropdown of room type list.
    angular.forEach($scope.excludedRateCodes,function(item, index) {
    if(item.value == id){
      $scope.excludedRateCodes.splice(index,1);
    }
    });
   
};

}]);