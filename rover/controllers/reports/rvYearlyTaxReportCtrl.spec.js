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
             // ============================================
            it('call buildData method if isCollapsed is true', function () {       

                var isCollapsed = true,
                    vatType = 'WITH_VAT_ID',
                    accountTypeId = 2,
                    isPrint = false;

                spyOn($scope, 'buildPromiseArray');

                $scope.chosenReport = {};

                $scope.chosenReport.year = 2017;

                $scope.clickedGetRevenueAndTax(vatType, accountTypeId, isCollapsed, isPrint);

                expect($scope.buildPromiseArray).toHaveBeenCalledWith(vatType, accountTypeId, isCollapsed, isPrint);
               
            }); 
            // ============================================
            it('fetch account revenue Data if isCollapsed is false', function () {       
                
                var promiseData = [{
                    "accountTypeId": 2,
                    "accountVatType": "WITH_VAT_ID",
                    "isCollapsed": false,
                    "isPrint": false,
                    "country_ids": [2,12]
                }];

                spyOn(RVreportsSubSrv, 'getRevenueAndTax').and.callFake(function () {
                    var deferred = $q.defer();

                    deferred.resolve(revenueData);
                    return deferred.promise;
                });

                $scope.chosenReport = {};

                $scope.chosenReport.year = 2017;

                $scope.results = results;

                $scope.getRevenueAndTax(promiseData);

                 // Promise won't be resolved till $apply runs....
                $rootScope.$apply();

                expect($scope.results.with_vat_id.accounts[1].revenueData[0].ar_number).toBe(revenueData.data[0].ar_number);
               
            }); 
            // =============================================

            it('toggle the isCollapsed flag', function () {
                $scope.results = {};
                $scope.results.without_vat_id = {};
                $scope.results.without_vat_id.isCollapsed = true;

                $scope.setResultWithOutVatCollapsedOrNot();

                expect($scope.results.without_vat_id.isCollapsed).toBe(false);

            });
            // ==========================
            it('toggle the isCollapsed flag', function () {
                $scope.results = {};
                $scope.results.with_vat_id = {};
                $scope.results.with_vat_id.isCollapsed = true;

                $scope.setResultWithVatCollapsedOrNot();

                expect($scope.results.with_vat_id.isCollapsed).toBe(false);

            });
            // ============================
            it('print method invoke with the required Data', function() {                

                var arrayToPromiseSample = [{
                    "accountVatType": "WITH_VAT_ID",
                    "accountTypeId": 1,
                    "isCollapsed": false,
                    "isPrint": true
                }, {
                    "accountVatType": "WITH_VAT_ID",
                    "accountTypeId": 2,
                    "isCollapsed": false,
                    "isPrint": true
                }, {
                    "accountVatType": "WITHOUT_VAT_ID",
                    "accountTypeId": 1,
                    "isCollapsed": false,
                    "isPrint": true
                }, {
                    "accountVatType": "WITHOUT_VAT_ID",
                    "accountTypeId": 2,
                    "isCollapsed": false,
                    "isPrint": true
                }];

                $scope.chosenReport = {
                    "with_vat_number": true,
                    "without_vat_number": true
                };

                spyOn($scope, 'getRevenueAndTax');

                $scope.results = results;

                $scope.handlePrint();

                expect($scope.getRevenueAndTax).toHaveBeenCalledWith(arrayToPromiseSample);

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
