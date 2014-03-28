admin.directive("adFileread", function ($timeout) {
    return {
    	restrict: 'AE',
        replace: 'true',
        scope: {
            value: "=",
            label: '@label',
	        name : '@name'
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.value = changeEvent.target.files[0];
                    console.log(changeEvent.target.files[0]);
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        },
        templateUrl: '../../assets/directives/fileRead/adFileread.html'
    };
});