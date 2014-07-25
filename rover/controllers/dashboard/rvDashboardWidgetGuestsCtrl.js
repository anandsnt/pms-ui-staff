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

        // we have to show the seach results area
        $scope.$emit("showSearchResultsArea", true);
		// we are hiding the dashboard
		$scope.$emit("showDashboardArea", false);

        //setting the backbutton & showing the caption
        $scope.$emit("UpdateSearchBackbuttonCaption", "Dashboard")

        var headingDict = {
            'DUEIN': 'DASHBOARD_SEARCH_CHECKINGIN',
            'DUEOUT': 'DASHBOARD_SEARCH_CHECKINGOUT',
            'INHOUSE': 'DASHBOARD_SEARCH_INHOUSE',
            'LATE_CHECKOUT': 'DASHBOARD_SEARCH_LATECHECKOUT',
            'VIP': "DASHBOARD_SEARCH_VIP",
            'NORMAL_SEARCH': 'SEARCH_NORMAL'
        }
        var heading = '';
        if (that.clickedType in headingDict){
            heading = headingDict[that.clickedType];
        }
        else {
            heading = headingDict['NORMAL_SEARCH'];
        }
        $scope.$emit("UpdateHeading", heading);

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
        data.status = type;        
        that.clickedType = type;
        $scope.invokeApi(RVSearchSrv.fetch, data, successCallbackOfSearchDetailsFetch);
    }  	



}]);