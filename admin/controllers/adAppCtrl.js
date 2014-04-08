
admin.controller('ADAppCtrl',['$state', '$scope', '$rootScope','ADAppSrv', '$stateParams', function($state, $scope, $rootScope, ADAppSrv, $stateParams ){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.menuOpen = false;
	$scope.hotelListOpen = '';
	$scope.selectedIndex = -1;

	//when there is an occured while trying to access any menu details, we need to show that errors

	$scope.errorMessage = '';

	if($rootScope.adminRole == "hotel-admin" ){

		$scope.isHotelAdmin =  true;
	}	
	else{
		$scope.isHotelAdmin =  false;
	}

	$scope.successCallbackOfMenuLoading = function(data){
		//$scope.currentIndex = 0;
		$scope.data = data;
		$scope.selectedMenu = $scope.data.menus[0];		
		
	};
	
	$scope.$on("changedSelectedMenu", function(event, menu){
		console.log('in changedSleectedmenu');
		$scope.selectedIndex = menu;
	});
	
	$scope.invokeApi(ADAppSrv.fetch, {}, $scope.successCallbackOfMenuLoading);

	// if there is any error occured 
    $scope.$on("showErrorMessage", function($event, errorMessage){
    	$event.stopPropagation();
    	$scope.errorMessage = errorMessage;
        
    });

	
	//function to change the selected menu
	//index is the array position
	/*$scope.setSelectedMenu = function(index)	{
		if(index < $scope.data.menus.length){
			$scope.selectedMenu = $scope.data.menus[index];
			$scope.currentIndex = index;
		}
	};*/
	
	$scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
    });
    
 	$scope.isMenuOpen = function(){
        return $scope.menuOpen ? true : false;
    };


    $scope.$on("showLoader", function(){
        $scope.hasLoader = true;
    });

    $scope.$on("hideLoader", function(){
        $scope.hasLoader = false;
    });    

    $scope.isHotelListOpen = function(){
        $scope.hotelListOpen = ($scope.hotelListOpen == "open") ? "" : "open";
    };
    $scope.redirectToHotel = function(hotel_id){
    	ADAppSrv.redirectToHotel(hotel_id).then(function(data) {
    		console.log("reached");
			$state.go("admin.dashboard");
	
		},function(){
			console.log("error controller");
		});	
    };

}]);

    