admin.controller('ADUserDetailsCtrl',[ '$scope', '$state','$stateParams', 'ADUserSrv', '$rootScope', function($scope, $state, $stateParams, ADUserSrv, $rootScope){
	
	BaseCtrl.call(this, $scope);
	$scope.mod = "";
	$scope.image = "";
	$scope.$emit("changedSelectedMenu", 0);
	$scope.hotelId = $stateParams.hotelId;
	$scope.fileName = "Choose File....";
	/** functions & variables related to drag & drop **/
	$scope.selectedUnassignedRole = -1;
	$scope.selectedAssignedRole = -1;
   /**
    * To check whether logged in user is sntadmin or hoteladmin
    */	
   // $scope.BackAction = $scope.hotelId;
	if($rootScope.adminRole == "snt-admin"){
		$scope.isAdminSnt = true;
		 $scope.BackAction = "admin.users({id:"+$scope.hotelId+"})";
	} else {
		 $scope.BackAction = "admin.users";
	}
   /*
    * Handle action when clicked on assigned role
    * @param {int} index of the clicked role
    */
	$scope.selectAssignedRole = function(index){
		$scope.selectedAssignedRole = index;
	};
   /*
    * Handle action when clicked on un assigned role
    * @param {int} index of the clicked role
    */
	$scope.selectUnAssignedRole = function(index){
		$scope.selectedUnassignedRole = index;
	};	
   /*
    * Handle action when clicked on right arrow button
    */
	$scope.leftToRight = function(){
		var index = $scope.selectedAssignedRole;
		if(index == -1){
			return;
		}
		var newElement = $scope.assignedRoles[index];
		$scope.unAssignedRoles.push(newElement);
		var newElement = $scope.unAssignedRoles[index];	
		$scope.assignedRoles.splice(index, 1);
		$scope.selectedAssignedRole = -1;
	};
   /*
    * Handle action when clicked on left arrow button
    */
	$scope.rightToleft = function(){
		var index = $scope.selectedUnassignedRole;
		if(index == -1){
			return;
		}	
		var newElement = $scope.unAssignedRoles[index];	
		$scope.assignedRoles.push(newElement);
		$scope.unAssignedRoles.splice(index, 1);
		$scope.selectedUnassignedRole = -1;
	};

	/**
    *   save user details
    */
	$scope.saveUserDetails = function(){
		var params = $scope.data;
		var unwantedKeys = [];
		if($scope.image.indexOf("data:")!= -1){
			unwantedKeys = ["departments", "roles"];
		} else {
			unwantedKeys = ["departments", "roles", "user_photo"];
		}
		var userRoles = [];
		for(var j = 0; j < $scope.assignedRoles.length; j++){
	 		if($scope.assignedRoles[j].value != ""){
	 			userRoles.push($scope.assignedRoles[j].value);	
	 		}
	 	}
		
		
		$scope.data.user_roles = userRoles;
		var data = dclone($scope.data, unwantedKeys);
		// Remove user_photo field if image is not uploaded. Checking base64 encoded data exist or not
		if($scope.image.indexOf("data:")!= -1){
			data.user_photo = $scope.image;
		}
		var successCallback = function(data){
			$scope.$emit('hideLoader');
			$state.go('admin.users', { id: $stateParams.hotelId });
		};
		if($scope.mod == "add"){
			$scope.invokeApi(ADUserSrv.saveUserDetails, data , successCallback);
		} else {
			data.user_id = params.user_id;
			$scope.invokeApi(ADUserSrv.updateUserDetails, data , successCallback);
		}
	};
	/**
    * To render edit screen - 
    * @param {string} the id of the clicked user
    * 
    */
	$scope.userDetailsEdit = function(id){
		var successCallbackRender = function(data){
			$scope.assignedRoles = [];
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.unAssignedRoles = JSON.parse(JSON.stringify($scope.data.roles));
			if(data.user_photo == ""){
				$scope.image = "/assets/preview_image.png";
			} else {
				$scope.image = data.user_photo;
			}
			$scope.data.confirm_email = $scope.data.email;

			for(var i = 0; i < $scope.data.roles.length; i++) {				
				if ( $scope.data.user_roles.indexOf($scope.data.roles[i].value ) != -1 ){
	   			 	$scope.assignedRoles.push($scope.data.roles[i]);
	   			 	for(var j = 0; j < $scope.unAssignedRoles.length; j++){
	   			 		if($scope.unAssignedRoles[j].value == $scope.data.roles[i].value){
	   			 			$scope.unAssignedRoles.splice(j, 1);		
	   			 		}
	   			 	}
	   			 	
	   			
	    		}
			}
		};
		$scope.invokeApi(ADUserSrv.getUserDetails, {'id':id} , successCallbackRender);
	};
	/**
    * To render add screen
    */
	$scope.userDetailsAdd = function(){
	 	var successCallbackRender = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.unAssignedRoles = $scope.data.roles;
			$scope.assignedRoles = [];
			$scope.image = "/assets/preview_image.png";
		};	
	 	$scope.invokeApi(ADUserSrv.getAddNewDetails, '' , successCallbackRender);	
	};
   /**
    * To set mod of operation - add/edit
    */
	var id = $stateParams.id;
	if(id == ""){
		$scope.mod = "add";
		$scope.userDetailsAdd();
	} else {
		$scope.mod = "edit";
		$scope.userDetailsEdit(id);
	}
   /*
    * Function to send invitation
    * @param {int} user id
    */
	$scope.sendInvitation = function(userId){
		var data = {"id": userId};
	 	$scope.invokeApi(ADUserSrv.sendInvitation,  data);	
	};

}]);