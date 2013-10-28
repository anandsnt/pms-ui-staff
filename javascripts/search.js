var Search = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDomElement = domRef;  
  	
  this.pageinit = function(){
  	console.log("Page Init inside search");
    // setUpSearch(that.myDomElement);
    that.myDomElement.find($('#query')).on('focus', that.callCapitalize);    
    that.myDomElement.find($('#query')).on('keyup', that.loadResults);  
  };
  
  //when user focus on search text
  this.callCapitalize = function(e){
  	console.log("inside capitalize");
  	$(this).capitalize();
  };
   //when user focus on search text
  this.loadResults = function(event){
		var $query = $(this).val();
	
	    // Clear button visibility toggle
	    if($.trim($('#query').val()) !== '') {
	        $('#clear-query:not(.visible)').addClass('visible');
	    } else {
	        $('#clear-query.visible').removeClass('visible');
	    }
	    //Keyboard backspace pressed 
	    if(event.keyCode == 8){
	    	searchResults = {};
	    	searchResults.guests = [];
	    }
	
	    if($query.length >= 3){
	    	if(searchResults.guests.length > 0){
	    		getFilteredResults($query);
	    		return false;
	    	}
	    	
	    	$search_url = '/search.json?';
	    	load_search_data($search_url,$query);
	    }
	    else if(searchResults.guests.length > 0){
	    	getFilteredResults($query);
	    }
	    else
	    {
	        $('#search-results').empty().addClass('hidden');
	        updateView();            
	    }
    };  
  
};

function load_search_data(url,$query){
  	$.ajax({
                type:           "GET",
                url:            url + "&query=" + $query,
                data:           { $match: $query, fakeDataToAvoidCache: new Date()}, // fakeDataToAvoidCache is iOS Safari fix
                dataType:       "json",
                success: function (response) {
                    $("#search-results").empty().removeClass('hidden');
                    $('#preloaded-results').addClass('hidden');
                    $('#no-results').addClass('hidden');
                    if(response.guests.length>0)
                    {
                    	searchResults = response;
                    	displaySearchResults(response, $query);
                    }
                    // No data in JSON file
                    else
                    {
                    	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number</span></li>');
                    }
                    updateView();
                },
                error: function (result) {
                   console.log(JSON.stringify(result));
                }
            });

}

function getFilteredResults($query){
	$('#search-results').html("");
	displayFilteredResults(searchResults, $query);
	
}
function displayFilteredResults(searchResults, $query){
    try
    {
        var items=[];
        $.each(searchResults.guests, function(i,value){
            // Search by name
            if ($query.match(/^([a-zA-Z]+)$/) && (value.firstname.indexOf($query) >= 0 || value.lastname.indexOf($query) >= 0 || value.group.indexOf($query) >= 0))
            {
                items.push($('<li />').html( 
                    writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.status,value.room,value.roomstatus,value.roomstatusextra,value.roomstatusexplained,value.location,value.group,value.vip)
                ));

                $('#search-results').append.apply($('#search-results'),items).highlight($query);
            }
            // Search by number 
            else if ($query.match(/^([0-9]+)$/) && $query.length <= 5 && (value.room.toString().indexOf($query) >= 0 || value.confirmation.toString().indexOf($query) >= 0))
            {
                items.push($('<li />').html(
                    writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.status,value.room,value.roomstatus,value.roomstatusextra,value.roomstatusexplained,value.location,value.group,value.vip))
                );
                $('#search-results').append.apply($('#search-results'),items).highlight($query);
            }
            // Search by number 
            else if ($query.length > 6 && (value.confirmation.toString().indexOf($query) >= 0))
            {
                items.push($('<li />').html( 
                    writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.status,value.room,value.roomstatus,value.roomstatusextra,value.roomstatusexplained,value.location,value.group,value.vip))
                );
                $('#search-results').append.apply($('#search-results'),items).highlight($query);
                
            }

            // Reset scroller
            /*setTimeout(function () {
                contentScroll.refresh();
            }, 0);*/
        });
    }
    catch(e)
    {
    	console.log(e);
    	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span></li>');
    }

    // As this search filters JSON content, we need temp custom handling for no results scenario
    if ($('#search-results').is(':empty'))
    {
    	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number</span></li>');
    }

}

function displaySearchResults(response, $query){
    try
    {
        var items=[];
        $.each(response.guests, function(i,value){
        	
        items.push($('<li />').html( 
                    writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.status,value.room,value.roomstatus,value.roomstatusextra,value.roomstatusexplained,value.location,value.group,value.vip)
                ));

                $('#search-results').append.apply($('#search-results'),items).highlight($query);
        });
        
     // Reset scroller
        /*setTimeout(function () {
            contentScroll.refresh();
        }, 0);*/
    }
    catch(e)
    {
    	console.log(e);
    	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span></li>');
    }

    // As this search filters JSON content, we need temp custom handling for no results scenario
    if ($('#search-results').is(':empty'))
    {
    	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number</span></li>');
    }
}

function writeSearchResult(id, firstname, lastname, image, confirmation, status, room, roomstatus, roomstatusextra, roomstatusexplained, location, group, vip){
    
    var $location = (location != '') ? '<span class="icons icon-location">' + location + '</span>' : '',
        $group = (group != '') ? '<em class="icons icon-group">' + group + '</em>' : '',
        $vip = vip ? '<span class="vip">VIP</span>' : '',
        $image = (image != '') ? '<figure class="guest-image"><img src="/assets/' + image + '" />' + $vip +'</figure>' : '<figure class="guest-image"><img src="/assets/blank-avatar.png" />' + $vip +'</figure>',
        $roomAdditional = roomstatusextra ? '<span class="room-status">' + roomstatusexplained + '</span>' : '',
        $output = 
        '<a href="/dashboard/staycard?confirmation=' + confirmation+'&id='+ id+ '" class="guest-' + status + ' link-item float" data-transition="inner-page has-card" data-page="search">' + 
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

//Update view
function updateView(){
    
    // Content update
    if ($('#search-results').is(':empty'))
    {
        if ($('#preloaded-results').length)
        {
            $('#no-results').addClass('hidden');
            $('#preloaded-results').removeClass('hidden');
        }
        else
        {
            $('#no-results').removeClass('hidden');
        }
    }

    // Set pageScroll
    if (pageScroll) { destroyPageScroll(); }
    createPageScroll('#search');
}
