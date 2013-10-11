// Disable cache busting as we load this file via $.getScript function on different screens. Set false during development
$.ajaxSetup({
    cache: false
});

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

        if(!$('.checkbox .icon-form').length)
        {
            $(checkBox).prepend('<span class="icon-form icon-checkbox" />');
        }

        $(checkBox).each(function(){
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

        if(!$('.radio .icon-form').length)
        {
            $(radio).prepend('<span class="icon-form icon-radio" />');
        }

        $(radio).each(function(){
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
    var onOff = '.switch-button',
        onOffChecked = 'on',
        onOffDisabled = 'disabled',
        onOffInput = onOff + ' input[type="checkbox"]',
        text = onOff + ' .value',
        textOn = $(onOff).attr('data-on'),
        textOff = $(onOff).attr('data-off');

    if ($(onOffInput).length) { 
        $(onOff).removeClass(onOffChecked);
        $(text).text(textOff);

        $(onOffInput + ':checked').each(function(){
            $(this).parent(onOff).addClass(onOffChecked)
            $(text).text(textOn);
        });

        $(onOffInput + ':disabled').each(function(){
            $(this).parent(onOff).addClass(onOffDisabled);
            $(text).text('');
        });
    }
};

// Resize masked inputs
function resizeInput() {
    $(this).attr('size', $(this).val().length);
}

// Modal window
function modalInit(content) {
    // Close modal
    $(document).on('click', '#modal-overlay, #modal-close', function(e){
        e.stopPropagation();
        removeModal();
    });       
}

 // Remove modal
    function removeModal() {
        $('#modal, #modal-overlay').removeClass('modal-show'); 
        setTimeout(function() { 
            $('#modal').empty();
        }, 150);
    }
// Show modal
    function setModal(){
        if ($('#modal').length) 
        { 
            $('#modal').empty(); 
        }
        else 
        { 
            $($modal).prependTo('body'); 
        }

        if (!$('#modal-overlay').length) 
        { 
            $($overlay).insertAfter('#modal'); 
        }

        setTimeout(function() {
            $('#modal, #modal-overlay').addClass('modal-show');
        }, 0);
    }
// Fast click polyfill
window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

$(function($){ 

    // Styled form elements - on load
    styleCheckboxRadio();
    onOffSwitch();   

    // Styled form elements - on click
    $(document).on('click', '.checkbox, .radio', function(e){
        e.stopPropagation();
        styleCheckboxRadio();
    });

    $(document).on('click', '.switch-button', function(e){
        e.stopPropagation();
        onOffSwitch();
    });

    $(document).on('change', 'select.styled', function(e){
        e.stopImmediatePropagation();
        $(this).updateStyledSelect();
    });
    
    // Resize masked inputs to match content width
    $(document).on('focus', '.masked-input', function(){
        $('.masked-input').addClass('active');
    }).on('focusout', '.masked-input', function(){
        $('.masked-input').removeClass('active');
    }).on('change', '.masked-input', function(){
        alert("Changes are saved!");
    });

    $('.masked-input').keyup(resizeInput).each(resizeInput);
});

//Update data for custom selects
$.fn.updateStyledSelect = function() {
    var i,j,
        select = this,
        selectedOption = select.find('option:selected')
,
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

//Toggle hidden content
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
            $('.container').addClass($openClass); 
        }
    }
    // Close
    else
    {
        $(this).removeClass('active');
        $toggleContent.add(function(){ $('.container').addClass($closingClass); } );
        $toggleContent.add(function(){ $('.container').removeClass($openClass).removeClass($closingClass); }, $delay);
    }

    $($target).toggleClass('hidden');
    $toggleContent.start();

    // Refresh scrolls
    if (pageScroll) { refreshPageScroll(); }
    if (viewScroll) { refreshViewScroll(); }
    if (guestCardScroll) { refreshGuestCardScroll(); }
    if (registrationScroll) { refreshRegistrationScroll(); }
    if (horizontalScroll) { refreshHorizontalScroll(); }
});