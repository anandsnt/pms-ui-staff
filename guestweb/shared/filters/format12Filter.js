(function() {
	var format12 = function() {
		return function(input) {
			if (!input) {
				return;
			};

			var hh = input.substr(0, 2) * 1;
			var mm = input.slice(-2);
			var ap = 'AM';
			if (hh > 12) {
				hh = hh - 12;
				ap = 'PM';
			};

			return ap;
		};
	};

	sntGuestWeb.filter('format12', format12);
})();