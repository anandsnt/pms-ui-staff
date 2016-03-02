admin.controller('adIFCComtrolSetupCtrl', ['$scope', 'ifcComtrolSetupValues', 'adIFCComtrolSetupSrv', '$timeout',
	function($scope, ifcComtrolSetupValues, adIFCComtrolSetupSrv, $timeout) {
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable pabx 
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

	var clearConfigValues = function() {
    $scope.ifc_comtrol.api_url = '';
    $scope.ifc_comtrol.authentication_token = '';
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.saveIFCComtrolSetup = function() {
		var params 	= {
      ifc_comtrol: _.omit( dclone($scope.ifc_comtrol), 'charge_code_name', 'account_number', 'charge_code_id' )
		};

		if (!$scope.ifc_comtrol.enabled) {
			params.ifc_comtrol = _.pick(params.ifc_comtrol, 'enabled');
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
	var initializeMe = function() {
		$scope.ifc_comtrol = ifcComtrolSetupValues;
    console.log($scope.ifc_comtrol);
	}();
}])
