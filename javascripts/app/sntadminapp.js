var adminApp = function(){
    var that = this;
    this.clearReplacingDiv = function() {	
	  $("#replacing-div").html("");
	  $($(this).attr("href")).show();
    };
    this.appendNewPage = function(event){ 		
            var href = $(this).find("a").eq(0).attr("href");
            if(href != undefined){
                    var url = href;
                    event.preventDefault();		  
                    var viewParams = {};
                    $(this).parents('section:eq(0)').hide();
                    sntapp.fetchAndRenderView(url, $("#replacing-div"), viewParams);
            }
    };
    

};

sntadminapp = new adminApp();
