angular.module('acuantIDCollection', []);

angular.module('acuantIDCollection').directive('ngUploadChange', function() {
	return {
		scope: {
			ngUploadChange: '&'
		},
		link: function($scope, $element) {
			$element.on('change', function(event) {
				$scope.$apply(function() {
					$scope.ngUploadChange({
						$event: event
					});
				});
			});
			$scope.$on('$destroy', function() {
				$element.off();
			});
		}
	};
});