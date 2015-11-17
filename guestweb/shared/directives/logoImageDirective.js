

(function() {
	var logoImage = function() {
		return {
		restrict : 'E',
		templateUrl : "/assets/shared/directives/logoImagePartial.html"
	};
	};

	sntGuestWeb.directive('logoImage', logoImage);

	var logoImageBack = function() {
		return {
		restrict : 'E',
		templateUrl : "/assets/shared/directives/logoImageBackPartial.html"
	};
	};

	sntGuestWeb.directive('logoImageBack', logoImageBack);
})();