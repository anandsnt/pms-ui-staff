/*
	Precheckin final Ctrl where the pre checkin API is called
*/
(function() {
	var preCheckinStatusController = function($scope, preCheckinSrv,$rootScope,$state) {

	if($rootScope.collectCCOnCheckin && $rootScope.isMLI){
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