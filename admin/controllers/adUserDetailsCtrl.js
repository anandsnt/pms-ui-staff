admin.controller('ADUserDetailsCtrl',
	[ '$scope',
	'$state',
	'$stateParams',
	'ADUserSrv',
	'$rootScope',
	'ADUserRolesSrv',
	'$timeout',
	'$window',
	function($scope, $state, $stateParams, ADUserSrv, $rootScope, ADUserRolesSrv, $timeout, $window) {

	BaseCtrl.call(this, $scope);

	$scope.manualIDScanEnabled = $stateParams.manual_id_scan_enabled === 'true';
	// navigate back to user list if no id
	if (!$stateParams.id && !$stateParams.page === 'add') {
			$state.go('admin.users');
	}
	$scope.mod = "";
	$scope.image = "";
	$scope.$emit("changedSelectedMenu", 0);
	$scope.hotelId = $stateParams.hotelId;
	$scope.fileName = "Choose File....";
	/** functions & variables related to drag & drop **/
	$scope.selectedUnassignedRole = -1;
	$scope.selectedAssignedRole = -1;
	$scope.justDropped = -1;
	$scope.defaultDashboard = -1;
	$scope.dashboardOptions = [];
	var lastDropedTime = '';

	$scope.assignedRoles = [];
	$scope.rolesWithDashboards = [];
	$scope.errorMessage = "";
	$scope.focusOnPassword = false;

	function refreshDashboardsList() {

		var rolesData = $scope.assignedRoles;

		$scope.dashboardOptions = [];
		for (var i = 0; i < rolesData.length; i++) {
			var rolePresent = false;

			for (var j = 0; j < $scope.dashboardOptions.length; j++) {
				if (rolesData[i].dashboard_id === $scope.dashboardOptions[j].dashboard_id) {
					rolePresent = true;
				}
			}
			if (!rolePresent) {
				var dashboard = {};

				dashboard.dashboard_id = rolesData[i].dashboard_id;
				dashboard.dashboard_name = rolesData[i].dashboard_name;
				$scope.dashboardOptions.push(dashboard);
			}
		}

	};

        $scope.getRolesData = function() {
            var successCallbackRoles = function(data) {
                $scope.$emit('hideLoader');
                $scope.rolesWithDashboards = data.userRoles;
                /**
                 * To set mod of operation - add/edit
                 */
                var id = $stateParams.id;

                if (id === "") {
                    $scope.mod = "add";
                    $scope.userDetailsAdd();
                } else {
                    $scope.mod = "edit";
                    $scope.userDetailsEdit(id);
                }

                refreshDashboardsList();

            };

            $scope.invokeApi(ADUserRolesSrv.fetchUserRoles, $scope.isAdminSnt, successCallbackRoles);

        };

        /**
         * To check whether logged in user is sntadmin or hoteladmin
         */


   /*
    * Handle action when clicked on assigned role
    * @param {int} index of the clicked role
    */
	$scope.selectAssignedRole = function($event, index) {


		var lastSelectedItem = $scope.selectedAssignedRole;

		if (lastSelectedItem === index) {
			$scope.selectedAssignedRole = -1;
		}
		else if (lastDropedTime === '') {
			$scope.selectedAssignedRole = index;
		}
		else if (typeof lastDropedTime === 'object') { // means date
			var currentTime = new Date();
			var diff = currentTime - lastDropedTime;

			if (diff <= 100) {
				$event.preventDefault();
			}
			else {
				lastDropedTime = '';
			}

		}
	};
   /*
    * Handle action when clicked on un assigned role
    * @param {int} index of the clicked role
    */
	$scope.selectUnAssignedRole = function($event, index) {

		var lastSelectedItem = $scope.selectedUnassignedRole;

		if (lastSelectedItem === index) {
			$scope.selectedUnassignedRole = -1;
		}
		else if (lastDropedTime === '') {
			$scope.selectedUnassignedRole = index;
		}
		else if (typeof lastDropedTime === 'object') { // means date
			var currentTime = new Date();
			var diff = currentTime - lastDropedTime;

			if (diff <= 100) {
				$event.preventDefault();
			}
			else {
				lastDropedTime = '';
			}

		}
	};
   /*
    * Handle action when clicked on right arrow button
    */
	$scope.leftToRight = function() {
		var index = $scope.selectedAssignedRole;

		if (index === -1) {
			return;
		}
		var newElement = $scope.assignedRoles[index];

		$scope.unAssignedRoles.push(newElement);
		var newElement = $scope.unAssignedRoles[index];

		$scope.assignedRoles.splice(index, 1);
		$scope.selectedAssignedRole = -1;

		refreshDashboardsList();
	};
   /*
    * Handle action when clicked on left arrow button
    */
	$scope.rightToleft = function() {
		var index = $scope.selectedUnassignedRole;

		if (index === -1) {
			return;
		}
		var newElement = $scope.unAssignedRoles[index];

		$scope.assignedRoles.push(newElement);
		$scope.unAssignedRoles.splice(index, 1);
		$scope.selectedUnassignedRole = -1;

        refreshDashboardsList();
	};

	/**
    *   save user details
    */
	$scope.saveUserDetails = function() {
		var params = $scope.data;
		var unwantedKeys = [];

		if ($scope.image.indexOf("data:") !== -1) {
			unwantedKeys = ["departments", "roles", 'is_multi_property'];
		} else {
			unwantedKeys = ["departments", "roles", "user_photo", 'is_multi_property'];
		}
		var userRoles = [];

		for (var j = 0; j < $scope.assignedRoles.length; j++) {
	 		if ($scope.assignedRoles[j].value !== "") {
	 			userRoles.push($scope.assignedRoles[j].value);
	 		}
	 	}


		$scope.data.user_roles = userRoles;

        if ($scope.data.is_chain_admin === undefined || $scope.data.is_chain_admin === null) {
            $scope.data.is_chain_admin = false;
        }

		var data = dclone($scope.data, unwantedKeys);
		// Remove user_photo field if image is not uploaded. Checking base64 encoded data exist or not

		if ($scope.image.indexOf("data:") !== -1) {
			data.user_photo = $scope.image;
		}

		var successCallback = function(data) {
			$scope.$emit('hideLoader');
			$state.go('admin.users', { id: $stateParams.hotelId });
		};

        if ($scope.isAdminSnt) {
			data.isSNTAdmin = true;
        }

		if ($scope.mod === "add") {
			$scope.invokeApi(ADUserSrv.saveUserDetails, data, successCallback);
		} else {
			data.user_id = params.user_id;
			$scope.invokeApi(ADUserSrv.updateUserDetails, data, successCallback);
		}
	};
	/**
    * To render edit screen -
    * @param {string} the id of the clicked user
    *
    */
	$scope.userDetailsEdit = function(id) {
		var successCallbackRender = function(data) {
			$scope.assignedRoles = [];
			$scope.$emit('hideLoader');
			// This for displaying the placeholder text in dropdown
			if (data.shift_id === null) {
				data.shift_id = "";
			}
			$scope.data = data;
			$scope.unAssignedRoles = $scope.rolesWithDashboards.slice(0);
			if (data.user_photo === "") {
				$scope.image = "/assets/images/preview_image.png";
			} else {
				$scope.image = data.user_photo;
			}
			$scope.data.confirm_email = $scope.data.email;

			for (var i = 0; i < $scope.rolesWithDashboards.length; i++) {
				if ( $scope.data.user_roles.indexOf($scope.rolesWithDashboards[i].value.toString() ) !== -1 ) {
	   			 	$scope.assignedRoles.push($scope.rolesWithDashboards[i]);
	   			 	for (var j = 0; j < $scope.unAssignedRoles.length; j++) {
	   			 		if ($scope.unAssignedRoles[j].value === $scope.rolesWithDashboards[i].value) {
	   			 			$scope.unAssignedRoles.splice(j, 1);
	   			 			break;
	   			 		}
	   			 	}


	    		}
			}

            refreshDashboardsList();

			if ($scope.isInUnlockingMode()) {
				setFocusOnPasswordField();
			}
		};

		$scope.invokeApi(ADUserSrv.getUserDetails, {'id': id}, successCallbackRender);
	};

	var setFocusOnPasswordField = function() {

		$scope.focusOnPassword = true;
	};

	$scope.isInUnlockingMode = function () {
		return ($stateParams.isUnlocking === "true");
	};

	$scope.disableReInviteButton = function (data) {
		if (!$scope.isInUnlockingMode()) {
			return (data.is_activated === 'true');
		}
		else {
			return false;
		}
	};

	/**
    * To render add screen
    */
	$scope.userDetailsAdd = function() {
	 	var successCallbackRender = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.unAssignedRoles = $scope.rolesWithDashboards.slice(0);
			$scope.assignedRoles = [];
			$scope.image = "/assets/images/preview_image.png";
		};

	 	$scope.invokeApi(ADUserSrv.getAddNewDetails, $scope.isAdminSnt, successCallbackRender);
	};

	/**
	* success callback of send inivtaiton mail (API)
	* will go back to the list of users
	*/
	var successCallbackOfSendInvitation = function (data) {
		$scope.$emit('hideLoader');
		$state.go('admin.users', { id: $stateParams.hotelId });
	};


   /*
    * Function to send invitation
    * @param {int} user id
    */
	$scope.sendInvitation = function(userId) {
		// reseting the error message
		$scope.errorMessage = '';
		if (userId === "" || userId === undefined) {
			return false;
		}
		var data = {"id": userId};

		// if it is in unlocking mode
		if ($scope.isInUnlockingMode()) {
			// if the erntered password is not matching
			if ($scope.data.password !== $scope.data.confirm_password) {

				$timeout(function() {
					$scope.errorMessage = ["Password's deos not match"];
					$window.scrollTo(0, 0);
					setFocusOnPasswordField();
				}, 500);
				return false;
			}
			data.password = $scope.data.password;
			data.is_trying_to_unlock = true;
		}
	 	$scope.invokeApi(ADUserSrv.sendInvitation,  data, successCallbackOfSendInvitation);
	};

	$scope.reachedUnAssignedRoles = function(event, ui) {
		$scope.selectedAssignedRole = -1;
		lastDropedTime = new Date();
	};

	$scope.reachedAssignedRoles = function(event, ui) {
		$scope.selectedUnassignedRole = -1;
		lastDropedTime = new Date();
	};

	$scope.onRoleChange = function() {
		// CICO-37238 Find and update the dashboards related to the roles
		refreshDashboardsList();
    };

    // Get the style class based on whether the hotel is standalone or not
    $scope.getStyleClass = function () {
     return !$scope.isStandAlone ? 'ng-hide' : '';
    };

    (function() {
        if ($rootScope.adminRole === "snt-admin") {
            $scope.isAdminSnt = true;
            $scope.BackAction = "admin.users({id:" + $scope.hotelId + "})";
        } else {
            $scope.BackAction = "admin.users";
        }

        $scope.getRolesData();
    })();

}]);
