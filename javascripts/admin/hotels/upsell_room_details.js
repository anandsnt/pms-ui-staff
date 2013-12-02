var UpsellRoomDetailsView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;  
  var that = this;
  
  this.pageinit = function(){
    console.log("Reached in pageinit UpsellRoomDetailsView");
  };
  this.delegateEvents = function(){  
     that.myDom.find('#upsell_level .sortable-list').sortable({
        connectWith: '#upsell_level .sortable-list'
     });
  	 that.myDom.find('#save').on('click',that.saveDailyUpSellSetup);
  };
  this.saveDailyUpSellSetup = function(){
  	console.log("saveDailyUpSellSetup");
  	
  	 var len1 = that.myDom.find('#level_one ul li').length;
  	 var len2 = that.myDom.find('#level_two ul li').length;
  	 var len3 = that.myDom.find('#level_three ul li').length;
  	 var upsell_rooms = that.myDom.find('#upsell-rooms').val();
  	 var daily_upsell_targets = that.myDom.find('#daily-upsell-targets').val();
  	 var rooms = that.myDom.find('#rooms').val();
  	 var upsell_for_one_night = that.myDom.find('#upsell_for_one_night').val();
  	 var force_upsell = that.myDom.find('#force_upsell').val();
  	 var upsell_amounts = that.myDom.find('#upsell_amounts').val();
  	 console.log("len1 =",len1);
  	 console.log("len2 =",len2);
  	 console.log("len3 =",len3);
  	 console.log("upsell_rooms =",upsell_rooms)
  	 console.log("daily_upsell_targets =",daily_upsell_targets);
  	 console.log("rooms =",rooms);
  	 console.log("upsell_for_one_night =",upsell_for_one_night);
  	 console.log("force_upsell =",force_upsell);
  	 console.log("upsell_amounts =",upsell_amounts); 
  	 var upsell_level1 = [];
  	 var upsell_level2 = [];
  	 var upsell_level3 = [];
  	 
  	 for (var i=1;i<=len1;i++){
  	 	console.log("upsell_level1.push = ",that.myDom.find("#level_one ul li:nth-child("+i+")").val());
  	 	upsell_level1.push(that.myDom.find("#level_one ul li:nth-child("+i+")").val());
  	 }
  	 for (var i=1;i<=len2;i++){
  	 	console.log("upsell_level2.push = ",that.myDom.find("#level_two ul li:nth-child("+i+")").val());
  	 	upsell_level2.push(that.myDom.find("#level_two ul li:nth-child("+i+")").val());
  	 }
  	 for (var i=1;i<=len3;i++){
  	 	console.log("upsell_level3.push = ",that.myDom.find("#level_three ul li:nth-child("+i+")").val());
  	 	upsell_level3.push(that.myDom.find("#level_three ul li:nth-child("+i+")").val());
  	 }
  	 
  	 
  	 console.log("upsell_level1 ="+upsell_level1);
  	 console.log("upsell_level2 ="+upsell_level2);
  	 console.log("upsell_level3 ="+upsell_level3);
  	  
  	  var upsellrooms = {};
  	  upsellrooms.upsell_setup ={};
  	  upsellrooms.upsell_setup.is_force_upsell = that.myDom.find('#force_upsell').val();
  	  upsellrooms.upsell_setup.is_one_night_only = that.myDom.find('#upsell_for_one_night').val();
  	  upsellrooms.upsell_setup.is_upsell_on = that.myDom.find('#upsell-rooms').val();
  	  upsellrooms.upsell_setup.total_upsell_target_amount = that.myDom.find('#daily-upsell-targets').val();
  	  upsellrooms.upsell_setup.total_upsell_target_rooms = that.myDom.find('#rooms').val();
  	  
  	  upsellrooms.upsell_amounts =[];
  	  upsell_amounts = {};
  	  upsell_amounts[ "amount"] = that.myDom.find('#upsell_amounts').val();
  	  upsellrooms.upsell_amounts.push(upsell_amounts);
  	 
  	  
  }
};