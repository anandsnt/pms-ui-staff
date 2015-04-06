sntRover.controller('rvGroupSearchCtrl',	[
	'$scope',
	'$rootScope',
	'rvGroupSrv',
	'initialGroupListing',
	'businessDate',
	'$filter',
	'$timeout',
	'$state',
	'rvUtilSrv',
	function($scope, 
			$rootScope, 
			rvGroupSrv, 
			initialGroupListing, 
			businessDate, 
			$filter,
			$timeout,
			$state, util) {
			
		BaseCtrl.call(this, $scope);

		/**
		* util function to check whether a string is empty
		* we are assigning it as util's isEmpty function since it is using in html
		* @param {String/Object}
		* @return {boolean}
		*/
		$scope.isEmpty = util.isEmpty;

		/**
		* util function to get CSS class against diff. Hold status
		* @param {Object} - group
		* @return {String}
		*/
		$scope.getClassAgainstHoldStatus = function(group){
			var classes = '';
			var isSystemDefined = group.is_system_defined;

			//According to Nicole's comment in CICO-13899 (Color coding)
			if (isSystemDefined){
				if(group.hold_status === 'Tentative')
					classes = 'tentative';			
				if(group.hold_status === 'Definite')
					classes += ' ';
			}
			//for custom status
			else {
				if(!group.is_take_from_inventory)
					classes = 'tentative';
			}
			return classes;
		};

		/**
		* util function to get CSS class against diff. Hold status
		* @param {Object} - group
		* @return {String}
		*/
		$scope.getClassAgainstPickedStatus = function(group){
			var classes = '';

			//Add class "green" if No. > 0
			if(group.total_picked_count > 0)
				classes = 'green';			
			//Add class "red" if cancelled
			if(group.status === 'cancelled')
				classes += ' red';

			return classes;
		};	

		/**
		* util function to get CSS class against guest for arrival
		* @param {Object} - group
		* @return {String}
		*/
		$scope.getGuestClassForArrival = function(group){
			var classes = '';

			//Add class "check-in" if guest status is not cancelled
			if(group.status !== 'cancelled')
				classes = 'check-in';			
			//Add class "red" if cancelled
			if(group.status === 'cancelled' || group.hold_status.toLowerCase() === 'cancel')
				classes = 'cancel';

			return classes;
		};

		/**
		* util function to get CSS class against guest for arrival
		* @param {Object} - group
		* @return {String}
		*/
		$scope.getGuestClassForDeparture = function(group){
			var classes = '';

			//Add class "check-out" if guest status is not cancelled
			if(group.status !== 'cancelled')
				classes = 'check-out';			
			//Add class "red" if cancelled
			if(group.status === 'cancelled' || group.hold_status.toLowerCase() === 'cancel')
				classes = 'cancel';

			return classes;
		};

		/**
		* Function to clear from Date
		* @return {None}
		*/
		$scope.clearFromDate = function(){
			$scope.fromDate = '';			
			runDigestCycle();
			
			//we have to search on changing the from date
			$scope.search();			
		};

		/**
		* Function to clear to Date
		* @return {None}
		*/
		$scope.clearToDate = function(){
			$scope.toDate = '';
			runDigestCycle();
			
			//we have to search on changing the from date
			$scope.search();			
		};

		/**
		* Function to clear to search query
		* @return {None}
		*/
		$scope.clearSearchQuery = function(){
			$scope.query = '';
			runDigestCycle();
			
			//we have to search on changing the from date
			$scope.search();			
		};

		/**
		* function to stringify a string
		* sample use case:- directive higlight filter 
		* sometimes through error parsing speial charactes
		* @param {String}
		* @return {String}
		*/
		$scope.stringify = util.stringify;

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
		* when the from Date choosed,
		* will assign fromDate to using the value got from date picker
		* return - None
		*/
		var fromDateChoosed = function(date, datePickerObj){
			$scope.fromDate = $filter('date') (date, $rootScope.dateFormat);
			runDigestCycle();
			
			//we have to search on changing the from date
			$scope.search();
		};

		/**
		* when the from Date choosed,
		* will assign fromDate to using the value got from date picker
		* return - None
		*/
		var toDateChoosed = function(date, datePickerObj){
			$scope.toDate = $filter('date') (date, $rootScope.dateFormat);
			runDigestCycle();

			//we have to search on changing the to date
			$scope.search();
		};

		/**
		 * Event propogated by ngrepeatstart directive
		 * we used to show activity indicator
		 */
		$scope.$on('NG_REPEAT_STARTED_RENDERING', function(event) {
			$scope.$emit('showLoader');
		});

		/**
		 * Event propogated by ngrepeatend directive
		 * we used to hide activity indicator & refresh scroller
		 */
		$scope.$on('NG_REPEAT_COMPLETED_RENDERING', function(event) {
			$timeout(function() {
				refreshScrollers();
			}, 300);
			$scope.$emit('hideLoader');
		});

		/**
		* when there is any change in search query
		* this function will execute
		* @return {None}
		*/
		$scope.searchQueryChanged = function() {
			if ($scope.isEmpty ($scope.query)){
				return false;
			}

			if ($scope.query.length < 3){
				return false;
			}

			$scope.search ();
		};

		/**
		* utility function to form API params for group search
		* return {Object}
		*/
		var formGroupSearchParams = function(){
			var params = {
				query		: $scope.query,
				from_date	: $scope.fromDate,
				to_date		: $scope.toDate,
				per_page 	: $scope.perPage,
				page  		: $scope.page
			};
			return params;
		};

		/**
		* to Search for group
		* @return - None
		*/
		$scope.search = function(){
			//am trying to search something, so we have to change the initial search helping screen if no rsults
			$scope.amFirstTimeHere = false;

			var params = formGroupSearchParams();
			var options = {
				params: 			params,
				successCallBack: 	successCallBackOfSearch,	 
				failureCallBack: 	failureCallBackOfSearch,      		
			};
			$scope.callAPI(rvGroupSrv.getGroupList, options);			
		};

		/**
		* on success of search API
		* @param {Array} - array of objects - groups
		* @return {None}
		*/
		var successCallBackOfSearch = function(data){			
			//groupList
			$scope.groupList = data.groups; 

			//total result count
			$scope.totalResultCount = data.total_count;

			refreshScrollers ();
		};

		/**
		* on success of search API
		* @param {Array} - error messages
		* @return {None}
		*/
		var failureCallBackOfSearch = function(error){
			$scope.errorMessage = error;
		};

		/**
		* utility function to set datepicker options
		* return - None
		*/
		var setDatePickerOptions = function() {
			//date picker options - Common
			var commonDateOptions = {
				showOn 			: 'button',
				dateFormat 		: $rootScope.jqDateFormat,
				numberOfMonths	: 1,
			};	

			//date picker options - From
			$scope.fromDateOptions = _.extend ({
				onSelect: fromDateChoosed
			}, commonDateOptions);

			//date picker options - Departute
			$scope.toDateOptions = _.extend ({
				onSelect: toDateChoosed            
			}, commonDateOptions);

			//default from date, as per CICO-13899 it will be business date	        
			$scope.fromDate = $filter('date')(tzIndependentDate (businessDate.business_date), 
							$rootScope.dateFormat);

			//default to date, as per CICO-13899 it will be business date	
			$scope.toDate = $filter('date')(tzIndependentDate (businessDate.business_date), 
							$rootScope.dateFormat);
		};

		/**
		* utiltiy function for setting scroller and things
		* return - None		
		*/
		var setScrollerForMe = function(){
			//setting scroller things
			var scrollerOptions = {
				tap 			: true,
				preventDefault	: false,
				deceleration 	: 0.0001,
				shrinkScrollbars: 'clip'
			};
			$scope.setScroller('result_showing_area', scrollerOptions); 
		};
		
		/**
		* utiltiy function for setting scroller and things
		* return - None		
		*/
		var refreshScrollers = function() {
			$scope.refreshScroller('result_showing_area');
		};

		/**
		* Pagination things
		*/
		var setInitialPaginationAndAPIThings = function(){
			//pagination
			$scope.perPage 	= rvGroupSrv.DEFAULT_PER_PAGE;
			$scope.start 	= 1;
			$scope.end 		= initialGroupListing.groups.length;

			//what is page that we are requesting in the API
			$scope.page = 1;
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
		* should we show pagination area
		* @return {Boolean}
		*/
		$scope.shouldShowPagination = function(){
			return ($scope.totalResultCount >= $scope.perPage);
		};

		/**
		* has there any search results?
		* @return {Boolean}
		*/
		var hasSomeSearchResults = function(){
			return ($scope.groupList.length > 0);
		};	

		/**
		 * [isFirstTimeWithNoResult description]
		 * @return {Boolean} [description]
		 */
		$scope.isFirstTimeWithNoResult = function(){
			return ($scope.amFirstTimeHere && !hasSomeSearchResults())
		};

		/**
		 * [shouldShowNoResult description]
		 * @return {[type]} [description]
		 */
		$scope.shouldShowNoResult = function(){			
			return (!$scope.amFirstTimeHere && !hasSomeSearchResults())
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

		//just redirecting to group creation page
		$scope.gotoAddNewGroup = function(){
			$state.go ('rover.groups.config', {'id': "NEW_GROUP"});
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
			$scope.search();			
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
			$scope.search();			
		};

		/**
		 * Navigate to the group configuration state for editing the group
		 * @return undefined
		 */
		$scope.gotoEditGroupConfiguration = function(groupId){
			$state.go('rover.groups.config',{
				id: groupId,
				activeTab: 'SUMMARY'
			})
		}


		/**
		* function used to set initlial set of values
		* @return {None}
		*/
		var initializeMe = function(){
			//chnaging the heading of the page
			$scope.setHeadingTitle ('GROUPS');	

			//updating the left side menu
	    	$scope.$emit("updateRoverLeftMenu", "menuManageGroup");

	    	//date related setups and things
	    	setDatePickerOptions();

			//groupList
			$scope.groupList = initialGroupListing.groups; 
			
			//total result count
			$scope.totalResultCount = initialGroupListing.total_count;

			//Yes am first time here
			$scope.amFirstTimeHere = true;

			//scroller and related things
			setScrollerForMe();

			//pagination  & API things
			setInitialPaginationAndAPIThings();
		}();	


	}]);