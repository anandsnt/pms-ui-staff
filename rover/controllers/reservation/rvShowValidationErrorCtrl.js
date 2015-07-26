sntRover.controller('RVShowRoomNotAvailableCtrl',['$rootScope', '$scope', 'ngDialog', '$state', '$vault',
  function($rootScope, $scope, ngDialog, $state, $vault){
	BaseCtrl.call(this, $scope);

	$scope.okButtonClicked = function(){
		if($rootScope.isHourlyRateOn){
			 var reservationDataToKeepinVault = {};
            var roomData = $scope.reservationData.rooms[0];

            reservationDataToKeepinVault.fromDate       = new tzIndependentDate($scope.reservationData.arrivalDate).getTime();
            reservationDataToKeepinVault.toDate         = new tzIndependentDate($scope.reservationData.departureDate).getTime();
            reservationDataToKeepinVault.arrivalTime    = $scope.reservationData.checkinTime;
            reservationDataToKeepinVault.departureTime  = $scope.reservationData.checkoutTime;
            reservationDataToKeepinVault.adults         = roomData.numAdults;
            reservationDataToKeepinVault.children       = roomData.numChildren;
            reservationDataToKeepinVault.infants        = roomData.numInfants;
            reservationDataToKeepinVault.roomTypeID     = roomData.roomTypeId;
            reservationDataToKeepinVault.guestFirstName = $scope.reservationData.guest.firstName;
            reservationDataToKeepinVault.guestLastName  = $scope.reservationData.guest.lastName;
            reservationDataToKeepinVault.companyID      = $scope.reservationData.company.id;
            reservationDataToKeepinVault.travelAgentID  = $scope.reservationData.travelAgent.id;
            //$vault.set('searchReservationData', JSON.stringify(reservationDataToKeepinVault));
            $state.go('rover.diary', {
                isfromcreatereservation: true
            });
            ngDialog.close();
		} else {
			ngDialog.close();
		}
	};


}]);