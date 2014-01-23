var ChangeStayDatesView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();

  this.delegateEvents = function(){  
    that.myDom.find('#changedates-back-btn').on('click',that.backButtonClicked);
    that.myDom.find('#reservation-details').on('click', that.reservationUpdateClickEvents);

  };

  this.executeLoadingAnimation = function(){
    changeView("nested-view", "", "view-nested-first", "view-nested-second", "move-from-right", false); 
  };

  this.pageinit = function(){
    this.availableEvents = "";
    this.confirmedCheckinDate = "";
    this.confirmedCheckoutDate = "";
    this.checkinDateInCalender = "";
    this.checkoutDateInCalender = "";
    that.reservationId = that.viewParams.reservation_id;
    that.fetchCalenderEvents();
  };

  this.reservationUpdateClickEvents = function(event){
      var element = $(event.target);
      if(element.attr('id') == 'confirm-changes') return that.confirmUpdatesClicked(element);
      if(element.attr('id') == 'reset-dates')  return that.resetDatesClicked(element);
      return true;

  };


  this.fetchCalenderEvents = function(){
    var url = "/staff/change_stay_dates/"+that.reservationId+"/calendar.json"

    //var url = 'sample_json/change_staydates/rooms_available.json';
    var webservice = new WebServiceInterface(); 
    var options = {
           successCallBack: that.calenderDatesFetchCompleted,
           loader: "BLOCKER"
    };
    webservice.getJSON(url, options);  

  };

  this.calenderDatesFetchCompleted = function(calenderEvents){

    that.availableEvents = calenderEvents;
    that.checkinDateInCalender = that.confirmedCheckinDate = new Date(calenderEvents.data.arrival_date);
    that.checkoutDateInCalender = that.confirmedCheckoutDate = new Date(calenderEvents.data.dep_date);
    that.updateCalender(that.confirmedCheckinDate, that.confirmedCheckoutDate, that.confirmedCheckinDate);
  };

  this.updateCalender = function(checkinDate, checkoutDate, focusDate){
    var calenderEvents = that.availableEvents ;
    var eventSource = that.getEventSourceObject(checkinDate, checkoutDate);
    $('#reservation-calendar').fullCalendar({
        header: {
            left        : 'prev',
            center      : 'title',
            right       : 'next'
        },
        year      : focusDate.getFullYear(),   // Check in year
        month       : focusDate.getMonth(),     // Check in month (month is zero based)
        day       : focusDate.getDate(),   // Check in day
        editable        : false,
        disableResizing : true,
        contentHeight   : 320,
        weekMode    : 'fixed',
        events : that.getMyEvents,
        // Set how many months are visible on display
        viewDisplay: function(view) {
          that.setupCalendarDates(view, checkinDate, checkoutDate);
        },
        // Stay date has changed
        eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
         // $.datesChanged(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view);

          that.datesChanged(event, revertFunc);
        }

      });
  };

  this.getMyEvents = function(start, end, callback){
    var events = that.getEventSourceObject(that.checkinDateInCalender, that.checkoutDateInCalender);
    console.log(JSON.stringify(events));
    callback(events);

  };

  //Limit the number calender display to 1 month before check-in date and 1 month after checkout date
  this.setupCalendarDates = function(view, checkinDate, checkoutDate){

    var end = new Date(),
        begin = new Date();
    end.setMonth(checkoutDate.getMonth()+1);   //  Allow 1 month in the future
    begin.setMonth(checkinDate.getMonth()-1); //  Allow 1 month in the past

    var cal_date_string = view.start.getMonth()+'/'+view.start.getFullYear(),
        end_date_string = end.getMonth()+'/'+end.getFullYear(),
        begin_date_string = begin.getMonth()+'/'+begin.getFullYear();

    if(cal_date_string == begin_date_string) { $('.fc-button-prev').addClass("fc-state-disabled"); }
    else { $('.fc-button-prev').removeClass("fc-state-disabled"); }

    if(end_date_string == cal_date_string) { $('.fc-button-next').addClass("fc-state-disabled"); }
    else { $('.fc-button-next').removeClass("fc-state-disabled"); }
  }


  this.getEventSourceObject = function(checkinDate, checkoutDate){

    var calenderEvents = that.availableEvents;

    var events = [];
    var currencyCode = calenderEvents.data.currency_code;
    var reservationStatus = calenderEvents.data.reservation_status;
    checkinDate.setHours(0,0,0,0);
    checkoutDate.setHours(0,0,0,0);
    $(calenderEvents.data.available_dates).each(function(index){
      var event = {};
      thisDate = new Date(this.date);
      event.title = getCurrencySymbol(currencyCode) + escapeNull(this.rate);
      event.start = this.date;
      event.end = this.date;
      event.day = thisDate.getDate().toString();

      thisDate.setHours(0,0,0,0);
      //Event is check-in
      if(thisDate.getTime() == checkinDate.getTime()){
        event.id = "check-in";
        event.className = "check-in";
        if(reservationStatus != "CHECKEDIN" && reservationStatus != "CHECKING_OUT"){
          event.startEditable = "true";
        }
        event.durationEditable = "false";

        //If check-in date and check-out dates are the same, show split view.
        if(checkinDate.getTime() == checkoutDate.getTime()){
          event.className = "check-in split-view";
          events.push(event);
          //checkout-event
          var event = {};
          thisDate = new Date(this.date);
          event.title = getCurrencySymbol(currencyCode) + escapeNull(this.rate);
          event.start = this.date;
          event.end = this.date;
          event.day = thisDate.getDate().toString();
          event.id = "check-out";
          event.className = "check-out split-view";
          event.startEditable = "true";
          event.durationEditable = "false"
        }

      //mid-stay range
      }else if((thisDate.getTime() > checkinDate.getTime()) && (thisDate.getTime() < checkoutDate.getTime())){
        event.id = "availability";
        event.className = "mid-stay"
      //Event is check-out
      }else if(thisDate.getTime() == checkoutDate.getTime()){
        event.id = "check-out";
        /*if(checkinDate.getTime() == checkoutDate.getTime()){
          event.className = "check-out split-view"
        }*/
        event.className = "check-out";
        event.startEditable = "true";
        event.durationEditable = "false"
      //dates prior to check-in and dates after checkout
      }else{
        event.id = "availability";
        event.className = "type-available"
      }

      events.push(event);
    });
    
    return events;


  };

  this.datesChanged = function(event, revertFunc){

    
    var checkinOrig = that.checkinDateInCalender;
    var checkoutOrig = that.checkoutDateInCalender;


    var newDateSelected = event.start //$.fullCalendar.formatDate(event.start, 'yyyy-MM-dd');
    var firstAvailableDate = new Date($('.fc-event:first').attr('data-date'));
    var lastAvailableDate = new Date($('.fc-event:last').attr('data-date'));
    checkinOrig.setHours(0,0,0,0);
    checkoutOrig.setHours(0,0,0,0);
    newDateSelected.setHours(0,0,0,0);
    firstAvailableDate.setHours(0,0,0,0);
    lastAvailableDate.setHours(0,0,0,0);
    var currentBusinessDate = new Date(that.availableEvents.data.current_busines_date);
    currentBusinessDate.setHours(0,0,0,0);
  

    var finalCheckin = "";
    var finalCheckout = "";

    //Check the allowed drag and drop range. revert if not available
    if(newDateSelected <firstAvailableDate || newDateSelected >lastAvailableDate){;
      revertFunc();
      return false;      
    }

    if(event.id == 'check-in'){
      if(newDateSelected > checkoutOrig){
        revertFunc();
        return false;
      }
      finalCheckin = newDateSelected;
      finalCheckout = checkoutOrig;
      focusDate = finalCheckin;
    }else if (event.id == "check-out"){
      if(newDateSelected < checkinOrig){
        revertFunc();
        return false;
      }
      if(newDateSelected.getTime() < currentBusinessDate.getTime()){
        revertFunc();
        return false;
      }

      finalCheckin = checkinOrig;
      finalCheckout = newDateSelected;
      focusDate = finalCheckout
    }

    //Refresh the calender with the new dates
    that.refreshCalenderView(finalCheckin, finalCheckout, focusDate);
    //Show the reservation updates for the selected date range
    that.showReservationUpdates(finalCheckin, finalCheckout);

  };

  this.refreshCalenderView = function(checkinDate, checkoutDate, focusDate){
    that.checkinDateInCalender = checkinDate;
    that.checkoutDateInCalender = checkoutDate; 

    $('#reservation-calendar').fullCalendar( 'gotoDate', focusDate.getFullYear(), focusDate.getMonth());
    $('#reservation-calendar').fullCalendar('removeEvents');
    $('#reservation-calendar').fullCalendar('refetchEvents').fullCalendar('renderEvents');

  };

  this.showReservationUpdates = function(checkinDate, checkoutDate){
    that.fadeinHeaderDates();
    var arrivalDate = getDateString(checkinDate);
    var departureDate = getDateString(checkoutDate);
    var postParams = {"arrival_date": arrivalDate, "dep_date": departureDate};
    //var url = 'sample_json/change_staydates/reservation_updates.json';

    var url = '/staff/change_stay_dates/'+that.reservationId+'/update.json';
    var webservice = new WebServiceInterface(); 
    var successCallBackParams = {
        'reservationId': that.reservationId,
        'arrival_date': checkinDate, 
        'dep_date': checkoutDate
    };
    var options = {
           requestParameters: postParams,
           successCallBack: that.datesChangeSuccess,
           failureCallBack: that.dateChangeFailure,
           successCallBackParameters: successCallBackParams,
           loader: "BLOCKER"
    };
    webservice.getJSON(url, options);  

  };

  this.dateChangeFailure = function(errorMsg){
    sntapp.notification.showErrorList(errorMsg);
    //Reset calender view
    that.refreshCalenderView(that.confirmedCheckinDate, that.confirmedCheckoutDate, that.confirmedCheckinDate)
    return false;

  };

  this.datesChangeSuccess = function(response, reservationDetails){
    that.fadeoutHeaderDates();
    if(response.data.availability_status == "room_available"){
      that.myDom.find('#no-reservation-updates').addClass('hidden');
      that.myDom.find('#reservation-updates.hidden').removeClass('hidden');
      that.showRoomAvailableUpdates(reservationDetails);
    }else if(response.data.availability_status == "room_type_available"){
      that.showRoomList(response, reservationDetails);
    }else if(response.data.availability_status == "not_available"){
      that.showNoRoomsAvailableMessage();
    }

  };

  this.showRoomAvailableUpdates = function(reservationDetails, roomNumber){

    var roomSelected = (typeof roomNumber == 'undefined' ? that.myDom.find('#header-room-num').html(): roomNumber);
    var totalNights = 0,
        totalRate = 0,
        avgRate = 0,
        checkinDay = 0,
        checkoutDay = 0;
    $(that.availableEvents.data.available_dates).each(function(index){
      if(new Date(this.date) < new Date(reservationDetails['arrival_date']) ||
               new Date(this.date) > new Date(reservationDetails['dep_date'])){
        return true;
      }
      totalRate = totalRate + parseInt(this.rate);
      totalNights ++;
    });

    avgRate = Math.round((totalRate/totalNights + 0.00001) * 100) / 100;
    var currencySymbol = getCurrencySymbol(that.availableEvents.data.currency_code);


    // Update values
    that.myDom.find('#reservation-updates #room-number').text(roomSelected);
    that.myDom.find('#reservation-updates #room-type').text(that.myDom.find('#room-type').text());
    that.myDom.find('#reservation-updates #new-nights').text(totalNights);
    that.myDom.find('#reservation-updates #new-check-in').text(getDateString(reservationDetails['arrival_date'], true));
    that.myDom.find('#reservation-updates #new-check-out').text(getDateString(reservationDetails['dep_date'], true));
    that.myDom.find('#reservation-updates #avg-daily-rate').text(currencySymbol + avgRate +" /");
    that.myDom.find('#reservation-updates #total-stay-cost').text(currencySymbol + totalRate);
    that.myDom.find('#reservation-updates #rate-desc').text(that.availableEvents.data.rate_desc);

  };

  this.confirmUpdatesClicked = function(element){
    var checkinSelected = getDateString(that.checkinDateInCalender);
    var checkoutSelected = getDateString(that.checkoutDateInCalender);

    var roomSelected = that.myDom.find('#reservation-updates #room-number').text();

    var postData = {"arrival_date": checkinSelected, "dep_date": checkoutSelected, "room_number": roomSelected};

    var url = '/staff/change_stay_dates/'+ that.reservationId +'/confirm';
    var webservice = new WebServiceInterface();  
    var options = {
           requestParameters: postData,
           successCallBack: that.confirmDatesSuccess,
           loader: "BLOCKER"
    };
    webservice.postJSON(url, options);  
    return false;

  };

  this.confirmDatesSuccess = function(){
    var staycardView = new StayCard($("#view-nested-first"));
    staycardView.refreshReservationDetails(that.reservationId, that.goBackToStaycard);

  };

  this.resetDatesClicked = function(element){
    that.fadeinHeaderDates();
    that.myDom.find('#no-reservation-updates.hidden').removeClass('hidden');
    that.myDom.find('#reservation-updates').addClass('hidden');
    that.refreshCalenderView(that.confirmedCheckinDate, that.confirmedCheckoutDate, that.confirmedCheckinDate)
  };

  this.backButtonClicked = function(event){
    event.preventDefault();
    that.goBackToStaycard();
  }

  this.goBackToStaycard = function(event){
    sntapp.activityIndicator.showActivityIndicator('blocker');
    changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);  
  };

  this.showRoomList = function(response, reservationDetails){
    that.myDom.find('#no-reservation-updates').addClass('hidden');
    that.myDom.find('#room-list.hidden').removeClass('hidden');

    var currentRoom = that.myDom.find('#header-room-num').text();
    that.myDom.find('#current-room').text(currentRoom);

    that.myDom.find('#change-room ul').html('');

    $(response.data.rooms).each(function(index){
      var roomElement = '<span id = "room-list-number" class="room-number '+ (this.room_status=="READY" ? "ready" : "not-ready") +'">'+ this.room_number +'</span>';
          var roomListEntry = '<li><button type="button" data-value="'+ this.room_number +'" class="button white">' 
                        +roomElement+ '</button></li>';
      that.myDom.find('#change-room ul').append(roomListEntry);

    });

    that.myDom.find('#change-room ul li').on('click', that.roomListNumberSelected);



  };

  this.roomListNumberSelected = function(e){

    var reservationDetails = {
        'reservationId': that.reservationId,
        'arrival_date': that.checkinDateInCalender, 
        'dep_date': that.checkoutDateInCalender
    };

    var roomSelected = $(e.target).find('#room-list-number').text();
    that.myDom.find('#room-list').addClass('hidden');
    that.myDom.find('#reservation-updates.hidden').removeClass('hidden');

    that.showRoomAvailableUpdates(reservationDetails, roomSelected);
  };

  this.showNoRoomsAvailableMessage = function(){

    that.myDom.find('#room-list').addClass('hidden');  
    that.myDom.find('#reservation-updates').addClass('hidden');
    that.myDom.find('#no-reservation-updates').addClass('hidden');
    that.myDom.find('#room-locked.hidden').removeClass('hidden');
  };

  this.fadeinHeaderDates = function(){
    // Fade in previous dates in reservation header
    that.myDom.find('#edit-reservation .reservation-header').find('.data > .nights, .data > .date').removeAttr('style');
  };

  this.fadeoutHeaderDates = function(){
    // Fade out previous dates in reservation header
    that.myDom.find('#edit-reservation .reservation-header').find('.data > .nights, .data > .date').css('opacity','.2');
  };
};