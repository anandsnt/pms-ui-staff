angular.module('sntRover')
.controller('RVYearlyTaxReportDetailsController', [
    '$scope',
    '$timeout',
    'RVreportsSubSrv',

    // eslint-disable-next-line max-params
    function (
        $scope,
        $timeout,
        RVreportsSubSrv

    ) {
        /*
         * Handle the required API calls and update the DOM before doing print
         * After updating the DOM print screen
         */
        $scope.$on("FETCH_FULL_YEARLY_TAX_REPORT", function() {

            $scope.yearlyTaxReportDataObject = {};
            $scope.yearlyTaxReportDataObject.numberOfApiSuccessCount = 0;
            $scope.yearlyTaxReportDataObject.numberOfApiCallsNeeded = 0;

            if ($scope.chosenReport.with_vat_number) {
                $scope.yearlyTaxReportDataObject.numberOfApiCallsNeeded = 2;
                $scope.yearlyTaxReportDataObject.withVatId = {};
                $scope.yearlyTaxReportDataObject.withVatId.Accounts = [];
                $scope.yearlyTaxReportDataObject.withVatId.isCollapsed = $scope.results.with_vat_id.isCollapsed;
                var dataIsCollapsedCompany = {
                        "isCollapsed" : $scope.results.with_vat_id.accounts[0].isCollapsed
                    },
                    dataIsCollapsedTA = {
                        "isCollapsed" : $scope.results.with_vat_id.accounts[1].isCollapsed
                    }

                $scope.yearlyTaxReportDataObject.withVatId.Accounts.push(dataIsCollapsedCompany);
                $scope.yearlyTaxReportDataObject.withVatId.Accounts.push(dataIsCollapsedTA);
                
                $scope.results.with_vat_id.isCollapsed = true;
                $scope.getRevenueAndTax("WITH_VAT_ID", $scope.results.with_vat_id.accounts[0].account_type_id, false, true);
                $scope.getRevenueAndTax("WITH_VAT_ID", $scope.results.with_vat_id.accounts[1].account_type_id, false, true);            
            }
            if ($scope.chosenReport.without_vat_number) {
                $scope.yearlyTaxReportDataObject.numberOfApiCallsNeeded = $scope.yearlyTaxReportDataObject.numberOfApiCallsNeeded + 2;
                $scope.yearlyTaxReportDataObject.withoutVatId = {};
                $scope.yearlyTaxReportDataObject.withoutVatId.Accounts = [];
                var dataIsCollapsedCompany = {
                        "isCollapsed" : $scope.results.without_vat_id.accounts[0].isCollapsed
                    },
                    dataIsCollapsedTA = {
                        "isCollapsed" : $scope.results.without_vat_id.accounts[1].isCollapsed
                    }

                $scope.yearlyTaxReportDataObject.withoutVatId.Accounts.push(dataIsCollapsedCompany);
                $scope.yearlyTaxReportDataObject.withoutVatId.Accounts.push(dataIsCollapsedTA);
                $scope.yearlyTaxReportDataObject.withoutVatId.isCollapsed = $scope.results.without_vat_id.isCollapsed;
                
                $scope.results.without_vat_id.isCollapsed = true;
                $scope.getRevenueAndTax("WITHOUT_VAT_ID", $scope.results.without_vat_id.accounts[0].account_type_id, false, true);
                $scope.getRevenueAndTax("WITHOUT_VAT_ID", $scope.results.without_vat_id.accounts[1].account_type_id, false, true);
            }
        });
        /*
         * After print reset to initial state - when click on Cancel button
         */
        $scope.$on("YEARLY_TAX_PRINT_COMPLETED", function() {
            if ($scope.yearlyTaxReportDataObject.withVatId) {
                $scope.results.with_vat_id.isCollapsed = $scope.yearlyTaxReportDataObject.withVatId.isCollapsed;
                $scope.results.with_vat_id.accounts[0].isCollapsed = $scope.yearlyTaxReportDataObject.withVatId.Accounts[0].isCollapsed;
                $scope.results.with_vat_id.accounts[1].isCollapsed = $scope.yearlyTaxReportDataObject.withVatId.Accounts[1].isCollapsed;
            }

            if ($scope.yearlyTaxReportDataObject.withoutVatId) {
                $scope.results.without_vat_id.isCollapsed = $scope.yearlyTaxReportDataObject.withoutVatId.isCollapsed;
                $scope.results.without_vat_id.accounts[0].isCollapsed = $scope.yearlyTaxReportDataObject.withoutVatId.Accounts[0].isCollapsed;
                $scope.results.without_vat_id.accounts[1].isCollapsed = $scope.yearlyTaxReportDataObject.withoutVatId.Accounts[1].isCollapsed;
            }

            $scope.refreshScroll();
        });

        /*
        * Result with vat id collapsed or not
        */  
        $scope.setResultWithVatCollapsedOrNot = function () {
            $scope.results.with_vat_id.isCollapsed = !$scope.results.with_vat_id.isCollapsed;
        };
        /*
         * Result without vat id collapsed or not
         */
        $scope.setResultWithOutVatCollapsedOrNot = function () {
            $scope.results.without_vat_id.isCollapsed = !$scope.results.without_vat_id.isCollapsed;
        };

        /*
         * Function to build data
         * @vatType - vat type (with or without vat)
         * @accountTypeId - account type (company / travel agent)
         * @data - revenue data
         */
        var buildData = function(vatType, accountTypeId, data, isPrint) {
            var resultArrayToBeModified = (vatType === 'WITH_VAT_ID') ? $scope.results.with_vat_id.accounts : $scope.results.without_vat_id.accounts;
                
            _.each(resultArrayToBeModified, function(item) {
                if (item.account_type_id === accountTypeId) {
                    if (data) {
                        item.revenueData = data.data;
                    }     
                    if (isPrint) {
                        item.isCollapsed = true;
                    } else {
                        item.isCollapsed = !item.isCollapsed;
                    }        
                    
                }
            });
                
            $scope.refreshScroll();
        };

        /*
         * Function to get revenue data
         * @vatType - vat type (with or without vat)
         * @accountTypeId - account type (company / travel agent)
         * @data - revenue data
         */
        $scope.getRevenueAndTax = function(vatType, accountTypeId, isCollapsed, isPrint) {           

            var successCallBackOfGetRevenueAndTax = function (data) {
                    buildData(vatType, accountTypeId, data, isPrint);
                    $scope.yearlyTaxReportDataObject.numberOfApiSuccessCount++;
                    if ($scope.yearlyTaxReportDataObject.numberOfApiSuccessCount === $scope.yearlyTaxReportDataObject.numberOfApiCallsNeeded) {
                        $timeout(function() {
                            $scope.$emit("YEARLY_TAX_REPORT_PRINT");
                        }, 700)
                        
                    }
                },
                postParamsToPay = {
                    "year": $scope.chosenReport.year,
                    "with_vat_id": (vatType === 'WITH_VAT_ID'),
                    "account_type_id": accountTypeId
                },
                options = {
                    params: postParamsToPay,
                    successCallBack: successCallBackOfGetRevenueAndTax
                };

            if (!isCollapsed) {
                $scope.callAPI(RVreportsSubSrv.getRevenueAndTax, options);
            } else {
                buildData(vatType, accountTypeId);
            }           
        };

    }
]);
