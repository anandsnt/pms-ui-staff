admin.directive('adCheckbox', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
            label: '@label',
	        required : '@required',
            isChecked: '=isChecked',
            parentLabelClass: '@parentLabelClass',
            divClass: '@divClass',
            spanClass: '@spanClass',
            change: '=change',
            datagroup: '@datagroup',
            isDisabled: '=isDisabled',
            index: '@index',
            ngHide: '=hide'
	    },

    	templateUrl: '../../assets/directives/checkBox/adCheckbox.html'
    };

});
