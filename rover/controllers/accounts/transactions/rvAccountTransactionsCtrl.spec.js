describe('rvAccountTransactionsCtrl', function () {

    var $controller,
        $scope,
        $q,
        $rootScope,
        RVBillCardSrv,
        rvAccountTransactionsCtrl;

        describe('Folio Generation', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _RVreportsSubSrv_, _$q_, _$rootScope_, _RVBillCardSrv_) {
                    $controller = _$controller_;
                    RVBillCardSrv = _RVBillCardSrv_;
                    $q = _$q_;
                    $rootScope = _$rootScope_;

                    $scope = _$rootScope_.$new();
                    $scope.transactionsDetails = {};
                });

                rvAccountTransactionsCtrl = $controller('rvAccountTransactionsCtrl', {
                    $scope: $scope
                });

            }); 

            it('call generateFolioNumber method if it satisfies condition from accounts', function() {
               
                spyOn(RVBillCardSrv, "generateFolioNumber").and.callFake(function() {
                    var deferred = $q.defer();

                    deferred.resolve({});
                    return deferred.promise;
                });

                rvAccountTransactionsCtrl.generateFolioNumber(113228, "0.0", false);
                $rootScope.$apply();
                expect(RVBillCardSrv.generateFolioNumber).toHaveBeenCalled();

            });

        });    
});
