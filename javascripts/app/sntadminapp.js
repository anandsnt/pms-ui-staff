var adminApp = function(){
    var that = this;
    this.clearReplacingDiv = function() {	
      $("#replacing-div-first").html("");
    $("#replacing-div-second").html("");
	  $("#replacing-div-first").show();
	  $($(this).attr("href")).show();
  
    };
    this.appendNewPage = function(event){ 		
        var href = $(this).find("a").eq(0).attr("href");
        event.preventDefault();
        if(href != "#" && href != undefined){
            var url = href;                    		 
            var viewParams = {};
            $(this).parents('section:eq(0)').hide();
            sntapp.fetchAndRenderView(url, $("#replacing-div-first"), viewParams);
        }
    };
    

};

sntadminapp = new adminApp();
