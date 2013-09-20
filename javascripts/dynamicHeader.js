jQuery(function($){
	var d = new Date();
	var time = d.getHours();
	
	//Display greetings message
	if (time < 12){
		$('#greetings').html('Good Morning');
	}
	else if (time > 12 && time < 16){
		$('#greetings').html('Good Afternoon');
	}
	else{
		$('#greetings').html('Good Evening');
	}
	
	//Display current date
	var monthNames = [ "January", "February", "March", "April", "May", "June",
	                   "July", "August", "September", "October", "November", "December" ];
	var fullDate = monthNames[d.getMonth()] + " " + d.getDate() +", "+ d.getFullYear();
	$('date').html(fullDate);
	
});