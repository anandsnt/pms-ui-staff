
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

			


			var data = {'departureDate':$rootScope.departureDate,'creditCardDigits':$scope.cardDigits}

			checinConfirmationService.login(data).then(function(response) {

				if(response.status === 'failure')
					$modal.open($scope.opts);
				else
					$location.path('/checkinReservationDetails');

			});

		};

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