sntRover.controller('RVHKWorkTabCtrl', [
	'$scope',
	'$rootScope',
	'RVHkRoomDetailsSrv',
	'RVHkRoomStatusSrv',
	function($scope, $rootScope, RVHkRoomDetailsSrv, RVHkRoomStatusSrv) {

		BaseCtrl.call(this, $scope);

		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// shit nothing else works here :(
	}
]);