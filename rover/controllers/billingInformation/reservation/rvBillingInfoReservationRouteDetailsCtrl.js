sntRover.controller('rvBillingInfoReservationRouteDetailsCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'RVGuestCardSrv', 'ngDialog', 'RVBillCardSrv', 'RVPaymentSrv', 'rvPermissionSrv', function($scope, $rootScope,$filter, RVBillinginfoSrv, RVGuestCardSrv, ngDialog, RVBillCardSrv, RVPaymentSrv, rvPermissionSrv){

    BaseCtrl.call(this, $scope);

    var init = function() {
        $scope.first_bill_id            = "";
        $scope.chargeCodeToAdd          = "";
        $scope.showPayment              = false;
        $scope.isAddPayment             = false;
        $scope.showChargeCodes          = false;
        $scope.isBillingGroup           = true;
        $scope.showCreditCardDropDown   = false;
        $scope.isShownExistingCCPayment = false;
        $scope.sixIsManual              = false;
        $scope.swipedCardDataToSave     = {};

        //Set credit limit to two digits.
        if ($scope.selectedEntity.credit_limit) {
            $scope.selectedEntity.credit_limit = parseFloat($scope.selectedEntity.credit_limit).toFixed(2);
        }

        setCreditCardDetails();
        setCommonPaymentModelItems();
        initializeScrollers();
        fetchBillsForReservation();
    };

    var setCreditCardDetails = function() {

        if ($scope.selectedEntity.credit_card_details !== null && 
            $scope.selectedEntity.credit_card_details !== undefined && 
            $scope.selectedEntity.credit_card_details.hasOwnProperty('payment_type_description')) {

            $scope.renderAddedPayment                = $scope.selectedEntity.credit_card_details;
            $scope.renderAddedPayment.cardExpiry     = $scope.selectedEntity.credit_card_details.card_expiry;
            $scope.renderAddedPayment.endingWith     = $scope.selectedEntity.credit_card_details.card_number;
            $scope.renderAddedPayment.creditCardType = $scope.selectedEntity.credit_card_details.card_code;

            $scope.showPayment              = true;
            $scope.showCreditCardDropDown   = false;
            $scope.isShownExistingCCPayment = true;

            setTimeout(function(){
                $scope.$broadcast('UPDATE_FLAG');
            }, 1000);
        }
    };

    var setCommonPaymentModelItems = function() {
        $scope.passData         = {};
        $scope.passData.details = {};

        if (typeof $scope.guestCardData === 'undefined' || 
            typeof $scope.guestCardData.contactInfo === 'undefined') {

            $scope.passData.details.firstName = '';
            $scope.passData.details.lastName  = '';
        }
        else {
            $scope.passData.details.firstName = $scope.guestCardData.contactInfo.first_name;
            $scope.passData.details.lastName  = $scope.guestCardData.contactInfo.last_name;
        }
        $scope.setScroller('cardsList');
    };
    
    var initializeScrollers = function() {
        var scrollerOptions = { preventDefault: false};
        $scope.setScroller('paymentList', scrollerOptions);
        $scope.setScroller('billingGroups', scrollerOptions);
        $scope.setScroller('chargeCodes', scrollerOptions);
        $scope.setScroller('routeDetails', scrollerOptions);

        var scrollerOptionsForSearch = {click: true};
        $scope.setScroller('chargeCodesList',scrollerOptionsForSearch);

        $scope.chargeCodesListDivHgt = 250;
        $scope.chargeCodesListDivTop = 0;

        setTimeout(function() {
            $scope.refreshScroller('paymentList');
            $scope.refreshScroller('billingGroups');
            $scope.refreshScroller('chargeCodes');
            $scope.refreshScroller('chargeCodesList');
            $scope.refreshScroller('routeDetails');
        }, 500);
    };

    $scope.editPaymentMethod = function() {
        $scope.oldPayment         = $scope.renderAddedPayment;
        $scope.renderAddedPayment = null;
        isAddPayment              = false;
    };

    /**
    * Function to show the payment list on cancelling or adding new payment
    * @return {undefined}
    */
    $scope.showPaymentList = function() {
        $scope.isAddPayment = false;
        $scope.refreshScroller('paymentList');
    };

    $scope.$on("CANCELLED_PAYMENT", function() {
        $scope.renderAddedPayment = $scope.oldPayment;
    });

    /**
    * Retrieve card expiry based on paymnet gateway
    * @return {DateObject}
    */
    var retrieveExpiryDate = function() {
        var expiryDate = $scope.cardData.tokenDetails.isSixPayment?
                         $scope.cardData.tokenDetails.expiry.substring(2, 4)+" / "+$scope.cardData.tokenDetails.expiry.substring(0, 2):
                         $scope.cardData.cardDetails.expiryMonth+" / "+$scope.cardData.cardDetails.expiryYear;
        return expiryDate;
    };

    /**
    * Retrieve card number based on paymnet gateway
    * @return {Number} [credit card number]
    */
    var retrieveCardNumber = function() {
        var cardNumber = $scope.cardData.tokenDetails.isSixPayment?
                         $scope.cardData.tokenDetails.token_no.substr($scope.cardData.tokenDetails.token_no.length - 4):
                         $scope.cardData.cardDetails.cardNumber.slice(-4);
        return cardNumber;
    };

    var retrieveCardName = function() {
        var cardName = (!$scope.cardData.tokenDetails.isSixPayment)?
                       $scope.cardData.cardDetails.userName:
                       ($scope.passData.details.firstName + " " + $scope.passData.details.lastName);
        return cardName;
    };

    var retrieveCardExpiryForApi =  function() {
        var expiryMonth = $scope.cardData.tokenDetails.isSixPayment ? 
                          $scope.cardData.tokenDetails.expiry.substring(2, 4) :
                          $scope.cardData.cardDetails.expiryMonth;
        var expiryYear  = $scope.cardData.tokenDetails.isSixPayment ? 
                          $scope.cardData.tokenDetails.expiry.substring(0, 2) :
                          $scope.cardData.cardDetails.expiryYear;
        var expiryDate  = (expiryMonth && expiryYear )? ("20"+expiryYear+"-"+expiryMonth+"-01"):"";
        return expiryDate;
    };

    /**
    * Function to show the newly added payment
    * @param {Object} [credit card details]
    * @return {undefined}
    */
    $scope.paymentAdded = function(data) {
        $scope.selectedEntity.selected_payment = "";
        $scope.cardData = data;
        $scope.renderAddedPayment = {};
        $scope.renderAddedPayment.payment_type = "CC";
        $scope.isAddPayment = false;
        $scope.showPayment  = true;

        $scope.renderAddedPayment.creditCardType = (!$scope.cardData.tokenDetails.isSixPayment)?
                                                   getCreditCardType($scope.cardData.cardDetails.cardType).toLowerCase() :
                                                   getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();
        $scope.renderAddedPayment.cardExpiry = retrieveExpiryDate();
        $scope.renderAddedPayment.endingWith = retrieveCardNumber();
    };

    $scope.paymentAddedThroughMLISwipe = function(swipedCardDataToSave) {
        $scope.renderAddedPayment = {};
        $scope.renderAddedPayment.payment_type = "CC";
        $scope.swipedCardDataToSave = swipedCardDataToSave;
        $scope.renderAddedPayment.creditCardType = swipedCardDataToSave.cardType.toLowerCase();
        $scope.renderAddedPayment.cardExpiry = swipedCardDataToSave.cardExpiryMonth+"/"+swipedCardDataToSave.cardExpiryYear;
        $scope.renderAddedPayment.endingWith = swipedCardDataToSave.cardNumber.slice(-4);
    };

    /**
    * Function to show the add payment view
    * @return {undefined}
    */
    $scope.showAddPayment = function() {
        if (!$rootScope.isManualCCEntryEnabled) {
            $scope.isManualCCEntryEnabled = false;
            var dialog = ngDialog.open({
                template   : '/assets/partials/payment/rvPaymentModal.html',
                controller : '',
                scope      : $scope
            });
            return;
        }

        $scope.renderAddedPayment = {
            creditCardType : "",
            cardExpiry     : "",
            endingWith     : "",
            payment_type   : ""
        };

        $scope.isAddPayment             = true;
        $scope.showCreditCardDropDown   = true;
        $scope.isShownExistingCCPayment = false;

        $scope.$broadcast('showaddpayment');
        $scope.refreshScroller('routeDetails');
    };

    $scope.$on("SHOW_SWIPED_DATA_ON_BILLING_SCREEN", function(e, swipedCardDataToRender) {
        $scope.isAddPayment = true;
        $scope.$broadcast('showaddpayment');

        setTimeout(function() {
            $scope.saveData.payment_type  = "CC";
            $scope.showCreditCardDropDown = true;
            $scope.swippedCard            = true;
            $scope.$broadcast('RENDER_DATA_ON_BILLING_SCREEN', swipedCardDataToRender);
            $scope.$digest();
        }, 2000);
    });

    /**
    * Listener to track the ngDialog open event.
    * We save the id for the ngDialog to close nested dialog for 
    * disabling manual payment addition.
    */
    $scope.$on("ngDialog.opened", function(event, data) {
        $scope.ngDialogID =  data[0].id;
    });

    $scope.closeDialog = function() {
        ngDialog.close($scope.ngDialogID);
    };

    /**
    * Function to fetch available charge code from the server
    * @return {undefined}
    */
    var fetchAvailableChargeCodes = function() {

        var successCallback = function(data) {
            $scope.availableChargeCodes = data;
            fetchAvailableBillingGroups();
        };

        var errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        var data = {};
        data.id = $scope.reservationData.reservation_id;

        if ($scope.reservationData.reservation_id !== $scope.selectedEntity.id && 
            $scope.selectedEntity.entity_type === 'RESERVATION') {

            data.to_bill = $scope.first_bill_id;
        }
        else {
            data.to_bill = $scope.selectedEntity.to_bill;
        }

        data.is_new = $scope.selectedEntity.is_new;

        //CICO-22444 - Added inorder to allow the same charge codes for different date range
        data.from_date = $filter('date')(tzIndependentDate($scope.routeDates.from), "yyyy-MM-dd");
        data.to_date = $filter('date')(tzIndependentDate($scope.routeDates.to), "yyyy-MM-dd");

        $scope.invokeApi(RVBillinginfoSrv.fetchAvailableChargeCodes, data, successCallback, errorCallback);
    };

    /**
    * Function to fetch available billing groups from the server
    * @return {undefined}
    */
    var fetchAvailableBillingGroups = function() {

        var successCallback = function(data) {
            $scope.availableBillingGroups = data;
            if (data.length === 0) {
                $scope.isBillingGroup = false;
            }
            if ($scope.selectedEntity.entity_type === "ALLOTMENT" || 
                $scope.selectedEntity.entity_type === 'GROUP' || 
                $scope.selectedEntity.entity_type === 'HOUSE') {

                $scope.showPayment = false;
                $scope.$parent.$emit('hideLoader');
            }
            else if ($scope.reservationData.reservation_id !== $scope.selectedEntity.id && 
                $scope.selectedEntity.entity_type === 'RESERVATION') {

                $scope.$parent.$emit('hideLoader');
            }
            else if ($scope.reservationData.reservation_id !== $scope.selectedEntity.id && 
                $scope.selectedEntity.entity_type !== 'RESERVATION') {

                $scope.showPayment = true;
                $scope.attachedPaymentTypes = [];
                $scope.$parent.$emit('hideLoader');
            }
            else if ($scope.selectedEntity.has_accompanying_guests) {
                $scope.showPayment = true;
                $scope.$parent.$emit('hideLoader');
            }
            else {
                $scope.showPayment = true;
                fetchAttachedPaymentTypes();
            }
        };

        var errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        var data = {};
        data.id = $scope.reservationData.reservation_id;

        if ($scope.reservationData.reservation_id !== $scope.selectedEntity.id && 
            $scope.selectedEntity.entity_type === 'RESERVATION') {

            data.to_bill = $scope.first_bill_id;
        }
        else {
            data.to_bill = $scope.selectedEntity.to_bill;
        }

        data.is_new = $scope.selectedEntity.is_new;

        //CICO-22444 - Added inorder to allow the same charge codes for different date range
        data.from_date = $filter('date')(tzIndependentDate($scope.routeDates.from), "yyyy-MM-dd");
        data.to_date = $filter('date')(tzIndependentDate($scope.routeDates.to), "yyyy-MM-dd");

        $scope.invokeApi(RVBillinginfoSrv.fetchAvailableBillingGroups, data, successCallback, errorCallback);
    };

    /**
    * Function to fetch attached payment types from the server
    * @return {undefined}
    */
    var fetchAttachedPaymentTypes = function() {

        var successCallback = function(data) {
            $scope.attachedPaymentTypes = data;
            $scope.$parent.$emit('hideLoader');
        };

        var errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        $scope.invokeApi(RVGuestCardSrv.fetchGuestPaymentData, $scope.reservationData.user_id, successCallback, errorCallback);
    };

    /**
    * Function to exclude bills for already existing routings
    * @param {Object}
    * @return {Object}
    */
    var excludeExistingBills = function(bills) {
       for (var i = 0; i < $scope.routes.length; i++) {
            for (var j = 0; j < bills.length; j++) {
                if (bills[j].id === $scope.routes[i].to_bill && 
                    $scope.selectedEntity.id !== $scope.routes[i].id) {

                    bills.splice(j, 1);
                    break;
                }
            }
        }
       return bills;
    };

    /**
    * Function to fetch available bills for the reservation from the server
    * @return {undefined}
    */
    var fetchBillsForReservation = function() {

        var successCallback = function(data) {
            $scope.bills = [];
            $scope.$parent.bills = [];

            $scope.first_bill_id = typeof data[0] !== "undefined"? data[0].id: "";
            var firstBillId      = typeof data[0] !== "undefined"? data[0].id: "";
            $scope.newBillNumber = data.length + 1;

            if (typeof $scope.reservationData !== "undefined" && 
                $scope.reservationData.reservation_id !== $scope.selectedEntity.id && 
                $scope.selectedEntity.entity_type === 'RESERVATION') {

                $scope.bills.push(data[0]);
                $scope.bills = excludeExistingBills($scope.bills);
                $scope.$parent.bills = $scope.bills;
            } 
            else {
                data.splice(0, 1);
                $scope.bills = excludeExistingBills(data);
                if ($scope.newBillNumber <= 10) {
                    var newBill         = {};
                    newBill.id          = 'new';
                    newBill.bill_number = '' + $scope.newBillNumber + '(new)';
                    $scope.bills.push(newBill);
                }
                $scope.$parent.bills = $scope.bills;
            }
            $scope.selectedEntity.to_bill = $scope.selectedEntity.is_new? $scope.bills[0].id: 
                                            $scope.selectedEntity.to_bill;

            //default to last item when there is no bill no.
            var billNo = $scope.selectedEntity.bill_no;

            if ($scope.selectedEntity.entity_type === 'ALLOTMENT' || 
                $scope.selectedEntity.entity_type === 'GROUP' || 
                $scope.selectedEntity.entity_type === 'HOUSE') {

                $scope.selectedEntity.to_bill = firstBillId;
            }
            else if (billNo === "") {
                $scope.selectedEntity.to_bill =  _.last($scope.bills).id;
            }
            else {
                $scope.selectedEntity.to_bill = $scope.selectedEntity.to_bill;
            }
            fetchAvailableChargeCodes();
        };

        var errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        var id = typeof $scope.reservationData !== "undefined"? 
                 $scope.reservationData.reservation_id: "";
        var entity_type = "";

        if ($scope.selectedEntity.entity_type === 'ALLOTMENT' || 
            $scope.selectedEntity.entity_type === 'GROUP' || 
            $scope.selectedEntity.entity_type ==='HOUSE') {

            id = $scope.selectedEntity.id;
            entity_type = $scope.selectedEntity.entity_type;
        }
        else if ($scope.selectedEntity.entity_type === 'RESERVATION') {
            id = $scope.selectedEntity.id;
        }

        var sendData = { "id" : id , "entity_type" : entity_type };
        $scope.invokeApi(RVBillinginfoSrv.fetchBillsForReservation, sendData, successCallback, errorCallback);
    };

    $scope.escapeNull = function(value, replaceWith) {
        return escapeNull(value, replaceWith);
    };

    /**
    * Listener for the save button click
    */
    $scope.$on('routeSaveClicked', function(event) {
        $scope.saveRoute();
    });

    /**
    * Function to update the company and travel agent in stay card header
    * @return {undefined}
    */
    var updateCardInfo = function() {
        if (($scope.selectedEntity.entity_type === 'COMPANY_CARD' && 
            (typeof $scope.reservationDetails.companyCard.id === 'undefined'|| 
            $scope.reservationDetails.companyCard.id === '')) ||
            ($scope.selectedEntity.entity_type === 'TRAVEL_AGENT' && 
            ($scope.reservationDetails.travelAgent.id === 'undefined' || 
            $scope.reservationDetails.travelAgent.id === ''))) {

            $rootScope.$broadcast('CardInfoUpdated', $scope.selectedEntity.id, $scope.selectedEntity.entity_type);
        }
    };

    /**
    * Function to save the new route
    * @return {undefined}
    */
    $scope.saveRoute = function() {

        if ($scope.selectedEntity.attached_charge_codes.length === 0 && 
            $scope.selectedEntity.attached_billing_groups.length === 0) {

            $scope.$emit('displayErrorMessage', [$filter('translate')('ERROR_CHARGES_EMPTY')]);
            return;
        }

        $scope.selectedEntity.reservation_id = $scope.reservationData.reservation_id;
        $scope.selectedEntity.from_date      = $filter('date')(tzIndependentDate($scope.routeDates.from), "yyyy-MM-dd");
        $scope.selectedEntity.to_date        = $filter('date')(tzIndependentDate($scope.routeDates.to), "yyyy-MM-dd");

        /*
        * If user selects the new bill option,
        * we'll first create the bill and then save the route for that bill
        */
        if ($scope.selectedEntity.to_bill === 'new') {
            $scope.createNewBill();
        }
        else if ($scope.saveData.payment_type !== null && 
            $scope.saveData.payment_type !== "" && !$scope.isShownExistingCCPayment) {

            $scope.savePayment();
        }
        else {
            saveRouteAPICall();
        }
    };

    var saveRouteAPICall = function() {

        $scope.saveSuccessCallback = function(data) {
            $scope.$parent.$emit('hideLoader');
            if (data.has_crossed_credit_limit) {
                ngDialog.open({
                    template        : '/assets/partials/billingInformation/sharedPartials//rvBillingInfoCreditLimitExceededPopup.html',
                    className       : '',
                    closeByDocument : false,
                    scope           : $scope
                });
            }
            else {
                $scope.$parent.$emit('BILLINGINFOADDED');
                $scope.setReloadOption(true);
                $scope.navigateToInitialPage();
                updateCardInfo();
                $scope.$parent.$emit('REFRESH_BILLCARD_VIEW');
            }
        };

        //CICO-12797 workaround to meet the API expected params
        var params =  angular.copy($scope.selectedEntity);
        $scope.invokeApi(RVBillinginfoSrv.saveRoute, params, $scope.saveSuccessCallback);
    };

    $scope.hasPermissionToEditCreditLimit = function() {
        return rvPermissionSrv.getPermissionValue('OVERWRITE_DIRECT_BILL_MAXIMUM_AMOUNT');
    };

    $scope.createNewBill = function() {

        if ($scope.selectedEntity.entity_type === "ALLOTMENT" || 
            $scope.selectedEntity.entity_type === "GROUP" || 
            $scope.selectedEntity.entity_type === "HOUSE") {

            var data = {
                "entity_type" : $scope.selectedEntity.entity_type,
                "entity_id"   : $scope.selectedEntity.id
            };
        }
        else {
            var data = {
                "reservation_id" : $scope.reservationData.reservation_id
            };
        }

        /*
        * Success Callback of create bill action
        */
        var createBillSuccessCallback = function(data) {
            $scope.$emit('hideLoader');
            $scope.selectedEntity.to_bill            = data.id;
            $scope.bills[$scope.bills.length - 1].id = data.id;

            if ($scope.saveData.payment_type !== null && $scope.saveData.payment_type !== "") {
                $scope.savePayment();
            }
            else {
                saveRouteAPICall();
            }
        };

        $scope.invokeApi(RVBillCardSrv.createAnotherBill, data, createBillSuccessCallback, $scope.errorCallback);
    };

    /**
    * Function to save a new payment type for the bill
    * @return {undefined}
    */
    $scope.savePayment = function() {

        $scope.saveSuccessCallback = function(data) {
            $scope.$parent.$emit('hideLoader');
            $scope.$parent.$emit('BILLINGINFOADDED');
        };

        $scope.errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        if ($scope.reservationData.reservation_id !== null) {
            $scope.savePaymentToReservation();
        }
        else {
            saveRouteAPICall();
        }
    };

    $scope.savePaymentToReservation = function() {

        $scope.saveSuccessCallback = function(data) {
            $scope.$parent.$emit('hideLoader');
            $scope.setReloadOption(true);
            $scope.navigateToInitialPage();
            $scope.$parent.$emit('BILLINGINFOADDED');

            //Added for CICO-23210
            $scope.$parent.$emit('REFRESH_BILLCARD_VIEW');
        };

        $scope.errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        var successCallback = function(data) {
            $scope.$parent.$emit('hideLoader');
            $scope.invokeApi(RVBillinginfoSrv.saveRoute, $scope.selectedEntity, $scope.saveSuccessCallback, $scope.errorCallback);
        };

        var errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        var successSixSwipe = function(response) {
            var data = {
                "token" : response.token,
                "is_swiped": true
            };
            data.reservation_id = $scope.reservationData.reservation_id;
            $scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successCallback, errorCallback);
        };

        if ($scope.saveData.payment_type === 'CC') {
            if ($rootScope.paymentGateway === "sixpayments" && !$scope.sixIsManual) {
                var data = {};
                data.reservation_id = $scope.reservationData.reservation_id;
                data.add_to_guest_card = false;
                data.bill_number = $scope.getSelectedBillNumber();

                $scope.$emit('UPDATE_SHOULD_SHOW_WAITING', true);
                RVPaymentSrv.chipAndPinGetToken(data).then(function(response) {
                    $scope.$emit('UPDATE_SHOULD_SHOW_WAITING', false);
                    successSixSwipe(response);
                }, function(error) {
                    $scope.errorMessage = error;
                    $scope.$emit('UPDATE_SHOULD_SHOW_WAITING', false);
                });
            }
            else if (!isEmptyObject($scope.swipedCardDataToSave)) {
                var data = $scope.swipedCardDataToSave;
                data.reservation_id = $scope.reservationData.reservation_id;

                data.bill_number = $scope.getSelectedBillNumber();
                data.payment_credit_type = $scope.swipedCardDataToSave.cardType;
                data.credit_card = $scope.swipedCardDataToSave.cardType;
                data.card_expiry = "20"+$scope.swipedCardDataToSave.cardExpiryYear+"-"+$scope.swipedCardDataToSave.cardExpiryMonth+"-01";
                $scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successCallback, errorCallback);
            }
            else {
                var data = {
                    "add_to_guest_card": false
                };
                data.reservation_id = $scope.reservationData.reservation_id;

                data.payment_type = $scope.saveData.payment_type;
                creditCardType    = (!$scope.cardData.tokenDetails.isSixPayment)?
                                    getCreditCardType($scope.cardData.cardDetails.cardType):
                                    getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();
                data.token        = (!$scope.cardData.tokenDetails.isSixPayment)?
                                    $scope.cardData.tokenDetails.session :
                                    $scope.cardData.tokenDetails.token_no;
                data.card_name    = retrieveCardName();
                data.bill_number  = $scope.getSelectedBillNumber();
                data.card_expiry  = retrieveCardExpiryForApi();
                data.card_code    = (!$scope.cardData.tokenDetails.isSixPayment)?
                                    $scope.cardData.cardDetails.cardType:
                                    getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();

                $scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successCallback, errorCallback);
            }
        }
        else {
            var data = {
                "payment_type"  :   $scope.saveData.payment_type
            };

            data.reservation_id = $scope.reservationData.reservation_id;
            data.bill_number    = $scope.getSelectedBillNumber();
            $scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successCallback, errorCallback);
        }
    };

    $scope.getSelectedBillNumber = function() {
        for (var i = 0; i < $scope.bills.length; i++) {
            if ($scope.bills[i].id === $scope.selectedEntity.to_bill) {
                return $scope.bills[i].bill_number;
            }
        }
    };

    $scope.$on('CHANGE_IS_MANUAL', function(e, value) {
        $scope.sixIsManual = value;
    });

    /**
    * Updates the charge codes and billing groups upon changing the route date range
    * @return {undefined}
    */
    $scope.onRouteDateChange = function() {
        fetchAvailableChargeCodes();
    };

    init();

}]);
