sntRover.controller('rvActivityLogCtrl',[
	'$scope',
	'$rootScope',
	'$filter', 
	function($scope, $rootScope ,$filter){

	console.log("rvActivityLogCtrllllllllll");
	console.log($scope);

	// set a back button on header
	$rootScope.setPrevState = {
		title: $filter('translate')('STAY_CARD'),
		callback: 'backToStayCard',
		scope: $scope
	};
		
	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';
	var title = $filter('translate')('ROOM_ASSIGNMENT_TITLE');
	$scope.setTitle(title);

	/**
	* function to go back to reservation details
	*/
	$scope.backToStayCard = function(){
		
		$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {id:$scope.reservationData.reservation_card.reservation_id, confirmationId:$scope.reservationData.reservation_card.confirmation_num});
		
	};

	$scope.init = function(){
		$scope.$emit('HeaderChanged', $filter('translate')('ACTIVITY_LOG_TITLE'));
	};
	$scope.init();

}]);