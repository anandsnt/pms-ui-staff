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
                el.dblclick( fnToFire );

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
                var rootScope = element.scope().$parent.zestStationData;

                if (rootScope.editorModeEnabled === 'true') {
                    // console.log('start editing : ', element);  
                    // console.log(element, scope, attrs);

                    var tag = $.trim(attrs.editableText),
                        keepShowingTag,
                        el = $(element);

                    var oldText = $.trim(el.text());

                    var $inputField = $('<input class="editor-mode-cls"/>').val( oldText );

                    el.replaceWith( $inputField );

                    var save = function() {
                        var newValueForText = $inputField.val();

                    //  translation updated in locale, pushed
                    // el.text( newValueForText ); // show immediate change in text, save happens afterwards

                        if (oldText !== tag || oldText !== newValueForText) {
                            el.attr('old-text', newValueForText);
                        } 

                        addListeners(el, textEditor);

                        $inputField.replaceWith( element );

                        if (oldText !== newValueForText) {
                        // show saving-indicator for slow networks need to show that save in-progress
                            element.scope().$parent.$emit('showLoader');

                        // If editing a Tag WHILE the tag was toggled ON, 
                        // need to still show that tag value until user toggles Tags back OFF
                        // 
                            keepShowingTag = false;
                            if (oldText === tag) {
                                keepShowingTag = true;
                            }
                            element.scope().$parent.saveLanguageEditorChanges(tag, newValueForText, false, keepShowingTag);

                        }

                    };

                    $inputField.one('blur', save).focus();
                }
            };

            addListeners(element, textEditor);

        }
    };

}]);