/** utility method collection for  */
angular.module('sntPay').service('paymentUtilSrv',
    ['paymentConstants', function(paymentConstants) {

    /**
     * identifiers of swiping in object response
     * @type {String}
     */
    var normalSwipeKeyInObject = 'session',
        mliSwipeKey = 'mli_token',
        mliManualKey ='session';

    /**
     * to form the param for fetching the token
     * @param  {object} object
     * @return {object}
     */
    this.formParamsForFetchingTheToken = (object) => ({
       cardNumber: object.cardNumber,
       cardSecurityCode: object.CCV,
       cardExpiryMonth: object.expiryMonth,
       cardExpiryYear: object.expiryYear
    });

    /**
     * to get credit card type for MLI
     * @param  {String} cardBrand
     * @return {String}
     */
    this.getCreditCardTypeForMLI = (cardBrand) => {
        cardBrand = cardBrand ||  "credit-card";

        var cardBrand_ = cardBrand.toUpperCase(),
            mappedCardType = creditCardTypes[cardBrand_] || cardBrand;

        return mappedCardType.toLowerCase();
    };

    /**
     * utility method to form the cc token generated params
     * @param  {object} object
     * @return {object}
     */
    this.formCCTokenGeneratedParams = (object)=> ({
        apiParams: this.formApiParamsForCreditCardSaving(object),
        cardDisplayData: this.formCardDisplayData(object)
    });

    /**
     * utility method to form the data required for displaying
     * @param  {object} object
     * @return {object}
     */
    this.formCardDisplayData = (object) => {
        var card_code = object.cardType; //for session coming from api
        
        //if it is MLI
        if(mliSwipeKey in object) {
            card_code = this.getCreditCardTypeForMLI(object.cardType);
        }
        else if(mliManualKey in object){
            card_code = this.getCreditCardTypeForMLI(object.cardBrand);
        }
        return {
            card_code,
            name_on_card: object.nameOnCard,
            ending_with: object.cardNumber.slice(-4),
            expiry_date: object.expiryMonth + " / " + object.expiryYear
        };
    };

    /**
     * utility method [formApiParamsForCreditCardSaving description]
     * @param  {object} object
     * @return {object}
     */
    this.formApiParamsForCreditCardSaving = (object) => {
        var tokenDetails = {};

        //session coming from the api
        if(normalSwipeKeyInObject in object) {
            tokenDetails.token = object.session;
            tokenDetails.card_code = object.cardType;
        }
        //MLI
        else if(mliSwipeKey in object) {
            tokenDetails = {
                credit_card: object.cardType
            };
            ['et2', 'ksn', 'pan', 'mli_token'].map(key => {
                tokenDetails[key] = object[key];
            });
        }

        var dateDataExist = (object.expiryMonth && object.expiryYear);

        return {
            ...tokenDetails,
            card_name: object.nameOnCard,
            payment_type: 'CC',
            // after discussing with api team
            // we need to change this, we need to send the month, year as seperately
            // and api can add these hardcoded values
            card_expiry: dateDataExist ? ('20' + object.expiryYear + '-' + object.expiryMonth + '-01') : ''
        }
    };

}]);
