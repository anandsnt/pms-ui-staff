admin.controller('settingsAndParamsCtrl',['$scope','adBrandsSrv', function($scope,adBrandsSrv){

	BaseCtrl.call(this, $scope);
	$scope.hours = ["HH","01","02","03","04","05","06","07","08","09","10","11","12"];
	$scope.minutes = ["00","15","30","45"];

 /**
    * To handle cancel button action
    *
    */ 
    $scope.cancelClick = function(){
        
    	if($rootScope.previousStateParam){
            $state.go($rootScope.previousState, { menu:$rootScope.previousStateParam});
        }
        else if($rootScope.previousState){
            $state.go($rootScope.previousState);
        }
        else 
        {
            $state.go('admin.dashboard', {menu : 0});
        }
    
    };


}]);