admin.directive('adCheckboxgrp', function($timeout) {

    return {
        restrict: 'AE',
         scope: {
            label: '@label',
            isChecked: '=isChecked',
            deleteAction: '&deleteAction',
            toggle:'&toggle',
            optionId:'=optionId'
         },
        templateUrl: '../../assets/directives/checkBox/adCheckboxGroup.html'
    };

});