sntRover.controller('roverController',['$rootScope', '$scope', '$state', function($rootScope, $scope, $state){

	$scope.init = function () {
		
	BaseCtrl.call(this, $scope);
	$scope.menuOpen = false;
		
    }

    $scope.init();
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
        $scope.isMenuOpen() && $scope.toggleMainNav();
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

}]);
