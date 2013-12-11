var SntAdminView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
    setUpAdmin(domRef, this);
  };
  this.delegateEvents = function(){
  	that.myDom.find('li.ui-state-default a.ui-tabs-anchor').on('click', that.clearReplacingDiv);
  	that.myDom.find('ul.dashboard-items li').on('click', sntadminapp.appendNewPage);
  	
  	that.myDom.find('#admin-menu li a').on('click', that.bookMarkClick);
  	that.myDom.find('#admin-header nav a').on('click', that.bookMarkClick);
  };
  this.bookMarkClick = function(event){
	event.preventDefault();
	var url = $(this).attr("href");
	if(url != "#" && url != undefined){

  		var backDom = null;
  		that.myDom.find("#content section.tab").each(function(){
  			if($(this).is(":visible")){
  				backDom = $(this); 				 				
  			}
  		});
  		
  		var div = that.myDom.find("#replacing-div-first");
  		if(div.html() != ""){  
  			div.hide();
  			div = that.myDom.find("#replacing-div-second");
  			if(backDom == null)
  				backDom = that.myDom.find("#replacing-div-first");
  		}
  		that.myDom.find("#content section.tab").hide(); 
  		viewParams = {'backDom': backDom};
  		
  		sntapp.fetchAndRenderView(url, div, {}, 'NORMAL', viewParams);
	}	  
  };

  this.clearReplacingDiv = function() {  
  	$("#replacing-div-first").html("");
    $("#replacing-div-second").html("");
	  $("#replacing-div-first").show();
	  $($(this).attr("href")).show(); 
  };

  this.bookMarkAdded = function(bookMarkId){
  	var delegateBookMark = new DelegateBookMark();
  	delegateBookMark.addBookMark(bookMarkId);
  };
  this.bookMarkRemoved = function(bookMarkId){
  	var delegateBookMark = new DelegateBookMark();
  	delegateBookMark.removeBookMark(bookMarkId);
  };  
};