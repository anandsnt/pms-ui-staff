$(document).on('click', "#post_notes #reservation_notes", function() {

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
				$newNote = '<li><figure class="guest-image">' + 
				'<img src="' + data.user_image + '" alt=""></figure>' + 
				'<div class="note-title"><h4>' + data.username + '</h4>' + 
				'<time datetime="2013-10-23 06:05:20"><span class="time">'+data.posted_time + 
				'</span><span class="date">'+data.posted_date+'</span>' + '</time><span class="topic">' + data.topic +
				'</span></div><p>' + data.text + '</p></li>';
				$("#notes").prepend($newNote);
			}
		},
		error : function() {
		   console.log("There is an error!!");
		}
	});

});

