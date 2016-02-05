admin.directive('fauxSelect', function() {
    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
            label: '@label',
	        change: '=change',
            isDisabled: '=isDisabled',
            source: '=source'
	    },
    	templateUrl: '/assets/directives/fauxSelect/fauxSelectTemplate.html',
        link: function ($scope, $element, $attr)
        {
            $scope.toggleList = function() {
                $scope.show = !$scope.show;
            };
        }
    };

});