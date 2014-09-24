admin.controller('ADCheckinCtrl',['$scope','$rootScope','adCheckinSrv','$state','rateCodeData','blockCodeData', function($scope,$rootScope,adCheckinSrv,$state,rateCodeData,blockCodeData){

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
    $scope.prior_minutes.push(i.toString());
  }
  $scope.excludedRateCodes=[];
  $scope.excludedBlockCodes=[];
  $scope.rate_codes = rateCodeData.results;
  $scope.block_codes = blockCodeData.block_codes;

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
    
    $scope.checkinData.is_sent_to_queue = ($scope.checkinData.is_sent_to_queue === 'true')? "yes":"no";

    angular.forEach($scope.rate_codes,function(rate, index) {
      angular.forEach($scope.checkinData.excluded_rate_codes,function(excludedrate, index) {
        if(rate.id == excludedrate){
          $scope.excludedRateCodes.push(rate);
        }
      });
     });

    angular.forEach($scope.block_codes,function(rate, index) {
      angular.forEach($scope.checkinData.excluded_block_codes,function(excludedblock, index) {
        if(rate.id == excludedblock){
          $scope.excludedBlockCodes.push(rate);
        }
      });
     });

$scope.$watch('checkinData.is_send_checkin_staff_alert_flag',function(){
  $scope.hideAlertOption = $scope.checkinData.is_send_checkin_staff_alert_flag ? false : true;
})

$scope.$watch('checkinData.is_precheckin_only',function(){
  $scope.hideAddOption = $scope.checkinData.is_precheckin_only ? false : true;
})

$scope.$watch('checkinData.is_sent_to_queue',function(){
  $scope.hidePriorMinutes = ($scope.checkinData.is_sent_to_queue === 'yes') ? false : true;
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

  var excluded_rate_codes = [];
  var excluded_block_codes = [];

  angular.forEach($scope.excludedRateCodes,function(excludedrate, index) {
      excluded_rate_codes.push(excludedrate.id);
  });

  angular.forEach($scope.excludedBlockCodes,function(excludedrate, index) {
      excluded_block_codes.push(excludedrate.id);
  });

  var uploadData = {
    'checkin_alert_message': $scope.checkinData.checkin_alert_message,
    'checkin_staff_alert_option':$scope.checkinData.checkin_staff_alert_option,
    'emails':$scope.checkinData.emails,
    'is_notify_on_room_ready':$scope.checkinData.is_notify_on_room_ready,
    'is_send_alert':$scope.checkinData.is_send_alert,
    'is_send_checkin_staff_alert':$scope.checkinData.is_send_checkin_staff_alert,
    'prime_time':$scope.checkinData.checkin_alert_primetime,
    'checkin_alert_time':$scope.checkinData.checkin_alert_time_hour+":"+$scope.checkinData.checkin_alert_time_minute,
    'require_cc_for_checkin_email' : $scope.checkinData.require_cc_for_checkin_email,

    'is_precheckin_only':$scope.checkinData.is_precheckin_only,
    'is_sent_to_queue':$scope.checkinData.is_sent_to_queue ==='yes'? 'true':'false',
    'excluded_rate_codes':excluded_rate_codes,
    'excluded_block_codes':excluded_block_codes,
    'pre_checkin_email_title':$scope.checkinData.pre_checkin_email_title,
    'pre_checkin_email_body': $scope.checkinData.pre_checkin_email_body,
    'pre_checkin_email_bottom_body': $scope.checkinData.pre_checkin_email_bottom_body,
    'prior_to_arrival':$scope.checkinData.prior_to_arrival,
    'max_webcheckin':$scope.checkinData.max_webcheckin

  };

  var saveCheckinDetailsFailureCallback = function(data) {
    $scope.$emit('hideLoader');
  };

  var saveCheckinDetailsSuccessCallback = function(data) {
    $scope.$emit('hideLoader');
  };

  $scope.invokeApi(adCheckinSrv.save, uploadData,saveCheckinDetailsSuccessCallback,saveCheckinDetailsFailureCallback);
};

// to add to excluded rate codes
$scope.clickExcludeRateCode = function(){
  angular.forEach($scope.rate_codes,function(item, index) {
  
    if((item.id == $scope.checkinData.selected_rate_code) && ( $scope.excludedRateCodes.indexOf(item) == -1) ){
      $scope.excludedRateCodes.push(item);
    }
  });

  $scope.checkinData.selected_rate_code = "";
};

// to add to excluded block codes
$scope.clickExcludeBlockCode = function(){
  angular.forEach($scope.block_codes,function(item, index) {
    if((item.id == $scope.checkinData.selected_block_code) && ( $scope.excludedBlockCodes.indexOf(item) == -1) ){
      $scope.excludedBlockCodes.push(item);
    }
  });     
  $scope.checkinData.selected_block_code = "";
};

//remove exclude block code
$scope.deleteBlockCode = function(id){
  angular.forEach($scope.excludedBlockCodes,function(item, index) {
    if(item.id == id){
      $scope.excludedBlockCodes.splice(index,1);
    }
  });

};
//remove exclude rate code
$scope.deleteRateCode = function(id){
  angular.forEach($scope.excludedRateCodes,function(item, index) {
    if(item.id == id){
      $scope.excludedRateCodes.splice(index,1);      
    }
  });

};

}]);