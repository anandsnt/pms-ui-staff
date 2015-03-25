sntRover.controller('rvGroupAddRoomsAndRatesPopupCtrl',	[
	'$scope',
	'$rootScope',
	'$filter',
	'rvPermissionSrv',
	'ngDialog',
	'$timeout',
	function($scope,
			$rootScope,
			$filter,
			rvPermissionSrv,
			ngDialog,
			$timeout) {

		
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
			$scope.selectedRoomTypeAndRates = [];
			$scope.selectedRoomTypeAndRates.push ($scope.defaultRoomTypeDetails);
		}();

		/**
		 * [shouldShowAddNewButton description]
		 * @return {[type]} [description]
		 */
		$scope.shouldShowAddNewButton = function(){
			return true;
		};

		/**
		 * [shouldShowAddNewButton description]
		 * @return {[type]} [description]
		 */
		$scope.shouldShowDeleteButton = function(){
			return ($scope.selectedRoomTypeAndRates.length > 2);
		};

		/**
		 * to Add a new Room Type & Rates row
		 * @return undefined
		 */
		$scope.addNewRoomTypeAndRatesRow = function(){
			$scope.selectedRoomTypeAndRates.push ($scope.defaultRoomTypeDetails);
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
	            	scroller.scrollTo(scroller.maxScrollX, 
	                   scroller.maxScrollY, 500);				
				}
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

	}]);