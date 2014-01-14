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

    // Set calendar - timeout set to make sure functions from edit-reservation.js are available

    $('#reservation-calendar').fullCalendar({
          header: {
              left        : 'prev',
              center      : 'title',
              right       : 'next'
          },
          year      : 2014,   // Check in year
          month       : 00,     // Check in month (month is zero based)
          day       : 05,   // Check in day
          editable        : false,
          disableResizing : true,
          contentHeight   : 320,
          weekMode    : 'fixed',
          // Availability dates
          eventSources: [
              {
                  url: 'sample_json/change_staydates/rooms_available.json',
                  type: 'GET',
                  cache: true,
                  error: function() {
                      alert('there was an error while fetching events!');
                  }
              }
          ]

      });


  };

  this.backbuttonClicked = function(e){
    e.preventDefault();
    sntapp.activityIndicator.showActivityIndicator('blocker');
    changeView("nested-view", "", "view-nested-second", "view-nested-first", "move-from-left", false);  
  };
};