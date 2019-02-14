admin.controller('ADGuestCardFieldsCtrl', ['$scope', '$state', 'ADGuestCardSrv',
function($scope, $state, ADGuestCardSrv) {
	BaseCtrl.call(this, $scope);
	//$scope.fieldsAlwaysVisible = ["address_line1_mandatory", "city_mandatory", "postal_code_mandatory", "country_mandatory", "contact_phone_mandatory", "contact_email_address_mandatory", "contact_name_mandatory", "tax_id_mandatory"];

	// /*
	//  * Save Mandatory fields
	//  */
	$scope.saveGuestCardFields = function() {
		var options = {
			params: $scope.guestCardFields			
		};

		$scope.callAPI(ADGuestCardSrv.saveGuestCardFields, options);
	};
	// /*
	//  * Set all fields false;
	//  */
	// $scope.clickedMandatoryCheck = function() {
	// 	if (!$scope.coTaMandatoryFields.mandatory_on_ar_account) {
	// 		$scope.coTaMandatoryFields = {
	// 			tax_id_mandatory: false,
	// 			contact_name_mandatory: false,
	// 			address_line1_mandatory: false,
	// 			city_mandatory: false,
	// 			postal_code_mandatory: false,
	// 			country_mandatory: false,
	// 			contact_phone_mandatory: false,
	// 			contact_email_address_mandatory: false,
	// 			e_invoice_mandatory: false
	// 		};
	// 	}
	// };
	/*
	 * Clicked visible status
	 * @param fieldName field name
	 */
	$scope.clickedStatus = function(fieldName) {
	
			switch (fieldName) {
				case "is_father_name_visible":
					$scope.guestCardFields.is_father_name_visible = !$scope.guestCardFields.is_father_name_visible;
					
					break;
				case "regd_tax_office_mandatory":
					$scope.guestCardFields.is_mother_name_visible = !$scope.guestCardFields.is_mother_name_visible;
					
					break;
				case "organization_id_mandatory":
					$scope.guestCardFields.is_birth_place_visible = !$scope.guestCardFields.is_birth_place_visible;

				case "is_gender_visible":
					$scope.guestCardFields.is_gender_visible = !$scope.guestCardFields.is_gender_visible;
					
					break;
			}
	
	};
	/*
	 * Clicked mandatory on ARaccount creation
	 * @param fieldName field name
	 * @param isFieldVisible is field visible or not
	 */
	// $scope.clickedMandatoryOnArAccountCreation = function (isFieldVisible, fieldName) {
		
	// 	if (isFieldVisible) {

	// 		switch (fieldName) {
	// 			case "address_line1_mandatory":
	// 				$scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "city_mandatory":
	// 				$scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "postal_code_mandatory":
	// 				$scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "country_mandatory":
	// 				$scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "contact_phone_mandatory":
	// 				$scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "contact_email_address_mandatory":
	// 				$scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "contact_name_mandatory":
	// 				$scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "tax_id_mandatory":
	// 				$scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "e_invoice_mandatory":
	// 				$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "regd_tax_office_mandatory":
	// 				$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 			case "organization_id_mandatory":
	// 				$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation = !$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation;
	// 				break;
	// 		}
	// 	}
	// };
	/*
	 * Clicked mandatory on ARaccount creation
	 * @param fieldName field name
	 * @param isFieldVisible is field visible or not
	 */
	// $scope.clickedMandatoryOnAccountCreation = function (isFieldVisible, fieldName) {
	// 	if (isFieldVisible) {

	// 		switch (fieldName) {
	// 			case "address_line1_mandatory":
	// 				$scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "city_mandatory":
	// 				$scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "postal_code_mandatory":
	// 				$scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "country_mandatory":
	// 				$scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "contact_phone_mandatory":
	// 				$scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "contact_email_address_mandatory":
	// 				$scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "contact_name_mandatory":
	// 				$scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "tax_id_mandatory":
	// 				$scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "e_invoice_mandatory":
	// 				$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "regd_tax_office_mandatory":
	// 				$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 			case "organization_id_mandatory":
	// 				$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_account_creation = !$scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_account_creation;
	// 				break;
	// 		}
	// 	}
	// };
	/*
	 * To fetch mandatory fields
	 */
	$scope.loadGuestCardFields =  function() {

		var successCallBack = function(data) {
			$scope.guestCardFields = {
  is_father_name_visible: true,
  is_mother_name_visible: true,
  is_birth_place_visible: true,
  is_gender_visible: true 
};
		},
		options = {
			onSuccess: successCallBack
		};

		$scope.callAPI(ADGuestCardSrv.loadGuestCardFields, options);
	};
	
	$scope.loadGuestCardFields();
}]);
