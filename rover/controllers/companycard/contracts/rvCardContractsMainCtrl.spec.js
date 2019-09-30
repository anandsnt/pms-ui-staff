describe('rvCardContractsMainCtrl', function() {
    var $controller,
        $scope = {},
        that,
        RVCompanyCardSrv,
        $q;

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _RVCompanyCardSrv_, _$rootScope_, _$q_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            RVCompanyCardSrv = _RVCompanyCardSrv_;
            $q = _$q_;
        });
        that = $controller('rvCardContractsMainCtrl', {
            $scope: $scope
        });
    });

    it('call contracts list API', function() {
        spyOn(RVCompanyCardSrv, "fetchContractsList").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        that.init()
        expect(RVCompanyCardSrv.fetchContractsList).toHaveBeenCalled();
    });

    it('call contract details API', function() {
        spyOn(RVCompanyCardSrv, "fetchContractsDetails").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        that.fetchContractDetails();
        expect(RVCompanyCardSrv.fetchContractsDetails).toHaveBeenCalled();
    });

    it('click on new contract button', function() {
        $scope.createFirstContract();
        expect($scope.contractData.mode).toEqual('ADD');
        expect($scope.contractData.noContracts).toBeFalsy();
    });
});
