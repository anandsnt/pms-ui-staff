admin.controller('ADUserDetailsCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	
	BaseCtrl.call(this, $scope);
	$scope.mod = "";
	$scope.image = "";
	/** functions & variables related to drag & drop **/
	$scope.selectedUnassignedRole = -1;
	$scope.selectedAssignedRole = -1;
   /*
    * Handle action when clicked on assigned role
    * @param {int} index of the clicked role
    */
	$scope.clickedOnAssignedRole = function(index){
		$scope.selectedAssignedRole = index;
	};
   /*
    * Handle action when clicked on un assigned role
    * @param {int} index of the clicked role
    */
	$scope.clickedOnUnassignedRole = function(index){
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
   
	$scope.$on("ANGULAR_DRAG_START", function(sendchaneel){
		// console.log(sendchaneel);
	});
	
	/**
	 * To handle drop success event
	 *
	 */
	$scope.dropSuccessHandler = function($event, index, array) {
		array.splice(index, 1);
	};
	/**
	 * To handle on drop event
	 *
	 */
	$scope.onDrop = function($event, $data, array) {	
		array.push($data);
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
		$scope.assignedRoles.forEach(function(entry) {
    		userRoles.push(entry.value);
		});
		
		$scope.data.user_roles = userRoles;
		var data = dclone($scope.data, unwantedKeys);
		// Remove user_photo field if image is not uploaded. Checking base64 encoded data exist or not
		if($scope.image.indexOf("data:")!= -1){
			data.user_photo = $scope.image;
		}
		var successCallback = function(data){
			$scope.$emit('hideLoader');
			$state.go('admin.users', { id: $stateParams.id });
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
			$scope.unAssignedRoles = $scope.data.roles;
			$scope.image = data.user_photo;
			$scope.data.confirm_email = $scope.data.email;
			$scope.data.roles.forEach(function(entry, index) {
	    		if ( $scope.data.user_roles.indexOf(entry.value ) > -1 ){
	   			 	$scope.assignedRoles.push(entry);
	   			 	$scope.unAssignedRoles.splice(index, 1);
	    		}
			});
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