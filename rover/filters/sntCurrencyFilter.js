angular.module('sntRover').filter('sntCurrency', function() {
	return function(input, scope, place) {

		if (input && scope) {

			var paramObj = {
				input: input,
				symbol: scope.currencySymbol,
				place: place
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
    return CurrencyFormatSeperatorMappings[seperator][0];
};

function processSntCurrency(paramObj) {

	paramObj.input = '123456789123456789.12';

	var inputArray = [],
		integerPart = null, fractionPart = null,
		i = 0, j=0,
		processData = '', sntCurrency = '',
		CONST_PRECISION = 2;

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

	console.log(processData);

	// STEP-3 : Appending central seperator.

	processData = processData + getSeperatorType(paramObj.fractionSeperatorType);

	// STEP-4 : Add fractional part.

	if ( fractionPart !== null ) {
		// 2 digit precision
		var fraction = fractionPart.slice(0, CONST_PRECISION);

		processData = processData + fraction;
	}

	// STEP-5 : Append/prepend currency symbol based on place value.

	if (typeof paramObj.place !== 'undefined' && !paramObj.place) {
		sntCurrency = processData + ' ' + paramObj.symbol;
	}
	else {
		sntCurrency = paramObj.symbol + ' ' + processData;
	}

	console.log(sntCurrency);

	return sntCurrency;
};