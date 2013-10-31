var DeleteFFPModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "staff/user_memberships/delete_membership";
  	this.delegateEvents = function(){
    	$('#modal-overlay, #modal-close, #cancel').on('click', that.hide);

	}
	this.modalInit = function(){
        console.log("modal init in DeleteFFPModal")
    }

  
}