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

	return {
		creditCardMappingTypes: creditCardMappingTypes
	}
})());
