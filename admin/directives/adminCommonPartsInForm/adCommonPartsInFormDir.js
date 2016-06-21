/**
 * Created by shahulhameed on 2/26/16.
 */
admin.directive('adCommonPartsInFormDir', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: '/assets/directives/adminCommonPartsInForm/adCommonPartsInFormDir.html',
        transclude: true,
        link: function($scope, element, attrs) {
        	/**
        	 * _AssignValidFunction
        	 * @param  {function} expectedFn [description]
        	 * @param  {function} nullCaseFn [description]
        	 * @return {function}
        	 */
        	var _assignValidFunction = function(expectedFn, nullCaseFn) {
        		return _.isFunction(expectedFn) ? expectedFn : nullCaseFn;
        	};

        	$scope.header = attrs.headerCaption;
        	
        	$scope.onSaveButtonClick = _assignValidFunction($scope[attrs.onSaveButtonClick], _.noop);
        	
        	$scope.onBackButtonClick = _assignValidFunction($scope[attrs.onBackButtonClick], 
        		$scope.goBackToPreviousState);
        	
        	$scope.onCancelButtonClick = _assignValidFunction($scope[attrs.onCancelButtonClick],
        		$scope.goBackToPreviousState);
        }
    };
}]);
