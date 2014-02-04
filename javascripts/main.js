// Disable cache busting
$.ajaxSetup({ cache: true });

// Equal heights
$.fn.maximize = function(size) {
    var max = Math.max.apply(Math, jQuery.map(this, function (e) {
        return jQuery(e).height();
    }));

    this[size](max);
};
$(document).ready(function(){
	if (localStorage.email) {
		$("#email").val(localStorage.email);
	}
	$("#loginbutton").click(function(){
		localStorage.email = $("#email").val();
		$( "#login_form" ).submit();
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
    var fileInput = $('input[type="file"]:not(.hidden)'),
        label = '<span class="input">Choose file ...</span>',
        button = '<button type="button" class="button inline blue">Attach file</button>';

    if (fileInput.length) {
        fileInput.each(function(){
            $(this)
                .before(label)
                .change(function(){
                    $(this).parent('.file-upload').children('.input').text($(this).val());
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
function resizeInput() {
    $(this).attr('size', $(this).val().length);
}

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
        error: function(){
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

    // Styled form elements - on load
    styleCheckboxRadio();
    onOffSwitch();   
    setupFile();

    // Styled form elements - on dom inserted
    $(document).ajaxComplete(function() {
        styleCheckboxRadio();
        onOffSwitch();
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
    
    // Styled form elements - on click
    $(document).on('click', '.checkbox, .radio', function(e){
        e.stopImmediatePropagation();
        styleCheckboxRadio();
    });

    $(document).on('click', '.switch-button', function(e){
        e.stopImmediatePropagation();
        onOffSwitch();
    });

    $(document).on('change', 'select.styled', function(e){
        e.stopImmediatePropagation();
        $(this).updateStyledSelect();
    });

    // Enable some parts of form
    // TODO - fire this after valid email address is added, not on keyup!
    $(document).on('keyup', 'input[data-enable]', function(e){
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
        if($('.masked-input').length)
            $('.masked-input').keyup(resizeInput).each(resizeInput);
    });

    // Resize masked inputs to match content width
    $(document).on('focus', '.masked-input', function(){
        $(this).addClass('active');
    }).on('focusout', '.masked-input', function(){
        $(this).removeClass('active');
    }).on('change', '.masked-input', function(e){
        e.stopImmediatePropagation();
        
        // TODO - fire this when changes are actually saved, not just on value change
        // Feedback on change
        //modalInit('modals/alerts/changes-saved/', 1000);
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
        }
        // Close
        else
        {
            $(this).removeClass('active');
            $(this).children('.icons').removeClass('active');
            $toggleContent.add(function(){ $('.container').addClass($closingClass); } );
            $toggleContent.add(function(){ $('.container').removeClass($openClass).removeClass($closingClass); }, $delay);
        }

        // Conversations toggle
        if ($(this).parent('.has-conversation').length){
            $(this).parent('.has-conversation').toggleClass('conversation-open');
        }

        $($target).toggleClass('hidden');
        $toggleContent.start();

        // Refresh scrolls is they exist
        if (pageScroll) { refreshPageScroll(); }
        if (viewScroll) { refreshViewScroll(); }
        if (guestCardScroll) { refreshGuestCardScroll(); }
        if (registrationScroll) { refreshRegistrationScroll(); }
        if (horizontalScroll) { refreshHorizontalScroll(); }
    });

    // Main menu toggle
    $(document).on('click', '.nav-toggle', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

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
    $(document).on('keyup', '#query', function(){
        // Clear button visibility toggle
        if($.trim($('#query').val()) !== '') {
            $('#clear-query:not(.visible)').addClass('visible');
        } else {
            $('#clear-query.visible').removeClass('visible');
        }
    });
});