/**
 * modulewise constants
 * @return {object}
 */
angular.module('sntPay').constant('paymentConstants', (function(){
  	
	/**
	 * creditCardMappingTypes
	 * @type {Object}
	 */
  	var creditCardMappingTypes = {
		AMEX: 'AX',
		DINERS_CLUB: 'DC',
		DISCOVER: 'DS',
		JCB: 'JCB',
		MASTERCARD: 'MC',
		VISA: 'VA'
	};

	/**
	 * to handle the different mode in payment app
	 * @type {Object}
	 */
	var modes = {
		CARD_ADD_MODE: "PAYMENTAPP_CARD_ADD_MODE",
		
	};

	return {
		creditCardMappingTypes,
		modes
	};
})());
