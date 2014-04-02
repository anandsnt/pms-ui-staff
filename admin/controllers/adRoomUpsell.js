admin.controller('ADRoomUpsellCtrl', ['$scope', '$rootScope', '$state', 'adRoomUpsellService',
function($scope, $rootScope, $state, adRoomUpsellService) {

	BaseCtrl.call(this, $scope);
	$scope.upsellData = {};

	/**
	 * To fetch upsell details
	 *
	 */
	$scope.fetchUpsellDetails = function() {
		var fetchRoomUpsellDetailsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.upsellData = data;
			$scope.levelOne = $scope.upsellData.upsell_room_levels[0].room_types;
			$scope.levelTwo = $scope.upsellData.upsell_room_levels[1].room_types;
			$scope.levelThree = $scope.upsellData.upsell_room_levels[2].room_types;
			$scope.currency_code = getCurrencySign($scope.upsellData.upsell_setup.currency_code);

		};
		$scope.invokeApi(adRoomUpsellService.fetch, {}, fetchRoomUpsellDetailsSuccessCallback);
	};

	$scope.fetchUpsellDetails();

	/**
	 * To handle drop success event
	 *
	 */
	$scope.dropSuccessHandler = function($event, index, array) {
		array.splice(index, 1);
	};
	/**
	 * To handle on drop event
	 *
	 */

	$scope.onDrop = function($event, $data, array) {
		
		array.push($data);
	};

	/**
	 * To handle switch 
	 *
	 */

	$scope.switchClicked = function() {

		$scope.upsellData.upsell_setup.is_upsell_on = ($scope.upsellData.upsell_setup.is_upsell_on === 'true') ? 'false' : 'true';

	};
	/**
	 * To handle checkbox action 
	 *
	 */

	$scope.oneNightcheckBoxClicked = function() {

		$scope.upsellData.upsell_setup.is_one_night_only = ($scope.upsellData.upsell_setup.is_one_night_only === 'true') ? 'false' : 'true';

	};
	/**
	 * To handle checkbox action 
	 *
	 */

	$scope.forceUpsellcheckBoxClicked = function() {

		$scope.upsellData.upsell_setup.is_force_upsell = ($scope.upsellData.upsell_setup.is_force_upsell === 'true') ? 'false' : 'true';

	};

	/**
	 * To handle cancel button action
	 *
	 */

	$scope.cancelClick = function() {

		$state.go('admin.dashboard', {
			menu : 2
		});

	};
	/**
	 * To handle save button action
	 *
	 */

	$scope.saveClick = function() {

  	 var upsell_setup = {};
  	 var data = {};
  	 
  	 upsell_setup.is_force_upsell = $scope.upsellData.upsell_setup.is_force_upsell;
  	 upsell_setup.is_one_night_only = $scope.upsellData.upsell_setup.is_one_night_only;
  	 upsell_setup.is_upsell_on = $scope.upsellData.upsell_setup.is_upsell_on;
  	 upsell_setup.total_upsell_target_amount = $scope.upsellData.upsell_setup.total_upsell_target_amount;
  	 upsell_setup.total_upsell_target_rooms = $scope.upsellData.upsell_setup.total_upsell_target_rooms;

  	 data.upsell_setup = upsell_setup;
  	
  	 data.upsell_amounts = $scope.upsellData.upsell_amounts;
     data.charge_code = $scope.upsellData.selected_charge_code
  	 data.upsell_room_levels = $scope.upsellData.upsell_room_levels;
		
		var updateChainSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(adRoomUpsellService.update, data, updateChainSuccessCallback);

	};

}]); 