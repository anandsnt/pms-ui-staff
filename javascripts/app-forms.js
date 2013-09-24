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
            alert("Sorry, not there yet!");
        }
    });

    // Close modal
    $(document).on('click', '#modal-overlay, #modal-close', function(e){
        e.stopPropagation();
        removeModal();
    });

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

    // Remove modal
    function removeModal() {
        $('#modal, #modal-overlay').removeClass('modal-show'); 
        setTimeout(function() { 
            $('#modal').empty();
        }, 150);
    }
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

    // Resize masked inputs to match content width
    $(document).on('focus', '.masked-input', function(){
        $('.masked-input').addClass('active');
    }).on('focusout', '.masked-input', function(){
        $('.masked-input').removeClass('active');
    }).on('change', '.masked-input', function(){
        alert("Changes are saved!");
    });

    $('.masked-input').keyup(resizeInput).each(resizeInput);

    // Dialog window
    $(document).on('click', '.open-modal', function(e){
        e.preventDefault();

        var $href = $(this).attr('href');
        modalInit($href);
    }); 

});