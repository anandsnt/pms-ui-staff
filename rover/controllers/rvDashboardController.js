sntRover.controller('RVdashboardController',['$scope','RVDashboardSrv', function($scope,RVDashboardSrv){
	
	
	// $scope.data = {
	// 	"firstname" : " Jos",
	// 	"lastname":"Schaap",
	// 	"late_checkout": "8",
	// 	"date":"feb 24, 2014",
	// 	"due_in_count":null,
	// 	"due_out_count":"1",
	// 	"inhouse_count":"1",
	// 	"guest_review_score":"23",
	// 	"currency_code" :"$",
	// 	"upsell_target":"9",
	// 	"actual_target":"9",
	// 	"vip_checkin":"2",
	// 	"rooms_for_upsell":"2",
	// 	"rooms_upsold":"3"
	// }

   $scope.init =  function(){

   	BaseCtrl.call(this, $scope);
   	//Display greetings message based on current time
   	var d = new Date();
  	var time = d.getHours();
  	$scope.greetingsMessage = "";
  	if (time < 12){
  		$scope.greetingsMessage = "Good Morning";
  	}
  	else if (time >= 12 && time < 16){
  		$scope.greetingsMessage = "Good Afternoon";
  	}
  	else{
  		$scope.greetingsMessage = "Good Evening";
  	}

   }
   $scope.init();

	/*
   * fetch details
   */
$scope.fetchData = function(){
	
	var fetchDashboardDetailsSuccessCallback = function(data){
		$scope.dashboardData = data.dashboardData;
		$scope.userDetails   = data.userDetails;
		$scope.lateCheckoutDetails = data.lateCheckoutDetails;
		$scope.currencySymbol=getCurrencySign(data.userDetails.currency_code);
		$scope.$emit('hideLoader');
	};
	var fetchDashboardDetailsFailureCallback = function(data){
		$scope.$emit('hideLoader');
	};
	$scope.invokeApi(RVDashboardSrv.fetchDashboardDetails, {},fetchDashboardDetailsSuccessCallback,fetchDashboardDetailsFailureCallback);	
	
}

$scope.fetchData();
	
}]);

    