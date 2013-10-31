var AddHLPModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "staff/user_memberships/new_hlp";
  	this.delegateEvents = function(){
    	$('#modal-overlay, #modal-close, #cancel').on('click', that.hide);

	}
	this.modalInit = function(){
        console.log("modal init in sub modal")
    }

  
}