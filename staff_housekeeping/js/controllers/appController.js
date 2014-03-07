hkRover.controller('appController',['$scope', '$state', function($scope, $state){

    $scope.init = function () {
            console.log("App Controler init");
		// preselect the current reservation group
    };
    $scope.menuOpen = false;

    $scope.$on("navToggled", function(){
        $scope.menuOpen = !$scope.menuOpen;
        console.log("My event triggered");
    });
    
    $scope.getMenuClass = function(){
        console.log("getMenuClass called");
        return $scope.menuOpen ? "menu-open" : "";
    };
    

    $scope.init();
}]);

