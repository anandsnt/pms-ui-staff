describe('Filter: sntCurrency', function() {
	var sntCurrency,
		$filter,
		that = {
			currencySymbol: '$',
			currencyFormat: '1,222,00'
		};
		
	beforeEach(function () {
        module('sntRover');
    });

	beforeEach(function () {
        module('sntCurrencyFilter');
        inject(function (_$filter_, _sntCurrency_ ) {
			$filter = _$filter_;
			sntCurrency = _sntCurrency_;
        });
    });



	it('Test currencyFormat = 1,222,00 ', function() {

		var input = 123456789.12345,
			result = '';

		result = $filter('sntCurrency')(input, that);

		expect(result).toBe('<span class="currency">$</span> 123,456,789');
	});
});