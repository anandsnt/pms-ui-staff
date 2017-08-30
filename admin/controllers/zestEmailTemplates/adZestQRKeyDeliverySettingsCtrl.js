admin.controller('ADZestQRKeyDeliverySettingsCtrl', ['$scope', 'data', '$filter', '$controller',
	function($scope, data, $filter, $controller) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.setData(data, data.qr_key_delivery_email_template_settings, 'KEY_EMAIL');
		$scope.keyDeliveryCommonSettings = data.key_delivery_common_settings;
		$scope.hideButtonField = true;

		//for preview set sample data
		$scope.room_number = '101';
		$scope.isQRMail = true;
		$scope.qrImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZYAAAGWAQMAAABhNjfVAAAABlBMVEX///8AAABVwtN+AAABbklEQVR4nO3awW3EIBCFYaQU4JJonZJcQCQi8Ay82TjKlZH+d2GN+TgZa8BbCiGEkCy5+s737JlNHdf3uJI0DCaN8V9j8OW0+iibKIzEYDKYfTvOECfCYLKasQheJsJgUpt1u/fyhcGkNhbr3+Yu61UfRmIw55sdMbuRYDBZTIyNiovgn2Aw5xl9nT+DZ9Gynv7d3BhMItN81J5hXbW/6x0M5mAz83stNNlklt2JwWQxtWtH7ZY5UY2HJxhMGlOkPllNLGjitBhMClOkMKm+COzKzNuSwGCONaL3Y3/LbFLJYDBZTHke9PXRXbect9yLE2EwZxsZNdM+95oWPQHHYE43MfEE3KpwO0p53XJiMEea+LyvU+61u/TButfEYM43/mt9tlm3L1kLHYNJZqwjluZauzT/3IPBZDSXN112l+vFj8HkNCPedD/6fqnJMZjzjcXXwhO9V3vRYDDnmx3ZVva+G/kDFQaTwxBCCDk/P7WnPBgmIQYhAAAAAElFTkSuQmCC'
		$scope.mainHeading = $filter('translate')('QR_EMAIL_TEXT_SETTINGS');
		$scope.saveSettings = function() {
			$scope.saveAdminSettings('qr_key_delivery_email_template_settings', true);
		};
	}
]);