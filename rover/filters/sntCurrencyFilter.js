angular.module('sntRover').filter('sntCurrency', function() {
	return function(input, scope, place) {

		if (input && scope) {
			var currencyFormat = scope.currencyFormat,
				currencySymbol = scope.currencySymbol

			return processSntCurrency(input, currencySymbol, currencyFormat, place);
		}
	};
});

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

function processSntCurrency(input, symbol, format, place) {
	var input = '123456789123456789.12';
	var output = '', inputArray = [], integerPart = null, fractionPart = null, i = 0, s ='', j=0,
		integerSeperatorType  = 'DOT',
		fractionSeperatorType = 'COMMA';

	inputArray = input.split('.');

	if (inputArray.length > 1) {
		integerPart    = inputArray[0];
		fractionPart = inputArray[1];
	}
	else {
		integerPart  = inputArray[0];
	}

	integerPart = reverseString(integerPart);

	// STEP-1 : Process Interger part and add appropriate seperator type.

	for ( i=integerPart.length-1, j=0 ; i>=0; i--, j++) {
		if (j%3 === 0 && j > 2) {
			s = s + getSeperatorType(integerSeperatorType) + integerPart[i];
		}
		else {
			s = s + integerPart[i];
		}
	}

	console.log(s);

	// STEP-2 : Add central seperator.

	s = s + getSeperatorType(fractionSeperatorType);

	// STEP-3 : Add fractional part.

	if ( fractionPart !== null ) {
		// 2 digit precision
		var fraction = fractionPart.slice(0, 2);

		s = s + fraction;
	}

	// STEP-4 : Append/prepend currency symbol.

	if (typeof place !== 'undefined' && !place) {
		output = s + ' ' + symbol;
	}
	else {
		output = symbol + ' ' + s;
	}

	console.log(output);

	return output;
};