
(function() {
	var checkInConfirmationViewController = function($scope,$modal,$rootScope,$location,checkinConfirmationService,checkinDetailsService) {

		$scope.pageSuccess = true;

		if($rootScope.isCheckedin){

			$scope.pageSuccess = false;
			$location.path('/checkinSuccess');
		}
		else if($rootScope.isCheckedout){

			$scope.pageSuccess = false;
			$location.path('/checkOutNowSuccess');
		}
		else if(!$rootScope.isCheckin){

			$scope.pageSuccess = false;
			$location.path('/');
		}

 		//setup options for modal

 		$scope.opts = {
 			backdrop: true,
 			backdropClick: true,
 			templateUrl: '/assets/checkin/partials/errorModal.html',
 			controller: ModalInstanceCtrl,

 		};



 		if($scope.pageSuccess){

		//set up flags related to webservice

		$scope.isPosting 		 = false;
		$rootScope.netWorkError  = false;


		// watch for any change

		$rootScope.$watch('netWorkError',function(){

			if($rootScope.netWorkError)
				$scope.isPosting = false;
		});


		//next button clicked actions

		$scope.nextButtonClicked = function() {


			var data = {'departure_date':$rootScope.departureDate,'credit_card':$scope.cardDigits,'reservation_id':$rootScope.reservationID};
			$scope.isPosting 		 = true;

		//call service

		checkinConfirmationService.login(data).then(function(response) {

			$scope.isPosting 		 = false;


			if(response.status === 'failure')
					$modal.open($scope.opts); // error modal popup
				else{

					// display options for room upgrade screen

					$rootScope.ShowupgradedLabel = false;
					$rootScope.roomUpgradeheading = "Your Trip details";
					$scope.isResponseSuccess         = true;

					checkinDetailsService.setResponseData(response.data);
					
					
					$rootScope.upgradesAvailable = (response.data.is_upgrades_available === "true") ? true :  false;

					//navigate to next page


					$location.path('/checkinReservationDetails'); 

				}

			});

	};

		// navigate to calendar view

		$scope.presentDatePicker = function(){

			$location.path('/checkinDatePicker');
		}

	}

};

var dependencies = [
'$scope','$modal','$rootScope','$location','checkinConfirmationService','checkinDetailsService',
checkInConfirmationViewController
];

snt.controller('checkInConfirmationViewController', dependencies);
})();


// controller for the modal

var ModalInstanceCtrl = function ($scope, $modalInstance) {


	$scope.closeDialog = function () {
		$modalInstance.dismiss('cancel');
	};
};