angular.module('sntRover').filter('sntCurrency', function() {
	return function(input, scope, isWithoutSymbol, precision) {

		var DEFAULT_PRECISION = 2;

		if (typeof input !== 'undefined' && scope) {

			if( typeof input === 'undefined' || isNaN(input)) {
				console.warn("sntCurrency exception :: Invalid input");
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

			switch(scope.currencyFormat) {
				case 'FORMAT-1': 
					// EG : 1234567.89 => 1,234,567,89
					paramObj.integerSeperatorType  = 'COMMA';
					paramObj.fractionSeperatorType = 'COMMA';
					break;
				case 'FORMAT-2': 
					// EG : 1234567.89 => 1,234,567.89
					paramObj.integerSeperatorType  = 'COMMA';
					paramObj.fractionSeperatorType = 'DOT';
					break;
				case 'FORMAT-3':
					// EG : 1234567.89 => 1.234.567 
					paramObj.integerSeperatorType  = 'DOT';
					paramObj.fractionSeperatorType = null;
					break;
				case 'FORMAT-4': 
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

// Utility method to reverse a given string value.
function reverseString(str) {
    return str.split("").reverse().join("");
}

// CICO-35453 - Mapping of various Currency Formats.
var CurrencyFormatSeperatorMappings = {
    'COMMA': [',', '1,222,00'],
    'DOT':   ['.', '1,222.00']
};

var getSeperatorType = function(seperator) {
    return (seperator === null) ? '' : CurrencyFormatSeperatorMappings[seperator][0];
};

/*
 *	Method to process currency data.
 *	@param {object} [input data contains input, symbol, isWithoutSymbol]
 */
function processSntCurrency(paramObj) {

	var inputArray = [],
		integerPart = null, fractionPart = null,
		i = 0, j = 0,
		processData = '', sntCurrency = '';

	/* 
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

	// Reversing the Interger part.
	integerPart = reverseString(integerPart);

	// STEP-2 : Process Interger part and add appropriate seperator type.

	for ( i = integerPart.length-1, j = 0 ; i >= 0; i--, j++ ) {
		if (j%3 === 0 && j > 2) {
			processData = processData + getSeperatorType(paramObj.integerSeperatorType) + integerPart[i];
		}
		else {
			processData = processData + integerPart[i];
		}
	}

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
	else{
		sntCurrency = '<span class="currency">' + paramObj.symbol + '</span> ' + processData;
	}

	return sntCurrency;
};