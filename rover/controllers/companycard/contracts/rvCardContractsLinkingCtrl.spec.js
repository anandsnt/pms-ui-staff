describe('rvCardContractsLinkingCtrl', function() {
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
                mode: 'LINK',
                accountId: '123',
                linkContractsSearch: {
                    query: '',
                    results: []
                }
            },
            setScroller: function setScroller() {
                return true;
            },
            refreshScroller: function refreshScroller() {
                return true;
            }
        });

        that = $controller('rvCardContractsLinkingCtrl', {
            $scope: $scope
        });
    });

    it('Check clear query', function() {
        that.initialise();
        $scope.contractData.linkContractsSearch.query = 'contracts';
        $scope.clearQuery();
        expect($scope.contractData.linkContractsSearch.query).toEqual('');
    });

    it('Check search contracts API call', function() {
        that.initialise();
        $scope.contractData.linkContractsSearch.query = 'contracts';
        spyOn(rvCompanyCardContractsSrv, "fetchContractsForLinking").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        $scope.searchContracts();
        expect(rvCompanyCardContractsSrv.fetchContractsForLinking).toHaveBeenCalled();
    });

    it('Check Link contracts API call', function() {
        var results = {
            "contracts": [{
                "id": 238,
                "contract_name": "Contract 1",
                "begin_date": "2016-01-28",
                "end_date": "2018-01-26",
                "is_already_linked": false,
                "rates": ["Contract 1"]
            }, {
                "id": 239,
                "contract_name": "Contract 2",
                "begin_date": "2016-01-28",
                "end_date": "2020-02-29",
                "is_already_linked": false,
                "rates": ["Contract 2"]
            }, {
                "id": 387,
                "contract_name": "Nike Contract Rate",
                "begin_date": "2016-09-06",
                "end_date": "2017-10-31",
                "is_already_linked": true,
                "rates": ["Nike Contract Rate"]
            }, {
                "id": 513,
                "contract_name": "Contract Rate for Global TA",
                "begin_date": "2016-12-10",
                "end_date": "2017-03-31",
                "is_already_linked": false,
                "rates": ["Contract Rate for Global TA"]
            }],
            "is_eod_in_progress": false,
            "is_eod_manual_started": false,
            "is_eod_failed": true,
            "is_eod_process_running": false
        };

        that.initialise();
        $scope.contractData.linkContractsSearch.results = results.contracts;

        spyOn(rvCompanyCardContractsSrv, "linkContract").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });

        $scope.clickedOnResult(1);
        expect(rvCompanyCardContractsSrv.linkContract).toHaveBeenCalled();
    });
});
