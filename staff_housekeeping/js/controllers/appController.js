hkRover.controller('appController',['$scope', '$state', function($scope, $state){

    $scope.menuOpen = false;

    $scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
    });
    
    $scope.getMenuClass = function(){
        return $scope.menuOpen ? "menu-open" : "";
    };
    
}]);

