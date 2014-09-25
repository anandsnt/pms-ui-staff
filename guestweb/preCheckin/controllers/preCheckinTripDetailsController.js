
(function() {
	var preCheckinTripDetailsController = function($scope, preCheckinSrv,$rootScope,$state) {

    $scope.isLoading = true;
	// preCheckinSrv.fetchTripDetails().then(function(response) {
	// 		$scope.isLoading = false;	
	// 		$scope.success = (response.status != "failure") ? true : false;    	
	// 	},function(){
	// 		$scope.netWorkError = true;
	// 		$$scope.isLoading = false;
	// });
};

var dependencies = [
'$scope',
'preCheckinSrv','$rootScope','$state',
preCheckinTripDetailsController
];

snt.controller('preCheckinTripDetailsController', dependencies);
})();