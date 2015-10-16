sntRover.controller('rvAllotmentRoomBlockCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'rvPermissionSrv',
	'ngDialog',
	'rvAllotmentConfigurationSrv',
	'$timeout',
	'rvUtilSrv',
	'$q',
	'dateFilter',
	function($scope,
		$rootScope,
		$filter,
		rvPermissionSrv,
		ngDialog,
		rvAllotmentConfigurationSrv,
		$timeout,
		util,
		$q,
		dateFilter) {

		var summaryMemento,
			update_existing_reservations_rate = false,
			roomsAndRatesSelected,
			updated_contract_counts = false,
			updated_current_counts = false;

		/**
		 * util function to check whether a string is empty
		 * @param {String/Object}
		 * @return {boolean}
		 */
		$scope.isEmpty = util.isEmpty;

		/**
		 * Function to decide whether to hide 'Add Rooms Button'
		 * @return {Boolean}
		 */
		$scope.shouldHideAddRoomsButton = function() {
			return ($scope.allotmentConfigData.summary.selected_room_types_and_bookings.length > 0);
		};

		/**
		 * Has Permission To EditSummaryAllotment
		 * @return {Boolean}
		 */
		var hasPermissionToEditSummaryAllotment = function() {
			return (rvPermissionSrv.getPermissionValue('EDIT_ALLOTMENT_SUMMARY'));
		};

		/**
		 * CICO-16821: Check permission to overbook room type and house separately.
		 * @return {Boolean}
		 */
		var hasPermissionToOverBookRoomType = function() {
			return (rvPermissionSrv.getPermissionValue('OVERBOOK_ROOM_TYPE'));
		};

		var hasPermissionToOverBookHouse = function() {
			return (rvPermissionSrv.getPermissionValue('OVERBOOK_HOUSE'));
		};

		/**
		 * Has Permission To Create group room block
		 * @return {Boolean}
		 */
		var hasPermissionToCreateRoomBlock = function() {
			return (rvPermissionSrv.getPermissionValue('CREATE_ALLOTMENT_ROOM_BLOCK'));
		};

		/**
		 * Has Permission To Edit group room block
		 * @return {Boolean}
		 */
		var hasPermissionToEditRoomBlock = function() {
			return (rvPermissionSrv.getPermissionValue('EDIT_ALLOTMENT_ROOM_BLOCK'));
		};

		/**
		 * Function to decide whether to disable Add Rooms & Rates button
		 * for now we are checking only permission
		 * @return {Boolean}
		 */
		$scope.shouldDisableAddRoomsAndRate = function() {
			return (!hasPermissionToCreateRoomBlock() &&
				!hasPermissionToEditRoomBlock());
		};

		/**
		 * Logic to decide whether the room block grid view select box should be disabled.
		 * @return {Boolean}
		 */
		 $scope.shouldDisableGridViewSwitch = function() {
		 	var roomTypesConfigured = $scope.allotmentConfigData.summary.selected_room_types_and_bookings.length > 0;

		 	return (!roomTypesConfigured);
		 };

		 /**
		  * Apply to held counts button will be disabled by default.
		  * It should be enabled after clicking apply to contract button.
		  * @return {Boolean} Whether button should be disabled or not
		  */
		 $scope.shouldDisableApplyToHeldCountsButton = function() {
		 	return (!updated_contract_counts);
		 };

		 $scope.shouldDisableApplyToContractButton = function() {
		 	return (updated_contract_counts);
		 };


		 /**
		  * Apply to held counts to contract button will be disabled by default.
		  * It should be enabled after clicking apply to current button.
		  * @return {Boolean} Whether button should be disabled or not
		  */
		 $scope.shouldDisableApplyToHeldToContractButton = function() {
		 	return (!updated_current_counts);
		 };

		 $scope.shouldDisableApplyToCurrrentButton = function() {
		 	return (updated_current_counts);
		 };

		/**
		 * should we wanted to show the discard button for room type booking change
		 * @return {Boolean}
		 */
		$scope.shouldShowDiscardButton = function() {
			return ( $scope.hasBookingDataChanged &&
				  	$scope.shouldHideAddRoomsButton() );
		};

		/**
		 * Should we show buttons in roomblock
		 */
		$scope.shouldShowRoomBlockActions = function() {
			return $scope.shouldHideAddRoomsButton();
		};

		$scope.shouldShowApplyToHeldCountsButton = function() {
			var hasBookingDataChanged = $scope.hasBookingDataChanged,
				isInContractGridView  = $scope.activeGridView === 'CONTRACT';

			return ( isInContractGridView && ( updated_contract_counts || hasBookingDataChanged ) );
		};

		$scope.shouldShowApplyToContractButton = function() {
			var hasBookingDataChanged = $scope.hasBookingDataChanged,
				isInContractGridView  = $scope.activeGridView === 'CONTRACT';

			return ( hasBookingDataChanged && isInContractGridView );
		};

		$scope.shouldShowApplyToCurrentButton = function() {
			var hasBookingDataChanged = $scope.hasBookingDataChanged,
				isInCurrentGridView  = $scope.activeGridView === 'CURRENT';

			return ( hasBookingDataChanged && isInCurrentGridView );
		};

		$scope.shouldShowApplyToHeldToContractButton = function() {
			var hasBookingDataChanged = $scope.hasBookingDataChanged,
				isInCurrentGridView	  = $scope.activeGridView === 'CURRENT';

			return ( isInCurrentGridView && ( updated_current_counts || hasBookingDataChanged ) );
		};

		/**
		 * well, do we wanted to show triple button
		 * if there is any key 'triple' found in room type.dates (array of objects),
		 * it means some entry is found
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldShowTripleEntryRow = function(roomType) {
			if ($scope.allotmentConfigData.summary.rate === -1) {
				var list_of_triples = _.pluck(roomType.dates, 'triple');

				//throwing undefined items
				list_of_triples = _.filter(list_of_triples, function(element) {
					return (typeof element !== "undefined");
				});

				return (list_of_triples.length > 0);
			} else {
				return !!roomType.rate_config.extra_adult_rate && !!roomType.rate_config.double_rate;
			}
		};

		/**
		 * should we wanted to show quadruple button
		 * if there is any key 'quadruple' found in room type.dates (array of objects),
		 * it means some entry is found
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldShowQuadrupleEntryRow = function(roomType) {
			if ($scope.allotmentConfigData.summary.rate === -1) {
				var list_of_quadruples = _.pluck(roomType.dates, 'quadruple');

				//throwing undefined items
				list_of_quadruples = _.filter(list_of_quadruples, function(element) {
					return (typeof element !== "undefined");
				});

				return (list_of_quadruples.length > 0 && $scope.shouldShowTripleEntryRow(roomType));
			} else {
				return !!roomType.rate_config.extra_adult_rate && !!roomType.rate_config.double_rate;
			}
		};

		/**
		 * To add triple entry row to a room type
		 * @return undefined
		 */
		$scope.addTripleEntryRow = function(roomType) {
			if (!!$scope.allotmentConfigData.summary.is_cancelled || !roomType.can_edit) {
				return false;
			}
			_.each(roomType.dates, function(element) {
				element.triple = 0;
				element.triple_pickup = 0;
			});

			//we added something
			$scope.bookingDataChanging();
			refreshScroller();
		};

		/**
		 * To add quadruple entry row to a room type
		 * @return undefined
		 */
		$scope.addQuadrupleEntryRow = function(roomType) {
			if (!!$scope.allotmentConfigData.summary.is_cancelled || !roomType.can_edit) {
				return false;
			}
			_.each(roomType.dates, function(element) {
				element.quadruple = 0;
				element.quadruple_pickup = 0;
			});

			//we added something
			$scope.bookingDataChanging();
			refreshScroller();
		};

		/**
		 * should we wanted to disable single box entry
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableSingleEntryBox = function(dateData, roomType) {
			return (!roomType.can_edit || !!$scope.allotmentConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable double box entry
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableDoubleEntryBox = function(dateData, roomType) {
			return (!roomType.can_edit || !!$scope.allotmentConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable triple box entry
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableTripleEntryBox = function(dateData, roomType) {
			return (!roomType.can_edit || !!$scope.allotmentConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable Quadruple box entry
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableQuadrupleEntryBox = function(dateData, roomType) {
			return (!roomType.can_edit || !!$scope.allotmentConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable add triple button
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableAddTripleButton = function(roomType) {
			return (!roomType.can_edit || !!$scope.allotmentConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable add triple button
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableAddQuadrupleButton = function(roomType) {
			return (!roomType.can_edit || !!$scope.allotmentConfigData.summary.is_cancelled);
		};

		/**
		 * to copy the single-contract value entered in the column
		 * to the row
		 * @param {Object} - cell data
		 * @param {Object} - row data
		 * @return undefined
		 */
		$scope.copySingleContractValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.single_contract = cellData.single_contract;
			});
			//we changed something
			$scope.bookingDataChanging();
		};

		$scope.copySingleHeldValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.single = cellData.single;
			});
			//we changed something
			$scope.bookingDataChanging();
		};

		/**
		 * to copy the double & double_pick up value entered in the column
		 * to the row
		 * @param {Object} - cell data
		 * @param {Object} - row data
		 * @return undefined
		 */
		$scope.copyDoubleContractValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.double_contract = cellData.double_contract;
			});
			//we chnged something
			$scope.bookingDataChanging();
		};

		$scope.copyDoubleHeldValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.double = cellData.double;
			});
			//we chnged something
			$scope.bookingDataChanging();
		};

		/**
		 * to copy the triple & triple_pick up value entered in the column
		 * to the row
		 * @param {Object} - cell data
		 * @param {Object} - row data
		 * @return undefined
		 */
		$scope.copyTripleContractValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.triple_contract = cellData.triple_contract;
			});
			//we chnged something
			$scope.bookingDataChanging();
		};

		$scope.copyTripleHeldValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.triple = cellData.triple;
			});
			//we chnged something
			$scope.bookingDataChanging();
		};

		/**
		 * to copy the quadruple & quadruple_pick up value entered in the column
		 * to the row
		 * @param {Object} - cell data
		 * @param {Object} - row data
		 * @return undefined
		 */
		$scope.copyQuadrupleContractValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.quadruple_contract = cellData.quadruple_contract;
			});
			//we chnged something
			$scope.bookingDataChanging();
		};

		$scope.copyQuadrupleHeldValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.quadruple = cellData.quadruple;
			});
			//we chnged something
			$scope.bookingDataChanging();
		};

		/**
		 * when the booking data changing
		 * @return undefined
		 */
		$scope.bookingDataChanging = function() {
			//we are changing the model to
			$scope.hasBookingDataChanged = true;
			updated_contract_counts = false;
			updated_current_counts = false;
			runDigestCycle();
		};

		/**
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};

		(function() {
			var gridViewTemplates = {
				CONTRACT: '/assets/partials/allotments/details/grids/rvAllotmentConfigurationContractGrid.html',
				CURRENT: '/assets/partials/allotments/details/grids/rvAllotmentConfigurationCurrentGrid.html',
				RELEASE: '/assets/partials/allotments/details/grids/rvAllotmentConfigurationReleaseGrid.html'
			};

			$scope.getGridViewTemplateurl = function(mode) {
				return gridViewTemplates[mode] || gridViewTemplates.CONTRACT;
			};
		})();

		/**
		 * Fired when user changes the active grid view from the select box
		 * @return {undefined}
		 */
		$scope.activeGridViewChanged = function() {
			$scope.$emit('showLoader');
			$timeout(function() {
				// Discard all the changes in current view
				$scope.clickedOnDiscardButton();
				$scope.gridViewTemplateUrl = $scope.getGridViewTemplateurl($scope.activeGridView);
				$scope.$emit("hideLoader");
				$timeout(reinit, 400);
			}, 0);
		};

		/**
		 * when create button clicked, we will show the 'Hold Status and more section'
		 * @return None
		 */
		$scope.clickedOnCreateButton = function() {
			$scope.createButtonClicked = true;
		};

		/**
		 * when save button clicked,
		 * @return None
		 */
		$scope.clickedOnSaveButton = function() {
			// do not force overbooking for the first time
			$scope.saveRoomBlock(false);
		};

		/**
		 * CICO-19121:
		 * Fired when user clickes on the button in contract view.
		 */
		$scope.clickedOnApplyToHeldCountsButton = function() {
			var roomBlockData = $scope.allotmentConfigData.summary.selected_room_types_and_bookings;
			// plan A: copy contracted value to held counts by force and call saveRoomBlock()
			_.each(roomBlockData, function(roomtype) {
				_.each(roomtype.dates, function(dateData) {
					dateData.single = dateData.single_contract;
					dateData.double = dateData.double_contract;

					if (dateData.triple) {
						dateData.triple = dateData.triple_contract;
					}
					if (dateData.quadruple_contract) {
						dateData.quadruple = dateData.quadruple_contract;
					}
				});
			});
			$scope.saveRoomBlock(false);
		};

		/**
		 * CICO-19121:
		 * Fired when user clickes on the button in contract view.
		 * Saving updated contract count does not affect inventory.
		 */
		$scope.clickedOnUpdateContractButton = function() {
			$scope.saveRoomBlock(false, true);
		};

		/**
		 * CICO-19121:
		 * Copy held counts to contracts
		 */
		$scope.clickedOnApplyToHeldToContractButton = function() {
			var roomBlockData = $scope.allotmentConfigData.summary.selected_room_types_and_bookings;
			// plan A: copy held value to contracted counts by force and call saveRoomBlock()
			_.each(roomBlockData, function(roomtype) {
				_.each(roomtype.dates, function(dateData) {
					dateData.single_contract = dateData.single;
					dateData.double_contract = dateData.double;

					if (dateData.triple) {
						dateData.triple_contract = dateData.triple;
					}
					if (dateData.quadruple_contract) {
						dateData.quadruple_contract = dateData.quadruple;
					}
				});
			});
			$scope.saveRoomBlock(false, true);
		};

		$scope.clickedOnUpdateCurrentButton = function() {
			// Saving updated contract count does not affect inventory.
			$scope.saveRoomBlock(false);
		};

		/**
		 * when discard button clicked, we will set the booking data with old copy
		 * @return None
		 */
		$scope.clickedOnDiscardButton = function() {
			$scope.allotmentConfigData.summary.selected_room_types_and_bookings =
				util.deepCopy($scope.copy_selected_room_types_and_bookings);

			//and our isn't changed
			$scope.hasBookingDataChanged = false;
			updated_contract_counts = false;
			updated_current_counts = false;
		};

		var successCallBackOfSaveRoomBlock = function(data) {
			// CICO-18621: Assuming room block will be saved if I call
			// it with force flag.
			if (!data.saved_room_block) {
				$scope.saveRoomBlock(true);
				return false;
			}

			updated_contract_counts = !updated_contract_counts;
			updated_current_counts = !updated_current_counts;

			//we have saved everything we have
			//so our data is new
			$scope.copy_selected_room_types_and_bookings =
				angular.copy($scope.allotmentConfigData.summary.selected_room_types_and_bookings);

			$scope.hasBookingDataChanged = false;
			$scope.allotmentConfigData.summary.rooms_total = $scope.getMaxOfBookedRooms();

			//as per CICO-16087, we have to refetch the occupancy and availability after saving
			//so, callinng the API again
			$scope.fetchRoomBlockGridDetails();
		};

		/**
		 * Handles the failure case of inventory save
		 * A 470 status for response means overbooking occurs.
		 * @param 	{object} 	API response
		 * @returns {undefined}
		 */
		var failureCallBackOfSaveRoomBlock = function(error) {
			if(error.hasOwnProperty ('httpStatus')) {
				if (error.httpStatus === 470) {
					var message 			 	= null,
						isHouseOverbooked  	 	= error.is_house_overbooked,
						overBookedRoomTypes  	= [],
						isRoomTypeOverbooked   	= false,
						overBookingOccurs		= false,
						canOverbookHouse		= hasPermissionToOverBookHouse(),
						canOverbookRoomType		= hasPermissionToOverBookRoomType(),
						canOverBookBoth			= canOverbookHouse && canOverbookRoomType;

					_.each(error.room_type_hash, function(roomType) {
						var overBookedDates 		= _.where(roomType.details, {is_overbooked: true}),
							editedRoomTypeDetails  	= _.findWhere($scope.allotmentConfigData.summary.selected_room_types_and_bookings, {
															room_type_id: roomType.room_type_id
										  				});

						// check if overbooking case has occured due to a new change
						var alreadyOverbooked = _.filter(editedRoomTypeDetails.dates,
							function(dateData) {
								var newTotal 		 = $scope.getTotalHeldOfIndividualRoomType(dateData);
									detailHasChanged = dateData.old_total != newTotal;
								return (dateData.availability < 0 && !detailHasChanged);
							});

						// only mark this roomtype & date if if not already overbooked.
						if (overBookedDates.length > alreadyOverbooked.length)
							overBookedRoomTypes.push(roomType);
					});

					isRoomTypeOverbooked = overBookedRoomTypes.length > 0;
					overBookingOccurs	 = isRoomTypeOverbooked || isHouseOverbooked;

					// show appropriate overbook message.
					if (isHouseOverbooked && isRoomTypeOverbooked && canOverBookBoth) {
						message = "HOUSE_AND_ROOMTYPE_OVERBOOK";
						showOverBookingPopup(message);
						return;
					}
					else if(isHouseOverbooked && canOverbookHouse) {
						message = "HOUSE_OVERBOOK";
						showOverBookingPopup(message);
						return;
					}
					else if(isRoomTypeOverbooked && canOverbookRoomType){
						message = "ROOMTYPE_OVERBOOK";
						showOverBookingPopup(message);
						return;
					}
					// Overbooking occurs and has no permission.
					else if(overBookingOccurs) {
						showNoPermissionOverBookingPopup();
						return false;
					}
					else {
						$scope.saveRoomBlock(true);
					}
				}
			} else {
				$scope.errorMessage = error;
			}
		};

		/**
		 * Method to make the API call to save the room block grid
		 * Will be called from
		 * 	1. The controller $scope.onBlockRoomGrid
		 * 	2. The warnReleaseRoomsPopup.html template
		 * @param {boolean} forceOverbook
		 * @return undefined
		 */
		$scope.saveRoomBlock = function(forceOverbook, isContratUpdate) {
			forceOverbook = forceOverbook || false;
			isContratUpdate = isContratUpdate || false;

			var params = {
				allotment_id: $scope.allotmentConfigData.summary.allotment_id,
				results: $scope.allotmentConfigData.summary.selected_room_types_and_bookings,
				forcefully_overbook_and_assign_rooms: forceOverbook,
				is_contract_save: isContratUpdate
			};

			var options = {
				params: params,
				successCallBack: successCallBackOfSaveRoomBlock,
				failureCallBack: failureCallBackOfSaveRoomBlock
			};
			$scope.callAPI(rvAllotmentConfigurationSrv.saveRoomBlockBookings, options);
		};

		$scope.saveReleaseDays = function() {
			var params = {
				allotment_id: $scope.allotmentConfigData.summary.allotment_id,
				results: $scope.allotmentConfigData.summary.selected_room_types_and_bookings
			};

			var options = {
				params: params,
				successCallBack: successCallBackOfSaveRoomBlock,
				failureCallBack: failureCallBackOfSaveRoomBlock
			};
			$scope.callAPI(rvAllotmentConfigurationSrv.saveRoomBlockReleaseDays, options);
		};

		/**
		 * Method to show oerbooking popup - No permission popup
		 * @return undefined
		 */
		var showNoPermissionOverBookingPopup = function() {
			// Show overbooking message
			ngDialog.open({
				template: '/assets/partials/allotments/details/rvAllotmentNoPermissionOverBookingPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/**
		 * Method to show oerbooking popup
		 * @return undefined
		 */
		var showOverBookingPopup = function(message) {
			// Show overbooking message
			var dialogData = {
				message: message
			};

			ngDialog.open({
				template: '/assets/partials/allotments/details/rvAllotmentWarnOverBookingPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false,
				data: JSON.stringify(dialogData)
			});
		};

		/**
		 * To open Add Rooms & Rates popup
		 * @return - undefined
		 */
		var openAddRoomsAndRatesPopup = function() {
			ngDialog.open({
				template: '/assets/partials/allotments/details/rvAllotmentAddRoomAndRatesPopup.html',
				scope: $scope,
				controller: 'rvAllotmentAddRoomsAndRatesPopupCtrl'
			});
		};

		/**
		 * to get the room type name against a room id
		 * @param  {Integer} id - of the room type
		 * @return {String}    Room type name, will return blank string if room type not found
		 */
		$scope.getRoomTypeName = function(id) {
			id = parseInt(id);
			var roomType = _.findWhere($scope.roomTypes, {
				id: id
			});
			if (roomType) {
				return roomType.name;
			}
			return "";
		};

		/**
		 * to get the total contracted agsint all room types for a day
		 * @param {integer} - nth Day
		 * @return {Integer}
		 */
		$scope.getTotalContractedOfDay = function(dateIndex) {
			var cInt 			= util.convertToInteger,
				total 			= 0,
		    	roomBlockData 	= $scope.allotmentConfigData.summary.selected_room_types_and_bookings;

		    // Loop each roomtype and calculate the total contracted number for the date
			_.each(roomBlockData, function(roomType) {
				var dateData 		= roomType.dates[dateIndex],
					roomtypeTotal 	= $scope.getTotalContractedOfIndividualRoomType(dateData);

				total += roomtypeTotal;
			});

			return total;
		};

		/**
		 * to get the total held agsint all room types for a day
		 * @param {Object} - room type data
		 * @return {Integer}
		 */
		$scope.getTotalHeldOfDay = function(dateIndex) {
			var cInt 			= util.convertToInteger,
				total 			= 0,
		    	roomBlockData 	= $scope.allotmentConfigData.summary.selected_room_types_and_bookings;

		    // Loop each roomtype and calculate the total contracted number for the date
			_.each(roomBlockData, function(roomType) {
				var dateData 		= roomType.dates[dateIndex],
					roomtypeTotal 	= $scope.getTotalHeldOfIndividualRoomType(dateData);

				total += roomtypeTotal;
			});

			return total;
		};

		/**
		 * to get the total picked up agsint all room types for a day
		 * @param {Object} - room type data
		 * @return {Integer}
		 */
		$scope.getTotalPickedUpOfDay = function(dateIndex) {
			var cInt 			= util.convertToInteger,
				total 			= 0,
		    	roomBlockData 	= $scope.allotmentConfigData.summary.selected_room_types_and_bookings;

		    // Loop each roomtype and calculate the total contracted number for the date
			_.each(roomBlockData, function(roomType) {
				var dateData 		= roomType.dates[dateIndex],
					roomtypeTotal 	= $scope.getTotalPickedUpOfIndividualRoomType(dateData);

				total += roomtypeTotal;
			});

			return total;
		};

		/**
		 * to get the total contracted agsint a indivual room type
		 * @param {Object} - room type data
		 * @return {Integer}
		 */
		$scope.getTotalContractedOfIndividualRoomType = function(roomType) {
			var cInt = util.convertToInteger;

			//since user may have entered wrong input
			roomType.single_contract = (roomType.single_contract !== '') ? cInt(roomType.single_contract) : '';
			roomType.double_contract = (roomType.double_contract !== '') ? cInt(roomType.double_contract) : '';

			//the area of 'night watch man', they may be active or sleeping
			var quadruple = 0;
			if (roomType.quadruple_contract) {
				roomType.quadruple_contract = cInt(roomType.quadruple_contract);
				quadruple = roomType.quadruple_contract;
			}
			var triple = 0;
			if (roomType.triple_contract) {
				roomType.triple_contract = cInt(roomType.triple_contract);
				triple = roomType.triple_contract;
			}

			return (cInt(roomType.single_contract) + cInt(roomType.double_contract) + (triple) + (quadruple));
		};

		/**
		 * to get the total held agsint a indivual room type
		 * @param {Object} - room type data
		 * @return {Integer}
		 */
		$scope.getTotalHeldOfIndividualRoomType = function(roomType) {
			var cInt = util.convertToInteger;

			//since user may have entered wrong input
			roomType.single = (roomType.single !== '') ? cInt(roomType.single) : '';
			roomType.double = (roomType.double !== '') ? cInt(roomType.double) : '';

			//the area of 'night watch man', they may be active or sleeping
			var quadruple = 0;
			if (roomType.quadruple) {
				roomType.quadruple = cInt(roomType.quadruple);
				quadruple = roomType.quadruple;
			}
			var triple = 0;
			if (roomType.triple) {
				roomType.triple = cInt(roomType.triple);
				triple = roomType.triple;
			}

			return (cInt(roomType.single) + cInt(roomType.double) + (triple) + (quadruple));
		};

		/**
		 * to get the total picked up agsint a indivual room type
		 * @param {Object} - room type
		 * @return {Integer}
		 */
		$scope.getTotalPickedUpOfIndividualRoomType = function(roomType) {
			var cInt = util.convertToInteger;

			//since user may have entered wrong input
			roomType.single_pickup = (roomType.single_pickup !== '') ? cInt(roomType.single_pickup) : '';
			roomType.double_pickup = (roomType.double_pickup !== '') ? cInt(roomType.double_pickup) : '';

			//the area of 'night watch man', they may be active or sleeping
			var quadruple_pickup = 0;
			if (roomType.quadruple_pickup) {
				roomType.quadruple_pickup = cInt(roomType.quadruple_pickup);
				quadruple_pickup = roomType.quadruple_pickup;
			}
			var triple_pickup = 0;
			if (roomType.triple_pickup) {
				roomType.triple_pickup = cInt(roomType.triple_pickup);
				triple_pickup = roomType.triple_pickup;
			}

			return (cInt(roomType.single_pickup) + cInt(roomType.double_pickup) + (triple_pickup) + (quadruple_pickup));

		};

		/**
		 * To get the max booked rooms among dates
		 * @return {Integer}
		 */
		$scope.getMaxOfBookedRooms = function() {
			var ref = $scope.allotmentConfigData.summary.selected_room_types_and_bookings,
				totalBookedOfEachDate = [],
				arrayOfDateData = [],
				dateWiseAllotmentedData = {},
				sum = 0;

			if (!ref.length) {
				return 0;
			}
			//first of all, we need group by 'date' data as our current data is room type row based
			// we need these 'datewisedata' in single array
			_.each(ref, function(el) {
				_.each(el.dates, function(el1) {
					arrayOfDateData.push(el1);
				});
			});

			//now we have all 'tomatoes' in a single bag
			//we are going to group by them on the basis of quality :D (date)
			dateWiseAllotmentedData = _.groupBy(arrayOfDateData, 'date');

			//forming sum of individual
			_.each(dateWiseAllotmentedData, function(el) {
				sum = 0;
				_.each(el, function(eachDateData) {
					sum += $scope.getTotalHeldOfIndividualRoomType(eachDateData);
				});
				totalBookedOfEachDate.push(sum);
			});

			//returning max among them, simple
			var max = _.max(totalBookedOfEachDate);

			return max;
		};

		/**
		 * When availability and BAR fetch completed
		 * @param  {Objects} data of All Room Type
		 * @return undefined
		 */
		var successCallBackOfRoomTypeAndRatesFetch = function(data) {
			$scope.allotmentConfigData.summary.selected_room_types_and_rates = data.room_type_and_rates;
		};

		/**
		 * When all things reqd to open popup is completed
		 * @return undefined
		 */
		var successFetchOfAllReqdForRoomAndRatesPopup = function() {
			$scope.$emit('hideLoader');
			openAddRoomsAndRatesPopup();
		};

		/**
		 * When any of the things reqd to open popup is failed
		 * @return undefined
		 */
		var failedToFetchAllReqdForRoomAndRatesPopup = function(errorMessage) {
			$scope.errorMessage = errorMessage;
			$scope.$emit('hideLoader');
		};

		/**
		 * when Add Room & Rates button clicked, we will fetch all room types, fetch BAR
		 * (BEST AVAILABLE RATE) & Availabiolity
		 * then we will show the Add Room & Rates popup
		 * @return None
		 */
		$scope.clickedOnAddRoomsAndRatesButton = function() {
			//if it has no permission to do this, we will not alloq
			var hasNoPermissionToProceed = $scope.shouldDisableAddRoomsAndRate();
			if (hasNoPermissionToProceed) {
				return;
			}

			var promises = [];
			//we are not using our normal API calling since we have multiple API calls needed
			$scope.$emit('showLoader');

			//get Room type & rates for this group
			var paramsForRoomTypeAndRates = {
				id: $scope.allotmentConfigData.summary.allotment_id
			};
			promises.push(rvAllotmentConfigurationSrv
				.getSelectedRoomTypesAndRates(paramsForRoomTypeAndRates)
				.then(successCallBackOfRoomTypeAndRatesFetch)
			);

			//Lets start the processing
			$q.all(promises)
				.then(successFetchOfAllReqdForRoomAndRatesPopup, failedToFetchAllReqdForRoomAndRatesPopup);
		};

		/**
		 * To open Room Block Pickedup Reservations Popup.
		 */
		$scope.$on('updateRate', function (event, selectedRoomTypeAndRates) {
			roomsAndRatesSelected = selectedRoomTypeAndRates;
			ngDialog.open({
				template: '/assets/partials/allotments/details/rvAllotmentRoomBlockPickedupReservationsPopup.html',
				scope: $scope,
				className: '',
				closeByDocument: false,
				closeByEscape: false
			});
		});

		/**
		 * To check whether inhouse reservations exists.
		 */
		$scope.checkIfInhouseReservationsExists = function () {
			ngDialog.close();
			var isInhouseReservationsExists = false;
			angular.forEach (roomsAndRatesSelected, function (row) {
				if (row.total_inhouse_reservations_count > 0) {
					isInhouseReservationsExists = true;
				}
			});

			if (isInhouseReservationsExists) {
				openInhouseReservationsExistsPopup();
			}
			else {
				$scope.saveNewRoomTypesAndRates();
			}
		};

		/*
		 * Open popup to inform if inhouse reservations exists. 
		 */
		var openInhouseReservationsExistsPopup = function () {
			ngDialog.open({
				template: '/assets/partials/allotments/details/rvAllotmentInhouseReservationsExistsPopup.html',
				scope: $scope,
				className: '',
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/*
		 * To apply rate change only to new reservations by setting flag update_existing_reservations_rate.
		 */
		$scope.updateRateToNewReservations = function () {
			ngDialog.close();
			angular.forEach (roomsAndRatesSelected, function (row) {
				if (row.is_configured_in_allotment) {
					row.update_existing_reservations_rate = false;
				}
			});
			$scope.saveNewRoomTypesAndRates();
		};

		/**
		 * To update selected room types and rates.
		 */
		$scope.saveNewRoomTypesAndRates = function () {
			ngDialog.close();
			var options = {
				params: formSaveNewRoomTypesAndRatesParams(roomsAndRatesSelected),
				successCallBack: successCallBackOfSaveNewRoomTypesAndRates
			};
			$scope.callAPI(rvAllotmentConfigurationSrv.updateSelectedRoomTypesAndRates, options);
		};

		var successCallBackOfSaveNewRoomTypesAndRates = function () {
			$scope.fetchRoomBlockGridDetails();
		};

		/**
		 * function to form save roomtype and rates API params
		 * @return {Object}
		 */
		var formSaveNewRoomTypesAndRatesParams = function(roomsAndRatesSelected) {
			//we only want rows who have room type choosed
			var selectedRoomTypeAndRates = _.filter(roomsAndRatesSelected, function(obj) {
				return (typeof obj.room_type_id !== "undefined" && obj.room_type_id !== '');
			});
			//since selectedRoomTypeAndRates containst some unwanted keys
			var wanted_keys = ["room_type_id", "single_rate", "double_rate", "extra_adult_rate", "rate_id", "best_available_rate_id", "update_existing_reservations_rate"];
			selectedRoomTypeAndRates = util.getListOfKeyValuesFromAnArray(selectedRoomTypeAndRates, wanted_keys);

			var params = {
				allotment_id: $scope.allotmentConfigData.summary.allotment_id,
				room_type_and_rates: selectedRoomTypeAndRates
			};
			return params;
		};

		/**
		 * Success callback of room block details API
		 */
		var successCallBackOfFetchRoomBlockGridDetails = function(data) {
			// We have resetted the data.
			$scope.hasBookingDataChanged = false;

			//we need indivual room type total bookings of each date initially,
			//we are using this for overbooking calculation
			_.each(data.results, function(eachRoomType) {
				_.each(eachRoomType.dates, function(dateData) {
					dateData.old_total = $scope.getTotalHeldOfIndividualRoomType(dateData);

					// keeping original release days
					dateData['old_release_days'] = dateData['release_days'];
				});
			});

			// adding DS for ui release days for each occupancy and
			// for common
			_.each(data.occupancy, function(eachOcc) {
				eachOcc['ui_release_days'] = '';
			});
			$scope.allotmentConfigData.summary.common_ui_release_days = '';

			$scope.allotmentConfigData.summary.selected_room_types_and_bookings = data.results;
			$scope.allotmentConfigData.summary.selected_room_types_and_occupanies = data.occupancy;

			//our total pickup count may change on coming from other tab (CICO-16835)
			$scope.totalPickups = data.total_picked_count;

			//we need the copy of selected_room_type, we ned to use these to show save/discard button
			$scope.copy_selected_room_types_and_bookings = util.deepCopy(data.results);

			//we changed data, so
			refreshScroller();
		};

		$scope.releaseDaysEdited = false;

		$scope.copyReleaseRangeDown = function(days, index) {
			var value = days * 1;

			if ( '' == days || isNaN(value) ) {
				return;
			};

			_.each($scope.allotmentConfigData.summary.selected_room_types_and_bookings, function(each) {
				if ( each.hasOwnProperty('dates') && each['dates'][index] ) {
					each['dates'][index]['release_days'] = value;
					$scope.releaseDaysEdited = true;
				};
			});
		};

		/**
		 * Allotment release view
		 * Propogate release range entry across all dates and room types.
		 */
		$scope.copyReleaseRangeToAllBlocks = function(days) {
			var value = days * 1;

			if ( '' == days || isNaN(value) ) {
				return;
			};

			_.each($scope.allotmentConfigData.summary.selected_room_types_and_occupanies, function(each) {
				each['ui_release_days'] = value;
			});

			_.each($scope.allotmentConfigData.summary.selected_room_types_and_bookings, function(each) {
				_.each(each['dates'], function(date) {
					date['release_days'] = value;
				});
			});

			$scope.releaseDaysEdited = true;
		};

		$scope.releaseDateChanging = function() {
			$scope.releaseDaysEdited = true;
			runDigestCycle();
		};

		$scope.resetReleaseDaysEdit = function() {
			$scope.allotmentConfigData.summary.common_ui_release_days = '';

			_.each($scope.allotmentConfigData.summary.selected_room_types_and_occupanies, function(each) {
				each['ui_release_days'] = '';
			});

			_.each($scope.allotmentConfigData.summary.selected_room_types_and_bookings, function(each) {
				_.each(each['dates'], function(date) {
					date['release_days'] = date['old_release_days'];
				});
			});

			$scope.releaseDaysEdited = false;
		};

		$scope.saveReleaseDaysEdit = function() {
			$scope.saveReleaseDays();
			$scope.releaseDaysEdited = false;
		};

		var failureCallBackOfFetchRoomBlockGridDetails = function(error) {
			$scope.errorMessage = errorMessage;
		};

		/**
		 * To fetch room block details
		 * @return {undefined}
		 */
		$scope.fetchRoomBlockGridDetails = function() {
			var hasNeccessaryPermission = (hasPermissionToCreateRoomBlock() &&
				hasPermissionToEditRoomBlock());

			if (!hasNeccessaryPermission) {
				return;
			}

			var params = {
				allotment_id: $scope.allotmentConfigData.summary.allotment_id
			};

			var options = {
				params: params,
				successCallBack: successCallBackOfFetchRoomBlockGridDetails,
				failureCallBack: failureCallBackOfFetchRoomBlockGridDetails
			};
			$scope.callAPI(rvAllotmentConfigurationSrv.getRoomBlockGridDetails, options);
		};

		/**
		 * when a tab switch is there, parant controller will propogate
		 * API, we will get this event, we are using this to fetch new room block deails
		 */
		$scope.$on("ALLOTMENT_TAB_SWITCHED", function(event, activeTab) {
			if (activeTab !== 'ROOM_BLOCK') {
				return;
			}
			$scope.$emit("FETCH_SUMMARY");
			$scope.fetchRoomBlockGridDetails();
		});

		/**
		 * When group summary is updated by some trigger, parant controller will propogate
		 * API, we will get this event, we are using this to fetch new room block deails
		 */
		$scope.$on("UPDATED_ALLOTMENT_INFO", function(event) {
			summaryMemento = _.extend({}, $scope.allotmentConfigData.summary);
			//to prevent from initial API calling and only exectutes when group from_date, to_date,status updaet success
			if ($scope.hasBlockDataUpdated) {
				$scope.fetchRoomBlockGridDetails();
			}
		});

		/**
		 * when failed to update data
		 */
		$scope.$on("FAILED_TO_UPDATE_ALLOTMENT_INFO", function(event, errorMessage) {
			$scope.$parent.errorMessage = errorMessage;
		});

		/**
		 * we want to display date in what format set from hotel admin
		 * @param {String/DateObject}
		 * @return {String}
		 */
		$scope.formatDateForUI = function(date_, dateFormat) {
			var type_ = typeof date_,
				returnString = '',
				dateFormat = (dateFormat ? dateFormat : $rootScope.dateFormat);

			switch (type_) {
				//if date string passed
				case 'string':
					returnString = $filter('date')(new tzIndependentDate(date_), dateFormat);
					break;

					//if date object passed
				case 'object':
					returnString = $filter('date')(date_, dateFormat);
					break;
			}
			return (returnString);
		};


		/**
		 * To get css width for grid timeline
		 * For each column 280px is predefined
		 * @return {String} [with px]
		 */
		$scope.getWidthForContractViewTimeLine = function() {
			return ($scope.allotmentConfigData.summary.selected_room_types_and_occupanies.length * 280 + 40) + 'px';
		};

		/**
		 * For each column 190px is predefined
		 * @return {String} [with px]
		 */
		$scope.getWidthForCurrentViewTimeLine = function() {
			return ($scope.allotmentConfigData.summary.selected_room_types_and_occupanies.length * 190 + 40) + 'px';
		};

		/**
		 * For each column 190px is predefined
		 * @return {String} [with px]
		 */
		$scope.getWidthForReleaseViewTimeLine = function() {
			return ($scope.allotmentConfigData.summary.selected_room_types_and_occupanies.length * 190 + 40) + 'px';
		};

		/**
		 * set up accordion
		 * @return {undefined}
		 */
		var setUpAccordion = function() {
			//accordion options, will add/remove class on toggling
			$scope.accordionInitiallyNotCollapsedOptions = {
				header: 'p.line-toggle',
				heightStyle: 'content',
				collapsible: true,
				activate: function(event, ui) {
					if (isEmpty(ui.newHeader) && isEmpty(ui.newPanel)) { //means accordion was previously collapsed, activating..
						ui.oldHeader.removeClass('open');
					} else if (isEmpty(ui.oldHeader)) { //means activating..
						ui.newHeader.addClass('open');
					}

					//we have to refresh scroller afetr that
					refreshScroller();
				}

			};
		};
		/**
		 * We have a list of variables to identify to initialize depending the mode (Add/Edit)
		 * @return None
		 */
		var initializeAddOrEditModeVariables = function() {
			//variable used to track Create Button, as per sice we are only handling edit mode we are
			//proceeding with true TODO: Add reference here
			$scope.createButtonClicked = true;

			//total pickup & rooms
			$scope.totalPickups = $scope.totalRooms = 0;

			//has data updated from this view, block from date or to date
			$scope.hasBlockDataUpdated = false;

			//selected Hold status:
			$scope.selectedHoldStatus = "";

			var isInEditMode = !$scope.isInAddMode(),
				refData = $scope.allotmentConfigData;

			//room block grid data
			$scope.detailsGridTimeLine = [];

			//whether the booking data changed
			$scope.hasBookingDataChanged = false;

			_.extend($scope.allotmentConfigData.summary, {
				selected_room_types_and_bookings: [],
				selected_room_types_and_occupanies: [],
				selected_room_types_and_rates: []
			});

			if (isInEditMode) {
				$scope.createButtonClicked = true;
				$scope.totalPickups = refData.summary.rooms_pickup;
				$scope.totalRooms = refData.summary.rooms_total;

				$scope.selectedHoldStatus = util.convertToInteger(refData.summary.hold_status);
			}

			//list of holding status list
			$scope.holdStatusList = refData.holdStatusList;
		};

		/**
		 * utiltiy function for setting scroller and things
		 * return - None
		 */
		var setScroller = function() {
			//setting scroller things
			var scrollerOptions = {
				tap: true,
				preventDefault: false,
				probeType: 3
			};
			$scope.setScroller('room_block_scroller', scrollerOptions);

			var scrollerOptionsForRoomRatesTimeline = _.extend({
				scrollX: true,
				scrollY: false,
				scrollbars: false
			}, util.deepCopy(scrollerOptions));

			$scope.setScroller('room_rates_timeline_scroller', scrollerOptionsForRoomRatesTimeline);

			var scrollerOptionsForRoomRatesGrid = _.extend({
				scrollY: true,
				scrollX: true
			}, util.deepCopy(scrollerOptions));

			$scope.setScroller('room_rates_grid_scroller', scrollerOptionsForRoomRatesGrid);

			$timeout(function() {
				$scope.$parent.myScroll['room_rates_timeline_scroller'].on('scroll', function() {
					var xPos = this.x;
					var block = $scope.$parent.myScroll['room_rates_grid_scroller'];
					block.scrollTo(xPos, block.y);
				});
				$scope.$parent.myScroll['room_block_scroller'].on('scroll', function() {
					var yPos = this.y;
					var block = $scope.$parent.myScroll['room_rates_grid_scroller'];
					block.scrollTo(block.x, yPos);
				});
				$scope.$parent.myScroll['room_rates_grid_scroller'].on('scroll', function() {
					var xPos = this.x;
					var yPos = this.y;
					$scope.$parent.myScroll['room_rates_timeline_scroller'].scrollTo(xPos, 0);
					$scope.$parent.myScroll['room_block_scroller'].scrollTo(0, yPos);
				});
			}, 1000);
		};

		/**
		 * utiltiy function to refresh scroller
		 * return - None
		 */
		var refreshScroller = function() {
			$timeout(function() {
				$scope.refreshScroller('room_block_scroller');
				$scope.refreshScroller('room_rates_timeline_scroller');
				$scope.refreshScroller('room_rates_grid_scroller');
			}, 350);
		};

		/**
		 * to set the active left side menu
		 * @return {undefined}
		 */
		var setActiveLeftSideMenu = function () {
			var activeMenu = ($scope.isInAddMode()) ? "menuCreateAllotment": "menuManageAllotment";
			$scope.$emit("updateRoverLeftMenu", activeMenu);
		};

		/**
		 * Initialize scope variables
		 * @return {undefined}
		 */
		var initializeVariables = function () {
			$scope.activeGridView = 'CONTRACT';
			$scope.gridViewTemplateUrl = $scope.getGridViewTemplateurl($scope.activeGridView);

			//we use this to ensure that we will call the API only if there is any change in the data
			summaryMemento = _.extend({}, $scope.allotmentConfigData.summary);

			//since we are recieving two ouside click event on tapping outside, we wanted to check and act
			$scope.isUpdateInProgress = false;
		};



		/**
		 * This function sets tab data
		 * @return {undefined}
		 */
		var initializeRoomBlockDetails = function(){
			$scope.fetchRoomBlockGridDetails();
		};

		/**
		 * Function to initialise room block details
		 * @return - None
		 */
		var initializeMe = function() {
			BaseCtrl.call(this, $scope);

			//updating the left side menu
			setActiveLeftSideMenu();

			//we have a list of scope varibales which we wanted to initialize
			initializeVariables();

			//IF you are looking for where the hell the API is CALLING
			//scroll above, and look for the event 'ALLOTMENT_TAB_SWITCHED'

			//setting scrollers
			setScroller();

			// accoridion
			setUpAccordion();

			//we have a list of scope varibales which we wanted to assign when it is in add/edit mode
			initializeAddOrEditModeVariables();

			// as per CICO-17081 we can enter a tab directly without TAB_SWITCHING
			if ($scope.allotmentConfigData.activeTab === "ROOM_BLOCK") {
				initializeRoomBlockDetails();
			}

		}();

		var reinit = function() {

			//setting scrollers
			setScroller();

			// accoridion
			setUpAccordion();
		};
	}
]);