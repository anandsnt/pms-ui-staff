sntRover.controller('rvGroupRoomBlockCtrl',	[
	'$scope',
	'$rootScope',
	'$filter',
	function($scope,
		$rootScope,
		$filter) {
		
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
			return $scope.shouldHideUpdateButton();
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
		 * We have a list of variables to identify to initialize depending the mode (Add/Edit)
		 * @return None
		 */
		var initializeAddOrEditModeVariables = function(){
			//variable used to track Create Button
			$scope.createButtonClicked = false;

			var isOnEditMode = !$scope.isInAddMode();

			if (isOnEditMode){
				$scope.createButtonClicked = true;
			}
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