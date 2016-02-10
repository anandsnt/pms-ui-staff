admin.controller('ADzestWebGlobalSettingsCtrl', ['$scope', function($scope) {

	BaseCtrl.call(this, $scope);
	$scope.languages = ["EN", "ES"];
	$scope.globalSettings = {
		"is_cms_on": false,
		"language": "EN",
		"body_background": "",
		"header_background": "",
		"template_text_color": "",
		"template_sub_text_color": "",
		"template_button_bg": "",
		"template_button_color": "",
		"light_button_bg": "",
		"dark_button_bg": ""
	};

}]);