admin.controller('ADCheckinCtrl', ['$scope', '$rootScope', 'adCheckinSrv', '$state', 'ADRoomTypesSrv', '$q',
    function ($scope, $rootScope, adCheckinSrv, $state, ADRoomTypesSrv, $q) {

  $scope.errorMessage = '';
  $scope.successMessage = '';

  BaseCtrl.call(this, $scope);

  /*
   * To set the preveous state as admin.dashboard/Zest in all cases
   */
  $rootScope.previousState = 'admin.dashboard';
  $rootScope.previousStateParam = ($scope.isChainAdminMenuPresent.length === 0) ? '1' : '2';

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
    $scope.rate_codes = [];
    $scope.block_codes = [];
    $scope.roomTypes = [];
    $scope.excludedRoomTypes = [];
    $scope.openRoomExclusionSettings = false;

    $scope.checkinEmailRoomExclusionConfig = {
      "item_number": {
        "active": true,
        "label": "ROOM NO.",
        "column_width": "width-20"
      },
      "item_description": {
        "active": true,
        "label": "ROOM TYPE.",
        "column_width": "width-40"
      },
      "selectedExcludedIds": [],
      "unSelectedExcludedIds": [],
      "apiService": "ADCheckinEmailRoomFilterSrv",
      "noOfItemsSelected": 0
    };
  };

  $scope.toggleRoomExlusionSettings = function(bool) {
    $scope.openRoomExclusionSettings = bool;
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
    $scope.checkinData.is_sent_none_cc_reservations_to_front_desk_only = ($scope.checkinData.is_sent_none_cc_reservations_to_front_desk_only === 'true') ? true : false;
    
    $scope.checkinData.is_sent_to_queue = ($scope.checkinData.is_sent_to_queue === 'true') ? "yes" : "no";
    $scope.checkinData.is_precheckin_only = ($scope.checkinData.is_precheckin_only === 'true') ? true : false;

    $scope.$watch('checkinData.is_send_checkin_staff_alert_flag', function () {
      $scope.hideAlertOption = $scope.checkinData.is_send_checkin_staff_alert_flag ? false : true;
    });

    $scope.$watch('checkinData.is_precheckin_only', function () {
      $scope.hideAddOption = $scope.checkinData.is_precheckin_only ? false : true;
    });

    $scope.$watch('checkinData.is_sent_to_queue', function () {
      $scope.hidePriorMinutes = ($scope.checkinData.is_sent_to_queue === 'yes') ? false : true;
    });
    // to be confirmed
    $scope.checkinData.checkin_alert_primetime = (!$scope.checkinData.checkin_alert_primetime) ? "AM" : $scope.checkinData.checkin_alert_primetime;
    

    if($scope.checkinData.max_no_of_keys === "ROOM_OCCUPANCY"){
      $scope.checkinData.max_keys_type = "ROOM_OCCUPANCY";
      $scope.checkinData.no_of_keys = 1;// default as 1
    }
    else{
       $scope.checkinData.max_keys_type = "other";
       if($scope.checkinData.max_no_of_keys !== null){
          $scope.checkinData.no_of_keys = angular.copy($scope.checkinData.max_no_of_keys);
       }
       else{
           $scope.checkinData.no_of_keys = 1;// default as 1
       }
    }

    $scope.surveyQuestionImage = angular.copy($scope.checkinData.survey_question_image);

  };

  /**
   * [onFetchBlockCodeDropDownClick description]
   * @param  {[type]} result [description]
   * @return {[type]}        [description]
   */
  var onFetchBlockCodeDropDownClick = function(result) {
    $scope.block_codes = result.block_codes;

    // for multi select purpose
    // we need to mark rate code as ticked if it is in exluded list
    var excludedGroupIds = _.pluck($scope.excludedBlockCodes, 'id');

    $scope.block_codes.map(function(group) {
      if(excludedGroupIds.indexOf(group.id) > -1) {
        group.ticked = true;
      }
    });
  };

  /**
   * when you clicked on group code dropdown
   */
  $scope.onBlockCodeDropDownClick = function(){
    // if we have the data already, we dont need to fetch
    if ($scope.block_codes.length) {
        return;
    }
    var options = {
        onSuccess: onFetchBlockCodeDropDownClick
    };

    $scope.callAPI(adCheckinSrv.getBlockCodes, options);
  };

  var onFetchRateCodeDropDownClick = function(result) {
    $scope.rate_codes = result.results;

    // for multi select purpose
    // we need to mark rate code as ticked if it is in exluded list
    var excludedRateIds = _.pluck($scope.excludedRateCodes, 'id');

    $scope.rate_codes.map(function(rate) {
      if(excludedRateIds.indexOf(rate.id) > -1) {
        rate.ticked = true;
      }
    });
  };

  /**
   * when you clicked on rate code dropdown
   */
  $scope.onRateCodeDropDownClick = function(){
    // if we have the data already, we dont need to fetch
    if ($scope.rate_codes.length) {
        return;
    }
    var options = {
        onSuccess: onFetchRateCodeDropDownClick
    };

    $scope.callAPI(adCheckinSrv.getRateCodes, options);
  };

  var onFetchRoomTypesDropDownClick = function(result) {
    $scope.roomTypes = result.room_types;

    // for multi select purpose
    // we need to mark rate code as ticked if it is in exluded list
    var excludedRoomTypeIds = _.pluck($scope.excludedRoomTypes, 'id');

    $scope.roomTypes.map(function(roomType) {
      if(excludedRoomTypeIds.indexOf(parseInt(roomType.id)) > -1) {
        roomType.ticked = true;
      }
    });
  };

  /**
   * when you clicked on room types dropdown
   */
  $scope.onRoomTypesDropDownClick = function(){
    // if we have the data already, we dont need to fetch
    if ($scope.roomTypes.length) {
        return;
    }
    var options = {
        onSuccess: onFetchRoomTypesDropDownClick
    };

    $scope.callAPI(ADRoomTypesSrv.fetch, options);
  };

  /*
   * To fetch checkin details
   */

    var fetchCheckinDetailsSuccessCallback = function (data) {
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

  var onFetchSuccessExcludedBlockCodes = function(data) {
    $scope.excludedBlockCodes = data.block_codes;
  };

  var onFetchSuccessExcludedRateCodes = function(data) {
    $scope.excludedRateCodes = data.rate_codes;
  };

  var onFetchSuccessExcludedRoomTypes = function(data) {
    $scope.excludedRoomTypes = data.block_room_types;
  };

  var failedToFetchOfAllRequiredDataForCheckinScreen = function(errorMessage) {
    $scope.$emit('hideLoader');
    $scope.errorMessage = errorMessage;
  };

  var successFetchOfAllRequiredDataForCheckinScreen = function() {
    // $scope.$emit('hideLoader');
    // don't hide loader, as the rooms API will be still running
    // In future, Add any other actions if needed.
  };

  /**
   * initialization stuff
   */
  var fetchRequiredDataForCheckinScreen = function(){
    // we are not using our normal API calling since we have multiple API calls needed
    $scope.$emit('showLoader');

    var promises = [];

    // general data
    promises.push(adCheckinSrv.fetch().then(fetchCheckinDetailsSuccessCallback));

    // excluded group codes
    promises.push(adCheckinSrv.getExcludedBlockCodes().then(onFetchSuccessExcludedBlockCodes));

    // excluded rate codes
    promises.push(adCheckinSrv.getExcludedRateCodes().then(onFetchSuccessExcludedRateCodes));

    // excluded room types
    promises.push(adCheckinSrv.getExcludedRoomTypes().then(onFetchSuccessExcludedRoomTypes));

    // Lets start the processing
    $q.all(promises)
              .then(successFetchOfAllRequiredDataForCheckinScreen,
                failedToFetchOfAllRequiredDataForCheckinScreen);
  }();

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

    $scope.checkinData.exclude_routing_reservations_from_email = ($scope.checkinData.exclude_routing_reservations_from_email) ? true : false;

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
    // to reset time incase of an invalid time selection
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
      'exclude_routing_reservations_from_email' : $scope.checkinData.exclude_routing_reservations_from_email,
      'key_prompt_on' : $scope.checkinData.key_prompt_on,
      'key_prompt_title' : $scope.checkinData.key_prompt_title,
      'key_prompt_text': $scope.checkinData.key_prompt_text,
      'key_prompt_save_error' : $scope.checkinData.key_prompt_save_error,
      'max_no_of_keys' : max_no_of_keys,
      'survey_question_prompt_on': $scope.checkinData.survey_question_prompt_on,
      'survey_question_type_id': $scope.checkinData.survey_question_type_id,
      'survey_question_title': $scope.checkinData.survey_question_title,
      'survey_question': $scope.checkinData.survey_question,
      'numeric_answer_max_limit': $scope.checkinData.numeric_answer_max_limit,
      'survey_question_is_mandatory': $scope.checkinData.survey_question_is_mandatory,
      'survey_question_image' : angular.copy($scope.checkinData.survey_question_image),
      'zestweb_collect_outstanding_balance' : $scope.checkinData.zestweb_collect_outstanding_balance,
      'zest_web_use_new_sent_to_que_action' : $scope.checkinData.zest_web_use_new_sent_to_que_action,
      'zest_web_checkin_second_authentication_action': $scope.checkinData.zest_web_checkin_second_authentication_action,
      'zest_web_always_ask_for_mobile_number': $scope.checkinData.zest_web_always_ask_for_mobile_number,
      'removed_excluded_from_checkin_notification': $scope.checkinEmailRoomExclusionConfig.selectedExcludedIds,
      'selected_excluded_from_checkin_notification': $scope.checkinEmailRoomExclusionConfig.unSelectedExcludedIds,
      'zest_web_checkin_details_about_mobile_app' : $scope.checkinData.zest_web_checkin_details_about_mobile_app,
      'zest_web_checkin_mobile_app_call_to_action' : $scope.checkinData.zest_web_checkin_mobile_app_call_to_action,
      'zest_web_include_app_store_banner' : $scope.checkinData.zest_web_include_app_store_banner,
      'zest_web_include_google_play_banner' : $scope.checkinData.zest_web_include_google_play_banner,
      'zestweb_cc_authorization_amount': $scope.checkinData.zestweb_cc_authorization_amount
    };

    if($scope.surveyQuestionImage === $scope.checkinData.survey_question_image){
      uploadData.survey_question_image = '';
    }

    var saveCheckinDetailsFailureCallback = function (data) {
      $scope.$emit('hideLoader');
    };

    var saveCheckinDetailsSuccessCallback = function (data) {
      $scope.$emit('hideLoader');
      $scope.successMessage = "Success!. Settings has been saved.";
      $scope.$broadcast('SAVE_SETTINGS_SUCCESS');
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

// remove exclude block code
  $scope.deleteBlockCode = function (id) {
    // remove from final array
    angular.forEach($scope.excludedBlockCodes, function (item, index) {
      if (item.id === id) {
        $scope.excludedBlockCodes.splice(index, 1);
      }
    });
    // untick from list
    angular.forEach($scope.block_codes, function (item, index) {
      if (item.id === id) {
        item.ticked = false;
      }
    });

  };
// remove exclude rate code
  $scope.deleteRateCode = function (id) {
    // remove from final array
    angular.forEach($scope.excludedRateCodes, function (item, index) {
      if (item.id === id) {
        $scope.excludedRateCodes.splice(index, 1);
      }
    });
    // untick from list
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

  // remove exclude room type
  $scope.deleteRoomType = function (id) {
    // remove from final array
    angular.forEach($scope.excludedRoomTypes, function (item, index) {
      if (item.id === id) {
        $scope.excludedRoomTypes.splice(index, 1);
      }
    });
    // untick from list
    angular.forEach($scope.roomTypes, function (item, index) {
      if (item.id === id) {
        item.ticked = false;
      }
    });

  };

}]);