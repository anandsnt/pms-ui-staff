admin.controller('ADCoTaMandatoryFieldsCtrl', ['$scope', '$state', 'ADCoTaMandatorySrv',
function($scope, $state, ADCoTaMandatorySrv) {
	BaseCtrl.call(this, $scope);
	/*
	 * Save Mandatory fields
	 */
	$scope.saveMandatoryFields = function() {
		var options = {
			params: $scope.coTaMandatoryFields			
		};

		$scope.callAPI(ADCoTaMandatorySrv.saveCoTaMandatoryFields, options);
	};
	$scope.clickedMandatoryCheck = function() {
		if (!$scope.coTaMandatoryFields.mandatory_on_ar_account) {
			$scope.coTaMandatoryFields = {
				tax_id_mandatory: false,
				pay_days_mandatory: false,
				contact_name_mandatory: false,
				address_line1_mandatory: false,
				city_mandatory: false,
				postal_code_mandatory: false,
				country_mandatory: false,
				contact_phone_mandatory: false,
				contact_email_address_mandatory: false
			};
		}
	};
	/*
	 * To fetch mandatory fields
	 */
	$scope.loadCoTaMandatoryFields =  function() {

		var successCallBack = function(data) {
			$scope.coTaMandatoryFields = data;
		},
		options = {
			onSuccess: successCallBack
		};

		$scope.callAPI(ADCoTaMandatorySrv.fetchCoTaMandatoryFields, options);
	};
	
	$scope.loadCoTaMandatoryFields();
}]);
