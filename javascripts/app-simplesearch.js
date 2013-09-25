// Capitalize first letter
jQuery.fn.capitalize = function() {
    $(this[0]).keyup(function(event) {
        var box = event.target;
        var txt = $(this).val();
        var start = box.selectionStart;
        var end = box.selectionEnd;
        $(this).val(txt.replace(/^(.)|(\s|\-)(.)/g, function($1) {
            return $1.toUpperCase();
        }));
        box.setSelectionRange(start, end);
    });

   return this;
}

// Search result markup
function writeSearchResult(id, firstname, lastname, image, confirmation, status, room, roomstatus, roomstatusextra, roomstatusexplained, location, group, vip){
    
    var $location = (location != '') ? '<span class="icons icon-location">' + location + '</span>' : '',
        $group = (group != '') ? '<em class="icons icon-group">' + group + '</em>' : '',
        $vip = vip ? '<span class="vip">VIP</span>' : '',
        $image = (image != '') ? '<figure><img src="/assets/' + image + '" />' + $vip +'</figure>' : '<figure><img src="/assets/blank-avatar.png" />' + $vip +'</figure>',
        $roomAdditional = roomstatusextra ? '<span class="room-status">' + roomstatusexplained + '</span>' : '',
        $output = 
        '<a href="stay-card/?guest=' + status + '" class="guest-' + status + ' link-item float" data-transition="inner-page has-card" data-page="search">' + 
            $image +
            '<div class="data">' +
                '<h2>' + lastname + ', ' + firstname + '</h2>' +
                '<span class="confirmation">' + confirmation + '</span>' + $location + $group +
            '</div>' +
            '<span class="guest-status ' + status + '">' + status + '</span>' +
            '<strong class="room-number ' + roomstatus + '">' + room + '</strong>' + $roomAdditional +
        '</a>';
    return $output;
}

$(function($){ 

    // Capitalize first letter + search
    $(document).on('focus', '#query', function(){
        $(this).capitalize();
    }).on('keyup', '#query', function(){
        var $query = $(this).val();

        // Clear button visibility toggle
        if($.trim($('#query').val()) !== '') {
            $('#clear-query:not(.visible)').addClass('visible');
        } else {
            $('#clear-query.visible').removeClass('visible');
        }

        if($query.length >= 3){
            $search_url = '/search.json?';
        	load_search_data($search_url,$query);
          }
        else
        {
            $('#search-results').empty().addClass('hidden');
            
            if ($('#preloaded-results.hidden').length)
            {
                $('#preloaded-results').removeClass('hidden');
            }
            else
            {
                $('#no-results.hidden').removeClass('hidden');
            }
        }
    });


    // Clear search input
    $(document).on('click', '#clear-query.visible', function(e){
        e.preventDefault();
        
        $(this).removeClass('visible');
        $('#query').val('');
        $('#search-results').empty().addClass('hidden');
        
        if ($('#preloaded-results.hidden').length)
        {
            $('#preloaded-results').removeClass('hidden');
        }
        else
        {
            $('#no-results.hidden').removeClass('hidden');
        }
        
        // Reset scroller
        setTimeout(function () {
            contentScroll.refresh();
        }, 0);
    });
    

});