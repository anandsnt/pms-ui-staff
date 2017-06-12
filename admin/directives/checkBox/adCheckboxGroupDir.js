admin.directive('adCheckboxgrp', function($timeout) {

    return {
        restrict: 'AE',
         scope: {
            label: '@label',
            isChecked: '=isChecked',
            deleteAction: '&deleteAction',
            toggle: '&toggle',
            optionId: '=optionId',
            isDisabled: '=isDisabled'
         },
        templateUrl: '/assets/directives/checkBox/adCheckboxGroup.html'
    };

});