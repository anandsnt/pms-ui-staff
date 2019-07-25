describe('RVReceiptPopupController', function () {

    var $controller,
        $scope,
        RVBillCardSrv,
        $q,
        RVReceiptPopupController;

        describe('Bill print or email', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _RVBillCardSrv_, _$q_) {
                    $controller = _$controller_;                    
                    $scope = _$rootScope_.$new();
                    $q = _$q_;
                    RVBillCardSrv = _RVBillCardSrv_;
                });

                RVReceiptPopupController = $controller('RVReceiptPopupController', {
                    $scope: $scope
                });
 
                angular.extend($scope, {
                    'refreshScroll': function() {
                        return true;
                    }
                });

            }); 
            // -------------------------------------------
            it('get Email Button Class', function() {

                $scope.data = {};
                $scope.data.mailto_address = "";

                var classEmail = $scope.getEmailButtonClass();

                expect(classEmail).toBe("grey");               
            });   
            // -------------------------------------------
             // -------------------------------------------
            it('get Email Button Class', function() {

                $scope.data = {};
                $scope.data.mailto_address = "test@gmail.com";
                
                var classEmail = $scope.getEmailButtonClass();

                expect(classEmail).toBe("blue");               
            });

            // -------------------------------------------
            it('print receipt to have been called', function() {

                spyOn(RVBillCardSrv, "printReceiptData").and.callFake(function() {
                    var deferred = $q.defer();

                    deferred.resolve({});
                    return deferred.promise;
                });

                $scope.printReceipt();

                expect(RVBillCardSrv.printReceiptData).toHaveBeenCalled();              
            }); 

            // -------------------------------------------
            it('email receipt to have been called', function() {

                spyOn(RVBillCardSrv, "emailReceiptData").and.callFake(function() {
                    var deferred = $q.defer();

                    deferred.resolve({});
                    return deferred.promise;
                });

                $scope.emailReceipt();

                expect(RVBillCardSrv.emailReceiptData).toHaveBeenCalled();              
            });               

        });    
});
