/** utility method collection for  */
angular.module('sntPay').service('paymentUtilSrv',
    ['paymentConstants', function(paymentConstants) {

    /**
     * to form the param for fetching the token
     * @param  {object} object
     * @return {object}
     */
    this.formParamsForFetchingTheToken = function(object) {
        return {
           cardNumber: object.cardData.cardNumber,
           cardSecurityCode: object.cardData.CCV,
           cardExpiryMonth: object.cardData.expiryMonth,
           cardExpiryYear: object.cardData.expiryYear
        };
    };

    /**
     * to get credit card type for MLI
     * @param  {String} cardBrand
     * @return {String}
     */
    this.getCreditCardTypeForMLI = function(cardBrand) {
        var cardBrand_ = cardBrand.toUpperCase();

        //if card brand NOT EXIST in mapping file
        if (!_.has(paymentConstants.creditCardMappingTypes, cardBrand_)) {
            return 'credit-card';
        }
        return creditCardTypes[cardBrand_];
    };

    /**
     * [formApiParamsForCreditCardSaving description]
     * @param  {object} object [description]
     * @return {object}        [description]
     */
    this.formApiParamsForCreditCardSaving = function(object) {
        
    };

}]);
