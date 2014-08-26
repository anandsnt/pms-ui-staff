
var Search = function(domRef) {
	BaseView.call(this);
	var that = this;
	this.myDomElement = domRef;
	this.isSearchedRoomNumber = false;
	
	this.setDom = function(newDom){
		//in some cases we may want to reuse the old object & also may want use new dom
    	that.myDomElement = newDom;
  	};

	this.pageinit = function() {
		that.currentQuery = "";
		that.fetchResults = [];
		that.preloadedResults = [];
		that.fetchTerm = "";
		var type = that.myDomElement.find($('#search_list')).attr("data-search-type");

		/*preload the search results,
		 if navigated to search screen by clicking upsell late checkout option
		 */
		if (type == "LATE_CHECKOUT") {
			that.myDomElement.find("#no-results").html("");
			var search_url = "search.json?is_late_checkout_only=true";
			searchTitle = "Checking Out Late";
			var searchTitleHtml = that.myDomElement.find('#search-title').html();
			var newSearchTitleHtml = searchTitleHtml.replace("Search", searchTitle);
			that.myDomElement.find('#search-title').html(newSearchTitleHtml);
			this.fetchSearchData(search_url, "", type);
		}
		if (type == "QUEUE_ROOMS") {
			that.myDomElement.find("#no-results").html("");
			var search_url = "search.json?is_queued_rooms_only=true";
			searchTitle = "Queued Reservations";
			var searchTitleHtml = that.myDomElement.find('#search-title').html();
			var newSearchTitleHtml = searchTitleHtml.replace("Search", searchTitle);
			that.myDomElement.find('#search-title').html(newSearchTitleHtml);
			this.fetchSearchData(search_url, "", type);
		}

		/*preload the search results,
		 if navigated to search screen by clicking checking-in/checking-out/in-house options
		 */
		else if (type != "") {
			that.myDomElement.find("#no-results").html("");
			if (type == "DUEIN") {
				searchTitle = "Checking In";
			} else if (type == "DUEOUT") {
				searchTitle = "Checking Out";
			} else if (type == "INHOUSE") {
				searchTitle = "Stayovers";
			}

			var searchTitleHtml = that.myDomElement.find('#search-title').html();
			var newSearchTitleHtml = searchTitleHtml.replace("Search", searchTitle);
			that.myDomElement.find('#search-title').html(newSearchTitleHtml);
			var search_url = "search.json?status=" + type;
			this.fetchSearchData(search_url, "", type);
		}

		// A dirty hack to allow "this" instance to be refered from sntapp
		sntapp.setViewInst('Search', that);

		// Set scrolling
		createVerticalScroll('#search');

		// Update no results display on resize
		$(window).resize(function() {
			if ($('#search-results .no-content').length) {
				$('#search-results').css('height', $('#search').innerHeight());
			}
		});

		// // DEBUG
		// window.trigger = that.postCardSwipData;
	};

	this.pageshow = function() {
		that.updateLateCheckoutCount();
		this.initCardSwipe();
	};

	this.updateLateCheckoutCount = function() {
		var url = '/staff/dashboard/late_checkout_count';
		var webservice = new WebServiceInterface();
		var options = {
			successCallBack : that.lateCheckoutCountFetched,
			loader : "NONE"
		};
		webservice.getJSON(url, options);
	};

	this.lateCheckoutCountFetched = function(response) {
		that.myDomElement.find('#late-checkout-alert').text(response.data.late_checkout_count);

	};

	// Start listening to card swipes
	this.initCardSwipe = function() {

		var options = {
			successCallBack : function(data) {

				// if this is not search do nothing
				// TODO: support new pages when they are added
				var activeMenu = $('#main-menu').find('a.active').data('page');
				if ('search' != activeMenu) {
					return;
				};

				//If the ETBKSN value(for infinea) is empty, use the track2KSN
				var ksn = data.RVCardReadTrack2KSN;
          		if(data.RVCardReadETBKSN != "" && typeof data.RVCardReadETBKSN != "undefined"){
					ksn = data.RVCardReadETBKSN;
				}

				var url = '/staff/payments/search_by_cc';
				var data = {
					'et2' : data.RVCardReadTrack2,
					'ksn' : ksn,
					'etb' : data.RVCardReadETB

				};
				that.postCardSwipData(url, data);
			},
			failureCallBack : function(errorObject) {

				// if this is not search do nothing
				// TODO: support new pages when they are added
				var activeMenu = $('#main-menu').find('a.active').data('page');
				if ('search' != activeMenu) {
					return;
				};

				// Could not read the card properly
				that.fetchCompletedOfFetchSearchData({
					'data' : ''
				}, {
					'swipe_error' : 'INVALID_CARD'
				});
			}
		};

		if (sntapp.cardSwipeDebug === true) {
			sntapp.cardReader.startReaderDebug(options)
		} ;

		if (sntapp.cordovaLoaded) {
			sntapp.cardReader.startReader(options)
		};

	};

	this.delegateEvents = function() {
		var event_type = 'click';
		if ('ontouchstart' in document.documentElement) {//device supports touch, for keyboard bug fix
			event_type = 'touchstart';
		}

		that.myDomElement.find('#query').on(event_type, that.setFocusToSearch);
		that.myDomElement.find('#search-form').on(event_type, that.setFocusToSearch);
		that.myDomElement.find('#search-form .entry button[name=submit]').on(event_type, that.setFocusToSearch);
		that.myDomElement.find('#search-form.entry').on(event_type, that.setFocusToSearch);
		that.myDomElement.find('#clear-query').on(event_type, that.clearResults);

		that.myDomElement.find('#query').on('focus', that.callCapitalize);
		that.myDomElement.find('#query').on('keyup paste', that.queryEntered);
		that.myDomElement.find('#search-form').on('submit', that.submitSearchForm);

		that.myDomElement.find('#late-checkout-alert').on('click', that.latecheckoutSelected);
		that.myDomElement.find('#queue-rooms').on('click', that.queueRoomsSelected);
		

	};

	this.setFocusToSearch = function(event) {
		that.myDomElement.find('#query').focus();
		event.stopImmediatePropagation();
		event.stopPropagation();
	};

	this.latecheckoutSelected = function(e) {
		e.preventDefault();
		that.currentQuery = "";
		that.fetchResults = [];
		that.preloadedResults = [];
		that.fetchTerm = "";
		searchTitle = "Checking Out Late";
		var searchTitleHtml = that.myDomElement.find('#search-title').html();
		var indexFound = searchTitleHtml.indexOf("<span");
		var newSearchTitleHtml = "";
		if(indexFound!= -1){
			var htmlAfterCaption = searchTitleHtml.substr(indexFound);
			newSearchTitleHtml = searchTitle + htmlAfterCaption;
		}
		/*var newSearchTitleHtml = searchTitleHtml.replace("Search", searchTitle);
		var newSearchTitleHtml = newSearchTitleHtml.replace("Queued Reservations", searchTitle);
		var newSearchTitleHtml = newSearchTitleHtml.replace("Checking Out", searchTitle);
		var newSearchTitleHtml = newSearchTitleHtml.replace("Stayovers", searchTitle);
		var newSearchTitleHtml = newSearchTitleHtml.replace("Checking In", searchTitle);*/
		that.myDomElement.find('#search-title').html(newSearchTitleHtml);
		var search_url = "search.json?is_late_checkout_only=true";
		that.fetchSearchData(search_url, "", "LATE_CHECKOUT");

	};
	
	this.queueRoomsSelected = function(e) {
		e.preventDefault();
		that.currentQuery = "";
		that.fetchResults = [];
		that.preloadedResults = [];
		that.fetchTerm = "";
		searchTitle = "Queued Reservations";
		var searchTitleHtml = that.myDomElement.find('#search-title').html();
		var indexFound = searchTitleHtml.indexOf("<span");
		var newSearchTitleHtml = "";
		if(indexFound!= -1){
			var htmlAfterCaption = searchTitleHtml.substr(indexFound);
			newSearchTitleHtml = searchTitle + htmlAfterCaption;
		}
		that.myDomElement.find('#search_list #search-title').html(newSearchTitleHtml);
		var search_url = "search.json?is_queued_rooms_only=true";
		that.fetchSearchData(search_url, "", "QUEUE_ROOMS");

	};

	//Clear Search Results
	this.clearResults = function(e) {
		//if the method is invoked from other views to clear search results, 'this', 'e' are undefined.
		//Change the search heading to "Search"
		if ( typeof e == "undefined") {
			var searchTitleHtml = $('#search_list #search-title').html();
			
			var newSearchTitleHtml = searchTitleHtml.replace("Checking In", "Search");
			var newSearchTitleHtml = newSearchTitleHtml.replace("Checking Out Late", "Search");
			var newSearchTitleHtml = newSearchTitleHtml.replace("Checking Out", "Search");
			var newSearchTitleHtml = newSearchTitleHtml.replace("Stayovers", "Search");
			$('#search_list #search-title').html(newSearchTitleHtml);
		}

		if ($(this).hasClass('visible')) {
			$(this).removeClass('visible');
		}

		$('#query').val('');
		$('#search-results').empty().addClass('hidden');
    // Clear button visibility toggle
    that.showHideClearQueryButton();

		if ( typeof that.preloadedResults != "undefined") {
			var preloadedResultsCount = that.preloadedResults.length;
			if (preloadedResultsCount > 0) {
				$('#search-results').empty().removeClass('hidden');
				that.displayFilteredResults(that.preloadedResults, "");
			}
		}
		if ( typeof e != "undefined") {
			e.stopImmediatePropagation();
			e.stopPropagation();
		}
		that.updateView();

	};

	//when a user press enter key from search textbox
	this.submitSearchForm = function(e) {
		return false;
	};

	//when user focus on search text
	this.callCapitalize = function(e) {
		$(this).capitalize();
	};

	this.fetchCompletedOfFetchSearchData = function(response, requestParams) {
		sntapp.activityIndicator.hideActivityIndicator('get-json-web-calling');

		var searchType = "";
        that.displayedResultType = "QUERY"; // Displayed results are for those fetched based on typed Query string

		$("#search-results").empty().removeAttr('style').removeClass('hidden');
		$('#preloaded-results').addClass('hidden');
		$('#no-results').addClass('hidden');
		// set up reservation status
		var type = typeof requestParams == "undefined" ? "" : requestParams['type'];
		if (type == "DUEIN") {
			searchType = "checking in";
		} else if (type == "DUEOUT") {
			searchType = "checking out";
		} else if (type == "INHOUSE") {
			searchType = "in house";
		} else if (type == "LATE_CHECKOUT") {
			searchType = "opted for late checkout";
		} else if(type == "QUEUE_ROOMS"){
			searchType = "opted for queue reservations";
		}

        if(searchType != "" ) {
            that.displayedResultType = "PRELOAD"; // Displayed results are for INHOUSE etc.
        }

		if (response.data.length > 0) {
			that.fetchResults = response.data;
			if (type != "") {
				that.preloadedResults = response.data;
			}
			that.displayFilteredResults(that.fetchResults, that.currentQuery);
			return false;
		}
		// No data in JSON file
		else if (response.data.length == 0) {

			// showing card swipe errors
			if (requestParams['swipe_error'] === 'NO_GUEST') {
				$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check that you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number.</span></div></li>');
				that.updateView();
			} else if (requestParams['swipe_error'] === 'INVALID_CARD') {
				$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-card"></span><strong class="h1">Invalid Credit Card</strong><span class="h2">Try with another card or search Guests manually.</span></div></li>');
				that.updateView();
			} else if (requestParams['swipe_error'] === 'NO_CONFIRM') {
				$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-search"></span><strong class="h1">No Guest or Reservation Found</strong><span class="h2">Try with another card or search Guests manually.</span></div></li>');
				that.updateView();
			} else if (searchType != "") {
				// When dashboard buttons with 0 guests are clicked, show search screen message - "No guests checking in/out/in house"
				$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-search"></span><strong class="h1">No guests ' + searchType + '</strong></span></div></li>');
			} else {
				// To show no matches message while search guest with 0 results.
				$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check that you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number.</span></div></li>');
				//TODO: verify implemention, rename function
				that.updateView();
			}
		}
	};

	this.fetchFailedOfFetchSearchData = function(errorMessage) {
		$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check that you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number.</span></div></li>').removeClass('hidden');
		sntapp.notification.showErrorMessage(errorMessage, that.myDomElement);
		//TODO: verify implemention, rename function
		that.updateView();
	};

	this.fetchSearchData = function(url, $query, type) {

		var webservice = new WebServiceInterface();
		var data = {
			fakeDataToAvoidCache : new Date()
		};
		// fakeDataToAvoidCache is iOS Safari fix
		var successCallBackParams = {
			'type' : type
		};
		var options = {
			requestParameters : data,
			successCallBack : that.fetchCompletedOfFetchSearchData,
			successCallBackParameters : successCallBackParams,
			failureCallBack : that.fetchFailedOfFetchSearchData,
		};
		webservice.getJSON(url, options);

	};

	// post the card swipe data
	this.postCardSwipData = function(url, data) {
		var webservice = new WebServiceInterface();
		var options = {
			loader : 'BLOCKER',
			requestParameters : data,
			successCallBack : function(response) {

				if (response.data.length == 0) {
					that.fetchCompletedOfFetchSearchData(response, {
						'swipe_error' : 'NO_GUEST'
					});
					return false;
				} else {
					that.postCardSwipDataSuccess(response);
				}
			},
			failureCallBack : function(errorMessage) {

				// No reservation was not found
				that.fetchCompletedOfFetchSearchData({
					'data' : ''
				}, {
					'swipe_error' : 'NO_CONFIRM'
				});
			}
		};
		webservice.postJSON(url, options);
	};

	// got the guest!
	// lets load his staycard right away!
	this.postCardSwipDataSuccess = function(response) {

		//IF more than one search results appear, show the search results
		if (response.data.length > 1) {
			that.fetchCompletedOfFetchSearchData(response);
			return false;
		}
		//If only one search results, move to staycard
		var viewURL = '/staff/staycards/staycard';
		var viewDom = $('#page-inner-first');
		var params = {
			'confirmation' : (response.data[0]).confirmation,
			'id' : (response.data[0]).id
		};
		var loader = 'BLOCKER';
		var nextViewParams = {
			'showanimation' : true,
			'current-view' : 'search_view'
		};
		sntapp.fetchAndRenderView(viewURL, viewDom, params, loader, nextViewParams);
	};

	//when user focus on search text
	this.queryEntered = function(event) {
		that.currentQuery = $.trim($(this).val());
        /* CICO-7316 - FIX 1: If preloaded data is being shown,
         * do nothing untill we type at least three charecters.
        */
        if ((that.currentQuery.length < 3) && (that.displayedResultType === "PRELOAD")) { 
                return;
        }

		var searchTitleHtml = that.myDomElement.find('#search-title').html();
		var newSearchTitleHtml = searchTitleHtml.replace("Checking In", "Search");
		newSearchTitleHtml = newSearchTitleHtml.replace("Checking Out Late", "Search");
		newSearchTitleHtml = newSearchTitleHtml.replace("Checking Out", "Search");
		newSearchTitleHtml = newSearchTitleHtml.replace("Stayovers", "Search");
		newSearchTitleHtml = newSearchTitleHtml.replace("Queued Reservations", "Search");

		that.myDomElement.find('#search-title').html(newSearchTitleHtml);
		// Clear button visibility toggle
		that.showHideClearQueryButton();

		if (that.currentQuery.length < 3) {
			that.currentQuery = "";
			that.fetchResults = [];
			that.fetchTerm = "";
			$('#search-results').empty().addClass('hidden');
			var preloadedResultsCount = that.preloadedResults.length;
			if (preloadedResultsCount > 0) {
				$('#search-results').empty().removeClass('hidden');
				that.displayFilteredResults(that.preloadedResults, "");
			}
			//TODO: verify working. Rename function
			that.updateView();
			return;
		}

		if (that.fetchTerm != "" && that.currentQuery.indexOf(that.fetchTerm) === 0) {
			that.displayFilteredResults(that.fetchResults, that.currentQuery);
			return;
		}
		that.fetchTerm = that.currentQuery;
		var searchUrl = 'search.json?&query=' + that.fetchTerm;
		that.fetchSearchData(searchUrl, that.fetchTerm, "");

	};

	//TODO:pass query
	this.showHideClearQueryButton = function() {
		if ($.trim($('#query').val()) !== '') {
			$('#clear-query:not(.visible)').addClass('visible');
		} else {
			$('#clear-query.visible').removeClass('visible');
		}
	};

	/*this.getFilteredResults = function($query){
	 $('#search-results').html("");
	 that.displayFilteredResults(searchResults, $query);
	 };*/

	this.displayFilteredResults = function(searchResults, $query) {
        that.displayedResultType = "QUERY"; // Displayed results are for those fetched based on typed Query string
		if ($query == "") {
            that.displayedResultType = "PRELOAD"; // Displayed results are pre-loaded : InHouse etc.
			that.displaySearchResults(searchResults, $query);
			return false;
		}
		sntapp.activityIndicator.showActivityIndicator('blocker', 'loader-html-appending');
		$('#search-results').html("");
		try {
            /*CICO-7316: Fix to improve load performance.
             *TODO: Cross check if this changes the DOM Structure.
             *TODO: How do we manage this DOM detachment feature when moving to Angular? 
             */
            var searchHTML ="";
            that.isSearchedRoomNumber = false;
			$.each(searchResults, function(i, value) {
				// To set flag while searching a room number.
				if((escapeNull(value.room).toString()).indexOf($query) >= 0)  that.isSearchedRoomNumber = true;
				if ((escapeNull(value.firstname).toUpperCase()).indexOf($query.toUpperCase()) >= 0 || (escapeNull(value.lastname).toUpperCase()).indexOf($query.toUpperCase()) >= 0 || (escapeNull(value.group).toUpperCase()).indexOf($query.toUpperCase()) >= 0 || (escapeNull(value.room).toString()).indexOf($query) >= 0 || (escapeNull(value.confirmation).toString()).indexOf($query) >= 0) {
					searchHTML += '<li>' + that.writeSearchResult(value.id, value.firstname, value.lastname, value.image, value.confirmation, value.reservation_status, value.room, value.roomstatus, value.fostatus, value.location, value.group, value.vip, value.late_checkout_time, value.is_opted_late_checkout, value.room_ready_status, value.use_pickup, value.use_inspected, value.checkin_inspected_only, value.is_reservation_queued, value.is_queue_rooms_on);
				}

			});
			// To handle highlight of room number seperately.
			if(that.isSearchedRoomNumber){
				$('#search-results').removeAttr('style').html(searchHTML);
			}
			else{	
				$('#search-results').removeAttr('style').html(searchHTML).highlight($query);
			}

			sntapp.activityIndicator.hideActivityIndicator('loader-html-appending');
			// Refresh scroll
			refreshVerticalScroll('#search');
		} catch(e) {
			$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-search"></span></div></li>');
		}

		// As this search filters JSON content, we need temp custom handling for no results scenario
		if ($('#search-results').is(':empty')) {
			$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number</span></div></li>');
		}

	};

	this.displaySearchResults = function(response, $query) {
		sntapp.activityIndicator.showActivityIndicator('blocker', 'loader-html-appending');
		try {
            /*CICO-7316: Fix to improve load performance.
             *TODO: Cross check if this changes the DOM Structure.
             *TODO: How do we manage this DOM detachment feature when moving to Angular? 
             */
			var searchHTML ="";
			$.each(response, function(i, value) {
				searchHTML += '<li >' + that.writeSearchResult(value.id, value.firstname, value.lastname, value.image, value.confirmation, value.reservation_status, value.room, value.roomstatus, value.fostatus, value.location, value.group, value.vip, value.late_checkout_time, value.is_opted_late_checkout, value.room_ready_status, value.use_pickup, value.use_inspected, value.checkin_inspected_only, value.is_reservation_queued, value.is_queue_rooms_on);
			});
			$('#search-results').removeAttr('style').html(searchHTML); // No highlight required here.

			// Refresh scroll
			refreshVerticalScroll('#search');
		} catch(e) {
			$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-search"></span></div></li>');
		}

		// As this search filters JSON content, we need temp custom handling for no results scenario
		if ($('#search-results').is(':empty')) {
			$('#search-results').css('height', $('#search').innerHeight()).html('<li class="no-content"><div class="info"><span class="icon-no-content icon-search"></span><strong class="h1">No matches</strong><span class="h2">Check you didn\'t mispell the <strong>Name</strong> or <strong>Group</strong>, or typed in the wrong <strong>Room </strong> or <strong>Confirmation</strong> number</span></div></li>');
		};
		sntapp.activityIndicator.hideActivityIndicator('loader-html-appending');
	};

	this.writeSearchResult = function(id, firstname, lastname, image, confirmation, reservation_status, room, roomstatus, foStatus, location, group, vip, lateCheckoutTime, isLateCheckoutOn, room_ready_status, use_pickup, use_inspected, checkin_inspected_only, isReservationQueued, isQueueRoomsOn) {
		var guestStatusIcon = this.getGuestStatusMapped(reservation_status, isLateCheckoutOn);
		var roomStatusMapped = this.getRoomStatusMapped(roomstatus, foStatus);

		if (room_ready_status == "") {
			roomStatusMapped = this.getRoomStatusMapped(roomstatus, foStatus);

		} else {
			roomStatusMapped = this.getRoomStatusMapped(roomstatus, foStatus);
			var roomStatusColor = this.getRoomReadyStatusMapped(room_ready_status, use_inspected, use_pickup, checkin_inspected_only, foStatus);

		}
		var roomstatusexplained = "";
		var roomStatus = "";
		var showRoomStatus = false;
		var roomNumber = "";

		// Display FO status only when room-status = NOT-READY and reservation status = CHECKING-IN
		if (roomStatusMapped == "not-ready" && reservation_status == "CHECKING_IN") {
			roomstatusexplained = foStatus;
			showRoomStatus = true;
		}
		// To highlight room number if searched with room number.
		if(that.isSearchedRoomNumber){
			roomNumber = '<span class="highlight">'+escapeNull(room)+'</span>';
		}
		else{
			roomNumber = escapeNull(room);
		}
		// Show color coding ( Red / Green - for Room status) for room only if reservation status = CHECKING-IN
		if (reservation_status == "CHECKING_IN") {
			roomStatus = '<strong class="room-number ' + escapeNull(roomStatusColor) + '">' + roomNumber + '</strong>';
		} else {
			roomStatus = '<strong class="room-number">' + roomNumber + '</strong>';
		}
		
		var $location = (escapeNull(location) != '') ? '<span class="icons icon-location">' + escapeNull(location) + '</span>' : '', $group = (escapeNull(group) != '') ? '<em class="icons icon-group">' + escapeNull(group) + '</em>' : '', $vip = vip ? '<span class="vip">VIP</span>' : '', $image = (escapeNull(image) != '') ? '<figure class="guest-image"><img src="' + escapeNull(image) + '" />' + $vip + '</figure>' : '<figure class="guest-image"><img src="/assets/blank-avatar.png" />' + $vip + '</figure>', $roomAdditional = showRoomStatus ? '<span class="room-status">' + roomstatusexplained + '</span>' : '', $viewStatus = guestStatusIcon ? '<span class="guest-status ' + escapeNull(guestStatusIcon) + '"></span>' : '<span class="guest-status"></span>', $lateCheckoutStatus = (escapeNull(lateCheckoutTime) == "" || "CHECKING_OUT" != reservation_status || isLateCheckoutOn == false) ? "" : '<span class="late-checkout-time">' + escapeNull(lateCheckoutTime) + '</span>', $queuedStatus = isReservationQueued == "true" && isQueueRoomsOn == "true" ? 'queued' : '' , $guestViewIcons = '<div class="status '+ $queuedStatus +' ">' + $lateCheckoutStatus + $viewStatus + '</div>';
		$output = '<a href="staff/staycards/staycard?confirmation=' + confirmation + '&id=' + escapeNull(id) + '" class="guest-check-in link-item float" data-transition="inner-page">' + $image + '<div class="data">' + '<h2>' + escapeNull(lastname) + ', ' + escapeNull(firstname) + '</h2>' + '<span class="confirmation">' + escapeNull(confirmation) + '</span>' + $location + $group + '</div>' + $guestViewIcons + roomStatus + $roomAdditional + '</a>';
		return $output;
	};

	//Map the reservation status to the view expected format
	this.getGuestStatusMapped = function(reservationStatus, isLateCheckoutOn) {
		var viewStatus = "";
		if (isLateCheckoutOn && "CHECKING_OUT" == reservationStatus) {
			viewStatus = "late-check-out";
			return viewStatus;
		}
		if ("RESERVED" == reservationStatus) {
			viewStatus = "arrival";
		} else if ("CHECKING_IN" == reservationStatus) {
			viewStatus = "check-in";
		} else if ("CHECKEDIN" == reservationStatus) {
			viewStatus = "inhouse";
		} else if ("CHECKEDOUT" == reservationStatus) {
			viewStatus = "departed";
		} else if ("CHECKING_OUT" == reservationStatus) {
			viewStatus = "check-out";
		} else if ("CANCELED" == reservationStatus) {
			viewStatus = "cancel";
		} else if (("NOSHOW" == reservationStatus) || ("NOSHOW_CURRENT" == reservationStatus)) {
			viewStatus = "no-show";
		}
		return viewStatus;
	};

	//Map the room status to the view expected format
	this.getRoomStatusMapped = function(roomstatus, fostatus) {
		var mappedStatus = "";
		if (roomstatus == "READY" && fostatus == "VACANT") {
			mappedStatus = 'ready';
		} else {
			mappedStatus = "not-ready";
		}
		return mappedStatus;
	};

	// manage the Room-status color mapping CICO-5779
	this.getRoomReadyStatusMapped = function(room_ready_status, use_inspected, use_pickup, checkin_is_inspected_only, fo_status) {
		var mapped_room_color = "";
		var resultant_mapped_room_color = "";

		if (room_ready_status != "" && fo_status == "VACANT") {
			
			mapped_room_color = get_mapped_room_ready_status_color(room_ready_status, checkin_is_inspected_only);
		} else {
			console.log('Either FO Status OCC/ room_Ready_status null');
		}
		return mapped_room_color;
	};

	

	this.updateView = function() {
		// Content update
		if ($('#search-results').is(':empty')) {
			if ($('#preloaded-results').length) {
				$('#no-results').addClass('hidden');
				$('#preloaded-results').removeClass('hidden');
			} else {
				$('#no-results').removeClass('hidden');
			}
		}
		// Refresh scrolling
		refreshVerticalScroll('#search');
	};

	
};
