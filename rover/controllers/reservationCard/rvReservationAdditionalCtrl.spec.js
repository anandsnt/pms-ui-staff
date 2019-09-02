describe('rvReservationAdditionalController', function () {

    var $controller,
        $scope,
        $q,
        RVReservationSummarySrv;
        
        describe('variable initalizations', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _RVReservationSummarySrv_, _$q_, _$rootScope_) {
                    $controller = _$controller_;
                    RVReservationSummarySrv = _RVReservationSummarySrv_;
                    $q = _$q_;
                    $scope = _$rootScope_.$new();
                    $scope.reservationParentData = {};

                    $scope.reservationParentData.demographics = {};
                    $scope.reservationParentData.demographics.segment = true;

                    $scope.reservationData = {};
                    $scope.reservationData.reservation_card = {};
                    $scope.reservationData.reservation_card.tax_exempt = true;
                    $scope.reservationData.reservation_card.tax_exempt_type = {};
                    $scope.reservationData.reservation_card.tax_exempt_type.id = 5;
                 
                });


                $controller('rvReservationAdditionalController', {
                    $scope: $scope
                });

                angular.extend($scope, {
                    'refreshScroll': function() {
                        return true;
                    }
                });

            }); 
             // ============================================
            it('call update tax exempt method if tax exempt enabled', function () {                 
                spyOn($scope, 'updateTaxExemptData');


                $scope.additionalDetails = {};

                $scope.additionalDetails.isTaxExemptEnabled = true;   

                $scope.toggleTaxExempt();

                expect($scope.updateTaxExemptData).toHaveBeenCalled();
                expect($scope.additionalDetails.isTaxExemptEnabled).toBe(false);               
            }); 
            
            // =======================
            it('save tax exempt to have deen called', function() {

                spyOn(RVReservationSummarySrv, "saveTaxExempt").and.callFake(function() {
                    var deferred = $q.defer();

                    deferred.resolve();
                    return deferred.promise;
                });

                $scope.additionalDetails = {};
                $scope.reservationParentData.reservationId = 14578;
                $scope.additionalDetails.isTaxExemptEnabled = true;
                $scope.additionalDetails.taxExemptType = 12;                

                $scope.updateTaxExemptData();

                expect(RVReservationSummarySrv.saveTaxExempt).toHaveBeenCalled();
                
            });

            // =======================
            it('save tax exempt to have deen called and the values set when tax exempt not enabled', function() {

                spyOn(RVReservationSummarySrv, "saveTaxExempt").and.callFake(function() {
                    var deferred = $q.defer();

                    deferred.resolve();
                    return deferred.promise;
                });

                $scope.additionalDetails = {};
                $scope.reservationParentData.reservationId = 14578;
                $scope.additionalDetails.isTaxExemptEnabled = false;     

                $scope.updateTaxExemptData();

                expect(RVReservationSummarySrv.saveTaxExempt).toHaveBeenCalled();
                expect($scope.additionalDetails.taxExemptRefText).toBe("");
            });
        });    
});
