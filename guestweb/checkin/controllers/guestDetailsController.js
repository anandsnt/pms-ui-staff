(function() {
	var guestDetailsController = function($scope,$rootScope,$state,guestDetailsService,$modal) {

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
		
		$scope.countries 	= [];
		$scope.years     	= [];
		$scope.months   	= [];
		$scope.days      	= [];
		$scope.guestDetails = {
								'day':'',
								'month':'',
								'year':'',
								'postal_code':'',
								'state':'',
								'city':'',
								'street1':'',
								'street2':'',
								'birthday':'',
								'country_id':''
							  };

		
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
            if($scope.guestDetails.month && $scope.guestDetails.day && $scope.guestDetails.year){
            	data.birthday = $scope.guestDetails.month+"-"+$scope.guestDetails.day+"-"+$scope.guestDetails.year;
            }
            else{
            	delete data["birthday"];
            };
            
			return data;
		};
		
		$scope.opts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkin/partials/guestDetailsErrorModal.html',
			controller: ModalInstanceCtrl
		};

		//post guest details
		$scope.postGuestDetails = function(){

			if($scope.guestDetails.country_id  && $scope.guestDetails.street1  && $scope.guestDetails.street2  && $scope.guestDetails.city  && $scope.guestDetails.state && $scope.guestDetails.postal_code ){
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
				});
			}
			else{
				$modal.open($scope.opts);
			};
		};		
	}
};

var dependencies = [
'$scope','$rootScope','$state','guestDetailsService','$modal',
guestDetailsController
];

snt.controller('guestDetailsController', dependencies);
})();