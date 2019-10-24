sntZestStation.directive('editableText', [function() {
    /*
        (v2)
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

        OTHER NOTES:
         anywhere we have editible text, we support html breaks with the data-ng-bind-html so the user can place text as needed

     */

    return {
        restrict: 'A',
        scope: {
            tag: '=tag'
        },
        link: function(scope, element, attrs) {
            var rootScope;

            var editorUpdateString = function($inputField, withText) {
                var stringToAdd = withText;

                var a = $($inputField).val(),
                    position = $($inputField).getCursorPosition();

                var output = [a.slice(0, position), stringToAdd, a.slice(position)].join('');

                $($inputField).val(output);
                var afterAddedStr = position + stringToAdd.length;

                $($inputField)[0].setSelectionRange(afterAddedStr, afterAddedStr);
            };

            var listeningOn = [];
            var addListeners = function(el, fnToFire) {
                var listen = false, tag;

                if (attrs.editableText) {
                    tag = $.trim(attrs.editableText);
                    if (listeningOn.indexOf(tag) === -1) {
                        listeningOn.push(tag);
                        listen = true;
                    }

                }

                if (listen) {
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
                }

            };

            var hasParent = function(element) {
                return $(element).parent() && $(element).parent()[0];
            };
            var parentIsButton = function(element) {
                return $(element).parent()[0].nodeName === 'BUTTON';
            };

            var getElType = function(element) {
                // fixes an issue with press-hold on empty-text buttons which user still will see the button
                // they can now press-hold the button to edit (non-nav buttons)
                if (hasParent(element) && parentIsButton(element)) {
                    return 'BUTTON';

                } 
                if (element[0].parentElement) {
                    return element[0].parentElement.nodeName;
                }
                
            };

            var isNavButtonType = function(element) {
                return element[0].parentElement.parentElement.nodeName === 'BUTTON';
            };

            var getRootScope = function(element) {

                if (!_.isUndefined(element.scope())) {
                    return element.scope().$parent.zestStationData;
                }

                if (_.isUndefined(rootScope)) {
                    // then request came from popup or element from zsRoot.html, which is outside parent scope
                    return element.scope().zestStationData;
                }
            };

            var getElScope = function(element, rootScope) {
                if (!_.isUndefined(element.scope())) {
                    return element.scope().$parent;
                }

                if (_.isUndefined(rootScope)) {
                    // then request came from popup or element from zsRoot.html, which is outside parent scope
                    return element.scope();
                }
            };

            var editorModeIsEnabled = function(rootScope) {
                if (rootScope) {
                    return rootScope.editorModeEnabled === 'true';
                } 
                return false;
                
            };

            var turnOFFTags = function(scope) {
                scope.$parent.$broadcast('TOGGLE_LANGUAGE_TAGS', 'off');
            };

            var updateInputString = function(event, $inputField, save) {
                if (event.keyCode === 32) { // Spacebar
                    // when editing a button and user hits space key
                    // the onclick/enter event gets fired
                    // need to prevent that event but inject the value
                    event.preventDefault();
                    event.stopPropagation();

                    editorUpdateString($inputField, ' ');

                } else if (event.shiftKey && event.keyCode === 13) { // press enter while holding shift, adds a line break
                    editorUpdateString($inputField, '<br>');

                } else if (event.keyCode === 13) { // press enter, saves content
                    save();
                }
            };

            var saveOrUpdateString = function(event, $inputField, save) {
                if (event.shiftKey && event.keyCode === 13) { // press enter while holding shift, adds a line break

                    editorUpdateString($inputField, '<br>');

                } else if (event.keyCode === 13) { // press enter, saves content
                    save();
                }
            };
            var listenForStringUpdate = function($inputField, elType, isNavButton, save) {

                if (elType === 'BUTTON' || isNavButton) {
                    $($inputField).on('keydown', function(event) {
                        updateInputString(event, $inputField, save);
                    });

                } else {
                    $($inputField).on('keydown', function(event) {
                        saveOrUpdateString(event, $inputField, save);
                    });
                }

            };


            var textEditor = function() {
                // handle double-click
                // 
                var elType = getElType(element); // button or text(span/li/text element)

                var scope,
                    currentValue,
                    isNavButton = isNavButtonType(element);

                rootScope = getRootScope(element);
                scope = getElScope(element, rootScope);

                if (editorModeIsEnabled(rootScope)) {
                    // Before starting to edit, toggle OFF tags (if shown)
                    turnOFFTags(scope);

                    var tag = $.trim(attrs.editableText),
                        el = $(element);

                    var oldText = scope.getTagValue(tag); // scope refs will be updated if vlaue changes
                    
                    $(element).hide();

                    scope.runDigestCycle();

                    currentValue = scope.getTagValue(tag);

                    setTimeout(function() {
                        var keepShowingTag,
                            textForInput = '';

                        if (currentValue && currentValue.indexOf('/&lt') !== -1) {
                            textForInput = currentValue.replace(/&lt;br&gt;/g, '<br>');
                        } else {
                            textForInput = oldText;
                        }

                        var $inputField = $('<input class="editor-mode-cls"/>').val(textForInput);
                        // append a new text-input field
                        // so the old element (text-label) does not lose its angular translation listeners

                        $(el).parent()
                            .append($inputField);
                        // hide the old element so it appears the element is replaced 
                        // with an input field

                        var save = function() {
                            var newValueForText = $($inputField).val();

                            addListeners(el, textEditor, scope);

                            $($inputField).remove();

                            var includesHtml = false;

                            if (newValueForText.indexOf('<br>') !== -1) {
                                includesHtml = true;
                            }

                            if (oldText !== newValueForText && !includesHtml || includesHtml && $(element)[0].innerHTML !== newValueForText) {
                                // show saving-indicator for slow networks need to show that save in-progress
                                scope.$emit('showLoader');

                                // If editing a Tag WHILE the tag was toggled ON, 
                                // need to still show that tag value until user toggles Tags back OFF
                                // 
                                keepShowingTag = oldText === tag;
                                console.info('saving: [', tag, '] > ', newValueForText);
                                scope.saveLanguageEditorChanges(tag, newValueForText, false, keepShowingTag);

                                // show label instead of input field by changing tagInEdit to empty string
                                $(element).fadeIn();

                            } else {
                                // string has not changed, dont save
                                $($inputField).remove();
                                // un-hide the original element
                                $(element).fadeIn();

                            }

                            scope.runDigestCycle();
                        };

                        // listens for update (shift-press/space) or save (enter pressed)
                        listenForStringUpdate($inputField, elType, isNavButton, save);

                        var isTouchDevice = 'ontouchstart' in window,
                            onWindowsDevice = window.navigator.userAgent.toLowerCase().indexOf('window') !== -1;

                        if (!isTouchDevice || !onWindowsDevice) {
                            $inputField.on('blur', save).focus();
                        }

                    }, 0); // wait for the dom to be ready, otherwise element listeners wont set properly
                }
            };


            if ($(element).parent()[0]) {
                if ($(element).parent()[0].nodeName !== 'SPAN' && $(element).parent()[0].nodeName !== 'LI') {
                    // handle if a button is pressed which does not have text (or empty string fields)
                    addListeners($(element).parent(), textEditor, scope);
                }
            }

            // handles typical replace text in label or button
            addListeners(element, textEditor, scope);

        }
    };

}]);
