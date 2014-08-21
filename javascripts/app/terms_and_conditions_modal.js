var showTermsAndConditionsModal = function(backDom){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "ui/terms_and_conditions";
  	
  	this.delegateEvents = function(){
		that.myDom.find('#agree-button').on('click', that.setAgreeCheckbox);
		that.myDom.find('#disagree-button').on('click', that.hide);
		createVerticalScroll('#terms-content');
	};
	this.setAgreeCheckbox = function(){
		
		backDom.find("#terms-and-conditions").addClass("checked");
		backDom.find("#terms-and-conditions-span").addClass("checked");
		backDom.find("#terms-checkbox").attr("checked", true);
		
		that.hide();
		
	};
   	
    
};
