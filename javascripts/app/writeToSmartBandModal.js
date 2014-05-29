/**
* model class for Hold smartband until ready & write
*
*/
var WriteToSmartBandModal= function(params){

	BaseModal.call(this);
	
	var that = this;
	this.url = "/ui/show?haml_file=modals/smartbands/writeToSmartBand&json_input=smartbands/smart_band_list.json&is_hash_map=true&is_partial=true";	

	this.modalDidShow = function(){

		that.myDom.find(".success").hide();
		that.myDom.find("#button-area").hide();
		setTimeout(function(){
			that.myDom.find(".success").show();
			that.myDom.find("#button-area").show();	

			that.myDom.find("#not-ready-status").hide();
			that.myDom.find("#cancel").hide();					
		}, 10000);
    };
};