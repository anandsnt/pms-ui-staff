sntRover.controller('rvDashboardGuestWidgetController',['$scope', 'RVSearchSrv', '$state', function($scope, RVSearchSrv, $state){
	/**
	* controller class for dashbaord's guest's area
	*/
	var that = this;
  	BaseCtrl.call(this, $scope);

    this.clickedType = '';

    /*
    * function to exceute on clicking the guest today buttons
    * we will call the webservice with given type and
    * will update search results and show search area
    */
    $scope.clickedOnGuestsToday = function(event, type, numberOfReservation) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        //disable reservation search for house keeping
        if(!$scope.disableReservations){
            var stateParams = {'type': type, 'from_page': 'DASHBOARD'};
            $state.go('rover.search', stateParams);
        }
        else {
            return;
        }
    };



}]);