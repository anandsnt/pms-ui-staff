angular.module('sntRover')
.controller('RVYearlyTaxReportDetailsController', [
    '$scope',
    '$timeout',
    'RVreportsSubSrv',
    '$q',
    'sntActivity',
    'RVreportsSrv',    

    // eslint-disable-next-line max-params
    function (
        $scope,
        $timeout,
        RVreportsSubSrv,
        $q,
        sntActivity,
        reportsSrv
    ) {

        BaseCtrl.call(this, $scope);

        var promises = [],
            listeners = [],
            that = this;
        
        that.arrayToPromise = [];
        
        /*
         * Building data to queue promises
         * @vatType = vat type
         * @accountTypeId - CC/TA
         * isCollapsed - flag
         * isPrint - flag
         */
        $scope.buildPromiseArray = function(vatType, accountTypeId, isCollapsed, isPrint) {
            that.arrayToPromise.push({
                "accountVatType": vatType,
                "accountTypeId": accountTypeId,
                "isCollapsed": isCollapsed,
                "isPrint": isPrint
            });
        };

        /*
         * Handle the required API calls and update the DOM before doing print
         * After updating the DOM print screen
         */
        $scope.handlePrint = function() {
            that.arrayToPromise = [];
            $scope.isPrintClicked = true;
            $scope.yearlyTaxReportDataObject = {};
            sntActivity.start("PROMISE_INITIATED");

            if ($scope.chosenReport.with_vat_number) {
                $scope.yearlyTaxReportDataObject.withVatId = {};
                $scope.yearlyTaxReportDataObject.withVatId.Accounts = [];
                $scope.yearlyTaxReportDataObject.withVatId.isCollapsed = $scope.results.with_vat_id.isCollapsed;
                var dataIsCollapsedCompany = {
                        "isCollapsed": $scope.results.with_vat_id.accounts[0].isCollapsed
                    },
                    dataIsCollapsedTA = {
                        "isCollapsed": $scope.results.with_vat_id.accounts[1].isCollapsed
                    };

                $scope.yearlyTaxReportDataObject.withVatId.Accounts.push(dataIsCollapsedCompany);
                $scope.yearlyTaxReportDataObject.withVatId.Accounts.push(dataIsCollapsedTA);
                $scope.results.with_vat_id.isCollapsed = true;

                $scope.buildPromiseArray("WITH_VAT_ID", $scope.results.with_vat_id.accounts[0].account_type_id, false, true);
                $scope.buildPromiseArray("WITH_VAT_ID", $scope.results.with_vat_id.accounts[1].account_type_id, false, true);
               
            }
            if ($scope.chosenReport.without_vat_number) {
                $scope.yearlyTaxReportDataObject.withoutVatId = {};
                $scope.yearlyTaxReportDataObject.withoutVatId.Accounts = [];
                var dataIsCollapsedCompany = {
                        "isCollapsed": $scope.results.without_vat_id.accounts[0].isCollapsed
                    },
                    dataIsCollapsedTA = {
                        "isCollapsed": $scope.results.without_vat_id.accounts[1].isCollapsed
                    };

                $scope.yearlyTaxReportDataObject.withoutVatId.Accounts.push(dataIsCollapsedCompany);
                $scope.yearlyTaxReportDataObject.withoutVatId.Accounts.push(dataIsCollapsedTA);
                $scope.yearlyTaxReportDataObject.withoutVatId.isCollapsed = $scope.results.without_vat_id.isCollapsed;
                $scope.results.without_vat_id.isCollapsed = true;
                
                $scope.buildPromiseArray("WITHOUT_VAT_ID", $scope.results.without_vat_id.accounts[0].account_type_id, false, true);
                $scope.buildPromiseArray("WITHOUT_VAT_ID", $scope.results.without_vat_id.accounts[1].account_type_id, false, true);
            }
            
        };
        /*
         * Handle the required API calls and update the DOM before doing print
         * After updating the DOM print screen
         */
        listeners['clickedPrint'] = $scope.$on("FETCH_FULL_YEARLY_TAX_REPORT", function() {
            $scope.handlePrint();
        });
        /*
         * After print reset to initial state - when click on Cancel button
         */
        $scope.handlePrintCancel = function() {
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
        };
        /*
         * After print reset to initial state - when cli$state.curremt.name === '' && ck on Cancel button
         */
        listeners['clickedCancelPrint'] = $scope.$on("YEARLY_TAX_PRINT_COMPLETED", function() {
            $scope.handlePrintCancel();
        });               

        angular.forEach(listeners, function(listener) {
            $scope.$on('$destroy', listener);
        });

    }
]);
