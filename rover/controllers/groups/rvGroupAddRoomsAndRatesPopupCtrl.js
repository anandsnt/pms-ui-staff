sntRover.controller('rvGroupAddRoomsAndRatesPopupCtrl',	[
	'$scope',
	'$rootScope',
	'$filter',
	'rvPermissionSrv',
	'ngDialog',
	'$timeout',
	'rvUtilSrv',
	function($scope,
			$rootScope,
			$filter,
			rvPermissionSrv,
			ngDialog,
			$timeout,
			util) {



		/**
		 * we have to form a object with roomtype and best available rate (BAR)
		 * since in response, BAR is date wise and we have to get min. among them
		 * key will be roomtype and value will be BAR (best available rate)
		 * @return {undefined}
		 */
		var formBestAvailableRateAgainstRoomType = function(){
			var roomTypeListInEachDay = _.pluck($scope.availabilityAndBAR, "room_types");

			//_.each (roomTypeListInEachDay, );
				
		};

		/**
		 * to initialize rooms & rates popup
		 * @return undefined
		 */
		var initializeMe = function(){
			BaseCtrl.call(this, $scope);
			
			//setting the scroller
			$scope.setScroller ('room_type_scroller');

			//default blank selected room type details
			$scope.defaultRoomTypeDetails = {
				'selectedRoomType' 		: '',
				'bestAvailableRate'		: '',
				'singleOccupancyRate'	: '',
				'doubleOccupancyRate'	: '',
				'oneMoreAdultRate' 		: ''
			};

			//selected room types & its rates
			$scope.selectedRoomTypeAndRates = util.deepCopy ($scope.groupConfigData.summary.selected_room_types_rates);

			//if Response coming from API is a blank array
			if ($scope.selectedRoomTypeAndRates.length == 0){
				$scope.selectedRoomTypeAndRates.push (util.deepCopy ($scope.defaultRoomTypeDetails) );
			}

			//form best available rate dictionary
			formBestAvailableRateAgainstRoomType ();
		}();

		/**
		 * [shouldShowAddNewButton description]
		 * @param  {Object} 	obj - room type & rate details
		 * @return {Boolean} 
		 */
		$scope.shouldShowAddNewButton = function(obj){
			return (!util.isEmpty(obj.selectedRoomType));
		};

		/**
		 * [shouldShowAddNewButton description]
		 * @return {[type]} [description]
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

		/**
		 * [clickedOnUpdateButton description]
		 * @return {[type]} [description]
		 */
		$scope.clickedOnUpdateButton = function() {
			//we only want rows who have room type choosed
			var selectedRoomTypeAndRates = _.filter($scope.selectedRoomTypeAndRates, function(obj){
				return !util.isEmpty(obj.selectedRoomType);
			});

			$scope.updateRoomBlockDetails (selectedRoomTypeAndRates);
			$scope.showRoomBlockDetails ();
			$scope.closeDialog();
		};

	}]);