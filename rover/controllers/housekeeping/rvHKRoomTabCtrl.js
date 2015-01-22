sntRover.controller('RVHKRoomTabCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'$filter',
	'RVHkRoomDetailsSrv',
	'ngDialog',
	function(
		$scope,
		$rootScope,
		$state,
		$stateParams,
		$filter,
		RVHkRoomDetailsSrv,
		ngDialog
	) {
		BaseCtrl.call(this, $scope);

		// scroll
		$scope.setScroller('room-tab-scroll', {
			click: true,
			preventDefault: false
		});



		/* ***** ***** ***** ***** ***** */



		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// low level method to update the top bar color
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;

		// original room status when user opened room tab
		var $_originalStatusId = $scope.roomDetails.room_reservation_hk_status;

		// in service id, copy paste from server; what if it changes in future?
		var $_inServiceId = 1;

		// by default lets assume room is in service
		$scope.inService = true;

		// by default dont show the form
		$scope.showForm = false;

		// by default dont show the details (disabled) form
		$scope.showSaved = false;

		// list of all posible service statuses
		$scope.allServiceStatus = [];

		// list of all possible maintainace reasons
		$scope.maintenanceReasonsList = [];

		// param: update the new oo/os status
		// $scope.updateService.room_service_status_id serves as the model for the top dropdown
		$scope.updateService = {
			room_id: $scope.roomDetails.id,
			from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			selected_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			room_service_status_id: $_originalStatusId
		};

		// captures the oo/os status details in this
		$scope.editService = {};

		//CICO-12520
		/**
		 * This object would contain the service status of the room in the view 
		 * @type {Object}
		 */
		$scope.service_status = {}



		/* ***** ***** ***** ***** ***** */



		// fetch callback of saved oo/os details
		function $_fetchSavedStausCallback(data) {
			$scope.$emit('hideLoader');

			/***
			 *	Sadly the fetch for server API has
			 *	different key names, so we cant just assign the data
			 *
			 *	we need to map the key from data to
			 *	out 'editService' object
			 */
			$scope.editService.selected_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.from_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.to_date = $filter('date')(tzIndependentDate(data.to_date), 'yyyy-MM-dd');
			$scope.editService.reason_id = data.maintenance_reason_id;
			$scope.editService.comment = data.comments;

			$scope.showForm = false;
			$scope.showSaved = true;

			$scope.refreshScroller('room-tab-scroll');
		};

		// fetch callback of all service status
		function $_allServiceStatusCallback(data) {
			$scope.$emit('hideLoader');
			$scope.allServiceStatus = data;

			// find and update ooOsTitle
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $_originalStatusId;
			});
			$scope.ooOsTitle = item.description;

			// check and update if room in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// if not in service, go fetch the oo/os saved details
			if (!$scope.inService) {
				$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
					roomId: $scope.roomDetails.id
				}, $_fetchSavedStausCallback);
			} else {
				$scope.refreshScroller('room-tab-scroll');
			};
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchAllServiceStatus, {}, $_allServiceStatusCallback);

		// fetch callback of maintenance reasons
		function $_maintenanceReasonsCallback(data) {
			$scope.$emit('hideLoader');
			$scope.maintenanceReasonsList = data;
			$scope.refreshScroller('room-tab-scroll');
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchMaintenanceReasons, {}, $_maintenanceReasonsCallback);

		// when user changes the room status from top dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// show update form only when the user chooses a status that is not update yet
			// eg: if original status was OO them show form only when user choose OS
			if (!$scope.inService) {
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
					// show the update form
					$scope.showForm = true;
					$scope.showSaved = false;

					// reset dates and reason and comment
					$scope.updateStatus = {
						from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						reason_id: '',
						comment: ''
					};
				} else {

					// fetch and show the saved details
					$scope.showForm = false;
					$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
						roomId: $scope.roomDetails.id
					}, $_fetchSavedStausCallback);
				}
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;

				$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;

				var _params = {
					roomId: $scope.roomDetails.id,
					inServiceID: 1
				};

				var _callback = function() {
					$scope.$emit('hideLoader');
					$scope.showSaved = false;

					// change the original status
					$_originalStatusId = $scope.updateService.room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', 1);
				};

				// only "put" in service if original status was not inService
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.invokeApi(RVHkRoomDetailsSrv.putRoomInService, _params, _callback);
				}
			};

			$scope.refreshScroller('room-tab-scroll');
		};



		/* ***** ***** ***** ***** ***** */



		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation hide-arrow');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

				setTimeout(function() {
					$('body').find('#ui-datepicker-overlay')
						.on('click', function() {
							console.log('hey clicked');
							$('#room-out-from').blur();
							$('#room-out-to').blur();
						});
				}, 100);
			},
			onClose: function(value) {
				$('#ui-datepicker-div').removeClass('reservation hide-arrow');
				$('#ui-datepicker-overlay').off('click').remove();
			}
		};

		$scope.fromDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
				$scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.updateService.from_date), $rootScope.dateFormat);
			},
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);

		$scope.untilDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);



		/* ***** ***** ***** ***** ***** */



		$scope.update = function() {
			var _error = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				if ($scope.$parent.myScroll['room-tab-scroll'] && $scope.$parent.myScroll['room-tab-scroll'].scrollTo)
					$scope.$parent.myScroll['room-tab-scroll'].scrollTo(0, 0);
				$scope.refreshScroller('room-tab-scroll');
			};

			var _callback = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = '';

				// form submitted, so hide it
				$scope.showForm = false;

				// room is defnetly not in service
				$scope.inService = false;

				// change the original status and update the 'room_reservation_hk_status' in parent
				$_originalStatusId = $scope.updateService.room_service_status_id;

				// copy update details to edit details, show details
				_.extend($scope.editService, $scope.updateService);
				$scope.showSaved = true;

				// reset dates and reason and comment
				$scope.updateStatus = {
					room_id: $scope.roomDetails.id,
					from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
				};
			};

			// update the dates to backend system format
			$scope.updateService.from_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
			$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.to_date), 'yyyy-MM-dd');

			// POST or PUT (read service to understand better)
			if ($_originalStatusId === $_inServiceId) {
				$scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, $scope.updateService, _callback, _error);
			} else {
				$scope.invokeApi(RVHkRoomDetailsSrv.putRoomServiceStatus, $scope.updateService, _callback, _error);
			}
		};

		$scope.edit = function() {
			$scope.showForm = true;
			$scope.showSaved = false;

			_.extend($scope.updateService, $scope.editService);

			$scope.editStatus = {
				room_id: $scope.roomDetails.id,
				from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
			};
		};

		$scope.showCalendar = function(controller) {
			var params = {};

			function onFetchSuccess(data) {
				console.log(data);
				ngDialog.open({
					template: '/assets/partials/housekeeping/rvHkServiceStatusDateSelector.html',
					controller: controller,
					className: 'ngdialog-theme-default single-date-picker',
					closeByDocument: true,
					scope: $scope
				});
				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, params, onFetchSuccess, onFetchFailure);

		}

		$scope.onViewDateChanged = function() {
			console.log('DatePicked');
		}
		BaseCtrl.call(this, $scope);

		// scroll
		$scope.setScroller('room-tab-scroll', {
			click: true,
			preventDefault: false
		});



		/* ***** ***** ***** ***** ***** */



		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// low level method to update the top bar color
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;

		// original room status when user opened room tab
		var $_originalStatusId = $scope.roomDetails.room_reservation_hk_status;

		// in service id, copy paste from server; what if it changes in future?
		var $_inServiceId = 1;

		// by default lets assume room is in service
		$scope.inService = true;

		// by default dont show the form
		$scope.showForm = false;

		// by default dont show the details (disabled) form
		$scope.showSaved = false;

		// list of all posible service statuses
		$scope.allServiceStatus = [];

		// list of all possible maintainace reasons
		$scope.maintenanceReasonsList = [];

		// param: update the new oo/os status
		// $scope.updateService.room_service_status_id serves as the model for the top dropdown
		$scope.updateService = {
			room_id: $scope.roomDetails.id,
			from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			selected_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			room_service_status_id: $_originalStatusId
		};

		// captures the oo/os status details in this
		$scope.editService = {};

		//CICO-12520
		$scope.service_status = {}



		/* ***** ***** ***** ***** ***** */



		// fetch callback of saved oo/os details
		function $_fetchSavedStausCallback(data) {
			$scope.$emit('hideLoader');

			/***
			 *	Sadly the fetch for server API has
			 *	different key names, so we cant just assign the data
			 *
			 *	we need to map the key from data to
			 *	out 'editService' object
			 */
			$scope.editService.selected_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.from_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.to_date = $filter('date')(tzIndependentDate(data.to_date), 'yyyy-MM-dd');
			$scope.editService.reason_id = data.maintenance_reason_id;
			$scope.editService.comment = data.comments;

			$scope.showForm = false;
			$scope.showSaved = true;

			$scope.refreshScroller('room-tab-scroll');
		};

		// fetch callback of all service status
		function $_allServiceStatusCallback(data) {
			$scope.$emit('hideLoader');
			$scope.allServiceStatus = data;

			// find and update ooOsTitle
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $_originalStatusId;
			});
			$scope.ooOsTitle = item.description;

			// check and update if room in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// if not in service, go fetch the oo/os saved details
			if (!$scope.inService) {
				$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
					roomId: $scope.roomDetails.id
				}, $_fetchSavedStausCallback);
			} else {
				$scope.refreshScroller('room-tab-scroll');
			};
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchAllServiceStatus, {}, $_allServiceStatusCallback);

		// fetch callback of maintenance reasons
		function $_maintenanceReasonsCallback(data) {
			$scope.$emit('hideLoader');
			$scope.maintenanceReasonsList = data;
			$scope.refreshScroller('room-tab-scroll');
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchMaintenanceReasons, {}, $_maintenanceReasonsCallback);

		// when user changes the room status from top dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// show update form only when the user chooses a status that is not update yet
			// eg: if original status was OO them show form only when user choose OS
			if (!$scope.inService) {
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
					// show the update form
					$scope.showForm = true;
					$scope.showSaved = false;

					// reset dates and reason and comment
					$scope.updateStatus = {
						from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						reason_id: '',
						comment: ''
					};
				} else {

					// fetch and show the saved details
					$scope.showForm = false;
					$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
						roomId: $scope.roomDetails.id
					}, $_fetchSavedStausCallback);
				}
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;

				$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;

				var _params = {
					roomId: $scope.roomDetails.id,
					inServiceID: 1
				};

				var _callback = function() {
					$scope.$emit('hideLoader');
					$scope.showSaved = false;

					// change the original status
					$_originalStatusId = $scope.updateService.room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', 1);
				};

				// only "put" in service if original status was not inService
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.invokeApi(RVHkRoomDetailsSrv.putRoomInService, _params, _callback);
				}
			};

			$scope.refreshScroller('room-tab-scroll');
		};



		/* ***** ***** ***** ***** ***** */



		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation hide-arrow');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

				setTimeout(function() {
					$('body').find('#ui-datepicker-overlay')
						.on('click', function() {
							console.log('hey clicked');
							$('#room-out-from').blur();
							$('#room-out-to').blur();
						});
				}, 100);
			},
			onClose: function(value) {
				$('#ui-datepicker-div').removeClass('reservation hide-arrow');
				$('#ui-datepicker-overlay').off('click').remove();
			}
		};

		$scope.fromDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
				$scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.updateService.from_date), $rootScope.dateFormat);
			},
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);

		$scope.untilDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);



		/* ***** ***** ***** ***** ***** */



		$scope.update = function() {
			var _error = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				if ($scope.$parent.myScroll['room-tab-scroll'] && $scope.$parent.myScroll['room-tab-scroll'].scrollTo)
					$scope.$parent.myScroll['room-tab-scroll'].scrollTo(0, 0);
				$scope.refreshScroller('room-tab-scroll');
			};

			var _callback = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = '';

				// form submitted, so hide it
				$scope.showForm = false;

				// room is defnetly not in service
				$scope.inService = false;

				// change the original status and update the 'room_reservation_hk_status' in parent
				$_originalStatusId = $scope.updateService.room_service_status_id;

				// copy update details to edit details, show details
				_.extend($scope.editService, $scope.updateService);
				$scope.showSaved = true;

				// reset dates and reason and comment
				$scope.updateStatus = {
					room_id: $scope.roomDetails.id,
					from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
				};
			};

			// update the dates to backend system format
			$scope.updateService.from_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
			$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.to_date), 'yyyy-MM-dd');

			// POST or PUT (read service to understand better)
			if ($_originalStatusId === $_inServiceId) {
				$scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, $scope.updateService, _callback, _error);
			} else {
				$scope.invokeApi(RVHkRoomDetailsSrv.putRoomServiceStatus, $scope.updateService, _callback, _error);
			}
		};

		$scope.edit = function() {
			$scope.showForm = true;
			$scope.showSaved = false;

			_.extend($scope.updateService, $scope.editService);

			$scope.editStatus = {
				room_id: $scope.roomDetails.id,
				from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
			};
		};

		$scope.showCalendar = function(controller) {
			var params = {};

			function onFetchSuccess(data) {
				console.log(data);
				ngDialog.open({
					template: '/assets/partials/housekeeping/rvHkServiceStatusDateSelector.html',
					controller: controller,
					className: 'ngdialog-theme-default single-date-picker',
					closeByDocument: true,
					scope: $scope
				});
				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, params, onFetchSuccess, onFetchFailure);

		}

		$scope.onViewDateChanged = function() {
			console.log('DatePicked');
		}
		BaseCtrl.call(this, $scope);

		// scroll
		$scope.setScroller('room-tab-scroll', {
			click: true,
			preventDefault: false
		});



		/* ***** ***** ***** ***** ***** */



		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// low level method to update the top bar color
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;

		// original room status when user opened room tab
		var $_originalStatusId = $scope.roomDetails.room_reservation_hk_status;

		// in service id, copy paste from server; what if it changes in future?
		var $_inServiceId = 1;

		// by default lets assume room is in service
		$scope.inService = true;

		// by default dont show the form
		$scope.showForm = false;

		// by default dont show the details (disabled) form
		$scope.showSaved = false;

		// list of all posible service statuses
		$scope.allServiceStatus = [];

		// list of all possible maintainace reasons
		$scope.maintenanceReasonsList = [];

		// param: update the new oo/os status
		// $scope.updateService.room_service_status_id serves as the model for the top dropdown
		$scope.updateService = {
			room_id: $scope.roomDetails.id,
			from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			selected_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			room_service_status_id: $_originalStatusId
		};

		// captures the oo/os status details in this
		$scope.editService = {};

		//CICO-12520
		$scope.service_status = {}



		/* ***** ***** ***** ***** ***** */



		// fetch callback of saved oo/os details
		function $_fetchSavedStausCallback(data) {
			$scope.$emit('hideLoader');

			/***
			 *	Sadly the fetch for server API has
			 *	different key names, so we cant just assign the data
			 *
			 *	we need to map the key from data to
			 *	out 'editService' object
			 */
			$scope.editService.selected_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.from_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.to_date = $filter('date')(tzIndependentDate(data.to_date), 'yyyy-MM-dd');
			$scope.editService.reason_id = data.maintenance_reason_id;
			$scope.editService.comment = data.comments;

			$scope.showForm = false;
			$scope.showSaved = true;

			$scope.refreshScroller('room-tab-scroll');
		};

		// fetch callback of all service status
		function $_allServiceStatusCallback(data) {
			$scope.$emit('hideLoader');
			$scope.allServiceStatus = data;

			// find and update ooOsTitle
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $_originalStatusId;
			});
			$scope.ooOsTitle = item.description;

			// check and update if room in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// if not in service, go fetch the oo/os saved details
			if (!$scope.inService) {
				$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
					roomId: $scope.roomDetails.id
				}, $_fetchSavedStausCallback);
			} else {
				$scope.refreshScroller('room-tab-scroll');
			};
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchAllServiceStatus, {}, $_allServiceStatusCallback);

		// fetch callback of maintenance reasons
		function $_maintenanceReasonsCallback(data) {
			$scope.$emit('hideLoader');
			$scope.maintenanceReasonsList = data;
			$scope.refreshScroller('room-tab-scroll');
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchMaintenanceReasons, {}, $_maintenanceReasonsCallback);

		// when user changes the room status from top dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// show update form only when the user chooses a status that is not update yet
			// eg: if original status was OO them show form only when user choose OS
			if (!$scope.inService) {
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
					// show the update form
					$scope.showForm = true;
					$scope.showSaved = false;

					// reset dates and reason and comment
					$scope.updateStatus = {
						from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						reason_id: '',
						comment: ''
					};
				} else {

					// fetch and show the saved details
					$scope.showForm = false;
					$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
						roomId: $scope.roomDetails.id
					}, $_fetchSavedStausCallback);
				}
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;

				$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;

				var _params = {
					roomId: $scope.roomDetails.id,
					inServiceID: 1
				};

				var _callback = function() {
					$scope.$emit('hideLoader');
					$scope.showSaved = false;

					// change the original status
					$_originalStatusId = $scope.updateService.room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', 1);
				};

				// only "put" in service if original status was not inService
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.invokeApi(RVHkRoomDetailsSrv.putRoomInService, _params, _callback);
				}
			};

			$scope.refreshScroller('room-tab-scroll');
		};



		/* ***** ***** ***** ***** ***** */



		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation hide-arrow');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

				setTimeout(function() {
					$('body').find('#ui-datepicker-overlay')
						.on('click', function() {
							console.log('hey clicked');
							$('#room-out-from').blur();
							$('#room-out-to').blur();
						});
				}, 100);
			},
			onClose: function(value) {
				$('#ui-datepicker-div').removeClass('reservation hide-arrow');
				$('#ui-datepicker-overlay').off('click').remove();
			}
		};

		$scope.fromDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
				$scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.updateService.from_date), $rootScope.dateFormat);
			},
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);

		$scope.untilDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);



		/* ***** ***** ***** ***** ***** */



		$scope.update = function() {
			var _error = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				if ($scope.$parent.myScroll['room-tab-scroll'] && $scope.$parent.myScroll['room-tab-scroll'].scrollTo)
					$scope.$parent.myScroll['room-tab-scroll'].scrollTo(0, 0);
				$scope.refreshScroller('room-tab-scroll');
			};

			var _callback = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = '';

				// form submitted, so hide it
				$scope.showForm = false;

				// room is defnetly not in service
				$scope.inService = false;

				// change the original status and update the 'room_reservation_hk_status' in parent
				$_originalStatusId = $scope.updateService.room_service_status_id;

				// copy update details to edit details, show details
				_.extend($scope.editService, $scope.updateService);
				$scope.showSaved = true;

				// reset dates and reason and comment
				$scope.updateStatus = {
					room_id: $scope.roomDetails.id,
					from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
				};
			};

			// update the dates to backend system format
			$scope.updateService.from_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
			$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.to_date), 'yyyy-MM-dd');

			// POST or PUT (read service to understand better)
			if ($_originalStatusId === $_inServiceId) {
				$scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, $scope.updateService, _callback, _error);
			} else {
				$scope.invokeApi(RVHkRoomDetailsSrv.putRoomServiceStatus, $scope.updateService, _callback, _error);
			}
		};

		$scope.edit = function() {
			$scope.showForm = true;
			$scope.showSaved = false;

			_.extend($scope.updateService, $scope.editService);

			$scope.editStatus = {
				room_id: $scope.roomDetails.id,
				from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
			};
		};

		$scope.showCalendar = function(controller) {
			var params = {};

			function onFetchSuccess(data) {
				console.log(data);
				ngDialog.open({
					template: '/assets/partials/housekeeping/rvHkServiceStatusDateSelector.html',
					controller: controller,
					className: 'ngdialog-theme-default single-date-picker',
					closeByDocument: true,
					scope: $scope
				});
				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, params, onFetchSuccess, onFetchFailure);

		}

		$scope.onViewDateChanged = function() {
			console.log('DatePicked');
		}


		BaseCtrl.call(this, $scope);

		// scroll
		$scope.setScroller('room-tab-scroll', {
			click: true,
			preventDefault: false
		});



		/* ***** ***** ***** ***** ***** */



		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// low level method to update the top bar color
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;

		// original room status when user opened room tab
		var $_originalStatusId = $scope.roomDetails.room_reservation_hk_status;

		// in service id, copy paste from server; what if it changes in future?
		var $_inServiceId = 1;

		// by default lets assume room is in service
		$scope.inService = true;

		// by default dont show the form
		$scope.showForm = false;

		// by default dont show the details (disabled) form
		$scope.showSaved = false;

		// list of all posible service statuses
		$scope.allServiceStatus = [];

		// list of all possible maintainace reasons
		$scope.maintenanceReasonsList = [];

		// param: update the new oo/os status
		// $scope.updateService.room_service_status_id serves as the model for the top dropdown
		$scope.updateService = {
			room_id: $scope.roomDetails.id,
			from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			selected_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			room_service_status_id: $_originalStatusId
		};

		// captures the oo/os status details in this
		$scope.editService = {};

		//CICO-12520
		$scope.service_status = {}



		/* ***** ***** ***** ***** ***** */



		// fetch callback of saved oo/os details
		function $_fetchSavedStausCallback(data) {
			$scope.$emit('hideLoader');

			/***
			 *	Sadly the fetch for server API has
			 *	different key names, so we cant just assign the data
			 *
			 *	we need to map the key from data to
			 *	out 'editService' object
			 */
			$scope.editService.selected_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.from_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.to_date = $filter('date')(tzIndependentDate(data.to_date), 'yyyy-MM-dd');
			$scope.editService.reason_id = data.maintenance_reason_id;
			$scope.editService.comment = data.comments;

			$scope.showForm = false;
			$scope.showSaved = true;

			$scope.refreshScroller('room-tab-scroll');
		};

		// fetch callback of all service status
		function $_allServiceStatusCallback(data) {
			$scope.$emit('hideLoader');
			$scope.allServiceStatus = data;

			// find and update ooOsTitle
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $_originalStatusId;
			});
			$scope.ooOsTitle = item.description;

			// check and update if room in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// if not in service, go fetch the oo/os saved details
			if (!$scope.inService) {
				$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
					roomId: $scope.roomDetails.id
				}, $_fetchSavedStausCallback);
			} else {
				$scope.refreshScroller('room-tab-scroll');
			};
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchAllServiceStatus, {}, $_allServiceStatusCallback);

		// fetch callback of maintenance reasons
		function $_maintenanceReasonsCallback(data) {
			$scope.$emit('hideLoader');
			$scope.maintenanceReasonsList = data;
			$scope.refreshScroller('room-tab-scroll');
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchMaintenanceReasons, {}, $_maintenanceReasonsCallback);

		// when user changes the room status from top dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// show update form only when the user chooses a status that is not update yet
			// eg: if original status was OO them show form only when user choose OS
			if (!$scope.inService) {
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
					// show the update form
					$scope.showForm = true;
					$scope.showSaved = false;

					// reset dates and reason and comment
					$scope.updateStatus = {
						from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						reason_id: '',
						comment: ''
					};
				} else {

					// fetch and show the saved details
					$scope.showForm = false;
					$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
						roomId: $scope.roomDetails.id
					}, $_fetchSavedStausCallback);
				}
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;

				$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;

				var _params = {
					roomId: $scope.roomDetails.id,
					inServiceID: 1
				};

				var _callback = function() {
					$scope.$emit('hideLoader');
					$scope.showSaved = false;

					// change the original status
					$_originalStatusId = $scope.updateService.room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', 1);
				};

				// only "put" in service if original status was not inService
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.invokeApi(RVHkRoomDetailsSrv.putRoomInService, _params, _callback);
				}
			};

			$scope.refreshScroller('room-tab-scroll');
		};



		/* ***** ***** ***** ***** ***** */



		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation hide-arrow');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

				setTimeout(function() {
					$('body').find('#ui-datepicker-overlay')
						.on('click', function() {
							console.log('hey clicked');
							$('#room-out-from').blur();
							$('#room-out-to').blur();
						});
				}, 100);
			},
			onClose: function(value) {
				$('#ui-datepicker-div').removeClass('reservation hide-arrow');
				$('#ui-datepicker-overlay').off('click').remove();
			}
		};

		$scope.fromDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
				$scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.updateService.from_date), $rootScope.dateFormat);
			},
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);

		$scope.untilDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);



		/* ***** ***** ***** ***** ***** */



		$scope.update = function() {
			var _error = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				if ($scope.$parent.myScroll['room-tab-scroll'] && $scope.$parent.myScroll['room-tab-scroll'].scrollTo)
					$scope.$parent.myScroll['room-tab-scroll'].scrollTo(0, 0);
				$scope.refreshScroller('room-tab-scroll');
			};

			var _callback = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = '';

				// form submitted, so hide it
				$scope.showForm = false;

				// room is defnetly not in service
				$scope.inService = false;

				// change the original status and update the 'room_reservation_hk_status' in parent
				$_originalStatusId = $scope.updateService.room_service_status_id;

				// copy update details to edit details, show details
				_.extend($scope.editService, $scope.updateService);
				$scope.showSaved = true;

				// reset dates and reason and comment
				$scope.updateStatus = {
					room_id: $scope.roomDetails.id,
					from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
				};
			};

			// update the dates to backend system format
			$scope.updateService.from_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
			$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.to_date), 'yyyy-MM-dd');

			// POST or PUT (read service to understand better)
			if ($_originalStatusId === $_inServiceId) {
				$scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, $scope.updateService, _callback, _error);
			} else {
				$scope.invokeApi(RVHkRoomDetailsSrv.putRoomServiceStatus, $scope.updateService, _callback, _error);
			}
		};

		$scope.edit = function() {
			$scope.showForm = true;
			$scope.showSaved = false;

			_.extend($scope.updateService, $scope.editService);

			$scope.editStatus = {
				room_id: $scope.roomDetails.id,
				from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
			};
		};

		$scope.showCalendar = function(controller) {
			var params = {};

			function onFetchSuccess(data) {
				console.log(data);
				ngDialog.open({
					template: '/assets/partials/housekeeping/rvHkServiceStatusDateSelector.html',
					controller: controller,
					className: 'ngdialog-theme-default single-date-picker',
					closeByDocument: true,
					scope: $scope
				});
				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, params, onFetchSuccess, onFetchFailure);

		}

		$scope.onViewDateChanged = function() {
			console.log('DatePicked');
		}


		BaseCtrl.call(this, $scope);

		// scroll
		$scope.setScroller('room-tab-scroll', {
			click: true,
			preventDefault: false
		});



		/* ***** ***** ***** ***** ***** */



		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// low level method to update the top bar color
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;

		// original room status when user opened room tab
		var $_originalStatusId = $scope.roomDetails.room_reservation_hk_status;

		// in service id, copy paste from server; what if it changes in future?
		var $_inServiceId = 1;

		// by default lets assume room is in service
		$scope.inService = true;

		// by default dont show the form
		$scope.showForm = false;

		// by default dont show the details (disabled) form
		$scope.showSaved = false;

		// list of all posible service statuses
		$scope.allServiceStatus = [];

		// list of all possible maintainace reasons
		$scope.maintenanceReasonsList = [];

		// param: update the new oo/os status
		// $scope.updateService.room_service_status_id serves as the model for the top dropdown
		$scope.updateService = {
			room_id: $scope.roomDetails.id,
			from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			selected_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			room_service_status_id: $_originalStatusId
		};

		// captures the oo/os status details in this
		$scope.editService = {};

		//CICO-12520
		$scope.service_status = {}



		/* ***** ***** ***** ***** ***** */



		// fetch callback of saved oo/os details
		function $_fetchSavedStausCallback(data) {
			$scope.$emit('hideLoader');

			/***
			 *	Sadly the fetch for server API has
			 *	different key names, so we cant just assign the data
			 *
			 *	we need to map the key from data to
			 *	out 'editService' object
			 */
			$scope.editService.selected_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.from_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.to_date = $filter('date')(tzIndependentDate(data.to_date), 'yyyy-MM-dd');
			$scope.editService.reason_id = data.maintenance_reason_id;
			$scope.editService.comment = data.comments;

			$scope.showForm = false;
			$scope.showSaved = true;

			$scope.refreshScroller('room-tab-scroll');
		};

		// fetch callback of all service status
		function $_allServiceStatusCallback(data) {
			$scope.$emit('hideLoader');
			$scope.allServiceStatus = data;

			// find and update ooOsTitle
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $_originalStatusId;
			});
			$scope.ooOsTitle = item.description;

			// check and update if room in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// if not in service, go fetch the oo/os saved details
			if (!$scope.inService) {
				$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
					roomId: $scope.roomDetails.id
				}, $_fetchSavedStausCallback);
			} else {
				$scope.refreshScroller('room-tab-scroll');
			};
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchAllServiceStatus, {}, $_allServiceStatusCallback);

		// fetch callback of maintenance reasons
		function $_maintenanceReasonsCallback(data) {
			$scope.$emit('hideLoader');
			$scope.maintenanceReasonsList = data;
			$scope.refreshScroller('room-tab-scroll');
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchMaintenanceReasons, {}, $_maintenanceReasonsCallback);

		// when user changes the room status from top dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// show update form only when the user chooses a status that is not update yet
			// eg: if original status was OO them show form only when user choose OS
			if (!$scope.inService) {
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
					// show the update form
					$scope.showForm = true;
					$scope.showSaved = false;

					// reset dates and reason and comment
					$scope.updateStatus = {
						from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						reason_id: '',
						comment: ''
					};
				} else {

					// fetch and show the saved details
					$scope.showForm = false;
					$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
						roomId: $scope.roomDetails.id
					}, $_fetchSavedStausCallback);
				}
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;

				$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;

				var _params = {
					roomId: $scope.roomDetails.id,
					inServiceID: 1
				};

				var _callback = function() {
					$scope.$emit('hideLoader');
					$scope.showSaved = false;

					// change the original status
					$_originalStatusId = $scope.updateService.room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', 1);
				};

				// only "put" in service if original status was not inService
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.invokeApi(RVHkRoomDetailsSrv.putRoomInService, _params, _callback);
				}
			};

			$scope.refreshScroller('room-tab-scroll');
		};



		/* ***** ***** ***** ***** ***** */



		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation hide-arrow');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

				setTimeout(function() {
					$('body').find('#ui-datepicker-overlay')
						.on('click', function() {
							console.log('hey clicked');
							$('#room-out-from').blur();
							$('#room-out-to').blur();
						});
				}, 100);
			},
			onClose: function(value) {
				$('#ui-datepicker-div').removeClass('reservation hide-arrow');
				$('#ui-datepicker-overlay').off('click').remove();
			}
		};

		$scope.fromDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
				$scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.updateService.from_date), $rootScope.dateFormat);
			},
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);

		$scope.untilDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);



		/* ***** ***** ***** ***** ***** */



		$scope.update = function() {
			var _error = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				if ($scope.$parent.myScroll['room-tab-scroll'] && $scope.$parent.myScroll['room-tab-scroll'].scrollTo)
					$scope.$parent.myScroll['room-tab-scroll'].scrollTo(0, 0);
				$scope.refreshScroller('room-tab-scroll');
			};

			var _callback = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = '';

				// form submitted, so hide it
				$scope.showForm = false;

				// room is defnetly not in service
				$scope.inService = false;

				// change the original status and update the 'room_reservation_hk_status' in parent
				$_originalStatusId = $scope.updateService.room_service_status_id;

				// copy update details to edit details, show details
				_.extend($scope.editService, $scope.updateService);
				$scope.showSaved = true;

				// reset dates and reason and comment
				$scope.updateStatus = {
					room_id: $scope.roomDetails.id,
					from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
				};
			};

			// update the dates to backend system format
			$scope.updateService.from_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
			$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.to_date), 'yyyy-MM-dd');

			// POST or PUT (read service to understand better)
			if ($_originalStatusId === $_inServiceId) {
				$scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, $scope.updateService, _callback, _error);
			} else {
				$scope.invokeApi(RVHkRoomDetailsSrv.putRoomServiceStatus, $scope.updateService, _callback, _error);
			}
		};

		$scope.edit = function() {
			$scope.showForm = true;
			$scope.showSaved = false;

			_.extend($scope.updateService, $scope.editService);

			$scope.editStatus = {
				room_id: $scope.roomDetails.id,
				from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
			};
		};

		$scope.showCalendar = function(controller) {
			var params = {};

			function onFetchSuccess(data) {
				console.log(data);
				ngDialog.open({
					template: '/assets/partials/housekeeping/rvHkServiceStatusDateSelector.html',
					controller: controller,
					className: 'ngdialog-theme-default single-date-picker',
					closeByDocument: true,
					scope: $scope
				});
				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, params, onFetchSuccess, onFetchFailure);

		}

		$scope.onViewDateChanged = function() {
			console.log('DatePicked');
		}
		BaseCtrl.call(this, $scope);

		// scroll
		$scope.setScroller('room-tab-scroll', {
			click: true,
			preventDefault: false
		});



		/* ***** ***** ***** ***** ***** */



		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// low level method to update the top bar color
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;

		// original room status when user opened room tab
		var $_originalStatusId = $scope.roomDetails.room_reservation_hk_status;

		// in service id, copy paste from server; what if it changes in future?
		var $_inServiceId = 1;

		// by default lets assume room is in service
		$scope.inService = true;

		// by default dont show the form
		$scope.showForm = false;

		// by default dont show the details (disabled) form
		$scope.showSaved = false;

		// list of all posible service statuses
		$scope.allServiceStatus = [];

		// list of all possible maintainace reasons
		$scope.maintenanceReasonsList = [];

		// param: update the new oo/os status
		// $scope.updateService.room_service_status_id serves as the model for the top dropdown
		$scope.updateService = {
			room_id: $scope.roomDetails.id,
			from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			selected_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			room_service_status_id: $_originalStatusId
		};

		// captures the oo/os status details in this
		$scope.editService = {};

		//CICO-12520
		$scope.service_status = {}



		/* ***** ***** ***** ***** ***** */



		// fetch callback of saved oo/os details
		function $_fetchSavedStausCallback(data) {
			$scope.$emit('hideLoader');

			/***
			 *	Sadly the fetch for server API has
			 *	different key names, so we cant just assign the data
			 *
			 *	we need to map the key from data to
			 *	out 'editService' object
			 */
			$scope.editService.selected_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.from_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.to_date = $filter('date')(tzIndependentDate(data.to_date), 'yyyy-MM-dd');
			$scope.editService.reason_id = data.maintenance_reason_id;
			$scope.editService.comment = data.comments;

			$scope.showForm = false;
			$scope.showSaved = true;

			$scope.refreshScroller('room-tab-scroll');
		};

		// fetch callback of all service status
		function $_allServiceStatusCallback(data) {
			$scope.$emit('hideLoader');
			$scope.allServiceStatus = data;

			// find and update ooOsTitle
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $_originalStatusId;
			});
			$scope.ooOsTitle = item.description;

			// check and update if room in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// if not in service, go fetch the oo/os saved details
			if (!$scope.inService) {
				$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
					roomId: $scope.roomDetails.id
				}, $_fetchSavedStausCallback);
			} else {
				$scope.refreshScroller('room-tab-scroll');
			};
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchAllServiceStatus, {}, $_allServiceStatusCallback);

		// fetch callback of maintenance reasons
		function $_maintenanceReasonsCallback(data) {
			$scope.$emit('hideLoader');
			$scope.maintenanceReasonsList = data;
			$scope.refreshScroller('room-tab-scroll');
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchMaintenanceReasons, {}, $_maintenanceReasonsCallback);

		// when user changes the room status from top dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// show update form only when the user chooses a status that is not update yet
			// eg: if original status was OO them show form only when user choose OS
			if (!$scope.inService) {
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
					// show the update form
					$scope.showForm = true;
					$scope.showSaved = false;

					// reset dates and reason and comment
					$scope.updateStatus = {
						from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						reason_id: '',
						comment: ''
					};
				} else {

					// fetch and show the saved details
					$scope.showForm = false;
					$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
						roomId: $scope.roomDetails.id
					}, $_fetchSavedStausCallback);
				}
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;

				$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;

				var _params = {
					roomId: $scope.roomDetails.id,
					inServiceID: 1
				};

				var _callback = function() {
					$scope.$emit('hideLoader');
					$scope.showSaved = false;

					// change the original status
					$_originalStatusId = $scope.updateService.room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', 1);
				};

				// only "put" in service if original status was not inService
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.invokeApi(RVHkRoomDetailsSrv.putRoomInService, _params, _callback);
				}
			};

			$scope.refreshScroller('room-tab-scroll');
		};



		/* ***** ***** ***** ***** ***** */



		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation hide-arrow');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

				setTimeout(function() {
					$('body').find('#ui-datepicker-overlay')
						.on('click', function() {
							console.log('hey clicked');
							$('#room-out-from').blur();
							$('#room-out-to').blur();
						});
				}, 100);
			},
			onClose: function(value) {
				$('#ui-datepicker-div').removeClass('reservation hide-arrow');
				$('#ui-datepicker-overlay').off('click').remove();
			}
		};

		$scope.fromDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
				$scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.updateService.from_date), $rootScope.dateFormat);
			},
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);

		$scope.untilDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);



		/* ***** ***** ***** ***** ***** */



		$scope.update = function() {
			var _error = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				if ($scope.$parent.myScroll['room-tab-scroll'] && $scope.$parent.myScroll['room-tab-scroll'].scrollTo)
					$scope.$parent.myScroll['room-tab-scroll'].scrollTo(0, 0);
				$scope.refreshScroller('room-tab-scroll');
			};

			var _callback = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = '';

				// form submitted, so hide it
				$scope.showForm = false;

				// room is defnetly not in service
				$scope.inService = false;

				// change the original status and update the 'room_reservation_hk_status' in parent
				$_originalStatusId = $scope.updateService.room_service_status_id;

				// copy update details to edit details, show details
				_.extend($scope.editService, $scope.updateService);
				$scope.showSaved = true;

				// reset dates and reason and comment
				$scope.updateStatus = {
					room_id: $scope.roomDetails.id,
					from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
				};
			};

			// update the dates to backend system format
			$scope.updateService.from_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
			$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.to_date), 'yyyy-MM-dd');

			// POST or PUT (read service to understand better)
			if ($_originalStatusId === $_inServiceId) {
				$scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, $scope.updateService, _callback, _error);
			} else {
				$scope.invokeApi(RVHkRoomDetailsSrv.putRoomServiceStatus, $scope.updateService, _callback, _error);
			}
		};

		$scope.edit = function() {
			$scope.showForm = true;
			$scope.showSaved = false;

			_.extend($scope.updateService, $scope.editService);

			$scope.editStatus = {
				room_id: $scope.roomDetails.id,
				from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
			};
		};

		$scope.showCalendar = function(controller) {
			var params = {};

			function onFetchSuccess(data) {
				console.log(data);
				ngDialog.open({
					template: '/assets/partials/housekeeping/rvHkServiceStatusDateSelector.html',
					controller: controller,
					className: 'ngdialog-theme-default single-date-picker',
					closeByDocument: true,
					scope: $scope
				});
				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, params, onFetchSuccess, onFetchFailure);

		}

		$scope.onViewDateChanged = function() {
			console.log('DatePicked');
		}
		BaseCtrl.call(this, $scope);

		// scroll
		$scope.setScroller('room-tab-scroll', {
			click: true,
			preventDefault: false
		});



		/* ***** ***** ***** ***** ***** */



		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// low level method to update the top bar color
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;

		// original room status when user opened room tab
		var $_originalStatusId = $scope.roomDetails.room_reservation_hk_status;

		// in service id, copy paste from server; what if it changes in future?
		var $_inServiceId = 1;

		// by default lets assume room is in service
		$scope.inService = true;

		// by default dont show the form
		$scope.showForm = false;

		// by default dont show the details (disabled) form
		$scope.showSaved = false;

		// list of all posible service statuses
		$scope.allServiceStatus = [];

		// list of all possible maintainace reasons
		$scope.maintenanceReasonsList = [];

		// param: update the new oo/os status
		// $scope.updateService.room_service_status_id serves as the model for the top dropdown
		$scope.updateService = {
			room_id: $scope.roomDetails.id,
			from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			selected_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			room_service_status_id: $_originalStatusId
		};

		// captures the oo/os status details in this
		$scope.editService = {};

		//CICO-12520
		$scope.service_status = {}



		/* ***** ***** ***** ***** ***** */



		// fetch callback of saved oo/os details
		function $_fetchSavedStausCallback(data) {
			$scope.$emit('hideLoader');

			/***
			 *	Sadly the fetch for server API has
			 *	different key names, so we cant just assign the data
			 *
			 *	we need to map the key from data to
			 *	out 'editService' object
			 */
			$scope.editService.selected_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.from_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.to_date = $filter('date')(tzIndependentDate(data.to_date), 'yyyy-MM-dd');
			$scope.editService.reason_id = data.maintenance_reason_id;
			$scope.editService.comment = data.comments;

			$scope.showForm = false;
			$scope.showSaved = true;

			$scope.refreshScroller('room-tab-scroll');
		};

		// fetch callback of all service status
		function $_allServiceStatusCallback(data) {
			$scope.$emit('hideLoader');
			$scope.allServiceStatus = data;

			// find and update ooOsTitle
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $_originalStatusId;
			});
			$scope.ooOsTitle = item.description;

			// check and update if room in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// if not in service, go fetch the oo/os saved details
			if (!$scope.inService) {
				$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
					roomId: $scope.roomDetails.id
				}, $_fetchSavedStausCallback);
			} else {
				$scope.refreshScroller('room-tab-scroll');
			};
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchAllServiceStatus, {}, $_allServiceStatusCallback);

		// fetch callback of maintenance reasons
		function $_maintenanceReasonsCallback(data) {
			$scope.$emit('hideLoader');
			$scope.maintenanceReasonsList = data;
			$scope.refreshScroller('room-tab-scroll');
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchMaintenanceReasons, {}, $_maintenanceReasonsCallback);

		// when user changes the room status from top dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// show update form only when the user chooses a status that is not update yet
			// eg: if original status was OO them show form only when user choose OS
			if (!$scope.inService) {
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
					// show the update form
					$scope.showForm = true;
					$scope.showSaved = false;

					// reset dates and reason and comment
					$scope.updateStatus = {
						from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						reason_id: '',
						comment: ''
					};
				} else {

					// fetch and show the saved details
					$scope.showForm = false;
					$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
						roomId: $scope.roomDetails.id
					}, $_fetchSavedStausCallback);
				}
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;

				$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;

				var _params = {
					roomId: $scope.roomDetails.id,
					inServiceID: 1
				};

				var _callback = function() {
					$scope.$emit('hideLoader');
					$scope.showSaved = false;

					// change the original status
					$_originalStatusId = $scope.updateService.room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', 1);
				};

				// only "put" in service if original status was not inService
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.invokeApi(RVHkRoomDetailsSrv.putRoomInService, _params, _callback);
				}
			};

			$scope.refreshScroller('room-tab-scroll');
		};



		/* ***** ***** ***** ***** ***** */



		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation hide-arrow');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

				setTimeout(function() {
					$('body').find('#ui-datepicker-overlay')
						.on('click', function() {
							console.log('hey clicked');
							$('#room-out-from').blur();
							$('#room-out-to').blur();
						});
				}, 100);
			},
			onClose: function(value) {
				$('#ui-datepicker-div').removeClass('reservation hide-arrow');
				$('#ui-datepicker-overlay').off('click').remove();
			}
		};

		$scope.fromDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
				$scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.updateService.from_date), $rootScope.dateFormat);
			},
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);

		$scope.untilDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);



		/* ***** ***** ***** ***** ***** */



		$scope.update = function() {
			var _error = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				if ($scope.$parent.myScroll['room-tab-scroll'] && $scope.$parent.myScroll['room-tab-scroll'].scrollTo)
					$scope.$parent.myScroll['room-tab-scroll'].scrollTo(0, 0);
				$scope.refreshScroller('room-tab-scroll');
			};

			var _callback = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = '';

				// form submitted, so hide it
				$scope.showForm = false;

				// room is defnetly not in service
				$scope.inService = false;

				// change the original status and update the 'room_reservation_hk_status' in parent
				$_originalStatusId = $scope.updateService.room_service_status_id;

				// copy update details to edit details, show details
				_.extend($scope.editService, $scope.updateService);
				$scope.showSaved = true;

				// reset dates and reason and comment
				$scope.updateStatus = {
					room_id: $scope.roomDetails.id,
					from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
				};
			};

			// update the dates to backend system format
			$scope.updateService.from_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
			$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.to_date), 'yyyy-MM-dd');

			// POST or PUT (read service to understand better)
			if ($_originalStatusId === $_inServiceId) {
				$scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, $scope.updateService, _callback, _error);
			} else {
				$scope.invokeApi(RVHkRoomDetailsSrv.putRoomServiceStatus, $scope.updateService, _callback, _error);
			}
		};

		$scope.edit = function() {
			$scope.showForm = true;
			$scope.showSaved = false;

			_.extend($scope.updateService, $scope.editService);

			$scope.editStatus = {
				room_id: $scope.roomDetails.id,
				from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
			};
		};

		$scope.showCalendar = function(controller) {
			var params = {};

			function onFetchSuccess(data) {
				console.log(data);
				ngDialog.open({
					template: '/assets/partials/housekeeping/rvHkServiceStatusDateSelector.html',
					controller: controller,
					className: 'ngdialog-theme-default single-date-picker',
					closeByDocument: true,
					scope: $scope
				});
				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, params, onFetchSuccess, onFetchFailure);

		}

		$scope.onViewDateChanged = function() {
			console.log('DatePicked');
		}


		BaseCtrl.call(this, $scope);

		// scroll
		$scope.setScroller('room-tab-scroll', {
			click: true,
			preventDefault: false
		});



		/* ***** ***** ***** ***** ***** */



		// keep ref to room details in local scope
		$scope.roomDetails = $scope.$parent.roomDetails;

		// low level method to update the top bar color
		var $_updateRoomDetails = $scope.$parent.updateRoomDetails;

		// original room status when user opened room tab
		var $_originalStatusId = $scope.roomDetails.room_reservation_hk_status;

		// in service id, copy paste from server; what if it changes in future?
		var $_inServiceId = 1;

		// by default lets assume room is in service
		$scope.inService = true;

		// by default dont show the form
		$scope.showForm = false;

		// by default dont show the details (disabled) form
		$scope.showSaved = false;

		// list of all posible service statuses
		$scope.allServiceStatus = [];

		// list of all possible maintainace reasons
		$scope.maintenanceReasonsList = [];

		// param: update the new oo/os status
		// $scope.updateService.room_service_status_id serves as the model for the top dropdown
		$scope.updateService = {
			room_id: $scope.roomDetails.id,
			from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			selected_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
			room_service_status_id: $_originalStatusId
		};

		// captures the oo/os status details in this
		$scope.editService = {};

		//CICO-12520
		$scope.service_status = {}



		/* ***** ***** ***** ***** ***** */



		// fetch callback of saved oo/os details
		function $_fetchSavedStausCallback(data) {
			$scope.$emit('hideLoader');

			/***
			 *	Sadly the fetch for server API has
			 *	different key names, so we cant just assign the data
			 *
			 *	we need to map the key from data to
			 *	out 'editService' object
			 */
			$scope.editService.selected_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.from_date = $filter('date')(tzIndependentDate(data.from_date), 'yyyy-MM-dd');
			$scope.editService.to_date = $filter('date')(tzIndependentDate(data.to_date), 'yyyy-MM-dd');
			$scope.editService.reason_id = data.maintenance_reason_id;
			$scope.editService.comment = data.comments;

			$scope.showForm = false;
			$scope.showSaved = true;

			$scope.refreshScroller('room-tab-scroll');
		};

		// fetch callback of all service status
		function $_allServiceStatusCallback(data) {
			$scope.$emit('hideLoader');
			$scope.allServiceStatus = data;

			// find and update ooOsTitle
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $_originalStatusId;
			});
			$scope.ooOsTitle = item.description;

			// check and update if room in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// if not in service, go fetch the oo/os saved details
			if (!$scope.inService) {
				$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
					roomId: $scope.roomDetails.id
				}, $_fetchSavedStausCallback);
			} else {
				$scope.refreshScroller('room-tab-scroll');
			};
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchAllServiceStatus, {}, $_allServiceStatusCallback);

		// fetch callback of maintenance reasons
		function $_maintenanceReasonsCallback(data) {
			$scope.$emit('hideLoader');
			$scope.maintenanceReasonsList = data;
			$scope.refreshScroller('room-tab-scroll');
		};

		$scope.invokeApi(RVHkRoomDetailsSrv.fetchMaintenanceReasons, {}, $_maintenanceReasonsCallback);

		// when user changes the room status from top dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id == $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.updateService.room_service_status_id != $_inServiceId ? false : true;

			// show update form only when the user chooses a status that is not update yet
			// eg: if original status was OO them show form only when user choose OS
			if (!$scope.inService) {
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
					// show the update form
					$scope.showForm = true;
					$scope.showSaved = false;

					// reset dates and reason and comment
					$scope.updateStatus = {
						from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
						reason_id: '',
						comment: ''
					};
				} else {

					// fetch and show the saved details
					$scope.showForm = false;
					$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
						roomId: $scope.roomDetails.id
					}, $_fetchSavedStausCallback);
				}
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;

				$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;

				var _params = {
					roomId: $scope.roomDetails.id,
					inServiceID: 1
				};

				var _callback = function() {
					$scope.$emit('hideLoader');
					$scope.showSaved = false;

					// change the original status
					$_originalStatusId = $scope.updateService.room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', 1);
				};

				// only "put" in service if original status was not inService
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.invokeApi(RVHkRoomDetailsSrv.putRoomInService, _params, _callback);
				}
			};

			$scope.refreshScroller('room-tab-scroll');
		};



		/* ***** ***** ***** ***** ***** */



		var datePickerCommon = {
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			changeYear: true,
			changeMonth: true,
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation hide-arrow');
				$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');

				setTimeout(function() {
					$('body').find('#ui-datepicker-overlay')
						.on('click', function() {
							console.log('hey clicked');
							$('#room-out-from').blur();
							$('#room-out-to').blur();
						});
				}, 100);
			},
			onClose: function(value) {
				$('#ui-datepicker-div').removeClass('reservation hide-arrow');
				$('#ui-datepicker-overlay').off('click').remove();
			}
		};

		$scope.fromDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
				$scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.updateService.from_date), $rootScope.dateFormat);
			},
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);

		$scope.untilDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			beforeShowDay: function() {
				return [true, 'newClass', 'Sam Rocks'];
			}
		}, datePickerCommon);



		/* ***** ***** ***** ***** ***** */



		$scope.update = function() {
			var _error = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				if ($scope.$parent.myScroll['room-tab-scroll'] && $scope.$parent.myScroll['room-tab-scroll'].scrollTo)
					$scope.$parent.myScroll['room-tab-scroll'].scrollTo(0, 0);
				$scope.refreshScroller('room-tab-scroll');
			};

			var _callback = function() {
				$scope.$emit('hideLoader');
				$scope.errorMessage = '';

				// form submitted, so hide it
				$scope.showForm = false;

				// room is defnetly not in service
				$scope.inService = false;

				// change the original status and update the 'room_reservation_hk_status' in parent
				$_originalStatusId = $scope.updateService.room_service_status_id;

				// copy update details to edit details, show details
				_.extend($scope.editService, $scope.updateService);
				$scope.showSaved = true;

				// reset dates and reason and comment
				$scope.updateStatus = {
					room_id: $scope.roomDetails.id,
					from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
				};
			};

			// update the dates to backend system format
			$scope.updateService.from_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
			$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.to_date), 'yyyy-MM-dd');

			// POST or PUT (read service to understand better)
			if ($_originalStatusId === $_inServiceId) {
				$scope.invokeApi(RVHkRoomDetailsSrv.postRoomServiceStatus, $scope.updateService, _callback, _error);
			} else {
				$scope.invokeApi(RVHkRoomDetailsSrv.putRoomServiceStatus, $scope.updateService, _callback, _error);
			}
		};

		$scope.edit = function() {
			$scope.showForm = true;
			$scope.showSaved = false;

			_.extend($scope.updateService, $scope.editService);

			$scope.editStatus = {
				room_id: $scope.roomDetails.id,
				from_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
			};
		};

		$scope.showCalendar = function(controller) {
			var params = {};

			function onFetchSuccess(data) {
				console.log(data);
				ngDialog.open({
					template: '/assets/partials/housekeeping/rvHkServiceStatusDateSelector.html',
					controller: controller,
					className: 'ngdialog-theme-default single-date-picker',
					closeByDocument: true,
					scope: $scope
				});
				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, params, onFetchSuccess, onFetchFailure);

		}

		$scope.onViewDateChanged = function() {
			console.log('DatePicked');
		}

	}
]);