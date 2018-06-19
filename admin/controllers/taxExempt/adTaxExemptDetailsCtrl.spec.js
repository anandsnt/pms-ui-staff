describe('ADTaxExemptDetailsCtrl', function() {

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('taxExemptSampleData.json'),
        jsonResult = fixtures['taxExemptSampleData.json']; 

    var $controller,
        $scope = {},
        ADTaxExemptSrv,
        ADTaxExemptDetailsCtrl,
        $q,
        results = jsonResult,
        $defer,
        $rootScope,
        ngTableParams;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADTaxExemptSrv_, _$q_, _ngTableParams_) {
            $controller = _$controller_;
            ADTaxExemptSrv = _ADTaxExemptSrv_;
            $q = _$q_;
            $defer = $q.defer();
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
        });

        ADTaxExemptDetailsCtrl = $controller('ADTaxExemptDetailsCtrl', {
            $scope: $scope,
            $rootScope : $rootScope
        });

    });

    // ============================================

    it('List all charge codes', function () {       
        
        spyOn(ADTaxExemptSrv, 'fetchTaxExempts').and.callFake(function () {
            var deferred = $q.defer();

            deferred.resolve(results);
            return deferred.promise;
        });
        $scope.displyCount = 10;
        $scope.tableParams = new ngTableParams({
                page: 1,  // show first page
                count: $scope.displyCount // count per page
        
            }, {
                total: 0, // length of data
                getData: $scope.fetchTaxExempts
            }
        );
        $scope.fetchTaxExempts($defer, $scope.tableParams);

        // Promise won't be resolved till $apply runs....
        $scope.$digest();

        expect($scope.data[0].name).toBe(results.results[0].name);
        expect($scope.data[0].id).toBe(results.results[0].id);
    });

});
