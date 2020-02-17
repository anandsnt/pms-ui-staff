describe('rvCardSearchContractOwnerCtrl', function() {
    var $controller,
        $scope = {},
        $q,
        rvCompanyCardContractsSrv,
        that;

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _rvCompanyCardContractsSrv_, _$rootScope_, _$q_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            rvCompanyCardContractsSrv = _rvCompanyCardContractsSrv_;
            $q = _$q_;
        });
        
        angular.extend($scope, {
            contractData: {
                mode: 'EDIT',
                accountId: '123',
                contractOwner: {
                    results: [],
                    isInactive: false
                },
                selectedOwner: {
                    name: 'test',
                    id: 1
                }
            }
        });

        that = $controller('rvCardSearchContractOwnerCtrl', {
            $scope: $scope
        });
    });

    it('Check fetch owner API call', function() {
        $scope.contractData.contractOwner.isInactive = true;
        spyOn(rvCompanyCardContractsSrv, "fetchOwners").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        that.fetchOwners();
        expect(rvCompanyCardContractsSrv.fetchOwners).toHaveBeenCalled();
    });

    it('Check clickedInactive', function() {
        $scope.contractData.contractOwner.isInactive = false;
        $scope.clickedInactive();
        expect($scope.contractData.contractOwner.isInactive).toEqual(true);
    });

});
