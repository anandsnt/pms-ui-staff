describe('RVYearlyTaxReportDetailsController', function () {

    var $controller,
        $scope,
        yearlyTaxReportDetailsCtrl,
        $rootScope;       

        describe('variable initalizations', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _RVreportsSubSrv_, _$q_, _$rootScope_) {
                    $controller = _$controller_;

                    $rootScope = _$rootScope_;

                    $scope = _$rootScope_.$new();
                    $scope.appliedFilter = {};
                    $scope.appliedFilter.country_ids = [2, 22];
                });


                yearlyTaxReportDetailsCtrl = $controller('RVYearlyTaxReportDetailsController', {
                    $scope: $scope
                });

                angular.extend($scope, {
                    'refreshScroll': function() {
                        return true;
                    }
                });

            }); 
           
            
            // ============================
            it("buildPromiseArray method should build correct data", function() {

                $scope.buildPromiseArray("WITH_VAT_ID", 2, false, true);

                var arrayToPromiseToBe = [
                    {
                        "accountVatType": "WITH_VAT_ID",
                        "accountTypeId": 2,
                        "isCollapsed": false,
                        "isPrint": true
                    }
                ];

                expect(yearlyTaxReportDetailsCtrl.arrayToPromise[0].accountVatType).toBe(arrayToPromiseToBe[0].accountVatType);
            });
        });    
});
