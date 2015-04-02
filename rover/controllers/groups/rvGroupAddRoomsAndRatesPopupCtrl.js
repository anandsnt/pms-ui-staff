sntRover.controller('rvGroupAddRoomsAndRatesPopupCtrl',	[
	'$scope',
	'$rootScope',
	'$filter',
	'rvPermissionSrv',
	'ngDialog',
	'$timeout',
	'rvUtilSrv',
	'rvGroupConfigurationSrv',
	function($scope,
			$rootScope,
			$filter,
			rvPermissionSrv,
			ngDialog,
			$timeout,
			util,
			rvGroupConfigurationSrv) {


		/**
		 * to initialize rooms & rates popup
		 * @return undefined
		 */
		var initializeMe = function(){
			BaseCtrl.call(this, $scope);
			
			//setting the scroller
			$scope.setScroller ('room_type_scroller');
			
			
			$scope.defaultRoomTypeDetails = {
				"best_available_rate"	: '',
	            "single_rate"			: '',
	            "double_rate"			: '',
	            "extra_adult_rate"		: ''
			};

			//selected room types & its rates
			$scope.selectedRoomTypeAndRates = util.deepCopy ($scope.groupConfigData.summary.selected_room_types_rates);
			
			var wanted_keys = ["room_type_id", "room_type_name", "best_available_rate"];
			$scope.roomTypes = util.getListOfKeyValuesFromAnArray ($scope.selectedRoomTypeAndRates, wanted_keys);

			//we only showing if associated with that group
			$scope.selectedRoomTypeAndRates = _.where($scope.selectedRoomTypeAndRates, 
											{is_configured_in_group: true});
			//if nothing is configured, we have to add a new row
			if ($scope.selectedRoomTypeAndRates.length == 0){
				$scope.selectedRoomTypeAndRates = [];
				$scope.selectedRoomTypeAndRates.push (util.deepCopy ($scope.groupConfigData.summary.selected_room_types_rates[0]));
			}
			 
			
			
			
			

		}();

		/**
		 * [getBestAvailableRate description]
		 * @param  {[type]} room_type_id [description]
		 * @return {[type]}              [description]
		 */
		$scope.changeBestAvailableRate = function(row){
			var roomType = _.findWhere($scope.roomTypes, {"room_type_id": parseInt(row.room_type_id)});
			if(roomType){
				row.best_available_rate = roomType.best_available_rate;
			}
			else{
				row.best_available_rate = "";
			}
		};

		/**
		 * Wnated to show add new button against a row
		 * @param  {Object} 	obj - room type & rate details
		 * @return {Boolean} 
		 */
		$scope.shouldShowAddNewButton = function(obj){
			return (!util.isEmpty(obj.room_type_id));
		};

		/**
		 * Wanetd to show delete button
		 * @return {Boolean}
		 */
		$scope.shouldShowDeleteButton = function(){
			return ($scope.selectedRoomTypeAndRates.length >= 2);
		};

		/**
		 * to Add a new Room Type & Rates row
		 * @return undefined
		 */
		$scope.addNewRoomTypeAndRatesRow = function(){
			$scope.selectedRoomTypeAndRates.push (util.deepCopy ($scope.defaultRoomTypeDetails));
			//refreshing the scroller
			$scope.refreshScroller ('room_type_scroller');
			scrollToEnd();
		};

		/**
		 * utility function to scroll to end
		 * @return undefined
		 */
		var scrollToEnd = function(){
			var scroller = $scope.$parent.myScroll['room_type_scroller'];
			$timeout(function(){
	            scroller.scrollTo(scroller.maxScrollX, scroller.maxScrollY, 500);				
			}, 300);

		};

		/**
		 * to delete Room Type & Rates row
		 * @return undefined
		 */
		$scope.deleteRoomTypeAndRatesRow = function($index){
			$scope.selectedRoomTypeAndRates.splice ($index, 1);
			//refreshing the scroller
			$scope.refreshScroller ('room_type_scroller');			
		};

		/**
		 * to close the popup
		 * @return undefined
		 */
		$scope.clickedOnCancelButton = function() {
			$scope.closeDialog();
		};

		var successCallBackOfSaveNewRoomTypesAndRates = function(data){
			/*$scope.updateRoomBlockDetails (selectedRoomTypeAndRates);
			$scope.showRoomBlockDetails ();*/
			$scope.closeDialog();
		};

		/**
		 * function to form save roomtype and rates API params
		 * @return {Object}
		 */
		var formSaveNewRoomTypesAndRatesParams = function(){
			//we only want rows who have room type choosed
			var selectedRoomTypeAndRates = _.filter($scope.selectedRoomTypeAndRates, function(obj){
				return (typeof obj.room_type_id !== "undefined" && obj.room_type_id != '');
			});
			//since selectedRoomTypeAndRates containst some unwanted keys
			var wanted_keys = ["room_type_id", "single_rate", "double_rate", "extra_adult_rate"];
			selectedRoomTypeAndRates = util.getListOfKeyValuesFromAnArray (selectedRoomTypeAndRates, wanted_keys);

			var params = {
				group_id: 				$scope.groupConfigData.summary.group_id,
				room_type_and_rates: 	selectedRoomTypeAndRates
			};

			return params;
		};

		/**
		 * to Save New room types and rates
		 * @return undefined
		 */
		$scope.saveNewRoomTypesAndRates = function(){
			var options = {
				params: 			formSaveNewRoomTypesAndRatesParams(),
				successCallBack: 	successCallBackOfSaveNewRoomTypesAndRates,	   
			};

			$scope.callAPI (rvGroupConfigurationSrv.updateSelectedRoomTypesAndRates, options);
		};

	}]);