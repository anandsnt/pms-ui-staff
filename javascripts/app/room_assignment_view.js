var RoomAssignmentView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;

  //Stores the non-filtered list of rooms
  this.roomCompleteList = [];

  this.pageinit = function(){
    this.includeNotReadyRooms = false;
    this.includeDueout = false;
    //Scroll view initialization for the view
    this.createViewScroll();
    //Get the list of rooms from the server.
  	this.FetchRoomList();
  }

  this.delegateEvents = function(){

    that.myDom.find($('#room-attributes .checkbox')
      .change('focusout', that.handleMultipleSelection));
    //that.myDom.find($('.rooms-listing #room-type-selectbox')
      //.change('focusout', that.filterByRoomType));
    that.myDom.find('#room-assignment-button').on('click',that.backButtonClicked); 

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
  this.FetchRoomList = function(){
  	$.ajax({
        type:       'POST',
        url:        "/staff/rooms/get_rooms",
        dataType:   'json',
        success: function(response){
          if(response.status == "success"){
            that.roomCompleteList = response.data;
            that.filterByStatus();
          }else if(response.status == "failure"){
            that.roomCompleteList = [];
            //TODO: Handle failure cases
          }
        },
        error: function(){
          that.roomCompleteList = [];
          //TODO: Handle failure cases
        }
    });
  };

  this.handleMultipleSelection = function(){
    that.includeNotReadyRooms = false;
    that.includeDueout = false;

    if(that.myDom.find($('#filter-not-ready')).is(':checked')){
      that.includeNotReadyRooms = true;
    }

    if(that.myDom.find($('#filter-dueout')).is(':checked')){
      that.includeDueout = true;
    }

    var multiplesAllowed = $(this).closest( ".radio-check" ).attr('data-multiples-allowed');
    if(multiplesAllowed === "false"){
      $(this).find('input').attr("checked", false); 
    }

    that.filterByStatus();
  };

  /*this.filterByRoomType = function(){
    var filteredRoomList = [];
    for (var i = 0; i< this.roomCompleteList.length; i++){
      if(this.roomCompleteList[i].room_type === $(this).val()){
        filteredRoomList.push(this.roomCompleteList[i]); 
      }
    } 
  };*/

  

  this.filterByStatus = function(){
    var filteredRoomList = [];

    //include not-ready rooms and dueout rooms (show all rooms)
    if(this.includeNotReadyRooms && this.includeDueout){
      filteredRoomList = this.roomCompleteList;
    }

    //include not ready rooms (filter by only VACANT status)
    else if(this.includeNotReadyRooms){
      for (var i = 0; i< this.roomCompleteList.length; i++){
        if(this.roomCompleteList[i].fo_status === "VACANT"){
          filteredRoomList.push(this.roomCompleteList[i]);
        } 
      }
    }

    //include dueout rooms (filter by only READY status)
    else if(this.includeDueout){
      for (var i = 0; i< this.roomCompleteList.length; i++){
        if((this.roomCompleteList[i].fo_status === "OCCUPIED") 
          || (this.roomCompleteList[i].room_status === "READY")){
          filteredRoomList.push(this.roomCompleteList[i]); 
        }
      }
    }

    //Display only ready and vacant rooms
    else{
      for (var i = 0; i< this.roomCompleteList.length; i++){
        if((this.roomCompleteList[i].room_status === "READY") &&
         (this.roomCompleteList[i].fo_status === "VACANT")){
          filteredRoomList.push(this.roomCompleteList[i]); 
        }
      }

    }

    this.displayRoomsList(filteredRoomList);
  };

  this.displayRoomsList = function(filteredRoomList){
    $('#rooms-available ul').html("");

    for (var i=0; i<filteredRoomList.length; i++){
        var room_status_html ="" ;
        // display room number in green colour
        if((filteredRoomList[i].fo_status == "VACANT") && (filteredRoomList[i].room_status == "READY")){
          room_status_html = "<span class='room-number ready' data-value="+filteredRoomList[i].room_number+">"+filteredRoomList[i].room_number+"</span>";
        }
        else if((filteredRoomList[i].fo_status == "VACANT") && (filteredRoomList[i].room_status == "NOTREADY")){
            room_status_html = "<span class='room-number not-ready' data-value="+filteredRoomList[i].room_number+">"+filteredRoomList[i].room_number+"</span>"+
            "<span class='room-status not-ready' data-value='vacant'> vacant </span>";   
        }
        else if(filteredRoomList[i].fo_status == "OCCUPIED"){
          room_status_html = "<span class='room-number not-ready' data-value="+filteredRoomList[i].room_number+">"+filteredRoomList[i].room_number+"</span>"+
          "<span class='room-status not-ready' data-value='due out'> due out </span>";    
        }
        if(room_status_html != ""){
          var output = "<li><a id = 'room-list-item' href='#'"+
            "class='back-button button white submit-value' data-value='' data-transition='nested-view'>"+room_status_html+"</a></li>";
          $('#rooms-available ul').append(output);      
        }       
    }

    that.myDom.find('div.rooms-listing ul li a').on('click',that.updateRoomAssignment);
  };


  //Gets the filter options 
  this.getFilterList = function(e){
  	var filterOptions = [];

    var roomTypeSelected = $("#room_type_selectbox option:selected").val();
    if(!(roomTypeSelected === "all-types")){
        filterOptions.push(roomTypeSelected);
    }

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
    filteredRoomList = this.roomCompleteList;
  	$('#rooms-available ul').html("");

    for (var i=0; i<filteredRoomList.length; i++){


        var room_status_html ="" ;
        // display room number in green colour
        if((filteredRoomList[i].fo_status == "VACANT") && (filteredRoomList[i].room_status == "READY")){
        	room_status_html = "<span class='room-number ready' data-value="+filteredRoomList[i].room_number+"></span>";
        }
        else if((filteredRoomList[i].fo_status == "VACANT") && (filteredRoomList[i].room_status == "NOTREADY")){
            room_status_html = "<span class='room-number not-ready' data-value="+filteredRoomList[i].room_number+"></span>"+
            "<span class='room-status not-ready' data-value='vacant'> vacant </span>";   
        }
        else if(filteredRoomList[i].fo_status == "OCCUPIED"){
        	room_status_html = "<span class='room-number not-ready' data-value="+filteredRoomList[i].room_number+"></span>"+
        	"<span class='room-status not-ready' data-value='due out'> due out </span>";    
        }
        if(room_status_html != ""){
          var output = "<li><a id = 'room-list-item' href='#'"+
            "class='back-button button white submit-value' data-value='' data-transition='nested-view'>"+room_status_html+"</a></li>";
          $('#rooms-available ul').append(output);      
        }
       
    }

    that.myDom.find('div.rooms-listing ul li a').on('click',that.updateRoomAssignment);

  };

  this.updateRoomAssignment = function(){


	var roomSelected = $(this).find(">:first-child").attr("data-value");
    var currentReservation = $('#roomassignment-ref-id').val();
    var roomStatusExplained = $(this).find(">:first-child").next().attr("data-value");
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

    $.ajax({
        type:       'POST',
        url:        "/staff/reservation/modify_reservation",
        data: postParams,
        dataType:   'json',
        success: function(response){
          if(response.status == "success"){
          }else if(response.status == "failure"){
          }
        },
        error: function(){
        }
    });

  };
  this.backButtonClicked = function(){
  	var $loader = '<div id="loading" />';
    $($loader).prependTo('body').show();
  	changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);
  }


}
