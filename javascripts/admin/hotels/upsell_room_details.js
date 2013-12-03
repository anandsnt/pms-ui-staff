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
  //Save daily upsell rooms set up
  this.saveDailyUpSellSetup = function(){
  	 
  	 var is_upsell_on = "false";
  	 if($("#div-upsell-rooms").hasClass("on")){
  	 	var is_upsell_on = "true";
  	 }
  	 var is_one_night_only = "false";
  	 if($("#upsell_for_one_night").parent("label:eq(0)").hasClass("checked")) {
	  	  var is_one_night_only = "true";
	 }
	 var is_force_upsell = "false";
  	 if($("#force_upsell").parent("label:eq(0)").hasClass("checked")) {
	  	  var is_force_upsell = "true";
	 }
  	 var total_upsell_target_amount = that.myDom.find('#daily-upsell-targets-amount').val(),
  	 total_upsell_target_rooms = that.myDom.find('#daily-upsell-target-rooms').val(),
  	 upsell_amounts_count = that.myDom.find('#upsell_amounts_count').val(),
  	 upsell_levels_count = that.myDom.find('#total_level_count').val();
  	 // to create upsell amonts array
  	 var upsell_amounts = [];
  	 for(i=0; i< upsell_amounts_count; i++){
  	 	var upsell_amount_data = {};
  	 	upsell_amount_data.amount = $("#upsell_amounts_"+i).val();
  	 	upsell_amount_data.level_from = $("#level_from_"+i).val();
  	 	upsell_amount_data.level_to = $("#level_to_"+i).val();
  	 	console.log("reached ===="+ $("#level_from_"+i).val());
  	 	upsell_amounts.push(upsell_amount_data);
  	 }
  	 //to create upsell room levels array
  	 var upsell_room_levels = [];
  	 for(j=1; j<= upsell_levels_count; j++){
  	 	var len = that.myDom.find('#level_'+j+' ul li').length;
  	 	var upsell_level_data = {};
  	 	upsell_level_data.level_id = j;
  	 	upsell_level_data.room_types = [];
  	 	for (var k=1;k<=len;k++){
  	 		upsell_level_data.room_types.push(that.myDom.find('#level_'+j+' li:nth-child('+k+')').val());
  	 	}
  	 	upsell_room_levels.push(upsell_level_data);
  	 }
  	 
  	 var data = {};
  	 
  	 var upsell_setup = {};
  	 
  	 upsell_setup.is_force_upsell = is_force_upsell;
  	 upsell_setup.is_one_night_only = is_one_night_only;
  	 upsell_setup.is_upsell_on = is_upsell_on;
  	 upsell_setup.total_upsell_target_amount = total_upsell_target_amount;
  	 upsell_setup.total_upsell_target_rooms = total_upsell_target_rooms;
  	 
  	 data.upsell_setup = upsell_setup;
  	 data.upsell_amounts = upsell_amounts;
  	 data.upsell_room_levels = upsell_room_levels;
  	 console.log(JSON.stringify(data));
  	 
  	 $.ajax({
			type: "POST",
			url : "/admin/room_upsells/update_upsell_options",
			dataType: 'json',
			data :data,
			success : function(data) {
				if(data.status == "success"){
					console.log("Saved Successfully");
					that.gotoPreviousPage();
				}
			},
			error : function() {
				alert("Sorry, not there yet!");
			}
		});
  	 
  	  
  };
};