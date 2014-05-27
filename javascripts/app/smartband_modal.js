/**
* model class for smart band listing
*
*/

var SmartBandModal = function(reservationID) {
	BaseModal.call(this);
	var that = this;
	this.url = "/ui/show?haml_file=modals/smartband&json_input=smartbands/smart_band_list.json&is_hash_map=true&is_partial=true";

	this.delegateEvents = function() {
		that.myDom.find('#add-new-button').on('click', that.addNewSmartBand);
	};

	/**
	* function to handle click on add new button screen
	*/
	this.addNewSmartBand = function(){
		var addNewSmartBandModal = new AddNewSmartBandModal();
		addNewSmartBandModal.initialize();
	}
};