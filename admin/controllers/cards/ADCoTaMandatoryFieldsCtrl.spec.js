describe('ADCoTaMandatoryFieldsCtrl', function() {

    var $controller,
        $scope = {},
        ADCoTaMandatorySrv,
        $q,
        $rootScope;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADCoTaMandatorySrv_, _$q_) {
            $controller = _$controller_;
            ADCoTaMandatorySrv = _ADCoTaMandatorySrv_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $scope.coTaMandatoryFields = {"address_line1_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": true, "is_mandatory_on_account_creation": false}, "city_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": true, "is_mandatory_on_account_creation": false}, "postal_code_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": true, "is_mandatory_on_account_creation": false}, "country_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": true, "is_mandatory_on_account_creation": false}, "contact_phone_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": false, "is_mandatory_on_account_creation": false}, "contact_email_address_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": true, "is_mandatory_on_account_creation": false}, "contact_name_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": false, "is_mandatory_on_account_creation": false}, "tax_id_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": true, "is_mandatory_on_account_creation": false}, "e_invoice_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": false, "is_mandatory_on_account_creation": true}, "regd_tax_office_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": true, "is_mandatory_on_account_creation": false}, "organization_id_mandatory": {"is_visible": true, "is_mandatory_on_ar_account_creation": true, "is_mandatory_on_account_creation": false}};
        });

        $controller('ADCoTaMandatoryFieldsCtrl', {
            $scope: $scope,
            $rootScope: $rootScope
        });

    });
    // =======================
    it('Save mandatory fields', function() {

        spyOn(ADCoTaMandatorySrv, "saveCoTaMandatoryFields").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve();
            return deferred.promise;
        });       

        $scope.saveMandatoryFields();

        expect(ADCoTaMandatorySrv.saveCoTaMandatoryFields).toHaveBeenCalled();

    });

    // =======================
    it('Clicked status toggle when e-invoice visibility is true', function() {

        $scope.clickedStatus('e_invoice_mandatory');

        expect($scope.coTaMandatoryFields.e_invoice_mandatory.is_visible).toBe(false);
        expect($scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_ar_account_creation).toBe(false);
        expect($scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_account_creation).toBe(false);

    });
    // =======================
    it('Clicked status toggle when registered tax office visibility is true', function() {

        $scope.clickedStatus('regd_tax_office_mandatory');

        expect($scope.coTaMandatoryFields.regd_tax_office_mandatory.is_visible).toBe(false);
        expect($scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_ar_account_creation).toBe(false);
        expect($scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_account_creation).toBe(false);

    });
    // =======================
    it('Clicked status toggle when organization id visibility is true', function() {

        $scope.clickedStatus('organization_id_mandatory');

        expect($scope.coTaMandatoryFields.organization_id_mandatory.is_visible).toBe(false);
        expect($scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation).toBe(false);
        expect($scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_account_creation).toBe(false);

    });

    // ========================

    it('Clicked status toggle when organization id visibility is true', function() {

        $scope.clickedStatus('organization_id_mandatory');

        expect($scope.coTaMandatoryFields.organization_id_mandatory.is_visible).toBe(false);
        expect($scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation).toBe(false);
        expect($scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_account_creation).toBe(false);

    });

    // ========================

    it('Clicked mandatory on AR account creation for address line', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "address_line1_mandatory");

        expect($scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_ar_account_creation).toBe(false);

    });
    // ========================

    it('Clicked mandatory on AR account creation for city', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "city_mandatory");

        expect($scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_ar_account_creation).toBe(false);

    });
    // ========================

    it('Clicked mandatory on AR account creation for postal code', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "postal_code_mandatory");

        expect($scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_ar_account_creation).toBe(false);

    });
    // ========================

    it('Clicked mandatory on AR account creation for country', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "country_mandatory");

        expect($scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_ar_account_creation).toBe(false);

    });
    // ========================

    it('Clicked mandatory on AR account creation for contact  phone', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "contact_phone_mandatory");

        expect($scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_ar_account_creation).toBe(true);

    });

    // ========================

    it('Clicked mandatory on AR account creation for contact  email', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "contact_email_address_mandatory");

        expect($scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_ar_account_creation).toBe(false);

    });

    // ========================

    it('Clicked mandatory on AR account creation for contact  name', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "contact_name_mandatory");

        expect($scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_ar_account_creation).toBe(true);

    });

    // ========================

    it('Clicked mandatory on AR account creation for tax id', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "tax_id_mandatory");

        expect($scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_ar_account_creation).toBe(false);

    });

    // ========================

    it('Clicked mandatory on AR account creation for E-invoice', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "e_invoice_mandatory");

        expect($scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_ar_account_creation).toBe(true);

    });

    // ========================

    it('Clicked mandatory on AR account creation for registered tax office', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "regd_tax_office_mandatory");

        expect($scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_ar_account_creation).toBe(false);

    });

    // ========================

    it('Clicked mandatory on AR account creation for organization id', function() {

        $scope.clickedMandatoryOnArAccountCreation(true, "organization_id_mandatory");

        expect($scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_ar_account_creation).toBe(false);

    });
    // ========================

    it('Clicked mandatory on account creation for address line', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "address_line1_mandatory");

        expect($scope.coTaMandatoryFields.address_line1_mandatory.is_mandatory_on_account_creation).toBe(true);

    });
    // ========================

    it('Clicked mandatory on account creation for city', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "city_mandatory");

        expect($scope.coTaMandatoryFields.city_mandatory.is_mandatory_on_account_creation).toBe(true);

    });
    // ========================

    it('Clicked mandatory on account creation for postal code', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "postal_code_mandatory");

        expect($scope.coTaMandatoryFields.postal_code_mandatory.is_mandatory_on_account_creation).toBe(true);

    });
    // ========================

    it('Clicked mandatory on account creation for country', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "country_mandatory");

        expect($scope.coTaMandatoryFields.country_mandatory.is_mandatory_on_account_creation).toBe(true);

    });
    // ========================

    it('Clicked mandatory on account creation for contact  phone', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "contact_phone_mandatory");

        expect($scope.coTaMandatoryFields.contact_phone_mandatory.is_mandatory_on_account_creation).toBe(true);

    });

    // ========================

    it('Clicked mandatory on account creation for contact  email', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "contact_email_address_mandatory");

        expect($scope.coTaMandatoryFields.contact_email_address_mandatory.is_mandatory_on_account_creation).toBe(true);

    });

    // ========================

    it('Clicked mandatory on account creation for contact  name', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "contact_name_mandatory");

        expect($scope.coTaMandatoryFields.contact_name_mandatory.is_mandatory_on_account_creation).toBe(true);

    });

    // ========================

    it('Clicked mandatory on account creation for tax id', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "tax_id_mandatory");

        expect($scope.coTaMandatoryFields.tax_id_mandatory.is_mandatory_on_account_creation).toBe(true);

    });

    // ========================

    it('Clicked mandatory on account creation for E-invoice', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "e_invoice_mandatory");

        expect($scope.coTaMandatoryFields.e_invoice_mandatory.is_mandatory_on_account_creation).toBe(false);

    });

    // ========================

    it('Clicked mandatory on account creation for registered tax office', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "regd_tax_office_mandatory");

        expect($scope.coTaMandatoryFields.regd_tax_office_mandatory.is_mandatory_on_account_creation).toBe(true);

    });

    // ========================

    it('Clicked mandatory on account creation for organization id', function() {

        $scope.clickedMandatoryOnAccountCreation(true, "organization_id_mandatory");

        expect($scope.coTaMandatoryFields.organization_id_mandatory.is_mandatory_on_account_creation).toBe(true);

    });
});
