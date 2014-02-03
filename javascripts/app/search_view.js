var Search  = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDomElement = domRef;

    
  this.pageinit = function(){

    that.currentQuery = "";
    that.fetchResults = [];
    that.fetchTerm = "";
    var type = that.myDomElement.find($('#search_list')).attr("data-search-type");
    /*preload the search results, 
    if navigated to search screen by clicking checking-in/checking-out/in-house options
    */

    // Start listening to card swipes
    this.initCardSwipe();

    if(type != "") {
        var search_url = "search.json?status=" + type;
        this.fetchSearchData(search_url, "",type);
    }
    
    // A dirty hack to allow "this" instance to be refered from sntapp
    sntapp.setViewInst('Search', that);

    // // DEBUG
    // window.trigger = that.postCardSwipData;
  };

  this.pageshow = function() {
    this.initCardSwipe();
  };

  // Start listening to card swipes
  this.initCardSwipe = function() {
   
      var options = {
          successCallBack: function(data){

            // if this is not search do nothing
            // TODO: support new pages when they are added
            var activeMenu = $('#main-menu').find('a.active').data('page');
            if ('search' != activeMenu) {
              return;
            };

            var url = '/staff/payments/search_by_cc';
            var data = {
              'et2': data.RVCardReadTrack2,
              'ksn': data.RVCardReadTrack2KSN
            };
            that.postCardSwipData(url, data);
          },
          failureCallBack: function(errorObject){

            // if this is not search do nothing
            // TODO: support new pages when they are added
            var activeMenu = $('#main-menu').find('a.active').data('page');
            if ('search' != activeMenu) {
              return;
            };

            // Could not read the card properly
            that.fetchCompletedOfFetchSearchData( {'data': ''}, {'swipe_error': 'INVALID_CARD'} );
          }
      };

      if (sntapp.cardSwipeDebug ===  true)  { sntapp.cardReader.startReaderDebug(options) } ;

      if(sntapp.cordovaLoaded){ sntapp.cardReader.startReader(options) };     
      
    
  };

  this.delegateEvents = function(){  
    that.myDomElement.find($('#query')).on('focus', that.callCapitalize);
    that.myDomElement.find($('#query')).on('keyup', that.queryEntered);
    that.myDomElement.find($('#search-form')).on('submit', that.submitSearchForm);
    that.myDomElement.find($('#clear-query')).on('click', that.clearResults);
  };

  //Clear Search Results 
  this.clearResults = function(e){
    //if the method is invoked from other views to clear search results, 'this', 'e' are undefined.
    if($(this).hasClass('visible')){    
      $(this).removeClass('visible');
    }

    $('#query').val('');
    $('#search-results').empty().addClass('hidden');
    that.updateView();
    
  };

  //when a user press enter key from search textbox
  this.submitSearchForm = function(e){
    return false;
  };
  
  //when user focus on search text
  this.callCapitalize = function(e){
    $(this).capitalize();
  };

  this.fetchCompletedOfFetchSearchData = function(response, requestParams) {
      $("#search-results").empty().removeClass('hidden');
      $('#preloaded-results').addClass('hidden');
      $('#no-results').addClass('hidden');
      
      // set up reservation status
      var reservation_status = "";
      var type = requestParams['type'];
      if(type == "DUEIN"){
        reservation_status = "checking in";
      }
      else if(type == "DUEOUT"){
        reservation_status = "checking out";
      }
      else if(type == "INHOUSE"){
        reservation_status = "in house";
      }
      
      if(response.data.length > 0){
        that.fetchResults = response.data;
        that.displayFilteredResults(that.fetchResults, that.currentQuery);
      }
      // No data in JSON file
      else if(response.data.length == 0){
        if(reservation_status != ""){
          // When dashboard buttons with 0 guests are clicked, show search screen message - "No guests checking in/out/in house" 
          $('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No guests '+reservation_status+'</strong></li>');
        }
        else{
          // To show no matches message while search guest with 0 results.
          $('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check that you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number. <span href=\"#\" class=\"hidden open-modal-fix\">Or add a New Guest</span>.</li>');
              //TODO: verify implemention, rename function
              that.updateView();
        }

        // showing card swipe errors
        if (requestParams['swipe_error'] === 'INVALID_CARD') {
          $('#search-results').html('<li class="no-content"><span class="icon-no-content icon-card"></span><strong class="h1">Invalid Credit Card</strong><span class="h2">Try with another card, search Guests manually or <span href=\"#\" class=\"hidden open-modal-fix\">add a New Guest</span>.</li>');

          that.updateView();
        } else if(requestParams['swipe_error'] === 'NO_CONFIRM') {
          $('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No Guest or Reservation Found</strong><span class="h2">Try with another card, search Guests manually or <span href=\"#\" class=\"hidden open-modal-fix\">add a New Guest</span>.</li>');
          that.updateView();
        };
      }   
  };
  
  this.fetchFailedOfFetchSearchData = function(){
    $('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check that you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number. <span href=\"#\" class=\"hidden open-modal-fix\">Or add a New Guest</span>.</li>');
    //TODO: verify implemention, rename function
    that.updateView();    
  };
  
  this.fetchSearchData = function(url, $query, type){
    
    var webservice = new WebServiceInterface();
    var data = {fakeDataToAvoidCache: new Date()}; // fakeDataToAvoidCache is iOS Safari fix
    var successCallBackParams = {'type': type};
    var options = {
         requestParameters: data,
         successCallBack: that.fetchCompletedOfFetchSearchData,
         successCallBackParameters: successCallBackParams,
         failureCallBack: that.fetchFailedOfFetchSearchData,
         loader: 'BLOCKER',
      }; 
    webservice.getJSON(url, options);
  
  };


  // post the card swipe data
  this.postCardSwipData = function(url, data) {
    var webservice = new WebServiceInterface();
    var options = {
      loader: 'BLOCKER',
      requestParameters: data,
      successCallBack: function(response) {

        if (data.confirmation === 'nill' && data.id === 'nill') {

          // No reservation was not found
          that.fetchCompletedOfFetchSearchData( {'data': ''}, {'swipe_error': 'NO_CONFIRM'} );
        } else {
          that.postCardSwipDataSuccess(response);
        }
      },
      failureCallBack: function (errorMessage){

        // No reservation was not found
        that.fetchCompletedOfFetchSearchData( {'data': ''}, {'swipe_error': 'NO_CONFIRM'} );
      }
    };
    webservice.postJSON(url, options);
  };

  // got the guest!
  // lets load his staycard right away! 
  this.postCardSwipDataSuccess = function(response) {
    var viewURL = '/staff/staycards/staycard';
    var viewDom = $('#page-inner-first');
    var params = {
      'confirmation': response.data.confirmation,
      'id': response.data.id
    };
    var loader = 'BLOCKER';
    var nextViewParams = {
      'showanimation': true,
      'current-view': 'search_view'
    };
    sntapp.fetchAndRenderView(viewURL, viewDom, params, loader, nextViewParams);
  };


   //when user focus on search text
  this.queryEntered = function(event){
    that.currentQuery = $.trim($(this).val());
    // Clear button visibility toggle
    that.showHideClearQueryButton();

    if(that.currentQuery.length < 3){
      that.currentQuery = "";
      that.fetchResults = [];
      that.fetchTerm = "";
      $('#search-results').empty().addClass('hidden');
      //TODO: verify working. Rename function
      that.updateView();
    return;
  }

  if(that.fetchTerm!="" && that.currentQuery.indexOf(that.fetchTerm) === 0) {
      that.displayFilteredResults(that.fetchResults, that.currentQuery);
      return;
  }
    that.fetchTerm = that.currentQuery;  
    var searchUrl = 'search.json?&query='+ that.fetchTerm;
    that.fetchSearchData(searchUrl, that.fetchTerm,"");
    
  };

  //TODO:pass query 
  this.showHideClearQueryButton = function(){
    if($.trim($('#query').val()) !== '') {
        $('#clear-query:not(.visible)').addClass('visible');
    } else {
        $('#clear-query.visible').removeClass('visible');
    }
  };

     /*this.getFilteredResults = function($query){
      $('#search-results').html("");
      that.displayFilteredResults(searchResults, $query);
     };*/

     this.displayFilteredResults = function(searchResults, $query){
      if($query == ""){
        that.displaySearchResults(searchResults,$query);
        return false;
      }
      $('#search-results').html("");
      try
      {
          var items=[];
          $.each(searchResults, function(i,value){


            if ((escapeNull(value.firstname).toUpperCase()).indexOf($query.toUpperCase()) >= 0 || 
                  (escapeNull(value.lastname).toUpperCase()).indexOf($query.toUpperCase()) >= 0 || 
                  (escapeNull(value.group).toUpperCase()).indexOf($query.toUpperCase()) >= 0 ||
                  (escapeNull(value.room).toString()).indexOf($query) >= 0 || 
                  (escapeNull(value.confirmation).toString()).indexOf($query) >= 0)
              {
                  items.push($('<li />').html(
                      that.writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.reservation_status,value.room,value.roomstatus,value.fostatus,value.location,value.group,value.vip)
                  ));
              }
              
          });

        $.each(items, function(i,value){
                $('#search-results').append(value).highlight($query);
              });

        // Set pageScroll
      if (pageScroll) { destroyPageScroll(); }
      createPageScroll('#search');
      }
      catch(e)
      {
        $('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span></li>');
      }

      // As this search filters JSON content, we need temp custom handling for no results scenario
      if ($('#search-results').is(':empty'))
      {
        $('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number</span></li>');
      }

    };

    this.displaySearchResults = function(response, $query){
      try
        {
            var items=[];
            $.each(response, function(i,value){

            items.push($('<li />').html(
                        that.writeSearchResult(value.id,value.firstname,value.lastname,value.image,value.confirmation,value.reservation_status,value.room,value.roomstatus,value.fostatus,value.location,value.group,value.vip)
                    ));

                    $('#search-results').append.apply($('#search-results'),items).highlight($query);
            });

          // Set pageScroll
      if (pageScroll) { destroyPageScroll(); }
      createPageScroll('#search');
        }
        catch(e)
        {
          $('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span></li>');
        }

        // As this search filters JSON content, we need temp custom handling for no results scenario
        if ($('#search-results').is(':empty'))
        {
          $('#search-results').html('<li class="no-content"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number</span></li>');
        };
    };

    this.writeSearchResult = function(id, firstname, lastname, image, confirmation, reservation_status, room, roomstatus, foStatus, location, group, vip){

      var reservationStatusIcon = this.getReservationStatusMapped(reservation_status);
      var roomStatusMapped = this.getRoomStatusMapped(roomstatus, foStatus);
      var roomstatusexplained = "";
      var roomStatus = "";
      var showRoomStatus = false;
    
    // Display FO status only when room-status = NOT-READY and reservation status = CHECKING-IN
      if(roomStatusMapped == "not-ready" && reservation_status == "CHECKING_IN"){
        roomstatusexplained = foStatus;
        showRoomStatus = true;
      }
    // Show color coding ( Red / Green - for Room status) for room only if reservation status = CHECKING-IN
      if(reservation_status == "CHECKING_IN") {
        roomStatus = '<strong class="room-number ' + escapeNull(roomStatusMapped) + '">' + escapeNull(room) + '</strong>';
      }else {
        roomStatus = '<strong class="room-number">' + escapeNull(room) + '</strong>';
      }
      
      var $location = (escapeNull(location) != '') ? '<span class="icons icon-location">' + escapeNull(location) + '</span>' : '',
        $group = (escapeNull(group) != '') ? '<em class="icons icon-group">' + escapeNull(group) + '</em>' : '',
        $vip = vip ? '<span class="vip">VIP</span>' : '',
        $image = (escapeNull(image) != '') ? '<figure class="guest-image"><img src="' + escapeNull(image) + '" />' + $vip +'</figure>' : '<figure class="guest-image"><img src="/assets/blank-avatar.png" />' + $vip +'</figure>',
        $roomAdditional = showRoomStatus ? '<span class="room-status">' + roomstatusexplained + '</span>' : '',
        $viewStatus = reservationStatusIcon ? '<span class="guest-status ' + escapeNull(reservationStatusIcon) + '"></span>':'<span class="guest-status"></span>',
    
        $output =
        '<a href="staff/staycards/staycard?confirmation=' + confirmation+'&id='+ escapeNull(id)+ '" class="guest-check-in link-item float" data-transition="inner-page">' +
            $image +
            '<div class="data">' +
                '<h2>' + escapeNull(lastname) + ', ' + escapeNull(firstname) + '</h2>' +
                '<span class="confirmation">' + escapeNull(confirmation) + '</span>' + $location + $group +
            '</div>'+
            $viewStatus +
            roomStatus + $roomAdditional +
        '</a>';
      return $output;
    };

    //Map the reservation status to the view expected format
    this.getReservationStatusMapped = function(status){
      var viewStatus = "";
      if(status == "RESERVED"){
        viewStatus = "arrival";
      }else if(status == "CHECKING_IN"){
        viewStatus = "check-in";
      }else if(status == "CHECKEDIN"){
        viewStatus = "inhouse";
      }else if(status == "CHECKEDOUT"){
        viewStatus = "departed";
      }else if(status == "CHECKING_OUT"){
        viewStatus = "check-out";
      }else if(status == "CANCELED"){
        viewStatus = "cancel";
      }else if((status == "NOSHOW")||(status == "NOSHOW_CURRENT")){
        viewStatus = "no-show";
      }
      return viewStatus;
    };

    //Map the room status to the view expected format
    this.getRoomStatusMapped = function(roomstatus, fostatus){
      var mappedStatus = "";
      if(roomstatus == "READY" && fostatus == "VACANT"){
        mappedStatus = 'ready';
      }else{
        mappedStatus = "not-ready";
      }
    return mappedStatus;
    };

    this.updateView = function(){
      // Content update
      if ($('#search-results').is(':empty'))
      {
          if ($('#preloaded-results').length)
          {
              $('#no-results').addClass('hidden');
              $('#preloaded-results').removeClass('hidden');
          }
          else
          {
              $('#no-results').removeClass('hidden');
          }
      }
      // Set pageScroll
      if (pageScroll) { destroyPageScroll(); }
      createPageScroll('#search');
    };
};
