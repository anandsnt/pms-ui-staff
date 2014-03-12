var reservationCardNotesView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;
  this.delegateEvents = function(){

  	that.myDom.find('#reservation_notes_post').on('click', that.saveReservationNotes);
  	that.myDom.find('#notes').on('click', that.deleteReservationNotes);		
  };
  this.pageinit = function(){
    
  };
  this.fetchCompletedOfDeleteReservationNotes = function(data, requestParameters){
		if (data.status == "success") {
			var noteId = requestParameters['note_id'];
		  $("#notes li#note"+noteId).remove();
			sntapp.notification.showSuccessMessage("Note deleted", that.myDom);

			// Refresh scroller
			refreshVerticalScroll();
		}	  
  };
  
	this.deleteReservationNotes = function(e){
  	var isDelete = $(e.target).hasClass('icon-trash');
  	if(isDelete){
	  	var noteId= $(e.target).attr('note_id');
	  	var url = '/reservation_notes/'+noteId;
	  	var webservice = new WebServiceInterface();
	    var options = {
			   successCallBack: that.fetchCompletedOfDeleteReservationNotes,
			   successCallBackParameters: {'note_id': noteId},
	    };
	    webservice.deleteJSON(url, options);
	}
  };

  // function for closing the drawer if is open
  that.closeGuestCardDrawer = function(){
	if($('#guest-card').height() > '90') {
		$('#guest-card .ui-resizable-handle').trigger('click');
	}
  };

  this.saveReservationNotes = function(){
  		that.closeGuestCardDrawer();
	  	$notes = that.myDom.find("#post_notes textarea").val();
		$topic = 1;
		$reservation_id = getReservationId();
	
		if ($notes == "") {
			alert("Enter text");
			return false;
		} else if ($topic == "") {
			alert("Select topic");
			return false;
		}
		$data = {
			reservation_id : $reservation_id,
			note_topic : $topic,
			text : $notes
		};
	

	   var webservice = new WebServiceInterface();
	   var options = {
			   requestParameters: $data,
			   successCallBack: that.fetchCompletedOfReservationNotes,
			   failureCallBack: that.fetchErrorOfReservationNotes,
	   };
	   webservice.postJSON('/reservation_notes', options);

  };
  
  this.fetchCompletedOfReservationNotes = function(data) {
	  
	if (data.status == "success") {
		returnData = data.data;
		$newNote = '<li id="note'+returnData.note_id+'"><figure class="guest-image">' + 
			'<img src="' + returnData.user_image + '" alt=""></figure>' + 
			'<div class="note-title"><h4>' + returnData.username + '</h4>' + 
			'<time datetime="2013-10-23 06:05:20"><span class="time">'+returnData.posted_time + 
			'</span><span class="date"> '+returnData.posted_date+'</span>' + '</time><span class="topic"> GENERAL' +
			'<a id="delete_note" class="icons icon-trash" note_id="'+returnData.note_id+'">Delete post</a>'+
			'</span></div><p>' + returnData.text + '</p></li>';	
	    
		that.myDom.find(("#reservation-notes #notes")).prepend($newNote);
		sntapp.notification.showSuccessMessage("Note posted", that.myDom);
		$("#post_notes textarea").val("");

		// Refresh scroller
		refreshVerticalScroll();		
	}
	else{
		sntapp.notification.showErrorList(data.errors, that.myDom);
	}
  };
  
  this.fetchErrorOfReservationNotes = function(errorMessage){
	  sntapp.notification.showErrorMessage(errorMessage, that.myDom);
  };
};