var DeleteLoyaltyModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "staff/user_memberships/delete_membership";
  	this.loyalty_id = "";
  	this.loyalty_type = "";
  	
  	this.delegateEvents = function(){
  		that.myDom.find('#modal-overlay, #modal-close, #cancel').on('click', that.hide);
		that.myDom.find('#loyalty-delete').on('click', that.deleteLoyalty);
		var params = this.params;
		this.loyalty_id = params.loyalty_id;
		this.loyalty_type = params.loyalty_type;
	}

    this.deleteLoyalty = function(event){
  		event.preventDefault();
		event.stopImmediatePropagation();
		
		var $loyalty_id = that.loyalty_id;
		var $type = that.loyalty_type;
		
		if($type == "flyer"){
			$("#loyalty-ffp #ff-program-" +$loyalty_id).remove();
			$("#stay-card-loyalty #loyalty option#"+$loyalty_id).remove();
		}
		else if($type == "hotel"){
			$("#loyalty-hlp #hl-program-" +$loyalty_id).remove();
			$("#stay-card-loyalty #loyalty option#"+$loyalty_id).remove();
		}
		var FFPEmpty = $('#loyalty-ffp').is(':empty');
		var HLPEmpty = $('#loyalty-hlp').is(':empty');
		
		if(FFPEmpty && HLPEmpty){
			clearSelectionUI();
		}

	    var options = {
	      loader: 'BLOCKER'
	    };
	    var url = '/staff/user_memberships/' + $loyalty_id +'.json';
	    var webservice = new WebServiceInterface();
	    webservice.deleteJSON(url, options);
		that.hide();
	}
}