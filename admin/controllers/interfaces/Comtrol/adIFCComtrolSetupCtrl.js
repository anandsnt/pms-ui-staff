// admin.controller('adIFCComtrolSetupCtrl', ['$scope', 'ifcComtrolSetupValues', 'adIFCComtrolSetupSrv', 'ngDialog',
// 	function($scope, ifcComtrolSetupValues, adIFCComtrolSetupSrv, ngDialog) {
//
// 	BaseCtrl.call (this, $scope);
//
// 	/**
// 	 * when clicked on check box to enable/diable
// 	 * @return {undefiend}
// 	 */
// 	$scope.toggleIFCComtrolEnabled = function() {
// 		$scope.ifc_comtrol.enabled = !$scope.ifc_comtrol.enabled;
// 	};
//
// 	$scope.toggleOracodeEnabled = function() {
// 		$scope.ifc_comtrol.oracode_enabled = !$scope.ifc_comtrol.oracode_enabled;
// 	};
//
// 	/**
// 	 * when the save is success
// 	 */
// 	var successCallBackOfIFCComtrolSetup = function(data) {
// 		$scope.goBackToPreviousState();
// 	};
//
// 	// if there is any error occured
// 	$scope.$on("showErrorMessage", function($event, errorMessage) {
// 		$event.stopPropagation();
// 		$scope.errorMessage = errorMessage;
// 	});
//
// 	/**
// 	 * when we clicked on save button
// 	 * @return {undefiend}
// 	 */
// 	$scope.saveIFCComtrolSetup = function() {
// 		var params = _.pick($scope.ifc_comtrol,
// 				'authentication_token',
// 				"language",
// 				"room_type",
// 				'url',
// 				'site_name',
// 				'operator_id',
// 				'password',
// 				'keys_password',
// 				'access_level',
// 				'oracode_enabled',
// 				'enabled');
//
// 		if (!$scope.ifc_comtrol.enabled) {
// 			params = _.pick(params, 'enabled');
// 		}
//
// 	    var options = {
// 	        params: params,
// 	        successCallBack: successCallBackOfIFCComtrolSetup
// 	    };
//
// 	    $scope.callAPI(adIFCComtrolSetupSrv.saveIFCComtrolConfiguration, options);
// 	};
//
// 	$scope.onClickRegenerate = function() {
// 		ngDialog.open({
// 			template: '/assets/partials/interfaces/modals/adInterfacesComptrolReAuthWarning.html',
// 			scope: $scope,
// 			closeByDocument: true
// 		});
// 	};
//
// 	$scope.closeDialog = function() {
// 		ngDialog.close();
// 	};
//
// 	$scope.regenerateAuth = function() {
// 		$scope.callAPI(adIFCComtrolSetupSrv.reAuthComtrol, {
// 			successCallBack: function(response) {
// 				$scope.ifc_comtrol.authentication_token =  response.authentication_token;
// 				$scope.closeDialog();
// 			}
// 		});
// 	};
//
// 	/**
// 	 * Initialization stuffs
// 	 * @return {undefiend}
// 	 */
// 	(function() {
// 		$scope.ifc_comtrol = ifcComtrolSetupValues;
// 		$scope.languages = adIFCComtrolSetupSrv.getLanguagesList();
// 	})();
// }]);
