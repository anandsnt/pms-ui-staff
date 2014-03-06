
(function() {
	var checkInConfirmationViewController = function($scope,$modal,$rootScope,$location,checinConfirmationService) {

 		//setup options for modal

		$scope.opts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkin/partials/errorModal.html',
			controller: ModalInstanceCtrl,

		};

		$scope.nextButtonClicked = function() {

			var data = {'departure_date':$rootScope.departureDate,'credit_card':$scope.cardDigits,'reservation_id':$rootScope.reservationID};


			checinConfirmationService.login(data).then(function(response) {


				if(response.status === 'failure')
					$modal.open($scope.opts); // error modal popup
				else{

					// display options for room upgrade screen

					$rootScope.ShowupgradedLabel = false;
					$rootScope.upgradesAvailable = true;
					$rootScope.roomUpgradeheading = "Your Trip details";


					$location.path('/checkinReservationDetails'); //navigate to next page

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