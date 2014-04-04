admin.directive('adCheckboxgrp', function($timeout) {

    return {
        restrict: 'AE',
        replace: 'true',
         scope: {
            label: '@label',
             required : '@required',
            isChecked: '=isChecked',
        //     parentLabelClass: '@parentLabelClass'
         },
        templateUrl: '../../assets/directives/checkBox/adCheckboxGroup.html' 
    };

});