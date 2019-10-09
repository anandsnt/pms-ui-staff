describe('rvCardSearchContractedRateCtrl', function() {
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
                mode: 'ADD',
                accountId: '123',
                contract_rates: [],
                selectedRateList: [],
                searchResults: [],
                rateSearchQuery: 'rate'
            },
            setScroller: function setScroller() {
                return true;
            },
            refreshScroller: function refreshScroller() {
                return true;
            }
        });

        that = $controller('rvCardSearchContractedRateCtrl', {
            $scope: $scope
        });
    });

    it('Check clear query', function() {
        that.initialise();
        $scope.contractData.rateSearchQuery = 'rate';
        $scope.clearQuery();
        expect($scope.contractData.rateSearchQuery).toEqual('');
    });

    it('Check clicked On Result', function() {
        that.initialise();
        var searchResult = [
            {
                'code': 'c1',
                'name': 'rate-1',
                'id': 1
            }, {
                'code': 'c2',
                'name': 'rate-2',
                'id': 2
            }, {
                'code': 'c3',
                'name': 'rate-3',
                'id': 3
            }, {
                'code': 'c4',
                'name': 'rate-4',
                'id': 4
            }];

        $scope.contractData.selectedRateList = [];
        $scope.contractData.searchResults = searchResult;

        $scope.clickedOnResult(2);

        expect($scope.contractData.selectedRateList[0].name).toEqual('rate-3');
        expect($scope.contractData.rateSearchQuery).toEqual('');
        expect($scope.contractData.searchResults).toEqual([]);
    });

    it('Check Remove item', function() {
        that.initialise();
        var selectedRateList = [
            {
                'code': 'c1',
                'name': 'rate-1',
                'id': 1
            }, {
                'code': 'c2',
                'name': 'rate-2',
                'id': 2
            }, {
                'code': 'c3',
                'name': 'rate-3',
                'id': 3
            }, {
                'code': 'c4',
                'name': 'rate-4',
                'id': 4
            }
        ],
        index = 1;

        $scope.contractData.selectedRateList = selectedRateList;
        $scope.removeRate(index);

        expect($scope.contractData.selectedRateList[index].id).not.toEqual(2);
    });

    it('Check search rate API call', function() {
        that.initialise();
        $scope.contractData.rateSearchQuery = 'rate';
        spyOn(rvCompanyCardContractsSrv, "fetchRateContract").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        $scope.searchRate();
        expect(rvCompanyCardContractsSrv.fetchRateContract).toHaveBeenCalled();
    });
});
