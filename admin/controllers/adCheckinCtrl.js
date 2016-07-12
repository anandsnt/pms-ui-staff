admin.controller('ADCheckinCtrl', ['$scope', '$rootScope', 'adCheckinSrv', '$state', 'rateCodeData', 'blockCodeData', 'roomTypes', function ($scope, $rootScope, adCheckinSrv, $state, rateCodeData, blockCodeData, roomTypes) {

  $scope.errorMessage = '';

  BaseCtrl.call(this, $scope);

  /*
   * To set the preveous state as admin.dashboard/Zest in all cases
   */
  $rootScope.previousState = 'admin.dashboard';
  $rootScope.previousStateParam = '1';

  $scope.init = function () {
    $scope.checkinData = {};
    $scope.hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    $scope.minutes = ["00", "15", "30", "45"];
    $scope.primeTimes = ["AM", "PM"];
    $scope.isLoading = true;
    $scope.hideAlertOption = false;
    $scope.prior_minutes = [];
    for (var i = 15; i <= 300; i = i + 15) {
      $scope.prior_minutes.push(i.toString());
    }
    $scope.excludedRateCodes = [];
    $scope.excludedBlockCodes = [];
    $scope.rate_codes = rateCodeData.results;
    $scope.block_codes = blockCodeData.block_codes;
    $scope.roomTypes = roomTypes.room_types;
    $scope.excludedRoomTypes = [];
  };

  $scope.init();

  var setUpData = function () {
    $scope.checkinData.is_allow_early_checkin_from_zest = ($scope.checkinData.is_allow_early_checkin_from_zest === 'true') ? true : false;
    $scope.checkinData.is_send_alert_flag = ($scope.checkinData.is_send_alert === 'true') ? true : false;
    $scope.checkinData.is_send_zest_alert_flag = ($scope.checkinData.is_zest_checkin_alert_on === 'true') ? true : false;
    $scope.checkinData.is_send_checkin_staff_alert_flag = ($scope.checkinData.is_send_checkin_staff_alert === 'true') ? true : false;
    $scope.checkinData.is_notify_on_room_not_assigned_flag = ($scope.checkinData.is_notify_on_room_not_assigned === 'true') ? true : false;
    $scope.checkinData.is_notify_on_room_ready_flag = ($scope.checkinData.is_notify_on_room_ready === 'true') ? true : false;
    $scope.checkinData.require_cc_for_checkin_email_flag = ($scope.checkinData.require_cc_for_checkin_email === 'true') ? true : false;

    $scope.checkinData.is_sent_to_queue = ($scope.checkinData.is_sent_to_queue === 'true') ? "yes" : "no";
    $scope.checkinData.is_precheckin_only = ($scope.checkinData.is_precheckin_only === 'true') ? true : false;

    angular.forEach($scope.rate_codes, function (rate, index) {
      angular.forEach($scope.checkinData.excluded_rate_codes, function (excludedrate, index) {
        if (parseInt(rate.id) === excludedrate) {
          $scope.excludedRateCodes.push(rate);
          rate.ticked = true;// for the multi-select implementation
        }
      });
    });

    angular.forEach($scope.block_codes, function (block, index) {
      angular.forEach($scope.checkinData.excluded_block_codes, function (excludedblock, index) {
        if (parseInt(block.id) === excludedblock) {
          $scope.excludedBlockCodes.push(block);
          block.ticked = true;// for the multi-select implementation
        }
      });
    });
    angular.forEach($scope.roomTypes, function (roomType, index) {
      angular.forEach($scope.checkinData.excluded_room_types, function (excludedRoomType, index) {
        if (parseInt(roomType.id) === excludedRoomType) {
          $scope.excludedRoomTypes.push(roomType);
          roomType.ticked = true;// for the multi-select implementation
        }
      });
    });

    $scope.$watch('checkinData.is_send_checkin_staff_alert_flag', function () {
      $scope.hideAlertOption = $scope.checkinData.is_send_checkin_staff_alert_flag ? false : true;
    });

    $scope.$watch('checkinData.is_precheckin_only', function () {
      $scope.hideAddOption = $scope.checkinData.is_precheckin_only ? false : true;
    });

    $scope.$watch('checkinData.is_sent_to_queue', function () {
      $scope.hidePriorMinutes = ($scope.checkinData.is_sent_to_queue === 'yes') ? false : true;
    });
    //to be confirmed
    $scope.checkinData.checkin_alert_primetime = (!$scope.checkinData.checkin_alert_primetime) ? "AM" : $scope.checkinData.checkin_alert_primetime;
    

    if($scope.checkinData.max_no_of_keys === "ROOM_OCCUPANCY"){
      $scope.checkinData.max_keys_type = "ROOM_OCCUPANCY";
      $scope.checkinData.no_of_keys = 1;//default as 1
    }
    else{
       $scope.checkinData.max_keys_type = "other";
       if($scope.checkinData.max_no_of_keys !== null){
          $scope.checkinData.no_of_keys = angular.copy($scope.checkinData.max_no_of_keys);
       }
       else{
           $scope.checkinData.no_of_keys = 1;//default as 1
       }
    }
  };

  /*
   * To fetch checkin details
   */
  $scope.fetchCheckinDetails = function () {

    var fetchCheckinDetailsFailureCallback = function (data) {
      $scope.$emit('hideLoader');
      $scope.isLoading = false;

    };
    var fetchCheckinDetailsSuccessCallback = function (data) {
      $scope.$emit('hideLoader');
      $scope.isLoading = false;
      $scope.checkinData = data;
      if (!$scope.checkinData.next_day_checkin_alert_primetime){
          $scope.checkinData.next_day_checkin_alert_primetime = 'AM';
      }
      if (!$scope.checkinData.checkin_alert_primetime){
          $scope.checkinData.checkin_alert_primetime = 'AM';
      }
      if (!$scope.checkinData.zest_checkin_alert_primetime){
          $scope.checkinData.zest_checkin_alert_primetime = 'AM';
      }
      if (!$scope.checkinData.zest_precheckin_alert_primetime){
          $scope.checkinData.zest_precheckin_alert_primetime = 'AM';
      }
      if ($scope.checkinData.start_auto_checkin_from) {
        $scope.checkinData.auto_checkin_from_hour = $scope.checkinData.start_auto_checkin_from.split(":")[0];
        $scope.checkinData.auto_checkin_from_minute = $scope.checkinData.start_auto_checkin_from.split(":")[1];
      }
      if ($scope.checkinData.start_auto_checkin_to) {
        $scope.checkinData.auto_checkin_to_hour = $scope.checkinData.start_auto_checkin_to.split(":")[0];
        $scope.checkinData.auto_checkin_to_minute = $scope.checkinData.start_auto_checkin_to.split(":")[1];
      }
      ;

      setUpData();

    };
    $scope.invokeApi(adCheckinSrv.fetch, {}, fetchCheckinDetailsSuccessCallback, fetchCheckinDetailsFailureCallback);
  };

  $scope.fetchCheckinDetails();

  /*
   * To save checkin details
   * @param {data}
   *
   */
  $scope.saveCheckin = function () {

    $scope.checkinData.is_allow_early_checkin_from_zest = ($scope.checkinData.is_allow_early_checkin_from_zest) ? 'true' : 'false';
    $scope.checkinData.is_send_alert = ($scope.checkinData.is_send_alert_flag) ? 'true' : 'false';
    $scope.checkinData.is_send_zest_alert = ($scope.checkinData.is_send_zest_alert_flag) ? 'true' : 'false';
    $scope.checkinData.is_send_checkin_staff_alert = ($scope.checkinData.is_send_checkin_staff_alert_flag) ? 'true' : 'false';
    $scope.checkinData.is_notify_on_room_not_assigned = ($scope.checkinData.is_notify_on_room_not_assigned_flag) ? 'true' : 'false';
    $scope.checkinData.is_notify_on_room_ready = ($scope.checkinData.is_notify_on_room_ready_flag) ? 'true' : 'false';
    $scope.checkinData.require_cc_for_checkin_email = ($scope.checkinData.require_cc_for_checkin_email_flag) ? 'true' : 'false';

    var excluded_rate_codes = [];
    var excluded_block_codes = [];

    angular.forEach($scope.excludedRateCodes, function (excludedrate, index) {
      excluded_rate_codes.push(excludedrate.id);
    });

    angular.forEach($scope.excludedBlockCodes, function (excludedrate, index) {
      excluded_block_codes.push(excludedrate.id);
    });
    var excluded_room_types = [];
    angular.forEach($scope.excludedRoomTypes, function (excludedRoomType, index) {
      excluded_room_types.push(excludedRoomType.id);
    });
    //to reset time incase of an invalid time selection
    var checkinAlertTime = ($scope.checkinData.checkin_alert_time_hour !== "" && $scope.checkinData.checkin_alert_time_minute !== "" && $scope.checkinData.checkin_alert_time_hour && $scope.checkinData.checkin_alert_time_minute) ? $scope.checkinData.checkin_alert_time_hour + ":" + $scope.checkinData.checkin_alert_time_minute : "";
    var nextDayCheckinAlertTime = ($scope.checkinData.next_day_checkin_alert_time_hour !== "" && $scope.checkinData.next_day_checkin_alert_time_minute !== "" && $scope.checkinData.next_day_checkin_alert_time_hour && $scope.checkinData.next_day_checkin_alert_time_minute) ? $scope.checkinData.next_day_checkin_alert_time_hour + ":" + $scope.checkinData.next_day_checkin_alert_time_minute : "";
    var zestCheckinAlertTime = ($scope.checkinData.zest_checkin_alert_time_hour !== "" && $scope.checkinData.zest_checkin_alert_time_min !== "" && $scope.checkinData.zest_checkin_alert_time_hour && $scope.checkinData.zest_checkin_alert_time_min) ? $scope.checkinData.zest_checkin_alert_time_hour + ":" + $scope.checkinData.zest_checkin_alert_time_min : "";

    var zestPrecheckinAlertTime = ($scope.checkinData.zest_precheckin_alert_time_hour !== "" && $scope.checkinData.zest_precheckin_alert_time_min !== "" && $scope.checkinData.zest_precheckin_alert_time_hour && $scope.checkinData.zest_precheckin_alert_time_min) ? $scope.checkinData.zest_precheckin_alert_time_hour + ":" + $scope.checkinData.zest_precheckin_alert_time_min : "";

    var startAutoCheckinFrom = ($scope.checkinData.auto_checkin_from_hour !== "" && $scope.checkinData.auto_checkin_from_minute !== "" && $scope.checkinData.auto_checkin_from_hour && $scope.checkinData.auto_checkin_from_minute) ? $scope.checkinData.auto_checkin_from_hour + ":" + $scope.checkinData.auto_checkin_from_minute : "";
    var startAutoCheckinTo = ($scope.checkinData.auto_checkin_to_hour !== "" && $scope.checkinData.auto_checkin_to_minute !== "" && $scope.checkinData.auto_checkin_to_hour && $scope.checkinData.auto_checkin_to_minute) ? $scope.checkinData.auto_checkin_to_hour + ":" + $scope.checkinData.auto_checkin_to_minute : "";
    
    var max_no_of_keys = "";
    if($scope.checkinData.max_keys_type === "ROOM_OCCUPANCY"){
      max_no_of_keys = "ROOM_OCCUPANCY";
    }
    else{
       max_no_of_keys = $scope.checkinData.no_of_keys;
    };

    var uploadData = {
      'checkin_alert_message': $scope.checkinData.checkin_alert_message,
      'checkin_staff_alert_option': $scope.checkinData.checkin_staff_alert_option,
      'emails': $scope.checkinData.emails,
      'is_allow_early_checkin_from_zest': $scope.checkinData.is_allow_early_checkin_from_zest,
      'is_notify_on_room_not_assigned': $scope.checkinData.is_notify_on_room_not_assigned,
      'is_notify_on_room_ready': $scope.checkinData.is_notify_on_room_ready,
      'is_send_alert': $scope.checkinData.is_send_alert,
      'is_zest_checkin_alert_on': $scope.checkinData.is_send_zest_alert,
      'is_send_checkin_staff_alert': $scope.checkinData.is_send_checkin_staff_alert,
      'prime_time': $scope.checkinData.checkin_alert_primetime,
      'next_day_prime_time': $scope.checkinData.next_day_checkin_alert_primetime,
      'zest_alert_prime_time': $scope.checkinData.zest_checkin_alert_primetime,
      'zest_precheckin_alert_prime_time': $scope.checkinData.zest_precheckin_alert_primetime,
      'checkin_alert_time': checkinAlertTime,
      'next_day_checkin_alert_time': nextDayCheckinAlertTime,
      'zest_app_checkin_alert_time': zestCheckinAlertTime,
      'zest_app_precheckin_alert_time': zestPrecheckinAlertTime,
      'require_cc_for_checkin_email': $scope.checkinData.require_cc_for_checkin_email,
      'is_precheckin_only': $scope.checkinData.is_precheckin_only ? 'true' : 'false',

      'checkin_action': $scope.checkinData.checkin_action,
      'excluded_rate_codes': excluded_rate_codes,
      'excluded_block_codes': excluded_block_codes,
      'pre_checkin_email_title': $scope.checkinData.pre_checkin_email_title,
      'pre_checkin_email_body': $scope.checkinData.pre_checkin_email_body,
      'pre_checkin_email_bottom_body': $scope.checkinData.pre_checkin_email_bottom_body,
      'prior_to_arrival': $scope.checkinData.prior_to_arrival,
      'max_webcheckin': $scope.checkinData.max_webcheckin,

      'is_sent_none_cc_reservations_to_front_desk_only': $scope.checkinData.is_sent_none_cc_reservations_to_front_desk_only ? 'true' : 'false',
      'checkin_complete_confirmation_screen_text': $scope.checkinData.checkin_complete_confirmation_screen_text,
      'start_auto_checkin_from': startAutoCheckinFrom,
      'start_auto_checkin_from_prime_time': $scope.checkinData.start_auto_checkin_from_prime_time,
      'start_auto_checkin_to': startAutoCheckinTo,
      'start_auto_checkin_to_prime_time': $scope.checkinData.start_auto_checkin_to_prime_time,
      'excluded_room_types': excluded_room_types,
      'guest_address_on': $scope.checkinData.guest_address_on,
      'birthdate_on': $scope.checkinData.birthdate_on,
      'minimum_age' : $scope.checkinData.minimum_age,
      'prompt_for_address_on':$scope.checkinData.prompt_for_address_on,
      'birthdate_mandatory':$scope.checkinData.birthdate_mandatory,
      'checkin_collect_cc':$scope.checkinData.checkin_collect_cc,
      'guest_delivery_communication':$scope.checkinData.guest_delivery_communication,
      'offer_room_delivery_options':$scope.checkinData.offer_room_delivery_options,
      'zest_checkin_later_text':$scope.checkinData.zest_checkin_later_text,
      'zest_checkin_now_text':$scope.checkinData.zest_checkin_now_text,
      'eta_enforcement':$scope.checkinData.eta_enforcement,
      'zestweb_enforce_deposit':$scope.checkinData.zestweb_enforce_deposit,
      'enforce_country_sort' : $scope.checkinData.enforce_country_sort,
      'key_prompt_on' : $scope.checkinData.key_prompt_on,
      'key_prompt_title' : $scope.checkinData.key_prompt_title,
      'key_prompt_text': $scope.checkinData.key_prompt_text,
      'key_prompt_save_error' : $scope.checkinData.key_prompt_save_error,
      'max_no_of_keys' : max_no_of_keys,
      'zestweb_collect_outstanding_balance' : $scope.checkinData.zestweb_collect_outstanding_balance
    };

    var saveCheckinDetailsFailureCallback = function (data) {
      $scope.$emit('hideLoader');
    };

    var saveCheckinDetailsSuccessCallback = function (data) {
      $scope.$emit('hideLoader');
    };

    $scope.invokeApi(adCheckinSrv.save, uploadData, saveCheckinDetailsSuccessCallback, saveCheckinDetailsFailureCallback);
  };

// to add to excluded rate codes
  $scope.clickExcludeRateCode = function () {
    $scope.excludedRateCodes = [];
    angular.forEach($scope.rate_codes, function (value, key) {
      if ((value.ticked === true) && ( $scope.excludedRateCodes.indexOf(value) === -1)) {
        $scope.excludedRateCodes.push(value);
      }
    });
  };

// to add to excluded block codes
  $scope.clickExcludeBlockCode = function () {

    $scope.excludedBlockCodes = [];
    angular.forEach($scope.block_codes, function (value, key) {
      if ((value.ticked === true) && ( $scope.excludedBlockCodes.indexOf(value) === -1)) {
        $scope.excludedBlockCodes.push(value);
      }
    });
  };

//remove exclude block code
  $scope.deleteBlockCode = function (id) {
    //remove from final array
    angular.forEach($scope.excludedBlockCodes, function (item, index) {
      if (item.id === id) {
        $scope.excludedBlockCodes.splice(index, 1);
      }
    });
    //untick from list
    angular.forEach($scope.block_codes, function (item, index) {
      if (item.id === id) {
        item.ticked = false;
      }
    });

  };
//remove exclude rate code
  $scope.deleteRateCode = function (id) {
    //remove from final array
    angular.forEach($scope.excludedRateCodes, function (item, index) {
      if (item.id === id) {
        $scope.excludedRateCodes.splice(index, 1);
      }
    });
    //untick from list
    angular.forEach($scope.rate_codes, function (item, index) {
      if (item.id === id) {
        item.ticked = false;
      }
    });

  };
// to add to excluded room types
  $scope.clickExcludeRoomType = function () {
    $scope.excludedRoomTypes = [];
    angular.forEach($scope.roomTypes, function (value, key) {
      if ((value.ticked === true) && ( $scope.excludedRoomTypes.indexOf(value) === -1)) {
        $scope.excludedRoomTypes.push(value);
      }
    });
  };

  //remove exclude room type
  $scope.deleteRoomType = function (id) {
    //remove from final array
    angular.forEach($scope.excludedRoomTypes, function (item, index) {
      if (item.id === id) {
        $scope.excludedRoomTypes.splice(index, 1);
      }
    });
    //untick from list
    angular.forEach($scope.roomTypes, function (item, index) {
      if (item.id === id) {
        item.ticked = false;
      }
    });

  };

}]);