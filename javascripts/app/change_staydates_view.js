var ChangeStayDatesView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();

  this.delegateEvents = function(){  
    that.myDom.find('#changedates-back-btn').on('click',that.goBackToStaycard);
    that.myDom.find('#reservation-updates').on('click', that.reservationUpdateClickEvents);

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
    var url = "/staff/change_stay_dates/"+that.reservationId+"/show.json"

    //var url = 'sample_json/change_staydates/rooms_available.json';
    var webservice = new WebServiceInterface(); 
    /*var successCallBackParams = {
        'reservationId': reservationId,
        'roomNumberSelected': roomNumberSelected, 
    }; */ 
    var options = {
           //requestParameters: postParams,
           successCallBack: that.calenderDatesFetchCompleted,
           //successCallBackParameters: successCallBackParams,
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
        events: eventSource,
        
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
    JSON.stringify(calenderEvents.data.available_dates);

    $(calenderEvents.data.available_dates).each(function(index){
      var event = {};
      thisDate = new Date(this.date);
      event.title = getCurrencySymbol(currencyCode) + escapeNull(this.rate);
      event.start = this.date;
      event.end = this.date;
      event.day = thisDate.getDate().toString();
  
      //Event is check-in
      if(thisDate.getTime() == checkinDate.getTime()){
        event.id = "check-in";
        event.className = "check-in";
        if(reservationStatus != "CHECKEDIN" && reservationStatus != "CHECKING_OUT"){
          event.startEditable = "true";
        }
        event.durationEditable = "false"
      //mid-stay range
      }else if((thisDate.getTime() > checkinDate.getTime()) && (thisDate.getTime() < checkoutDate.getTime())){
        event.id = "availability";
        event.className = "mid-stay"
      //Event is check-out
      }else if(thisDate.getTime() == checkoutDate.getTime()){
        event.id = "check-out";
        event.className = "check-out";
        event.startEditable = "true";
        event.durationEditable = "false"
      //dates prior to check-in and dates after checkout
      }else{
        event.id = "availability";
        event.className = "room-available"
      }

      events.push(event);
    });
    
    return events;


  };

  this.datesChanged = function(event, revertFunc){

    var checkinOrig = that.checkinDateInCalender;
    var checkoutOrig = that.checkoutDateInCalender;

    /*var checkinOrig = $('.fc-event.check-in').attr('data-date');
    var checkoutOrig = $('.fc-event.check-out').attr('data-date');*/
    var newDateSelected = $.fullCalendar.formatDate(event.start, 'yyyy-MM-dd');
    var firstAvailableDate = $('.fc-event:first').attr('data-date');
    var lastAvailableDate = $('.fc-event:last').attr('data-date');
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
      finalCheckin = checkinOrig;
      finalCheckout = newDateSelected;
      focusDate = finalCheckout
    }

    that.checkinDateInCalender = finalCheckin;
    that.checkoutDateInCalender = finalCheckout;
    //Refresh the calender with the new dates
    that.refreshCalenderView(finalCheckin, finalCheckout, focusDate);
    //Show the reservation updates for the selected date range
    that.showReservationUpdates(finalCheckin, finalCheckout);

  };

  this.refreshCalenderView = function(checkinDate, checkoutDate, focusDate){
    $('#reservation-calendar').fullCalendar('removeEvents').fullCalendar('removeEventSources');
    $('#reservation-calendar').html('');
    console.log("here");
    console.log(checkinDate);
    console.log(checkoutDate);
    //that.updateCalender(new Date(checkinDate), new Date(checkoutDate), new Date(focusDate));
  };

  this.showReservationUpdates = function(checkinDate, checkoutDate){
    var postParams = {"arrival_date": checkinDate, "dep_date": checkoutDate};

    var url = '/staff/change_stay_dates/'+that.reservationId+'/update';
    //var url = 'http://localhost:3000/ui/show?haml_file=staff/change_stay_dates/reservation_updates&is_partial=true';
    var webservice = new WebServiceInterface(); 
    /*var successCallBackParams = {
        'reservationId': reservationId,
        'roomNumberSelected': roomNumberSelected, 
    }; */ 
    var options = {
           requestParameters: postParams,
           successCallBack: that.datesChangeSuccess,
           failureCallBack: that.dateChangeFailure,
           //successCallBackParameters: successCallBackParams,
           loader: "BLOCKER"
    };
    webservice.postHTML(url, options);  
    //webservice.getHTML(url, options);

  };

  this.dateChangeFailure = function(errorMsg){
    sntapp.notification.showErrorList(errorMsg);
    //Reset calender view
    that.refreshCalenderView(that.confirmedCheckinDate, that.confirmedCheckoutDate, that.confirmedCheckinDate)
    return false;

  };

  this.datesChangeSuccess = function(data){
    $('#no-reservation-updates').hide();
    $('#reservation-updates').html(data);

  };

  this.confirmUpdatesClicked = function(element){
    var checkinSelected = $('.fc-event.check-in').attr('data-date');
    var checkoutSelected = $('.fc-event.check-out').attr('data-date');

    var postData = {"arrival_date": checkinSelected, "dep_date": checkoutSelected};

    var url = '/staff/change_stay_dates/'+ that.reservationId +'/confirm';
    var webservice = new WebServiceInterface(); 
    /*var successCallBackParams = {
        'reservationId': reservationId,
        'roomNumberSelected': roomNumberSelected, 
    }; */ 
    var options = {
           requestParameters: postData,
           successCallBack: that.confirmDatesSuccess,
           //successCallBackParameters: successCallBackParams,
           loader: "BLOCKER"
    };
    webservice.postJSON(url, options);  
    return false;

  };

  this.confirmDatesSuccess = function(){
    that.goBackToStaycard();
  };

  this.resetDatesClicked = function(element){
    that.refreshCalenderView(that.confirmedCheckinDate, that.confirmedCheckoutDate, that.confirmedCheckinDate)
    return false;
  };

  this.goBackToStaycard = function(event){
    if(event != undefined){
      event.preventDefault();
    }
    sntapp.activityIndicator.showActivityIndicator('blocker');
    changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);  
  };
};