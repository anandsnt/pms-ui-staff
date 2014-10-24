sntRover.controller('rvReservationSearchWidgetController', ['$scope', '$rootScope', 'RVSearchSrv', '$filter', '$state', '$stateParams', '$vault',
	function($scope, $rootScope, RVSearchSrv, $filter, $state, $stateParams, $vault) {

		/*
		 * Base reservation search, will extend in some place
		 * it contain only minimal function, please add functions & methods where
		 * you wrapping this.
		 */

		var that = this;
		BaseCtrl.call(this, $scope);
		var searchFilteringCall = null;
		//model against query textbox, we will be using this across
		$scope.textInQueryBox = "";
		$scope.fetchTerm = "";

		// variable used track the & type if pre-loaded search results (nhouse, checkingin..)
		$scope.searchType = "default";

		// these varibales will be used to various conditiopns for ui rendering
		$scope.isLateCheckoutList = false;
		$scope.isQueueReservationList = false;
		$scope.swipeNoResults = false;

		//showSearchResultsAre
		$scope.showSearchResultsArea = false;
		$scope.searchResultsFetchDone = false;

		//results
		$scope.results = [];

		//prevent unwanted result whoing while typeing
		$scope.isTyping = false;
		$scope.isSwiped = false;
		$scope.firstSearch = true;


		$scope.showAddNewGuestButton = false; //read cooment below :(
		/**
		 *	should we show ADD Guest Button
		 *	we can determine this from wrapper class
		 *	will be helpful if the requirement changed from only for stand alone pms to other
		 * 	and also also we can handle it inside
		 */
		$scope.$on("showAddNewGuestButton", function(event, showAddNewGuestButton) {
			$scope.showAddNewGuestButton = showAddNewGuestButton;
		});

		//setting the scroller for view
		var scrollerOptions = {
	        tap: true,
	        preventDefault: false,
	        deceleration: 0.0001,
	        shrinkScrollbars: 'clip' 
	    };
	  	$scope.setScroller('result_showing_area', scrollerOptions);

		// if returning back and there was a search query typed in restore that
		// else reset the query value in vault
		if ($stateParams.useCache && !!$vault.get('searchQuery')) {
			$scope.textInQueryBox = $vault.get('searchQuery');
		} else {
			$vault.set('searchQuery', '');
		}

		if ($stateParams.type == "LATE_CHECKOUT") {
			$scope.isLateCheckoutList = true;
		} else {
			$scope.isLateCheckoutList = false;
		}
		if ($stateParams.type == "QUEUED_ROOMS") {
			$scope.isQueueReservationList = true;
		} else {
			$scope.isQueueReservationList = false;
		}

		// dont remove yet
		// setting up back to dashboard
		// this must be set only for switching b/w
		// dashboard and search results by clicking the search in dashboard
		// if ( !$stateParams.hasOwnProperty('type') ) {
		// 	$rootScope.setPrevState = {
		// 		title: $filter('translate')('DASHBOARD'),
		// 		callback: 'clearResults',
		// 		scope: $scope,
		// 		noStateChange: true,
		// 		hide: true
		// 	};
		// }

		/**
		* Event propogated by ngrepeatstart directive
		* we used to show activity indicator
		*/
		$scope.$on('NG_REPEAT_STARTED_RENDERING', function(event){      
            $scope.$emit('showLoader');                                     
        });


		/**
		* Event propogated by ngrepeatend directive
		* we used to hide activity indicator & refresh scroller
		*/
        $scope.$on('NG_REPEAT_COMPLETED_RENDERING', function(event){
            setTimeout(function(){
               refreshScroller();
            }, 100);
            $scope.$emit('hideLoader');
        });


		/**
		 * Success call back of data fetch from webservice
		 */
		var successCallBackofDataFetch = function(data) {

			$scope.$emit('hideLoader');
			$scope.results = data;
			//TODO: commenting out for now. See if this has to be restored
			//$scope.firstSearch = false;
			$scope.searchType = "default";
			$scope.isTyping = false;
			$scope.searchResultsFetchDone = true;

			if ($scope.results.length > 0) { //if there is any result then only we want to filter
				displayFilteredResults();
			}
			//TODO: commenting out for now. See if this has to be restored
			//$scope.firstSearch = false;
			//$scope.fetchTerm = $scope.textInQueryBox;

			setTimeout(function() {
				$scope.$apply();
				refreshScroller();
			}, 100);
		};


		/**
		 * failure call back of search result fetch
		 */
		var failureCallBackofDataFetch = function(errorMessage) {
			$scope.$emit('hideLoader');
			$scope.searchType = "default";
			$scope.errorMessage = errorMessage;
			$scope.searchResultsFetchDone = true;
			setTimeout(function() {
				refreshScroller();
				$scope.$apply(function() {
					$scope.isTyping = false;
				});
			}, 100);
		};

		/**
		 * a reciever function to update data from outside
		 */
		$scope.$on("updateDataFromOutside", function(event, data) {
			$scope.results = data;
			for (var i = 0; i < $scope.results.length; i++) {
				$scope.results[i].is_row_visible = true;
			}

			refreshScroller();
			$scope.$emit('hideLoader');
		});

		/**
		 * a reciever function to update data from outside
		 */
		$scope.$on("updateReservationTypeFromOutside", function(event, type) {
			$scope.searchType = type;
			$scope.isLateCheckoutList = (type === 'LATE_CHECKOUT') ? true : false;
		});

		/**
		 * reciever function to show/hide the search result area.
		 */
		$scope.$on("showSearchResultsArea", function(event, searchAreaVisibilityStatus) {
			$scope.showSearchResultsArea = searchAreaVisibilityStatus;

			// if it is hiding, we need to clear the search text
			if (!searchAreaVisibilityStatus) {
				$scope.textInQueryBox = '';
				$vault.set('searchQuery', '');
				// hide the dashboard back button (dont remove yet)
				// $rootScope.setPrevState.hide = true;
			} else {

				// show the dashboard back button (dont remove yet)
				// $rootScope.setPrevState.hide = false;
			}
		});

		/**
		 * function to perform filtering/request data from service in change event of query box
		 */
		$scope.queryEntered = function() {
			$scope.isSwiped = false;
			$scope.swipeNoResults = false;
			$scope.isLateCheckoutList = false;
			$scope.isQueueReservationList = false;
			var queryText = $scope.textInQueryBox;

			$scope.$emit("UPDATE_MANAGER_DASHBOARD");
			//inoreder to prevent unwanted results showing while tyeping..
			if (!$scope.isTyping) {
				$scope.isTyping = true;
			}

			//setting first letter as captial: soumya
			$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);

			if ($scope.textInQueryBox.length == 0 && $scope.searchType == "default") {
				$scope.clearResults();
				return;
			}
			if (!$scope.showSearchResultsArea) {
				$scope.showSearchResultsArea = true;
			}
			if(searchFilteringCall != null){
				clearTimeout(searchFilteringCall);
			}
			searchFilteringCall = setTimeout(function(){
				$scope.$apply(function(){displayFilteredResults();});
			}, 300);
			

			// save the entered query into vault
			// if returning back we will display that result
			$vault.set('searchQuery', $scope.textInQueryBox);
			$scope.$emit("UpdateHeading", 'SEARCH_NORMAL');
			return true;
		}; //end of query entered

		/**
		 * fnction to execute on focused out event of search textbox is using that feature in dahbaord
		 */
		$scope.focusedOutOfSearchText = function(event) {
			if ($scope.results.length === 0 && $scope.textInQueryBox === '') {
				setTimeout(function() {
					$scope.$emit("SEARCH_BOX_FOCUSED_OUT");
				}, 50);

			}
		};

		$scope.searchAreaClicked = function($event) {
			$event.stopPropagation();
			return false;
		}

		/**
		 * function to perform filering on results.
		 * if not fouund in the data, it will request for webservice
		 */
		var displayFilteredResults = function() {
			//if the entered text's length < 3, we will show everything, means no filtering    
			if ($scope.textInQueryBox.length < 3) {
				//based on 'is_row_visible' parameter we are showing the data in the template      
				for (var i = 0; i < $scope.results.length; i++) {
					$scope.results[i].is_row_visible = true;
				}
				setTimeout(function() {
					$scope.isTyping = false;
				}, 500);
				refreshScroller();
			} else {
				//see if the new query is the substring of fetch term
				if ($scope.searchType == "default" && $scope.textInQueryBox.indexOf($scope.fetchTerm) == 0 && !$scope.firstSearch && $scope.results.length > 0) {
					var value = "";
					//searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
					//if it is zero, then we will request for webservice
					var totalCountOfFound = 0;
					for (var i = 0; i < $scope.results.length; i++) {
						value = $scope.results[i];
						if (($scope.escapeNull(value.firstname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ||
							($scope.escapeNull(value.lastname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ||
							($scope.escapeNull(value.group).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ||
							($scope.escapeNull(value.room).toString()).indexOf($scope.textInQueryBox) >= 0 ||
							($scope.escapeNull(value.confirmation).toString()).indexOf($scope.textInQueryBox) >= 0) {
							$scope.results[i].is_row_visible = true;
							totalCountOfFound++;
						} else {
							$scope.results[i].is_row_visible = false;
						}
					}
					$scope.isTyping = false;

				} else {
					var dataDict = {
						'query': $scope.textInQueryBox.trim()
					};
					$scope.firstSearch = false;
					$scope.fetchTerm = $scope.textInQueryBox;
					$scope.searchResultsFetchDone = false;
					$scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofDataFetch, failureCallBackofDataFetch);
				}
				// we have changed data, so we are refreshing the scrollerbar
				refreshScroller();
			}
		}; //end of displayFilteredResults

		/**
		 * function to execute on focusing on search box
		 */
		$scope.focusOnSearchText = function() {
			//we are showing the search area
			$scope.$emit("showSearchResultsArea", true);
			$scope.$emit("UpdateHeading", 'SEARCH_NORMAL');
			$vault.set('searchType', 'SEARCH_NORMAL')
			refreshScroller();
		};


		/**
		 * function used for refreshing the scroller
		 */
		var refreshScroller = function() {
			$scope.refreshScroller('result_showing_area');
		};

		/*
		 * function used in template to map the reservation status to the view expected format
		 */
		$scope.getGuestStatusMapped = function(reservationStatus, isLateCheckoutOn, isPrechin) {
			var viewStatus = "";
			if (isLateCheckoutOn && "CHECKING_OUT" == reservationStatus) {
				viewStatus = "late-check-out";
				return viewStatus;
			}
			if ("RESERVED" == reservationStatus && !isPrechin) {
				viewStatus = "arrival";
			} else if ("CHECKING_IN" == reservationStatus && !isPrechin) {
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
			} else if (isPrechin) {
				viewStatus = "pre-check-in";
			}
			return viewStatus;
		};

		//Map the room status to the view expected format
		$scope.getRoomStatusMapped = function(roomstatus, fostatus) {
			var mappedStatus = "";
			if (roomstatus == "READY" && fostatus == "VACANT") {
				mappedStatus = 'ready';
			} else {
				mappedStatus = "not-ready";
			}
			return mappedStatus;
		};

		//function that converts a null value to a desired string.

		//if no replace value is passed, it returns an empty string

		$scope.escapeNull = function(value, replaceWith) {
			var newValue = "";
			if ((typeof replaceWith != "undefined") && (replaceWith != null)) {
				newValue = replaceWith;
			}
			var valueToReturn = ((value == null || typeof value == 'undefined') ? newValue : value);
			return valueToReturn;
		};

		/*
		 * function to get reservation class against reservation status
		 */
		$scope.getReservationClass = function(reservationStatus) {
			var classes = {
				"CHECKING_IN": 'guest-check-in',
				"CHECKEDIN": 'guest-inhouse',
				"CHECKING_OUT": 'guest-check-out',
				"CANCELED": 'guest-cancel',
				"NOSHOW": 'guest-no-show',
				"NOSHOW_CURRENT": 'guest-no-show',
			};
			if (reservationStatus.toUpperCase() in classes) {
				return classes[reservationStatus.toUpperCase()];
			}
		};
		/**
		 * function to execute on clicking clear icon button
		 */
		$scope.clearResults = function() {
			$scope.results = [];
			$scope.textInQueryBox = "";
			$scope.fetchTerm = "";
			$scope.firstSearch = true;

			$scope.$emit("SearchResultsCleared");

			// dont remove yet
			// Gotacha!! Only when we are dealing with 'noStateChange'
			// if ( !!$rootScope.setPrevState.noStateChange ) {
			//     $rootScope.setPrevState.hide = true;
			// };

			// reset the query saved into vault
			$vault.set('searchQuery', '');
		};

		/**
		 * function to execute on clicking on each result
		 */
		$scope.goToReservationDetails = function(reservationID, confirmationID) {
			$scope.currentReservationID = reservationID;
			$scope.currentConfirmationID = confirmationID;
			//$scope.$emit("UpdateSearchBackbuttonCaption", "");
			$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
				id: reservationID,
				confirmationId: confirmationID,
				isrefresh: true
			});
		};

		//Relaunch the reservation details screen when the ows connection retry succeeds
		$scope.$on('OWSConnectionRetrySuccesss', function(event) {
			$scope.goToReservationDetails($scope.currentReservationID, $scope.currentConfirmationID);
		});

		$scope.searchSwipeSuccessCallback = function(searchByCCResults) {

			// show back to dashboard button (dont remove yet)
			// $rootScope.setPrevState.hide = false;
			$scope.$emit('hideLoader');
			$scope.isSwiped = true;
			data = searchByCCResults;
			if (data.length == 0) {
				$scope.$emit("updateDataFromOutside", data);
				$scope.swipeNoResults = true;
				$scope.focusOnSearchText();
			} else if (data.length == 1) {
				var reservationID = data[0].id;
				var confirmationID = data[0].confirmation;
				$scope.goToReservationDetails(reservationID, confirmationID);
			} else {
				$scope.$emit("updateDataFromOutside", data);
				$scope.focusOnSearchText();
			}

			//Set the search type and search title. Used in back navigation from staycard to search
			$vault.set('searchType', "BY_SWIPE");
			$vault.set('title', swipeHeadingInSearch);

			$scope.$emit("UpdateHeading", swipeHeadingInSearch);
		};
		var swipeHeadingInSearch = '';
		$scope.$on('SWIPEHAPPENED', function(event, data) {
			var ksn = data.RVCardReadTrack2KSN;
			if (data.RVCardReadETBKSN != "" && typeof data.RVCardReadETBKSN != "undefined") {
				ksn = data.RVCardReadETBKSN;
			}
			var cardNumber = data.RVCardReadMaskedPAN.substr(data.RVCardReadMaskedPAN.length - 4);
			swipeHeadingInSearch = 'Reservations with card ' + cardNumber;

			var swipeData = {
				'et2': data.RVCardReadTrack2,
				'ksn': ksn,
				'etb': data.RVCardReadETB

			};

			$scope.invokeApi(RVSearchSrv.searchByCC, swipeData, $scope.searchSwipeSuccessCallback);


		});

		$scope.showNoMatches = function(results, queryLength, isTyping, isSwiped) {
			var showNoMatchesMessage = false;
			var resultLength = results.length;
			if (!$scope.swipeNoResults) {
				if (isSwiped && resultLength == 0) {
					showNoMatchesMessage = true;
				} else {
					if ($scope.searchResultsFetchDone && resultLength == 0 && queryLength >= 3 && !isTyping) {
						showNoMatchesMessage = true;
					}
				}
			}
			if(!showNoMatchesMessage){
				var totalCountOfFound = 0;
				for(var i = 0; i < results.length; i++){
					if(results[i].is_row_visible)
						totalCountOfFound++;
				}
				if(totalCountOfFound == 0)
					showNoMatchesMessage = true;
			}
			return showNoMatchesMessage;
		};
		$scope.getQueueClass = function(isReservationQueued, isQueueRoomsOn, reservationStatus) {
			var queueClass = '';
			if(reservationStatus === 'CHECKING_IN' || reservationStatus === 'RESERVED'){
				if (isReservationQueued == "true" && isQueueRoomsOn == "true") {
					queueClass = 'queued';
				}
			}
			return queueClass;
		};


		$scope.getMappedClassWithResStatusAndRoomStatus = function(reservation_status, roomstatus, fostatus, roomReadyStatus, checkinInspectedOnly) {
			var mappedStatus = "room-number";

			if (reservation_status == 'CHECKING_IN') {
				if (roomReadyStatus != '') {
					if (fostatus == 'VACANT') {
						switch (roomReadyStatus) {
							case "INSPECTED":
								mappedStatus += ' room-green';
								break;
							case "CLEAN":
								if (checkinInspectedOnly == "true") {
									mappedStatus += ' room-orange';
									break;
								} else {
									mappedStatus += ' room-green';
									break;
								}
								break;
							case "PICKUP":
								mappedStatus += " room-orange";
								break;

							case "DIRTY":
								mappedStatus += " room-red";
								break;
						}
					} else {
						mappedStatus += " room-red";
					}
				}
			}

			return mappedStatus;
		};


		//please don't remove this code.... CICO-10091
		//blur action to navigate to dashboard if no query
		$scope.focusOutOnSearchText = function(){
			if($scope.textInQueryBox.length ===0){
				$scope.$emit("HeaderBackButtonClicked")
			}
		};



	}
]);