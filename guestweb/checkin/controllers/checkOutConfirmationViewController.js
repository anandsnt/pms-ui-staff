
(function() {
	var checkInConfirmationViewController = function($scope,$modal,$rootScope) {

  
		$scope.subtitle1 = "To provide you with the a ";
		$scope.subtitle2 = "secure check-in ";
		$scope.subtitle3 = "process, please confirm the following";

$scope.opts = {
    backdrop: true,
    backdropClick: true,
    templateUrl: '/assets/checkin/partials/errorModal.html',

  };

$scope.openDialog = function() {
    var d = $modal.open($scope.opts);
   
  };
  $scope.openDialog();

};

	var dependencies = [
	'$scope','$modal','$rootScope',
	checkInConfirmationViewController
	];

	snt.controller('checkInConfirmationViewController', dependencies);
})();