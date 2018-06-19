describe('ADTaxExemptDetailsCtrl', function() {

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('chargeCodesSampleData.json'),
        jsonResult = fixtures['chargeCodesSampleData.json']; 

    var $controller,
        $scope,
        ADTaxExemptSrv,
        ADTaxExemptDetailsCtrl,
        $q,
        $rootScope,
        $stateParams,
        taxExemptData = {"id":11,"name":"second","charge_codes":[{"charge_code":"1001","id":13107},{"charge_code":"1002","id":13108}]},
        chargeCodesData = jsonResult;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADTaxExemptSrv_, _$q_, _$stateParams_) {
            $controller = _$controller_;
            ADTaxExemptSrv = _ADTaxExemptSrv_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $stateParams = _$stateParams_;
            $scope = _$rootScope_.$new();

        });

        ADTaxExemptDetailsCtrl = $controller('ADTaxExemptDetailsCtrl', {
            $scope: $scope
        });

    });

    // ============================================

    it('List all charge codes', function () {       
        
        spyOn(ADTaxExemptSrv, 'fetchChargeCodes').and.callFake(function () {
            var deferred = $q.defer();

            deferred.resolve(chargeCodesData);
            return deferred.promise;
        });

        $scope.searchChargeCodes();

        // Promise won't be resolved till $apply runs....
        $scope.$digest();

        expect($scope.chargeCodes[0].charge_code).toBe(chargeCodesData.data.charge_codes[0].charge_code);
    });

    // ============================================

    it('Update tax exempt', function () {       
        
        spyOn(ADTaxExemptSrv, "updateTaxExempts").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve();
            return deferred.promise;
        });

        $stateParams.taxExemptId = 23;

        $scope.saveTaxExempt();

        expect(ADTaxExemptSrv.updateTaxExempts).toHaveBeenCalled();
    });

    it('Save tax exempt', function () {       
        
        spyOn(ADTaxExemptSrv, "saveTaxExempts").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve();
            return deferred.promise;
        });

        $stateParams.taxExemptId = '';

        $scope.saveTaxExempt();

        expect(ADTaxExemptSrv.saveTaxExempts).toHaveBeenCalled();
    });

});
