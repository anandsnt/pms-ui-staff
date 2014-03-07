
(function() {
	var checkInConfirmationViewController = function($scope,$modal,$rootScope,$location,checinConfirmationService) {

 		//setup options for modal

		$scope.opts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkin/partials/errorModal.html',
			controller: ModalInstanceCtrl,

		};

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
		
			checinConfirmationService.login(data).then(function(response) {

				$scope.isPosting 		 = false;


				if(response.status === 'failure')
					$modal.open($scope.opts); // error modal popup
				else{

					// display options for room upgrade screen

					$rootScope.ShowupgradedLabel = false;
					$rootScope.roomUpgradeheading = "Your Trip details";
					$rootScope.reservationData = response.data;


					//to be replaced by the code below

					$rootScope.upgradesAvailable = true;
					
					//$rootScope.upgradesAvailable = (response.data.is_upgrades_available === "true") ? true :  false;

					//navigate to next page


					$location.path('/checkinReservationDetails'); 

				}

			});

		};

		// navigate to calendar view

		$scope.presentDatePicker = function(){

			$location.path('/checkinDatePicker');
		}

};

		var dependencies = [
		'$scope','$modal','$rootScope','$location','checinConfirmationService',
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