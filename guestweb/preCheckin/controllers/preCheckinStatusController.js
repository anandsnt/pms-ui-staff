(function() {
	var preCheckinStatusController = function($scope, preCheckinSrv,$rootScope,$state) {

	$scope.isLoading = true;
	// preCheckinSrv.completePrecheckin().then(function(response) {
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
preCheckinStatusController
];

snt.controller('preCheckinStatusController', dependencies);
})();