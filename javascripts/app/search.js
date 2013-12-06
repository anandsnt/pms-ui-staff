var Search = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDomElement = domRef;
  searchResults = {};
  searchResults.guests = [];
  
 this.pageinit = function(){

    var type = that.myDomElement.find($('#search_list')).attr("data-search-type");
    /*preload the search results, 
    if navigated to search screen by clicking checking-in/checking-out/in-house options
    */
    if(type != "") {
        var search_url = "search.json?&status=" + type;
        this.fetchSearchData(search_url, "");
    }
    
  };

  this.delegateEvents = function(){  
  	that.myDomElement.find($('#query')).on('focus', that.callCapitalize);
    that.myDomElement.find($('#query')).on('keyup', that.loadResults);
    that.myDomElement.find($('#search-form')).on('submit', that.submitSearchForm);
    that.myDomElement.find($('#clear-query')).on('click', that.clearResults);
  };
  //Clear Search Results
  this.clearResults = function(e){
  	e.preventDefault();
  	if($(this).hasClass('visible')){  		
  		$(this).removeClass('visible');
	    $('#query').val('');
	    $('#search-results').empty().addClass('hidden');
	    that.updateView();
  	}
    
  } ;
  //when a user press enter key from search textbox
  this.submitSearchForm = function(e){
	  return false;
  };
  
  //when user focus on search text
  this.callCapitalize = function(e){
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
	    		that.getFilteredResults($query);
	    		return false;
	    	}
	    	$search_url = 'search.json?&query='+ $query;
	    	that.fetchSearchData($search_url,$query);
	    }
	    else if(searchResults.guests.length > 0){
	    	that.getFilteredResults($query);
	    }
	    else
	    {
	        $('#search-results').empty().addClass('hidden');
	        that.updateView();
	    }
    };

   this.fetchSearchData = function(url, $query){
	 	$.ajax({
		    type:           "GET",
		    url:            url,
		    data:           {fakeDataToAvoidCache: new Date()}, // fakeDataToAvoidCache is iOS Safari fix
		    dataType:       "json",
		    success: function (response) {
		        $("#search-results").empty().removeClass('hidden');
		        $('#preloaded-results').addClass('hidden');
		        $('#no-results').addClass('hidden');
		        if(response.guests.length>0)
		        {
		        	searchResults = response;
		        	that.displaySearchResults(response, $query);
		        }
		        // No data in JSON file
		        else
		        {
		        	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check that you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number. <span href=\"#\" class=\"open-modal-fix\">Or add a New Guest</span>.</li>');
		            }
		            that.updateView();
		        },
		        error: function (result) {
		        }
	    });
    };

     this.getFilteredResults = function($query){
     	$('#search-results').html("");
	    that.displayFilteredResults(searchResults, $query);
     };

     this.displayFilteredResults = function(searchResults, $query){
     	console.log(JSON.stringify(searchResults));
     	try
	    {
	        var items=[];
	        $.each(searchResults.guests, function(i,value){
	            // Search by name
	            if ($query.match(/^([a-zA-Z]+)$/) && ((escapeNull(value.firstname).toUpperCase()).indexOf($query.toUpperCase()) >= 0 || (escapeNull(value.lastname).toUpperCase()).indexOf($query.toUpperCase()) >= 0 || (escapeNull(value.group).toUpperCase()).indexOf($query.toUpperCase()) >= 0))
	            {
	                items.push($('<li />').html(
	                    that.writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.reservation_status,value.room,value.roomstatus,value.fostatus,value.location,value.group,value.vip)
	                ));
	            }
	            // Search by number
	            else if ($query.match(/^([0-9]+)$/) &&(escapeNull(value.room).toString().indexOf($query) >= 0 || 
	            		escapeNull(value.confirmation).toString().indexOf($query) >= 0))
	            {
	                items.push($('<li />').html(
	                    that.writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.reservation_status,value.room,value.roomstatus,value.fostatus,value.location,value.group,value.vip)
	                ));
	            }
	            // Search by number
	            // else if ($query.length > 6 && (escapeNull(value.confirmation).toString().indexOf($query) >= 0))
	            // {
	            //     items.push($('<li />').html(
	            //         that.writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.reservation_status,value.room,value.roomstatus,value.fostatus,value.location,value.group,value.vip)
	            //     ));

	            // }

	            // Reset scroller
	            /*setTimeout(function () {
	                contentScroll.refresh();
	            }, 0);*/
	        });

 				$.each(items, function(i,value){
	            	$('#search-results').append(value).highlight($query);
	            });
	    }
	    catch(e)
	    {
	    	console.log(e.message);
	    	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span></li>');
	    }

	    // As this search filters JSON content, we need temp custom handling for no results scenario
	    if ($('#search-results').is(':empty'))
	    {
	    	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number</span></li>');
	    }

    };

    this.displaySearchResults = function(response, $query){
	    try
		    {
		        var items=[];
		        $.each(response.guests, function(i,value){

		        items.push($('<li />').html(
		                    that.writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.reservation_status,value.room,value.roomstatus,value.fostatus,value.location,value.group,value.vip)
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
		    	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span></li>');
		    }

		    // As this search filters JSON content, we need temp custom handling for no results scenario
		    if ($('#search-results').is(':empty'))
		    {
		    	$('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number</span></li>');
		    };
    };

    this.writeSearchResult = function(id, firstname, lastname, image, confirmation, reservation_status, room, roomstatus, foStatus, location, group, vip){

    	var viewStatus = this.getReservationStatusMapped(reservation_status);
    	var roomStatusMapped = this.getRoomStatusMapped(roomstatus);
    	var roomstatusexplained = "";
    	roomstatusextra = false;

    	if(foStatus =="VACANT" && roomStatusMapped=="not-ready"){
    		roomstatusexplained ="VACANT";
    		roomstatusextra = true;
    	}
    	else if(foStatus =="OCCUPIED"){
    		roomstatusexplained ="DUEOUT";
    		roomstatusextra = true;
    	}

    	var $location = (escapeNull(location) != '') ? '<span class="icons icon-location">' + escapeNull(location) + '</span>' : '',
        $group = (escapeNull(group) != '') ? '<em class="icons icon-group">' + escapeNull(group) + '</em>' : '',
        $vip = vip ? '<span class="vip">VIP</span>' : '',
        $image = (escapeNull(image) != '') ? '<figure class="guest-image"><img src="' + escapeNull(image) + '" />' + $vip +'</figure>' : '<figure class="guest-image"><img src="/assets/blank-avatar.png" />' + $vip +'</figure>',
        $roomAdditional = roomstatusextra ? '<span class="room-status">' + roomstatusexplained + '</span>' : '',
        $viewStatus = viewStatus ? '<span class="guest-status ' + escapeNull(viewStatus) + '">' + escapeNull(viewStatus) + '</span>':'',
        $output =
        '<a href="staff/staycards/staycard?confirmation=' + confirmation+'&id='+ escapeNull(id)+ '" class="guest-' + escapeNull(status) + ' link-item float" data-transition="inner-page">' +
            $image +
            '<div class="data">' +
                '<h2>' + escapeNull(lastname) + ', ' + escapeNull(firstname) + '</h2>' +
                '<span class="confirmation">' + escapeNull(confirmation) + '</span>' + $location + $group +
            '</div>'+
            $viewStatus +
            '<strong class="room-number ' + escapeNull(roomStatusMapped) + '">' + escapeNull(room) + '</strong>' + $roomAdditional +
        '</a>';
    	return $output;
    };

    //Map the reservation status to the view expected format
    this.getReservationStatusMapped = function(status){
    	var viewStatus = "";
    	if(status == "CHECKING_IN"){
    		viewStatus = "check-in";
    	}else if(status == "CHECKEDIN"){
    		viewStatus = "inhouse";
    	}else if(status == "CHECKING_OUT"){
    		viewStatus = "check-out";
    	}else if(status == "CANCELLED"){
    		viewStatus = "cancel";
    	}else if((status == "NOSHOW")||(status == "NOSHOW_CURRENT")){
    		viewStatus = "no-show";
    	}
    	return viewStatus;
    }

    //Map the room status to the view expected format
    this.getRoomStatusMapped = function(status){
    	var roomStatus = "";
    	if(status == "READY"){
    		roomStatus = 'ready';
    	}else if(status == "NOTREADY"){
    		roomStatus = "not-ready";
    	}
		return roomStatus;
    }

    this.updateView = function(){
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
    };
};

