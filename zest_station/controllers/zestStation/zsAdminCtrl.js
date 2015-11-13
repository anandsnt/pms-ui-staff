sntZestStation.controller('zsAdminCtrl', [
	'$scope',
	'$state','zsEventConstants', 'zsTabletSrv',
	function($scope, $state,zsEventConstants, zsTabletSrv) {

	BaseCtrl.call(this, $scope);

	var hideNavButtons = function(){
		//hide back button
		$scope.$emit (zsEventConstants.HIDE_BACK_BUTTON);

		//hide close button
		$scope.$emit (zsEventConstants.HIDE_CLOSE_BUTTON);
	}
	var showNavButtons = function(){
		//show back button
		$scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);

		//show close button
		$scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
	}

        
        $scope.zestStationData.workstations = [];
	$scope.getWorkStationList = function($defer, params){
            console.info('$scope.getWorkStationList')
	/*	
            var getParams = $scope.calculateGetParams(params);
		var fetchSuccessOfItemList = function(data){
			$scope.$emit('hideLoader');
			//No expanded rate view
			$scope.currentClickedElement = -1;
			$scope.totalCount = data.total_count;
			$scope.totalPage = Math.ceil(data.total_count/$scope.displyCount);
			$scope.data = data.work_stations;
			$scope.currentPage = params.page();
        	params.total(data.total_count);
        	$scope.isAddMode = false;
            $defer.resolve($scope.data);
		};
		$scope.invokeApi(ADDeviceSrv.fetch, getParams, fetchSuccessOfItemList);
                
                */
                var onSuccess = function(response){
                    if (response){
                        $scope.zestStationData.workstations = response.work_stations;
                    }
                };
                var onFail = function(response){
                    console.warn('fetching workstation list failed:',response);
                };
            //?page=1&per_page=10&query=&sort_dir=true&sort_field=name
            var options = {
                
                params:                 {
                    page: 1,
                    per_page: 100,
                    query:'',
                    sort_dir: true,
                    sort_field: 'name'
                },
                successCallBack: 	    onSuccess,
                failureCallBack:        onFail
            };
            $scope.callAPI(zsTabletSrv.fetchWorkStations, options);
                
	};


	// initialize

	var initialize = function(){	
		$scope.input = {"inputTextValue" : ""};
		$scope.userName = "";
		$scope.passWord = "";
		hideNavButtons();
                $scope.getWorkStationList();
        //mode
        $scope.mode        = 'options-mode';
	};
	initialize();

	/**
	 * when the back button clicked
	 * @param  {[type]} event
	 * @return {[type]} 
	 */
	$scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
		initialize();
	});

	/**
	 * when we clicked on exit button
	 */
	$scope.navToPrev = function(){
		$state.go ('zest_station.home');
	};


	$scope.loginAdmin = function(){
		$scope.mode   = "admin-name-mode";
		$scope.headingText = 'Admin Username';
		showNavButtons();
	};
        
        

	$scope.goToNext  = function(){
		if($scope.mode   === "admin-name-mode"){
			$scope.userName = angular.copy($scope.input.inputTextValue);
			$scope.input.inputTextValue = "";
			$scope.mode   = "admin-password-mode";
			$scope.headingText = 'Admin Password';
		}
		else{
			$scope.passWord = angular.copy($scope.input.inputTextValue);
			console.log($scope.userName + $scope.passWord)
			$state.go('zest_station.home-admin',{'isadmin':true});
		}
	};
	
	
}]);