/*
	guest birthday details Ctrl 
	If the admin settings for this is turned on , this screen will be shown and user can
	update the guest birthday details here.
*/
(function() {
	var birthDateDetailsController = function($scope, $rootScope, $state, guestDetailsService, $modal) {

	$scope.pageValid = false;

	if($rootScope.isCheckedin) {
	 	$state.go('checkinSuccess');
	 }
	 else if($rootScope.isCheckedout ) {
	 	$state.go('checkOutStatus');
	 }
	 else{
		$scope.pageValid = true;
	}		

	if($scope.pageValid) {
		
		$scope.years     	= [];
		$scope.months   	= [];
		$scope.days      	= [];
		
		for(year=new Date().getFullYear();year>=1900;year--) {
			$scope.years.push(year);
		};

		$scope.months = [
							{"id":1, "name":"JAN"},
							{"id":2, "name":"FEB"},
							{"id":3, "name":"MAR"},
							{"id":4, "name":"APR"},
							{"id":5, "name":"MAY"},
							{"id":6, "name":"JUN"},
							{"id":7, "name":"JUL"},
							{"id":8, "name":"AUG"},
							{"id":9, "name":"SEP"},
							{"id":10, "name":"OCT"},
							{"id":11, "name":"NOV"},
							{"id":12, "name":"DEC"}
						];
			
		for(day=1;day<=31;day++) {
			$scope.days.push(day);
		};
		$scope.guestDetails 	  = {};
		$scope.guestDetails.day   =  "";
		$scope.guestDetails.month =  "";
		$scope.guestDetails.year  =	 "";

	
		var getDataToSave = function() {
			var data 				= {};
			var unwanted_keys 		= ["month", "year", "day"];
			var newObject 			= JSON.parse(JSON.stringify($scope.guestDetails));
            for(var i=0; i < unwanted_keys.length; i++) {
                delete newObject[unwanted_keys[i]];
            };
            data 					= newObject;
            if($scope.guestDetails.month && $scope.guestDetails.day && $scope.guestDetails.year) {
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

		var goToNextStep = function() {
			if($rootScope.guestPromptAddressOn) {
				$state.go('promptGuestDetails');
			}
			else if(!$rootScope.guestAddressOn || $rootScope.isGuestAddressVerified) {
				// if room upgrades are available
				if($rootScope.upgradesAvailable) {
					$state.go('checkinUpgrade');
				}
				else{
					  if($rootScope.isAutoCheckinOn) {
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


		var checkIfDateIsValid = function() {
			var birthday = $scope.guestDetails.month+"/"+$scope.guestDetails.day+"/"+$scope.guestDetails.year;	
			var comp = birthday.split('/');
			var m = parseInt(comp[0], 10);
			var d = parseInt(comp[1], 10);
			var y = parseInt(comp[2], 10);
			var date = new Date(y, m-1, d);
			if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
			   return true
			} else {
			   return false;
			}
		};
	



		$scope.yearOrMonthChanged = function() {
			if(!checkIfDateIsValid()) {
				$scope.guestDetails.day = "";
			}else{
				return;
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
		var checkIfGuestIsEligible = function() {
			var birthday = $scope.guestDetails.month+"/"+$scope.guestDetails.day+"/"+$scope.guestDetails.year;	
			$scope.isLoading 		= false;
			if(getAge(birthday) >= $rootScope.minimumAge || $rootScope.minimumAge === 0) {
				$scope.isLoading 		= true;
				var dataToSave 			= getDataToSave();
				guestDetailsService.postGuestBirthDate(dataToSave).then(function(response) {
					$scope.isLoading 	= false;
					$rootScope.isBirthdayVerified =  true;
					goToNextStep();
				}, function() {
					$rootScope.netWorkError = true;
					$scope.isLoading = false;
				});
			}
			else{
				$state.go('guestNotEligible');
			};
		};

		//post guest details
		$scope.postGuestDetails = function() {

			if($scope.guestDetails.day  && $scope.guestDetails.month && $scope.guestDetails.year) {
				checkIfGuestIsEligible();
			}
			else{
				$modal.open($scope.opts);
			};
		};

		//skip the birthday
		$scope.skip = function() {
			goToNextStep();
		};
	}
};

var dependencies = [
'$scope', '$rootScope', '$state', 'guestDetailsService', '$modal',
birthDateDetailsController
];

sntGuestWeb.controller('birthDateDetailsController', dependencies);
})();