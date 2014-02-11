

(function() {
	var logoImage = function() {
		return {
		restrict : 'E',
		templateUrl : "shared/directives/logoImagePartial.html"
	}
	};

	snt.directive('logoImage', logoImage);
})();