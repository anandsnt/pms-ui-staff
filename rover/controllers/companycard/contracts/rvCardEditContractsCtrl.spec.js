describe('rvCardEditContractsCtrl', function() {
    var $controller,
        $scope = {},
        $rootScope = {},
        that,
        $q,
        RVCompanyCardSrv;

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _RVCompanyCardSrv_, _$rootScope_, _$q_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_.$new();
            RVCompanyCardSrv = _RVCompanyCardSrv_;
            $q = _$q_;
        });
        that = $controller('rvCardEditContractsCtrl', {
            $scope: $scope
        });
        angular.extend($scope, {
            contractData: {
                mode: 'EDIT',
                editData: {
                    contract_name: '',
                    access_code: '',
                    begin_date: '',
                    end_date: '',
                    total_contracted_nights: '',
                    is_active: ''
                }
            }
        });
    });

    it('invoke Update Contracts API', function() {
        spyOn(RVCompanyCardSrv, "updateContract").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        $scope.updateContract();
        expect(RVCompanyCardSrv.updateContract).toHaveBeenCalled();
    });

    it('check toggle function for non past contracts', function() {
        $scope.contractData.editData.is_active = true;
        $scope.contractData.disableFields = false;
        $scope.toggleActiveStatus();
        expect($scope.contractData.editData.is_active).toBeFalsy();
        $scope.toggleActiveStatus();
        expect($scope.contractData.editData.is_active).toBeTruthy();
    });

    it('check toggle function for past contracts', function() {
        $scope.contractData.disableFields = true;
        expect($scope.contractData.editData.is_active).toBeFalsy();
        $scope.toggleActiveStatus();
        expect($scope.contractData.editData.is_active).toBeFalsy();
    });
});
