// Web services documentation - https://stayntouch.atlassian.net/wiki/spaces/ROV/pages/342262008/Acuant+ID+Collection+documentations

angular.module('sntIDCollection', []);

angular.module('sntIDCollection').directive('ngUploadChange', function() {
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