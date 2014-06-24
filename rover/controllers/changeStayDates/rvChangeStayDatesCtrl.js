sntRover.controller('RVchangeStayDatesController',['$scope', 'stayDateDetails', function($scope, stayDateDetails){

	$scope.stayDetails = stayDateDetails;
	$scope.checkinDateInCalender = $scope.confirmedCheckinDate = getDateObj($scope.stayDetails.calendarDetails.arrival_date);
	$scope.checkoutDateInCalender = $scope.confirmedCheckoutDate = getDateObj($scope.stayDetails.calendarDetails.dep_date);
  $scope.ReservationUpdates = '';

	var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.alertEventOnClick = function(event, allDay, jsEvent, view){
        
    };
    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        var newDateSelected = event.start;
        var availableStartDate = getDateObj($scope.stayDetails.calendarDetails.available_dates[0].date);
        var availableLastDate = getDateObj($scope.stayDetails.calendarDetails.available_dates[$scope.stayDetails.calendarDetails.available_dates.length - 1].date);
        
        var currentBusinessDate = getDateObj($scope.stayDetails.calendarDetails.current_business_date);
        var finalCheckin = "";
        var finalCheckout = "";

        if(newDateSelected <  availableStartDate || newDateSelected > availableLastDate){
            revertFunc();
            return false;
        }

        if(event.id == 'check-in') {
          if(newDateSelected > $scope.checkoutDateInCalender){
              revertFunc();
              return false;
          }
          finalCheckin = newDateSelected;
          finalCheckout = $scope.checkoutDateInCalender;
        } else if(event.id == "check-out") {
          if(newDateSelected < $scope.checkinDateInCalender){
              revertFunc();
              return false;
          }
          if(newDateSelected.getTime() < currentBusinessDate.getTime()) {
              revertFunc();
              return false;
          }

          finalCheckin = $scope.checkinDateInCalender;
          finalCheckout = newDateSelected;
      }

      $scope.checkinDateInCalender = finalCheckin;
      $scope.checkoutDateInCalender = finalCheckout;
        $scope.events = $scope.getEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);

                
    };  
    $scope.alertOnResize = function(){
       
    };  

 	//calender options used by full calender, related settings are done here
	$scope.fullCalendarOptions =  {
		 height: 450,
        editable: true,
        header:{
          left        : 'prev',
          center      : 'title',
          right       : 'next'
        },
        year : $scope.confirmedCheckinDate.getFullYear(),   // Check in year
      	month : $scope.confirmedCheckinDate.getMonth(),     // Check in month (month is zero based)
      	day : $scope.confirmedCheckinDate.getDate(),   // Check in day
      	editable : true,
      	disableResizing : false,
      	contentHeight : 320,
      	weekMode : 'fixed',
      	ignoreTimezone : false, // For ignoring timezone,

      
        eventClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
    };   	
  $scope.getEventSourceObject = function(checkinDate, checkoutDate){

      var events = [];
      var currencyCode = $scope.stayDetails.calendarDetails.currency_code;
      var reservationStatus = $scope.stayDetails.calendarDetails.reservation_status;

      var thisDate;
      var calEvt = {};
      $($scope.stayDetails.calendarDetails.available_dates).each(function(index){
          calEvt = {};
          //Fixing the timezone issue related with fullcalendar
          thisDate = getDateObj(this.date); 

          if($scope.stayDetails.calendarDetails.is_rates_suppressed == "true"){
            calEvt.title = $scope.stayDetails.calendarDetails.text_rates_suppressed;
          } else {
            calEvt.title = getCurrencySymbol(currencyCode) + $scope.escapeNull(this.rate).split('.')[0];
          }   
          calEvt.start = thisDate;
          calEvt.end = thisDate;
          calEvt.day = thisDate.getDate().toString();
          
          //Event is check-in
          if(thisDate.getTime() === checkinDate.getTime()) {
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
                  if($scope.stayDetails.calendarDetails.is_rates_suppressed == "true"){
                    calEvt.title = $scope.stayDetails.calendarDetails.text_rates_suppressed;
                  } else {
                    calEvt.title = getCurrencySymbol(currencyCode) + $scope.escapeNull(this.rate).split('.')[0];
                  }   
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
      console.log(JSON.stringify(events));
      return events;
  };  


    
	
 /* event source that contains custom events on the scope */
    $scope.events = $scope.getEventSourceObject($scope.checkinDateInCalender, $scope.checkoutDateInCalender);

    $scope.eventSources = [$scope.events];

}]);