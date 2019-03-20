sntRover.controller('companyTravelAgentMandatoryFieldsController',
    ['$scope', 
    '$timeout',
    'ngDialog',
    'RVCompanyCardSrv',
    function($scope, $timeout, ngDialog, RVCompanyCardSrv) {

        BaseCtrl.call(this, $scope);

        $scope.setScroller('companyTravelAgentMandatory'); 

        $scope.closeDialog = function() {
            $scope.isMandatoryPopupOpen = false;
            ngDialog.close();
        }

        $scope.saveCoTaMandatoryData = function() {
            $scope.isMandatoryPopupOpen = false;
            $scope.$emit("saveContactInformation");

            $scope.$emit("saveArAccountFromMandatoryPopup", $scope.arAccountDetails);
        }     

        $scope.shouldEnableSubmitButton = function() {
            return !isEmpty($scope.contactInformation.address_details.street1) 
                    && !isEmpty($scope.contactInformation.address_details.city) 
                    && !isEmpty($scope.contactInformation.address_details.postal_code) 
                    && $scope.contactInformation.address_details.country_id !== '' 
                    && $scope.contactInformation.address_details.country_id !== null  
                    && !isEmpty($scope.contactInformation.address_details.phone) 
                    && !isEmpty($scope.contactInformation.address_details.email_address) 
                    && !isEmpty($scope.contactInformation.e_invoice_address) 
                    && !isEmpty($scope.contactInformation.account_details.organization_id) 
                    && !isEmpty($scope.contactInformation.account_details.tax_number) 
                    && !isEmpty($scope.contactInformation.account_details.reg_tax_office) 
                    && !isEmpty($scope.contactInformation.primary_contact_details.contact_first_name) 
                    && !isEmpty($scope.contactInformation.primary_contact_details.contact_last_name) 
        };

        var init = function() {
            $scope.arAccountDetails = {};

            $timeout(function() {
                $scope.refreshScroller('companyTravelAgentMandatory');
            }, 200);

            if ($scope.contactInformation.e_invoice_address === undefined) {
                $scope.contactInformation.e_invoice_address = null
            }

            if ($scope.contactInformation.address_details.street1 === null || $scope.contactInformation.address_details.street1 === '') {
                $scope.shouldShowAddress = true;
            }
            if ($scope.contactInformation.address_details.city === null || $scope.contactInformation.address_details.city === '') {
                $scope.shouldShowCity = true;
            }
            if ($scope.contactInformation.address_details.postal_code === null || $scope.contactInformation.address_details.postal_code === '') {
                $scope.shouldShowPostalCode = true;
            }
            if ($scope.contactInformation.address_details.country_id === null || $scope.contactInformation.address_details.country_id === '') {
                $scope.shouldShowCountry = true;
            }
            if ($scope.contactInformation.address_details.phone === null || $scope.contactInformation.address_details.phone === '') {
                $scope.shouldShowPhone = true;
            }

            if ($scope.contactInformation.address_details.email_address === null || $scope.contactInformation.address_details.email_address === '') {
                $scope.shouldShowEmail = true;
            }
            if ($scope.contactInformation.e_invoice_address === null || $scope.contactInformation.e_invoice_address === '') {
                $scope.shouldShowEInvoice = true;
            }
            if ($scope.contactInformation.account_details.organization_id === null || $scope.contactInformation.account_details.organization_id === '') {
                $scope.shouldShowOrganization = true;
            }
            if ($scope.contactInformation.account_details.tax_number === null || $scope.contactInformation.account_details.tax_number === '') {
                $scope.shouldShowTaxNumber = true;
            }
            if ($scope.contactInformation.account_details.reg_tax_office === null || $scope.contactInformation.account_details.reg_tax_office === '') {
                $scope.shouldShowRegisteredTaxOffice = true;
            }

            if ($scope.contactInformation.primary_contact_details.contact_first_name === null || $scope.contactInformation.primary_contact_details.contact_first_name === '') {
                $scope.shouldShowPrimaryContactFirstName = true;
            }

            if ($scope.contactInformation.primary_contact_details.contact_last_name === null || $scope.contactInformation.primary_contact_details.contact_last_name === '') {
                $scope.shouldShowPrimaryContactLastName = true;
            }


        };

        init();

}]);