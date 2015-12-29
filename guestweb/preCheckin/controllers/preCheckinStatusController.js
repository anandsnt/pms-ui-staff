/*
	Precheckin final Ctrl where the pre checkin API is called
*/
(function() {
	var preCheckinStatusController = function($scope, preCheckinSrv,$rootScope,$state) {
	// if prompt for cc is turned on
	// we will always ask for CC addition in case of MLI
	if($rootScope.collectCCOnCheckin && $rootScope.isMLI && !$rootScope.isCcAttachedFromGuestWeb){
		$state.go('checkinCcVerification');
	}
	else{
		$scope.isLoading = true;
		preCheckinSrv.completePrecheckin().then(function(response) {
			$scope.isLoading = false;
			if(response.status === 'failure'){
				$scope.netWorkError = true;
			}
			else{
				$scope.responseData =response.data;
			};
		},function(){
			$scope.netWorkError = true;
			$scope.isLoading = false;
		});
	}
};

var dependencies = [
'$scope',
'preCheckinSrv','$rootScope','$state',
preCheckinStatusController
];

sntGuestWeb.controller('preCheckinStatusController', dependencies);
})();