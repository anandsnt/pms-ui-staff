describe('RVYearlyTaxReportDetailsController', function () {

    var $controller,
        $scope,
        $q,
        $rootScope,
        RVreportsSubSrv,
        yearlyTaxReportDetailsCtrl,

        revenueData = {
                "accountVatType": "WITH_VAT_ID",
                "accountTypeId": 2,
                "isPrint": false,
                "data": [{"vat_id": null,
                     "ar_number": "67676767",
                    "name": "Stayntouch DO NOT UPDATE",
                    "revenue": 271.0, 
                    "vat": 21.0}]
                },
        results = {
            "with_vat_id": {
                "accounts": [{
                    "account_type": "COMPANY",
                    "account_type_id": 1,
                    "total_revenue": "0.00",
                    "total_vat": "0.00",
                    "accounts_list": []
                }, {
                    "account_type": "TRAVELAGENT",
                    "account_type_id": 2,
                    "total_revenue": "0.00",
                    "total_vat": "0.00",
                    "accounts_list": []
                }],
                "total_revenue": "0.00",
                "total_vat": "0.00"
            },
            "without_vat_id": {
                "accounts": [{
                    "account_type": "COMPANY",
                    "account_type_id": 1,
                    "total_revenue": "16913.82",
                    "total_vat": "1717.84",
                    "accounts_list": []
                }, {
                    "account_type": "TRAVELAGENT",
                    "account_type_id": 2,
                    "total_revenue": "2177.52",
                    "total_vat": "338.31",
                    "accounts_list": []
                }],
                "total_revenue": "19091.34",
                "total_vat": "2056.15"
            }
        };

        describe('variable initalizations', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _RVreportsSubSrv_, _$q_, _$rootScope_) {
                    $controller = _$controller_;
                    RVreportsSubSrv = _RVreportsSubSrv_;
                    $q = _$q_;
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

            // ============================
            it("buildData method should build correct data", function() {
                
                $scope.results = results;
                $scope.buildData("WITH_VAT_ID", 2, revenueData, true);
                expect(yearlyTaxReportDetailsCtrl.resultArrayToBeModified[1].revenueData[0].ar_number).toBe(revenueData.data[0].ar_number);
            });

        });    
});
