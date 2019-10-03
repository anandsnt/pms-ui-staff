describe('rvCardContractsMainCtrl', function() {
    var $controller,
        $scope = {},
        that,
        rvCompanyCardContractsSrv,
        $q;

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _rvCompanyCardContractsSrv_, _$rootScope_, _$q_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            rvCompanyCardContractsSrv = _rvCompanyCardContractsSrv_;
            $q = _$q_;
        });
        that = $controller('rvCardContractsMainCtrl', {
            $scope: $scope
        });
    });

    it('call contracts list API', function() {
        spyOn(rvCompanyCardContractsSrv, "fetchContractsList").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        that.init();
        expect(rvCompanyCardContractsSrv.fetchContractsList).toHaveBeenCalled();
    });

    it('call contract details API', function() {
        spyOn(rvCompanyCardContractsSrv, "fetchContractsDetails").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        that.fetchContractDetails();
        expect(rvCompanyCardContractsSrv.fetchContractsDetails).toHaveBeenCalled();
    });

    it('click on new contract button', function() {
        $scope.createFirstContract();
        expect($scope.contractData.mode).toEqual('ADD');
        expect($scope.contractData.noContracts).toBeFalsy();
    });
});
