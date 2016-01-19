sntRover.controller('rvBillingInfoCardsRouteDetailsCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'RVGuestCardSrv', 'ngDialog', 'RVBillCardSrv', 'RVPaymentSrv', function($scope, $rootScope,$filter, RVBillinginfoSrv, RVGuestCardSrv, ngDialog, RVBillCardSrv, RVPaymentSrv){
    
    BaseCtrl.call(this, $scope);

    /**
     * Call all api to initialize controller here.
     * @return {Undefined}
     */
    var fetchInitialData = function() {
        $scope.fetchAllChargeCodes();
        $scope.fetchDefaultAccountRouting();
        $scope.fetchAllBillingGroups();
    };

    var setCreditCardDetails = function() {
        var entity = $scope.selectedEntity;
        if (entity.credit_card_details !== null &&
            entity.credit_card_details !== undefined &&
            entity.credit_card_details.hasOwnProperty('payment_type_description')) {
            $scope.renderAddedPayment                = entity.credit_card_details;
            $scope.renderAddedPayment.cardExpiry     = entity.credit_card_details.card_expiry;
            $scope.renderAddedPayment.endingWith     = entity.credit_card_details.card_number;
            $scope.renderAddedPayment.creditCardType = entity.credit_card_details.card_code;
            $scope.showPayment = true;
            $scope.showCreditCardDropDown = false;

            $scope.isShownExistingCCPayment = true;
            setTimeout(function(){
                 $scope.$broadcast('UPDATE_FLAG');
            }, 1000);
        }
    };

    /**
    * setting common payment model items
    */   
    var setCommonPaymentModelItems = function() {
        $scope.passData = {};
        $scope.passData.details ={};
        if(typeof $scope.guestCardData === 'undefined' ||
           typeof $scope.guestCardData.contactInfo === 'undefined') {
            $scope.passData.details.firstName = '';
            $scope.passData.details.lastName = '';
        }
        else{
            $scope.passData.details.firstName = $scope.guestCardData.contactInfo.first_name;
            $scope.passData.details.lastName = $scope.guestCardData.contactInfo.last_name;
        }
        $scope.setScroller('cardsList');
    };

    /**
    * Initializing the scrollers for the screen
    */

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
    };

    var refreshScrollers = function() {

        setTimeout(function(){
            $scope.refreshScroller('paymentList');
            $scope.refreshScroller('billingGroups');
            $scope.refreshScroller('chargeCodes');
            $scope.refreshScroller('chargeCodesList');
            $scope.refreshScroller('routeDetails');
            },
        500);
    };

    /**
    * function to edit payment method
    * @return {undefined}
    */
    $scope.editPaymentMethod = function () {
        $scope.oldPayment = $scope.renderAddedPayment;
        $scope.renderAddedPayment = null;
        isAddPayment = false;
    }

    /**
    * function to show the payment list on cancelling or adding new payment
    * @return {undefined}
    */
    $scope.showPaymentList = function() {
        $scope.isAddPayment = false;
        $scope.refreshScroller('paymentList');
    };

    $scope.$on("CANCELLED_PAYMENT", function () {
        $scope.renderAddedPayment = $scope.oldPayment;
    });

    //retrieve card expiry based on paymnet gateway
    var retrieveExpiryDate = function() {

        var expiryDate = $scope.cardData.tokenDetails.isSixPayment?
                    $scope.cardData.tokenDetails.expiry.substring(2, 4)+" / "+$scope.cardData.tokenDetails.expiry.substring(0, 2):
                    $scope.cardData.cardDetails.expiryMonth+" / "+$scope.cardData.cardDetails.expiryYear
                    ;
        return expiryDate;
    };

    //retrieve card number based on paymnet gateway
    var retrieveCardNumber = function() {
        var cardNumber = $scope.cardData.tokenDetails.isSixPayment?
                $scope.cardData.tokenDetails.token_no.substr($scope.cardData.tokenDetails.token_no.length - 4):
                $scope.cardData.cardDetails.cardNumber.slice(-4);
        return cardNumber;
    };
     /**
    * function to show the newly added payment
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

    /**
    * function to add payment through MLI swipe
    * @param {swiped card data}
    * @return {undefined}
    */
    $scope.paymentAddedThroughMLISwipe = function(swipedCardDataToSave) {
        $scope.renderAddedPayment = {};
        $scope.renderAddedPayment.payment_type = "CC";
        $scope.swipedCardDataToSave = swipedCardDataToSave;
        $scope.renderAddedPayment.creditCardType = swipedCardDataToSave.cardType.toLowerCase();
        $scope.renderAddedPayment.cardExpiry = swipedCardDataToSave.cardExpiryMonth+"/"+swipedCardDataToSave.cardExpiryYear;
        $scope.renderAddedPayment.endingWith = swipedCardDataToSave.cardNumber.slice(-4);
     };

    /**
    * function to show the add payment view
    * @return {undefined}
    */
    $scope.showAddPayment = function() {
            if(!$rootScope.isManualCCEntryEnabled){
                $scope.isManualCCEntryEnabled = false;
                var dialog = ngDialog.open({
                    template: '/assets/partials/payment/rvPaymentModal.html',
                    controller: '',
                    scope: $scope
                  });
                return;
            }

            $scope.isAddPayment = true;
            $scope.showCreditCardDropDown = true;
            $scope.renderAddedPayment = {};
            $scope.renderAddedPayment.creditCardType  = "";
            $scope.renderAddedPayment.cardExpiry = "";
            $scope.renderAddedPayment.endingWith = "";
            $scope.renderAddedPayment.payment_type = "";
            $scope.isShownExistingCCPayment = false;
            $scope.$broadcast('showaddpayment');
            $scope.refreshScroller('routeDetails');
    };

    $scope.$on("SHOW_SWIPED_DATA_ON_BILLING_SCREEN", function(e, swipedCardDataToRender){
        $scope.isAddPayment = true;
         $scope.$broadcast('showaddpayment');

        setTimeout(function(){
            $scope.saveData.payment_type = "CC";
            $scope.showCreditCardDropDown = true;
                        $scope.swippedCard = true;
            $scope.$broadcast('RENDER_DATA_ON_BILLING_SCREEN', swipedCardDataToRender);
            $scope.$digest();
        }, 2000);
    });

    /**
    * Listener to track the ngDialog open event.
    * We save the id for the ngDialog to close nested dialog for disabling manual payment addition.
    */
    $scope.$on("ngDialog.opened", function(event, data){
           $scope.ngDialogID =  data[0].id;
    });

    $scope.closeDialog = function() {
        ngDialog.close($scope.ngDialogID);
    };

    /**
    * function to fetch default Routing Account from server
    */
    $scope.fetchDefaultAccountRouting = function() {

        var successCallback = function(data) {

            $scope.selectedEntity.attached_billing_groups = data.billing_groups;
            $scope.selectedEntity.credit_limit = parseFloat(data.credit_limit).toFixed(2);
            $scope.selectedEntity.reference_number = data.reference_number;
            //Added for CICO-22869
            $scope.selectedEntity.attached_charge_codes = data.attached_charge_codes;
            if(!isEmptyObject(data.credit_card_details)){
                $scope.renderAddedPayment = data.credit_card_details;
                $scope.saveData.payment_type = data.credit_card_details.payment_type;

                $scope.renderAddedPayment.cardExpiry = data.credit_card_details.card_expiry;
                $scope.renderAddedPayment.endingWith = data.credit_card_details.card_number;
                $scope.renderAddedPayment.creditCardType = data.credit_card_details.card_code;
                $scope.isAddPayment = false;
                if(data.credit_card_details.payment_type !== 'CC'){
                    $scope.showCreditCardDropDown = true;
                } else {
                    $scope.showCreditCardDropDown = false;
                    $scope.isShownExistingCCPayment = true;
                }
            }
            $scope.$parent.$emit('hideLoader');
        };
        var params = {};
        params.id = $scope.selectedEntity.id;
        params.entity_type = $scope.selectedEntity.entity_type;
        if ($scope.billingEntity === "ALLOTMENT_DEFAULT_BILLING") {
            params.entity_type = "ALLOTMENT";
        }
        $scope.invokeApi(RVBillinginfoSrv.fetchDefaultAccountRouting, params, successCallback);
    };

    /**
    * function to fetch available billing groups for Default BI from server 
    */
    $scope.fetchAllBillingGroups = function() {

        var successCallback = function(data) {
            $scope.availableBillingGroups = data;
            if(data.length === 0) {
                $scope.isBillingGroup = false;
            }
            $scope.$parent.$emit('hideLoader');

        };
        var errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        $scope.invokeApi(RVBillinginfoSrv.fetchAllBillingGroups, '', successCallback, errorCallback);
    };

    /**
    * function to fetch all charge codes for Default BI from server
    */
    $scope.fetchAllChargeCodes = function() {

        var successCallback = function(data) {
            $scope.availableChargeCodes = data;
        };
        var errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        $scope.invokeApi(RVBillinginfoSrv.fetchAllChargeCodes, '', successCallback, errorCallback);
    };

    $scope.escapeNull = function(value, replaceWith) {
        return escapeNull(value, replaceWith);
    };

    /**
    * function to know if the charge code is selected, to adjust in UI
    * @param {chargecode}
    * @return {true or false}
    */
    $scope.isChargeCodeSelected = function(chargeCode){
        for(var i=0; i < $scope.selectedEntity.attached_charge_codes.length; i++){
            if($scope.selectedEntity.attached_charge_codes[i].id === chargeCode.id ) {
                return true;
            }
        }
        return false;
    };

    /**
    * Listener for the save button click
    * @return {undefined}
    */
    $scope.$on('routeSaveClicked', function(event){
        $scope.saveRoute();
    });

    /**
    * function to update the company and travel agent in stay card header
    * @return {undefined}
    */
    $scope.updateCardInfo = function(){

        if(($scope.selectedEntity.entity_type === 'COMPANY_CARD' && (typeof $scope.reservationDetails.companyCard.id === 'undefined'|| $scope.reservationDetails.companyCard.id === '')) ||
            ($scope.selectedEntity.entity_type === 'TRAVEL_AGENT' && ($scope.reservationDetails.travelAgent.id === 'undefined' || $scope.reservationDetails.travelAgent.id === ''))) {
            $rootScope.$broadcast('CardInfoUpdated', $scope.selectedEntity.id, $scope.selectedEntity.entity_type);
        }
    };

    /**
    * function to save the new route
    * call functions to save route
    */
    $scope.saveRoute = function(){

        if($scope.selectedEntity.attached_charge_codes.length === 0 && $scope.selectedEntity.attached_billing_groups.length===0){
            $scope.$emit('displayErrorMessage',[$filter('translate')('ERROR_CHARGES_EMPTY')]);
            return;
        }
        if( $scope.saveData.payment_type !== null && $scope.saveData.payment_type !== "" && !$scope.isShownExistingCCPayment){
            $scope.savePayment();
        }
        else{
            saveRouteAPICall();
        }
    };

    /**
    * function to save the new route
    * calls save API
    */
    var saveRouteAPICall = function(){


        var defaultRoutingSaveSuccess = function(){
            $scope.$parent.$emit('hideLoader');
            $scope.$parent.$emit('BILLINGINFOADDED');
            ngDialog.close();
        };

        var params =  angular.copy($scope.selectedEntity);            
        $scope.invokeApi(RVBillinginfoSrv.saveDefaultAccountRouting, params, defaultRoutingSaveSuccess);
    };

    /**
    * function to retrieve Card Name
    * @return {card name}
    */
    var retrieveCardName = function(){
        var cardName = (!$scope.cardData.tokenDetails.isSixPayment)?
                            $scope.cardData.cardDetails.userName:
                            ($scope.passData.details.firstName+" "+$scope.passData.details.lastName);
        return cardName;
    };

    /**
    * function to retrieve Card Expiry date
    * @return {Expiry date}
    */
    var retrieveCardExpiryForApi =  function(){
        var expiryMonth = $scope.cardData.tokenDetails.isSixPayment ? $scope.cardData.tokenDetails.expiry.substring(2, 4) :$scope.cardData.cardDetails.expiryMonth;
        var expiryYear  = $scope.cardData.tokenDetails.isSixPayment ? $scope.cardData.tokenDetails.expiry.substring(0, 2) :$scope.cardData.cardDetails.expiryYear;
        var expiryDate  = (expiryMonth && expiryYear )? ("20"+expiryYear+"-"+expiryMonth+"-01"):"";
        return expiryDate;
    };

    /**
    * function to save a new payment type for the bill
    * @return {undefined}
    */
    $scope.savePayment = function(){

        $scope.saveSuccessCallback = function(data) {
            $scope.$parent.$emit('hideLoader');
            $scope.$parent.$emit('BILLINGINFOADDED');
        };
        $scope.errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };

        $scope.savePaymentToReservationOrAccount('companyOrTA');
    };

    /**
    * function to save payment type to a reservation or to an account
    * @param { account or reservation}
    * @return {}
    */
    $scope.savePaymentToReservationOrAccount = function(toReservationOrAccount){

        $scope.errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };
          var defaultRoutingSaveSuccess = function(){
            $scope.$parent.$emit('hideLoader');
            $scope.$parent.$emit('BILLINGINFOADDED');
            ngDialog.close();
          };
         var successCallback = function(data) {
            $scope.$parent.$emit('hideLoader');
            var params = angular.copy( $scope.selectedEntity);

            $scope.invokeApi(RVBillinginfoSrv.saveDefaultAccountRouting, params, defaultRoutingSaveSuccess);
        };
        var errorCallback = function(errorMessage) {
            $scope.$parent.$emit('hideLoader');
            $scope.$emit('displayErrorMessage',errorMessage);
        };
        var successSixSwipe = function(response){

            var data = {
                "token" : response.token,
                "is_swiped": true
            };
            if(toReservationOrAccount === "reservation"){
                data.reservation_id = $scope.reservationData.reservation_id;
            }
            else if(toReservationOrAccount === "companyOrTA"){
                data.account_id = $scope.selectedEntity.id;
            }
            else if(toReservationOrAccount === "allotment"){
                data.allotment_id = $scope.selectedEntity.allotment_id;
            }
            else {
                data.group_id = $scope.selectedEntity.id;
            }
            $scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successCallback, errorCallback);
        };
        if($scope.saveData.payment_type === 'CC'){
            if($rootScope.paymentGateway === "sixpayments" && !$scope.sixIsManual){

                var data = {};
                if(toReservationOrAccount === "reservation"){
                    data.reservation_id = $scope.reservationData.reservation_id;
                }
                else if(toReservationOrAccount === "companyOrTA"){
                    data.account_id = $scope.selectedEntity.id;
                }
                else if(toReservationOrAccount === "allotment"){
                    data.allotment_id = $scope.selectedEntity.allotment_id;
                }
                else {
                    data.group_id = $scope.selectedEntity.id;
                }

                data.add_to_guest_card = false;
                data.bill_number = $scope.getSelectedBillNumber();

                $scope.$emit('UPDATE_SHOULD_SHOW_WAITING', true);
                RVPaymentSrv.chipAndPinGetToken(data).then(function(response) {
                    $scope.$emit('UPDATE_SHOULD_SHOW_WAITING', false);
                    successSixSwipe(response);
                },function(error){
                    $scope.errorMessage = error;
                    $scope.$emit('UPDATE_SHOULD_SHOW_WAITING', false);

                });

            }
            else if(!isEmptyObject($scope.swipedCardDataToSave)){

                var data            = $scope.swipedCardDataToSave;
                if(toReservationOrAccount === "reservation"){
                    data.reservation_id = $scope.reservationData.reservation_id;
                }
                else if(toReservationOrAccount === "companyOrTA"){
                    data.account_id = $scope.selectedEntity.id;
                }
                else if(toReservationOrAccount === "allotment"){
                    data.allotment_id = $scope.selectedEntity.allotment_id;
                }
                else {
                    data.group_id = $scope.selectedEntity.id;
                }
                data.bill_number = $scope.getSelectedBillNumber();
                data.payment_credit_type = $scope.swipedCardDataToSave.cardType;
                data.credit_card = $scope.swipedCardDataToSave.cardType;
                data.card_expiry = "20"+$scope.swipedCardDataToSave.cardExpiryYear+"-"+$scope.swipedCardDataToSave.cardExpiryMonth+"-01";
                $scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successCallback, errorCallback);

            }
            else {
                  var data = {
                    "add_to_guest_card": false
                }
                if(toReservationOrAccount === "reservation"){
                    data.reservation_id = $scope.reservationData.reservation_id;
                }
                else if(toReservationOrAccount === "companyOrTA"){
                    data.account_id = $scope.selectedEntity.id;
                }
                else if(toReservationOrAccount === "allotment"){
                    data.allotment_id = $scope.selectedEntity.allotment_id;
                }
                else {
                    data.group_id = $scope.selectedEntity.id;
                }
                data.payment_type = $scope.saveData.payment_type;
                creditCardType = (!$scope.cardData.tokenDetails.isSixPayment)?
                                getCreditCardType($scope.cardData.cardDetails.cardType):
                                getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();
                data.token =(!$scope.cardData.tokenDetails.isSixPayment)?$scope.cardData.tokenDetails.session :$scope.cardData.tokenDetails.token_no;
                data.card_name = retrieveCardName();
                data.bill_number = $scope.getSelectedBillNumber();
                data.card_expiry =  retrieveCardExpiryForApi();
                data.card_code   = (!$scope.cardData.tokenDetails.isSixPayment)?
                                $scope.cardData.cardDetails.cardType:
                                getSixCreditCardType($scope.cardData.tokenDetails.card_type).toLowerCase();
                $scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successCallback, errorCallback);
            }
        }
        else {
            var data = {
                    "payment_type"  :   $scope.saveData.payment_type
            };
            if(toReservationOrAccount === "reservation"){
                data.reservation_id = $scope.reservationData.reservation_id;
            }
            else if(toReservationOrAccount === "companyOrTA"){
                data.account_id = $scope.selectedEntity.id;
            }
            else if(toReservationOrAccount === "allotment"){
                data.allotment_id = $scope.selectedEntity.allotment_id;
            }
            else {
                data.group_id = $scope.selectedEntity.id;
            }
            data.bill_number = $scope.getSelectedBillNumber();
            $scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successCallback, errorCallback);
        }
    };

    /**
    * function to get selected bill number
    * @return {bill no}
    */
    $scope.getSelectedBillNumber = function(){
        for(var i = 0; i < $scope.bills.length; i++){
            if($scope.bills[i].id === $scope.selectedEntity.to_bill) {
                return $scope.bills[i].bill_number;
            }
        }
    };
    $scope.sixIsManual = false;
    $scope.$on('CHANGE_IS_MANUAL', function(e, value){
        $scope.sixIsManual = value;
    });

    var init = function() {

        $scope.chargeCodeToAdd          = "";
        $scope.first_bill_id            = "";
        $scope.isAddPayment             = false;
        $scope.showPayment              = true;
        $scope.showChargeCodes          = false;
        $scope.isBillingGroup           = true;
        $scope.paymentDetails           = null;
        $scope.showCreditCardDropDown   = false;
        $scope.isShownExistingCCPayment = false;
        $scope.swipedCardDataToSave     = {};

        setCreditCardDetails();
        setCommonPaymentModelItems();
        fetchInitialData();

        initializeScrollers();
        refreshScrollers();     
    };

    init();
}]);