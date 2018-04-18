describe('RVYearlyTaxReportDetailsController', function () {

    var $controller,
        $scope,
        $q,
        $rootScope,
        RVreportsSubSrv,

        revenueData = {
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
            var taxReportObj = {};

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _RVreportsSubSrv_, _$q_, _$rootScope_) {
                    $controller = _$controller_;
                    RVreportsSubSrv = _RVreportsSubSrv_;
                    $q = _$q_;
                    $rootScope = _$rootScope_;

                    $scope = _$rootScope_.$new();
                });


                $controller('RVYearlyTaxReportDetailsController', {
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
                    accountTypeId = 2;

                spyOn($scope, 'buildData');

                $scope.chosenReport = {};

                $scope.chosenReport.year = 2017;

                $scope.clickedGetRevenueAndTax(vatType, accountTypeId, isCollapsed);

                expect($scope.buildData).toHaveBeenCalledWith(vatType, accountTypeId);
               
            }); 
            // ============================================
            it('fetch account revenue Data if isCollapsed is false', function () {       
                
                var isCollapsed = false,
                    vatType = 'WITH_VAT_ID',
                    accountTypeId = 2;

                spyOn(RVreportsSubSrv, 'getRevenueAndTax').and.callFake(function () {
                    var deferred = $q.defer();

                    deferred.resolve(revenueData);
                    return deferred.promise;
                });

                $scope.chosenReport = {};

                $scope.chosenReport.year = 2017;

                $scope.results = results;

                $scope.clickedGetRevenueAndTax(vatType, accountTypeId, isCollapsed);

                 // Promise won't be resolved till $apply runs....
                $rootScope.$apply();

                expect($scope.results.with_vat_id.accounts[1].revenueData[0].ar_number).toBe(revenueData.data[0].ar_number);
               
            }); 

        });
 
       

    
});
