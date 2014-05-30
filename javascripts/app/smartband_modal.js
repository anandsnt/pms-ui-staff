/**
* model class for smart band listing
*
*/

var SmartBandModal = function(reservationID) {
	BaseModal.call(this);
	var that = this;
	this.url = "/ui/show?haml_file=modals/smartbands/smartband&json_input=smartbands/smart_band_list.json&is_hash_map=true&is_partial=true";
	this.reservationID = reservationID;
	//this.url = "/api/reservations/" + this.reservationID + "/smartbands"
	

	this.delegateEvents = function() {
		that.myDom.find('#add-new-button').on('click', that.addNewSmartBand);
		that.myDom.find('#listing-area ul li').on('click', that.clickedOnSmartband);
	};

	this.modalDidShow = function(){
		// Set scrolling
    	createVerticalScroll('#listing-area');
    };

	/**
	* function to handle click on add new button screen
	*/
	this.addNewSmartBand = function(){
		var addNewSmartBandModal = new AddNewSmartBandModal(that.reservationID);
		addNewSmartBandModal.initialize();
	}

	/**
	* function to handle on each smarband click, which means on li
	*/
	this.clickedOnSmartband = function(event){
		var target = $(event.target);
		var id = target.attr("data-id");
		var updateSmartBandBalanceModal = new UpdateSmartBandBalanceModal(id);
		updateSmartBandBalanceModal.initialize();
	}


};