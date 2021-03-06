describe('RVbillCardController', function () {

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('reservationSampleData.json'),
        reservationSampleData = fixtures['reservationSampleData.json'],
        reservationBillSampleDataFixtures = loadJSONFixtures('reservationBillSampleData.json'),
        reservationBillSampleData = reservationBillSampleDataFixtures['reservationBillSampleData.json']; 

    var $controller,
        $scope,
        $q,
        $rootScope,
        RVBillCardSrv,
        RVbillCardController;

        describe('Folio Generation', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _RVreportsSubSrv_, _$q_, _$rootScope_, _RVBillCardSrv_) {
                    $controller = _$controller_;
                    RVBillCardSrv = _RVBillCardSrv_;
                    $q = _$q_;
                    $rootScope = _$rootScope_;

                    $scope = _$rootScope_.$new();
                    $scope.reservation = reservationSampleData;
                    $rootScope.roverObj = {};
                });

                RVbillCardController = $controller('RVbillCardController', {
                    $scope: $scope,
                    reservationBillData: reservationBillSampleData
                });

                angular.extend($scope, {
                    'refreshScroll': function() {
                        return true;
                    }
                });

            }); 

            it('call generateFolioNumber method if it satisfies condition', function() {
               
                spyOn(RVBillCardSrv, "generateFolioNumber").and.callFake(function() {
                    var deferred = $q.defer();

                    deferred.resolve({});
                    return deferred.promise;
                });

                RVbillCardController.generateFolioNumber(113228, "0.00", false);
                $rootScope.$apply();
                expect(RVBillCardSrv.generateFolioNumber).toHaveBeenCalled();

            });

            it('call generateFolioNumber method with the required data', function() {
                spyOn(RVbillCardController, 'generateFolioNumber');

                RVbillCardController.callGenerateFolioNumberApi();

                expect(RVbillCardController.generateFolioNumber).toHaveBeenCalled();               
            });

            it('get invoice button class', function() {
                $scope.roverObj.noReprintReEmailInvoice = true;
                $scope.currentActiveBill = 0;

                var color = $scope.getInvoiceButtonClass();

                expect(color).toBe("grey");               
            });

            it('get invoice button class', function() {
                $scope.roverObj.noReprintReEmailInvoice = false;
                $scope.currentActiveBill = 0;

                var color = $scope.getInvoiceButtonClass();

                expect(color).toBe("blue");               
            });

            it('get invoice button enabled/disabled', function() {
                $scope.roverObj.noReprintReEmailInvoice = true;
                $scope.currentActiveBill = 0;

                var isDisabled = $scope.isInvoiceButtonDisabled();

                expect(isDisabled).toBe(true);               
            });

            it('should hide void bill if bill is voided', function() {
                $scope.roverObj.noReprintReEmailInvoice = true;
                $scope.currentActiveBill = 0;

                var shouldShowVoidBill = $scope.shouldShowVoidBill();

                expect(shouldShowVoidBill).toBe(false);               
            });

            it('should show void bill if bill is settled, locked and not voided', function() {
                $scope.roverObj.noReprintReEmailInvoice = true;
                $scope.currentActiveBill = 5;

                var shouldShowVoidBill = $scope.shouldShowVoidBill();

                expect(shouldShowVoidBill).toBe(true);               
            });

            it('should show void bill if bill is settled, but not locked and not voided', function() {
                $scope.roverObj.noReprintReEmailInvoice = true;
                $scope.currentActiveBill = 4;

                var shouldShowVoidBill = $scope.shouldShowVoidBill();

                expect(shouldShowVoidBill).toBe(false);               
            });            

        });    
});
