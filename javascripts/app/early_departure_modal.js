var EarlyDepartureModal = function(callBack, domThat){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "ui/earlyDeparture";
  	this.delegateEvents = function(){
		that.myDom.find('#ok').on('click', that.okButtonClicked);
	};
   	this.okButtonClicked = function(){
   		domThat.isEarlyDepartureFlag = "true";
   		that.hide(callBack);
   	};
};