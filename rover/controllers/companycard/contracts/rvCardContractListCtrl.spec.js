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
                mode: 'EDIT'
            }
        });
    });

    it('click on new contract button', function() {
        $scope.newContract();
        expect($scope.contractData.mode).toEqual('ADD');
    });

    it('open and close selected list', function() {
        var listType = 'PAST';

        $scope.openContractsList(listType);
        expect($scope.opened).toBeTruthy();
        expect($scope.selectedType).toEqual(listType);
        $scope.openContractsList(listType);
        expect($scope.opened).toBeFalsy();
        expect($scope.selectedType).toEqual(listType);
    });

    it('change selected list', function() {
        $scope.openContractsList('PAST');
        expect($scope.opened).toBeTruthy();
        expect($scope.selectedType).toEqual('PAST');

        $scope.openContractsList('CURRENT');
        expect($scope.opened).toBeTruthy();
        expect($scope.selectedType).toEqual('CURRENT');
    });
});
