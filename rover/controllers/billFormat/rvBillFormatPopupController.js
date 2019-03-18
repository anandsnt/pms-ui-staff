sntRover.controller('rvBillFormatPopupCtrl', ['$scope', '$rootScope', '$filter', 'RVBillCardSrv', 'RVContactInfoSrv', 'ngDialog', '$timeout', function($scope, $rootScope, $filter, RVBillCardSrv, RVContactInfoSrv, ngDialog, $timeout) {

    
    var delay = 200,
        delayScreen = 500;

    BaseCtrl.call(this, $scope);
    $scope.isCompanyCardInvoice = true;
    $scope.disableCompanyCardInvoice = false;
    $scope.hideCompanyCardInvoiceToggle = true;    
    $scope.billFormat.isInformationalInvoice = !$scope.shouldGenerateFinalInvoice && $scope.isSettledBill && $scope.reservationBillData.is_bill_lock_enabled;
    $scope.billFormat.isInformationalInvoiceDisabled = $scope.isSettledBill && $scope.reservationBillData.is_bill_lock_enabled; 
    /*
    *  Get the request params for bill settings info
    */
    var getBillSettingsInfoRequestParams = function() {
        var params = {};

        if ($scope.reservationBillData && $scope.reservationBillData.reservation_id) {
            params.id = $scope.reservationBillData.reservation_id;
            params.is_type = "Reservation";
        } else {
            $scope.hideCompanyCardInvoiceToggle = false;
            if ($scope.isFromInvoiceSearchScreen) {
                if ($scope.clickedInvoiceData.associated_item.company_card === null && $scope.clickedInvoiceData.associated_item.travel_agent_card === null) {
                    $scope.hideCompanyCardInvoiceToggle = true;
                } else if ($scope.clickedInvoiceData.associated_item.company_card === null && $scope.clickedInvoiceData.associated_item.travel_agent_card !== null) {
                    // Only TA card is attached.
                    $scope.isCompanyCardInvoice = false;
                    $scope.disableCompanyCardInvoice = true;
                } else if ($scope.clickedInvoiceData.associated_item.company_card !== null && $scope.clickedInvoiceData.associated_item.travel_agent_card === null) {
                    // Only Company card is attached.
                    $scope.disableCompanyCardInvoice = true;
                }
            } else if (!!$scope.groupConfigData) {
                params.id = $scope.groupConfigData.summary.group_id;
                params.is_group = true;
                params.is_type = "Account";
                handleGenerateToggleWidgetVisibility($scope.groupConfigData.summary);
            } else {
                params.id = $scope.accountConfigData.summary.posting_account_id;
                params.is_group = false;
                params.is_type = "Account";
                handleGenerateToggleWidgetVisibility($scope.accountConfigData.summary);
            }

        }
        params.bill_no = $scope.billNo;

        return params;

    };

    /*
     * To close dialog box
     */
    $scope.closeDialog = function() {                

        $rootScope.modalOpened = false;
        $timeout(function() {
            ngDialog.close();
        }, delay);
    };
    /**
     * handles Generate toggle visibilty
     * @return none
     */
    var handleGenerateToggleWidgetVisibility = function (card) {
            if ( !isEmpty(card.company.name) && !isEmpty(card.travel_agent.name)) {
                // Both cards are attached.
            }
            else if (isEmpty(card.company.name) && isEmpty(card.travel_agent.name)) {
                // Both cards are not attached.
                $scope.hideCompanyCardInvoiceToggle = true;
            }
            else if (!isEmpty(card.company.name) && isEmpty(card.travel_agent.name)) {
                // Only TA card is attached.
                $scope.isCompanyCardInvoice = true;
                $scope.disableCompanyCardInvoice = true;
            }
            else {
                $scope.isCompanyCardInvoice = false;
                // Only Company card is attached.
                $scope.disableCompanyCardInvoice = true;
            }

        },
        isEmpty = function( str ) {
            return (!str || 0 === str.length);
        };

    var successCallBackForLanguagesFetch = function(data) {
      $scope.$emit('hideLoader');
      if (data.languages) {
        data.languages = _.filter(data.languages, {
            is_show_on_guest_card: true
        });
      }
      $scope.languageData = data;
      $scope.data.locale = data.selected_language_code;
    };

    /**
     * Fetch the guest languages list and settings
     * @return {undefined}
     */
    var fetchGuestLanguages = function() {
      // call api
      $scope.invokeApi(RVContactInfoSrv.fetchGuestLanguages, {},
        successCallBackForLanguagesFetch);
    };

    /*
    *  Fetches the bill settings info for the guest/account bills
    */
    var fetchBillSettingsInfo = function() {
        var params = getBillSettingsInfoRequestParams();
        var onBillSettingsInfoFetchSuccess = function(response) {
            
            fetchGuestLanguages();
            /** CICO-38736
             *
             * The default_bill_settings in the response defaults to numeric 1, the value of which is a string otherwise
             * Hence, we cast the value as a string
             *
             */
            if (response.data && response.data.default_bill_settings) {
                response.data.default_bill_settings = response.data.default_bill_settings.toString();
            }

            $scope.data = response.data;
        };

        $scope.invokeApi(RVBillCardSrv.getBillSettingsInfo, params, onBillSettingsInfoFetchSuccess);
    };

    /*
    *  Get the request params for the email and print bill request
    */
    var getPrintEmailRequestParams = function() {
        var params = {};

        if ($scope.reservationBillData && $scope.reservationBillData.reservation_id) {
            params.reservation_id = $scope.reservationBillData.reservation_id;
        } else {
            if (!!$scope.groupConfigData) {
                params.group_id = $scope.groupConfigData.summary.group_id;
                params.is_group = true;
            } else {
                params.account_id = ($scope.isFromInvoiceSearchScreen) ? $scope.clickedInvoiceData.associated_item.item_id : $scope.accountConfigData.summary.posting_account_id;
                params.is_group = false;
            }
            params.type = $scope.isCompanyCardInvoice ? 'COMPANY' : 'TRAVELAGENT';

        }
        params.bill_number = $scope.billNo;
        params.locale = $scope.data.locale;
        $scope.$emit('hideLoader');
        return params;
    };

    /*
     *  Function which get invoked when the print btn from bill format popup is clicked
     */
    $scope.printBill = function() {
        var printRequest = getPrintEmailRequestParams();
        
        $scope.$emit("UPDATE_INFORMATIONAL_INVOICE", $scope.billFormat.isInformationalInvoice);
        printRequest.bill_layout = $scope.data.default_bill_settings;
        printRequest.is_informational_invoice = $scope.billFormat.isInformationalInvoice;
        $scope.clickedPrint(printRequest);
    };
    
    /*
     * click action Continue button
     * 
     */
    $scope.clickedContinueButtonPrintOrEmail = function() {
        if ($scope.isClickedPrint) {
            $scope.printBill();
        } else {
            $scope.sendEmail();
        }
    };
    /*
     * click action Print button
     * show proceed popup - if infrasec enabled
     */
    $scope.clickedPrintBill = function() {
        if ($scope.shouldGenerateFinalInvoice && !$scope.billFormat.isInformationalInvoice) {
            $scope.isClickedPrint = true;
            $scope.isInvoiceStepThreeActive = false;
        
            $timeout(function() {
                $scope.isInvoiceStepFourActive = true;
            }, delayScreen);
        } else {
            $scope.printBill();
        }
    };

    $scope.sendEmail = function() {
        var emailRequest = getPrintEmailRequestParams();

        emailRequest.bill_layout = $scope.data.default_bill_settings;
        emailRequest.to_address = $scope.data.to_address;
        emailRequest.is_informational_invoice = $scope.billFormat.isInformationalInvoice;
        $scope.clickedEmail(emailRequest);
    };
    
    /*
    *  Function which get invoked when the email btn from bill format popup is clicked
    */
    $scope.emailBill = function() {

        if ($scope.shouldGenerateFinalInvoice && !$scope.billFormat.isInformationalInvoice) {
            $scope.isClickedPrint = false;
            $scope.isInvoiceStepThreeActive = false;
        
            $timeout(function() {
                $scope.isInvoiceStepFourActive = true;
            }, delayScreen);
        } else {
            $scope.sendEmail();            
        }
    };
    /*
     * Clicked final invoice button - initial popup
     */
    $scope.clickedFinalInvoiceButton = function() {
        $scope.isInvoiceStepOneActive = false;
        $timeout(function() {
            $scope.isInvoiceStepTwoActive  = true;
        }, delayScreen);
        
    };
    /*
     * Clicked Proceed button
     */
    $scope.clickedProceedButton = function() {
        $scope.isInvoiceStepTwoActive = false;
        $scope.isInvoiceStepFourActive = false;
        
        $timeout(function() {
            $scope.isInvoiceStepThreeActive = true;
        }, delayScreen);
    };
    /*
     * Clicked cancel button of proceed screen
     */
    $scope.clickedCancelButtonProceedScreen = function() {
        $scope.isInvoiceStepTwoActive = false;
        
        $timeout(function() {
            $scope.isInvoiceStepOneActive = true;
        }, delayScreen);
    };
    
    /*
     * Once print done show the popup of success message
     */
    var updateWindow = $scope.$on("UPDATE_WINDOW", function() {
        $scope.isInvoiceStepFourActive = false;

        $timeout(function() {
            $scope.isInvoiceStepFiveActive = true;
        }, delayScreen);
    });

    /*
     * Function to get print button class
     */
    $scope.getPrintButtonClass = function() {

        var printButtonClass = "blue";

        if (!$scope.billFormat.isInformationalInvoice && (parseInt($scope.reservationBillData.bills[$scope.currentActiveBill].print_counter, 10) >= parseInt($scope.reservationBillData.no_of_original_invoices, 10) && $scope.roverObj.noReprintReEmailInvoice && parseInt($scope.reservationBillData.no_of_original_invoices, 10) !== 0)) {

            printButtonClass = "grey";
        }
        
        return printButtonClass;
    };
    /*
     * Function to get print button class
     */
    $scope.isPrintButtonDisabled = function() {

        var isPrintButtonDisabled = false;

        if (!$scope.billFormat.isInformationalInvoice && (parseInt($scope.reservationBillData.bills[$scope.currentActiveBill].print_counter, 10) >= parseInt($scope.reservationBillData.no_of_original_invoices, 10) && $scope.roverObj.noReprintReEmailInvoice && parseInt($scope.reservationBillData.no_of_original_invoices, 10) !== 0)) {   
            isPrintButtonDisabled = true;
        }
        return isPrintButtonDisabled;
    };

    /*
     * Function to get email button class
     */
    $scope.getEmailButtonClass = function() {

        var emailButtonClass = "blue";

        if (!$scope.data.to_address) {
            emailButtonClass = "grey";
        } else if (!$scope.billFormat.isInformationalInvoice && (parseInt($scope.reservationBillData.bills[$scope.currentActiveBill].email_counter, 10) >= parseInt($scope.reservationBillData.no_of_original_emails, 10) && $scope.roverObj.noReprintReEmailInvoice && parseInt($scope.reservationBillData.no_of_original_invoices, 10) !== 0)) {
            emailButtonClass = "grey";
        }
        return emailButtonClass;
    };
    /*
     * Function to get email button disabled or not
     */
    $scope.isEmailButtonDisabled = function() {

        var isEmailButtonDisabled = false;

        if (!$scope.data.to_address) {
            isEmailButtonDisabled = true;
        } else if (!$scope.billFormat.isInformationalInvoice && (parseInt($scope.reservationBillData.bills[$scope.currentActiveBill].email_counter, 10) >= parseInt($scope.reservationBillData.no_of_original_emails, 10) && $scope.roverObj.noReprintReEmailInvoice && parseInt($scope.reservationBillData.no_of_original_invoices, 10) !== 0)) {

            isEmailButtonDisabled = true;
        }
        return isEmailButtonDisabled;
    };

    $scope.clickedInformationalButton = function() {
        $scope.billFormat.isInformationalInvoice = true;
        $scope.isInvoiceStepOneActive = false;
        
        $timeout(function() {
            $scope.isInvoiceStepThreeActive = true;            
        }, delayScreen);
    };

    /*
    *  Initialize the controller
    */
    var init = function() {
        $scope.data = {};
        fetchBillSettingsInfo();
    };
    // Toggle on COMPANY/TA-CARD invoice generation tab.

    $scope.changeCompanyCardInvoiceToggle = function() {
        $scope.isCompanyCardInvoice = !$scope.isCompanyCardInvoice;
    };
    $scope.$on('$destroy', updateWindow);

    init();

}]);
