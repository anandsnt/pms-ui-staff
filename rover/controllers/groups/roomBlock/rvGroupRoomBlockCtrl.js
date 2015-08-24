sntRover.controller('rvGroupRoomBlockCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'rvPermissionSrv',
	'ngDialog',
	'rvGroupConfigurationSrv',
	'$timeout',
	'rvUtilSrv',
	'$q',
	'dateFilter',
	function($scope,
		$rootScope,
		$filter,
		rvPermissionSrv,
		ngDialog,
		rvGroupConfigurationSrv,
		$timeout,
		util,
		$q,
		dateFilter) {

		var summaryMemento;

		/**
		 * util function to check whether a string is empty
		 * @param {String/Object}
		 * @return {boolean}
		 */
		$scope.isEmpty = util.isEmpty;

		/**
		 * Function to decide whether to hide Hold status selection box
		 * if from date & to date is not defined,
		 * we will hide hold status area
		 * @return {Boolean}
		 */
		$scope.shouldHideHoldStatus = function() {
			var addModeCondition = (!$scope.shouldHideCreateBlockButton() && $scope.isInAddMode());
			var editModeCondition = ($scope.isInAddMode());
			return (addModeCondition || editModeCondition);
		};

		/**
		 * Function to decide whether to hide rooms & pick up area
		 * if from date & to date is not defined and it is in Add mode will return true
		 * @return {Boolean}
		 */
		$scope.shouldHideRoomsAndPickUpArea = function() {
			var addModeCondition = (!$scope.shouldHideCreateBlockButton() && $scope.isInAddMode());
			var editModeCondition = ($scope.isInAddMode());
			return (addModeCondition || editModeCondition);
		};

		/**
		 * Function to get whethere from date & to date is filled or not
		 * @return {Boolean}
		 */
		var startDateOrEndDateIsEmpty = function() {
			var isStartDateIsEmpty = $scope.isEmpty($scope.startDate.toString());
			var isEndDateIsEmpty = $scope.isEmpty($scope.endDate.toString());
			return (isEndDateIsEmpty && isEndDateIsEmpty);
		};

		/**
		 * Function to decide whether to disable Create block button
		 * if from date & to date is not defined, will return true
		 * @return {Boolean}
		 */
		$scope.shouldDisableCreateBlockButton = function() {
			return startDateOrEndDateIsEmpty();
		};

		/**
		 * Function to decide whether to disable Update block button
		 * if nopermission to update grp summary
		 * @return {Boolean}
		 */
		$scope.shouldDisableUpdateBlockButton = function() {
			return !hasPermissionToEditSummaryGroup();
		};

		/**
		 * Function to decide whether to hide Create block button
		 * once click the create button, it become hidden
		 * @return {Boolean}
		 */
		$scope.shouldHideCreateBlockButton = function() {
			return ($scope.createButtonClicked);
		};

		/**
		 * Function to decide whether to hide Update button
		 * if from date & to date is not defined will return true
		 * @return {Boolean}
		 */
		$scope.shouldHideUpdateButton = function() {
			return !$scope.createButtonClicked;
		};

		/**
		 * Function to decide whether to hide 'Add Rooms Button'
		 * @return {Boolean}
		 */
		$scope.shouldHideAddRoomsButton = function() {
			return ($scope.groupConfigData.summary.selected_room_types_and_bookings.length > 0);
		};

		/**
		 * we will change the total pickup rooms to readonly if it is on add mode
		 * @return {Booean}
		 */
		$scope.shouldChangeTotalPickUpToReadOnly = function() {
			return !($scope.isInAddMode());
		};

		/**
		 * we will change the total rooms to readonly if it is on add mode
		 * @return {Booean}
		 */
		$scope.shouldChangeTotalRoomsToReadOnly = function() {
			return !($scope.isInAddMode());
		};

		/**
		 * Has Permission To EditSummaryGroup
		 * @return {Boolean}
		 */
		var hasPermissionToEditSummaryGroup = function() {
			return (rvPermissionSrv.getPermissionValue('EDIT_GROUP_SUMMARY'));
		};

		/**
		 * Has Permission To Over book
		 * @return {Boolean}
		 */
		var hasPermissionToOverBook = function() {
			return (rvPermissionSrv.getPermissionValue('BOOK_ROOM_WITHOUT_INVENTORY'));
		};

		/**
		 * Function to decide whether to disable start date
		 * for now we are checking only permission
		 * @return {Boolean}
		 */
		$scope.shouldDisableStartDate = function() {
			return !hasPermissionToEditSummaryGroup() || !!$scope.groupConfigData.summary.is_cancelled;
		};

		/**
		 * Function to decide whether to disable hold status change
		 * if the permission is false will return true
		 * @return {Boolean}
		 */
		$scope.shouldDisableHoldStatusChange = function() {
			return !hasPermissionToEditSummaryGroup() || !!$scope.groupConfigData.summary.is_cancelled;
		};

		/**
		 * should we wanted to show the save button for room type booking change
		 * @return {Boolean}
		 */
		$scope.shouldShowSaveButton = function() {
			return $scope.hasBookingDataChanged && $scope.shouldHideAddRoomsButton();
		};

		/**
		 * should we wanted to show the save button for room type booking change
		 * @return {Boolean}
		 */
		$scope.shouldShowDiscardButton = function() {
			return $scope.hasBookingDataChanged && $scope.shouldHideAddRoomsButton();
		};

		/**
		 * Function to decide whether to disable end date
		 * for now we are checking only permission
		 * @return {Boolean}
		 */
		$scope.shouldDisableEndDate = function() {
			return !hasPermissionToEditSummaryGroup()  || !!$scope.groupConfigData.summary.is_cancelled;
		};

		/**
		 * Has Permission To Create group room block
		 * @return {Boolean}
		 */
		var hasPermissionToCreateRoomBlock = function() {
			return (rvPermissionSrv.getPermissionValue('CREATE_GROUP_ROOM_BLOCK'));
		};


		/**
		 * Has Permission To Edit group room block
		 * @return {Boolean}
		 */
		var hasPermissionToEditRoomBlock = function() {
			return (rvPermissionSrv.getPermissionValue('EDIT_GROUP_ROOM_BLOCK'));
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
		 * well, do we wanted to show triple button
		 * if there is any key 'triple' found in room type.dates (array of objects),
		 * it means some entry is found
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldShowTripleEntryRow = function(roomType) {
			if ($scope.groupConfigData.summary.rate === -1) {
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
			if ($scope.groupConfigData.summary.rate === -1) {
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
			if (!!$scope.groupConfigData.summary.is_cancelled || !roomType.can_edit) {
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
			if (!!$scope.groupConfigData.summary.is_cancelled || !roomType.can_edit) {
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
			return (!roomType.can_edit || !!$scope.groupConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable double box entry
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableDoubleEntryBox = function(dateData, roomType) {
			return (!roomType.can_edit || !!$scope.groupConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable triple box entry
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableTripleEntryBox = function(dateData, roomType) {
			return (!roomType.can_edit || !!$scope.groupConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable Quadruple box entry
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableQuadrupleEntryBox = function(dateData, roomType) {
			return (!roomType.can_edit || !!$scope.groupConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable add triple button
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableAddTripleButton = function(roomType) {
			return (!roomType.can_edit || !!$scope.groupConfigData.summary.is_cancelled);
		};

		/**
		 * should we wanted to disable add triple button
		 * @param {Object} [dateData] [description]
		 * @param {Object} - Room Type data row
		 * @return {Boolean}
		 */
		$scope.shouldDisableAddQuadrupleButton = function(roomType) {
			return (!roomType.can_edit || !!$scope.groupConfigData.summary.is_cancelled);
		};

		/**
		 * to copy the single & single_pick up value entered in the column
		 * to the row
		 * @param {Object} - cell data
		 * @param {Object} - row data
		 * @return undefined
		 */
		$scope.copySingleValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.single = cellData.single;
				element.single_pickup = cellData.single_pickup;
			});
			//we chnged something
			$scope.bookingDataChanging();
		};

		/**
		 * to copy the double & double_pick up value entered in the column
		 * to the row
		 * @param {Object} - cell data
		 * @param {Object} - row data
		 * @return undefined
		 */
		$scope.copyDoubleValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.double = cellData.double;
				element.double_pickup = cellData.double_pickup;
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
		$scope.copyTripleValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.triple = cellData.triple;
				element.triple_pickup = cellData.triple_pickup;
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
		$scope.copyQuadrupleValueToOtherBlocks = function(cellData, rowData) {
			_.each(rowData.dates, function(element) {
				element.quadruple = cellData.quadruple;
				element.quadruple_pickup = cellData.quadruple_pickup;
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

		/**
		 * when the start Date choosed,
		 * will assign fromDate to using the value got from date picker
		 * will change the min Date of end Date
		 * return - None
		 */
		var onStartDatePicked = function(date, datePickerObj) {
			$scope.startDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
			$scope.groupConfigData.summary.block_from = $scope.startDate;

			//referring data source
			var refData 		= $scope.groupConfigData.summary,
				newBlockFrom 	= refData.block_from,
				oldBlockFrom	= summaryMemento.block_from,
				chActions 		= $scope.changeDatesActions;

			if (refData.release_date.toString().trim() === '') {
				$scope.groupConfigData.summary.release_date = refData.block_from;
			}
			//if it is is Move Date mode
			if ($scope.changeDatesActions.isInCompleteMoveMode()) {
				var originalStayLength = (util.getDatesBetweenTwoDates (new tzIndependentDate(util.deepCopy(summaryMemento.block_from)), new tzIndependentDate(util.deepCopy(summaryMemento.block_to))).length - 1);
				$scope.groupConfigData.summary.block_to = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
				$scope.groupConfigData.summary.block_to.setDate(refData.block_to.getDate() + originalStayLength);
				$scope.endDate = $scope.groupConfigData.summary.block_to;
			}

			//arrival left date change
			else if(newBlockFrom < oldBlockFrom && chActions.arrDateLeftChangeAllowed()) {
				triggerEarlierArrivalDateChange();

			}

			//arrival right date change
			else if(newBlockFrom > oldBlockFrom && chActions.arrDateRightChangeAllowed()) {
				// check move validity
				if(new tzIndependentDate(refData.first_dep_date) <= newBlockFrom)
					triggerLaterArrivalDateChangeInvalidError();
				else
					triggerLaterArrivalDateChange();
			}

			// we will clear end date if chosen start date is greater than end date
			if ($scope.startDate > $scope.endDate) {
				$scope.endDate = '';
			}
			//setting the min date for end Date
			$scope.endDateOptions.minDate = $scope.startDate;

			//we have to show create button


			runDigestCycle();
		};

		/**
		 * when the end Date choosed,
		 * will assign endDate to using the value got from date picker
		 * return - None
		 */
		var onEndDatePicked = function(date, datePickerObj) {
			$scope.endDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
			$scope.groupConfigData.summary.block_to = $scope.endDate;

			//referring data source
			var refData 	= $scope.groupConfigData.summary,
				newBlockTo 	= refData.block_to,
				oldBlockTo	= summaryMemento.block_to,
				chActions 	= $scope.changeDatesActions;

			//departure left date change
			if(newBlockTo < oldBlockTo && chActions.depDateLeftChangeAllowed()) {
				// check move validity
				if(new tzIndependentDate(refData.last_arrival_date) >= newBlockTo)
					triggerEarlierDepartureDateChangeInvalidError();
				else
					triggerEarlierDepartureDateChange();
			}

			//departure right date change
			else if(newBlockTo > oldBlockTo && chActions.depDateRightChangeAllowed()) {
				triggerLaterDepartureDateChange();
			}

			//setting the max date for start Date
			$scope.startDateOptions.maxDate = $scope.endDate;

			//we have to show create button


			runDigestCycle();
		};

		/**
		 * function used to set date picker
		 * will create date picker options & initial values
		 * @return - None
		 */
		var setDatePickers = function() {

			//default start date
			$scope.startDate = '';

			//default to date
			$scope.endDate = '';

			//referring data model -> from group summary
			var refData = $scope.groupConfigData.summary;

			//if from date is not null from summary screen, we are setting it as busines date
			if (!$scope.isEmpty(refData.block_from.toString())) {
				$scope.startDate = refData.block_from;
			}

			//if to date is null from summary screen, we are setting it from date
			if (!$scope.isEmpty(refData.block_to.toString())) {
				$scope.endDate = refData.block_to;
			}


			//date picker options - Common
			var commonDateOptions = {
				dateFormat: $rootScope.jqDateFormat,
				numberOfMonths: 1
			};

			//date picker options - Start Date
			$scope.startDateOptions = _.extend({
				minDate: new tzIndependentDate($rootScope.businessDate),
				maxDate: new tzIndependentDate($scope.groupConfigData.summary.block_to),
				disabled: $scope.groupConfigData.summary.is_cancelled,
				onSelect: onStartDatePicked
			}, commonDateOptions);

			//date picker options - End Date
			$scope.endDateOptions = _.extend({
				minDate: ($scope.startDate !== '') ? new tzIndependentDate($scope.startDate): new tzIndependentDate($rootScope.businessDate),
				disabled: $scope.groupConfigData.summary.is_cancelled,
				onSelect: onEndDatePicked
			}, commonDateOptions);
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
		 * we will first check whether the availability is not matching is the total booked
		 * if it is available, we will call the save API
		 * @return None
		 */
		$scope.clickedOnSaveButton = function() {
			if (!hasPermissionToOverBook() && isOverBooked()) {
				showNoPermissionOverBookingPopup();
				return false;
			}
			if (isOverBooked()) {
				showOverBookingPopup();
			} else {
				$scope.saveRoomBlock();
			}
		};

		/**
		 * when discard button clicked, we will set the booking data with old copy
		 * @return None
		 */
		$scope.clickedOnDiscardButton = function() {
			$scope.groupConfigData.summary.selected_room_types_and_bookings =
				util.deepCopy($scope.copy_selected_room_types_and_bookings);

			//and our isn't changed
			$scope.hasBookingDataChanged = false;
		};

		var successCallBackOfSaveRoomBlock = function(date) {

			//we have save everything we have
			//so our data is new
			$scope.copy_selected_room_types_and_bookings =
				angular.copy($scope.groupConfigData.summary.selected_room_types_and_bookings);

			$scope.hasBookingDataChanged = false;
			$scope.groupConfigData.summary.rooms_total = $scope.getMaxOfBookedRooms();

			//as per CICO-16087, we have to refetch the occupancy and availability after saving
			//so, callinng the API again
			$scope.fetchRoomBlockGridDetails();
		};

		/**
		 * Method to make the API call to save the room block grid
		 * Will be called from
		 * 	1. The controller $scope.onBlockRoomGrid
		 * 	2. The warnReleaseRoomsPopup.html template
		 * @return undefined
		 */
		$scope.saveRoomBlock = function() {
			if (!hasPermissionToOverBook() && isOverBooked()) {
				showNoPermissionOverBookingPopup();
				return false;
			}

			$timeout(function() {
				//TODO : Make API call to save the room block.
				var params = {
					group_id: $scope.groupConfigData.summary.group_id,
					results: $scope.groupConfigData.summary.selected_room_types_and_bookings
				};

				var options = {
					params: params,
					successCallBack: successCallBackOfSaveRoomBlock
				};
				$scope.callAPI(rvGroupConfigurationSrv.saveRoomBlockBookings, options);
			}, 0);
		};

		/**
		 * Method to validate overbooking - Returns true if overbooked
		 * @return boolean
		 */
		var isOverBooked = function() {
			// TODO write check here
			var ref = $scope.groupConfigData.summary.selected_room_types_and_bookings,
				is_over_booked = false,
				indvdlTotal = 0;

			_.each(ref, function(eachRoomType) {
				_.each(eachRoomType.dates, function(dateData) {
					indvdlTotal = $scope.getTotalBookedOfIndividualRoomType(dateData);

					//if there is some diff with old total we calculated earlier and new total
					if ((indvdlTotal !== dateData.old_total) &&
						(indvdlTotal - dateData.old_total) > dateData.availability) {
						is_over_booked = true;
					}
				});
			});
			return is_over_booked;
		};

		/**
		 * Method to show oerbooking popup - No permission popup
		 * @return undefined
		 */
		var showNoPermissionOverBookingPopup = function() {
			// Show overbooking message
			ngDialog.open({
				template: '/assets/partials/groups/roomBlock/rvGroupNoPermissionOverBookingPopup.html',
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
		var showOverBookingPopup = function() {
			// Show overbooking message
			ngDialog.open({
				template: '/assets/partials/groups/roomBlock/rvGroupWarnOverBookingPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/**
		 * To open Add Rooms & Rates popup
		 * @return - undefined
		 */
		var openAddRoomsAndRatesPopup = function() {
			ngDialog.open({
				template: '/assets/partials/groups/roomBlock/rvGroupAddRoomAndRatesPopup.html',
				scope: $scope,
				controller: 'rvGroupAddRoomsAndRatesPopupCtrl'
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
		 * to get the total booked agsint a indivual room type
		 * @param {Object} - room type data
		 * @return {Integer}
		 */
		$scope.getTotalBookedOfIndividualRoomType = function(roomType) {
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
			var ref = $scope.groupConfigData.summary.selected_room_types_and_bookings,
				totalBookedOfEachDate = [],
				arrayOfDateData = [],
				dateWiseGroupedData = {},
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
			dateWiseGroupedData = _.groupBy(arrayOfDateData, 'date');

			//forming sum of individual
			_.each(dateWiseGroupedData, function(el) {
				sum = 0;
				_.each(el, function(eachDateData) {
					sum += $scope.getTotalBookedOfIndividualRoomType(eachDateData);
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
			$scope.groupConfigData.summary.selected_room_types_and_rates = data.room_type_and_rates;
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
				id: $scope.groupConfigData.summary.group_id
			};
			promises.push(rvGroupConfigurationSrv
				.getSelectedRoomTypesAndRates(paramsForRoomTypeAndRates)
				.then(successCallBackOfRoomTypeAndRatesFetch)
			);

			//Lets start the processing
			$q.all(promises)
				.then(successFetchOfAllReqdForRoomAndRatesPopup, failedToFetchAllReqdForRoomAndRatesPopup);
		};

		/**
		 * when Add Room & Rates button clicked, we will save new room Block
		 * @return None
		 */
		$scope.clickedOnUpdateButton = function() {
			//we dont wanted to show room block details for some time
			$scope.groupConfigData.summary.selected_room_types_and_bookings = [];
			$scope.groupConfigData.summary.selected_room_types_and_occupanies = [];

			//unsetting the copied details
			$scope.copy_selected_room_types_and_bookings = [];

			//updating central model with newly formed data
			_.extend(
				$scope.groupConfigData.summary, {
					block_from: $scope.startDate,
					block_to: $scope.endDate,
					hold_status: $scope.selectedHoldStatus
				}
			);

			//callinng the update API calling
			$scope.updateGroupSummary();
			//has data updated from this view, block from date or to date
			$scope.hasBlockDataUpdated = true;
		};

		/**
		 * when a tab switch is there, parant controller will propogate
		 * API, we will get this event, we are using this to fetch new room block deails
		 */
		$scope.$on("GROUP_TAB_SWITCHED", function(event, activeTab) {
			if (activeTab !== 'ROOM_BLOCK') {
				return;
			}
			$scope.fetchRoomBlockGridDetails();

			//on tab switching, we have change min date
			setDatePickers();


		});

		/**
		 * when a tab switch is there, parant controller will propogate
		 * API, we will get this event, we are using this to fetch new room block deails
		 */
		$scope.$on("UPDATED_GROUP_INFO", function(event) {
			//to prevent from initial API calling and only exectutes when group from_date, to_date,status updaet success
			if ($scope.hasBlockDataUpdated) {
				$scope.fetchRoomBlockGridDetails();
			}
		});

		/**
		 * when failed to update data
		 */
		$scope.$on("FAILED_TO_UPDATE_GROUP_INFO", function(event, errorMessage) {
			$scope.$parent.errorMessage = errorMessage;
		});

		/**
		 * Success callback of room block details API
		 */
		var successCallBackOfFetchRoomBlockGridDetails = function(data) {

			//we need indivual room type total bookings of each date initially,
			//we are using this for overbooking calculation
			_.each(data.results, function(eachRoomType) {
				_.each(eachRoomType.dates, function(dateData) {
					dateData.old_total = $scope.getTotalBookedOfIndividualRoomType(dateData);
				});
			});

			$scope.groupConfigData.summary.selected_room_types_and_bookings = data.results;
			$scope.groupConfigData.summary.selected_room_types_and_occupanies = data.occupancy;

			//our total pickup count may change on coming from other tab (CICO-16835)
			$scope.totalPickups = data.total_picked_count;

			//we need the copy of selected_room_type, we ned to use these to show save/discard button
			$scope.copy_selected_room_types_and_bookings = util.deepCopy(data.results);

			//we changed data, so
			refreshScroller();
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
				group_id: $scope.groupConfigData.summary.group_id
			};

			var options = {
				params: params,
				successCallBack: successCallBackOfFetchRoomBlockGridDetails
			};
			$scope.callAPI(rvGroupConfigurationSrv.getRoomBlockGridDetails, options);
		};

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
		 * For each column 190px is predefined
		 * @return {String} [with px]
		 */
		$scope.getWidthForRoomBlockTimeLine = function() {
			return ($scope.groupConfigData.summary.selected_room_types_and_occupanies.length * 190 + 40) + 'px';
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
				refData = $scope.groupConfigData;

			//room block grid data
			$scope.roomBlockGridTimeLine = [];

			//whether the booking data changed
			$scope.hasBookingDataChanged = false;

			_.extend($scope.groupConfigData.summary, {
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
			var activeMenu = ($scope.isInAddMode()) ? "menuCreateGroup": "menuManageGroup";
			$scope.$emit("updateRoverLeftMenu", activeMenu);
		};

		/**
		 * Call to reset the calender dates to the actual one.
		 * @return {undefined}
		 */
		var resetDatePickers = function() {
			//resetting the calendar date's to actual one
			$scope.groupConfigData.summary.block_from 	= '';

			$scope.groupConfigData.summary.block_from 	= new tzIndependentDate(summaryMemento.block_from);
			$scope.groupConfigData.summary.block_to  	= new tzIndependentDate(summaryMemento.block_to);
			$scope.startDate = $scope.groupConfigData.summary.block_to;
			$scope.endDate   = $scope.groupConfigData.summary.block_to;

			//setting the min date for end Date
			$scope.endDateOptions.minDate = $scope.groupConfigData.summary.block_from;

			//setting max date of from date
			$scope.startDateOptions.maxDate = $scope.groupConfigData.summary.block_to;
		};

		/**
		 * Initialize scope variables
		 * @return {undefined}
		 */
		var initializeVariables = function () {

			$scope.changeDatesActions = {};

			//we use this to ensure that we will call the API only if there is any change in the data
			summaryMemento = _.extend({}, $scope.groupConfigData.summary);

			//since we are recieving two ouside click event on tapping outside, we wanted to check and act
			$scope.isUpdateInProgress = false;
		}

		/**
		 * Our Move date, start date, end date change are defined in parent controller
		 * We need to share those actions with room block
		 * @return undefined
		 */
		var initializeChangeDateActions = function () {
			//things are defined in parent controller (getMoveDatesActions)
			$scope.changeDatesActions = $scope.getMoveDatesActions();

			//initially we will be in DEFAULT mode
			$scope.changeDatesActions.setToDefaultMode();
		};

		var successCallBackOfMoveButton = function() {
			$scope.reloadPage("ROOM_BLOCK");
		};

		var failureCallBackOfMoveButton = function(errorMessage) {

		};

		/**
		 * when clicked on Save move button. this will triggr
		 * @return {undefined}
		 */
		$scope.clickedOnSaveMoveButton = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					fromDate 		: sumryData.block_from,
					toDate 			: sumryData.block_to,
					oldFromDate 	: oldSumryData.block_from,
					oldToDate 		: oldSumryData.block_to,
					successCallBack : successCallBackOfMoveButton,
					failureCallBack : failureCallBackOfMoveButton
				};
			$scope.changeDatesActions.clickedOnMoveSaveButton (options);
		};

		/**
		 * when clicked on move button. this will triggr
		 * @return {undefined}
		 */
		$scope.clickedOnMoveButton = function() {
			_.extend($scope.endDateOptions,
			{
				disabled: true
			});

			//resetting the calendar date's to actual one
			resetDatePickers();

			$scope.changeDatesActions.clickedOnMoveButton ();

		};

		/**
		 * when clicked on cancel move button. this will triggr
		 * @return {undefined}
		 */
		$scope.clickedOnCancelMoveButton = function() {
			_.extend($scope.endDateOptions,
			{
				disabled: false
			});

			$scope.reloadPage("ROOM_BLOCK");
		};

		var cancelCallBackofDateChange = function () {
			resetDatePickers();
		}

		var successCallBackOfEarlierArrivalDateChange = function() {
			$scope.reloadPage("ROOM_BLOCK");
		};

		var failureCallBackOfEarlierArrivalDateChange = function(errorMessage) {

		};

		/**
		 * called when start date changed to an earlier date
		 * @return {undefined}
		 */
		var triggerEarlierArrivalDateChange = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					fromDate 			: sumryData.block_from,
					oldFromDate 		: oldSumryData.block_from,
					successCallBack 	: successCallBackOfEarlierArrivalDateChange,
					failureCallBack 	: failureCallBackOfEarlierArrivalDateChange,
					cancelPopupCallBack	: cancelCallBackofDateChange
				};
			$scope.changeDatesActions.triggerEarlierArrDateChange (options);
		};

		var successCallBackOfLaterArrivalDateChange = function() {
			$scope.reloadPage("ROOM_BLOCK");
		};

		var failureCallBackOfLaterArrivalDateChange = function(errorMessage) {

		};

		var triggerEarlierDepartureDateChangeInvalidError = function() {
			var options = {
				cancelPopupCallBack	: cancelCallBackofDateChange,
				message 			: "GROUP_EARLIER_DEP_DATE_CHANGE_WARNING"
			}
			$scope.changeDatesActions.showDateChangeInvalidWarning(options);
		};

		var triggerLaterArrivalDateChangeInvalidError = function() {
			var options = {
				cancelPopupCallBack	: cancelCallBackofDateChange,
				message 			: "GROUP_LATER_ARR_DATE_CHANGE_WARNING"
			}
			$scope.changeDatesActions.showDateChangeInvalidWarning(options);
		};

		/**
		 * called when start date changed to a later date
		 * @return {undefined}
		 */
		var triggerLaterArrivalDateChange = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					fromDate 			: sumryData.block_from,
					oldFromDate 		: oldSumryData.block_from,
					successCallBack 	: successCallBackOfEarlierArrivalDateChange,
					failureCallBack 	: failureCallBackOfEarlierArrivalDateChange,
					cancelPopupCallBack	: cancelCallBackofDateChange
				};
			$scope.changeDatesActions.triggerLaterArrDateChange (options);
		};

		/**
		 * DEPATURE CHANGE
		 */
		/**
		 * [successCallBackOfEarlierDepartureDateChange description]
		 * @return {[type]} [description]
		 */
		var successCallBackOfEarlierDepartureDateChange = function() {
			$scope.reloadPage("ROOM_BLOCK");
		};

		/**
		 * [failureCallBackOfEarlierDepartureDateChange description]
		 * @param  {[type]} errorMessage [description]
		 * @return {[type]}              [description]
		 */
		var failureCallBackOfEarlierDepartureDateChange = function(errorMessage) {

		};

		/**
		 * when clicked on Save move button. this will triggr
		 * @return {undefined}
		 */
		var triggerEarlierDepartureDateChange = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					toDate 				: sumryData.block_to,
					oldToDate 			: oldSumryData.block_to,
					successCallBack 	: successCallBackOfEarlierDepartureDateChange,
					failureCallBack 	: failureCallBackOfEarlierDepartureDateChange,
					cancelPopupCallBack	: cancelCallBackofDateChange
				};
			$scope.changeDatesActions.triggerEarlierDepDateChange (options);
		};

		/**
		 * [successCallBackOfLaterDepartureDateChange description]
		 * @return {[type]} [description]
		 */
		var successCallBackOfLaterDepartureDateChange = function() {
			$scope.reloadPage("ROOM_BLOCK");
		};

		/**
		 * [failureCallBackOfLaterDepartureDateChange description]
		 * @param  {[type]} errorMessage [description]
		 * @return {[type]}              [description]
		 */
		var failureCallBackOfLaterDepartureDateChange = function(errorMessage) {

		};

		/**
		 * when clicked on Save move button. this will triggr
		 * @return {undefined}
		 */
		var triggerLaterDepartureDateChange = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					toDate 				: sumryData.block_to,
					oldToDate 			: oldSumryData.block_to,
					successCallBack 	: successCallBackOfLaterDepartureDateChange,
					failureCallBack 	: failureCallBackOfLaterDepartureDateChange,
					cancelPopupCallBack	: cancelCallBackofDateChange
				};
			$scope.changeDatesActions.triggerLaterDepDateChange (options);
		};


		/**
		 * This function sets tab data
		 * @return {undefined}
		 */
		var initializeRoomBlockDetails = function(){
			$scope.fetchRoomBlockGridDetails();

			//on tab switching, we have change min date
			setDatePickers();
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
			//scroll above, and look for the event 'GROUP_TAB_SWITCHED'

			//start date change, end date change, move date actions
			initializeChangeDateActions();

			//date related setups and things
			setDatePickers();

			//setting scrollers
			setScroller();

			// accoridion
			setUpAccordion();

			//we have a list of scope varibales which we wanted to assign when it is in add/edit mode
			initializeAddOrEditModeVariables();

			// as per CICO-17081 we can enter a tab directly without TAB_SWITCHING
			if ($scope.groupConfigData.activeTab === "ROOM_BLOCK") {
				initializeRoomBlockDetails();
			}

		}();


	}
]);