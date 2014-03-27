hkRover.controller('HKappCtrl',['$rootScope', '$scope', '$state', '$log', function($rootScope, $scope, $state){
    $scope.hasLoader = false;
    $scope.menuOpen = false;
    $scope.filterOpen = false;

    $scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
    });

    //when state change start happens, we need to show the activity activator to prevent further clicking
    //this will happen when prefetch the data
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) { 
        // Show a loading message until promises are not resolved
        $scope.$emit('showLoader');        
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

    $scope.$on("hideNavMenu", function(){
        $scope.menuOpen = false;
    });

    $scope.$on("filterRoomsClicked", function(){
    	$scope.filterOpen = !$scope.filterOpen;
    });

    $scope.$on("showLoader", function(){
        $scope.hasLoader = !$scope.hasLoader;
    });

    $scope.$on("hideLoader", function(){        
        $scope.hasLoader = !$scope.hasLoader;
    });
    
    $scope.isMenuOpen = function(){
        return $scope.menuOpen ? true : false;
    };

    $scope.isRoomFilterOpen = function(){
        return $scope.filterOpen ? true : false;
    };

    $scope.$on("dismissFilterScreen", function(){
        $scope.filterOpen = false;
    });
                
    $scope.$on("showFilterScreen",function(){
        $scope.filterOpen = true;
    });

    // few global setting for iscrolls
    // add a custom class 'myScrollbarV'
    // for vertical scroll the class name will be 'myScrollbarV'
    $rootScope.myScrollOptions = {
        scrollbarClass: 'myScrollbar'
    };
    
}]);

