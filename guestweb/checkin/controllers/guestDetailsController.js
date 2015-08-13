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
		$scope.countries = [{"id":16,"name":"US"},{"id":"19","name":"INDIA"}]
		$scope.guestDetails =  {

								    "birthday": "2015-01-01",
								    "address": {
								        "street1": "NADAKAVU",
								        "street2": "CLA",
								        "city": "CALCUT",
								        "state": "KERALA",
								        "postal_code": "11313",
								        "country_id": 16
								    	}
								};
	}
};

var dependencies = [
'$scope','$rootScope','$state',
guestDetailsController
];

snt.controller('guestDetailsController', dependencies);
})();