
(function() {
	var checkInReservationDetails = function($scope,$modal,$rootScope) {


 //setup options for modal

		$scope.opts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkin/partials/errorModal.html',
			controller: ModalInstanceCtrl,

		};

		$scope.openDialog = function() {
			var d = $modal.open($scope.opts);

		};
  //to be used when authentication failded

 		 // $scope.openDialog();

};

		var dependencies = [
		'$scope','$modal','$rootScope',
		checkInReservationDetails
		];

		snt.controller('checkInReservationDetails', dependencies);
		})();


// controller for the modal

		var ModalInstanceCtrl = function ($scope, $modalInstance) {


			$scope.closeDialog = function () {
				$modalInstance.dismiss('cancel');
			};
};