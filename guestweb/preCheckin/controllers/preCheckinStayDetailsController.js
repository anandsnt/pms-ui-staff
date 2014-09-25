(function() {
	var preCheckinStayDetailsController = function($scope, preCheckinSrv,$rootScope,$state) {
	
	var init = function(){
		$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
        $scope.minutes = ["00","15","30","45"];
        $scope.stayDetails = {};
        //set 3:00pm as default
        $scope.stayDetails.hour = "03";
        $scope.stayDetails.minute = "00";
        $scope.stayDetails.primeTime = "PM";

	};
	init();
	$scope.isLoading = true;
	

	$scope.postStayDetails = function(){
		// var data = {
		// 	"year":$scope.yearSelected,
		// 	"month":$scope.monthSelected,
		// 	"primeTime":primeTimeSelected,
		// 	"comment":comment,
		// 	""
		// }

		// preCheckinSrv.completePrecheckin().then(function(response) {
	// 		$scope.isLoading = false;	
	// 		var success = (response.status != "failure") ? true : false;
			// if(success){
			// 	$state.go('checkinReservationDetails');
			// }    	
	// 	},function(){
	// 		$scope.netWorkError = true;
	// 		$$scope.isLoading = false;
	// });
		console.log($scope.stayDetails)
		//navigate to next page
		$state.go('preCheckinStatus');

	}
	

};

var dependencies = [
'$scope',
'preCheckinSrv','$rootScope','$state',
preCheckinStayDetailsController
];

snt.controller('preCheckinStayDetailsController', dependencies);
})();