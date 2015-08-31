admin.controller('ADUserRolePermissionsCtrl', [
							'$rootScope',
							'$scope',
							'ADUserRolePermissionSrv',
							'$stateParams',
							'$state',
							'ngDialog',
							function($rootScope, $scope,ADUserRolePermissionSrv, $stateParams, $state, ngDialog){

	BaseCtrl.call(this, $scope);
	$scope.title = "Permission";
	$scope.id = $stateParams.id;
	$scope.errorMessage = '';
	$scope.selectedUnassignedPermission = -1;
	$scope.selectedAssignedPermission = -1;
	$scope.justDropped = -1;
	var lastDropedTime = '';
	$scope.assignedRoles = [];
	$scope.errorMessage = "";
	$scope.assignedPermissions = [];
	$scope.previuosAssignedPermissions = [];
	$scope.unAssignedPermissions = [];
	$scope.userRoles = [];
	$scope.selectedUserRole ="";


    $scope.fetchUserRolePermission = function(){
    	var successCallback = function(data){
    		$scope.$emit('hideLoader');
			$scope.userRoles = data.roles;
			$scope.permissions = data.permissions;
			$scope.selectedUserRole = $scope.userRoles[0];
			$scope.selectedUserRole.index = 0;
			$scope.initiatePermissionforSelectedUserRole();
			$scope.errorMessage = '';
		};
		var failureCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};
		$scope.invokeApi(ADUserRolePermissionSrv.fetchUserRolePermission, {}, successCallback, failureCallback);
    };
	$scope.fetchUserRolePermission();

	$scope.calculateArrayDifferance = function(source, toRemove) {
    		return source.filter(function(value){
        	return toRemove.indexOf(value) === -1;
    		});
		};

    $scope.initiatePermissionforSelectedUserRole = function(){

    	$scope.unAssignedPermissions.length=0;
    	$scope.assignedPermissions.length=0;
    	$scope.previuosAssignedPermissions.length=0;
    	$scope.permissions.forEach(function(element){
    		$scope.selectedUserRole.assigned_permissions.map(function(x){
    			if(x ===element.value){
    				$scope.assignedPermissions.push(element);
    				$scope.previuosAssignedPermissions.push(element);
    			}
    		});

    	});
    	$scope.unAssignedPermissions = $scope.calculateArrayDifferance($scope.permissions, $scope.assignedPermissions);
    };

    $scope.selectUserRole = function($event, index){
    	$scope.selectedUserRole = $scope.userRoles[index];
    	$scope.selectedUserRole.index = index;
    	$scope.selectedUnassignedPermission =-1;
    	$scope.selectedAssignedPermission =-1;
    	$scope.initiatePermissionforSelectedUserRole();
    };

    $scope.$watch("assignedPermissions.length", function(oldValue,newValue){
    		if(oldValue<newValue){
    			$scope.removedElement = $scope.calculateArrayDifferance($scope.previuosAssignedPermissions, $scope.assignedPermissions);
    			$scope.previuosAssignedPermissions = $scope.calculateArrayDifferance($scope.previuosAssignedPermissions, $scope.removedElement);
    			if($scope.removedElement.length!==0){
    			var successCallback = function(data){
    				var index =$scope.userRoles[$scope.selectedUserRole.index].assigned_permissions.indexOf($scope.removedElement[0].value);
    				$scope.userRoles[$scope.selectedUserRole.index].assigned_permissions.splice(index, 1);
    				$scope.$emit('hideLoader');
    				$scope.errorMessage = '';
				};
				var failureCallback = function(data){
					$scope.errorMessage = data;
					$scope.$emit('hideLoader');
					$scope.initiatePermissionforSelectedUserRole();
				};
				var postData = {};
				postData.permissions = [];
				postData.permissions.length =0;
				postData.role_id = $scope.selectedUserRole.value;
				postData.permissions.push($scope.removedElement[0].value);
				$scope.invokeApi(ADUserRolePermissionSrv.removeUserRolePermission,postData , successCallback, failureCallback);
				}
    		}else
    		{
    			$scope.addedElement = $scope.calculateArrayDifferance($scope.assignedPermissions, $scope.previuosAssignedPermissions);
    			$scope.previuosAssignedPermissions = $scope.previuosAssignedPermissions.concat($scope.addedElement);
    			if($scope.addedElement.length!==0){
    			var successCallback = function(data){
	    			$scope.$emit('hideLoader');
	    			$scope.userRoles[$scope.selectedUserRole.index].assigned_permissions.push($scope.addedElement[0].value);
	    			$scope.errorMessage = '';
				};
				var failureCallback = function(data){
					$scope.errorMessage = data;
					$scope.$emit('hideLoader');
					$scope.initiatePermissionforSelectedUserRole();
				};
				var postData = {};
				postData.permissions = [];
				postData.permissions.length =0;
				postData.role_id = $scope.selectedUserRole.value;
				postData.permissions.push($scope.addedElement[0].value);
				$scope.invokeApi(ADUserRolePermissionSrv.addedUserRolePermission,postData , successCallback, failureCallback);
				}
    		}

    });
   /*
    * Handle action when clicked on assigned role
    * @param {int} index of the clicked role
    */
	$scope.selectAssignedPermission = function($event, index){
		var lastSelectedItem =$scope.selectedAssignedPermission;
		if(lastSelectedItem === index){
			$scope.selectedAssignedPermission =-1;
		}
		else if(lastDropedTime === ''){
			$scope.selectedAssignedPermission = index;
		}
		else if(typeof lastDropedTime === 'object') {
			var currentTime = new Date();
			var diff = currentTime - lastDropedTime;
			if(diff <= 100){
				$event.preventDefault();
			}
			else{
				lastDropedTime = '';
			}
		}
	};
   /*
    * Handle action when clicked on un assigned role
    * @param {int} index of the clicked role
    */
	$scope.selectUnAssignedPermission = function($event, index){
		var lastSelectedItem =$scope.selectedUnassignedPermission;
		if(lastSelectedItem === index){
			$scope.selectedUnassignedPermission =-1;
		}
		else if(lastDropedTime === ''){
			$scope.selectedUnassignedPermission = index;
		}
		else if(typeof lastDropedTime === 'object') { //means date
			var currentTime = new Date();
			var diff = currentTime - lastDropedTime;
			if(diff <= 100){
				$event.preventDefault();
			}
			else{
				lastDropedTime = '';
			}
		}
	};
   /*
    * Handle action when clicked on right arrow button
    */
	$scope.leftToRight = function(){
		var index = $scope.selectedAssignedPermission;
		if(index === -1){
			return;
		}
		var newElement = $scope.assignedPermissions[index];
		$scope.unAssignedPermissions.push(newElement);
		var newElement = $scope.unAssignedPermissions[index];
		$scope.assignedPermissions.splice(index, 1);
		$scope.selectedAssignedPermission = -1;
	};
   /*
    * Handle action when clicked on left arrow button
    */
	$scope.rightToleft = function(){
		var index = $scope.selectedUnassignedPermission;
		if(index === -1){
			return;
		}
		var newElement = $scope.unAssignedPermissions[index];
		$scope.assignedPermissions.push(newElement);
		$scope.unAssignedPermissions.splice(index, 1);
		$scope.selectedUnassignedPermission = -1;
	};

}]);