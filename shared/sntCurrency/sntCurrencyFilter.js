angular.module('sntCurrencyFilter', []).filter('sntCurrency', function() {
	return function(input, scope, isWithoutSymbol, precision) {

		var DEFAULT_PRECISION = 2;

		if (typeof input !== 'undefined' && scope) {

			if (isNaN(input)) {
				console.warn("sntCurrency exception :: Invalid input - ", input);
				return;
			}
			else if (typeof input !== 'string') {
				input = input.toString();
			}

			var paramObj = {
				input: input,
				symbol: scope.currencySymbol,
				isWithoutSymbol: !!isWithoutSymbol,
				precision: typeof precision === 'undefined' ? DEFAULT_PRECISION : precision
			};

			switch (scope.currencyFormat) {
				case '1,222,00': 
					// EG : 1234567.89 => 1,234,567,89
					paramObj.integerSeperatorType  = 'COMMA';
					paramObj.fractionSeperatorType = 'COMMA';
					break;
				case '1,222.00': 
					// EG : 1234567.89 => 1,234,567.89
					paramObj.integerSeperatorType  = 'COMMA';
					paramObj.fractionSeperatorType = 'DOT';
					break;
				case '1.222':
					// EG : 1234567.89 => 1.234.567 
					paramObj.integerSeperatorType  = 'DOT';
					paramObj.fractionSeperatorType = null;
					break;
				case '1,222': 
					// EG : 1234567.89 => 1,234,567
					paramObj.integerSeperatorType  = 'COMMA';
					paramObj.fractionSeperatorType = null;
					break;
				default:
					// EG : 1234567.89 => 1,234,567.89
					paramObj.integerSeperatorType  = 'COMMA';
					paramObj.fractionSeperatorType = 'DOT';
			}

			return processSntCurrency(paramObj);
		}
	};
});

/**
 * Utility method to reverse a given string value.
 * @param {string} [string input ]
 * @return {string}
 */
function reverseString(str) {
    return str.split("").reverse()
    .join("");
}

// CICO-35453 - Mapping of various Currency Formats.
var CurrencyFormatSeperatorMappings = {
    'COMMA': [',', '1,222,00'],
    'DOT': ['.', '1,222.00']
};

/**
 *  Get seperator type symbol
 *  @param {string}
 *  @return {string}
 */
var getSeperatorType = function(seperator) {
    return (seperator === null) ? '' : CurrencyFormatSeperatorMappings[seperator][0];
};

/**
 *	process integer array to append with seperator type
 *	@param {Array} - Array of string as integer part
 *	@param {string} - seperatort type
 *	@return {string} - amount appended by sepeartor.
 */
var processIntegerPart = function( integerPart, seperatorType ) {
	var i = 0, j = 0, data = '';

	for ( i = integerPart.length - 1, j = 0 ; i >= 0; i --, j ++ ) {
		if (j % 3 === 0 && j > 2) {
			data = data + getSeperatorType(seperatorType) + integerPart[i];
		}
		else {
			data = data + integerPart[i];
		}
	}

	// Reversing the data
	data = reverseString(data);
	return data;
};

/**
 *	Method to process currency data.
 *	@param {object} [input data contains input, symbol, isWithoutSymbol]
 */
function processSntCurrency( paramObj ) {

	var inputArray = [],
		integerPart = null, fractionPart = null,
		i = 0, j = 0,
		processData = '', sntCurrency = '';

	/**
	 *	STEP-1 : Splits a given input value (type {string}) into two pieces - Integer part & Fractional part,
	 * 	Then reversing the integer part for parsing.
	 * 	Eg : 1234567.89 =>  [ '1234567', '89' ] => [ '7654321', '89' ]
	 */
	inputArray = paramObj.input.split('.');

	if (inputArray.length > 1) {
		integerPart    = inputArray[0];
		fractionPart = inputArray[1];
	}
	else {
		integerPart  = inputArray[0];
	}

	// STEP-2 : Process Interger part and add appropriate seperator type.
	processData = processIntegerPart(integerPart, paramObj.integerSeperatorType);

	if ( fractionPart !== null && paramObj.fractionSeperatorType !== null) {
		// STEP-3 : Appending central seperator.
		processData = processData + getSeperatorType(paramObj.fractionSeperatorType);
			
		// Calculating precision on fractional part.
		var fraction = fractionPart.slice(0, paramObj.precision);
			
		// STEP-4 : Add fractional part.
		processData = processData + fraction;
	}

	// STEP-5 : Append currency symbol based on isWithoutSymbol flag.
	if (paramObj.isWithoutSymbol) {
		sntCurrency = processData;
	}
	else {
		sntCurrency = '<span class="currency">' + paramObj.symbol + '</span> ' + processData;
	}

	return sntCurrency;
}
