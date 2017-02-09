admin.directive('adCheckbox', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
            label: '@label',
	        required: '@required',
            isChecked: '=isChecked',
            parentLabelClass: '@parentLabelClass',
            divClass: '@divClass',
            spanClass: '@spanClass',
            change: '=change',
            datagroup: '@datagroup',
            isDisabled: '=isDisabled',
            index: '@index',
            ngHide: '@hide',
            topLabel: '@'
	    },

    	templateUrl: '/assets/directives/checkBox/adCheckbox.html',
        controller : function($scope) {
            $scope.shouldHide = function () {
              if ( typeof $scope.ngHide === typeof true) {
                return $scope.ngHide;
              } else if ( $scope.ngHide === 'true' ) {
                return true;
              }
              return false;

            };
        }
    };

});
