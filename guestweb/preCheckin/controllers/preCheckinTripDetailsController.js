
(function() {
	var preCheckinTripDetailsController = function($scope, preCheckinSrv) {

    $scope.isLoading = true;
	preCheckinSrv.fetchTripDetails().then(function(response) {
			$scope.isLoading = false;	
			$scope.tripDetails = response;
		},function(){
			$scope.netWorkError = true;
			$scope.isLoading = false;
	});
};

var dependencies = [
'$scope',
'preCheckinSrv',
preCheckinTripDetailsController
];

snt.controller('preCheckinTripDetailsController', dependencies);
})();