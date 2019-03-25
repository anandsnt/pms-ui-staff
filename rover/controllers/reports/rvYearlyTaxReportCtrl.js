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
            $scope.getRevenueAndTax(that.arrayToPromise);
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
        $scope.buildData = function(vatType, accountTypeId, data, isPrint) {

            that.resultArrayToBeModified = (vatType === 'WITH_VAT_ID') ? $scope.results.with_vat_id.accounts : $scope.results.without_vat_id.accounts;
                
            _.each(that.resultArrayToBeModified, function(item) {

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
         * Function to set up the click action
         * @vatType - vat type (with or without vat)
         * @accountTypeId - account type (company / travel agent)
         * @data - revenue data
         */
        $scope.clickedGetRevenueAndTax = function(vatType, accountTypeId, isCollapsed, isPrint) {
            sntActivity.start("PROMISE_INITIATED");
            $scope.isPrintClicked = false;
            that.arrayToPromise = [];
            $scope.buildPromiseArray(vatType, accountTypeId, isCollapsed, isPrint);
            $scope.getRevenueAndTax(that.arrayToPromise);
        };

        /*
         * Function to get revenue data
         * @arrayToPromise
         */
        $scope.getRevenueAndTax = function(arrayToPromise) {  

            var successCallBackOfGetRevenueAndTax = function (data) {

                    $scope.buildData(data.accountVatType, data.accountTypeId, data, data.isPrint);
                };

                promises = [];

                angular.forEach(arrayToPromise, function(item) {

                    var postParamsToApi = {
                            "year": $scope.chosenReport.year,
                            "with_vat_id": (item.accountVatType === 'WITH_VAT_ID'),
                            "account_type_id": item.accountTypeId,
                            "country_ids": $scope.appliedFilter.country_ids
                        },
                        paramsToService = {
                            "postParamsToApi": postParamsToApi,
                            "accountVatType": item.accountVatType,
                            "isPrint": item.isPrint,
                            "accountTypeId": item.accountTypeId
                        };

                    if (!item.isCollapsed) {  
                        promises.push(RVreportsSubSrv.getRevenueAndTax(paramsToService).then(successCallBackOfGetRevenueAndTax));
                    } else {
                        $scope.buildData(item.accountVatType, item.accountTypeId);
                    }   
            });
            /*
             * Success callback of all promised
             */
            var successCallBackOfAllPromises = function() {
                sntActivity.stop("PROMISE_INITIATED");
                if ($scope.isPrintClicked) {
                     $timeout(function() {
                        $scope.$emit("YEARLY_TAX_REPORT_PRINT");
                    }, 700);
                }
            };

            $q.all(promises)
                .then(successCallBackOfAllPromises);
          
        };

        angular.forEach(listeners, function(listener) {
            $scope.$on('$destroy', listener);
        });

    }
]);
