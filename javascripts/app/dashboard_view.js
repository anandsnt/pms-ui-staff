var Dashboard = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
  	if (pageScroll) { destroyPageScroll(); }
		setTimeout(function(){
      if ($('#dashboard').length){
	      	createPageScroll('#dashboard');
        }
	  	}, 300);
  };

  this.delegateEvents = function(){
    $('#main-menu a#staff-settings').on('click',that.updateAccountSettings);
  };
  
  this.pageshow = function(){
  	that.showWelcomeMessage();
  };

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
  	that.myDom.find('#greetings').html(message);
  };
  
  this.updateAccountSettings = function(e){
  	var updateAccountSettings = new UpdateAccountSettings();
  	 updateAccountSettings.initialize();
  	 updateAccountSettings.type ="POST";
  	
  };

};
