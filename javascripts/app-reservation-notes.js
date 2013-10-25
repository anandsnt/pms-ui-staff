$(document).on('click', "#post_notes #reservation_notes", function() {
	saveReservationNotes();
});



$(document).on('click', "#notes #delete_note", function() {
	deleteReservationNotes(this);
});

function deleteReservationNotes(that){
	var noteId= $(that).attr('note_id');
 
	$.ajax({
		type : "POST",
		url : '/staff/reservation/delete-reservation-note',	
		data : {note_id:noteId},
		dataType : 'json',
		success : function(data) {
			console.log("Posted Succesfully. ");			
			if (data.status == "success") {
			    $("#notes li#note"+noteId).remove();
				refreshViewScroll();
			}
		},
		error : function() {		
		   console.log("There is an error!!");
		}
	});
	
	
	
	
}
function saveReservationNotes() {
	$notes = $("#post_notes textarea").val();
	$topic = $("#post_notes #topic").val();
	$confirm_num = $('#guest-card #reservation_id').val();
	if ($notes == "") {
		alert("Enter text");
		return false;
	} else if ($topic == "") {
		alert("Select topic");
		return false;
	}
	$data = {
		confirmationno : $confirm_num,
		notetopic : $topic,
		text : $notes
	};

	console.log($data);
    
	$.ajax({
		type : "POST",
		url : '/staff/reservation/add-reservation-note',	
		data : $data,
		dataType : 'json',
		success : function(data) {
			console.log("Posted Succesfully. ");			
			if (data.status == "success") {
				$.each( data.data, function( key, val ) {
					$newNote = '<li><figure class="guest-image">' + 
						'<img src="' + val.user_image + '" alt=""></figure>' + 
						'<div class="note-title"><h4>' + val.username + '</h4>' + 
						'<time datetime="2013-10-23 06:05:20"><span class="time">'+val.posted_time + 
						'</span><span class="date">'+val.posted_date+'</span>' + '</time><span class="topic">' + val.topic +
						'</span></div><p>' + val.text + '</p></li>';
				});
				
				$("#notes").prepend($newNote);
				refreshViewScroll();
			}
		},
		error : function() {		
		   console.log("There is an error!!");
		}
	});
}





