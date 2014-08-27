var showTermsAndConditionsModal = function(backDom){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "ui/terms_and_conditions";
  	
  	this.delegateEvents = function(){
		that.myDom.find('#agree-button').on('click', that.setAgreeCheckbox);
		that.myDom.find('#disagree-button').on('click', that.setDisAgreeCheckbox);
		createVerticalScroll('#terms-content');
	};
	this.setAgreeCheckbox = function(){
		
		backDom.find("#terms-and-conditions").addClass("checked");
		backDom.find("#terms-and-conditions-span").addClass("checked");
		backDom.find("#terms-checkbox").attr("checked", true);
		
		that.hide();
		
	}; 
	this.setDisAgreeCheckbox = function(){
		backDom.find("#terms-and-conditions").removeClass("checked");
		backDom.find("#terms-and-conditions-span").removeClass("checked");
		backDom.find("#terms-checkbox").attr("checked", false);
		that.hide();
	};
   	
    
};
