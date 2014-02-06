/**
*   Class to show calendar view
*/
var ChangeStayDatesView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();

  this.delegateEvents = function(){  
      that.myDom.find('#changedates-back-btn').on('click',that.backButtonClicked);
      that.myDom.find('#reservation-details').on('click', that.reservationUpdateClickEvents);
      that.myDom.unbind('click');
      that.myDom.on('click', that.changeStayDatesClickHandler);
  };
  
  //change Stay dates dom click handler
  this.changeStayDatesClickHandler = function(){
  	 sntapp.notification.hideMessage(that.myDom);
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
      that.focusDateInCalendar = "";
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
      var url = "/staff/change_stay_dates/" + that.reservationId + "/calendar.json"
      var webservice = new WebServiceInterface(); 
      var options = {
             successCallBack: that.calenderDatesFetchCompleted,
             failureCallBack: that.failureCallBack,
             loader: "BLOCKER"
      };
      webservice.getJSON(url, options);  

  };

  this.calenderDatesFetchCompleted = function(calenderEvents){
      that.availableEvents = calenderEvents;
      that.checkinDateInCalender = that.confirmedCheckinDate = getDateObj(calenderEvents.data.arrival_date);
      that.checkoutDateInCalender = that.confirmedCheckoutDate = getDateObj(calenderEvents.data.dep_date);
      that.focusDateInCalendar = that.confirmedCheckinDate;
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
          year : focusDate.getFullYear(),   // Check in year
          month : focusDate.getMonth(),     // Check in month (month is zero based)
          day : focusDate.getDate(),   // Check in day
          editable : false,
          disableResizing : true,
          contentHeight : 320,
          weekMode : 'fixed',
          ignoreTimezone : false, // For ignoring timezone

          eventSources : [
              {
                  events:that.getMyEvents,
                  ignoreTimezone: false // For ignoring timezone
              }
          ],
          
          // Set how many months are visible on display
          viewDisplay: function(view) {
              that.setupCalendarDates(view, checkinDate, checkoutDate);
          },
          // Stay date has changed
          eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
              that.datesChanged(event, revertFunc, view);
          }

      });
  };

  this.getMyEvents = function(start, end, callback){
      var events = that.getEventSourceObject(that.checkinDateInCalender, that.checkoutDateInCalender);
      callback(events);
  };

  //Limit the number calender display to 1 month before check-in date and 1 month after checkout date
  this.setupCalendarDates = function(view, checkinDate, checkoutDate){

      var end = new Date(),
          begin = new Date();
      end.setMonth(checkoutDate.getMonth() + 1);   //  Allow 1 month in the future
      begin.setMonth(checkinDate.getMonth() - 1); //  Allow 1 month in the past

      var calDateString = view.start.getMonth() + '/' + view.start.getFullYear(),
          endDateString = end.getMonth() + '/' + end.getFullYear(),
          beginDateString = begin.getMonth() + '/' + begin.getFullYear();

      if(calDateString == beginDateString) {that.myDom.find('.fc-button-prev').addClass("fc-state-disabled");}
      else {that.myDom.find('.fc-button-prev').removeClass("fc-state-disabled");}

      if(endDateString == calDateString) {that.myDom.find('.fc-button-next').addClass("fc-state-disabled");}
      else {that.myDom.find('.fc-button-next').removeClass("fc-state-disabled");}
  }

  this.getEventSourceObject = function(checkinDate, checkoutDate){

      var calenderEvents = that.availableEvents;
      var events = [];
      var currencyCode = calenderEvents.data.currency_code;
      var reservationStatus = calenderEvents.data.reservation_status;

      var thisDate;
      var calEvt = {};
      $(calenderEvents.data.available_dates).each(function(index){
          calEvt = {};
          //Fixing the timezone issue related with fullcalendar
          thisDate = getDateObj(this.date);      
          calEvt.title = getCurrencySymbol(currencyCode) + escapeNull(this.rate);
          calEvt.start = thisDate;
          calEvt.end = thisDate;
          calEvt.day = thisDate.getDate().toString();
          
          //Event is check-in
          if(thisDate.getTime() == checkinDate.getTime()) {
              calEvt.id = "check-in";
              calEvt.className = "check-in";
              if(reservationStatus != "CHECKEDIN" && reservationStatus != "CHECKING_OUT"){
                  calEvt.startEditable = "true";
              }
              calEvt.durationEditable = "false";

              //If check-in date and check-out dates are the same, show split view.
              if(checkinDate.getTime() == checkoutDate.getTime()){
                  calEvt.className = "check-in split-view";
                  events.push(calEvt);
                  //checkout-event
                  calEvt = {};
                  
                  calEvt.title = getCurrencySymbol(currencyCode) + escapeNull(this.rate);
                  calEvt.start = thisDate;
                  calEvt.end = thisDate;
                  calEvt.day = thisDate.getDate().toString();
                  calEvt.id = "check-out";
                  calEvt.className = "check-out split-view";
                  calEvt.startEditable = "true";
                  calEvt.durationEditable = "false"
              }

          //mid-stay range
          } else if((thisDate.getTime() > checkinDate.getTime()) && (thisDate.getTime() < checkoutDate.getTime())) {
              calEvt.id = "availability";
              calEvt.className = "mid-stay"
          //Event is check-out
          } else if(thisDate.getTime() == checkoutDate.getTime()) {
              calEvt.id = "check-out";
              calEvt.className = "check-out";
              calEvt.startEditable = "true";
              calEvt.durationEditable = "false"
          //dates prior to check-in and dates after checkout
          } else {
              calEvt.id = "availability";
              calEvt.className = "type-available"
          }

          events.push(calEvt);
      });
      
      return events;
  };

  this.datesChanged = function(event, revertFunc, view){
      var newDateSelected = event.start;
      var firstAvailableDate = getDateObj(that.myDom.find('.fc-event:first').attr('data-date'));
      var lastAvailableDate = getDateObj(that.myDom.find('.fc-event:last').attr('data-date'));

      var currentBusinessDate = getDateObj(that.availableEvents.data.current_business_date);
      var finalCheckin = "";
      var finalCheckout = "";

      //Check the allowed drag and drop range. revert if not available
      if(newDateSelected < firstAvailableDate || newDateSelected > lastAvailableDate){;
          revertFunc();
          return false;      
      }

      if(event.id == 'check-in') {
          if(newDateSelected > that.checkoutDateInCalender){
              revertFunc();
              return false;
          }
          finalCheckin = newDateSelected;
          finalCheckout = that.checkoutDateInCalender;
      } else if(event.id == "check-out") {
          if(newDateSelected < that.checkinDateInCalender){
              revertFunc();
              return false;
          }
          if(newDateSelected.getTime() < currentBusinessDate.getTime()) {
              revertFunc();
              return false;
          }

          finalCheckin = that.checkinDateInCalender;
          finalCheckout = newDateSelected;
      }

      that.focusDateInCalendar = new Date(view.start.getFullYear(), view.start.getMonth(), view.start.getDate());
      //Refresh the calender with the new dates
      that.refreshCalenderView(finalCheckin, finalCheckout);

      //Show the reservation updates for the selected date range
      that.showReservationUpdates(finalCheckin, finalCheckout);
  };

  this.refreshCalenderView = function(checkinDate, checkoutDate){
      that.checkinDateInCalender = checkinDate;
      that.checkoutDateInCalender = checkoutDate; 


      //$('#reservation-calendar').fullCalendar( 'gotoDate', focusDate.getFullYear(), focusDate.getMonth());
      /*that.myDom.find('#reservation-calendar').fullCalendar('removeEvents');
      that.myDom.find('#reservation-calendar').fullCalendar('refetchEvents').fullCalendar('renderEvents');*/
      $('#reservation-calendar').html("");
      that.updateCalender(checkinDate, checkoutDate, that.focusDateInCalendar);


  };

  this.showReservationUpdates = function(checkinDate, checkoutDate){
      that.fadeinHeaderDates();
      var arrivalDate = getDateString(checkinDate);
      var departureDate = getDateString(checkoutDate);
      var postParams = {"arrival_date": arrivalDate, "dep_date": departureDate};

      var url = '/staff/change_stay_dates/' + that.reservationId + '/update.json';
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
      sntapp.notification.showErrorMessage(errorMsg, that.myDom);

      //Reset calender view
      that.refreshCalenderView(that.confirmedCheckinDate, that.confirmedCheckoutDate)
      return false;

  };

  this.datesChangeSuccess = function(response, reservationDetails){
      that.fadeoutHeaderDates();
      if("room_available" == response.data.availability_status) {
          that.myDom.find('#no-reservation-updates').addClass('hidden');
          that.myDom.find('#reservation-updates.hidden').removeClass('hidden');
          that.showRoomAvailableUpdates(reservationDetails);
      } else if("room_type_available" == response.data.availability_status) {
          that.myDom.find('#no-reservation-updates').addClass('hidden');
          that.myDom.find('#reservation-updates').addClass('hidden');
          that.myDom.find('#room-list.hidden').removeClass('hidden');
          that.showRoomList(response, reservationDetails);
      } else if("not_available" == response.data.availability_status) {
          that.showNoRoomsAvailableMessage();
      }

  };

  this.showRoomAvailableUpdates = function(reservationDetails, roomNumber){
      var checkinTime = reservationDetails['arrival_date'].setHours(00,00,00);
      var checkoutTime = reservationDetails['dep_date'].setHours(00,00,00);
      var thisTime = "";
      var roomSelected = (typeof roomNumber == 'undefined' ? that.myDom.find('#header-room-num').html(): roomNumber);
      var totalNights = 0,
          totalRate = 0,
          checkinRate = 0,
          avgRate = 0,
          checkinDay = 0,
          checkoutDay = 0;
      $(that.availableEvents.data.available_dates).each(function(index){
          thisTime = getDateObj(this.date).setHours(00,00,00);
          if(thisTime < checkinTime || thisTime >= checkoutTime){
              return true;
          }

          if(this.date == getDateString(reservationDetails['arrival_date'])){
              checkinRate = escapeNull(this.rate) == "" ? "" : parseInt(this.rate);
          }
          totalRate = totalRate + (escapeNull(this.rate) == "" ? "" : parseInt(this.rate));
          totalNights ++;
      });

      if(totalNights > 0){
          avgRate = Math.round(( totalRate / totalNights + 0.00001)  * 100 / 100 );
      }else{
          avgRate = checkinRate;
      }
      var currencySymbol = getCurrencySymbol(that.availableEvents.data.currency_code);

      // Update Dom values
      that.myDom.find('#reservation-updates #room-number').text(roomSelected);
      that.myDom.find('#reservation-updates #room-type').text(that.myDom.find('#room-type').text());
      if(totalNights > 0){
        that.myDom.find('#reservation-updates #new-nights').text(totalNights + ' nights');
      } else {
        that.myDom.find('#reservation-updates #new-nights').text('Day Use');
      }
      that.myDom.find('#reservation-updates #new-check-in').text(getDateString(reservationDetails['arrival_date'], true));
      that.myDom.find('#reservation-updates #new-check-out').text(getDateString(reservationDetails['dep_date'], true));
      that.myDom.find('#reservation-updates #avg-daily-rate').text(currencySymbol + avgRate +" /");
      that.myDom.find('#reservation-updates #total-stay-cost').text(currencySymbol + totalRate);
      that.myDom.find('#reservation-updates #rate-desc').text(escapeNull(that.availableEvents.data.rate_desc));

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
             failureCallBack: that.failureCallBack,
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
      that.refreshCalenderView(that.confirmedCheckinDate, that.confirmedCheckoutDate)
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
      var currentRoom = that.myDom.find('#header-room-num').text();
      that.myDom.find('#current-room').text(currentRoom);

      that.myDom.find('#change-room ul').html('');

      $(response.data.rooms).each(function(index){
          var roomElement = '<span id = "room-list-number" class="room-number '+ (this.room_status=="READY" ? "ready" : "not-ready") +'">'+ this.room_number +'</span>';
          var roomListEntry = '<li><button type="button" data-value="'+ this.room_number +'" class="button white">' 
                            +roomElement+ '</button></li>';
          that.myDom.find('#change-room ul').append(roomListEntry);

      });

      // Set scrollers
      if (viewScroll) { destroyViewScroll(); }
      setTimeout(function(){
          createViewScroll('#change-room');
      }, 300);

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

  this.failureCallBack = function(errorMessage){
      sntapp.activityIndicator.hideActivityIndicator();
      sntapp.notification.showErrorMessage("Some error occured: " + errorMessage, that.myDom);  
  };
};