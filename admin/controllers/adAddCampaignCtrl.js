admin.controller('ADAddCampaignCtrl',['$scope', '$rootScope','ADCampaignSrv', 'ngDialog', '$timeout', function($scope, $rootScope,ADCampaignSrv, ngDialog, $timeout){

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
		campaign.specific_users = $scope.campaignData.specific_users;
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
		campaign.recurrence_end_date = $scope.campaignData.end_date_for_display;
		campaign.alert_ios7 = $scope.campaignData.alert_ios7;
		campaign.alert_ios8 = $scope.campaignData.alert_ios8;

		return campaign;


	};


	$scope.startCampaignPressed = function(){
		$scope.saveAsDraft("START_CAMPAIGN");
		//alert("startCampaign");
		console.log($scope.campaignData.is_recurring);
	};

	var startCampaign = function(id){
		var campaignStartSuccess = function(data){
			$scope.$emit('hideLoader');
		}
		var data = {"id": id};
		$scope.invokeApi(ADCampaignSrv.startCampaign, data, campaignStartSuccess);
	}

	$scope.saveAsDraft = function(action){
		var saveSucess = function(data){
			$scope.$emit('hideLoader');
			if(action == "START_CAMPAIGN"){
				startCampaign(data.id);
				
			}
		}
		var data = computeCampaignSaveData();
		$scope.invokeApi(ADCampaignSrv.saveCampaign, data, saveSucess);
	};
	$scope.onFromDateChanged = function(datePicked){
		console.log(datePicked);
	};

	$scope.gobackToCampaignListing = function(){
		$state.go('admin.campaigns');  

	};

	/*$scope.showCalendar = function() {
		//alert("show date picker");
		$scope.campaignData.end_date = $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd');
        ngDialog.open({
                template: '/assets/partials/campaigns/adCampaignDatepicker.html',
                controller: 'ADcampaignDatepicker',
                className: ' ',
                scope: $scope,
                closeByDocument: true
            });


	};*/

	$scope.showDatePicker = function(){
		console.log("show showDatePicker123213");
		//$scope.campaignData.end_date = $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd');
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
			if(logo == 'false')
				$scope.fileName = "Choose File....";
			$scope.campaignData.header_file = $scope.fileName;
		}
	);


	
}]);