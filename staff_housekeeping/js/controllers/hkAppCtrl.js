hkRover.controller('HKappCtrl',['$rootScope', '$scope', '$state', '$log', 'ngDialog',
    function($rootScope, $scope, $state, $log, ngDialog){
    $scope.hasLoader = false;
    $scope.menuOpen = false;
    $scope.filterOpen = false;


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

    $scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
    });

    $scope.$on("hideNavMenu", function(){
        $scope.menuOpen = false;
    });

    $scope.$on("filterRoomsClicked", function(){
    	$scope.filterOpen = !$scope.filterOpen;
    });

    $scope.$on('showLoader', function(){
        $scope.hasLoader = true;
    });

    $scope.$on('hideLoader', function(){
        $scope.hasLoader = false;
    });

    $scope.toggleMainNav = function() {
        $scope.menuOpen = !$scope.menuOpen;
    };

    $scope.isMenuOpen = function(){
        return $scope.menuOpen;
    };

    $scope.isRoomFilterOpen = function(){
        return $scope.filterOpen;
    };

    $scope.$on("dismissFilterScreen", function(){
        $scope.filterOpen = false;
    });
                
    $scope.$on("showFilterScreen",function(){
        $scope.filterOpen = true;
    });

    $rootScope.$on('showOWSError', function(){
        // Hide loading message
        $scope.$emit('hideLoader');
        ngDialog.open({
            template: '/assets/partials/hkOWSError.html',
            scope: $scope
        });
    });
    
}]);

