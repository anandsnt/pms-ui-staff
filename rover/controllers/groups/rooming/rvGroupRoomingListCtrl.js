sntRover.controller('rvGroupRoomingListCtrl',	[
	'$scope',
	'$rootScope',
	'rvGroupRoomingListSrv',
	'$filter',
	'$timeout',
	'$state',
	'rvUtilSrv',
	'rvPermissionSrv',
	function($scope, 
			$rootScope, 
			rvGroupRoomingListSrv, 
			$filter,
			$timeout,			
			$state, 
			util,
			rvPermissionSrv) {

		BaseCtrl.call(this, $scope);

		/**
		 * Has Permission To Create group room block
		 * @return {Boolean}
		 */
		var hasPermissionToCreateRoomingList = function() {
			return true;
			return (rvPermissionSrv.getPermissionValue('CREATE_ROOMING_LIST'));
		};


		/**
		 * Has Permission To Edit group room block
		 * @return {Boolean}
		 */
		var hasPermissionToEditRoomingList = function() {
			return true;
			return (rvPermissionSrv.getPermissionValue('EDIT_ROOMING_LIST'));
		};

		/**
		 * Function to decide whether to show 'no reservations' screen
		 * if reservations list is empty, will return true
		 * @return {Boolean}
		 */
		$scope.shouldShowNoReservations = function() {
			return ($scope.reservations.length === 0);
		};

		/**
		 * Function to decide whether to show 'no guest one'
		 * if guest card id is empty, will return true
		 * @return {Boolean}
		 */
		$scope.isGuestBlank = function(reservation) {
			return util.isEmpty(reservation.guest_card_id);
		};

		/**
		 * Function to decide whether to show unassigned room' screen
		 * if room is empty, will return true
		 * @return {Boolean}
		 */
		$scope.isRoomUnAssigned = function(reservation) {
			return util.isEmpty(reservation.room_no);
		};

		/**
		* we want to display date in what format set from hotel admin
		* @param {String/DateObject}
		* @return {String}
		*/
		$scope.formatDateForUI = function(date_){
			var type_ = typeof date_, returnString = '';
			switch (type_){
				//if date string passed
				case 'string':
					returnString = $filter('date') (new tzIndependentDate (date_), $rootScope.dateFormat); 
					break;
				
				//if date object passed
				case 'object':
					returnString = $filter('date') (date_, $rootScope.dateFormat); 
					break;				
			}
			return (returnString);
		};
		/**
		 * [successCallBackOfFetchRoomBlockGridDetails description]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
	 	var successCallBackOfFetchRoomingDetails = function(data){		 		
	 		
	 		//adding available room count over the data we got
	 		$scope.roomTypesAndData = _.map(data.result, function(data){
				data.availableRoomCount = util.convertToInteger (data.total_rooms) - util.convertToInteger (data.total_pickedup_rooms);
				return data;
	 		});	 		
			//we changed data, so
			//refreshScroller();
	 	}

	 	/**
	 	 * [successCallBackOfAddReservations description]
	 	 * @param  {[type]} data [description]
	 	 * @return {[type]}      [description]
	 	 */
	 	var successCallBackOfAddReservations = function(data){
	 		$scope.reservations = data.results;	 
	 		console.log ($scope.reservations)		;
	 	};

	 	/**
	 	 * to add reservations against a room type
	 	 * @return undefined
	 	 */
	 	$scope.addReservations = function(){
	 		//API params
	 		var params = {
	 			group_id: 		$scope.groupConfigData.summary.group_id,
	 			room_type_id: 	$scope.selectedRoomType,
	 			from_date: 		$scope.fromDate,
	 			to_date: 		$scope.toDate,
	 			occupancy: 		$scope.selectedOccupancy,
	 			no_of_reservations: $scope.numberOfReservations
	 		};

		 	//
		 	var options = {
				params: 			params,
				successCallBack: 	successCallBackOfAddReservations,	   
			};
			$scope.callAPI (rvGroupRoomingListSrv.addReservations, options);

	 	};

		/**
		 * [fetchRoomingDetails description]
		 * @return {[type]} [description]
		 */
		$scope.fetchRoomingDetails = function(){
			var hasNeccessaryPermission = (hasPermissionToCreateRoomingList() &&
				hasPermissionToEditRoomingList());

			if(!hasNeccessaryPermission) {
				$scope.errorMessage = ['Sorry, You dont have enough permission to proceed!!'];
				return;
			}

			var params = {
				id: $scope.groupConfigData.summary.group_id
			};

		 	var options = {
				params: 			params,
				successCallBack: 	successCallBackOfFetchRoomingDetails,	   
			};
			$scope.callAPI (rvGroupRoomingListSrv.getRoomTypesConfiguredAgainstGroup, options);		 	
		};

		/**
		 * when a tab switch is there, parant controller will propogate
		 * API, we will get this event, we are using this to fetch new room block deails		 
		 */
		$scope.$on("GROUP_TAB_SWITCHED", function(event, activeTab){
			if (activeTab !== 'ROOMING') return;
			$scope.fetchRoomingDetails();
		});
		
		/**
		 * [initializeVariables description]
		 * @return {[type]} [description]
		 */
		var initializeVariables = function(){
			//selected room types & its data against group
			$scope.roomTypesAndData = [];

			//list of our reservations
			$scope.reservations = [];

			//text mapping against occupancy
			$scope.occupancyTextMap = {
				'1' : 'Single',
				'2' : 'Double',
				'3' : 'Triple',
				'4' : 'Quadruple',
			}

			//some default selected values
			$scope.numberOfReservations = '1';
			$scope.selectedOccupancy = '1';
			
		};

		/**
		 * utility function to set datepicker options
		 * return - None
		 */
		var setDatePickerOptions = function() {
			//referring data model -> from group summary 
			var refData = $scope.groupConfigData.summary;

			//date picker options - Common
			var commonDateOptions = {
				dateFormat 		: $rootScope.jqDateFormat,
				numberOfMonths	: 1,
			};	

			//date picker options - From
			$scope.fromDateOptions = _.extend ({
				minDate: new tzIndependentDate(refData.block_from),
				maxDate: new tzIndependentDate(refData.block_to),
				//onSelect: fromDateChoosed
			}, commonDateOptions);

			//date picker options - Departute
			$scope.toDateOptions = _.extend ({
				minDate: new tzIndependentDate(refData.block_from),
				maxDate: new tzIndependentDate(refData.block_to),
				//onSelect: toDateChoosed            
			}, commonDateOptions);

			//default from date, as per CICO-13900 it will be block_from date       
			$scope.fromDate = $filter('date')(tzIndependentDate (refData.block_from), 
							$rootScope.dateFormat);

			//default to date, as per CICO-13900 it will be block_to date    
			$scope.toDate = $filter('date')(tzIndependentDate (refData.block_to), 
							$rootScope.dateFormat);
		};

		/**
		 * Function to initialise room block details
		 * @return - None
		 */
		var initializeMe = function() {
			//updating the left side menu
			$scope.$emit("updateRoverLeftMenu", "menuCreateGroup");

			//IF you are looking for where the hell the API is CALLING
			//scroll above, and look for the event 'GROUP_TAB_SWITCHED'
	    	
	    	//date related setups and things
	    	setDatePickerOptions();

			//setting scrollers
			//setScroller();

			//we have a list of scope varibales which we wanted to initialize
			initializeVariables();

		}();		
	}]);