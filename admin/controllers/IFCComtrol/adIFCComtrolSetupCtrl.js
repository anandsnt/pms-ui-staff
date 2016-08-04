admin.controller('adIFCComtrolSetupCtrl', ['$scope', 'ifcComtrolSetupValues', 'adIFCComtrolSetupSrv', '$timeout',
	function($scope, ifcComtrolSetupValues, adIFCComtrolSetupSrv, $timeout) {
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable
	 * @return {undefiend}
	 */
	$scope.toggleIFCComtrolEnabled = function() {
		$scope.ifc_comtrol.enabled = !$scope.ifc_comtrol.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfIFCComtrolSetup = function(data) {
		$scope.goBackToPreviousState();
	};

	// if there is any error occured
	$scope.$on("showErrorMessage", function($event, errorMessage) {
		$event.stopPropagation();
		$scope.errorMessage = errorMessage;
	});

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.saveIFCComtrolSetup = function() {
		var params = _.pick($scope.ifc_comtrol,
				'authentication_token',
				'url',
				'site_name',
				'operator_id',
				'password',
				'access_level',
				'enabled');

		if (!$scope.ifc_comtrol.enabled) {
			params = _.pick(params, 'enabled');
		}

	    var options = {
	        params 			: params,
	        successCallBack : successCallBackOfIFCComtrolSetup
	    };
	    $scope.callAPI(adIFCComtrolSetupSrv.saveIFCComtrolConfiguration, options);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	(function() {
		$scope.ifc_comtrol = ifcComtrolSetupValues;
	})();
}])
