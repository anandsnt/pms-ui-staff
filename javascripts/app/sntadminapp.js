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
            sntapp.fetchAndRenderView(url, $("#replacing-div-first"), viewParams, 'BLOCKER');
        }
    };
    this.gotoPreviousPage = function(viewParams) {
	  if($("#replacing-div-second").html() != ""){
		  $("#replacing-div-second").html("");
		  $("#replacing-div-second").removeClass("current");	 
	  }
	  else{
	  	$("#replacing-div-first").html("");
	  	$("#replacing-div-first").removeClass("current");
	  }
	  viewParams['backDom'].show();	  
  };
  this.gotoNextPage =  function(e){  	
  	
  	e.preventDefault();	
  	//sntadminapp.clearReplacingDiv();  	
  	var href = $(this).attr("href");
  	var viewParams = {};
  	var backDom = $("#replacing-div-first");
  	backDom.hide();
  	var nextViewParams = {'backDom': backDom};
     
    if(href != undefined){
  		sntapp.fetchAndRenderView(href, $("#replacing-div-second"), viewParams, 'NONE', nextViewParams);
    }
  };  

};

sntadminapp = new adminApp();
