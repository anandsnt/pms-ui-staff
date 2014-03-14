hkRover.controller('HKappCtrl',['$scope', '$state', function($scope, $state){
    $scope.hasLoader = false;
    $scope.menuOpen = false;
    $scope.filterOpen = false;

    $scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
    });

    $scope.$on("filterRoomsClicked", function(){
    	$scope.filterOpen = !$scope.filterOpen;
    });

    $scope.$on("toggleLoader", function(){
        $scope.hasLoader = !$scope.hasLoader;
    });
    
    $scope.isMenuOpen = function(){
        return $scope.menuOpen ? true : false;
    };

    $scope.isRoomFilterOpen = function(){
        return $scope.filterOpen ? true : false;
    };

    
}]);

