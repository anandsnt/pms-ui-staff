var RoomAssignmentView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  //Stores the non-filtered list of rooms
  this.roomCompleteList = [];

  this.pageinit = function(){


    this.createViewScroll();
  	this.GetRoomAssignmentList();
  	that.myDom.find($('#room-attributes .radio_filters, #room-attributes .checkbox_filters, .rooms-listing #room_type_selectbox')
  		.change('focusout', that.getFilterList));
        
  }

this.executeLoadingAnimation = function(){
  changeView("nested-view", undefined, "view-nested-first", "view-nested-second", "move-from-right", false); 

}
  this.createViewScroll = function(){
    if (viewScroll) { destroyViewScroll(); }
          setTimeout(function(){
            if (that.myDom.find($('#room-attributes')).length) { createViewScroll('#room-attributes'); }
            if (that.myDom.find($('#rooms-available')).length) { createViewScroll('#rooms-available'); }
            if (that.myDom.find($('#room-upgrades')).length) { createViewScroll('#room-upgrades'); }
          }, 300);
  }

  //Fetches the non-filtered list of rooms.
  this.GetRoomAssignmentList = function(){
  	$.ajax({
        type:       'POST',
        url:        "/staff/rooms/get_rooms",
        dataType:   'json',
        success: function(response){
          if(response.status == "success"){
            that.roomCompleteList = response.data;
            that.getFilterList();
          }else if(response.status == "failure"){
            console.log(response.errors[0]);
          }
        },
        error: function(){
            that.roomCompleteList = [];
            console.log("failed to fetch json");
        }
    });
  }

  //Gets the filter options 
  this.getFilterList = function(e){
  	var filterOptions = [];

    var selctboxOption = $("#room_type_selectbox option:selected").val();
    /*if(!(selctboxOption === "all")){
        filterOptions.push(selctboxOption);
    }*/

    /*var radioFeatureCount = $('#pref_radio_count').val();
    for (var i = 0; i<radioFeatureCount ; i++){
        if($('#room-attributes #radio_' + i).is(':checked')) {
            if(!($('#room-attributes #radio_' + i).val() == "All rooms")){
                filterOptions.push($('#room-attributes #radio_' + i).val());
            }
            
        }
    }*/

    var checkboxFeatureCount = $('#pref_checkbox_count').val();
    for (var i = 0; i<checkboxFeatureCount ; i++){
        if($('#room-attributes #option_checkbox_' + i).is(':checked')) {
            filterOptions.push($('#room-attributes #option_checkbox_' + i).val());
        }
    }
    that.applyFilters(filterOptions);
  }

  //Filter the rooms list based on filter options
  this.applyFilters = function(featureList){
  	var matchCountRequired = featureList.length;
    var roomList = this.roomCompleteList;
    
    var filteredRoomList = [];

    for(var k = 0; k<roomList.length ; k++){
        var roomFeatureMatch = 0;
        var roomFeatures = roomList[k].room_features;
        for(var j=0; j<featureList.length; j++){
            if(roomFeatures.indexOf(featureList[j])>= 0){
                roomFeatureMatch++;
            }
        }

        if(roomFeatureMatch == matchCountRequired){

            filteredRoomList.push(roomList[k]);
        }
        
    }
    this.displayFilteredRoomList(filteredRoomList);
  }

  //Display filtered rooms 
  this.displayFilteredRoomList = function(filteredRoomList){

    //TODO: This line will be removed once the filter story is complete
    //filteredRoomList = this.roomCompleteList;
  	$('#rooms-available ul').html("");

    for (var i=0; i<filteredRoomList.length; i++){


        var room_status_html ="" ;
        // display room number in green colour
        if((filteredRoomList[i].fo_status == "VACANT") && (filteredRoomList[i].room_status == "READY")){
            room_status_html = "<span class='room-number ready'>"+filteredRoomList[i].room_number+"</span>";
        }
        else if((filteredRoomList[i].fo_status == "VACANT") && (filteredRoomList[i].room_status == "NOTREADY")){
            room_status_html = "<span class='room-number not-ready'>"+filteredRoomList[i].room_number +"</span>"+
            "<span class='room-status not-ready'> vacant </span>";    
        }
        else if(filteredRoomList[i].fo_status == "OCCUPIED"){
            room_status_html = "<span class='room-number not-ready'>"+filteredRoomList[i].room_number +"</span>"+
            "<span class='room-status not-ready'> due out </span>";    
        }
        if(room_status_html != ""){
          var output = "<li><a id = 'room-list-item' href='#'"+
            "class='back-button button white submit-value' data-value='' data-transition='nested-view'>"+room_status_html+"</a></li>";
          $('#rooms-available ul').append(output);      
        }
       
    }

    that.myDom.find('#rooms-available #room-list-item').on('click',that.updateRoomAssignment);

  };

  this.updateRoomAssignment = function(){


    var roomSelected = $(this).find(">:first-child").html();
    var currentReservation = $('#roomassignment-ref-id').val();
    var roomStatusExplained = $(this).find(">:first-child").next().html();
    var roomStausNew = "";
    if((typeof roomStatusExplained != "undefined") && (roomStatusExplained != "")){
      roomStausNew = "<span class='room-status'>"+ roomStatusExplained +"</span>"
    }
    var roomReadyStatus = "";
    if($(this).find(">:first-child").hasClass('ready')){
      roomReadyStatus = "ready"
    }else if($(this).find(">:first-child").hasClass('not-ready')){
      roomReadyStatus = "not-ready"

    }


    $('#reservation-'+currentReservation+'-room-number').html("");
    var roomHtml = "<strong class='room-number "+roomReadyStatus+"'>"+roomSelected+"</strong>" + roomStausNew;

    $('#reservation-'+currentReservation+'-room-number').html(roomHtml);

    var postParams = {};
    postParams.reservation_id = currentReservation;
    postParams.room_number = roomSelected;

    console.log(JSON.stringify(postParams));

    $.ajax({
        type:       'POST',
        url:        "/staff/reservation/modify_reservation",
        data: postParams,
        dataType:   'json',
        success: function(response){
          if(response.status == "success"){
            console.log("room successfully updated")
          }else if(response.status == "failure"){
            console.log(response.errors[0]);
          }
        },
        error: function(){
            console.log("error");
        }
    });

  };


}
