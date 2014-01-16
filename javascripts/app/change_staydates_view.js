var ChangeStayDatesView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();

  this.delegateEvents = function(){  
    that.myDom.find('#changedates-back-btn').on('click',that.backbuttonClicked);
  };

  this.executeLoadingAnimation = function(){
    changeView("nested-view", "", "view-nested-first", "view-nested-second", "move-from-right", false); 
  };

  this.pageinit = function(){
    that.reservationId = that.viewParams.reservation_id;
    that.fetchCalenderEvents();

    


  };


  this.fetchCalenderEvents = function(){
    var postParams = {"reservation_id": that.reservationId};

    var url = 'sample_json/change_staydates/rooms_available.json';
    var webservice = new WebServiceInterface(); 
    /*var successCallBackParams = {
        'reservationId': reservationId,
        'roomNumberSelected': roomNumberSelected, 
    }; */ 
    var options = {
           requestParameters: postParams,
           successCallBack: that.displayCalender,
           //successCallBackParameters: successCallBackParams,
           loader: "BLOCKER"
    };
    webservice.getJSON(url, options);  

  };

  this.displayCalender = function(calenderEvents){

    var eventSource = that.getEventSourceObject(calenderEvents);
   /* console.log("events");
    console.log(JSON.stringify(events));*/
    // Set calendar - timeout set to make sure functions from edit-reservation.js are available
    var checkinDate = new Date(calenderEvents.data.checkin_date);
    var checkoutDate = new Date(calenderEvents.data.checkout_date);
    $('#reservation-calendar').fullCalendar({
          header: {
              left        : 'prev',
              center      : 'title',
              right       : 'next'
          },
          year      : checkinDate.getYear(),   // Check in year
          month       : checkinDate.getMonth(),     // Check in month (month is zero based)
          day       : checkinDate.getDay(),   // Check in day
          editable        : false,
          disableResizing : true,
          contentHeight   : 320,
          weekMode    : 'fixed',
          // Availability dates
          events: eventSource,
          // Set how many months are visible on display
          viewDisplay: function(view) {
            $.setupCalendarDates(view);
          },
          // Stay date has changed
          eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
           // $.datesChanged(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view);

            that.datesChanged(event, revertFunc);
          }

      });

  };



  this.getEventSourceObject = function(calenderEvents){

    var events = [];
    var checkinDate = new Date(calenderEvents.data.checkin_date);
    var checkoutDate = new Date(calenderEvents.data.checkout_date);

    $(calenderEvents.data.events).each(function(index){
      var event = {};
      thisDate = new Date(this.date);
      event.title = getCurrencySymbol(this.currency_code)+this.price;
      event.start = this.date;
      event.end = this.date;
      event.day = thisDate.getDate();

      
      
      //Event is check-in
      if(thisDate.getTime() == checkinDate.getTime()){
        event.id = "check-in";
        event.className = "check-in";
        event.startEditable = "true";
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



  /*this.datesChanged = function(event, revertFunc){
    that.handleDragRange(event, revertFunc);
  };*/


  this.datesChanged = function(event, revertFunc){

    var checkinOrig = $('.fc-event.check-in').attr('data-date');
    var checkoutOrig = $('.fc-event.check-out').attr('data-date');
    var newDateSelected = $.fullCalendar.formatDate(event.start, 'yyyy-MM-dd');
    var firstAvailableDate = $('.fc-event:first').attr('data-date');
    var lastAvailableDate = $('.fc-event:last').attr('data-date');
    var finalCheckin = "";
    var finalCheckout = "";
    if(newDateSelected <=firstAvailableDate || newDateSelected >=lastAvailableDate){;
      revertFunc();
        
    }
    /*var date1 = '2014-01-05';
    var abc = new Date(date1);
    console.log(abc.getDate());*/

    if(event.id == 'check-in'){
      if(newDateSelected > checkoutOrig){
        revertFunc();
        return false;
      }
      finalCheckin = newDateSelected;
      finalCheckout = checkoutOrig;
    }else if (event.id == "check-out"){
      if(newDateSelected < checkinOrig){
        revertFunc();
        return false;
      }
      finalCheckin = checkinOrig;
      finalCheckout = newDateSelected;
    }

    that.showReservationUpdates(finalCheckin, finalCheckout);

  };

  this.showReservationUpdates = function(checkinDate, checkoutDate){
    var postParams = {"arrival_date": checkinDate, "dep_date": checkoutDate};

    //var url = '/staff/change_stay_dates/'+that.reservationId+'/update';
    var url = 'http://localhost:3000/ui/show?haml_file=staff/change_stay_dates/reservation_updates&is_partial=true';
    var webservice = new WebServiceInterface(); 
    /*var successCallBackParams = {
        'reservationId': reservationId,
        'roomNumberSelected': roomNumberSelected, 
    }; */ 
    var options = {
           requestParameters: postParams,
           successCallBack: that.datesChangeSuccess,
           //successCallBackParameters: successCallBackParams,
           loader: "BLOCKER"
    };
    webservice.getHTML(url, options);  

  };

  this.datesChangeSuccess = function(data){
    $('#no-reservation-updates').hide();
    $('#reservation-updates').html(data);

  };





  this.backbuttonClicked = function(e){
    e.preventDefault();
    sntapp.activityIndicator.showActivityIndicator('blocker');
    changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);  
  };
};