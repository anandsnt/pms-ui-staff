sntRover.controller('rvGroupSearchCtrl',	[
	'$scope',
	'$rootScope',
	'rvGroupSrv',
	'initialGroupListing',
	'businessDate',
	'$filter',
	function($scope, 
			$rootScope, 
			rvGroupSrv, 
			initialGroupListing, 
			businessDate, 
			$filter) {
			
		BaseCtrl.call(this, $scope);

		/**
		* util function to check whether a string is empty
		* @param {String/Object}
		* @return {boolean}
		*/
		$scope.isEmpty = function(string){
			return ($scope.escapeNull(string).trim() === '');
		};

		/**
		* util function to get CSS class against diff. Hold status
		* @param {Object} - group
		* @return {String}
		*/
		$scope.getClassAgainstHoldStatus = function(group){
			var classes = '';

			if(group.hold_status === 'tentative')
				classes = 'tentative';			
			if(group.hold_status === 'definitive')
				classes += ' ';

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
			if(group.status === 'cancelled')
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
			if(group.status === 'cancelled')
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
		* utility function to form API params for group search
		* return {Object}
		*/
		var formGroupSearchParams = function(){
			var params = {
				query		: $scope.query,
				from_date	: $scope.fromDate,
				to_date		: $scope.toDate,
			};
			return params;
		};

		/**
		* to Search for group
		* @return - None
		*/
		$scope.search = function(){
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
			$scope.groupList = data.groups;  
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
				showOn: 'button',
				dateFormat: $rootScope.jqDateFormat,
				numberOfMonths: 1,
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

			//default to date, as per CICO-13899 it will be blank
			$scope.toDate = '';
		};

		/**
		* utiltiy function for setting scroller and things
		* return - None		
		*/
		var setScrollerForMe = function(){
			//setting scroller things
			var scrollerOptions = {
				tap: true,
				preventDefault: false,
				deceleration: 0.0001,
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

			//scroller and related things
			setScrollerForMe();
		}();	


	}]);