// Load message
function loadMessage($this, $href){
    
    var $loader = '<div id="loading"><div id="loading-spinner" /></div>',
        $outTime = new Date().getTime(),    
        $activeTime = ($outTime - $('#messages .listing').find('li.active').data('timeActive'))/1000;

    // Check if it's not already active message
    if (!$(this).parent('li').hasClass('active'))
    {
        // Mark as read if active more than 3 seconds
        if ($activeTime > 3) {
            $('#messages .listing').find('li.active.unread').removeClass('unread');
        }

         // Load message on the right & mark as active on the left
        $($loader).prependTo('#messages .view-current .content-right').show(function(){
            $.ajax({
                type:       'GET',
                url:        $href,
                dataType:   'html',
                //timeout:    5000,
                success: function(data){
                    $('#messages .content-right').animate({opacity: 0}, 150, function(){
                        $(this).html(data);
                    }).animate({opacity: 1}, 150);
                },
                error: function(){
                    $('#loading').remove();
                    modalInit('modals/alerts/not-there-yet/');
                }
            }).done(function(){                
                $('#loading').fadeOut().remove();
                $('#messages .listing').find('li.active').removeClass('active');
                $($this).parent('li').addClass('active').data('timeActive', new Date().getTime());

                // Set scrolling
                if (viewScroll) { destroyViewScroll(); }
                setTimeout(function(){
                     createViewScroll('#messages-guests-conversations');

                    // Message details start at bottom
                    var $starAt = $('#messages-guests-conversations .wrapper').height();
                    viewScroll.scrollTo(0, parseInt(-$starAt), 10);
                }, 300);
            });
        });
    }
}

// Selected messages
function selectedMessages($this, $item){

    var $loader = '<div id="loading"><div id="loading-spinner" /></div>',
        $checkboxes = $('#messages .view-current .listing .checkbox input:checked').length,
        $selectionInfo = $('#messages #selection-info p');

    // Load if first selection
    if ($checkboxes == 0)
    {
        $('.content-right').html('<div class="no-content"><span class="icon-no-content icon-messages" /></div>');
    }
    if ($checkboxes == 1 && !$('#selection-info').length)
    {
         // Load message on the right & mark as active on the left
        $($loader).prependTo('#messages .view-current .content-right').show(function(){
            $.ajax({
                type:       'GET',
                url:        'messages/selected',
                dataType:   'html',
                //timeout:    5000,
                success: function(data){
                    $('#messages .content-right').animate({opacity: 0}, 150, function(){
                        $(this).html(data);
                    }).animate({opacity: 1}, 150);
                },
                error: function(){
                    $('#loading').remove();
                    modalInit('modals/alerts/not-there-yet/');
                }
            }).done(function(){                
                $('#loading').fadeOut().remove();
                $('#messages .listing').find('li.active').removeClass('active');
            });
        });
    }
    else if ($checkboxes == 2)
    {
        //$selectionInfo.html($selectionInfo.html().replace('conversation', 'conversations'));
        $('#messages #selection-info #count').text($checkboxes);
    }
    else {
        $('#messages #selection-info #count').text($checkboxes);
    }
}

// Stack messages
function stackConversationMessages(){
    
    var $listIndex = 66;
    $('#messages .listing li.unread, #messages .conversation > li').each(function() {
        $listIndex--;
        $(this).css('z-index', $listIndex);
    });
}

// Datepicker
function setDatepicker(){
    $('#messages .datepicker').datepicker({
        showOn      : 'button',
        dateFormat  : 'mm-dd-y',
        changeMonth : true,
        changeYear  : true,
        maxDate     : '+0D +0M +0Y',
        minDate     : '+0D -2M +0Y',
        yearRange   : '-1:+0',
        monthNamesShort: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        beforeShow: function(input, inst){
            // Insert overlay
            $('<div id="ui-datepicker-overlay" />').insertAfter('#ui-datepicker-div');
        },
        onClose: function(dateText, inst){ 
            $('#ui-datepicker-overlay').remove();
        }
    });
}


$(function($){ 
	
    // Filters
    $(document).on('click', '#messages .filters a', function(e){
        e.preventDefault();
    });

    // Datepicker
    setDatepicker();
    $(document).ajaxComplete(function() {
        setTimeout(function() {
            setDatepicker();
        }, 600);
    });

    // Stack messages
    stackConversationMessages();
    $(document).ajaxComplete(function() {
        setTimeout(function() {
            stackConversationMessages();
        }, 300);
    });
    
    // Set timing for active left side message
    $('#messages .listing li.active').each(function() {
        $(this).data('timeActive', new Date().getTime());
    });


    // Click on left side message checkbox
    $(document).on('change', '#messages .checkbox input', function(e){
        e.stopImmediatePropagation();

        var $item = $(this).closest('li').attr('id');
        $(this).closest('li').toggleClass('selected');
        selectedMessages(this, $item);
    });

    // Click on left side message
    $(document).on('click', '#messages .listing li a', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        var $href = $(this).attr('href')
            $item = $(this).parent('li').attr('id'),
            $checkboxes = $('#messages .listing .checkbox input:checked').length;
        
        if ($checkboxes == 0)
        {
            // Load message
            loadMessage(this, $href);
        }
        else
        {
            // Select messages
            /*$(this).prev('.checkbox').addClass('checked').find('input').attr('checked', true).prev('.icon-form').addClass('checked');
            $(this).closest('li').addClass('selected');
            selectedMessages(this, $item);*/
        }
    });

    // Click on right side collapsed message
    $(document).on('click', '#messages .conversation li:not(:last-child):not(.conversation-break) .summary', function(e){
        $(this).parent('li').toggleClass('open');

        if ($('#messages-guests-conversations .wrapper').attr('style') !== undefined) {
            var $style = $('#messages-guests-conversations .wrapper').attr('style').split('transform: translate('),
                $translate = $style[1].split(')')[0],
                $current = $translate.split(',')[1],
                $target = $current.split('px')[0];

            // Reset scroll and keep it on clicked item position
            if (viewScroll) { destroyViewScroll(); }
            createViewScroll('#messages-guests-conversations');
            viewScroll.scrollTo(0, parseInt($target));
        } else {
            // Reset scroll
            if (viewScroll) { destroyViewScroll(); }
            createViewScroll('#messages-guests-conversations');
        }        
    });

    // Click on right side multiple collapsed messages
    $(document).on('click', '#messages .conversation-break em', function(e){
        $('#messages .conversation-break').remove();
        $('#messages .conversation li.hidden').removeClass('hidden');
       
        // Set scrolling
        if (viewScroll) { destroyViewScroll(); }
        createViewScroll('#messages-guests-conversations');
    });

    // Right side selection actions
    $(document).on('click', '#messages #clear-selection', function(e){
        $('.listing').find('.checkbox').removeClass('checked').find('input').attr('checked', false).prev('.icon-form').removeClass('checked');
        $('.listing').find('li.selected').removeClass('selected');
        $('.content-right').html('<div class="no-content"><span class="icon-no-content icon-messages" /></div>');
    });

    $(document).on('click', '#messages #mark-as-read', function(e){
        $('.listing').find('li.selected.unread').removeClass('unread');
    });
    
    $(document).on('click', '#messages #mark-as-unread', function(e){
        $('.listing').find('li.selected').addClass('unread');
    });

	// TODO - fire feedbacks
    $(document).on('click', '#messages #assign', function(e){
        e.stopImmediatePropagation();
        modalInit('modals/alerts/assigned/', 750);
    });
    $(document).on('click', '#messages #complete', function(e){
        e.stopImmediatePropagation();
        modalInit('modals/alerts/completed/', 750);
    });
    $(document).on('click', '#messages #archive', function(e){
        e.stopImmediatePropagation();
        modalInit('modals/alerts/archived/', 750);
    });
    $(document).on('click', '#messages #reopen', function(e){
        e.stopImmediatePropagation();
        modalInit('modals/alerts/reopened/', 750);
    });
});