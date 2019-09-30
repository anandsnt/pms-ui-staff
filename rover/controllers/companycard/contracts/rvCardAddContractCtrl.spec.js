describe('rvCardAddContractsCtrl', function() {
    var $controller,
        $scope = {},
        $q,
        RVCompanyCardSrv;

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _RVCompanyCardSrv_, _$rootScope_, _$q_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            RVCompanyCardSrv = _RVCompanyCardSrv_;
            $q = _$q_;
        });
        $controller('rvCardAddContractsCtrl', {
            $scope: $scope
        });
        angular.extend($scope, {
            contractData: {
                mode: 'ADD'
            },
            showNightsModal: false
        });
    });

    it('invoke cancel click', function() {
        $scope.cancelNewContract();
        expect($scope.contractData.mode).not.toEqual('ADD');
    });

    it('test save function', function() {
        spyOn(RVCompanyCardSrv, "addNewContract").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        $scope.addData = {
            contractName: 'Test',
            accessCode: 'Test',
            startDate: '2019-11-02',
            endDate: '2019-11-10',
            contractedNights: 0,
            contractedRates: [],
            isActive: true
        };
        $scope.saveNewContract();
        expect(RVCompanyCardSrv.addNewContract).toHaveBeenCalled();
    });

    it('check toggle active flag', function() {
        $scope.addData.isActive = true;
        $scope.toggleActiveStatus();
        expect($scope.addData.isActive).toBeFalsy();
        $scope.toggleActiveStatus();
        expect($scope.addData.isActive).toBeTruthy();
    });

    it('call save API before showing contracted nights modal', function() {
        spyOn(RVCompanyCardSrv, "addNewContract").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        $scope.contractedNights();
        expect(RVCompanyCardSrv.addNewContract).toHaveBeenCalled();
    });
});
