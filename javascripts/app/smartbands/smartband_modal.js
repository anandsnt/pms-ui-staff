/**
* model class for smart band listing
*
*/

var SmartBandModal = function(reservationID) {

	BaseModal.call(this);
	var that = this;
	this.url = "/ui/show?haml_file=modals/smartbands/smartbands&json_input=smartbands/smart_band_list.json&is_hash_map=true&is_partial=true";

	this.reservationID = reservationID;

	this.delegateEvents = function(){
		that.myDom.find('#add-new-button').on('click', that.addNewSmartBand);
		that.myDom.find('#see-all-band-button').on('click', that.seeAllBandsClicked);
	}


	this.modalDidShow = function(){
		that.controllers = {
			"smartband-listing" : new SmartBandListView(that.myDom.find("#smartband-listing")),
			"add-new-smartband" : new AddNewSmartBandView(that.myDom.find('#add-new-smartband')),
			"update-card-info" : new UpdateSmartBandBalanceView(that.myDom.find('#update-card-info')),
			"write-to-band": new WriteToSmartBandView(that.myDom.find('#write-to-band'))
		};
		for(controller in this.controllers){		
			that.controllers[controller].parentController = that;
			that.controllers[controller].initialize();		
		}
		that.showPage("smartband-listing");
    };
	
	//this.url = "/api/reservations/" + this.reservationID + "/smartbands"

    this.showPage = function(id){
    	that.myDom.find('#' + id).siblings(":not(.header)").hide();
    	that.myDom.find('#' + id).show();
    	that.controllers[id].pageshow();    
    }

    this.getControllerObject = function(id){
    	return that.controllers[id];
    }

	/**
	* function to handle click on add new button screen
	*/
	this.addNewSmartBand = function(){
		that.showPage('add-new-smartband');
	}    


	/** 
	* function to goto see all bands screen
	*/
	this.seeAllBandsClicked = function(){
		that.showPage('smartband-listing');
	}

	this.hideButton = function(id) {
		that.myDom.find('#' + id).hide();
	}

	this.showButton = function(id) {
		that.myDom.find('#' + id).show();
	}	
};