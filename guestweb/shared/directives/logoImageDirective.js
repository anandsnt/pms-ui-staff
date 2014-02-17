

(function() {
	var logoImage = function() {
		return {
		restrict : 'E',
		templateUrl : "/assets/shared/directives/logoImagePartial.html"
	}
	};

	snt.directive('logoImage', logoImage);
})();