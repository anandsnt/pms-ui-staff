// Here we'll store changes in stay dates
var $storedCheckIn = '',
    $storedCheckOut = '';

// Setup date ranges displayed
$.setupCalendarDates = function(view){
    /*var $firstAvailableDate = $('.fc-event').eq(0).attr('data-date'),
        $lastAvailableDate = $('.fc-event').eq(-2).attr('data-date');*/
    var /*now = $('#reservation-calendar').fullCalendar('getDate'),*/
        now = new Date(),
        end = new Date(),
        begin = new Date();

    end.setMonth(now.getMonth()+1);   //  Allow 1 month in the future
    begin.setMonth(now.getMonth()-1); //  Allow 1 month in the past

    var cal_date_string = view.start.getMonth()+'/'+view.start.getFullYear(),
        cur_date_string = now.getMonth()+'/'+now.getFullYear(),
        end_date_string = end.getMonth()+'/'+end.getFullYear(),
        begin_date_string = begin.getMonth()+'/'+begin.getFullYear();

    if(cal_date_string == begin_date_string) { $('.fc-button-prev').addClass("fc-state-disabled"); }
    else { $('.fc-button-prev').removeClass("fc-state-disabled"); }

    if(end_date_string == cal_date_string) { $('.fc-button-next').addClass("fc-state-disabled"); }
    else { $('.fc-button-next').removeClass("fc-state-disabled"); }
}

// Stay dates have been updated
$.datesChanged = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
    var $updateCalendar = new chainedAnimation(),
        $delay = 50,
        $firstAvailableDate = $('.fc-event:first').attr('data-date'),
        $lastAvailableDate = $('.fc-event:last').attr('data-date'),
        $thisType = event.id,
        $thisDay = $.fullCalendar.formatDate(event.start, 'dd'),
        $thisDate = $.fullCalendar.formatDate(event.start, 'yyyy-MM-dd'),
        $otherDate = $thisType == 'check-in' ? $('.fc-event.check-out').attr('data-date') : $('.fc-event.check-in').attr('data-date'),
        $checkInDate = $thisType== 'check-in' ? $thisDate : $otherDate,
        $checkOutDate = $thisType == 'check-out' ? $thisDate : $otherDate,
        $newSource = '',
        $finalCheckInDate = '',
        $finalCheckOutDate = '',
        $datesOverlap = '';

    // Set stored stay date for cases when they are not in the same month/view
        if ($thisType == 'check-in') {
            $storedCheckIn = $thisDate;
        }
        else if ($thisType == 'check-out') {
            $storedCheckOut = $thisDate;
        }

    // Set dates and overlap rule based on dates available - both dates available
    if ($checkInDate != null && $checkOutDate != null) {
        
        $finalCheckInDate = $checkInDate;
        $finalCheckOutDate = $checkOutDate;
        $newSource = 'availability-json.php?check-in='+ $checkInDate + '&check-out=' + $checkOutDate;
        $datesOverlap = $checkInDate < $checkOutDate;
        
    }
    // Only check-in available
    else if ($checkInDate != null && $checkOutDate == null) 
    {

        $finalCheckInDate = $checkInDate;
        $finalCheckOutDate = $storedCheckOut;
        $newSource = 'availability-json.php?check-in='+ $checkInDate + '&check-out=' + $storedCheckOut;

        if ($storedCheckOut != null)
        {
            $datesOverlap = $checkInDate < $storedCheckOut;
        }
        else
        {
            $datesOverlap = null;
        }                    
    }
    // Only check-out available
    else if ($checkInDate == null && $checkOutDate != null) 
    {
        $finalCheckInDate = $storedCheckIn;
        $finalCheckOutDate = $checkOutDate;
        $newSource = 'availability-json.php?check-in='+ $storedCheckIn + '&check-out=' + $checkOutDate;

        if ($storedCheckIn != null)
        {
            $datesOverlap = $storedCheckIn < $checkOutDate;
        }
        else
        {
            $datesOverlap = null;
        }                    
    }
    else 
    {
        $finalCheckInDate = null;
        $finalCheckOutDate = null;
        $newSource = 'availability-json.php';
        $datesOverlap = null;
    }

    // If data range is ok / dates don't overlap / check in/stored check-in not after check-out/stored check-out
    if ($thisDate <= $lastAvailableDate && $thisDate >= $firstAvailableDate && $checkInDate != $checkOutDate && $datesOverlap)
    {

        // Change day value
        event.day = $thisDay;

        // Clean up
        $updateCalendar.add(function(){ $('.fc-content').addClass('updating'); }, $delay);
        $updateCalendar.add(function(){ $('#reservation-calendar').fullCalendar('removeEvents').fullCalendar('removeEventSources'); });

        // Reload events
        $updateCalendar.add(function(){ 
            if($('#reservation-calendar').fullCalendar( 'clientEvents') == '') {  
                $('#reservation-calendar').fullCalendar('addEventSource', $newSource).fullCalendar('updateEvent', event); 
            }
        });  
        $updateCalendar.add(function(){ $('.fc-content').removeClass('updating'); }, $delay);
        $updateCalendar.start();

        // Show updates in the right side column
        if ($finalCheckInDate != null && $finalCheckOutDate != null)
        {
            showReservationUpdates($finalCheckInDate, $finalCheckOutDate);
        }
        
    }

    // Undo drop if date out of range (meaning json has no availability for selected date) or dates overlap
    else {
        // Undo drag
        revertFunc();

        // Refetch events so other date can be dragged on iPad
        $('#reservation-calendar').fullCalendar( 'refetchEvents');
    }
}

// Show reservation update
function showReservationUpdates($checkInDate, $checkOutDate){

    var $checkIn = new Date($checkInDate),
        $checkOut = new Date($checkOutDate),
        $difference = new Date($checkOut - $checkIn),
        $nights = $difference/1000/60/60/24,
        $dayNames = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');;

    // Fade out previous dates in reservation header
    $('#edit-reservation .reservation-header').find('.data > .nights, .data > .date').css('opacity','.2');

    // Hide no updates message and show update container
    $('#no-reservation-updates:not(.hidden)').addClass('hidden');
    $('#reservation-updates.hidden').removeClass('hidden');

    // Update values
    $('#new-nights').text($nights);
    $('#new-check-in').text($dayNames[$checkIn.getDay()] + ' ' + $checkInDate);
    $('#new-check-out').text($dayNames[$checkOut.getDay()] + ' ' + $checkOutDate);   
}

$(function($){ 

    // Confirm date changes
    $(document).on('click', '#confirm-changes', function(e){
        e.stopImmediatePropagation();

        // Feedback
        modalInit('modals/alerts/reservation-changed/', 750);
    });

    // Reset date changes 
    $(document).on('click', '#reset-dates', function(e){
        e.stopImmediatePropagation();

        // Fade in previous dates in reservation header
        $('#edit-reservation .reservation-header').find('.data > .nights, .data > .date').removeAttr('style');

        // Reset calendar
        $('#reservation-calendar').fullCalendar('removeEvents').fullCalendar('removeEventSources');
        if($('#reservation-calendar').fullCalendar('clientEvents') == '') {  
            $('#reservation-calendar').fullCalendar('addEventSource', 'availability-json.php'); 
        }

        // Reset right side column
        $('#no-reservation-updates.hidden').removeClass('hidden');
        $('#reservation-updates:not(.hidden)').addClass('hidden');
    });
});