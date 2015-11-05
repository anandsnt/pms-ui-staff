admin.controller('adLetShareSetupCtrl', ['$scope', 'letsShareSetupValues', 'adLetShareSetupSrv', function($scope, letsShareSetupValues, adLetShareSetupSrv){
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable letshare 
	 * @return {undefiend}
	 */
	$scope.toggleLetShareEnabled = function() {
		$scope.letshare.enabled = !$scope.letshare.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfSaveLetShareSetup = function(data) {
		$scope.goBackToPreviousState();
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.saveLetShareSetup = function() {
		var params 	= {
			letshare: $scope.letshare
		};
        var options = {
            params 			: params,
            successCallBack : successCallBackOfSaveLetShareSetup
        };
        $scope.callAPI(adLetShareSetupSrv.saveLetShareConfiguration, options);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = function() {
		$scope.letshare = {};
		$scope.letshare.enabled = letsShareSetupValues.enabled;
	}();
}])