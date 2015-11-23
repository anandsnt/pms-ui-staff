admin.controller('adBritePabXSetupCtrl', ['$scope', 'britePabXSetupValues', 'adBritePabXSetupSrv', 'ADChargeCodesSrv', '$timeout',
	function($scope, britePabXSetupValues, adBritePabXSetupSrv, ADChargeCodesSrv, $timeout) {
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable pabx 
	 * @return {undefiend}
	 */
	$scope.toggleBritePabXEnabled = function() {
		$scope.brite.enabled = !$scope.brite.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfSaveBritePabXSetup = function(data) {
		$scope.goBackToPreviousState();
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.savePabXSetup = function() {
		var params 	= {
			brite: _.omit( dclone($scope.brite), 'charge_code_name')
		};

		if (!$scope.brite.enabled) {
			params.brite = _.omit(params.brite, 'charge_code_id', 'account_number');
		}

		if (params.brite.charge_code_id === '') {
			$timeout(function() {
				$scope.errorMessage = ['Please search a charge code, pick from the list and proceed'];
				clearConfigValues();
			}, 20);
			return;
		}

        var options = {
            params 			: params,
            successCallBack : successCallBackOfSaveBritePabXSetup
        };
        $scope.callAPI(adBritePabXSetupSrv.saveBritePabXConfiguration, options);
	};

	var successCallBackOfFetchChargeCodes = function(data, successCallBackParameters) {
		if (data.results.length === 0) {
			$scope.errorMessage = ["Unable find charge code against '" + $scope.brite.charge_code_name + "'"];
			$scope.brite.charge_code_id	= '';
			return;
		}
		successCallBackParameters.callBackToAutoComplete (data.results);
	};

	/**
	 * [fetchChargeCodes description]
	 * @return {[type]} [description]
	 */
	var fetchChargeCodes = function(callBackToAutoComplete) {
		var params = {
            query: $scope.brite.charge_code_name
        };
        var options = {
            params 			: params,
            successCallBack : successCallBackOfFetchChargeCodes,
            successCallBackParameters: {
				callBackToAutoComplete: callBackToAutoComplete
			}
        };
        $scope.callAPI(ADChargeCodesSrv.searchChargeCode, options);
	};

	var clearConfigValues = function() {
        $scope.brite.charge_code_id 	= '';
        $scope.brite.charge_code_name 	= '';
	};

    // jquery autocomplete Souce handler
    // get two arguments - request object and response callback function
    var autoCompleteSourceHandler = function(request, callBackToAutoComplete) {
        if (request.term.length === 0) {
        	clearConfigValues();
        } 
        else if (request.term.length > 1) {
            fetchChargeCodes(callBackToAutoComplete);
        }
    };

    /**
     * to run angular digest loop,
     * will check if it is not running
     * return - None
     */
    var runDigestCycle = function() {
        if (!$scope.$$phase) {
            $scope.$digest();
        }
    };

    /**
     * [autoCompleteSelectHandler description]
     * @param  {[type]} event [description]
     * @param  {[type]} ui    [description]
     * @return {[type]}       [description]
     */
    var autoCompleteSelectHandler = function(event, ui) {
        $scope.brite.charge_code_id 	= ui.item.id;
        $scope.brite.charge_code_name 	= ui.item.name;
        runDigestCycle();
        return false;    
    };

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = function() {
		$scope.brite = britePabXSetupValues;
		$scope.chargeCodeAutocompleteOptions = {
            delay		: 600,
            minLength	: 0,
	        position	: {
	            my 			: "right top",
	            at 			: "right bottom",
	            collision	: 'flip'
	        },
            source 		: autoCompleteSourceHandler,
            select 		: autoCompleteSelectHandler
		};
	}();
}])