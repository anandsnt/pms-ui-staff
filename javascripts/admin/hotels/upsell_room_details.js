var UpsellRoomDetailsView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;  
  var that = this;
  
  this.pageinit = function(){
    console.log("Reached in pageinit UpsellRoomDetailsView");
  };
  this.delegateEvents = function(){  
     that.myDom.find('#upsell_level .sortable-list').sortable({
        connectWith: '#upsell_level .sortable-list',
       });
  	
  };
  
};