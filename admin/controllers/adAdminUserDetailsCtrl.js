admin.controller('ADAdminUserDetailsCtrl',
	[ '$scope',
	'$state',
	'$stateParams',
	'ADAdminUserSrv',
	'$rootScope',
	'$timeout',
	'$window',
	function($scope, $state, $stateParams, ADAdminUserSrv, $rootScope, $timeout, $window) {

	BaseCtrl.call(this, $scope);

	$scope.manualIDScanEnabled = $stateParams.manual_id_scan_enabled === 'true';
	// navigate back to user list if no id
	if (!$stateParams.id && !$stateParams.page === 'add') {
			$state.go('admin.adminUsers');
	}
	$scope.mod = "";
	$scope.image = "";
	$scope.$emit("changedSelectedMenu", 0);
	$scope.fileName = "Choose File....";
	$scope.errorMessage = "";
	$scope.focusOnPassword = false;

   
    $scope.initialization = function(){
        var id = $stateParams.id;

        if (id === "") {
            $scope.mod = "add";
        } else {
            $scope.mod = "edit";
            $scope.userDetailsEdit(id);
        }
    }

	/**
    *   save user details
    */

	$scope.saveUserDetails = function() {

		var params = $scope.data;
        var unwantedKeys=[]
		var data = dclone($scope.data, unwantedKeys);
		// Remove user_photo field if image is not uploaded. Checking base64 encoded data exist or not

		if ($scope.image.indexOf("data:") !== -1) {
			data.user_photo = $scope.image;
		}

		var successCallback = function(data) {
			$scope.$emit('hideLoader');
			$state.go('admin.adminUsers');
        };
        
		if ($scope.mod === "add") {
			$scope.invokeApi(ADAdminUserSrv.saveUserDetails, data, successCallback);
		} else {
			data.user_id = params.user_id;
			$scope.invokeApi(ADAdminUserSrv.updateUserDetails, data, successCallback);
		}
	};
	/**
    * To render edit screen -
    * @param {string} the id of the clicked user
    *
    */
	$scope.userDetailsEdit = function(id) {
		var successCallbackRender = function(data) {
			$scope.$emit('hideLoader');
			// This for displaying the placeholder text in dropdown
			if (data.shift_id === null) {
				data.shift_id = "";
			}
			$scope.data = data;
			if (data.user_photo === "") {
				$scope.image = "/assets/images/preview_image.png";
			} else {
				$scope.image = data.user_photo;
			}
			$scope.data.confirm_email = $scope.data.email;


            refreshDashboardsList();

			if ($scope.isInUnlockingMode()) {
				setFocusOnPasswordField();
			}
		};

		$scope.invokeApi(ADAdminUserSrv.getUserDetails, {'id': id}, successCallbackRender);
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
			// $scope.image = "/assets/images/preview_image.png";
		};

	 	$scope.invokeApi(ADAdminUserSrv.getAddNewDetails, $scope.isAdminSnt, successCallbackRender);
	};

	/**
	* success callback of send inivtaiton mail (API)
	* will go back to the list of users
	*/
	var successCallbackOfSendInvitation = function (data) {
		$scope.$emit('hideLoader');
		$state.go('admin.adminUsers');
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
	 	$scope.invokeApi(ADAdminUserSrv.sendInvitation,  data, successCallbackOfSendInvitation);
	};

    // Get the style class based on whether the hotel is standalone or not
    $scope.getStyleClass = function () {
     return !$scope.isStandAlone ? 'ng-hide' : '';
    };

    $scope.initialization();

}]);
