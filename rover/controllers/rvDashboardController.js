sntRover.controller('RVdashboardController',['$scope','RVDashboardSrv', function($scope,RVDashboardSrv){
	
	BaseCtrl.call(this, $scope);
	// $scope.data = {
	// 	"firstname" : " Jos",
	// 	"lastname":"Schaap",
	// 	"late_checkout": "8",
	// 	"date":"feb 24, 2014",
	// 	"checking_in":"1",
	// 	"checking_out":"1",
	// 	"in_house":"1",
	// 	"guest_review_score":"7",
	// 	"currency_code" :"$",
	// 	"upsell_target":"9",
	// 	"actual_target":"9",
	// 	"vip_checkin":"2",
	// 	"rooms_for_upsell":"2",
	// 	"rooms_upsold":"3"
	// }

	/*
   * fetch details
   */

$scope.fetchData = function(){
	
	var fetchDashboardDetailsSuccessCallback = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	var fetchDashboardDetailsFailureCallback = function(data){
		$scope.$emit('hideLoader');
	};
	$scope.invokeApi(RVDashboardSrv.fetchDashboardDetails, {},fetchDashboardDetailsSuccessCallback,fetchDashboardDetailsFailureCallback);	
	
}

$scope.fetchData();
	
}]);

    