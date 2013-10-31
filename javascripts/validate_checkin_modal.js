var ValidateCheckinModal = function(viewDom){
	
	
  	BaseModal.call(this);
  	this.myDom = viewDom;
	alert(this.myDom);
	console.log("vww dom"+viewDom);
  	var that = this;
  	this.url = "ui/validateEmailAndPhone";
  	this.delegateEvents = function(){
  		console.log("sub modal delegate events");
    	$('#modal-overlay, #modal-close').on('click', that.hide);
		$('#validate #save').on('click', that.submitAndGotoCheckin);
		$('#validate #cancel').on('click', that.ignoreAndGotoCheckin);
	}
	this.modalInit = function(){
        console.log("modal init in sub modal")
    }
    this.submitAndGotoCheckin = function(){
    	alert("hai");
    	var phone = $("#validate #ph-num").val();
    	var email = $("#validate #email").val();
    	var data = {phone : phone, email: email};
    	console.log(data);
        console.log("modal init in sub modal");
        that.hide();
    }
    this.ignoreAndGotoCheckin = function(){
        console.log("modal init in sub modal");
        that.hide();
    }
}