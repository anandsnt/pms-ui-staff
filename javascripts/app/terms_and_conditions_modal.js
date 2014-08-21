var showTermsAndConditionsModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "ui/terms_and_conditions";
  	
  	this.delegateEvents = function(){
		that.myDom.find('#validate-opt-email #save').on('click', that.saveEmail);
	};
   	
    
};
