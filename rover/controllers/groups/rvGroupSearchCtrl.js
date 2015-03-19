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
		* function used to set initlial set of values
		* @return {None}
		*/
		var initializeMe = function(){
		  	//chnaging the heading of the page
		    $scope.setHeadingTitle ('GROUPS');	
		    		
			//date picker options - From
			$scope.fromDateOptions = {
	            showOn: 'button',
	            dateFormat: 'MM-dd-yyyy',
	            numberOfMonths: 1
	        };

	        //date picker options - Departute
	        $scope.toDateOptions = {
	            showOn: 'button',
	            dateFormat: 'MM-dd-yyyy',
	            numberOfMonths: 1            
	        };

	        //default from date, as per CICO-13899 it will be business date
	        $scope.fromDate = businessDate.business_date;

	        //default to date, as per CICO-13899 it will be blank
	        $scope.toDate = '';

	        //groupList
	        $scope.groupList = initialGroupListing.groups;      
		}();						
	}]);