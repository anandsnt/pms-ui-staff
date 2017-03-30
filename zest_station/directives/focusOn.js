/*
Custom (non-generic directive for zest station) which should...
1) focus the element on startup (starts virtual keyboard plugin)
2) attempt another angularjs digest event to assist with autocomplete jquery plugin
3) bind dom events to force refresh autocomplete plugin
*/
sntZestStation.directive('focusOn', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            delay: '@delay',
            ngModel: '=ngModel'
        },
        link: function(scope, element, attrs) {
            // resolves a touchscreen issue between virtual keyboard and autocomplete jquery plugins
            $(document).on('touchstart', function() {
                documentClick = true;
            });
            var elToFocus = '';

            if (attrs.focusOn) {
                elToFocus = attrs.focusOn;
                if ($(elToFocus) && $(elToFocus)[0]) {
                    // bind events to retrigger for Virtual keyboard plugin to behave properly
                    $timeout(function() {
                        var el = $(elToFocus)[0],
                            scopeFn = angular.element(el).scope()[attrs.focusOnTrigger];

                        $(elToFocus).focus(scopeFn);
                        $(elToFocus).keydown(scopeFn);
                        $(elToFocus).change(scopeFn);
                        $(elToFocus).blur(scopeFn);
                        // sets initial focus 

                        $(elToFocus).focus();
                        $timeout(function() {
                            $(elToFocus).click();
                        }, 200);

                        if (typeof scopeFn !== 'undefined') {
                            scopeFn();
                        } else {
                            if (attrs.focusOn === 'input') {
                                // rootCtrl
                                scopeFn = angular.element(el).scope().$parent.showOnScreenKeyboard;
                                // set listeners
                                var showKeyboardOnFocus = function() {
                                    angular.element(el).scope().$parent.showOnScreenKeyboard('country-selector-input');
                                };
                                // since the Input field is dynamically generated with the autocomplete jquery plugin, we need
                                // to assign an ID to support also using the soft-keyboard
                                // 

                                $($('#country-select-div input:text').first()[0]).attr('id', 'country-selector-input');

                                $(elToFocus).focus(showKeyboardOnFocus);
                                $(elToFocus).keydown(showKeyboardOnFocus);
                                $(elToFocus).change(showKeyboardOnFocus);
                                $(elToFocus).blur(showKeyboardOnFocus);
                            }
                        }
                    }, 0);
                }
            }
            // we are setting delay to 2sec. if it is undefined
            if (typeof scope.delay === 'undefined') {
                scope.delay = 2000;
            }
        }
    };

}]);