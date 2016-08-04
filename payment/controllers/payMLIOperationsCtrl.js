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
          nameOnCard: ''
        };
      };

      /**
       * for processing the request from other areas to clear card details
       * @return {undefined}
       */
      var resetCardEventHandler =
        $scope.$on(payEvntConst.RESET_CARD_DETAILS, () => initializeCardData);
      
      /**
       * [notifyParent description]
       * @param  {[type]} tokenDetails [description]
       * @return {[type]}              [description]
       */
      var notifyParent = function(tokenDetails) {
          var paymentData = util.formCCTokenGeneratedParams({...$scope.cardData, tokenDetails});
          $scope.$emit(payEvntConst.CC_TOKEN_GENERATED, paymentData);
      };
  
      /**
       * [notifyParentError description]
       * @param  {[type]} errorMessage [description]
       * @return {[type]}              [description]
       */
      var notifyParentError = function(errorMessage) {
          console.error(errorMessage);
          $scope.$emit(payEvntConst.PAYMENTAPP_ERROR_OCCURED, errorMessage);
      };
  
      /**
       * [doSwipedCardActions description]
       * @param  {[type]} swipedCardData [description]
       * @return {[type]}                [description]
       */
      var doSwipedCardActions = function(swipedCardData) {
          var swipedCardDataToSave = new SwipeOperation().createSWipedDataToSave(swipedCardData),

          var paymentData = util.formCCTokenGeneratedParams({
            ...$scope.cardData,
            swipedCardData,
            swipedCardDataToSave
          });
          $scope.$emit(payEvntConst.CC_TOKEN_GENERATED, paymentData);
      };
  
      /**
       * [description]
       * @param  {[type]} response [description]
       * @return {[type]}          [description]
       */
      var successCallBackOfGetMLIToken = (response) => notifyParent(response);

      /**
       * [description]
       * @param  {[type]} error [description]
       * @return {[type]}       [description]
       */
      var failureCallBackOfGetMLIToken = (error) => notifyParentError(error);
      
      /*
       * Function to get MLI token on click 'Add' button in form
       */
      $scope.getMLIToken = function($event) {
          $event.preventDefault();

          //if swiped data is present
          if (swipedCCData) {
              doSwipedCardActions(swipedCCData);
              return;
          }

          var params = util.formParamsForFetchingTheToken($scope.cardData);
          sntPaymentSrv.fetchMLIToken(params, successCallBackOfGetMLIToken, failureCallBackOfGetMLIToken);
      };
  
      var renderDataFromSwipe = function(event, swipedCardData) {
          swipedCCData = true;
          swipedCCData = swipedCardData;
          $scope.cardData.cardNumber = swipedCardData.cardNumber;
          $scope.cardData.nameOnCard = swipedCardData.nameOnCard;
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
  
          $scope.modes = paymentConstants.modes;
      })();
  
  }]);