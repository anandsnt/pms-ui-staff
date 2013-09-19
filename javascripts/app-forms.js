// Custom checkbox and radios
function setupLabel() {
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

    // Custom checkbox and radios
    setupLabel();
    $(document).on('click', '.checkbox, .radio', function(){
         setupLabel();
    });

    // Dialog window
    $(document).on('click', '.open-modal', function(e){
        e.preventDefault();

        var $href = $(this).attr('href');
        modalInit($href);
    });

});