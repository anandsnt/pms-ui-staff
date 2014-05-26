// Orientation change and touchmove listeners
document.addEventListener('orientationchange', function (e) { $('body').css("height",window.innerHeight); }, false);

/**
*   DO NOT USE THIS - CANT SCROLL ANY SCREEENS IN IPHONE!!!!
*   
*   Rather stop it on required element - that includes a scroll!!
*
*   document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
*/

// Disable cache busting
$.ajaxSetup({ cache: true });
$(document).ready(function(){
	if (localStorage.email) {
		$("#email").val(localStorage.email);
	}
	$("#loginbutton").click(function(){
		$("#login-form").submit();
	});
    $("#login-form").submit(function(){
        localStorage.email = $("#email").val();
        return true;        
    });

	if($('#login').is(':has(span.notice)')){
		$("#loginStatus").css("display","block");
	}
    $("#login-form").ready(function(){

        // stop bounce effect only on the login container
        $( '#login-page .container' ).on('touchmove', function (e) {
            e.stopPropagation();
        });

        var $isTablet = navigator.userAgent.match(/Android|iPad/i) != null;  
        //for keyboard not raising issue in Ipad/android tabs
        // in tabs especially in IPad .focus is creating the pblm of not showing keyboard        
        if(!$isTablet){             
            if($.trim($("#email").val()) != ""){
                $("#password").focus();
            } else {
                $("#email").focus();
            } 
        }
        else{
            if($.trim($("#email").val()) != ""){
                $("#password").click();
            } else {
                $("#email").click();
            }             
        }
        if('ontouchstart' in document.documentElement) { 
            $("#email").on('touchstart', function(){
                $("#email").click();
            });                        
            $("#password").on('touchstart', function(){
                $("#password").click();              
            }); 
        } 
    });

});

// Chaining with intervals
var chainedAnimation = function(){
    var This = this;
    this._timeoutHandler = null;    
    this.chain = new Array();
    this.currentStep = 0;
    this.isRunning = false;
    this.nextStep = function(){
        This.currentStep = This.currentStep +1;
        if (This.currentStep == This.chain.length)
        {
            This.stop();
        }else
        {
            This.processCurrentStep();
        }
    },
    this.processCurrentStep = function(){
        This._timeoutHandler = window.setTimeout(function(){
            This.chain[This.currentStep].func();
            This.nextStep();
        },This.chain[This.currentStep].time);
    },
    this.start =function(){
        if (This.chain.length == 0)
        {
            return;
        }
        if (This.isRunning == true)
        {
            return;
        }
        This.isRunning = true;
        This.currentStep = 0;
        This.processCurrentStep();
    },
    this.stop = function(){
        This.isRunning = false;
        window.clearTimeout(This._timeoutHandler)
    },
    this.add = function(_function,_timeout){
        This.chain[This.chain.length] = {func : _function, time : _timeout};
    };
};

// Custom checkbox and radios
function styleCheckboxRadio() {
    var checkBox = '.checkbox',
        checkBoxInput = checkBox + ' input[type="checkbox"]',
        checkBoxChecked = 'checked',
        checkBoxDisabled = 'disabled',
        radio = '.radio',
        radioInput = radio + ' input[type="radio"]',
        radioOn = 'checked',
        radioDisabled = 'disabled';

    // Checkboxes
    if ($(checkBoxInput).length) {

        $(checkBox).each(function(){
            
            if(!$(this).children('.icon-form').length)
            {
                $(checkBox).prepend('<span class="icon-form icon-checkbox" />');
            }

            $(this).removeClass(checkBoxChecked);
            $(this).find('.icon-form').removeClass(checkBoxChecked);
        });

        $(checkBoxInput + ':checked').each(function(){
            $(this).parent(checkBox).addClass(checkBoxChecked);
            $(this).prevAll('.icon-form').addClass(checkBoxChecked);
        });
        $(checkBoxInput + ':disabled').each(function(){
            $(this).parent(checkBox).addClass(checkBoxDisabled);
            $(this).prevAll('.icon-form').addClass(checkBoxDisabled);
        });
    };

    // Radios
    if ($(radioInput).length) {

        $(radio).each(function(){
            if(!$(this).children('.icon-form').length)
            {
                $(radio).prepend('<span class="icon-form icon-radio" />');
            }

            $(this).removeClass(radioOn);
            $(this).find('.icon-form').removeClass(radioOn);
        });

        $(radioInput + ':checked').each(function(){
            $(this).parent(radio).addClass(radioOn);
            $(this).prevAll('.icon-form').addClass(radioOn);
        });
        $(radioInput + ':disabled').each(function(){
            $(this).parent(radio).addClass(radioDisabled);
            $(this).prevAll('.icon-form').addClass(radioDisabled);
        });
    };
};

// Custom on-off checkbox
function onOffSwitch() {
    var onOffSwitch = '.switch-button';

    $(onOffSwitch).each(function(){
        var onOff = $(this),
            onOffChecked = 'on',
            onOffDisabled = 'disabled',
            onOffInput = 'input[type="checkbox"]';

        if (onOff.children(onOffInput).length) {
            onOff.removeClass(onOffChecked);

            onOff.children(onOffInput + ':checked').each(function(){
                onOff.addClass(onOffChecked);
            });

            onOff.children(onOffInput + ':disabled').each(function(){
                onOff.addClass(onOffDisabled);
            });
        }
    });
};

// Custom file upload
function setupFile(){
    var fileInput = $('input[type="file"]:not(.hidden)');
        label = '<span class="input">Choose file ...</span>';
    if (fileInput.length) {
        fileInput.each(function(){
			// Display custom label if provided
			var customLabel = $(this).attr('label')			
			if (customLabel) label = '<span class="input">' + customLabel + '</span>';
			if(!$(this).siblings().hasClass('input')){
            	$(this).before(label);
            } 
            $(this).change(function(){
                    $(this).parent('.file-upload').children('.input').text($(this).val().replace('C:\\fakepath\\', ''));
            });
        });
    };
};

// Update data for custom selects
$.fn.updateStyledSelect = function() {
    var i,j,
        select = this,
        selectedOption = select.find('option:selected'),
        selectDisabled = 'disabled',
        attrArray = $(selectedOption).map(function() {
            return [
                $.map($(this).data(), function(value, index) {
                    return index + '=' + value;
                })
            ];
        }).get(),
        attrString = attrArray.toString(),
        attributes = attrString.split(','),
        image = $.inArray('image', attributes) > -1;;
        
    // Loop trough all attributes and update mathching data
    for (i = 0, l = attributes.length; i < l; i++) 
    {
        var attrSplitted = attributes[i].split('='),
            attrIndex = attrSplitted[0],
            attrValue = attrSplitted[1];

        // Update all textual data that matches the selected option's data-* array
        this.next('.selected').find('.value.' + attrIndex).text(attrValue);
    }

    // Check if image data exists and update
    if (selectedOption.data('image'))
    {
        this.next('.selected').find('img').attr({'src': 'assets/' + selectedOption.data('image')});
    }
};

// Resize masked inputs
$.fn.autoGrowInput = function(o) {
    o = $.extend({
        maxWidth: 1000,
        minWidth: 0,
        comfortZone: 70
    }, o);

    this.filter('.masked-input').each(function(){
        var input = $(this);

        // Add data-size
        input.attr('data-size', input.val().length);

        var minWidth = o.minWidth || $(this).width(),
            val = '',
            testSubject = $('<tester/>').css({
                position: 'absolute',
                top: -9999,
                left: -9999,
                width: 'auto',
                fontSize: input.css('fontSize'),
                fontFamily: input.css('fontFamily'),
                fontWeight: input.css('fontWeight'),
                letterSpacing: input.css('letterSpacing'),
                whiteSpace: 'nowrap'
            });
            check = function() {

                if (val === (val = input.val())) { 
                    input.attr('data-size', input.val().length);
                    return; 
                }

                // Enter new content into testSubject
                var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                testSubject.html(escaped);

                // Calculate new width + whether to change
                var testerWidth = testSubject.width(),
                    newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
                    currentWidth = input.width(),
                    isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                         || (newWidth > minWidth && newWidth < o.maxWidth);

                // Animate width
                if (isValidWidthChange) {
                    input.width(newWidth);
                    input.attr('data-size', input.val().length);
                }
            };
        testSubject.insertAfter(input);
        $(this).bind('keyup change paste blur update', check).bind('keydown', function() {
            setTimeout(check);
        });
        check();
    });
    return this;
};

// Modal window
function modalInit(content, closeAfter, position, lock) {

    var $url = content,
        $modal = '<div id="modal" role="dialog" />',
        $overlay = '<div id="modal-overlay" />';

    // Get modal data
    $.ajax({
        url: $url,
        success: function(data) {
            setModal();
            $('#modal').html(data);
        },
        error: function(jqxhr, status, error){
            if (jqxhr.status=="401") { sntapp.logout(); return;}
            if (jqxhr.status=="503" || jqxhr.status=="500") {
                location.href = XHR_STATUS.INTERNAL_SERVER_ERROR;
                return;
            }

            if(jqxhr.status=="422"){
                location.href = XHR_STATUS.REJECTED;
                return;
            }

            if(jqxhr.status=="404"){
                location.href = XHR_STATUS.SERVER_DOWN;
                return;
            }
        }
    });

    // Close modal on click
    $(document).on('click', '#modal-overlay:not(.locked), .modal-close', function(e){
        e.stopPropagation();
        removeModal();
    });

    // Close modal on delay
    if (closeAfter != null)
    {
         setTimeout(function() { 
            removeModal();
        }, closeAfter);
    }

    // Show modal
    function setModal(){
        if ($('#modal').length) 
        { 
            $('#modal').removeClass('modal-show').empty();  
        }
        else 
        { 
            $($modal).prependTo('body'); 
        }

        if (!$('#modal-overlay').length) 
        { 
            $($overlay).insertAfter('#modal'); 
        }

        // Check if modal should be locked
        if (lock)
        {
            $('#modal-overlay').addClass('locked');
        }
        else
        {
            $('#modal-overlay').removeClass('locked');
        }

        // Check if modal should be repositioned
        if(position)
        {
            $('#modal').attr('data-position', position).draggable();
        }
        else
        {
            $('#modal').removeAttr('data-position');
        }

        // Display modal
        setTimeout(function() {
            $('#modal, #modal-overlay').addClass('modal-show');
        }, 150);
    }

    // Remove modal
    function removeModal() {
        $('#modal, #modal-overlay').removeClass('modal-show'); 
        setTimeout(function() { 
            $('#modal, #modal-overlay').remove();
        }, 150);
    }
}

$(function($){ 

    // FastClick - eliminate the 300ms delay between a physical tap and the firing of a click event on mobile browsers
    FastClick.attach(document.body);

    // iPad Virtual Keyboard screen scroll
    var $isTablet = navigator.userAgent.match(/Android|iPad/i) != null;

    if ($isTablet) {
        // Enable keyboard to shift content to the top
        $('body:not(#login-page)').css('height',window.innerHeight);

        // Disable keyboard content shifting
        $(document).on('focus', '[data-keyboard=lock]', function() {
            window.scrollTo(0, 0);
            if ($('#modal').length) { 
                $('#modal').addClass('keyboard-lock');
            }
        }).on('focusout', '[data-keyboard=lock]', function(){
            if ($('#modal').length) { 
                $('#modal').removeClass('keyboard-lock');
            }
        });

        // Enable touchmove on admin layouts
        if (!$('body#app-page').length)
        {
            var contentHolder = document.getElementsByClassName('content');

            for(var i = 0, j=contentHolder.length; i<j; i++){
                contentHolder[i].addEventListener('touchmove', function(e){e.stopPropagation()}, false);
            }
        }
    }

    // Styled form elements - on load
    styleCheckboxRadio();
    onOffSwitch();   
    setupFile();

    // Styled form elements - on dom inserted
    $(document).ajaxComplete(function() {
        styleCheckboxRadio();
        onOffSwitch();
        setupFile();
    });

    // Styled form elements - on click
    $(document).on('click', '.checkbox, .radio', function(e){
        e.stopImmediatePropagation();
        styleCheckboxRadio();
    });

    // Styled checkbox groups
    $(document).on('change', 'input:checkbox', function(e){
        var $group = $(this).attr('data-group'),
            $groupItem = 'input:checkbox[data-group='+$group+']';

        if ($group)
        {
            $($groupItem).not($(this)).attr('checked',false);
            $(this).attr('checked', $(this).attr('checked'));
            styleCheckboxRadio();
        }        
    });

    // Styled on-off switch checkbox
    $(document).on('click', '.switch-button', function(e){
        e.stopImmediatePropagation();
        onOffSwitch();
    });

    // Styled select box
    $(document).on('change', 'select.styled', function(e){
        $(this).updateStyledSelect();
    });

    // Fix Chrome iOS scroller drop-down bug and force blur on change, Rover only
    if ($('body#app-page').length) {
        $(document).on('change', 'select', function(e){
            $(this).blur();
        }).on('focus', 'select', function(e){
            for (var i = 0; i < verticalScroll.length; i++) {
                verticalScroll[i].initiated = 0;
            }
            for (var i = 0; i < horizontalScroll.length; i++) {
                horizontalScroll[i].initiated = 0;
            }
        });
    } 

    // Enable some parts of form
    // TODO - fire this after valid email address is added, not on keyup!
    $(document).on('keyup change paste', 'input[data-enable]', function(e){
        e.stopImmediatePropagation();
        var $target = $(this).attr('data-enable');

        $('#' + $target).removeClass('is-disabled').find('[disabled]').removeAttr('disabled');
    });

    // Clear form
    $(document).on('click', '.clear-selection', function(e){
        e.stopImmediatePropagation();

        $('input[type="radio"], input[type="checkbox"]').removeAttr('checked');
        styleCheckboxRadio();
    });

    // Remove focus from readonly inputs
    $(document).on('focus', 'input, textarea', function(){
        var $readonly = $(this).attr('readonly');
        if ($readonly) {
            $(this).blur();
        }
    });

    // Check if selected value is placeholder value
    $(document).on('change', 'select:not(.styled)', function(e){
        e.stopImmediatePropagation();
        var $selected = $(this).find('option:selected');

        if ($selected.val() == '')
        {
            $(this).addClass('placeholder');
        }
        else
        {
            $(this).removeClass('placeholder');
        }
    });

    // Masked input
    $(document).ajaxComplete(function() {
        $('.masked-input').autoGrowInput({
            comfortZone: 5,
            minWidth: 20,
            maxWidth: 300
        });
    });

    // Resize masked inputs to match content width
    $(document).on('focus', '.masked-input', function(){
        $(this).addClass('active');
    }).on('focusout', '.masked-input', function(){
        $(this).removeClass('active');
    });
      
    // Dialog window
    $(document).on('click', '.open-modal', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        var $href = $(this).attr('href'),
            $action = $(this).closest('form').attr('action'),
            $duration = $(this).attr('data-duration'),
            $position = $(this).attr('data-position'),
            $lockScreen = $(this).attr('data-lock');

        modalInit($href ? $href : $action, $duration, $position, $lockScreen);
    }); 

    // Toggle hidden content
    $(document).on('click', '.toggle', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var $toggleContent = new chainedAnimation(),
            $delay = 300,
            $target = $(this).attr('href'),
            $targetClass = $target.split('#'),
            $openClass = $targetClass[1] + '-open',
            $closingClass = $targetClass[1] + '-closing';


        // Open
        if (!$(this).hasClass('active'))
        {
            // Simple Open - show this target
            if (!$(this).hasClass('dual-toggle'))
            {
                $(this).addClass('active');
                $(this).children('.icons').addClass('active');
                $toggleContent.add(function(){ $('.container').addClass($openClass); });
            }
            // Complex Open - close previous target, then open this target
            else
            {
                var $itemsClass = $($target).attr('class').split(' '),
                    $prevItemClass = $itemsClass[0],
                    $prevItem = $('.' + $prevItemClass + ':not(.hidden)').attr('id');

                // Close prev
                $(this).parent().siblings().find('.dual-toggle.active').removeClass('active');
                $('#' + $prevItem).addClass('hidden');

                // Open this
                $(this).addClass('active');
                $(this).children('.icons').addClass('active');
                $('.container').addClass($openClass); 
            }

            // Check if there are other linked toggle buttons
            if ($(this).hasClass('linked-toggle')){
                $('.linked-toggle:visible').each(function(){
                    $(this).addClass('active');
                    $(this).children('.icons').addClass('active');
                });
            }
        }
        // Close
        else
        {
            $(this).removeClass('active');
            $(this).children('.icons').removeClass('active');
            $toggleContent.add(function(){ $('.container').addClass($closingClass); } );
            $toggleContent.add(function(){ $('.container').removeClass($openClass).removeClass($closingClass); }, $delay);

            // Check if there are other linked toggle buttons
            if ($(this).hasClass('linked-toggle')){
                $('.linked-toggle.active:visible').each(function(){
                    $(this).removeClass('active');
                    $(this).children('.icons').removeClass('active');
                });
            }
        }

        // Conversations toggle
        if ($(this).parent('.has-conversation').length){
            $(this).parent('.has-conversation').toggleClass('conversation-open');
        }

        $($target).toggleClass('hidden');
        $toggleContent.start();

        // Refresh scrolls
        refreshVerticalScroll();
        refreshHorizontalScroll();
    });

    // Main menu toggle
    $(document).on('click', '.nav-toggle', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
		$('#main-menu').show(); //Added to fix issue CICO-4328.
        var $toggleNavigation = new chainedAnimation(),
            $delay = 150,
            $menuOpen = 'menu-open',
            $menuClosing = 'menu-closing';

        switch($(this).attr('class')){
            // Open navigation
            case 'nav-toggle':
                $(this).addClass('active');
                $toggleNavigation.add(function(){ $('.container').addClass($menuOpen); });
                break;

            // Close navigation
            case 'nav-toggle active':
                $(this).removeClass('active');
                $toggleNavigation.add(function(){ $('.container').addClass($menuClosing); } );
                $toggleNavigation.add(function(){ $('.container').removeClass($menuOpen).removeClass($menuClosing); }, $delay);
                break;
        }
        
        $toggleNavigation.start();
    });

    // Show clear search button
    $(document).on('keyup change paste', '#query', function(){
        // Clear button visibility toggle
        if($.trim($('#query').val()) !== '') {
            $('#clear-query:not(.visible)').addClass('visible');
        } else {
            $('#clear-query.visible').removeClass('visible');
        }
    });
});


/*
    START :: Auto logout after XX minutes
*/
/*
$(function() {
  var timer;
  
  function reset_timer() {
    window.clearInterval(timer);
    set_timeout();
  }
   
  function set_timeout() {
    timer = setInterval(logout, 1000 * 1 * 60); // 1 mins
  }
   
  function logout(){
    $.get('/timeout.json', function(force_logout){
      if (force_logout) {
        window.location = "/logout";
      }
    });
  }
  
  set_timeout();
  $(document).bind('mousemove click keypress scroll', reset_timer);
});
*/
/*
    END :: Auto logout after XX minutes
*/

