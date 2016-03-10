 angular.module('touchPress', []).directive('touchPress', function($timeout, $parse) {
  return {
    restrict: 'AE',
    link: function(scope, element, attrs, opt) {
         element.bind('tap touchend click', function(event) {
             try {
                if (element){
                    if (arguments[0].target.nodeName === 'INPUT'){
                        element.focus(); 
                    }
                }
             } catch(err){
                 
             }
             //bind any touch start event to the element
             if (typeof event === typeof {}){
                if (event.preventDefault){
                    event.preventDefault();
                }
                if (event.stopPropagation){
                    event.stopPropagation();
                }
                
            }
            scope.$apply(attrs['touchPress']);
      });
      
      
      
      
  var simulateTyping = "Hello World!!1\b <3";
  
  $.keyboard.language.love = $.extend($.keyboard.language.en);
      $('[type="text"]').keyboard({
      language: ['love'],
      rtl: false,

      layout: 'qwerty',
      customLayout: {
        'default': [
          'd e f a u l t',
          '{meta1} {meta2} {accept} {cancel}'
        ],
        'meta1': [
          'm y m e t a 1',
          '{meta1} {meta2} {accept} {cancel}'
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

      usePreview: true,

      alwaysOpen: false,

      initialFocus: true,
      noFocus: false,
      stayOpen: false,

      ignoreEsc: false,
      display: {
        'meta1': '\u2666', // Diamond
        'meta2': '\u2665', // Heart

        // check mark (accept)
        'a': '\u2714:Accept (Shift-Enter)',
        'accept': 'Accept:Accept (Shift-Enter)',
        'alt': 'AltGr:Alternate Graphemes',
        // Left arrow (same as &larr;)
        'b': '\u2190:Backspace',
        'bksp': 'Bksp:Backspace',
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
        'shift': 'Shift:Shift',
        // +/- sign for num pad
        'sign': '\u00b1:Change Sign',
        'space': '\u00a0:Space',
        // right arrow to bar
        // \u21b9 is the true tab symbol
        't': '\u21e5:Tab',
        'tab': '\u21e5 Tab:Tab',
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

      autoAccept: false,
      autoAcceptOnEsc: false,
      lockInput: false,
      restrictInput: false,
      restrictInclude: '', // e.g. 'a b foo \ud83d\ude38'
      acceptValid: true,
      cancelClose: true,
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

      initialized: function(e, keyboard, el) {},
      beforeVisible: function(e, keyboard, el) {},
      visible: function(e, keyboard, el) {},
      change: function(e, keyboard, el) {},
      beforeClose: function(e, keyboard, el, accepted) {},
      accepted: function(e, keyboard, el) {},
      canceled: function(e, keyboard, el) {},
      restricted: function(e, keyboard, el) {},
      hidden: function(e, keyboard, el) {},

      switchInput: function(keyboard, goToNext, isAccepted) {},

      validate: function(keyboard, value, isClosing) {
        return true;
      }

    })
    // activate the typing extension
    .addTyping({
      showTyping: true,
      delay: 250
    });


  $('#icon').click(function() {
    var kb = $('[type="text"]').getkeyboard();
    // typeIn( text, delay, callback );
    
  });

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      

    }
    
    
    
    
  };
});