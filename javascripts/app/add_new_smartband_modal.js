/**
* model class for smart band adding
*
*/

var AddNewSmartBandModal = function() {
	BaseModal.call(this);
	var that = this;
	this.url = "/ui/show?haml_file=modals/addNewSmartBand&json_input=smartbands/smart_band_list.json&is_hash_map=true&is_partial=true";
	
};