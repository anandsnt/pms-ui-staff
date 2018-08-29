describe('Filter: sntCurrency', function() {
	var $filter;

	beforeEach(function () {
        module('sntCurrencyFilter');
        inject(function (_$filter_) {
			$filter = _$filter_;
		});
    });

	describe('Test currencyFormat = 1,222,00 ', function() {

		var input = '', result = '',
			that = {
				currencySymbol: '$',
				currencyFormat: '1,222,00'
			};
		
		it ('with Interger part and Fraction part', function() {
			input = 1234567890.12345;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 1,234,567,890,12');
		});

		it ('with Interger part only', function() {
			input = 1234567890;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 1,234,567,890');
		});

		it ('with Fraction part only', function() {
			input = .12345;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 0,12');
		});

		it ('with Invalid Input', function() {
			input = '123.45.6';
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe(undefined);
		});
	});

	describe('Test currencyFormat = 1,222.00 ', function() {

		var input = '', result = '',
			that = {
				currencySymbol: '$',
				currencyFormat: '1,222.00'
			};
		
		it ('with Interger part and Fraction part', function() {
			input = 1234567890.12345;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 1,234,567,890.12');
		});

		it ('with Interger part only', function() {
			input = 1234567890;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 1,234,567,890');
		});

		it ('with Fraction part only', function() {
			input = .12345;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 0.12');
		});

		it ('with Invalid Input', function() {
			input = 'abcd';
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe(undefined);
		});
	});

	describe('Test currencyFormat = 1.222 ', function() {

		var input = '', result = '',
			that = {
				currencySymbol: '$',
				currencyFormat: '1.222'
			};
		
		it ('with Interger part and Fraction part', function() {
			input = 1234567890.12345;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 1.234.567.890');
		});

		it ('with Interger part only', function() {
			input = 1234567890;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 1.234.567.890');
		});

		it ('with Fraction part only', function() {
			input = .12345;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 0');
		});

		it ('with Invalid Input', function() {
			input = '123+45.6';
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe(undefined);
		});
	});

	describe('Test currencyFormat = 1,222 ', function() {

		var input = '', result = '',
			that = {
				currencySymbol: '$',
				currencyFormat: '1,222'
			};
		
		it ('with Interger part and Fraction part', function() {
			input = 1234567890.12345;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 1,234,567,890');
		});

		it ('with Interger part only', function() {
			input = 1234567890;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 1,234,567,890');
		});

		it ('with Fraction part only', function() {
			input = .12345;
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe('<span class="currency">$</span> 0');
		});

		it ('with Invalid data', function() {
			input = '12,345.60';
			result = $filter('sntCurrency')(input, that);
			expect(result).toBe(undefined);
		});
	});

	it ('Test isWithoutSymbol = true and currencyFormat = 1,222,00 ', function() {

		var input = 1234567890.12345,
			isWithoutSymbol = true,
			result = '',
			that = {
				currencySymbol: '$',
				currencyFormat: '1,222,00'
			};

		result = $filter('sntCurrency')(input, that, isWithoutSymbol);

		expect(result).toBe('1,234,567,890,12');
	});

	it ('Test isWithoutSymbol = true and currencyFormat = 1,222,00 and precision = 3 ', function() {

		var input = 1234567890.12345,
			isWithoutSymbol = true,
			precision = 3,
			result = '',
			that = {
				currencySymbol: '$',
				currencyFormat: '1,222,00'
			};

		result = $filter('sntCurrency')(input, that, isWithoutSymbol, precision);

		expect(result).toBe('1,234,567,890,123');
	});
});

