admin.controller('ADAddCampaignCtrl',['$scope', '$rootScope','ADCampaignSrv', function($scope, $rootScope,ADCampaignSrv){

	BaseCtrl.call(this, $scope);
	$scope.campaignData = {};
	$scope.campaignData.audience_type = "EVERYONE";
	$scope.campaignData.delivery_primetime = "AM";
	$scope.campaignData.alert_max_length = 120;
	$scope.campaignData.messageSubjectMaxLength = 60;
	$scope.campaignData.messageBodyMaxLength = 320;
	$scope.campaignData.is_recurring = "false";
	$scope.campaignData.header_file = $scope.fileName;

	var computeCampaignSaveData = function(){
		var campaign = {};
		campaign.name = $scope.campaignData.name;
		campaign.audience_type = $scope.campaignData.audience_type;
		campaign.subject = $scope.campaignData.subject;
		//TODO: Header image
		campaign.header_image = $scope.campaignData.header_image;
		campaign.body = $scope.campaignData.body;
		campaign.call_to_action_label = $scope.campaignData.call_to_action_label;
		campaign.call_to_action_target = $scope.campaignData.call_to_action_target;
		campaign.is_recurring = $scope.campaignData.is_recurring == "true"? true : false;
		campaign.day_of_week = $scope.campaignData.day_of_week;
		//TODO: time_to_send
		campaign.time_to_send = tConvertToAPIFormat($scope.campaignData.delivery_hour, $scope.campaignData.delivery_min, $scope.campaignData.delivery_primetime);
		//TODO: recurrence_end_date
		campaign.recurrence_end_date = '2015-03-15';
		campaign.alert_ios7 = $scope.campaignData.alert_ios7;
		campaign.alert_ios8 = $scope.campaignData.alert_ios8;

		return campaign;


	};


	$scope.startCampaign = function(){

		//alert("startCampaign");
		console.log($scope.campaignData.is_recurring);
	};

	$scope.saveAsDraft = function(){
		var saveSucess = function(data){
	alert('saveSucess');
		}
		var data = computeCampaignSaveData();
		console.log(data);
		$scope.invokeApi(ADCampaignSrv.saveCampaign, data, saveSucess);
	};
	$scope.onFromDateChanged = function(datePicked){
		console.log(datePicked);
	};

	$scope.showCalendar = function(controller) {
		alert("show date picker");
		$scope.focusSearchField = false;
		$scope.$emit("showSearchResultsArea", true);
        $timeout(function() {
            ngDialog.open({
                template: '/assets/partials/search/rvDatePickerPopup.html',
                controller: 'RVReservationSearchFromDatepickerCtrl',
                className: '',
                scope: $scope
            });
        }, 1000);
	};

	$scope.showDatePicker = function(){
		alert("show showDatePicker");
	};

	$scope.$watch(function(){
		return $scope.campaignData.header_image;
	}, function(logo) {
			if(logo == 'false')
				$scope.fileName = "Choose File....";
			$scope.campaignData.header_file = $scope.fileName;
		}
	);


	
}]);