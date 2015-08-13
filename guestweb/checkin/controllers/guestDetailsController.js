(function() {
	var guestDetailsController = function($scope,$rootScope,$state) {

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
			$scope.years.push({"id":year,"name":year});
		};
		for(month=1;month<=12;month++){
			$scope.months.push({"id":month,"name":month});
		};
		for(day=1;day<=31;day++){
			$scope.days.push({"id":day,"name":day});
		};


		/*to delete*/

		$scope.countries = [{"id":16,"name":"US"},{"id":"19","name":"INDIA"}]
		$scope.guestDetails =  {

								    "birthday": "2015-11-23",
								    "address": {
								        "street1": "NADAKAVU",
								        "street2": "CLA",
								        "city": "CALCUT",
								        "state": "KERALA",
								        "postal_code": "11313",
								        "country_id": 16
								    	}
								};
		/*to delete*/
	
		$scope.guestDetails.day   = ($scope.guestDetails.birthday !== null) ? $scope.guestDetails.birthday.substring(8, 10): "";
		$scope.guestDetails.month = ($scope.guestDetails.birthday !== null)?  $scope.guestDetails.birthday.substring(5, 7) : "";
		$scope.guestDetails.year  = ($scope.guestDetails.birthday !== null)?  $scope.guestDetails.birthday.substring(0, 4) : "";
		console.log($scope.guestDetails);
	}
};

var dependencies = [
'$scope','$rootScope','$state',
guestDetailsController
];

snt.controller('guestDetailsController', dependencies);
})();