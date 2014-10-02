
(function() {
	var preCheckinTripDetailsController = function($scope, preCheckinSrv,$rootScope) {


	var extractArrivalTime = function(){
		$rootScope.stayDetails = {}; 
		$rootScope.stayDetails.hour = ($scope.tripDetails.arrival_time.length >0) ? $scope.tripDetails.arrival_time.substring(0,2):"";
		$rootScope.stayDetails.minute = ($scope.tripDetails.arrival_time.length >0) ? $scope.tripDetails.arrival_time.substring(3,5):"";
		$rootScope.stayDetails.primeTime = ($scope.tripDetails.arrival_time.length >0) ? $scope.tripDetails.arrival_time.substring(6,9):"";		
	}
	
    $scope.isLoading = true;
	preCheckinSrv.fetchTripDetails().then(function(response) {
			$scope.isLoading = false;	
			$scope.tripDetails = response;
			extractArrivalTime();
		},function(){
			$scope.netWorkError = true;
			$scope.isLoading = false;
	});
};

var dependencies = [
'$scope',
'preCheckinSrv','$rootScope',
preCheckinTripDetailsController
];

snt.controller('preCheckinTripDetailsController', dependencies);
})();