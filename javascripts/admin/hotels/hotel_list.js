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
    if(target.attr("id") == "add_new_hotel"){ // add new hotel  
      event.preventDefault();      
      that.gotoNextPage(target);
    }
    // click of reservation import via ftp
    else if(target.attr("name") == "reservation-import"){      
      var checkedStatus = target.is(':checked');
      console.log(checkedStatus);
      // isAlreadyTurnedOff will be true, if it checked
      // show confirm if it is in off/unchecked stage
      if(checkedStatus){
        var confirmForReservationImport = confirm("Do NOT switch ON, until hotel mapping and setup is completed!, Do you want to proceed?");
          if(!confirmForReservationImport){
            event.preventDefault();
          } 
      }
      
      var data = {'hotel_id' :  };
      //TODO: Implement correct API
      var webservice = new WebServiceInterface();
      var url = '';
      var options = {
          successCallBack: that.fetchCompletedOfSave,
          failureCallBack: that.fetchFailedOfSave,
          requestParameters: data,
          successCallBackParameters:{ "event": event},
          loader: 'normal',
      };
      return true;
    }     
    else if(target.hasClass('title') ){ // edit hotel details
      event.preventDefault();    
      that.gotoNextPage(target);
    }
    // some case event click may be on child elements of a with class title
    else if(!jQuery.isEmptyObject(target.closest('a.title'))){
      event.preventDefault();    
      target = target.closest('a.title');
      console.log(target);
      that.gotoNextPage(target);
    }
   
    return true;
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