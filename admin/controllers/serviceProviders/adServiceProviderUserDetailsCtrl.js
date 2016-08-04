admin.controller('ADServiceProviderUserDetailsCtrl',['$scope','$rootScope', '$q' ,'$state','$stateParams', 'ADServiceProviderSrv', 'ngTableParams','$filter',  function($scope, $rootScope, $q, $state, $stateParams, ADServiceProviderSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);	

	var init = function(){
		$scope.usedDetails = {};
		$scope.usedDetails.service_provider_id = $stateParams.serviceProviderId;
		$scope.serviceProviderName = $stateParams.name;
	};
	
	$scope.save = function(){		
		var successCallbackFetch = function(data){
			if(!!data.user_id){
				$scope.usedDetails.user_id = data.user_id;
				};
			$scope.$emit('hideLoader');			
		};
		var failedCallbackFetch = function(data){			
			$scope.$emit('hideloader');
		};
		if(!$scope.usedDetails.user_id){
			$scope.invokeApi(ADServiceProviderSrv.addServiceProviderUser, $scope.usedDetails, successCallbackFetch, failedCallbackFetch);
		}else{
			$scope.invokeApi(ADServiceProviderSrv.editServiceProviderUser, $scope.usedDetails, successCallbackFetch, failedCallbackFetch);
		}
	};

	$scope.clickBack = function(){
		$state.go("admin.serviceProviderUsers");
	};
	init();

}]);