sntRover.controller('rvGroupRoomBlockCtrl',	[
	'$scope',
	'$rootScope',
	'$filter',
	function($scope,
		$rootScope,
		$filter) {

		/**
		 * Function to decide whether to hide Hold status selection box
		 * if from date & to date is not defined, 
		 * we will hide hold status area
		 * @return {Boolean} 
		 */
		$scope.shouldHideHoldStatus = function() {
			return true;
		};

		/**
		 * Function to decide whether to hide rooms & pick up area
		 * if from date & to date is not defined and it is in Add mode will return true 
		 * @return {Boolean} 
		 */
		$scope.shouldHideRoomsAndPickUpArea = function() {
			return true;
		};

		/**
		 * Function to decide whether to disable Create block button
		 * if from date & to date is not defined and it is in Add mode will return true 
		 * @return {Boolean} 
		 */
		$scope.shouldDisableCreatBlockButton = function() {
			return true;
		};

		/**
		 * Function to decide whether to hide Update button
		 * if from date & to date is not defined will return true
		 * @return {Boolean} 
		 */
		$scope.shouldHideUpdateButton = function() {
			return true;
		};

		/**
		 * function used to set date picker 
		 * will create date picker options & initial values
		 * @return - None
		 */
		var setDatePickers = function () {
			//date picker options - Common
			var commonDateOptions = {
				dateFormat 		: $rootScope.jqDateFormat,
				numberOfMonths	: 1,
			};	

			//referring data model -> from group summary 
			var refData = $scope.groupConfigData.summary
			//default start date
			$scope.startDate = new tzIndependentDate (refData.block_from);

			//default to date
			$scope.endDate = new tzIndependentDate (refData.block_to);

			//date picker options - Start Date
			$scope.startDateOptions = _.extend ({
				minDate: $rootScope.businessDate
			}, commonDateOptions);

			//date picker options - End Date
			$scope.endDateOptions = _.extend ({
				minDate: $scope.endDate           
			}, commonDateOptions);		
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
		}();	
	}
]);