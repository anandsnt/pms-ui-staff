(function() {
	var guestDetailsController = function($scope,$rootScope,$state,guestDetailsService) {

	$scope.pageValid = false;

	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else if($rootScope.isCheckedout ){
		$state.go('checkOutStatus');
	}
	else{
		$scope.pageValid = true;
	}		

	if($scope.pageValid){
		$scope.countries = [];
		$scope.years     = [];
		$scope.months    = [];
		$scope.days      = [];

		
		for(year=1900;year<=new Date().getFullYear();year++){
			$scope.years.push(year);
		};
		for(month=1;month<=12;month++){
			$scope.months.push(month);
		};
		
		for(day=1;day<=31;day++){
			$scope.days.push(day);
		};

		//fetch details
		var fetchGuestDetails = function(){
			$scope.isLoading = true;
			guestDetailsService.getGuestDetails().then(function(response) {
				$scope.isLoading          = false;
				$scope.guestDetails       = response;
				$scope.guestDetails.day   = ($scope.guestDetails.birthday !== null) ? parseInt($scope.guestDetails.birthday.substring(8, 10)): "";
				$scope.guestDetails.month = ($scope.guestDetails.birthday !== null)?  parseInt($scope.guestDetails.birthday.substring(5, 7)) : "";
				$scope.guestDetails.year  = ($scope.guestDetails.birthday !== null)?  parseInt($scope.guestDetails.birthday.substring(0, 4)): "";
			},function(){
				$rootScope.netWorkError   = true;
				$scope.isLoading          = false;
			});
		};

		//fetch country list
		$scope.isLoading = true;
		guestDetailsService.fetchCountryList().then(function(response) {
			$scope.countries = response;
			$scope.isLoading = false;
			fetchGuestDetails();
		},function(){
			$rootScope.netWorkError = true;
			$scope.isLoading = false;
		});
		
	
		var getDataToSave = function(){
			var data 				= {};
			var unwanted_keys 		= ["month","year","day"];
			var newObject 			= JSON.parse(JSON.stringify($scope.guestDetails));
            for(var i=0; i < unwanted_keys.length; i++){
                delete newObject[unwanted_keys[i]];
            };
            data 					= newObject;
            data.birthday 			= $scope.guestDetails.month+"-"+$scope.guestDetails.day+"-"+$scope.guestDetails.year;
			return data;
		};

		//post guest details
		$scope.postGuestDetails = function(){
			$scope.isLoading 		= true;
			var dataToSave 			= getDataToSave();
			guestDetailsService.postGuestDetails(dataToSave).then(function(response) {
				$scope.isLoading 	= false;
				if($rootScope.upgradesAvailable){
					$state.go('checkinUpgrade');
				}
				else{
					  if($rootScope.isAutoCheckinOn){
					    $state.go('checkinArrival');
					  }
					  else{
					    $state.go('checkinKeys');
					  }
				}
			},function(){
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			})
		};		
	}
};

var dependencies = [
'$scope','$rootScope','$state','guestDetailsService',
guestDetailsController
];

snt.controller('guestDetailsController', dependencies);
})();