describe('Filter: sntCurrency', function() {
	var sntCurrency,
		$filter,
		that = {
			currencySymbol: '$',
			currencyFormat: '1,222,00'
		};

	beforeEach(function () {
        module('sntCurrencyFilter');
        inject(function (_$filter_, _sntCurrency_ ) {
			$filter = _$filter_;
			sntCurrency = _sntCurrency_;
        });
    });

	it('Test currencyFormat = 1,222,00 ', function() {

		var input = 1234567890.12345,
			result = '';

		result = $filter('sntCurrency')(input, that);

		expect(result).toBe('<span class="currency">$</span> 1,234,567,890,12');
	});

	it('Test currencyFormat = 1,222.00 ', function() {

		var input = 1234567890.12345,
			result = '';

		result = $filter('sntCurrency')(input, that);

		expect(result).toBe('<span class="currency">$</span> 1,234,567,890.12');
	});

	it('Test currencyFormat = 1.222 ', function() {

		var input = 1234567890.12345,
			result = '';

		result = $filter('sntCurrency')(input, that);

		expect(result).toBe('<span class="currency">$</span> 1.234.567.890');
	});
	
	it('Test currencyFormat = 1,222 ', function() {

		var input = 1234567890.12345,
			result = '';

		result = $filter('sntCurrency')(input, that);

		expect(result).toBe('<span class="currency">$</span> 1,234,567,890');
	});

	it('Test isWithoutSymbol = true and currencyFormat = 1,222,00 ', function() {

		var input = 1234567890.12345,
			isWithoutSymbol = true,
			result = '';

		result = $filter('sntCurrency')(input, that, isWithoutSymbol);

		expect(result).toBe('1,234,567,890,12');
	});
});