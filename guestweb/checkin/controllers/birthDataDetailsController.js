/*
	guest birthday details Ctrl 
	If the admin settings for this is turned on , this screen will be shown and user can
	update the guest birthday details here.
*/
(function() {
	var birthDataDetailsController = function($scope,$rootScope,$state,guestDetailsService,$modal) {

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
		
		$scope.years     	= [];
		$scope.months   	= [];
		$scope.days      	= [];
		
		for(year=1900;year<=new Date().getFullYear();year++){
			$scope.years.push(year);
		};
		for(month=1;month<=12;month++){
			$scope.months.push(month);
		};
		
		for(day=1;day<=31;day++){
			$scope.days.push(day);
		};
		$scope.guestDetails 	  = {};
		$scope.guestDetails.day   =  "";
		$scope.guestDetails.month =  "";
		$scope.guestDetails.year  =	 "";

	
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

		var goToNextStep = function(){
			if($rootScope.guestPromptAddressOn){
				$state.go('promptGuestDetails');
			}
			else if(!$rootScope.guestAddressOn || $rootScope.isGuestAddressVerified){
				// if room upgrades are available
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
				};
			}
			else{
					$state.go('guestDetails');	
			}		
		};

		function getAge(birthDateString) {
		    var today = new Date();
		    var birthDate = new Date(birthDateString);
		    var age = today.getFullYear() - birthDate.getFullYear();
		    var m = today.getMonth() - birthDate.getMonth();
		    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		        age--;
		    }
		    return age;
		};

		//check if guest is above age set in hotel admin
		//else redirect to front desk
		var checkIfGuestIsEligible = function(){
			var birthday = $scope.guestDetails.month+"/"+$scope.guestDetails.day+"/"+$scope.guestDetails.year;	
			$scope.isLoading 		= false;
			if(getAge(birthday) > $rootScope.minimumAge){
				$scope.isLoading 		= true;
				// var dataToSave 			= getDataToSave();
				// guestDetailsService.postGuestDetails(dataToSave).then(function(response) {
				// 	$scope.isLoading 	= false;
				// 	$rootScope.isGuestAddressVerified =  true;
				// 	goToNextStep();
				// },function(){
				// 	$rootScope.netWorkError = true;
				// 	$scope.isLoading = false;
				// });
goToNextStep();
			}
			else{
				$state.go('guestNotEligible');
			};
		};

		//post guest details
		$scope.postGuestDetails = function(){

			if($scope.guestDetails.day  && $scope.guestDetails.month && $scope.guestDetails.year){
				checkIfGuestIsEligible();
			}
			else{
				$modal.open($scope.opts);
			};
		};

		//skip the birthday
		$scope.skip = function(){
			goToNextStep();
		};
	}
};

var dependencies = [
'$scope','$rootScope','$state','guestDetailsService','$modal',
birthDataDetailsController
];

sntGuestWeb.controller('birthDataDetailsController', dependencies);
})();