var HotelBrandsView = function(domRef){
  
	BaseView.call(this);
	this.myDom = domRef;
	var that = this;
	this.pageinit = function(){
		    
	};
	this.delegateEvents = function(){  	
		that.myDom.find('#brands tr').on('click', sntapp.appendDataInline.appendDataInline);
	};	
};