admin.controller('ADIcareServicesCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADICareServicesSrv',
function($scope, $rootScope, $state,  $stateParams, ADICareServicesSrv) {
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 8);
	$scope.errorMessage = "";
	$scope.icare = {};
	/*
    * Success callback of render
    * @param {object} icare service details
    */    
    $scope.successCallbackRender = function(data){
    	console.log(data);
    	$scope.$emit('hideLoader');
    	$scope.icare = data;
    };
   /**
    * Render icare service screen
    */
	$scope.renderIcareServices = function(){
		$scope.invokeApi(ADICareServicesSrv.getIcareServices, {} , $scope.successCallbackRender);
	};
	//To render screen
	$scope.renderIcareServices();
	/**
    * To handle save button action
    *
    */ 
    $scope.saveClick = function(){
    	console.log($scope.icare);
    	var data = { "icare" : $scope.icare };
    	$scope.invokeApi(ADICareServicesSrv.saveIcareServices, data , $scope.successCallbackSave);

    };
	/**
    * To handle cancel/back button action
    *
    */ 
    $scope.cancelClick = function(){
        
    	if($rootScope.previousStateParam){
            $state.go($rootScope.previousState, { menu:$rootScope.previousStateParam });
        }
        else if($rootScope.previousState){
            $state.go($rootScope.previousState);
        }
        else{
            $state.go('admin.dashboard', {menu : 0});
        }
    };
	
}]);

