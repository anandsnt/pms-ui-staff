admin.controller('ADAddCampaignCtrl',['$scope', '$rootScope','adBrandsSrv', function($scope, $rootScope,adBrandsSrv){

	BaseCtrl.call(this, $scope);

	



	$scope.campaignData = {};
	$scope.campaignData.audience_type = "EVERYONE";
	$scope.campaignData.delivery_primetime = "AM";
	$scope.campaignData.alert_max_length = 120;
	$scope.campaignData.messageSubjectMaxLength = 60;
	$scope.campaignData.messageBodyMaxLength = 320;
	$scope.campaignData.is_recurring = false;


	$scope.startCampaign = function(){

		alert("startCampaign");
		console.log($scope.campaignData);
	}

	$scope.saveAsDraft = function(){
		alert("saveAsDraft");
	}

	$scope.showDatePicker = function(){
		alert("show showDatePicker");
	}


	
}]);