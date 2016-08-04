admin.controller('ADServiceProviderUserDetailsCtrl',['$scope','$rootScope', '$q' ,'$state','$stateParams', 'ADServiceProviderSrv', 'ngTableParams','$filter',  function($scope, $rootScope, $q, $state, $stateParams, ADServiceProviderSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);	

	var init = function(){
		$scope.userDetails = {};
		$scope.userDetails.service_provider_id = $stateParams.serviceProviderId;
		if(!!$stateParams.userId){
			$scope.userDetails.user_id = $stateParams.userId;
			fetchUserDetails();
		};
		$scope.serviceProviderName = $stateParams.name;
	};

	var fetchUserDetails =  function(){
		var param = {
			id :$scope.userDetails.user_id
		};
		var successCallbackFetch = function(data){
			$scope.userDetails = Object.assign($scope.userDetails,data);
			$scope.$emit('hideLoader');
		};
		var failedCallbackFetch = function(data){
			$scope.errorMessage = data;
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADServiceProviderSrv.getServiceProviderUserDetails, param, successCallbackFetch, failedCallbackFetch);
	};
	
	$scope.save = function(){
		var successCallbackFetch = function(data){
			if(!!data.user_id){
				$scope.userDetails.user_id = data.user_id;
				};
			$scope.$emit('hideLoader');
		};
		var failedCallbackFetch = function(data){
			$scope.errorMessage = data;
			$scope.$emit('hideLoader');
		};
		if(!$scope.userDetails.user_id){
			$scope.invokeApi(ADServiceProviderSrv.addServiceProviderUser, $scope.userDetails, successCallbackFetch, failedCallbackFetch);
		}else{
			$scope.invokeApi(ADServiceProviderSrv.updateServiceProviderUser, $scope.userDetails, successCallbackFetch, failedCallbackFetch);
		}
	};
	$scope.clickBack = function(){
		$state.go("admin.serviceProviderUsers");
	};
	init();

}]);