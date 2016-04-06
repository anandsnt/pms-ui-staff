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

this.initScreenKeyboardListener = function(from, id, show){
    var that = this;
    this.bound = false;
            //open virtual keyboard
            $.keyboard.language.love = $.extend($.keyboard.language.en);
            
            var focused = $('#'+id);
            var defaultLayout, shift, zestStationNonPasswordField;
            isPasswordField = function(i){
                if (i && i.indexOf('pass')!=-1){
                    return true;
                } else return false;
            };
            
            if (from === 'login' || isPasswordField(id)){
                defaultLayout = 'default';
                shift = '{shift}';
                zestStationNonPasswordField = false;
            } else {
                zestStationNonPasswordField = true;
                defaultLayout = 'station_keyboard';
                shift = '';
            }
            
            var keyboardOptions = {
                language: ['love'],
                rtl: false,
                //layout: 'qwerty',
                layout: defaultLayout,
                customLayout: {
                  'default': [
                          '1 2 3 4 5 6 7 8 9 0',
                          'q w e r t y u i o p {bksp}',
                          "a s d f g h j k l ' @",
                          'z x c v b n m . +',
                          shift+' {space} _ - .com'
                  ],
                  'station_keyboard': [
                          '1 2 3 4 5 6 7 8 9 0',
                          'Q W E R T Y U I O P {bksp}',
                          "A S D F G H J K L ' @",
                          'Z X C V B N M . +',
                          shift+' {space} _ - .com'
                  ],
                  'shift': [//zest station on screen is always caps,default to this
                          '! @ # $ % ^ & * ( )',
                          'Q W E R T Y U I O P {bksp}',
                          "A S D F G H J K L ' @",
                          'Z X C V B N M . +',
                          shift+' {space} _ - .com'
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
                  'bksp': '\Del:Backspace',
                  //'bksp': '\u2421:Backspace',
                  //'bksp': '\u2421:Backspace',
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

                useCombos: true,
                combos: {
                  '<': {
                    3: '\u2665'
                  }, // turn <3 into ♥ - change regex below
                  'a': {
                    e: "\u00e6"
                  }, // ae ligature
                  'A': {
                    E: "\u00c6"
                  },
                  'o': {
                    e: "\u0153"
                  }, // oe ligature
                  'O': {
                    E: "\u0152"
                  }
                },

                initialized: function(e, keyboard, el) {
                    
                    console.log('initialized')
                },
                beforeVisible: function(e, keyboard, el) {
                    
                    console.log('beforeVisible')
                },
                visible: function(e, keyboard, el) {
                    
                    console.log('visible')
                },
                change: function(e, keyboard, el) {
                    
                    console.log('change')
                    //console.log($('#'+id).val());
                },
                beforeClose: function(e, keyboard, el, accepted) {
                    console.log('beforeClose')
                },
                accepted: function(e, keyboard, el) {
                    console.log('accepted')
                },
                inactive: function(e, keyboard, el) {},
                canceled: function(e, keyboard, el) {
                    console.log('canceled')
                },
                restricted: function(e, keyboard, el) {
                    
                    console.log('restricted')
                },
                hidden: function(event, keyboard, el){
                    console.log('hidden')
                 },
                switchInput: function(keyboard, goToNext, isAccepted) {
                    console.log('switchInput')
                },

                validate: function(keyboard, value, isClosing) {
                  return true;
                }
            };
                    
            
            if (zestStationNonPasswordField){
                keyboardOptions.customLayout.default = keyboardOptions.customLayout.station_keyboard;
            }
            
            $(focused).keyboard(keyboardOptions);
    
    
    
    
    
    
    
    
    
    
        this.focusHandler = function(){
            var focused = $('#'+id);
            $(focused).getkeyboard();
        };
    
        this.blurHandler = function(){
            var focused = $('#'+id);
            $(focused).getkeyboard().accept(true);
       };
        var focused = $('#'+id);
        $(focused).focus(this.focusHandler).blur(this.blurHandler).keydown(function (e) {
            if (e.keyCode == 13) {//enter
              that.blurHandler();
            }
        });

        return that;
};
