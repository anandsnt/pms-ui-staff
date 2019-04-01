sntRover.controller('companyTravelAgentMandatoryFieldsController',
    ['$scope', 
    '$timeout',
    'ngDialog',
    function($scope, $timeout, ngDialog) {

        BaseCtrl.call(this, $scope);

        $scope.setScroller('companyTravelAgentMandatory'); 
       
        $scope.closeDialog = function() {

            $scope.$emit("UPDATE_MANDATORY_POPUP_OPEN_FLAG");
            ngDialog.close();
        };

        $scope.saveCoTaMandatoryData = function() {
                       
            $scope.$emit("saveContactInformation");
            $scope.$emit("saveArAccountFromMandatoryPopup", $scope.arAccountDetails);
            $scope.closeDialog();
        };   

        $scope.shouldEnableSubmitButton = function() {
            var shouldEnable = ($scope.contactInformation.mandatoryFields.address_line1_mandatory.is_mandatory_on_ar_account_creation 
                        ? !isEmpty($scope.contactInformation.address_details.street1)
                        : true) 
                    && ($scope.contactInformation.mandatoryFields.city_mandatory.is_mandatory_on_ar_account_creation 
                        ? !isEmpty($scope.contactInformation.address_details.city)
                        : true)  
                    && ($scope.contactInformation.mandatoryFields.postal_code_mandatory.is_mandatory_on_ar_account_creation 
                        ? !isEmpty($scope.contactInformation.address_details.postal_code)
                        : true)  
                    && ($scope.contactInformation.mandatoryFields.country_mandatory.is_mandatory_on_ar_account_creation 
                        ? ($scope.contactInformation.address_details.country_id !== '' 
                            && $scope.contactInformation.address_details.country_id !== null)
                        : true)
                      
                    && ($scope.contactInformation.mandatoryFields.contact_phone_mandatory.is_mandatory_on_ar_account_creation 
                        ? !isEmpty($scope.contactInformation.address_details.phone)
                        : true) 
                    && ($scope.contactInformation.mandatoryFields.contact_email_address_mandatory.is_mandatory_on_ar_account_creation 
                        ? !isEmpty($scope.contactInformation.address_details.email_address) 
                        && (isValidEmail($scope.contactInformation.address_details.email_address))
                        : true) 
                    && ($scope.contactInformation.mandatoryFields.e_invoice_mandatory.is_mandatory_on_ar_account_creation 
                        ? !isEmpty($scope.contactInformation.e_invoice_address)
                        : true) 
                    && ($scope.contactInformation.mandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation 
                        ? !isEmpty($scope.contactInformation.account_details.organization_id)
                        : true) 
                    && ($scope.contactInformation.mandatoryFields.tax_id_mandatory.is_mandatory_on_ar_account_creation 
                        ? !isEmpty($scope.contactInformation.account_details.tax_number)
                        : true) 
                    && ($scope.contactInformation.mandatoryFields.regd_tax_office_mandatory.is_mandatory_on_ar_account_creation 
                        ? !isEmpty($scope.contactInformation.account_details.reg_tax_office)
                        : true) 
                    && ($scope.contactInformation.mandatoryFields.contact_name_mandatory.is_mandatory_on_ar_account_creation 
                        ? (!isEmpty($scope.contactInformation.primary_contact_details.contact_first_name) 
                            && !isEmpty($scope.contactInformation.primary_contact_details.contact_last_name))
                        : true) 
                    && (!$scope.arAccountDetails.is_auto_assign_ar_numbers 
                        ? ($scope.arAccountDetails.ar_number !== '' 
                        && $scope.arAccountDetails.ar_number !== null)
                        : true) 
                    && ($scope.contactInformation.mandatoryFields.payment_due_days_mandatory.is_mandatory_on_ar_account_creation 
                        ? ($scope.arAccountDetails.payment_due_days !== '' 
                            && $scope.arAccountDetails.payment_due_days !== null)
                        : true);

                return shouldEnable;
        };

        var init = function() {

            $timeout(function() {
                $scope.refreshScroller('companyTravelAgentMandatory');
            }, 200);

            if (angular.isUndefined($scope.contactInformation.e_invoice_address)) {
                $scope.contactInformation.e_invoice_address = null;
            }

            if (($scope.contactInformation.address_details.street1 === null 
                || $scope.contactInformation.address_details.street1 === '') 
                && $scope.contactInformation.mandatoryFields.address_line1_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowAddress = true;
            }
            if (($scope.contactInformation.address_details.city === null 
                || $scope.contactInformation.address_details.city === '') 
                && $scope.contactInformation.mandatoryFields.city_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowCity = true;
            }
            if (($scope.contactInformation.address_details.postal_code === null 
                || $scope.contactInformation.address_details.postal_code === '') 
                && $scope.contactInformation.mandatoryFields.postal_code_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowPostalCode = true;
            }
            if (($scope.contactInformation.address_details.country_id === null 
                || $scope.contactInformation.address_details.country_id === '') 
                && $scope.contactInformation.mandatoryFields.country_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowCountry = true;
            }
            if (($scope.contactInformation.address_details.phone === null 
                || $scope.contactInformation.address_details.phone === '') 
                && $scope.contactInformation.mandatoryFields.contact_phone_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowPhone = true;
            }

            if (($scope.contactInformation.address_details.email_address === null 
                || $scope.contactInformation.address_details.email_address === '') 
                && $scope.contactInformation.mandatoryFields.contact_email_address_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowEmail = true;
            }
            if (($scope.contactInformation.e_invoice_address === null 
                || $scope.contactInformation.e_invoice_address === '') 
                && $scope.contactInformation.mandatoryFields.e_invoice_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowEInvoice = true;
            }
            if (($scope.contactInformation.account_details.organization_id === null 
                || $scope.contactInformation.account_details.organization_id === '') 
                && $scope.contactInformation.mandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowOrganization = true;
            }
            if (($scope.contactInformation.account_details.tax_number === null 
                || $scope.contactInformation.account_details.tax_number === '') 
                && $scope.contactInformation.mandatoryFields.tax_id_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowTaxNumber = true;
            }
            if (($scope.contactInformation.account_details.reg_tax_office === null 
                || $scope.contactInformation.account_details.reg_tax_office === '') 
                && $scope.contactInformation.mandatoryFields.regd_tax_office_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowRegisteredTaxOffice = true;
            }

            if (($scope.contactInformation.primary_contact_details.contact_first_name === null 
                || $scope.contactInformation.primary_contact_details.contact_first_name === '') 
                && $scope.contactInformation.mandatoryFields.contact_name_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowPrimaryContactFirstName = true;
            }

            if (($scope.contactInformation.primary_contact_details.contact_last_name === null 
                || $scope.contactInformation.primary_contact_details.contact_last_name === '') 
                && $scope.contactInformation.mandatoryFields.contact_name_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowPrimaryContactLastName = true;
            }

            if (($scope.arAccountDetails.payment_due_days === null 
                || $scope.arAccountDetails.payment_due_days === '') 
                && $scope.contactInformation.mandatoryFields.payment_due_days_mandatory.is_mandatory_on_ar_account_creation) {
                $scope.shouldShowPayDays = true;
            }

            if (!$scope.arAccountDetails.is_auto_assign_ar_numbers) {
                $scope.shouldShowArNumber = true;
            }


        };

        init();

}]);