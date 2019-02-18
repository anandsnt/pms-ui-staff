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
	 * Clicked visible status
	 * @param fieldName field name
	 */
	$scope.clickedStatus = function(fieldName) {
		if (!(_.contains($scope.fieldsAlwaysVisible, fieldName))) {
			switch (fieldName) {
				case "e_invoice_mandatory":
					$scope.coTaMandatoryFields.e_invoice_mandatory.is_visible = !$scope.coTaMandatoryFields.e_invoice_mandatory.is_visible;
					if (!$scope.coTaMandatoryFields.e_invoice_mandatory.is_visible) {
						$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_ar_account_creation = false;
						$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_account_creation = false;
					}
					break;
				case "regd_tax_office_mandatory":
					$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_visible = !$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_visible;
					if (!$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_visible) {
						$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_ar_account_creation = false;
						$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_account_creation = false;
					}
					break;
				case "organization_id_mandatory":
					$scope.coTaMandatoryFields.organization_id_mandatory.is_visible = !$scope.coTaMandatoryFields.organization_id_mandatory.is_visible;
					if (!$scope.coTaMandatoryFields.organization_id_mandatory.is_visible) {
						$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation = false;
						$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_account_creation = false;
					}
					break;
			}
		}
	};
	/*
	 * Clicked mandatory on ARaccount creation
	 * @param fieldName field name
	 * @param isFieldVisible is field visible or not
	 */
	$scope.clickedMandatoryOnArAccountCreation = function (isFieldVisible, fieldName) {
		
		if (isFieldVisible) {

			switch (fieldName) {
				case "address_line1_mandatory":
					$scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "city_mandatory":
					$scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "postal_code_mandatory":
					$scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "country_mandatory":
					$scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "contact_phone_mandatory":
					$scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "contact_email_address_mandatory":
					$scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "contact_name_mandatory":
					$scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "tax_id_mandatory":
					$scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "e_invoice_mandatory":
					$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "regd_tax_office_mandatory":
					$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_ar_account_creation;
					break;
				case "organization_id_mandatory":
					$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation;
					break;
			}
		}
	};
	/*
	 * Clicked mandatory on ARaccount creation
	 * @param fieldName field name
	 * @param isFieldVisible is field visible or not
	 */
	$scope.clickedMandatoryOnAccountCreation = function (isFieldVisible, fieldName) {
		if (isFieldVisible) {

			switch (fieldName) {
				case "address_line1_mandatory":
					$scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_account_creation;
					break;
				case "city_mandatory":
					$scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_account_creation;
					break;
				case "postal_code_mandatory":
					$scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_account_creation;
					break;
				case "country_mandatory":
					$scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_account_creation;
					break;
				case "contact_phone_mandatory":
					$scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_account_creation;
					break;
				case "contact_email_address_mandatory":
					$scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_account_creation;
					break;
				case "contact_name_mandatory":
					$scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_account_creation;
					break;
				case "tax_id_mandatory":
					$scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_account_creation;
					break;
				case "e_invoice_mandatory":
					$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_account_creation;
					break;
				case "regd_tax_office_mandatory":
					$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_account_creation;
					break;
				case "organization_id_mandatory":
					$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_account_creation;
					break;
			}
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
