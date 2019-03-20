describe('rvBillFormatPopupCtrl', function () {

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('groupConfigSampleData.json'),
        groupConfigSampleData = fixtures['groupConfigSampleData.json'];

    var $controller,
        $timeout,
        $scope,
        $rootScope,
        rvBillFormatPopupCtrl;

        describe('Bill print or email', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _$rootScope_, _$timeout_) {
                    $controller = _$controller_;                    
                    $rootScope = _$rootScope_;
                    $timeout = _$timeout_;

                    $scope = _$rootScope_.$new();
                    // $scope.reservation = reservationSampleData;
                    $scope.groupConfigData = groupConfigSampleData;
                    $rootScope.roverObj = {};
                    $scope.billFormat = {};
                    $scope.billFormat.isInformationalInvoice = false;
                });

                rvBillFormatPopupCtrl = $controller('rvBillFormatPopupCtrl', {
                    $scope: $scope
                });

                angular.extend($scope, {
                    'refreshScroll': function() {
                        return true;
                    }
                });

            }); 
            // -------------------------------------------
            it('call print bill if print button clicked', function() {                

                spyOn($scope, 'printBill');

                $scope.isClickedPrint = true;

                $scope.clickedContinueButtonPrintOrEmail();

                expect($scope.printBill).toHaveBeenCalled();               
            });   
            // -------------------------------------------
            it('call email bill if email button clicked', function() {
                spyOn($scope, 'sendEmail');

                $scope.isClickedPrint = false;

                $scope.clickedContinueButtonPrintOrEmail();

                expect($scope.sendEmail).toHaveBeenCalled();               
            }); 

            // -------------------------------------------
            it('Final Invoice clicked for print', function() {
                
                $scope.shouldGenerateFinalInvoice = true;
                $scope.isInvoiceStepOneActive = false;
                $scope.isInvoiceStepTwoActive  = false;
                $scope.isInvoiceStepThreeActive = false;
                $scope.isInvoiceStepFourActive  = false;
                $scope.isInvoiceStepFiveActive  = false;               

                $scope.clickedPrintBill();

                expect($scope.isClickedPrint).toBe(true);
                expect($scope.isInvoiceStepThreeActive).toBe(false); 
                $timeout(function() {
                    expect($scope.isInvoiceStepFourActive).toBe(true);
                }, 600);
                     
            });
            // -------------------------------------------
            it('Not final invoice clicked for print', function() {
                spyOn($scope, 'printBill');

                $scope.shouldGenerateFinalInvoice = false;             

                $scope.clickedPrintBill();

                expect($scope.printBill).toHaveBeenCalled();
                     
            });

            // -------------------------------------------
            it('Final Invoice clicked for email', function() {
                
                $scope.shouldGenerateFinalInvoice = true;
                $scope.isInvoiceStepOneActive = false;
                $scope.isInvoiceStepTwoActive  = false;
                $scope.isInvoiceStepThreeActive = false;
                $scope.isInvoiceStepFourActive  = false;
                $scope.isInvoiceStepFiveActive  = false;               

                $scope.emailBill();

                expect($scope.isClickedPrint).toBe(false);
                expect($scope.isInvoiceStepThreeActive).toBe(false); 
                $timeout(function() {
                    expect($scope.isInvoiceStepFourActive).toBe(true);
                }, 600);
                     
            });
            // -------------------------------------------
            it('Not final invoice clicked for email', function() {
                spyOn($scope, 'sendEmail');

                $scope.shouldGenerateFinalInvoice = false;             

                $scope.emailBill();

                expect($scope.sendEmail).toHaveBeenCalled();                     
            });

            // -------------------------------------------
            it('Final Invoice button clicked', function() {
                
                $scope.clickedFinalInvoiceButton();

                expect($scope.isInvoiceStepOneActive).toBe(false);
                $timeout(function() {
                    expect($scope.isInvoiceStepTwoActive).toBe(true);
                }, 600);
                     
            });     

            // -------------------------------------------
            it('Clicked proceed button', function() {
                
                $scope.clickedProceedButton();

                expect($scope.isInvoiceStepTwoActive).toBe(false);
                expect($scope.isInvoiceStepFourActive).toBe(false);
                $timeout(function() {
                    expect($scope.isInvoiceStepThreeActive).toBe(true);
                }, 600);
                     
            });

            // -------------------------------------------
            it('Clicked cancel button proceed screen', function() {
                
                $scope.clickedCancelButtonProceedScreen();

                expect($scope.isInvoiceStepTwoActive).toBe(false);

                $timeout(function() {
                    expect($scope.isInvoiceStepOneActive).toBe(true);
                }, 600);
                     
            });

            // -------------------------------------------
            it('Once print done show the popup of success message', function() {
                
                $scope.$broadcast("UPDATE_WINDOW");

                expect($scope.isInvoiceStepFourActive).toBe(false);

                $timeout(function() {
                    expect($scope.isInvoiceStepFiveActive).toBe(true);
                }, 600);
                     
            });         

        });    
});
