var RoomAssignmentView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();

  //Stores the non-filtered list of rooms
  this.roomCompleteList = [];

  this.pageinit = function(){
    
    //Get the list of rooms from the server.
    this.fetchRoomList();
     //Scroll view initialization for the view
    this.createViewScroll();   
  };   

  this.delegateEvents = function(){

    that.myDom.find($('#room-attributes .checkbox')
      .change('focusout', that.filterOptionChecked));
    that.myDom.find('#room-upgrades ul li #upgrade-room-select').on('click',that.roomUpgradeSelected);
    //that.myDom.find($('.rooms-listing #room-type-selectbox')
      //.change('focusout', that.filterByRoomType));
    that.myDom.find('#room-assignment-button').on('click',that.backButtonClicked); 
    that.myDom.find('#clear-filters-button').on('click',that.clearFiltersClicked); 


  };

  this.executeLoadingAnimation = function(){
    changeView("nested-view", undefined, "view-nested-first", "view-nested-second", "move-from-right", false); 

  };
  //
  this.createViewScroll = function(){
    if (viewScroll) { destroyViewScroll(); }
          setTimeout(function(){
            if (that.myDom.find($('#room-attributes')).length) { createViewScroll('#room-attributes'); }
            if (that.myDom.find($('#room-upgrades')).length) { createViewScroll('#room-upgrades'); }
          }, 300);
  };

  //Scroll view creation for the the room list
  this.createRoomListScroll = function(){
    if (viewScroll) { destroyViewScroll(); }
    setTimeout(function(){
      if (that.myDom.find($('#rooms-available')).length) { createViewScroll('#rooms-available'); }
    }, 300);
  };

  //Fetches the non-filtered list of rooms.
  this.fetchRoomList = function(){
    var roomType = that.myDom.find('.reservation-header #room-type').attr('data-room-type');
    var data = {};
    if(roomType != null && roomType!= undefined){
      data = {"room_type": roomType};
    }
    $.ajax({
        type:       'POST',
        url:        "/staff/rooms/get_rooms",
        data: data,
        dataType:   'json',
        success: function(response){
          if(response.status == "success"){
            that.roomCompleteList = response.data;
            that.applyFilters();
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

  this.clearFiltersClicked = function(e){
    var filteredRoomList = [];
    for (var i = 0; i< that.roomCompleteList.length; i++){
        if((that.roomCompleteList[i].room_status === "READY") &&
         (that.roomCompleteList[i].fo_status === "VACANT")){
          filteredRoomList.push(that.roomCompleteList[i]); 
      }
    }
    //Apply filters using due-out status, ready status.
    that.displayRoomsList(filteredRoomList);
  };

  this.filterOptionChecked = function(e){
    that.handleMultipleSelection(e);
    that.applyFilters();

  };

  /*
  Start filtering.
  */
  this.applyFilters = function(){
    var filterOptionsArray = that.getFilterList();
    //Apply filters using due-out status, ready status.
    var roomStatusFilteredList = that.filterByStatus(false, false);
    //Apply filters using dynamic filter options
    var roomListToDisplay = that.startFiltering(filterOptionsArray, roomStatusFilteredList);

    that.displayRoomsList(roomListToDisplay);


  };

  /*Gets the filter options
   Returns a filter options array.*/ 
  this.getFilterList = function(){
    var filterOptionsArray = [];
    //Get the total number of dynamic checkbox groups
    var checkboxGroupCount = $('#group-count').val();

    //Iterate through each filter group, get the filter options checked, and create a hash.
    for(var i = 0; i < checkboxGroupCount; i++){
      var filterGroup = {};
      filterGroup.group_name = $('#group-'+i).attr('data-group-name');
      filterGroup.filters = [];

      $('#group-'+i).children('label').each(function () {
        if($(this).hasClass("checked")){
          filterGroup.filters.push($(this).find('input').val()); 
        }
      }); 
      if(filterGroup.filters.length > 0){
        filterOptionsArray.push(filterGroup);
      }
    }

    return filterOptionsArray;    
  };

  /*
  If in a group, multiples are not allowed status.
  */
  this.handleMultipleSelection = function(e){
    var multiplesAllowed = $(e.currentTarget).closest( ".radio-check" ).attr('data-multiples-allowed');
    if(multiplesAllowed === "false"){
      $(e.currentTarget).siblings().removeClass("checked");
      $(e.currentTarget).siblings().find(".icon-checkbox").removeClass("checked");
      $(e.currentTarget).siblings().find("input").attr("checked", false);
    }

  };

  /*this.filterByRoomType = function(){
    var filteredRoomList = [];
    for (var i = 0; i< this.roomCompleteList.length; i++){
      if(this.roomCompleteList[i].room_type === $(this).val()){
        filteredRoomList.push(this.roomCompleteList[i]); 
      }
    } 
  };*/

  /*this.getFilterList = function(){

  };*/


  /*
  Apply filters for room status and due-out status
  */
  this.filterByStatus = function(includeNotReadyRooms, includeDueout){

    var filteredRoomList = [];

    if(that.myDom.find($('#filter-not-ready')).is(':checked')){
      includeNotReadyRooms = true;
    }

    if(that.myDom.find($('#filter-dueout')).is(':checked')){
      includeDueout = true;
    }

    //include not-ready rooms and dueout rooms (show all rooms)
    if(includeNotReadyRooms && includeDueout){
      filteredRoomList = this.roomCompleteList;
    }

    //include not ready rooms (rooms that are available to check-in)
    //We assume, that for ready and vacant rooms, is_dueout = "false"
    else if(includeNotReadyRooms){

      for (var i = 0; i< this.roomCompleteList.length; i++){
        if(this.roomCompleteList[i].is_dueout === "false"){
          filteredRoomList.push(this.roomCompleteList[i]);
        }
      }
    }

    //include dueout rooms (show, ready and vacant rooms, is_dueout = "true" rooms)
    else if(includeDueout){
      for (var i = 0; i< this.roomCompleteList.length; i++){
        if((this.roomCompleteList[i].is_dueout === "true") ||( 
          (this.roomCompleteList[i].room_status === "READY") &&
         (this.roomCompleteList[i].fo_status === "VACANT"))){
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

    return filteredRoomList;

    
  };

  this.displayRoomsList = function(filteredRoomList){
    $('#rooms-available ul').html("");

    for (var i=0; i<filteredRoomList.length; i++){
        var room_status_html ="" ;
        
        // Display FO status (VACANT, DUEOUT, etc) only when room-status = NOT-READY
        // Always show color coding ( Red / Green - for Room status)
        if(filteredRoomList[i].room_status == "READY"){
          room_status_html = "<span class='room-number ready' data-value="+filteredRoomList[i].room_number+">"+filteredRoomList[i].room_number+"</span>";
        }
        else if(filteredRoomList[i].room_status == "NOTREADY"){
            room_status_html = "<span class='room-number not-ready' data-value="+filteredRoomList[i].room_number+">"+filteredRoomList[i].room_number+"</span>"+
            "<span class='room-status not-ready' data-value='"+filteredRoomList[i].fo_status+"'> "+filteredRoomList[i].fo_status+" </span>";   
        }

        //Append the HTML to the UI.
        if(room_status_html != ""){
          var output = "<li><a id = 'room-list-item'"+
            "class='button white submit-value hover-hand' data-value='' >"+room_status_html+"</a></li>";
          $('#rooms-available ul').append(output);      
        }       
    }
    that.createRoomListScroll();

    that.myDom.find('div.rooms-listing ul li a').on('click',that.updateRoomAssignment);
  };



  //Filter the rooms list based on filter options
  this.startFiltering = function(filterOptionsArray, roomListToFilter){

    var filteredRoomList = roomListToFilter;
    //Iterate through each filter group and apply filter
    $.each(filterOptionsArray, function( index, filterGroup ) {
      //if operation is OR, in a group, search for only one filter value match in room features.
      var operation = "OR";
      //if operation is AND, 
      //in a group, search for all the checked filter values should be availabel in room list.
      if(filterGroup.group_name == "ROOM FEATURE"){
        operation = "AND";
      }
      filteredRoomList = that.applyFilterForGroup(filteredRoomList, filterGroup.filters, operation);
     });
  
    return filteredRoomList;

  };

  //Filter logic is applied for each group
  this.applyFilterForGroup = function(roomListToFilter, filters, operation){
    var filteredRoomList = [];
    if(operation === "OR"){
      $.each(roomListToFilter, function( i, room) {
        var matchFound = that.roomSatisfyFilters(room, filters, operation);
        if(matchFound){
          filteredRoomList.push(room);
        }
      });
    }else{
      var matchCountRequired = filters.length;
      $.each(roomListToFilter, function( i, room) {
          var roomFeatureMatch = 0;
          for(var j=0; j<filters.length; j++){
            if(room.room_features.indexOf(parseInt(filters[j]))>= 0){
              roomFeatureMatch++;
            }
          }

          if(roomFeatureMatch === matchCountRequired){
            filteredRoomList.push(room);
          }
        });
    }
    


    return filteredRoomList;

  };

  this.roomSatisfyFilters = function(room, filters, operation){
    var filterMatch = false;
    for(var j=0; j<filters.length; j++){
      if(room.room_features.indexOf(parseInt(filters[j]))>= 0){
        filterMatch = true;
      }
    }

    return filterMatch;   
  };

  //Update resevation with the selected room.
  this.updateRoomAssignment = function(e){

    var roomSelected = $(this).find(">:first-child").attr("data-value");
    var currentReservation = $('#roomassignment-ref-id').val();
    var roomStatusExplained = $(this).find(">:first-child").next().attr("data-value");
    
    that.updateStaycardUI(roomSelected, currentReservation, roomStatusExplained, $(this));
    that.updateServerwithSelectedRoom(currentReservation, roomSelected);
    

  };


  //Update staycard UI. Staycard contents are available in DOM
  this.updateStaycardUI = function(roomSelected, currentReservation, roomStatusExplained, selectedItem){
    var roomStausNew = "";
    if((typeof roomStatusExplained != "undefined") && (roomStatusExplained != "")){
      roomStausNew = "<span class='room-status'>"+ roomStatusExplained +"</span>"
    }
    var roomReadyStatus = "";
    if(selectedItem.find(">:first-child").hasClass('ready')){
      roomReadyStatus = "ready"
    }else if(selectedItem.find(">:first-child").hasClass('not-ready')){
      roomReadyStatus = "not-ready"

    }

    $('#reservation-'+currentReservation+'-room-number').html("");
    var roomHtml = "<strong class='room-number "+roomReadyStatus+"'>"+roomSelected+"</strong>" + roomStausNew;

    $('#reservation-'+currentReservation+'-room-number').html(roomHtml);
    if(that.viewParams.next_view == views.STAYCARD){
      that.gotoStayCard();
    }
    else if(that.viewParams.next_view == views.BILLCARD){
      that.gotoBillCard();
    }
  };

  //API call to update the room
  this.updateServerwithSelectedRoom = function(currentReservation, roomSelected){

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

  this.backButtonClicked = function(e){
    e.preventDefault();
    that.gotoStayCard();
    /*var $loader = '<div id="loading"><div id="loading-spinner" /></div>';
    $($loader).prependTo('body').show();
    changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);*/
  };

  this.gotoStayCard = function(){
    var $loader = '<div id="loading"><div id="loading-spinner" /></div>';
    $($loader).prependTo('body').show();
    changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);
  };

  this.gotoBillCard = function(){
      var viewURL = "staff/reservation/bill_card";
      //var viewURL = "ui/show?haml_file=staff/reservations/bill_card&json_input=registration_card/registration_card.json&is_hash_map=true&is_layout=false";
      var viewDom = $("#view-nested-third");
      var params = {"reservation_id": that.reservation_id};
      var nextViewParams = {"showanimation": true, "from-view" : views.ROOM_ASSIGNMENT};
      sntapp.fetchAndRenderView(viewURL, viewDom, params, true, nextViewParams );
  };


  this.roomUpgradeSelected = function(e){
    e.preventDefault();
    var upsellAmountId = $(this).attr('data-value');
    var roomNumberSelected = $(this).attr('data-room-number');
    var reservationId = that.reservation_id;
    var postParams = {"reservation_id": reservationId, "upsell_amount_id": upsellAmountId};
    $('#reservation-'+reservationId+'-room-number').html("");
    var roomHtml = "<strong class='room-number ready'>"+roomNumberSelected+"</strong>";
    $('#reservation-'+reservationId+'-room-number').html(roomHtml);

    if(that.viewParams.next_view == views.STAYCARD){
    that.gotoStayCard(); 
    }
    else if (that.viewParams.next_view == views.BILLCARD){
      that.gotoBillCard(); 
    }
    
    $.ajax({
        type:       'POST',
        url:        "/staff/reservations/upgrade_room",
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

    if(that.viewParams.next_view == views.STAYCARD){
      that.gotoStayCard();
    }
    else if(that.viewParams.next_view == views.BILLCARD){
      that.gotoBillCard();
    }


  };


};
