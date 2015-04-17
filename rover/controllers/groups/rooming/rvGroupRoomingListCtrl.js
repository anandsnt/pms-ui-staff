sntRover.controller('rvGroupRoomingListCtrl',	[
	'$scope',
	'$rootScope',
	'rvGroupConfigurationSrv',
	'$filter',
	'$timeout',
	'$state',
	'rvUtilSrv',
	'rvPermissionSrv',
	function($scope, 
			$rootScope, 
			rvGroupConfigurationSrv, 
			$filter,
			$timeout,			
			$state, 
			util,
			rvPermissionSrv) {

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
		 * [successCallBackOfFetchRoomBlockGridDetails description]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
	 	var successCallBackOfFetchRoomingDetails = function(data){		 		
	 		
	 		//adding available room count over the data we got
	 		$scope.roomTypesAndData = _.map(data.results, function(data){
				data.availableRoomCount = util.convertToInteger (data.total_rooms) - util.convertToInteger (data.total_pickedup_rooms);
	 		});

			//we changed data, so
			refreshScroller();
	 	}

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
				group_id: $scope.groupConfigData.summary.group_id
			};

		 	var options = {
				params: 			params,
				successCallBack: 	successCallBackOfFetchRoomingDetails,	   
			};
			$scope.callAPI (rvGroupConfigurationSrv.getRoomTypesConfiguredAgainstGroup, options);		 	
		};

		/**
		 * when a tab switch is there, parant controller will propogate
		 * API, we will get this event, we are using this to fetch new room block deails		 
		 */
		$scope.$on("GROUP_TAB_SWITCHED", function(event, activeTab){
			console.log (activeTab);
			if (activeTab !== 'ROOMING') return;
			$scope.fetchRoomingDetails();
		});
		
		/**
		 * [initializeVariables description]
		 * @return {[type]} [description]
		 */
		var initializeVariables = function(){
			$scope.roomTypesAndData = [];
		};

		/**
		 * Function to initialise room block details
		 * @return - None
		 */
		var initializeMe = function() {
			BaseCtrl.call(this, $scope);

			//updating the left side menu
			$scope.$emit("updateRoverLeftMenu", "menuCreateGroup");

			//IF you are looking for where the hell the API is CALLING
			//scroll above, and look for the event 'GROUP_TAB_SWITCHED'

			//setting scrollers
			//setScroller();

			//we have a list of scope varibales which we wanted to initialize
			initializeVariables();

		}();		
	}]);