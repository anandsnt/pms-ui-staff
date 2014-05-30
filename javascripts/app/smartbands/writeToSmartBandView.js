/**
* class for Hold smartband until ready & write
*
*/
var WriteToSmartBandView = function(domRef){

	BaseView.call(this);
	this.myDom = domRef;

	var that = this;
	

	this.delegateEvents = function(){ 
		$('#modal-overlay, #modal-close, #cancel').off('click');
        $('#modal-overlay, #modal-close, #cancel').unbind('click');
	};
	
	this.modalDidShow = function(){
		$('#modal-overlay, #modal-close, #cancel').unbind('click');
		that.myDom.find(".success").hide();
		that.myDom.find("#button-area").hide();
		setTimeout(function(){
			that.myDom.find(".success").show();
			that.myDom.find("#button-area").show();	

			that.myDom.find("#not-ready-status").hide();
			that.myDom.find("#cancel").hide();	
			$('#modal-overlay, #modal-close, #cancel').on('click');		
		}, 10000);
    };
};