/**
* class for Hold smartband until ready & write
*
*/
var WriteToSmartBandView = function(domRef){

	BaseView.call(this);
	this.myDom = domRef;

	var that = this;
	this.data = {};

	this.delegateEvents = function(){ 
			
	};
	
	this.pageshow = function(){
		that.parentController.disableOutsideClickClosing();
		that.myDom.find(".success").hide();
		that.myDom.find("#button-area").hide();
		//TODO: code for reading the cardid

		setTimeout(function(){
			that.myDom.find(".success").show();
			that.myDom.find("#button-area").show();	
			that.myDom.find("#not-ready-status").hide();
			that.myDom.find("#cancel").hide();	
			that.parentController.enableOutsideClickClosing();
			that.parentController.addRow(that.data);
			that.parentController.showPage('smartband-listing');
		}, 10000);
    };
};