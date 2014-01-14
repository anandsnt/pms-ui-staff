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
	  	 var backDom = $(this).parents("section:eq(0)");

		  if(typeof backDom === 'undefined') {
			  
		  }
        event.preventDefault();

        if(href != "#" && href != undefined){
            var url = href;       
            var viewParams = {'backDom': backDom};

            $(this).parents('section:eq(0)').hide();


            sntapp.fetchAndRenderView(url, $("#replacing-div-first"),{}, 'BLOCKER', viewParams);
        }
    };
    this.gotoPreviousPage = function(viewParams, currentView) {
	  /*if($("#replacing-div-second").html() != ""){
		  $("#replacing-div-second").html("");
		  $("#replacing-div-second").removeClass("current");	 
	  }
	  else{
	  	$("#replacing-div-first").html("");
	  	$("#replacing-div-first").removeClass("current");
	  }*/
      currentView.removeClass("current");
      //currentView.html("");
	  viewParams['backDom'].show();	
	  viewParams['backDom'].addClass("current");	
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
  
  // function for get current focused div, mainly used for backDom assigning
  this.getCurrentDiv = function(){
	  var currentDiv = null;
	  $("#content section.tab").each(function(){
			if($(this).is(":visible")){
				currentDiv = $(this); 				 				
			}
	  });
	  if(currentDiv == null) {
		  var currentDiv = $("#replacing-div-first");
		  console.log(currentDiv.is(":visible"));
		  if(!currentDiv.is(":visible")){  
			  currentDiv = $("#replacing-div-second");
		  }
	  }
	  return currentDiv;
  };
  
  // function for get next div
  this.getReplacingDiv = function(currentDiv){

	  var replacingDiv = null;
	  var currentDivID = currentDiv.attr("id");
	  if(currentDivID == "replacing-div-first"){
		  replacingDiv = $("#replacing-div-second");
	  }
	  else{
		  replacingDiv = $("#replacing-div-first");
	  }
	  return replacingDiv;	  
  };
  
  this.bookMarkClick = function(event){
		event.preventDefault();
		var target = $(event.target);	
		if(target.prop('tagName') != "A")
			return false;	
		var url = target.attr("href");

		if(typeof url !== 'undefined' && url != "#"){
			
			var currentDiv = that.getCurrentDiv();
			var nextDiv = that.getReplacingDiv(currentDiv);
	  		var backDom = currentDiv;
	  		
	  		$("#content section.tab").hide(); 
	  		viewParams = {'backDom': backDom};
	  		console.log(backDom);
	  		console.log(nextDiv);
	  		sntapp.fetchAndRenderView(url, nextDiv, {}, 'BLOCKER', viewParams);
	  		
	  		backDom.hide();
	  		nextDiv.show();
		}		  
	  };  
  

};


sntadminapp = new adminApp();
