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
	$topic = 1;
	$confirm_num = $('#guest-card #reservation_id').val();
	// $confirm_num = 4813095;
	if ($notes == "") {
		alert("Enter text");
		return false;
	} else if ($topic == "") {
		alert("Select topic");
		return false;
	}
	$data = {
		confirmno : $confirm_num,
		note_topic : $topic,
		text : $notes
	};

	console.log($data);
    
	$.ajax({
		type : "POST",
		url : '/reservation_notes',	
		data : $data,
		dataType : 'json',
		success : function(data) {
	
			if (data.status == "success") {
				returnData = data.data;
				console.log(returnData.user_image);
				$newNote = '<li><figure class="guest-image">' + 
					'<img src="' + returnData.user_image + '" alt=""></figure>' + 
					'<div class="note-title"><h4>' + returnData.username + '</h4>' + 
					'<time datetime="2013-10-23 06:05:20"><span class="time">'+returnData.posted_time + 
					'</span><span class="date"> '+returnData.posted_date+'</span>' + '</time><span class="topic">' + returnData.topic +
					'</span></div><p>' + returnData.text + '</p></li>';				
				$("#notes").prepend($newNote);
				refreshViewScroll();
			}
		},
		error : function() {		
		   console.log("There is an error!!");
		}
	});
}





