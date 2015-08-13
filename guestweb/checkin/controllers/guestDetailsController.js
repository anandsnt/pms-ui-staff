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

		$scope.years = [];
		$scope.months = [];
		$scope.days = [];
		for(year=1900;year<=new Date().getFullYear();year++){
			$scope.years.push(year);
		};
		for(month=1;month<=12;month++){
			$scope.months.push(month);
		};
		
		for(day=1;day<=31;day++){
			$scope.days.push(day);
		};


		// call service
		// $scope.isLoading = true;
		// guestDetailsService.getGuestDetails().then(function(response) {
		// 	$scope.isLoading = false;
		// 	$scope.guestDetails = response;
		// 	$scope.guestDetails.day   = ($scope.guestDetails.birthday !== null) ? parseInt($scope.guestDetails.birthday.substring(8, 10)): "";
		// 	$scope.guestDetails.month = ($scope.guestDetails.birthday !== null)?  parseInt($scope.guestDetails.birthday.substring(5, 7)) : "";
		// 	$scope.guestDetails.year  = ($scope.guestDetails.birthday !== null)?  parseInt($scope.guestDetails.birthday.substring(0, 4)): "";
		// },function(){
		// 	$rootScope.netWorkError = true;
		// 	$scope.isLoading = false;
		// });
	
		var getDataToSave = function(){
			var data = {};
			data.address = $scope.guestDetails.address;
			data.birthday = $scope.guestDetails.month+"-"+$scope.guestDetails.day+"-"+$scope.guestDetails.year;
			return data;
		};
		$scope.postGuestDetails = function(){
			$scope.isLoading = true;
			var dataToSave = getDataToSave();
			console.log(dataToSave)
			guestDetailsService.postGuestDetails(dataToSave).then(function(response) {
				$scope.isLoading = false;
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



		/*to delete*/

		$scope.countries = [{"id":16,"name":"US"},{"id":19,"name":"INDIA"}]
		$scope.guestDetails =  {"birthdayData":""};
		$scope.guestDetails.birthday = "2015-01-08";
		$scope.guestDetails.address = {
								        "street1": "NADAKAVU",
								        "street2": "CLA",
								        "city": "CALCUT",
								        "state": "KERALA",
								        "postal_code": "11313",
								        "country_id": 19
								    	}
								    	$scope.guestDetails.day   = ($scope.guestDetails.birthday !== null) ? parseInt($scope.guestDetails.birthday.substring(8, 10)): "";
			$scope.guestDetails.month = ($scope.guestDetails.birthday !== null)?  parseInt($scope.guestDetails.birthday.substring(5, 7)) : "";
			$scope.guestDetails.year  = ($scope.guestDetails.birthday !== null)?  parseInt($scope.guestDetails.birthday.substring(0, 4)): "";
		/*to delete*/
	
		
	}
};

var dependencies = [
'$scope','$rootScope','$state','guestDetailsService',
guestDetailsController
];

snt.controller('guestDetailsController', dependencies);
})();