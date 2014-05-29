/**
* model class for smart band adding
*
*/

var UpdateSmartBandBalanceModal = function(smartbandId) {
	BaseModal.call(this);
	var that = this;
	this.url = "/ui/show?haml_file=modals/smartbands/modifyAddCreditSmartband&json_input=smartbands/smartband_details.json&is_hash_map=true&is_partial=true";
	
	this.delegateEvents = function(){
		that.myDom.find('#continue-button').on('click', that.continueButtonClicked);		
	}

	/**
	* function to handle click on continue button
	*/
	this.continueButtonClicked = function(){
		var writeToSmartBandModal = new WriteToSmartBandModal();
		writeToSmartBandModal.initialize();
	};
};