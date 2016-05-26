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

	var clearConfigValues = function() {
    $scope.ifc_comtrol.url = '';
    $scope.ifc_comtrol.authentication_token = '';
    $scope.ifc_comtrol.cas_enabled = false;
    $scope.ifc_comtrol.energy_management_enabled = false;
    $scope.ifc_comtrol.internet_enabled = false;
    $scope.ifc_comtrol.keys_enabled = false;
    $scope.ifc_comtrol.minibar_enabled = false;
    $scope.ifc_comtrol.movies_enabled = false;
    $scope.ifc_comtrol.pbx_enabled = false;
    $scope.ifc_comtrol.pos_enabled = false;
    $scope.ifc_comtrol.voice_mail_enabled = false;
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
	}();
}])
