describe('rvCardContractListCtrl', function() {
    var $controller,
        $scope = {};

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
        });
        $controller('rvCardContractListCtrl', {
            $scope: $scope
        });
        angular.extend($scope, {
            contractData: {
                mode: 'EDIT',
                linkContractsSearch: {
                    query: '',
                    results: []
                }
            }
        });
    });

    it('click on new contract button', function() {
        $scope.newContract();
        expect($scope.contractData.mode).toEqual('ADD');
    });
});
