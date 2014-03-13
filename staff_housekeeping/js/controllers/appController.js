hkRover.controller('appController',['$scope', '$state', function($scope, $state){

    $scope.menuOpen = false;
    $scope.filterOpen = false;

    $scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
    });

    $scope.$on("filterRoomsClicked", function(){
    	$scope.filterOpen = !$scope.filterOpen;
    });
    
    $scope.isMenuOpen = function(){
        return $scope.menuOpen ? true : false;
    };

    $scope.isRoomFilterOpen = function(){
        return $scope.filterOpen ? true : false;
    };

    
}]);

