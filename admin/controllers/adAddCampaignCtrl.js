admin.controller('ADAddCampaignCtrl',['$scope', '$rootScope','ADCampaignSrv', 'ngDialog', '$timeout', '$state', '$stateParams', function($scope, $rootScope,ADCampaignSrv, ngDialog, $timeout,$state, $stateParams){

	BaseCtrl.call(this, $scope);
	
	var init = function(){
		console.log($stateParams);

		if($stateParams.type == 'EDIT'){
			$scope.mode = 'EDIT';
			fetchCampaignDetails($stateParams.id);
		}
		

		$scope.campaignData = {};
		$scope.campaignData.audience_type = "EVERYONE";
		$scope.campaignData.delivery_primetime = "AM";
		$scope.campaignData.alert_max_length = 120;
		$scope.campaignData.messageSubjectMaxLength = 60;
		$scope.campaignData.messageBodyMaxLength = 320;
		$scope.campaignData.is_recurring = "false";
		$scope.campaignData.header_file = $scope.fileName;


	}

	var computeCampaignDataToUIFormat = function(data){
		console.log("hesreeeeeeeeeeeeeeeeeeeeeeee");
		console.log(data);

		$scope.campaignData.id = data.id;
		$scope.campaignData.name = data.name;
		$scope.campaignData.audience_type = data.audience_type;
		$scope.campaignData.subject = data.subject;
		$scope.campaignData.header_image = data.header_image;
		$scope.campaignData.body = data.body;
		$scope.campaignData.call_to_action_label = data.call_to_action_label;
		$scope.campaignData.call_to_action_target = data.call_to_action_target;  

		$scope.campaignData.is_recurring = data.is_recurring? 'true': 'false';
		$scope.campaignData.day_of_week = data.day_of_week;

		var deliveryTime = tConvert(data.time_to_send);
		if(!isEmptyObject(deliveryTime)){
			$scope.campaignData.delivery_hour = deliveryTime.hh;
			$scope.campaignData.delivery_min = deliveryTime.mm;
			$scope.campaignData.delivery_primetime = deliveryTime.ampm;
		}
		
		//$scope.campaignData.recurring_end_type = (data.recurrence_end_date == undefined || data.recurrence_end_date == '') ? : 'NEVER' : 'END_OF_DAY';
		$scope.campaignData.recurrence_end_date = data.recurrence_end_date;
		$scope.campaignData.alert_ios8 = data.alert_ios8;
		$scope.campaignData.alert_ios7 = data.alert_ios7;
	}

	var fetchCampaignDetails = function(id){

		var fetchSuccessOfCampaignData = function(data){
			console.log(data);
			computeCampaignDataToUIFormat(data);
			$scope.$emit('hideLoader');
		};

		var params = {'id': id}
		$scope.invokeApi(ADCampaignSrv.fetchCampaignData, params, fetchSuccessOfCampaignData);

	}

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
			$scope.campaignData.id = data.id;
			$scope.$emit('hideLoader');
			if(action == "START_CAMPAIGN"){
				startCampaign(data.id);
				
			}
		}
		var data = computeCampaignSaveData();
			
		if($scope.mode == 'EDIT'){
			console.log('mode edit');
			data.id = $scope.campaignData.id;
			$scope.invokeApi(ADCampaignSrv.updateCampaign, data, saveSucess);

		} else {
			console.log("mode no edit");
			$scope.invokeApi(ADCampaignSrv.saveCampaign, data, saveSucess);
		}
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


	init();


	
}]);