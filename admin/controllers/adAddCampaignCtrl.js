admin.controller('ADAddCampaignCtrl',['$scope', '$rootScope','ADCampaignSrv', 'ngDialog', '$timeout', '$state', '$stateParams', function($scope, $rootScope,ADCampaignSrv, ngDialog, $timeout,$state, $stateParams){

	BaseCtrl.call(this, $scope);

	var init = function(){
		$scope.campaignData = {};
		$scope.campaignData.audience_type = "";
		$scope.campaignData.delayAfterCheckin = "00";
		$scope.campaignData.delivery_primetime = "AM";
		$scope.campaignData.alert_max_length = 120;
		$scope.campaignData.messageSubjectMaxLength = 60;
		$scope.campaignData.messageBodyMaxLength = 2000;
		$scope.campaignData.callToActionLabelMaxLength = 30;
		$scope.campaignData.delivery_details = "";
		$scope.campaignData.target_type = "URL";
		$scope.campaignData.screen_type_id = "";
		$scope.campaignData.header_file = $scope.fileName;


		$scope.minutes = ["00", "05"];
		for(var i = 10; i < 61; i++){
               if(i % 5 === 0)
                  $scope.minutes.push("" + i);
		}

		$scope.mode = 'ADD';
		fetchConfig();
		if($stateParams.type === 'EDIT'){
			$scope.mode = 'EDIT';
			fetchCampaignDetails($stateParams.id);
		}




	};
	//Get the alert length - set in admin settings
	var fetchConfig = function(){
		var fetchSuccessOfCampaignData = function(data){
			$scope.campaignData.ios8_alert_length = data.ios8_alert_length;
			$scope.campaignData.ios7_alert_length = data.ios7_alert_length;
			$scope.campaignData.screen_types = data.screen_types;
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADCampaignSrv.fetchCampaignConfig, {}, fetchSuccessOfCampaignData);

	};

	var computeCampaignDataToUIFormat = function(data){

		$scope.campaignData.id = data.id;
		$scope.campaignData.name = data.name;
		$scope.campaignData.audience_type = data.audience_type;
		$scope.campaignData.delayAfterCheckin = data.delay_after_checkin < 10 ? "0"+data.delay_after_checkin : "" + data.delay_after_checkin;
		$scope.campaignData.delivery_details = data.delivery_details;
		$scope.campaignData.target_type = (data.screen_type_id !==  "" && data.screen_type_id !==  null)? "SCREEN" : "URL";
		$scope.campaignData.screen_type_id = (data.screen_type_id !==  "" && data.screen_type_id !==  null)? data.screen_type_id : "";
		$scope.campaignData.specific_users = data.specific_users;

		$scope.campaignData.subject = data.subject;
		$scope.campaignData.header_image = data.header_image;
		$scope.campaignData.body = data.body;
		$scope.campaignData.call_to_action_label = data.call_to_action_label;
		$scope.campaignData.call_to_action_target = data.call_to_action_target;

		$scope.campaignData.is_recurring = data.is_recurring? 'true': 'false';
		$scope.campaignData.day_of_week = data.day_of_week;

		$scope.campaignData.completed_date = data.completed_date;
		$scope.campaignData.completed_time = data.completed_time;
		$scope.campaignData.status = data.status;
		$scope.campaignData.end_date_for_display = data.recurrence_end_date;

		var deliveryTime = tConvert(data.time_to_send);
		if(!isEmptyObject(deliveryTime)){
			$scope.campaignData.delivery_hour = deliveryTime.hh;
			$scope.campaignData.delivery_min = deliveryTime.mm;
			$scope.campaignData.delivery_primetime = deliveryTime.ampm;
		}

		$scope.campaignData.recurring_end_type = (data.recurrence_end_date === undefined || data.recurrence_end_date === '') ? 'NEVER' : 'END_OF_DAY';
		$scope.campaignData.recurrence_end_date = data.recurrence_end_date;
		$scope.campaignData.alert_ios8 = data.alert_ios8;
		$scope.campaignData.alert_ios7 = data.alert_ios7;
	};

	var fetchCampaignDetails = function(id){

		var fetchSuccessOfCampaignData = function(data){
			computeCampaignDataToUIFormat(data);
			$scope.$emit('hideLoader');
		};

		var params = {'id': id};
		$scope.invokeApi(ADCampaignSrv.fetchCampaignData, params, fetchSuccessOfCampaignData);

	};

	var computeCampaignSaveData = function(){
		var campaign = {};
		campaign.name = $scope.campaignData.name;
		if($scope.campaignData.audience_type){
		campaign.audience_type = $scope.campaignData.audience_type;
		}
		if($scope.campaignData.delivery_details){
		campaign.delivery_details = $scope.campaignData.delivery_details;
		}
		if($scope.campaignData.screen_type_id && $scope.campaignData.target_type === 'SCREEN'){
		campaign.screen_type_id = $scope.campaignData.screen_type_id;
		}
		if($scope.campaignData.audience_type==="SPECIFIC_USERS"){
		campaign.specific_users = $scope.campaignData.specific_users;
		}
		campaign.subject = $scope.campaignData.subject;
		campaign.delay_after_checkin = $scope.campaignData.delayAfterCheckin;
		//TODO: Header image
		campaign.header_image = $scope.campaignData.header_image;
		campaign.body = $scope.campaignData.body;
		campaign.call_to_action_label = $scope.campaignData.call_to_action_label;
		campaign.call_to_action_target = $scope.campaignData.call_to_action_target;
		campaign.is_recurring = $scope.campaignData.is_recurring === "true"? true : false;
		campaign.day_of_week = $scope.campaignData.day_of_week;
		//TODO: time_to_send
		campaign.time_to_send = tConvertToAPIFormat($scope.campaignData.delivery_hour, $scope.campaignData.delivery_min, $scope.campaignData.delivery_primetime);
		//TODO: recurrence_end_date
		if($scope.campaignData.end_date_for_display){
		campaign.recurrence_end_date = $scope.campaignData.end_date_for_display;
		}
		campaign.alert_ios7 = $scope.campaignData.alert_ios7;
		campaign.alert_ios8 = $scope.campaignData.alert_ios8;
		campaign.status = $scope.campaignData.status;


		return campaign;


	};


	$scope.startCampaignPressed = function(){
		$scope.saveAsDraft("START_CAMPAIGN");
	};

	var startCampaign = function(id){
		var campaignStartSuccess = function(data){
			$scope.campaignData.status = 'ACTIVE';
			$scope.$emit('hideLoader');
			$scope.gobackToCampaignListing();
		};
		var data = {"id": id};
		$scope.invokeApi(ADCampaignSrv.startCampaign, data, campaignStartSuccess);
	};

	$scope.saveAsDraft = function(action){
		var saveSucess = function(data){
			$scope.campaignData.id = data.id;
			$scope.$emit('hideLoader');
			if(action === "START_CAMPAIGN"){
				startCampaign(data.id);

			}else{
				$scope.gobackToCampaignListing();
			}
		};
		var data = computeCampaignSaveData();

		if($scope.mode === 'EDIT'){
			data.id = $scope.campaignData.id;
			$scope.invokeApi(ADCampaignSrv.updateCampaign, data, saveSucess);

		} else {
			$scope.invokeApi(ADCampaignSrv.saveCampaign, data, saveSucess);
		}
	};
	$scope.onFromDateChanged = function(datePicked){

	};

	$scope.gobackToCampaignListing = function(){
		$state.go('admin.campaigns');

	};

	$scope.statusChanged = function(){
		$scope.campaignData.status = $scope.campaignData.status === 'ACTIVE' ? 'INACTIVE': 'ACTIVE';
	};

	$scope.getTimeConverted = function(time) {
		if (time === null || time === undefined || time.indexOf("undefined") > -1) {
			return "";
		}
		var timeDict = tConvert(time);
		return (timeDict.hh + ":" + timeDict.mm + " " + timeDict.ampm);
	};

	$scope.deleteCampaign = function(){

		var deleteSuccess = function(){
			$scope.$emit('hideLoader');
			$scope.gobackToCampaignListing();

		};
		var params = {"id" : $scope.campaignData.id};
		$scope.invokeApi(ADCampaignSrv.deleteCampaign, params, deleteSuccess);
	};

	$scope.showDatePicker = function(){
        ngDialog.open({
                template: '/assets/partials/campaigns/adCampaignDatepicker.html',
                controller: 'ADcampaignDatepicker',
                className: 'ngdialog-theme-default single-calendar-modal',
                scope: $scope,
                closeByDocument: true
            });
	};

	$scope.$watch(function(){
		return $scope.campaignData.header_image;
	}, function(logo) {
			if(logo === 'false') {
				$scope.fileName = "Choose File....";
			}
			$scope.campaignData.header_file = $scope.fileName;
		}
	);

	init();

	$scope.isScreenSwitchDisabled = function(){
          var delivery_types = ['EXTERNAL_CHECKIN', 'EXTERNAL_CHECKOUT', 'PRE_CHECKIN','ROOM_READY', 'ON_CHECKIN'];

          if(delivery_types.indexOf($scope.campaignData.audience_type) > -1
          	&& delivery_types.indexOf($scope.campaignData.delivery_details) > -1 &&
          	 delivery_types.indexOf($scope.campaignData.audience_type) === delivery_types.indexOf($scope.campaignData.delivery_details)){
          	return false;
          }
          return true;
	};

	$scope.$watch(function(){
		return $scope.campaignData.delivery_details;
	}, function(value) {
			if($scope.campaignData.target_type === 'SCREEN' && $scope.isScreenSwitchDisabled()){
                 $scope.campaignData.target_type = "";
				 $scope.campaignData.screen_type_id = "";
			}

		}
	);

	$scope.$watch(function(){
		return $scope.campaignData.audience_type;
	}, function(value) {
			if($scope.campaignData.target_type === 'SCREEN' && $scope.isScreenSwitchDisabled()){
                 $scope.campaignData.target_type = "";
				 $scope.campaignData.screen_type_id = "";
			}

		}
	);

}]);