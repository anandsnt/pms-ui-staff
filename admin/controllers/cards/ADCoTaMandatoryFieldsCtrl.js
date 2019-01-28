admin.controller('ADCoTaMandatoryFieldsCtrl', ['$scope', '$state', 'ADCoTaMandatorySrv',
function($scope, $state, ADCoTaMandatorySrv) {
	BaseCtrl.call(this, $scope);
	$scope.fieldsAlwaysVisible = ["address_line1_mandatory", "city_mandatory", "postal_code_mandatory", "country_mandatory", "contact_phone_mandatory", "contact_email_address_mandatory", "contact_name_mandatory", "tax_id_mandatory"];
	/*
	 * Save Mandatory fields
	 */
	$scope.saveMandatoryFields = function() {
		var options = {
			params: $scope.coTaMandatoryFields			
		};

		$scope.callAPI(ADCoTaMandatorySrv.saveCoTaMandatoryFields, options);
	};
	/*
	 * Set all fields false;
	 */
	$scope.clickedMandatoryCheck = function() {
		if (!$scope.coTaMandatoryFields.mandatory_on_ar_account) {
			$scope.coTaMandatoryFields = {
				tax_id_mandatory: false,
				contact_name_mandatory: false,
				address_line1_mandatory: false,
				city_mandatory: false,
				postal_code_mandatory: false,
				country_mandatory: false,
				contact_phone_mandatory: false,
				contact_email_address_mandatory: false,
				e_invoice_mandatory: false
			};
		}
	};

	$scope.clickedStatus = function(field) {


	};
	/*
	 * To fetch mandatory fields
	 */
	$scope.loadCoTaMandatoryFields =  function() {

		var successCallBack = function(data) {
			$scope.coTaMandatoryFields = {
	"address_line1_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"city_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"postal_code_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"country_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"contact_phone_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"contact_email_address_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"contact_name_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"tax_id_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"e_invoice_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"regd_tax_office_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	},
	"organization_id_mandatory": {
		"is_visible": true,
		"is_mandatory_on_ar_account_creation": true,
		"is_mandatory_on_account_creation": true
	}
};
		},
		options = {
			onSuccess: successCallBack
		};

		$scope.callAPI(ADCoTaMandatorySrv.fetchCoTaMandatoryFields, options);
	};
	
	$scope.loadCoTaMandatoryFields();
}]);
