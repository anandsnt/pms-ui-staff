/**
* Controller for Hotel List in snt admin
* @Class
*/


var HotelListView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;  
  var that = this;

  /**
  * Method used to perform initial operations on elemnents    
  */
  this.pageShow = function(){
    that.myDom.find($('#hotels_list_table')).tablesorter();
  };


  /**
  * A method to bind event against elements in view,    
  */
  this.delegateEvents = function(){   		
    that.myDom.on('click', that.domClickHandler);  	 
  };


  /**
  * Method used to determine which event has to apply on elements
  * Based on class, id, name and other parameters we determing
  */
  this.domClickHandler = function(event){
    var target = $(event.target);
    event.preventDefault();    
    if(target.attr("id") == "add_new_hotel"){ // add new hotel    
      that.gotoNextPage(target);
    }
    else if(target.hasClass('title') ){ // edit hotel details
      that.gotoNextPage(target);
    }
    // some case event click may be on child elements of a with class title
    else if(target.parents('.title')){
      target = target.parents('.title:eq(0)');
      that.gotoNextPage(target);
    }
    // click of reservation import via ftp
    else if(target.attr("name") == "reservation-import"){
      console.log(target.attr("name"));
      var confirm = confirm("Do NOT switch ON, until hotel mapping and setup is completed!, Do you want to proceed?");
      if(confirm){
         /* var webservice = new WebServiceInterface();
          var url = '';
          var options = {

          };*/


        return true;
      }
      //TODO: Implement correct API

    }    
    return false;
  };

  /**
  * Method for showing next page (based on href)
  */
  this.gotoNextPage =  function(target){  	  	
  	//sntadminapp.clearReplacingDiv();  	
    var href = target.attr("href");
  	var viewParams = {};	
	  var currentDiv = sntadminapp.getCurrentDiv();
	  var nextDiv = sntadminapp.getReplacingDiv(currentDiv);  	
	  var backDom = currentDiv;
  	var nextViewParams = {'backDom': backDom};
    $(".currenthotel").attr("id", href.split('/')[3]);
  
    if(typeof href !== 'undefined'){
  		sntapp.fetchAndRenderView(href, nextDiv, viewParams, 'BLOCKER', nextViewParams);
  		nextDiv.show();
  		backDom.hide();
    }
  };
  
};