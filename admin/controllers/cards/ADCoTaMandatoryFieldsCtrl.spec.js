describe('ADCoTaMandatoryFieldsCtrl', function() {

    var $controller,
        $scope = {},
        ADCoTaMandatorySrv,
        $q,
        $defer,
        $rootScope;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADCoTaMandatorySrv_, _$q_) {
            $controller = _$controller_;
            ADCoTaMandatorySrv = _ADCoTaMandatorySrv_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $scope.coTaMandatoryFields = {
				tax_id_mandatory: false,
				contact_name_mandatory: true,
				address_line1_mandatory: false,
				city_mandatory: true,
				postal_code_mandatory: false,
				country_mandatory: false,
				contact_phone_mandatory: true,
				contact_email_address_mandatory: false
			};
        });

        $controller('ADCoTaMandatoryFieldsCtrl', {
            $scope: $scope,
            $rootScope: $rootScope
        });

    });
    // =======================
    it('save mandatory fields', function() {

        spyOn(ADCoTaMandatorySrv, "saveCoTaMandatoryFields").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve();
            return deferred.promise;
        });       

        $scope.saveMandatoryFields();

        expect(ADCoTaMandatorySrv.saveCoTaMandatoryFields).toHaveBeenCalled();

    });
    // ===================================
    it('clicked mandatory checkbox', function() {

        $scope.clickedMandatoryCheck();

        expect($scope.coTaMandatoryFields.city_mandatory).toBe(false);

    });
});
