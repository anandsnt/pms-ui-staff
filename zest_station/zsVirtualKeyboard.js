/*
 * This listener is used for windows ChromeApp (yotel),
 * Because the virtual keyboard will get styling from the parent template
 * we include the .js and .css files here
 * 
 *** Other Notes **
 *
 *  This is a jQuery plugin, (Mottie Virtual Keyboard) if we ever stop including jquery from our application,
 *  this code will need to be dropped in lieu of some other extension for onscreen keyboards
 */

this.initScreenKeyboardListener = function(from, id, show, onChangeEvent) {
    var that = this;

    this.bound = false;
    // open virtual keyboard
    $.keyboard.language.love = $.extend($.keyboard.language.en);
    var focused = $('#' + id),
        isCountrySelector = id === 'country-selector-input';

    elementObj = $(focused);


    var defaultLayout, shift, zestStationNonPasswordField, zestStationNumDaysField, zestStationNationalityField;

    isPasswordField = function(i) {
        return i && i.indexOf('pass') !== -1;
    };

    isNumOfDaysField = function(i) {
        // show number keyboard on these fields: prompt_text, timeout_text, no-of-nights
        var fields = ['prompt_text', 'timeout_text', 'no-of-nights'];

        return i && fields.indexOf(i) !== -1;
    };
    isAdminNumberField = function(i) {
        // show number keyboard on these fields: prompt_text, timeout_text, no-of-nights
        var adminNumberFields = ['prompt_text', 'timeout_text'];

        return i && adminNumberFields.indexOf(i) !== -1;
    };

    isNationalityField = function(i) {
        return i && (i.indexOf('country-selector') !== -1 || i.indexOf('country-selector-input') !== -1);
    };

    if (from === 'login' || isPasswordField(id)) {
        defaultLayout = 'default';
        shift = '{shift}';
        zestStationNonPasswordField = false;
        zestStationNumDaysField = false;
        zestStationNationalityField = false;

    } else if (isNumOfDaysField(id)) {
        zestStationNonPasswordField = true;
        zestStationNumDaysField = true;
        zestStationNationalityField = false;

        defaultLayout = 'station_num_keyboard';
        shift = '';
    } else if (isNationalityField(id)) {
        zestStationNonPasswordField = true;
        zestStationNumDaysField = false;
        zestStationNationalityField = true;

        defaultLayout = 'station_keyboard_no_numbers';
        shift = '';
    } else {
        zestStationNonPasswordField = true;
        zestStationNumDaysField = false;
        zestStationNationalityField = false;
        defaultLayout = 'station_keyboard';
        shift = '';
    }

    var applyKeyboardInput = function() {
        if (from === 'login') { // fixes an issue where data values are not set from virtual keyboard
            var el = $(elementObj[0]);

            if (angular.element(el).scope()) {
                angular.element(el).scope().data[id] = $(elementObj[0]).val();
            }
        }
    };


    var keyboardOptions = {
        language: ['love'],
        rtl: false,
        // layout: 'qwerty',
        layout: defaultLayout,
        customLayout: {
            'default': [
                '1 2 3 4 5 6 7 8 9 0',
                'q w e r t y u i o p {bksp}',
                'a s d f g h j k l \' @',
                'z x c v b n m . +',
                shift + ' {space} _ - .com'
            ],
            'station_keyboard': [
                '1 2 3 4 5 6 7 8 9 0',
                'Q W E R T Y U I O P {bksp}',
                'A S D F G H J K L \' @',
                'Z X C V B N M . +',
                shift + ' {space} _ - .com'
            ],
            'station_keyboard_no_numbers': [
                'Q W E R T Y U I O P {bksp}',
                'A S D F G H J K L \'',
                'Z X C V B N M',
                ' {space} '
            ],
            'station_num_keyboard': [
                '1 2 3 4 5 6 7 8 9 0 {bksp}'
            ],
            'shift': [ // zest station on screen is always caps,default to this
                '! @ # $ % ^ & * ( )',
                'Q W E R T Y U I O P {bksp}',
                'A S D F G H J K L \' @',
                'Z X C V B N M . +',
                shift + ' {space} _ - .com'
            ],
            'meta1': [
                '{default} 0 '
            ],
            'meta2': [
                'M Y M E T A 2',
                '{meta1} {meta2} {accept} {cancel}'
            ]
        },
        position: {
            of: null,
            my: 'center top',
            at: 'center top',
            at2: 'center bottom'
        },

        reposition: true,

        usePreview: false,

        alwaysOpen: false,

        initialFocus: false,
        noFocus: false,
        stayOpen: false,
        ignoreEsc: false,

        display: {
            'meta1': 'numpad', // Diamond
            'meta2': '\u2665', // Heart
            'shift': 'Shift:Shift',

            'numpad': '\u2665',

            // check mark (accept)
            'a': '\u2714:Accept (Shift-Enter)',
            'accept': 'Accept:Accept (Shift-Enter)',
            'alt': 'AltGr:Alternate Graphemes',
            // Left arrow (same as &larr;)
            'b': '\u2190:Backspace',
            'bksp': ' ',
            // 'bksp': '\u2421:Backspace',
            // 'bksp': '\u2421:Backspace',
            // big X, close/cancel
            'c': '\u2716:Cancel (Esc)',
            'cancel': 'Cancel:Cancel (Esc)',
            // clear num pad
            'clear': 'C:Clear',
            'combo': '\u00f6:Toggle Combo Keys',
            // num pad decimal '.' (US) & ',' (EU)
            'dec': '.:Decimal',
            // down, then left arrow - enter symbol
            'e': '\u21b5:Enter',
            'empty': '\u00a0', // &nbsp;
            'enter': 'Enter:Enter',
            // left arrow (move caret)
            'left': '\u2190',
            // caps lock
            'lock': '\u21ea Lock:Caps Lock',
            'next': 'Next \u21e8',
            'prev': '\u21e6 Prev',
            // right arrow (move caret)
            'right': '\u2192',
            // thick hollow up arrow
            's': '\u21e7:Shift',

            // +/- sign for num pad
            'sign': '\u00b1:Change Sign',
            'space': '\u00a0:Space',
            // right arrow to bar
            // \u21b9 is the true tab symbol
            // 't': '\u21e5:Tab',
            //  'tab': '\u21e5 Tab:Tab',
            // replaced by an image
            'toggle': ' ',

            // added to titles of keys
            // accept key status when acceptValid:true
            'valid': 'valid',
            'invalid': 'invalid',
            // combo key states
            'active': 'active',
            'disabled': 'disabled'

        },

        wheelMessage: 'Use mousewheel to see other keys',

        css: {
            input: 'ui-widget-content ui-corner-all',
            container: 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix',
            popup: '',
            buttonDefault: 'ui-state-default ui-corner-all',
            buttonHover: 'ui-state-hover',
            buttonAction: 'ui-state-active',
            buttonActive: 'ui-state-active',
            buttonDisabled: 'ui-state-disabled',
            buttonEmpty: 'ui-keyboard-empty'
        },

        autoAccept: true,
        autoAcceptOnEsc: true,
        lockInput: false,
        restrictInput: false,
        restrictInclude: '', // e.g. 'a b foo \ud83d\ude38'
        acceptValid: true,
        cancelClose: false,
        tabNavigation: false,
        enterNavigation: false,
        enterMod: 'altKey',
        stopAtEnd: true,
        appendLocally: false,
        appendTo: 'body',
        stickyShift: true,
        preventPaste: false,
        caretToEnd: false,
        scrollAdjustment: 10,

        maxLength: false,
        maxInsert: true,

        repeatDelay: 500,

        repeatRate: 20,
        resetDefault: false,
        openOn: 'focus',
        //  closeOn: 'blur',
        keyBinding: 'mousedown touchstart',

        useWheel: true,

        useCombos: false,
        /*
        combos: {
            '<': {
                3: '\u2665'
            }, // turn <3 into ♥ - change regex below
            'a': {
                e: '\u00e6'
            }, // ae ligature
            'A': {
                E: '\u00c6'
            },
            'o': {
                e: '\u0153'
            }, // oe ligature
            'O': {
                E: '\u0152'
            }
        },*/


        initialized: function() {}, // e, keyboard, el
        beforeVisible: function() {}, // e, keyboard, el
        visible: function() {}, // e, keyboard, el
        change: function() { // e, keyboard, el
            if (onChangeEvent) {
                onChangeEvent();
            }
            // country selector uses another jquery plugin, which does not recognize the input event from virtual keyboard,
            // we just need to trigger the search method from autocomplete to trigger filtering
            if (isCountrySelector) {
                $(elementObj).autocomplete('search', $(elementObj).val());
                // workaround to fix css updating for nationality in yotel..need to fire the scope.showingAutoComplete
                angular.element(elementObj).scope().showingAutoComplete();
            }
            if (id === 'country-id') {
                $(elementObj[0]).scope().selectedCountry.searchInput = $(elementObj[0]).val();
            }

        },
        beforeClose: function(e, keyboard, el, accepted) {
            if (isCountrySelector && 'ontouchstart' in window) { // only for touchscreen devices
                var beforeCloseVal = $(elementObj).val();

                setTimeout(function() {
                    $(elementObj).autocomplete('search', beforeCloseVal);
                }, 0);

                setTimeout(function() {
                    if (elementObj.getkeyboard().isOpen || id === 'country-selector-input') {
                        try {
                            elementObj.getkeyboard().accept(true);
                        } catch (err) {
                            elementObj.getkeyboard().close();
                        }
                    }
                }, 100);
            }
            applyKeyboardInput();
        },
        accepted: function() { // e, keyboard, el
            applyKeyboardInput();
        },
        inactive: function() {}, // e, keyboard, el
        canceled: function() { // e, keyboard, el
            applyKeyboardInput();
        },
        restricted: function() {}, // e, keyboard, el
        hidden: function() {}, // event, keyboard, el
        switchInput: function() {}, // keyboard, goToNext, isAccepted

        validate: function() { // keyboard, value, isClosing
            return true;
        }
    };

    if (zestStationNonPasswordField && !zestStationNumDaysField && !zestStationNationalityField) {
        // custom keyboard for zest station
        keyboardOptions.customLayout.default = keyboardOptions.customLayout.station_keyboard;
        $('.ui-keyboard').removeClass('top-align-keyboard');
        $('.ui-keyboard').removeClass('station-admin-align-keyboard');
    } else if (zestStationNumDaysField) {
        // number of days keyboard, only number input with backspace button
        keyboardOptions.customLayout.default = keyboardOptions.customLayout.station_num_keyboard;
        $('.ui-keyboard').addClass('top-align-keyboard');
        if (isAdminNumberField(id)) {
            $('.ui-keyboard').addClass('station-admin-align-keyboard');

        }

    } else if (zestStationNationalityField) {
        // number of days keyboard, only number input with backspace button
        keyboardOptions.customLayout.default = keyboardOptions.customLayout.station_keyboard_no_numbers;
        $('.ui-keyboard').addClass('bottom-align-keyboard');
    }
    var focused = $('#' + id),
        isCountrySelector = id === 'country-selector-input';

    elementObj = $(focused);


    /*
     * if the keyboard is used in conjunction with the autocomplete jquery plugin, then
     * it should be configured slightly differently...
     */
    if (isCountrySelector) {
        keyboardOptions.ignoreEsc = true;
    }
    elementObj.keyboard(keyboardOptions);

    if (from === 'login') {
        keyboardOptions.display.bksp = '\u2421:Backspace';
    }


    this.focusHandler = function() {
        elementObj.getkeyboard();
    };

    this.blurHandler = function() {
        if (isCountrySelector) {
            focused = $('#' + id);
            elementObj = $(focused);
        }

        if (elementObj.getkeyboard().isOpen) {
            try {
                elementObj.getkeyboard().accept(true);
            } catch (err) {
                elementObj.getkeyboard().close();
            }
        }
        scrollContentsDown();

    };
    elementObj.focus(this.focusHandler).blur(this.blurHandler).keydown(function(e) {
        if (e.keyCode === 13) { // enter
            that.blurHandler();
        }
    });

    return that;
};
