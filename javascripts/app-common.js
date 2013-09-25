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
                    	alert(JSON.stringify(response.guests));
                        try
                        {
                            var items=[];
                            $.each(response.guests, function(i,value){

                                // Search by name
                                if ($query.match(/^([a-zA-Z]+)$/) && (value.firstname.indexOf($query) >= 0 || value.lastname.indexOf($query) >= 0 || value.group.indexOf($query) >= 0))
                                {
                                    items.push($('<li />').html(
                                        writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.status,value.room,value.roomstatus,value.roomstatusextra,value.roomstatusexplained,value.location,value.group,value.vip)
                                    ));

                                    $('#search-results').append.apply($('#search-results'),items)//.highlight($query);
                                }
                                // Search by number
                                else if ($query.match(/^([0-9]+)$/) && $query.length <= 5 && (value.room.indexOf($query) >= 0 || value.confirmation.indexOf($query) >= 0))
                                {
                                    items.push($('<li />').html(
                                        writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.status,value.room,value.roomstatus,value.roomstatusextra,value.roomstatusexplained,value.location,value.group,value.vip))
                                    );
                                    $('#search-results').append.apply($('#search-results'),items)//.highlight($query);
                                }
                                // Search by number
                                else if ($query.length > 6 && (value.confirmation.indexOf($query) >= 0))
                                {
                                    items.push($('<li />').html(
                                        writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.status,value.room,value.roomstatus,value.roomstatusextra,value.roomstatusexplained,value.location,value.group,value.vip))
                                    );
                                    $('#search-results').append.apply($('#search-results'),items)//.highlight($query);
                                }

                                // Reset scroller
                                setTimeout(function () {
                                    contentScroll.refresh();
                                }, 0);
                            });
                        }
                        catch(e)
                        {
                        	console.log(e);
                            $('#search-results').html('<li class="notice">Error occured</li>');
                        }

                        // As this search filters JSON content, we need temp custom handling for no results scenario
                        if ($('#search-results').is(':empty'))
                        {
                            $('#search-results').html('<li class="notice">Found nothing</li>');
                        }
                    }
                    // No data in JSON file
                    else
                    {
                        $('#search-results').html('<li class="notice">No data</li>');
                    }
                },
                error: function (result) {
                   console.log(JSON.stringify(result));
                }
            });

  }


