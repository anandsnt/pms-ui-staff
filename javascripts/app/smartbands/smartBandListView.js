/**
* model class for smart band listing
*
*/

var SmartBandListView = function(domRef) {
	BaseView.call(this);
	this.myDom = domRef;
	console.log(this.myDom);	
	var that = this;	
	console.log(that.myDom);
	this.reservationID = '';
	//this.url = "/api/reservations/" + this.reservationID + "/smartbands"
	

	this.delegateEvents = function() {
		
		that.myDom.find('#listing-area ul li').on('click', that.clickedOnSmartband);
	};

	this.pageshow = function(){
		// Set scrolling
    	createVerticalScroll('#listing-area');   
    	that.parentController.hideButton('see-all-band-button');
    	that.parentController.showButton('add-new-button');
    };


	/**
	* function to handle on each smarband click, which means on li
	*/
	this.clickedOnSmartband = function(event){
		var target = $(event.target);
		var id = target.attr("data-id");
		
		that.showPage('update-card-info');
	}


};