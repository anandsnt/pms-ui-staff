sntZestStation.directive('srcError', [function() {
    /*
        this directive used with an Editor-Mode flag
        when the Editor-Mode flag is set to true,
        the translated on-screen text becomes Editable

        When the user loses focus of the element, we save the content
        to the selected language.

        *While in Editor-mode, all timers, including language-timeout, will be stopped
         to ensure the screen does not change while editing is on-going.


         for all elements, touch-press/click-touch/ng-click, etc. these events should be stopped
         while in editor-mode, so that only when clicking inside the element
         this will act to enable Editing of the tag itself, only.
     */

    return {
        restrict: 'A',
        scope: {
            ngModel: '=ngModel'
        },
        link: function(scope, element, attrs) {
         element.bind('error', function() {
            if (attrs.src != attrs.srcError) {
                if (attrs.srcError.length > 0){
                    scope.$parent.$parent.$parent.jumperData.invalidGalleryImages.push(attrs.srcError);
                    setTimeout(function(){
                        scope.$parent.$parent.$parent.runDigestCycle();
                    },500);
                }

            } 

          });
        }
    }
}]);