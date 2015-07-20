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
    var successCallbackSave = function(data) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = "";
			$scope.goBackToPreviousState();
	};
	var failureCallbackSave = function(data) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
	};
    $scope.saveClick = function(){
    	var unwantedKeys = ["charge_codes"];
        var newData = dclone($scope.icare, unwantedKeys);
    	var data = { "icare" : newData };
    	$scope.invokeApi(ADICareServicesSrv.saveIcareServices, data , successCallbackSave, failureCallbackSave);

    };

}]);

