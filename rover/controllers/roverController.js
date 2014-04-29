sntRover.controller('roverController',['$rootScope', '$scope', '$state','$window', function($rootScope, $scope, $state,$window){

	$scope.init = function () {

$scope.isDashBoardActive = true;
$scope.isSearchActive = false;

 $rootScope.adminRole = '';
 $rootScope.$watch('adminRole',function(){

        if($rootScope.adminRole == "Hotel admin" )
            $scope.isHotelAdmin =  true;
         if($rootScope.adminRole == "Hotel staff" )
            $scope.isHotelStaff =  true;

     })

	BaseCtrl.call(this, $scope);
	$scope.menuOpen = false;
		
    }

    $scope.init();


    $scope.leftMenuSelected = function(menu){

        if(menu === 'Dashboard'){
            $scope.isDashBoardActive = true;
            $scope.isSearchActive = false
        }
        else if(menu === 'Search'){
            $scope.isSearchActive    = true;
            $scope.isDashBoardActive = false;
        }


    };



    $scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
    });
    
 	$scope.isMenuOpen = function(){
        return $scope.menuOpen ? true : false;
    };


    //when state change start happens, we need to show the activity activator to prevent further clicking
    //this will happen when prefetch the data
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) { 
        // Show a loading message until promises are not resolved
        $scope.$emit('showLoader');

        // if menu is open, close it
        $scope.isMenuOpen();
    });

    $rootScope.$on('$stateChangeSuccess', function(e, curr, prev) { 
        // Hide loading message
        $scope.$emit('hideLoader');
    }); 
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
        // Hide loading message
        $scope.$emit('hideLoader');
        //TODO: Log the error in proper way
    });

    $scope.settingsClicked = function(){
        if($scope.isHotelAdmin)
           $window.location.href = "/admin";
       else if($scope.isHotelStaff)
            alert("Staff");
    }

}]);
