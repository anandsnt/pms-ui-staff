/*jQuery(function($){
	showGreetings();
});*/

function showGreetings(){
	var d = new Date();
	var time = d.getHours();
	
	//Display greetings message
	if (time < 12){
		$('#greetings').html('Good Morning');
	}
	else if (time >= 12 && time < 16){
		$('#greetings').html('Good Afternoon');
	}
	else{
		$('#greetings').html('Good Evening');
	}
}
