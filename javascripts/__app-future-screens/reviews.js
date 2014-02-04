// Load review
function loadReview($this, $href){
    
    var $loader = '<div id="loading"><div id="loading-spinner" /></div>',
        $outTime = new Date().getTime(),    
        $activeTime = ($outTime - $('#reviews .listing').find('li.active').data('timeActive'))/1000;

    // Check if it's not already active review
    if (!$(this).parent('li').hasClass('active'))
    {
        // Mark as read if active more than 3 seconds
        if ($activeTime > 3) {
            $('#reviews .listing').find('li.active.unread').removeClass('unread');
        }

         // Load review on the right & mark as active on the left
        $($loader).prependTo('#reviews .content-right').show(function(){
            $.ajax({
                type:       'GET',
                url:        $href,
                dataType:   'html',
                //timeout:    5000,
                success: function(data){
                    $('#reviews .content-right').animate({opacity: 0}, 150, function(){
                        $(this).html(data);
                    }).animate({opacity: 1}, 150);
                },
                error: function(jqxhr, status, error){
                    if (jqxhr.status=="401") { sntapp.logout(); return;}
                    $('#loading').remove();
                    modalInit('modals/alerts/not-there-yet/');
                }
            }).done(function(){                
                $('#loading').fadeOut().remove();
                $('#reviews .listing').find('li.active').removeClass('active');
                $($this).parent('li').addClass('active').data('timeActive', new Date().getTime());

                // Set scrolling
                if (viewScroll) { destroyViewScroll(); }
                setTimeout(function(){
                     createViewScroll('#reviews-details');
                }, 300);               
            });
        });
    }
}

// Selected reviews
function selectedReviews($this, $item){

    var $loader = '<div id="loading"><div id="loading-spinner" /></div>',
        $checkboxes = $('#reviews .listing .checkbox input:checked').length,
        $selectionInfo = $('#reviews #selection-info p');

    // Load if first selection
    if ($checkboxes == 0)
    {
        $('.content-right').html('<div class="no-content"><span class="icon-no-content icon-reviews" /></div>');
    }
    else if ($checkboxes == 1 && !$('#selection-info').length)
    {
         // Load review on the right & mark as active on the left
        $($loader).prependTo('#reviews .content-right').show(function(){
            $.ajax({
                type:       'GET',
                url:        'reviews/selected',
                dataType:   'html',
                //timeout:    5000,
                success: function(data){
                    $('#reviews .content-right').animate({opacity: 0}, 150, function(){
                        $(this).html(data);
                    }).animate({opacity: 1}, 150);
                },
                error: function(jqxhr, status, error){
                    //checking whether a user is logged in
                    if (jqxhr.status == "401") { sntapp.logout(); return;}
                    $('#loading').remove();
                    modalInit('modals/alerts/not-there-yet/');
                }
            }).done(function(){                
                $('#loading').fadeOut().remove();
                $('#reviews .listing').find('li.active').removeClass('active');
            });
        });
    }
    else if ($checkboxes == 2)
    {
        //$selectionInfo.html($selectionInfo.html().replace('review', 'reviews'));
        $('#reviews #selection-info #count').text($checkboxes);
    }
    else {
        $('#reviews #selection-info #count').text($checkboxes);
    }
}

// Stack reviews
function stackReviews(){
    
    var $listIndex = 66;
    $('#reviews .listing li.unread, #reviews .conversation > li').each(function() {
        $listIndex--;
        $(this).css('z-index', $listIndex);
    });
}

// Datepicker
function setDatepicker(){
    $('#reviews .datepicker').datepicker({
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
    $(document).on('click', '#reviews .filters a', function(e){
        e.preventDefault();
    });

    // Datepicker
    setDatepicker();
    $(document).ajaxComplete(function() {
        setTimeout(function() {
            setDatepicker();
        }, 600);
    });

    // Stack reviews
    stackReviews();
    $(document).ajaxComplete(function() {
        setTimeout(function() {
            stackReviews();
        }, 300);
    });
    
    // Set timing for active left side review
    $('#reviews .listing li.active').each(function() {
        $(this).data('timeActive', new Date().getTime());
    });


    // Click on left side review checkbox
    $(document).on('change', '#reviews .checkbox input', function(e){
        e.stopImmediatePropagation();

        var $item = $(this).closest('li').attr('id');
        $(this).closest('li').toggleClass('selected');
        selectedReviews(this, $item);
    });

    // Click on left side review
    $(document).on('click', '#reviews .listing li a', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();

        var $href = $(this).attr('href')
            $item = $(this).parent('li').attr('id'),
            $checkboxes = $('#reviews .listing .checkbox input:checked').length,
            $thisCheckbox = $(this).prev('.checkbox');

        if ($checkboxes == 0)
        {
            // Load review
            loadReview(this, $href);
        }
        else
        {

            // Select reviews
            //$(this).prev('.checkbox').addClass('checked').find('input').attr('checked', true).prev('.icon-form').addClass('checked');
            //$(this).closest('li').addClass('selected');
            //selectedReviews(this, $item);
           
            /*if ($($thisCheckbox).find('input').is(':checked'))
            {
                $(this).prev('.checkbox').removeClass('checked').find('input').attr('checked', false).prev('.icon-form').removeClass('checked');
                $(this).closest('li').removeClass('selected');
                //selectedReviews(this, $item);
            }
            else 
            {
                $(this).prev('.checkbox').addClass('checked').find('input').attr('checked', true).prev('.icon-form').addClass('checked');
                $(this).closest('li').addClass('selected');
                selectedReviews(this, $item);
            }*/
        }
    });

    // Click on right side collapsed review
    $(document).on('click', '#reviews .conversation li:not(:last-child):not(.conversation-break) .summary', function(e){
        $(this).parent('li').toggleClass('open');

        if ($('#reviews-details .wrapper').attr('style') !== undefined) {
            var $style = $('#reviews-details .wrapper').attr('style').split('transform: translate('),
                $translate = $style[1].split(')')[0],
                $current = $translate.split(',')[1],
                $target = $current.split('px')[0];

            // Reset scroll and keep it on clicked item position
            if (viewScroll) { destroyViewScroll(); }
            createViewScroll('#reviews-details');
            viewScroll.scrollTo(0, parseInt($target));
        } else {
            // Reset scroll
            if (viewScroll) { destroyViewScroll(); }
            createViewScroll('#reviews-details');
        } 
    });

    // Click on right side multiple collapsed reviews
    $(document).on('click', '#reviews .conversation-break em', function(e){
        $('#reviews .conversation-break').remove();
        $('#reviews .conversation li.hidden').removeClass('hidden');
       
        if (viewScroll) { destroyViewScroll(); }
        createViewScroll('#reviews-details');
    });

    // Right side selection actions
    $(document).on('click', '#reviews #clear-selection', function(e){
        $('.listing').find('.checkbox').removeClass('checked').find('input').attr('checked', false).prev('.icon-form').removeClass('checked');
        $('.listing').find('li.selected').removeClass('selected');
        $('.content-right').html('<div class="no-content"><span class="icon-no-content icon-reviews" /></div>');
    });

    $(document).on('click', '#reviews #mark-as-read', function(e){
        $('.listing').find('li.selected.unread').removeClass('unread');
    });
    
    $(document).on('click', '#reviews #mark-as-unread', function(e){
        $('.listing').find('li.selected').addClass('unread');
    });

    // TODO - fire feedbacks
    $(document).on('click', '#reviews #publish', function(e){
        e.stopImmediatePropagation();
        modalInit('modals/alerts/published/', 750);
    });
});