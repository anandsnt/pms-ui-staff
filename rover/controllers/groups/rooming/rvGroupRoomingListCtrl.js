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
		 * function to get reservation class against reservation status
		 * @param {String} [reservationStatus] [description]
		 * @return {String} [class name]
		 */
		$scope.getReservationClass = function(reservationStatus) {
			var classes = {
				"RESERVED" 		: 'arrival',
				"CHECKING_IN"	: 'check-in',
				"CHECKEDIN"		: 'inhouse',
				"CHECKING_OUT"	: 'check-out',
				"CHECKEDOUT" 	: 'departed',
				"CANCELED"		: 'cancel',
				"NOSHOW"		: 'no-show',
				"NOSHOW_CURRENT": 'no-show',
			};
			if (reservationStatus.toUpperCase() in classes) {
				return classes[reservationStatus.toUpperCase()];
			}
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
	 	}

	 	/**
	 	 * [successCallBackOfAddReservations description]
	 	 * @param  {[type]} data [description]
	 	 * @return {[type]}      [description]
	 	 */
	 	var successCallBackOfAddReservations = function(data){
	 		$scope.reservations = data.results;	 
	 		
	 		//total result count
			$scope.totalResultCount = data.total_count;

	 		//we changed data, so
			refreshScrollers();
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
			};

			//total result count
			$scope.totalResultCount = 0;

			//some default selected values
			$scope.numberOfReservations = '1';
			$scope.selectedOccupancy = '1';
			
		};
		
		/**
		 * should we show pagination area
		 * @return {Boolean}
		 */
		$scope.shouldShowPagination = function(){
			return ($scope.totalResultCount >= $scope.perPage);
		};

		/**
		 * should we disable next button 
		 * @return {Boolean}
		 */
		$scope.isNextButtonDisabled = function(){
			return ($scope.end >= $scope.totalResultCount);	
		};

		/**
		 * should we disable prev button 
		 * @return {Boolean}
		 */
		$scope.isPrevButtonDisabled = function(){
			return ($scope.start === 1);	
		};

		/**
		 * function to trgger on clicking the next button
		 * will call the search API after updating the current page
		 * return - None
		 */
		$scope.loadPrevSet = function() {
			var isAtEnd = ($scope.end == $scope.totalResultCount);
			if (isAtEnd){
				//last diff will be diff from our normal diff
				var lastDiff = ($scope.totalResultCount % $scope.perPage);				
				if (lastDiff == 0){
					lastDiff = $scope.perPage;
				}

				$scope.start = $scope.start - $scope.perPage;
				$scope.end 	 = $scope.end - lastDiff;
			}
			else {
				$scope.start = $scope.start - $scope.perPage;
				$scope.end   = $scope.end - $scope.perPage;
			}

			//Decreasing the page param used for API calling
			$scope.page--;
			
			//yes we are calling the API
			$scope.fetchReservations();			
		};

		/**
		 * function to trgger on clicking the next button
		 * will call the search API after updating the current page
		 * return - None
		 */
		$scope.loadNextSet = function() {
			$scope.start = $scope.start + $scope.perPage;
			var willNextBeEnd = (($scope.end + $scope.perPage) > $scope.totalResultCount);
			
			if (willNextBeEnd){
				$scope.end = $scope.totalResultCount;
			}
			else {
				$scope.end = $scope.end + $scope.perPage;
			}

			//Increasing the page param used for API calling
			$scope.page++;

			//yes we are calling the API
			$scope.fetchReservations();			
		};
		/**
		 * Pagination things
		 * @return {undefined}
		 */
		var initialisePagination = function(){
			//pagination
			$scope.perPage 	= rvGroupRoomingListSrv.DEFAULT_PER_PAGE;
			$scope.start 	= 1;
			$scope.end 		= undefined;

			//what is page that we are requesting in the API
			$scope.page = 1;
		};

	 	/**
	 	 * [successCallBackOfFetchReservations description]
	 	 * @param  {[type]} data [description]
	 	 * @return {[type]}      [description]
	 	 */
	 	var successCallBackOfFetchReservations = function(data){
	 		$scope.reservations = data.results;	 
	 		
	 		//total result count
			$scope.totalResultCount = data.total_count;
			//if pagination end is undefined
			if ($scope.end == undefined) { $scope.end = $scope.reservations.length; }
			runDigestCycle();
	 		//we changed data, so
			refreshScrollers();
	 	};


		/**
		* utility function to form API params for group search
		* return {Object}
		*/
		var formFetchReservationsParams = function(){
			var params = {
				group_id 	: $scope.groupConfigData.summary.group_id,
				per_page 	: $scope.perPage,
				page  		: $scope.page
			};
			return params;
		};

		/**
		* to fetch reservations against group
		* @return - None
		*/
		$scope.fetchReservations = function(){
			var params = formFetchReservationsParams();
			var options = {
				params: 			params,
				successCallBack: 	successCallBackOfFetchReservations     		
			};
			$scope.callAPI(rvGroupRoomingListSrv.fetchReservations, options);			
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
		* utiltiy function for setting scroller and things
		* return - None		
		*/
		var setScroller = function(){
			//setting scroller things
			var scrollerOptions = {
				tap 			: true,
				preventDefault	: false,
				deceleration 	: 0.0001,
				shrinkScrollbars: 'clip'
			};
			$scope.setScroller('rooming_list', scrollerOptions); 
		};
		
		/**
		* utiltiy function for setting scroller and things
		* return - None		
		*/
		var refreshScrollers = function() {
			$scope.refreshScroller('rooming_list');
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
			setScroller();

			//we have a list of scope varibales which we wanted to initialize
			initializeVariables();

			//get reservation list
			$scope.fetchReservations();

			//pagination
			initialisePagination();
		}();		
	}]);