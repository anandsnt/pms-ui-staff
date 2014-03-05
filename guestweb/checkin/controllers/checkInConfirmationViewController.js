
(function() {
	var checkInConfirmationViewController = function($scope,$modal,$rootScope,$location) {


		$scope.subtitle1 = "To provide you with the a ";
		$scope.subtitle2 = "secure check-in ";
		$scope.subtitle3 = "process, please confirm the following";

 //setup options for modal

		$scope.opts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkin/partials/errorModal.html',
			controller: ModalInstanceCtrl,

		};

		$scope.openDialog = function() {

			$location.path('/checkinReservationDetails');
			//var d = $modal.open($scope.opts);

		};

		$scope.presentDatePicker = function(){

			$location.path('/checkinDatePicker');
		}
  //to be used when authentication failded

 		 // $scope.openDialog();

};

		var dependencies = [
		'$scope','$modal','$rootScope','$location',
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