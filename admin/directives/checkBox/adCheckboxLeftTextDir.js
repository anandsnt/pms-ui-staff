admin.directive('adCheckboxtextLeft', function($timeout) {

    return {
    	restrict: 'AE',
        replace: 'true',
      	scope: {
            label: '@label',
	        required : '@required',
            isChecked: '=isChecked',
            parentLabelClass: '@parentLabelClass',
            divClass: '@divClass',
            change: '=change',
            datagroup: '@datagroup',
            index: '@index',
            width: '@'
	    },
        
    	templateUrl: '../../assets/directives/checkBox/adCheckboxLeftText.html' 
    };

});