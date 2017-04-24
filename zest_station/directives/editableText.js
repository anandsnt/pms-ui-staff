sntZestStation.directive('editableText', [function() {
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

            var addListeners = function(el, fnToFire) {
                // double-click listener
                el.dblclick(fnToFire);

                // touch-device tap listener
                $(el).on('touchend', fnToFire);

                var pressHoldtimeoutId;
                // press-and-hold for 1 sec listener

                $(el).on('mousedown', function() {
                    pressHoldtimeoutId = setTimeout(fnToFire, 1000);

                })
                    .on('mouseup mouseleave', function() {
                        clearTimeout(pressHoldtimeoutId);

                    });

            };
            var textEditor = function() {
                // handle double-click
                // 
                var elType;
                // fixes an issue with press-hold on empty-text buttons which user still will see the button
                // they can now press-hold the button to edit (non-nav buttons)

                if ($(element).parent() && $(element).parent()[0] && $(element).parent()[0].nodeName === 'BUTTON') {
                    elType = 'BUTTON';
                } else {
                    if (element[0].parentElement) {
                        elType = element[0].parentElement.nodeName;
                    } else {
                        return;
                    }
                }

                var rootScope,
                    scope,
                    isNavButton = element[0].parentElement.parentElement.nodeName === 'BUTTON';

                if (!_.isUndefined(element.scope())) {
                    rootScope = element.scope().$parent.zestStationData;
                    scope = element.scope().$parent;
                }

                if (_.isUndefined(rootScope)) {
                    // then request came from popup or element from zsRoot.html, which is outside parent scope
                    rootScope = element.scope().zestStationData;
                    scope = element.scope();
                }

                if (rootScope.editorModeEnabled === 'true') {
                    var tag = $.trim(attrs.editableText),
                        keepShowingTag,
                        el = $(element);

                    var oldText = $.trim(el.text());

                    var $inputField = $('<input class="editor-mode-cls"/>').val(oldText);


                    el.replaceWith($inputField);
                    if (elType === 'BUTTON' || isNavButton) {
                        $($inputField).on('keydown', function(event) {
                            if (event.keyCode === 32) { // Spacebar
                                // when editing a button and user hits space key
                                // the onclick/enter event gets fired
                                // need to prevent that event but inject the value
                                event.preventDefault();
                                event.stopPropagation();

                                $($inputField).val($($inputField).val() + ' ');
                            } else if (event.keyCode === 13) {// press enter, saves content
                                save();
                            }
                        });
                    } else {
                        $($inputField).on('keydown', function(event) {
                            if (event.keyCode === 13) {// press enter, saves content
                                save();
                            }
                        });
                    }

                    var save = function() {
                        var newValueForText = $inputField.val();

                        //  translation updated in locale, pushed
                        // el.text( newValueForText ); // show immediate change in text, save happens afterwards

                        if (oldText !== tag || oldText !== newValueForText) {
                            el.attr('old-text', newValueForText);
                        }

                        addListeners(el, textEditor);

                        $inputField.replaceWith(element);

                        if (oldText !== newValueForText) {
                            // show saving-indicator for slow networks need to show that save in-progress
                            scope.$emit('showLoader');

                            // If editing a Tag WHILE the tag was toggled ON, 
                            // need to still show that tag value until user toggles Tags back OFF
                            // 
                            keepShowingTag = false;
                            if (oldText === tag) {
                                keepShowingTag = true;
                            }
                            scope.saveLanguageEditorChanges(tag, newValueForText, false, keepShowingTag);

                        }

                    };

                    var isTouchDevice = 'ontouchstart' in window,
                    onWindowsDevice = window.navigator.userAgent.toLowerCase().indexOf('window') !== -1;
                    if (!isTouchDevice || !onWindowsDevice) {
                        $inputField.one('blur', save).focus(); 
                    }


                }
            };
            if ($(element).parent()[0]) {
                if ($(element).parent()[0].nodeName !== 'SPAN' && $(element).parent()[0].nodeName !== 'LI'){
                    // handle if a button is pressed which does not have text (or empty string fields)
                    addListeners($(element).parent(), textEditor);   
                }
            }

            // handles typical replace text in label or button
            addListeners(element, textEditor);

        }
    };

}]);
