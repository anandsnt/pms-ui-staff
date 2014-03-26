hkRover.controller('HKappCtrl',['$rootScope', '$scope', '$state', function($rootScope, $scope, $state){
    $scope.hasLoader = false;
    $scope.menuOpen = false;
    $scope.filterOpen = false;

    $scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
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

