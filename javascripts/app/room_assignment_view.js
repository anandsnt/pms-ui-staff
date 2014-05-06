var RoomAssignmentView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();
  this.initialRoomType = "", this.selectedRoomType="";
  //Stores the non-filtered list of rooms
  this.roomCompleteList = [];

  this.pageinit = function(){
     //Scroll view initialization for the view
    this.createViewScroll();  
    //Get the list of rooms from the server.
    this.initialRoomType = that.myDom.find('.reservation-header #room-type').attr('data-room-type');
    this.selectedRoomType = this.initialRoomType;
    this.fetchRoomList(this.initialRoomType);

    //pushing RoomAssignmentView instance sntapp.viewDict
    sntapp.setViewInst('RoomAssignmentView', that);
  };   

  this.delegateEvents = function(){
	// Apply filters upon page load as there may be guest likes defaulted on the filters.

    that.myDom.find('#room-attributes .checkbox').change('focusout', that.filterOptionChecked);
    //that.myDom.find('#room-upgrades ul li #upgrade-room-select').on('click',that.roomUpgradeSelected);
    //that.myDom.find($('.rooms-listing #room-type-selectbox')
      //.change('focusout', that.filterByRoomType));

    that.myDom.unbind('click');
    that.myDom.on('click', that.roomAssignmentClickHandler);
	that.myDom.find('.rooms-listing #room-type-selectbox').on('change', that.changedRoomType);

  };
  this.roomAssignmentClickHandler = function(event){
			that.closeGuestCardDrawer();
			sntapp.notification.hideMessage(that.myDom);
      // case of upgrade-room-select button
      // which include click on both on the element and it's child element
      if(getParentWithSelector(event, "#upgrade-room-select")) {
        return that.roomUpgradeSelected (event);
      }
      if(getParentWithSelector(event, "#room-assignment-button")){
        return that.backButtonClicked(event);
      }      
      if(getParentWithSelector(event, "#clear-filters-button")){
        return that.clearFiltersClicked(event);
      }      


	};
  // function for closing the drawer if is open
	that.closeGuestCardDrawer = function(){
		if($('#guest-card').height() > '90') {
			$('#guest-card .ui-resizable-handle').trigger('click');
		}
	};

  this.executeLoadingAnimation = function(){

    if(that.viewParams.from_view == views.BILLCARD){
      changeView("nested-view", undefined, "view-nested-third", "view-nested-second", "move-from-left", false); 
    }else{
      changeView("nested-view", undefined, "view-nested-first", "view-nested-second", "move-from-right", false); 
    }

  };
  //
  this.createViewScroll = function(){

    if (that.myDom.find('#room-attributes').length) { createVerticalScroll('#room-attributes'); }
    if (that.myDom.find('#room-upgrades').length) { createVerticalScroll('#room-upgrades'); }
  };

  //Scroll view creation for the the room list
  this.createRoomListScroll = function(){
    if (that.myDom.find('#rooms-available').length) { createVerticalScroll('#rooms-available'); }
  };
  // Room type changed from select box.
  this.changedRoomType = function(e){
  	var element = $(e.target);
  	that.selectedRoomType = element.find('option:selected').val();
  	that.fetchRoomList(that.selectedRoomType);
  };
  //Fetches the non-filtered list of rooms.
  this.fetchRoomList = function(roomType){
    //var roomType = that.myDom.find('.reservation-header #room-type').attr('data-room-type');
    var data = {};
    if(roomType != null && roomType!= undefined){
      data = {"room_type": roomType, "reservation_id": that.reservation_id};
    }
    var url = "/staff/rooms/get_rooms";
    var webservice = new WebServiceInterface(); 
    var options = {
      requestParameters: data,
      successCallBack: that.roomListFetchCompleted,
      failureCallBack: that.roomListFetchFailed,
      loader: "BLOCKER"
    };
    webservice.postJSON(url, options);  
  };

  this.roomListFetchCompleted = function(response){
    that.roomCompleteList = response.data;
    that.applyFilters();
  };

  this.roomListFetchFailed = function(errorMessage){
    that.roomCompleteList = [];
    sntapp.activityIndicator.hideActivityIndicator();
    sntapp.notification.showErrorMessage(errorMessage, that.myDom);  

  };

  this.clearFiltersClicked = function(e){
    var filteredRoomList = [];
    for (var i = 0; i< that.roomCompleteList.length; i++){
        if((that.roomCompleteList[i].room_status === "READY") &&
         (that.roomCompleteList[i].fo_status === "VACANT") && !(that.roomCompleteList[i].is_preassigned)){
          filteredRoomList.push(that.roomCompleteList[i]); 
      }
    }

    //Apply filters using due-out status, ready status.
    that.displayRoomsList(filteredRoomList);
  };

  this.filterOptionChecked = function(e){
    that.handleMultipleSelection(e);
    //Fix for chrome checkbox issue CICO-2507. 
    setTimeout(function(){
      that.applyFilters();
    }, 100);

  };

  /*
  Start filtering.
  */
  this.applyFilters = function(){
    var filterOptionsArray = that.getFilterList();
    //Apply filters using due-out status, ready status.
    var roomStatusFilteredList = that.filterByStatus();
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
        if($(this).find('input').is(':checked')){
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
  this.filterByStatus = function(){
    var roomList = that.roomCompleteList;
    var filteredRoomList = [];
    var includeNotReady = false;
    var includeDueout = false;
    var includePreAssigned = false;

    if(that.myDom.find($('#filter-not-ready')).is(':checked')){
      includeNotReady = true;
    }

    if(that.myDom.find($('#filter-dueout')).is(':checked')){
      includeDueout = true;
    }
	
    if(that.myDom.find($('#filter-preassigned')).is(':checked')){
      includePreAssigned = true;
    }

    for (var i = 0; i< roomList.length; i++){
      if(roomList[i].fo_status === "VACANT" && roomList[i].room_status === "READY" && !roomList[i].is_preassigned){
        filteredRoomList.push(roomList[i]);
      }
      else if(includeDueout && roomList[i].fo_status === "DUEOUT"){
        filteredRoomList.push(roomList[i]);
      }
      else if(includeNotReady && roomList[i].room_status === "NOTREADY" && roomList[i].fo_status == "VACANT"){
        filteredRoomList.push(roomList[i]);
      }
      else if(includePreAssigned && roomList[i].is_preassigned){
        filteredRoomList.push(roomList[i]);
      }
    }
    return filteredRoomList;

    
  };

  this.displayRoomsList = function(filteredRoomList){

    // Empty the wrapper
    $('#rooms-available ul').empty();

    // Has rooms
    if(filteredRoomList.length > 0)  {
      var appendHTML = '<ul class="wrapper"></ul>';

      // Remove no-content and change classes
      that.myDom.find("#rooms-available.no-content .info").remove();
      that.myDom.find("#rooms-available .iScrollVerticalScrollbar").show();
      that.myDom.find("#rooms-available").removeClass("no-content").addClass("scrollable");

      // Append only if it doesn't exist already
      if (!that.myDom.find("#rooms-available ul.wrapper").length) {
        that.myDom.find("#rooms-available").append(appendHTML);
      }
      for (var i=0; i<filteredRoomList.length; i++){
          var room_status_html ="" ;
          
          // Display FO status (VACANT, DUEOUT, etc) only when room-status = NOT-READY
          // Always show color coding ( Red / Green - for Room status)
          if(filteredRoomList[i].room_status == "READY" && filteredRoomList[i].fo_status == "VACANT"){
            room_status_html = "<span class='room-number ready' data-value="+filteredRoomList[i].room_number+">"+filteredRoomList[i].room_number+"</span>";
        
            if(filteredRoomList[i].is_preassigned) {
              room_status_html += "<span class='room-preassignment'>"+filteredRoomList[i].last_name + " " + filteredRoomList[i].guarantee_type+"</span>";
            } 
          }
          else{
              room_status_html = "<span class='room-number not-ready' data-value="+filteredRoomList[i].room_number+">"+filteredRoomList[i].room_number+"</span>"+
              "<span class='room-status not-ready' data-value='"+filteredRoomList[i].fo_status+"'> "+filteredRoomList[i].fo_status+" </span>";   
          }
  
          //Append the HTML to the UI.
          if(room_status_html != ""){
            var output = "<li><a id = 'room-list-item'"+
              "class='button white submit-value hover-hand' data-value='' >"+room_status_html+"</a></li>";
            that.myDom.find('#rooms-available ul.wrapper').append(output);    
          }  
      }
      that.createRoomListScroll();
    } 

    // No rooms
    else {
      var appendHTML = '<div class="info">' +
        '<span class="icon-no-content icon-room"></span>'+
        '<strong class="h1">Unfortunately there are no rooms ready yet.</strong>'+
        '<span class="h2">Try changing some of the filter criteria</span>' +
        '</div>';

      // Empty wrapper and change classes
      that.myDom.find("#rooms-available ul.wrapper").remove();
      that.myDom.find("#rooms-available .iScrollVerticalScrollbar").hide();
      that.myDom.find("#rooms-available").removeClass("scrollable").addClass("no-content");

      // Append only if it doesn't exist already
      if (!that.myDom.find("#rooms-available .info").length) {
        that.myDom.find("#rooms-available").append(appendHTML);
      }
      
    }
    
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
    
    if(that.initialRoomType === that.selectedRoomType){
    	console.log("same room type selected");
        var roomSelected = $(this).find(">:first-child").attr("data-value");
	    var currentReservation = $('#roomassignment-ref-id').val();
	    var roomStatusExplained = $(this).find(">:first-child").next().attr("data-value");
	    
	    var postParams = {};
	    postParams.reservation_id = currentReservation;
	    postParams.room_number = roomSelected;
	    var url = '/staff/reservation/modify_reservation';
	  	var webservice = new WebServiceInterface();
	  	var successCallBackParams = {
	  			'roomSelected': roomSelected,
	  			'currentReservation': currentReservation, 
	  			'roomStatusExplained': roomStatusExplained,
	  			'selectedItem': $(this),
	  	};
	    var options = { requestParameters: postParams,
	    				successCallBack: that.roomAssignmentSuccess,
	    				successCallBackParameters: successCallBackParams,
	    				failureCallBack: that.fetchFailedOfSave,
	    				loader: 'blocker'
	    		};
	    webservice.postJSON(url, options);
    }
    else{
    	console.log(" diff room type selectd");
    	
    	var roomTypeChargeModal = new RoomTypeChargeModal();
			roomTypeChargeModal.initialize();
			/*
			roomTypeChargeModal.params = {
				"origin" : views.STAYCARD,
				"reservationStatus" : reservationStatus
			};*/
    }

  };


  //Update staycard UI. Staycard contents are available in DOM
  this.roomAssignmentSuccess = function(data, requestParams){

    var staycardView = new StayCard($("#view-nested-first"));
    currentReservation = requestParams['currentReservation'];

    if(that.viewParams.next_view == views.STAYCARD){
      staycardView.refreshReservationDetails(currentReservation, that.gotoStayCard);
    }
    else if(that.viewParams.next_view == views.BILLCARD){
      staycardView.refreshReservationDetails(currentReservation, that.gotoBillCard);
    }

  };
  this.fetchFailedOfSave = function(errorMessage){
	sntapp.activityIndicator.hideActivityIndicator();
	sntapp.notification.showErrorMessage(errorMessage, that.myDom);  
  };
  this.backButtonClicked = function(e){
    e.preventDefault();
    that.gotoStayCard();
  };

  this.gotoStayCard = function(){
	sntapp.activityIndicator.showActivityIndicator("blocker");
    changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);
  };

  this.gotoBillCard = function(){
      
      var viewURL = "staff/reservation/bill_card";
      var viewDom = $("#view-nested-third");
      var params = {"reservation_id": that.reservation_id};
      var nextViewParams = {"showanimation": true, "from-view" : views.ROOM_ASSIGNMENT};
      sntapp.fetchAndRenderView(viewURL, viewDom, params, 'BLOCKER', nextViewParams );
  };


  this.roomUpgradeSelected = function(event){
    var target = $(event.target);

    // var roomUpgradesView = new RoomUpgradesView();
    // roomUpgradesView.roomUpgradeSelected();
    var upsellAmountId = target.attr('data-value');
    var roomNumberSelected = target.attr('data-room-number');
    var reservationId = that.reservation_id;
    var postParams = {"reservation_id": reservationId, "upsell_amount_id": upsellAmountId, "room_no": roomNumberSelected};

    var url = '/staff/reservations/upgrade_room';
    var webservice = new WebServiceInterface(); 
    var successCallBackParams = {
        'reservationId': reservationId,
        'roomNumberSelected': roomNumberSelected, 
    };  
    var options = {
           requestParameters: postParams,
           successCallBack: that.upgradeSuccess,
           successCallBackParameters: successCallBackParams,
            failureCallBack: that.fetchFailedOfSave,
           loader: "BLOCKER"
    };
    webservice.postJSON(url, options);  

  };
  this.fetchFailedOfSave = function(errorMessage){
	sntapp.activityIndicator.hideActivityIndicator();
	sntapp.notification.showErrorMessage(errorMessage, that.myDom);  
  };  
  this.upgradeSuccess = function(data, requestParams){

    var staycardView = new StayCard($("#view-nested-first"));
    currentReservation = requestParams['reservationId'];

    if(that.viewParams.next_view == views.STAYCARD){
      staycardView.refreshReservationDetails(currentReservation, that.gotoStayCard);
    }
    else if(that.viewParams.next_view == views.BILLCARD){
      staycardView.refreshReservationDetails(currentReservation, that.gotoBillCard);
    }

  };


};
