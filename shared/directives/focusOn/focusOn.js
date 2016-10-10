
/*
    Custom (non-generic directive for zest station) which should...

    1) focus the element on startup (starts virtual keyboard plugin)
    2) attempt another angularjs digest event to assist with autocomplete jquery plugin
    3) bind dom events to force refresh autocomplete plugin
*/
angular.module('focusOn', []).directive('focusOn', function($timeout, $parse) {
    return {
        //restrict: 'A',
        link: function(scope, element, attrs, opt) {
             element.bind('touchstart click focus', function(event) {
                try {
                    console.log('focus handler');
                    if (element){
                        if (arguments[0].target.nodeName === 'INPUT') {
                            element.focus(); 
                        } else {
                            console.log('jquery focus');
                            $('input').focus();
                        }
                    }
                } catch(err){

                }

                scope.$apply(attrs['focusOn']);

        });

            scope.$on('$destroy', function() {
                element.unbind('touchstart click focus');
            })
        }
    };
});
