var UpsellLateCheckoutView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;  
  var that = this;
  
  this.pageinit = function(){
  };
   this.delegateEvents = function(){  
	   that.myDom.find('#save').on('click', that.saveHotelDetails); 
  };
  this.saveHotelDetails =  function(){
	  var check_out_time_charge = new Array();
	  var i = 1;
	  var time = "", charge = "";
	  var dict = "";
	  var is_late_checkout_set = "false", is_exclude_guests = "false";
	  var allowed_late_checkout = "";
	  $("input[name=checkout-time-extended-to]").each(function(){
		  time = $("#checkout-time-extended-to-" + i).val();
		  charge = $("#charge-for-checkout-" + i).val();
		  dict = {'time': time, 'charge': charge};
		  check_out_time_charge.push(dict);
		  i = i + 1;
	  });
	  console.log(check_out_time_charge);
	  if($("#div-late-checkout-upsell").hasClass("on")) {
		  is_late_checkout_set = "true";
	  }
  };
};