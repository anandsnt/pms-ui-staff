var Dashboard = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
  	console.log("Dashboard pageinit");
  }

  this.showWelcomeMessage = function(e){
	var d = new Date();
	var time = d.getHours();
	var message = "";
	//Display greetings message
	if (time < 12){
		message = "Good Morning";
	}
	else if (time >= 12 && time < 16){
		message = "Good Afternoon";
	}
	else{
		message = "Good Evening";
	}

	that.myDom.find($('#greetings')).html('Good Evening');
  }

}
