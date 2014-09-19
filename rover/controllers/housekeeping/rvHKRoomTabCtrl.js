sntRover.controller('RVHKRoomTabCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'RVHkRoomDetailsSrv',
	'$filter',
	function($scope, $rootScope, $state, $stateParams, RVHkRoomDetailsSrv, $filter) {

		BaseCtrl.call(this, $scope);

		// oo/os save request param object
		$scope.roomServices = { room_id: $stateParams.id };

		// original room status when user opened room tab
		// var originalStatusId = rooms[$stateParams.id].room_reservation_hk_status;
		var originalStatusId = 3;

		// hope so
		var inServiceId = 1;

		// by default room is in service
		$scope.inService = true;

		// by default dont show the form
		$scope.showForm = false;

		// fetch room service status list
		$scope.roomServiceStatusList = [];
		var rsslCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.roomServiceStatusList = data;

			var item = _.find($scope.roomServiceStatusList, function(item){
				return item.id == originalStatusId;
			});

			// set the default value for server status in dropdown
			$scope.roomServices.room_service_status_id = originalStatusId;

			// find and update ooOsTitle
			$scope.ooOsTitle = item.description;

			// check if room in service
			$scope.inService = $scope.roomServices.room_service_status_id != inServiceId ? false : true;
		};
		$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomServiceStatusList, {}, rsslCallback);

		// fetch maintenance reasons list
		$scope.maintenanceReasonsList = [];
		var mrlCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.maintenanceReasonsList = data;
		};
		$scope.invokeApi(RVHkRoomDetailsSrv.fetchMaintenanceReasonsList, {}, mrlCallback);



		// set the default dates for from date
		$scope.roomServices.from_date = $filter( 'date' )( tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd' );
		
		// set the default dates for to date
		$scope.roomServices.to_date = $filter( 'date' )( tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd' );

		$scope.formDateChanged = function() {
			$scope.roomServices.to_date = $filter( 'date' )( tzIndependentDate($scope.roomServices.from_date), 'yyyy-MM-dd' );
		};

		// from date options for date picker
		$scope.fromDateOptions = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			minDate: tzIndependentDate( $rootScope.businessDate ),
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div');
				$('<div id="ui-datepicker-overlay" class="transparent">').insertAfter('#ui-datepicker-div');
			},
			onClose: function(dateText, inst) {
				$('#ui-datepicker-div');
				$('#ui-datepicker-overlay').remove();
			}
		};
		
		// to date options for date picker
		$scope.getToDateOptions = function(item) {
		    return {
		        dateFormat: $rootScope.jqDateFormat,
		        numberOfMonths: 1,
		        changeYear: true,
		        changeMonth: true,
		        minDate: tzIndependentDate( $scope.roomServices.from_date )
		    }
		};


		// when the user try to change the server status in dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.roomServiceStatusList, function(item){
				return item.id == $scope.roomServices.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.roomServices.room_service_status_id != inServiceId ? false : true;

			// show form only for the other OO or OS
			// eg: if original status was OO them show form only when user choose OS
			$scope.showForm = false;
			if ( !$scope.inService ) {
				$scope.showForm = $scope.roomServices.room_service_status_id != originalStatusId ? true : false;
			};
		};

		// when user try to save a oo/os form
		$scope.submit = function() {
			var callback = function(data) {
				$scope.$emit('hideLoader');

				// form submitted, so hide it
				$scope.showForm = false;

				// room is defnetly not in service
				$scope.inService = false;

				// change the original status
				originalStatusId = $scope.roomServices.room_service_status_id;

				// reset dates and reason and comment
				$scope.roomServices.from_date = $filter( 'date' )( tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd' );
				$scope.roomServices.to_date = $filter( 'date' )( tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd' );
				$scope.roomServices.reason_id = '';
				$scope.roomServices.comment = '';
			};
			$scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, $scope.roomServices, callback);
		};
	}
]);