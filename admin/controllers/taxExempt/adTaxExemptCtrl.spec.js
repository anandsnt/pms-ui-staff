describe('ADTaxExemptCtrl', function() {

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('taxExemptSampleData.json'),
        jsonResult = fixtures['taxExemptSampleData.json']; 

    var $controller,
        $scope = {},
        ADTaxExemptSrv,
        ADTaxExemptCtrl,
        $q,
        results = jsonResult;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADTaxExemptSrv_, _$q_ ) {
            $controller = _$controller_;
            ADTaxExemptSrv = _ADTaxExemptSrv_;
            $q = _$q_;
            $defer = $defer;
            $scope = _$rootScope_.$new();
        });

        ADTaxExemptCtrl = $controller('ADTaxExemptCtrl', {
            $scope: $scope
        });

    });
    // =======================
    it('delete method should invoke, if delete icon clicked', function() {

        spyOn(ADTaxExemptSrv, "deleteTaxExempts").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve();
            return deferred.promise;
        });

        var taxExemptId = 5;

        $scope.deleteTaxExempt(taxExemptId);

        expect(ADTaxExemptSrv.deleteTaxExempts).toHaveBeenCalled();

    });
    // ============================================

    it('List all tax exempts', function () {       
        
        spyOn(ADTaxExemptSrv, 'fetchTaxExempts').and.callFake(function () {
            var deferred = $q.defer();

            deferred.resolve(results);
            return deferred.promise;
        });

        $scope.invoiceSearchData = {};

        $scope.invoiceSearchData.query = 'ghl';

        $scope.results = results;

        $scope.fetchTaxExempts(1);

         // Promise won't be resolved till $apply runs....
        $rootScope.$apply();

        expect($scope.results.data.results[0].associated_item.number).toBe(results.data.results[0].associated_item.number);
        expect($scope.results.data.results[0].bills[2].routing_details.is_primary).toEqual(results.data.results[0].bills[2].routing_details.is_primary);
       
    });

});
