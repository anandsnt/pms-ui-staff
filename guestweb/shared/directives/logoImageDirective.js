

(function() {
	var logoImage = function() {
		return {
		restrict : 'E',
		templateUrl : "/assets/shared/directives/logoImagePartial.html"
	};
	};

	snt.directive('logoImage', logoImage);

	var logoImageBack = function() {
		return {
		restrict : 'E',
		templateUrl : "/assets/shared/directives/logoImageBackPartial.html"
	};
	};

	snt.directive('logoImageBack', logoImageBack);
})();