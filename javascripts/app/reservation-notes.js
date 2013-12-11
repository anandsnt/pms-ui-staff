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
  this.deleteReservationNotes = function(e){
  	var isDelete = $(e.target).hasClass('icon-trash');
  	if(isDelete){
	  	var noteId= $(e.target).attr('note_id');
		$.ajax({
			type : "DELETE",
			url : '/reservation_notes/'+noteId,
			dataType : 'json',
			success : function(data) {
				if (data.status == "success") {
				    $("#notes li#note"+noteId).remove();
					refreshViewScroll();
				}
			},
			error : function() {		
			}
		});
	}
  };
  this.saveReservationNotes = function(){
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
	  sntapp.notification.showErrorList("Testing Buddy..", that.myDom);
	if (data.status == "success") {
		returnData = data.data;
		$newNote = '<li id="note'+returnData.note_id+'"><figure class="guest-image">' + 
			'<img src="' + returnData.user_image + '" alt=""></figure>' + 
			'<div class="note-title"><h4>' + returnData.username + '</h4>' + 
			'<time datetime="2013-10-23 06:05:20"><span class="time">'+returnData.posted_time + 
			'</span><span class="date"> '+returnData.posted_date+'</span>' + '</time><span class="topic">' + returnData.topic +
			'<a id="delete_note" class="icons icon-trash" note_id="'+returnData.note_id+'">Delete post</a>'+
			'</span></div><p>' + returnData.text + '</p></li>';	
	    
		that.myDom.find(("#reservation-notes #notes")).prepend($newNote);
		createViewScroll('#reservation-notes #notes');
		createViewScroll("#reservation-content-" + $reservation_id);
		refreshViewScroll();
		$("#post_notes textarea").val("");
	}
	else{
		sntapp.notification.showErrorList(data.errors, that.myDom);
	}
  };
  
  this.fetchErrorOfReservationNotes = function(errorMessage){
	  sntapp.notitfication.showErrorMessage(errorMessage);
  };
};


