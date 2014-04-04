admin.directive('adCheckbox', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
            label: '@label',
	        required : '@required',
            isChecked: '=isChecked',
            parentLabelClass: '@parentLabelClass',
            change: '=change',
            datagroup: '@datagroup',
            index: '@index'
	    },
        
    	templateUrl: '../../assets/directives/checkBox/adCheckbox.html' 
    };

});