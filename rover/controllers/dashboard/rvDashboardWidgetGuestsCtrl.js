sntRover.controller('rvDashboardGuestWidgetController',['$scope', 'RVSearchSrv', function($scope, RVSearchSrv){
	/**
	* controller class for dashbaord's guest's area
	*/
	var that = this;
  	BaseCtrl.call(this, $scope);

    this.clickedType = '';

    /**
    * Successcall baack of search fetch from guest
    */
    var successCallbackOfSearchDetailsFetch = function(data){
    	$scope.$emit('hideLoader');
        $scope.$emit("updateDashboardSearchDataFromExternal", data);

        // we are showing the seach results area
        $scope.$emit("showSearchResultsArea", true);
		// we are hiding the dashboard
		$scope.$emit("showDashboardArea", false);

        //setting the backbutton & showing the caption
        $scope.$emit("UpdateBackbuttonCaption", "Dashboard");

        //updating type
        $scope.$emit("updateDashboardSearchTypeFromExternal", this.clickedType);
    };

    /*
    * function to exceute on clicking the guest today buttons
    * we will call the webservice with given type and
    * will update search results and show search area
    */
    $scope.clickedOnGuestsToday = function(event, type) {
        var data = {};
        if(type == "LATE_CHECKOUT"){
            data.is_late_checkout_only = true;
        }
        else{
            data.status = type;
        }
        that.clickedType = type;
        $scope.invokeApi(RVSearchSrv.fetch, data, successCallbackOfSearchDetailsFetch);
    }  	



}]);