sntRover.controller('rvGroupRoomBlockCtrl',	[
	'$scope',
	'$rootScope',
	'$filter',
	'rvPermissionSrv',
	'ngDialog',
	'rvGroupConfigurationSrv',
	function($scope,
			$rootScope,
			$filter,
			rvPermissionSrv,
			ngDialog,
			rvGroupConfigurationSrv) {
		
		/**
		* util function to check whether a string is empty
		* @param {String/Object}
		* @return {boolean}
		*/
		$scope.isEmpty = function(string){
			return ($scope.escapeNull(string).trim() === '');
		};

		/**
		 * Function to decide whether to hide Hold status selection box
		 * if from date & to date is not defined, 
		 * we will hide hold status area
		 * @return {Boolean} 
		 */
		$scope.shouldHideHoldStatus = function() {	
			var addModeCondition = (!$scope.shouldHideCreateBlockButton() && $scope.isInAddMode());
			var editModeCondition = (!$scope.isInAddMode());
			return (addModeCondition || editModeCondition);
		};

		/**
		 * Function to decide whether to hide rooms & pick up area
		 * if from date & to date is not defined and it is in Add mode will return true 
		 * @return {Boolean} 
		 */
		$scope.shouldHideRoomsAndPickUpArea = function() {
			var addModeCondition = (!$scope.shouldHideCreateBlockButton() && $scope.isInAddMode());
			var editModeCondition = (!$scope.isInAddMode());			
			return (addModeCondition || editModeCondition);
		};

		/**
		 * Function to decide whether to disable Create block button
		 * if from date & to date is not defined, will return true 
		 * @return {Boolean} 
		 */
		$scope.shouldDisableCreateBlockButton = function() {
			var isStartDateIsEmpty = $scope.isEmpty ($scope.startDate);
			var isEndDateIsEmpty   = $scope.isEmpty ($scope.endDate);
			return (isEndDateIsEmpty && isEndDateIsEmpty);
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
			return ($scope.shouldHideUpdateButton() && !$scope.shouldHideRoomBlockDetailsView());
		};

		/**
		 * we will change the total pickup rooms to readonly if it is on add mode
		 * @return {Booean}
		 */
		$scope.shouldChangeTotalPickUpToReadOnly = function(){
			return ($scope.isInAddMode());
		};

		/**
		 * we will change the total rooms to readonly if it is on add mode
		 * @return {Booean}
		 */
		$scope.shouldChangeTotalRoomsToReadOnly = function(){
			return ($scope.isInAddMode());
		};

		/**
		 * Has Permission To EditSummaryGroup 
		 * @return {Boolean}
		 */
		var hasPermissionToEditSummaryGroup = function(){
			return true;
			return (rvPermissionSrv.getPermissionValue ('EDIT_GROUP_SUMMARY'));			
		};

		/**
		 * Function to decide whether to disable start date
		 * for now we are checking only permission
		 * @return {Boolean}
		 */
		$scope.shouldDisableStartDate = function(){
			return !hasPermissionToEditSummaryGroup();
		};

		/**
		 * Function to decide whether to disable end date
		 * for now we are checking only permission
		 * @return {Boolean}
		 */
		$scope.shouldDisableEndDate = function(){
			return !hasPermissionToEditSummaryGroup();
		};

		/**
		 * Has Permission To Create summary room block 
		 * @return {Boolean}
		 */
		var hasPermissionToCreateRoomBlock = function(){
			return true;
			return (rvPermissionSrv.getPermissionValue ('CREATE_GROUP_ROOM_BLOCK'));
		};

		/**
		 * Function to decide whether to disable Add Rooms & Rates button
		 * for now we are checking only permission
		 * @return {Boolean}
		 */
		$scope.shouldDisableAddRoomsAndRate = function(){
			return !hasPermissionToCreateRoomBlock ();
		};

		/**
		 * [shouldHideRoomBlockDetailsView description]
		 * @return {[type]} [description]
		 */
		$scope.shouldHideRoomBlockDetailsView = function(){
			return (hasPermissionToCreateRoomBlock() &&
					!$scope.displayGroupRoomBlockDetails);
		};
		/**
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
		var runDigestCycle = function(){
			if(!$scope.$$phase) {	
				$scope.$digest();
			}
		};

		/**
		 * when the start Date choosed,
		 * will assign fromDate to using the value got from date picker
		 * will change the min Date of end Date
		 * return - None
		 */
		var onStartDatePicked = function(date, datePickerObj){
			$scope.startDate = date;
			
			// we will clear end date if chosen start date is greater than end date
			if ($scope.startDate > $scope.endDate) {
				$scope.endDate = '';
			}
			//setting the min date for end Date
			$scope.endDateOptions.minDate = $scope.startDate;

			//we have to show create button 
			$scope.createButtonClicked = false;

			runDigestCycle();
		};

		/**
		* when the end Date choosed,
		* will assign endDate to using the value got from date picker
		* return - None
		*/
		var onEndDatePicked = function(date, datePickerObj){
			$scope.endDate = date;

			//we have to show create button 
			$scope.createButtonClicked = false;

			runDigestCycle();
		};

		/**
		 * function used to set date picker 
		 * will create date picker options & initial values
		 * @return - None
		 */
		var setDatePickers = function () {

			//default start date
			$scope.startDate = '';

			//default to date
			$scope.endDate = '';

			//referring data model -> from group summary 
			var refData = $scope.groupConfigData.summary;

			//if from date is not null from summary screen, we are setting it as busines date
			if (!$scope.isEmpty(refData.block_from)){
				$scope.startDate = refData.block_from;
			}

			//if to date is null from summary screen, we are setting it from date
			if (!$scope.isEmpty(refData.block_to)){
				$scope.endDate = refData.block_to;
			}


			//date picker options - Common
			var commonDateOptions = {
				dateFormat 		: $rootScope.jqDateFormat,
				numberOfMonths	: 1,
			};	

			//date picker options - Start Date
			$scope.startDateOptions = _.extend ({
				minDate: new tzIndependentDate ($rootScope.businessDate),
				onSelect: onStartDatePicked
			}, commonDateOptions);

			//date picker options - End Date
			$scope.endDateOptions = _.extend ({
				minDate: $scope.startDate,
				onSelect: onEndDatePicked          
			}, commonDateOptions);	
		};

		/**
		 * when create button clicked, we will show the 'Hold Status and more section'
		 * @return None
		 */
		$scope.clickedOnCreateButton = function(){
			$scope.createButtonClicked = true;
		};

		/**
		 * To open Add Rooms & Rates popup
		 * @return - undefined
		 */
		var openAddRoomsAndRatesPopup = function(){
			ngDialog.open({
				template: '/assets/partials/groups/rvGroupAddRoomAndRatesPopup.html',
				scope: $scope,
				controller: 'rvGroupAddRoomsAndRatesPopupCtrl'				
			});	 
	    };

	    /**
	     * [successCallBackOfAllRoomTypeFetch description]
	     * @param  {Objects} data of All Room Type
	     * @return undefined
	     */
	    var successCallBackOfAllRoomTypeFetch = function(data){
	    	$scope.roomTypes = data.results;
	    	openAddRoomsAndRatesPopup();
	    };

		/**
		 * when Add Room & Rates button clicked, we will fetch all room types,
		 * then we will show the Add Room & Rates popup
		 * @return None
		 */
		$scope.clickedOnAddRoomsAndRatesButton = function(){
			var options = {
				successCallBack: 	successCallBackOfAllRoomTypeFetch,	      		
			};
			$scope.callAPI(rvGroupConfigurationSrv.getAllRoomTypes, options);			
		};
		
		/**
		 * when Add Room & Rates button clicked, we will save new room Block
		 * @return None
		 */
		$scope.clickedOnUpdateButton = function(){

		};

		/**
		 * To update room block details from outside
		 * @param  {Array} dataToUpdate [Array of room block details]
		 * @return undefined
		 */
		$scope.updateRoomBlockDetails = function(dataToUpdate){
			$scope.groupConfigData.summary.selected_room_types_rates = dataToUpdate;
			console.log (dataToUpdate)
		};

		/**
		 * to show room block details area with data
		 * @return undefined
		 */
		$scope.showRoomBlockDetails = function(){
			$scope.displayGroupRoomBlockDetails = true;
		};

		/**
		 * We have a list of variables to identify to initialize depending the mode (Add/Edit)
		 * @return None
		 */
		var initializeAddOrEditModeVariables = function(){
			//variable used to track Create Button
			$scope.createButtonClicked = false;

			//variable used to track group room block details view
			$scope.displayGroupRoomBlockDetails = false;

			//total pickup & rooms
			$scope.totalPickups = $scope.totalRooms = 0;

			var isOnEditMode = !$scope.isInAddMode(),
				refData 	= $scope.groupConfigData;


			if (isOnEditMode){
				$scope.createButtonClicked = true;
				$scope.totalPickups = refData.summary.rooms_pickup;
				$scope.totalRooms = refData.summary.rooms_total;
			}

			//list of holding status list
			$scope.holdStatusList = refData.holdStatusList;
		};

		/**
		 * utiltiy function for setting scroller and things
		 * return - None	
		 */
		var setScroller = function(){
			//setting scroller things
			var scrollerOptions = {
				tap 			: true,
				preventDefault	: false,
			};
			$scope.setScroller('room_block_scroller', scrollerOptions); 
		};

		/**
		 * Function to initialise room block details
		 * @return - None
		 */
		var initializeMe = function(){
			BaseCtrl.call(this, $scope);
			
			//updating the left side menu
	    	$scope.$emit("updateRoverLeftMenu", "menuCreateGroup");

	    	//date related setups and things
	    	setDatePickers();

	    	//setting scrollers
	    	setScroller();

	    	//we have a list of scope varibales which we wanted to assign when it is in add/edit mode
	    	initializeAddOrEditModeVariables();
		}();	
	}
]);