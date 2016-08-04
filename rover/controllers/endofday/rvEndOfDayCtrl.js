sntRover.controller('RVEndOfDayController', ['$scope','ngDialog','$rootScope','$filter','RVEndOfDayModalSrv','$state', function($scope,ngDialog,$rootScope,$filter,RVEndOfDayModalSrv,$state){

    BaseCtrl.call(this, $scope);
    var init =function(){    	
    };
    $scope.setHeadingTitle = function(heading) {
			$scope.heading = heading;
			$scope.setTitle ($filter('translate')(heading));
	};  

    init();
}]);