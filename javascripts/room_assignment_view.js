var RoomAssignmentView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  //Stores the non-filtered list of rooms
  this.roomCompleteList = [];

  this.pageinit = function(){
  	this.GetRoomAssignmentList();
  	that.myDom.find($('#room-attributes .radio_filters, #room-attributes .checkbox_filters, .rooms-listing #room_type_selectbox')
  		.change('focusout', that.getFilterList));
  }

  //Fetches the non-filtered list of rooms.
  this.GetRoomAssignmentList = function(){
  	$.ajax({
        type:       'GET',
        url:        "/sample_json/room_assignment/room_assignment_list.json",
        dataType:   'json',
        success: function(data){
            that.roomCompleteList = data;
            that.getFilterList();
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
    if(!(selctboxOption === "all")){
        filterOptions.push(selctboxOption);
    }

    var radioFeatureCount = $('#pref_radio_count').val();
    for (var i = 0; i<radioFeatureCount ; i++){
        if($('#room-attributes #radio_' + i).is(':checked')) {
            if(!($('#room-attributes #radio_' + i).val() == "All rooms")){
                filterOptions.push($('#room-attributes #radio_' + i).val());
            }
            
        }
    }

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
  	$('#rooms-available ul').html("");

    for (var i=0; i<filteredRoomList.length; i++){
        var room_status_html ="" ;
        
        if(filteredRoomList[i].room_status == "ready"){
            room_status_html = "<span class='room-number ready'>"+filteredRoomList[i].room_number+"</span>";
        }
        else{
            room_status_html = "<span class='room-number not-ready'>"+filteredRoomList[i].room_number +"</span>"+
            "<span class='room-status not-ready'>"+filteredRoomList[i].room_status_explained +"</span>";    
        }
        var output = "<li><a id = 'room-list-item' href='#'"+
            "class='back-button button white submit-value' data-value='' data-transition='nested-view'"+
            "data-page='search'>"+room_status_html+"</a></li>";
            $('#rooms-available ul').append(output);      

       
    }

    $('#rooms-available #room-list-item').click(function(){

        var roomSelected = $(this).find(">:first-child").html();
        var currentReservation = $('#roomassignment-ref-id').val();
        var roomStatusExplained = $(this).find(">:first-child").next().html();
        var roomReadyStatus = $(this).find(">:first-child").hasClass('ready');
        if(roomReadyStatus){
            $('#reservation-'+currentReservation+'-room-number').addClass('ready');
        }else{
            $('#reservation-'+currentReservation+'-room-number').addClass('not-ready');
        }

        $('#reservation-'+currentReservation+'-room-number').html(roomSelected);
    });  

  }


}
