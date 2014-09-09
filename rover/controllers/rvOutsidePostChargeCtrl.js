sntRover.controller('RVOutsidePostChargeController',
	[
		'$rootScope',
		'$scope',
		'RVChargeItems',
		'RVSearchSrv',
		'$timeout',
		function($rootScope, $scope, RVChargeItems, RVSearchSrv, $timeout) {

			// hook up the basic things
			BaseCtrl.call( this, $scope );
			
			$scope.init = function(){
				// quick ref to fetched items
				// and chosen one from the list
				$scope.fetchedItems = $scope.fetchedData.items;
				$scope.fetchedChargeCodes = $scope.fetchedData.non_item_linked_charge_codes;
				$scope.selectedChargeItem = null;
				$scope.isResultOnFetchedItems = true;
				//Show/hide reservations or items
				$scope.itemsVisible = true;
				$scope.firstTime = true;
				$scope.search = {};
				$scope.search.guest_company_agent = '';
				$scope.search.room = '';
				$scope.showInitialSearchScreen = false;
				$scope.showSearchScreen = false;
				
				$scope.isCardAttched = false;
				$scope.noGuestOrRoomSelected = false;
				$scope.guestHasNotCheckedin = false;
				$scope.chargePosted = false;
				$scope.cardAttached = {};
			};
			
			var oldSearchGuestText = '';
			var oldSearchRoomValue = '';
			
			$scope.init();
			$scope.setScroller('result_showing_area_post_charg');
			/**
			* function used for refreshing the scroller
			*/
			var refreshScroller = function(){  
				setTimeout(function() {
					$scope.refreshScroller('result_showing_area_post_charg');
				}, 500);
			};
	
			$scope.searchForResultsSuccess = function(data){
				console.log("successs");
				$scope.showInitialSearchScreen = false;
				$scope.$emit( 'hideLoader' );
				$scope.reservationsArray = data;
				oldSearchGuestText = $scope.search.guest_company_agent;
				oldSearchRoomValue = $scope.search.room;
				angular.forEach($scope.reservationsArray, function(value, key) {
					value.shouldShowReservation = true;
				});
				refreshScroller();
			};
			
			$scope.searchForResults = function(){
				$scope.showInitialSearchScreen = false;
				$scope.refreshApi = true;
				if($scope.search.guest_company_agent.length > 2 || $scope.search.room.length > 1){
					if(oldSearchGuestText.length > 0){
						if((oldSearchGuestText.length < $scope.search.guest_company_agent.length) && ($scope.search.guest_company_agent.indexOf(oldSearchGuestText) !=-1 )){
							$scope.refreshApi = false;
						}
					}
					
					else if(oldSearchRoomValue.length > 0) {
						if((oldSearchRoomValue.length < $scope.search.room.length) && ($scope.search.room.indexOf(oldSearchRoomValue) !=-1 )){
							$scope.refreshApi = false;
						}
					}
				}
				var dataToSrv = {
					"refreshApi": $scope.refreshApi,
				    "postData": {
				    	"room_no": $scope.search.room,
				    	"account": $scope.search.guest_company_agent
				    }
				};
				$scope.invokeApi(RVSearchSrv.fetchReservationsToPostCharge, dataToSrv, $scope.searchForResultsSuccess);
				
				$scope.itemsVisible = false;
				$scope.setScroller('search-guests-for-charge-content');
			};
			$scope.clickedCancel = function(){
				$scope.search.guest_company_agent = '';
				$scope.search.room = '';
				$scope.showInitialSearchScreen = true;
				$scope.itemsVisible = false;
				$scope.showSearchScreen = false;
			};
			$scope.showHideInitialSearchScreen = function(){
				$scope.showInitialSearchScreen = true;
				$scope.showSearchScreen = true;
				$scope.itemsVisible = false;
			};
			$scope.successGetBillDetails = function(data){
				$scope.$emit( 'hideLoader' );
				$scope.$broadcast("UPDATED_BILLNUMBERS", data);
			};
			$scope.clickedReservationToPostCharge = function(reservationId){
				$scope.showPostChargesScreen();
				$scope.invokeApi(RVChargeItems.getReservationBillDetails, reservationId, $scope.successGetBillDetails);
			};
			$scope.showPostChargesScreen = function(){
				$scope.showInitialSearchScreen = false;
				$scope.showSearchScreen = false;
			};
			
			/*
			* function used in template to map the reservation status to the view expected format
			*/
			$scope.getGuestStatusMapped = function(reservationStatus, isLateCheckoutOn){
				  var viewStatus = "";
			      if(isLateCheckoutOn && "CHECKING_OUT" == reservationStatus){
			        viewStatus = "late-check-out";
			        return viewStatus;
			      }
			      if("RESERVED" == reservationStatus){
			        viewStatus = "arrival";
			      }else if("CHECKING_IN" == reservationStatus){
			        viewStatus = "check-in";
			      }else if("CHECKEDIN" == reservationStatus){
			        viewStatus = "inhouse";
			      }else if("CHECKEDOUT" == reservationStatus){
			        viewStatus = "departed";
			      }else if("CHECKING_OUT" == reservationStatus){
			        viewStatus = "check-out";
			      }else if("CANCELED" == reservationStatus){
			        viewStatus = "cancel";
			      }else if(("NOSHOW" == reservationStatus)||("NOSHOW_CURRENT" == reservationStatus)){
			        viewStatus = "no-show";
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
		
		  $scope.escapeNull = function(value, replaceWith){
		      var newValue = "";
		      if((typeof replaceWith != "undefined") && (replaceWith != null)){
		       newValue = replaceWith;
		       }
		      var valueToReturn = ((value == null || typeof value == 'undefined' ) ? newValue : value);
		      return valueToReturn;
		   };  
		
		   /*
		   * function to get reservation class against reservation status
		   */
		   $scope.getReservationClass = function(reservationStatus){
		   		var classes = {
		   			"CHECKING_IN": 'guest-check-in',
		   			"CHECKEDIN": 'guest-inhouse',
		   			"CHECKING_OUT": 'guest-check-out',
		   			"CANCELED": 'guest-cancel',
		   			"NOSHOW": 'guest-no-show',
		   			"NOSHOW_CURRENT": 'guest-no-show',
		   		};
		   		if(reservationStatus.toUpperCase() in classes){
		   			return classes[reservationStatus.toUpperCase()];
		   		}
		   	};
		  	
		  	
			$scope.getQueueClass = function(isReservationQueued, isQueueRoomsOn){
		  	    var queueClass = '';
		  		if(isReservationQueued=="true" && isQueueRoomsOn == "true"){
		 			queueClass = 'queued';
		 		}
		 		return queueClass;
		    };
		      
		      
		    $scope.getMappedClassWithResStatusAndRoomStatus = function(reservation_status, roomstatus, fostatus, roomReadyStatus, checkinInspectedOnly){
		       var mappedStatus = "room-number";
		       if(reservation_status == 'CHECKING_IN'){
		     
			      	switch(roomReadyStatus) {
			
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
			       }
			   	 return mappedStatus;
		   };
			
			/*
			 * Method to handle selection of guest/compny/TA item
			 */
			$scope.selectReservation = function(item){
				$scope.isCardAttched = true;
				$scope.cardAttached = item;
			};
			/*
			 * Method to handle DETACH CARD button click.
			 */
			$scope.clickedDetachCard = function(item){
				$scope.isCardAttched = false;
				$scope.cardAttached = {};
				$scope.search.room = '';
				$scope.search.guest_company_agent = '';
				$scope.fetchedData.bill_numbers = [];
			};
			/*
			 * Method to handle POST CHARGE button click.
			 */
			$scope.clickedPostCharges = function(){
				if(!$scope.isCardAttched){
					$scope.noGuestOrRoomSelected = true;
				}
				else if($scope.cardAttached.reservation_status !== 'CHECKEDIN'){
					$scope.guestHasNotCheckedin = true;
				}
			};
			/*
			 * Method to handle ADD GUEST OR ROOM button click
			 * On 'No guest/room selected!'
			 */
			$scope.clickedAddGuestOrRoom = function(){
				$scope.noGuestOrRoomSelected = false;
				$scope.showHideInitialSearchScreen();
			};
			$scope.clickedAddGuestOrRoomCancel = function(){
				$scope.noGuestOrRoomSelected = false;
			};
			/*
			 * Method to handle POST CHARGE button click,
			 * On 'Guest has not yet checked in!' popup.
			 */
			$scope.clickedPostCharge = function(){
				$scope.guestHasNotCheckedin = false;
				$scope.reservation_id = $scope.cardAttached.id;
				$scope.$broadcast('POSTCHARGE');
			};
			$scope.clickedPostChargeCancel = function(){
				$scope.guestHasNotCheckedin = false;
			};
			
			/*
			 * Method to handle POST ANOTHER CHARGE button click
			 * On 'Charge posted' popup
			 */
			$scope.clickedPostAnotherCharge = function(){
				$scope.init();
				$scope.chargePosted = false;
				$scope.$broadcast('RESETPOSTCHARGE');
			};
			$scope.clickedPostAnotherChargeCancel = function(){
				$scope.chargePosted = false;
				$scope.closeDialog();
			};
			/*
			 * On charge posted successfully.
			 */
			$scope.$on('CHARGEPOSTED', function(event, data) {
			    $scope.guestHasNotCheckedin = false;
				$scope.chargePosted = true;
			});
		}
	]
);