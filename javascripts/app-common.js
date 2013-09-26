 function load_search_data(url,$query){
  	$.ajax({
                type:           "POST",
                url:            "/dashboard/search_api.json",
                data:           { $match: $query, fakeDataToAvoidCache: new Date()}, // fakeDataToAvoidCache is iOS Safari fix
                dataType:       "json",
                success: function (response) {
                    $("#search-results").empty().removeClass('hidden');
                    $('#preloaded-results').addClass('hidden');
                    $('#no-results').addClass('hidden');
                    if(response.guests.length>0)
                    {
                    	displaySearchResults(response, $query);
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


