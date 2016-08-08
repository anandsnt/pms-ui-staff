admin.controller('ADServiceProviderUserDetailsCtrl',['$scope','$rootScope', '$q' ,'$state','$stateParams', 'ADServiceProviderSrv', 'ngTableParams','$filter',  function($scope, $rootScope, $q, $state, $stateParams, ADServiceProviderSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);	

	var init = function(){
		$scope.errorMessage = '';
		$scope.userDetails = {};
		$scope.userDetails.service_provider_id = $stateParams.serviceProviderId;
		//if userId exist its edit screen else add new screen
		if(!!$stateParams.userId){
			$scope.userDetails.user_id = $stateParams.userId;
			fetchUserDetails();
		};
		$scope.serviceProviderName = $stateParams.name;
	};
	/**
    * To fetch users details
    */
	var fetchUserDetails =  function(){
		var param = {
			id :$scope.userDetails.user_id
		};
		var successCallbackFetch = function(data){
			if(data.status === "failure"){
				$scope.errorMessage = data.errors;
			};
			$scope.userDetails = Object.assign($scope.userDetails,data);
			$scope.userDetails.previewImage = $scope.userDetails.user_photo;
			delete $scope.userDetails.user_photo;			
			$scope.$emit('hideLoader');
		};		
		$scope.invokeApi(ADServiceProviderSrv.getServiceProviderUserDetails, param, successCallbackFetch);
	};
	/**
    * checks whether its from unlock button click
    */
	var isInUnlockingMode = function (){
		return ($stateParams.isUnlocking === "true");
	};
	/**
    * checks the re-invite button status
    */
	$scope.disableReInviteButton = function (data) {
		if (!isInUnlockingMode()) {
			return (data.is_activated === 'true');
		}
		else {
			return false;
		}
	};
	/*
    * Function to send invitation
    * @param {int} user id
    */
	$scope.sendInvitation = function(userId){
		var data = {"id": userId,
					"password":$scope.userDetails.password,
					"is_trying_to_unlock": true
				};
		var successCallbackOfSendInvitation = function(data){
			if(data.status === "failure"){
				$scope.errorMessage = data.errors;
			};
			$scope.$emit('hideLoader');
			$state.go('admin.serviceproviderusers', { 'id': $scope.userDetails.service_provider_id,
				'name':$scope.serviceProviderName });
		};
	 	$scope.invokeApi(ADServiceProviderSrv.sendInvitation, data, successCallbackOfSendInvitation);
	};
	$scope.imageSelected = function(){
		$scope.userDetails.previewImage = $scope.uploadedImage;
		$scope.userDetails.user_photo = $scope.uploadedImage;
	};
	/**
    * To save user details
    */	
	$scope.save = function(){
		delete $scope.userDetails.previewImage;
		var successCallbackFetch = function(data){			
			if(data.status ==="failure"){
				$scope.errorMessage = data.errors;
			}else{				
				$state.go('admin.serviceproviderusers', {'id':$scope.userDetails.service_provider_id,'name':$scope.serviceProviderName});
			};			
			$scope.$emit('hideLoader');
		};
		//if userId exist updates the user else add new user
		if(!$scope.userDetails.user_id){
			$scope.invokeApi(ADServiceProviderSrv.addServiceProviderUser, $scope.userDetails, successCallbackFetch);
		}else{
			$scope.invokeApi(ADServiceProviderSrv.updateServiceProviderUser, $scope.userDetails, successCallbackFetch);
		}
	};
	
	init();

}]);