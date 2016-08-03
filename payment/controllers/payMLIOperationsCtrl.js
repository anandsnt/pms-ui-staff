angular.module('sntPay').controller('payMLIOperationsController',
    ['$scope', 'sntPaymentSrv', 'paymentAppEventConstants', 'paymentUtilSrv',
    function($scope, sntPaymentSrv, payEvntConst, util) {

      /**
       * variable to keep track swiped & data coming from swipe
       */
      var isSwiped;
      var swipedCCData;

      /**
       * to initialize the carda
       * @return undefined
       */
      var initializeCardData = () => {
        isSwiped = false;
        swipedCCData = {};
        $scope.cardData = {
          cardNumber: '',
          CCV: '',
          expiryMonth: '',
          expiryYear: '',
          userName: ''
        };
      };

      /**
       * for processing the request from other areas to clear card details
       * @return {undefined}
       */
      var resetCardEventHandler =
        $scope.$on(payEvntConst.RESET_CARD_DETAILS, () => initializeCardData);
  
      var notifyParent = function(tokenDetails) {
          var expiryMonth = angular.copy($scope.cardData.expiryMonth);
          var expiryYear = angular.copy($scope.cardData.expiryYear);
          var cardExpiry = (expiryMonth && expiryYear) ? ("20" + expiryYear + "-" + expiryMonth + "-01") : "";
          var paymentData = {
              apiParams: {
                  name_on_card: $scope.cardData.userName,
                  card_code: util.getCreditCardTypeForMLI($scope.cardData.cardType),
                  payment_type: "CC",
                  token: tokenDetails.session,
                  card_expiry: cardExpiry
              },
              cardDisplayData: {
                  name_on_card: $scope.cardData.userName,
                  card_code: util.getCreditCardTypeForMLI($scope.cardData.cardType),
                  ending_with: $scope.cardData.cardNumber.slice(-4),
                  expiry_date: expiryMonth + " / " + expiryYear
              }
          };
          $scope.$emit(payEvntConst.CC_TOKEN_GENERATED, paymentData);
      };
  
  
      var notifyParentError = function(errorMessage) {
          console.error(errorMessage);
          $scope.$emit("ERROR_OCCURED", errorMessage);
      };
  
      var doSwipedCardActions = function(swipedCardData) {
  
          var swipeOperationObj = new SwipeOperation();
          var swipedCardDataToSave = swipeOperationObj.createSWipedDataToSave(swipedCardData);
  
          var apiParams = swipedCardDataToSave;
          apiParams.payment_credit_type = swipedCardDataToSave.cardType;
          apiParams.credit_card = swipedCardDataToSave.cardType;
          apiParams.card_expiry = "20" + swipedCardDataToSave.cardExpiryYear + "-" + swipedCardDataToSave.cardExpiryMonth + "-01";
          apiParams.card_name = swipedCardData.nameOnCard;
  
          var paymentData = {
              apiParams: apiParams,
              cardDisplayData: {
                  name_on_card: swipedCardData.nameOnCard,
                  card_code: swipedCardDataToSave.cardType,
                  ending_with: $scope.cardData.cardNumber.slice(-4),
                  expiry_date: swipedCardDataToSave.cardExpiryMonth + " / " + swipedCardDataToSave.cardExpiryYear
              }
          };
          $scope.$emit("CC_TOKEN_GENERATED", paymentData);
      };
  
      /*
       * Function to get MLI token on click 'Add' button in form
       */
      $scope.getMLIToken = function($event) {
          $event.preventDefault();
          if (isSwipedCardData) {
              doSwipedCardActions(swipedCCData);
          } else {
              var sessionDetails = util.setUpSessionDetails($scope.cardData);
              var successCallBack = function(response) {
                  notifyParent(response);
              };
              var failureCallback = function(errorMessage) {
                  notifyParentError(errorMessage);
              };
              sntPaymentSrv.fetchMLIToken(sessionDetails, successCallBack, failureCallback);
          };
      };
  
      var renderDataFromSwipe = function(event, swipedCardData) {
          isSwipedCardData = true;
          swipedCCData = swipedCardData;
          $scope.cardData.cardNumber = swipedCardData.cardNumber;
          $scope.cardData.userName = swipedCardData.nameOnCard;
          $scope.cardData.expiryMonth = swipedCardData.cardExpiryMonth;
          $scope.cardData.expiryYear = swipedCardData.cardExpiryYear;
          $scope.cardData.cardType = swipedCardData.cardType;
          $scope.payment.screenMode = "CARD_ADD_MODE";
          $scope.payment.addCCMode = "ADD_CARD";
      };
  
      $scope.$on("RENDER_SWIPED_DATA", function(e, data) {
          console.log(data);
          renderDataFromSwipe(e, data);
      });
  
      // when destroying we have to remove the attached '$on' events
      $scope.$on('destroy', resetCardEventHandler);

      /****************** init ***********************************************/
  
      (function() {
          //to set your merchant ID provided by Payment Gateway
          HostedForm.setMerchant($scope.hotelConfig.mliMerchantId);
  
          //
          initializeCardData();
  
      })();
  
  }]);