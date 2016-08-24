angular.module('sntRover').controller('RVHKRoomTabCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams',
	'$filter',
	'RVHkRoomDetailsSrv',
	'ngDialog',
	'rvUtilSrv',
	'$timeout',
	function($scope, $rootScope, $state, $stateParams, $filter, RVHkRoomDetailsSrv, ngDialog, util, $timeout) {

		BaseCtrl.call(this, $scope);

		// scroll
		$scope.setScroller('room-tab-scroll');

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
			room_service_status_id: $_originalStatusId,
			begin_time: '',
			end_time: ''
		};

		// captures the oo/os status details in this
		$scope.editService = {};

		//CICO-12520
		/**
		 * This object would contain the service status of the room in the view
		 * @type {Object}
		 */

		$scope.serviceStatus = {};

		var intervalForTimeSelector = 15,
			mode = 12;
		$scope.timeSelectorList = util.getListForTimeSelector (intervalForTimeSelector, mode);

		//for fixing the issue of 24 hour long OOO thing
		$scope.timeSelectorList.push ({
			text: "11:59 PM",
			value: "23:59"
		});

		/* ***** ***** ***** ***** ***** */

		$scope.setClass = function(day) {
			return [true, ($scope.serviceStatus[$filter('date')(tzIndependentDate(day), 'yyyy-MM-dd')] && $scope.serviceStatus[$filter('date')(tzIndependentDate(day), 'yyyy-MM-dd')].id > 1 ? 'room-out' : '')];
		};


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
				return item.id === $_originalStatusId;
			});



			// check and update if room in service
			$scope.inService = $scope.updateService.room_service_status_id !== $_inServiceId ? false : true;

			// if not in service, go fetch the oo/os saved details
			if (!$scope.inService) {
				$scope.invokeApi(RVHkRoomDetailsSrv.getRoomServiceStatus, {
					room_id: $scope.roomDetails.id,
					from_date: $scope.updateService.selected_date,
					to_date: $scope.updateService.selected_date
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

		
		$scope.$watch("updateService.room_service_status_id", function (newValue, oldValue) {
        	if(newValue !== oldValue){
            	$scope.prev_room_service_status_id = oldValue;
        	}
    	});

		// when user changes the room status from top dropdown
		$scope.statusChange = function() {
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id === $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			// check if user just set it to in service
			$scope.inService = $scope.updateService.room_service_status_id !== $_inServiceId ? false : true;

			// show update form only when the user chooses a status that is not update yet
			// eg: if original status was OO them show form only when user choose OS
			if (!$scope.inService) {
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					if (tzIndependentDate($rootScope.businessDate).toDateString() === tzIndependentDate($scope.updateService.selected_date).toDateString()) {
						$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
					}
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
						room_id: $scope.roomDetails.id,
						from_date: $scope.updateService.selected_date,
						to_date: $scope.updateService.selected_date
					}, $_fetchSavedStausCallback);
				}
				$scope.$apply();
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;
				if (tzIndependentDate($rootScope.businessDate).toDateString() === tzIndependentDate($scope.updateService.selected_date).toDateString()) {
					$scope.roomDetails.room_reservation_hk_status = $scope.updateService.room_service_status_id;
				}
				var _params = {
					room_id: $scope.roomDetails.id,
					inServiceID: 1,
					from_date: $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($scope.updateService.to_date), 'yyyy-MM-dd')
				};

				var _errorCallback = function(error) {
					$scope.$emit('hideLoader');
					$scope.errorMessage = error;
					$scope.updateService.room_service_status_id = $scope.prev_room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', $scope.prev_room_service_status_id);
					$scope.statusChange();
				};

				var _successCallback = function() {
					$scope.$emit('hideLoader');
					$scope.showSaved = false;

					// change the original status
					$_originalStatusId = $scope.updateService.room_service_status_id;
					$_updateRoomDetails('room_reservation_hk_status', 1);
					$scope.updateCalendar();
				};

				// only "put" in service if original status was not inService
				if ($_originalStatusId !== $scope.updateService.room_service_status_id) {
					$scope.invokeApi(RVHkRoomDetailsSrv.putRoomInService, _params, _successCallback,_errorCallback);
				}
			};

			$scope.refreshScroller('room-tab-scroll');
		};



		/* ***** ***** ***** ***** ***** */

		$scope.closeDialog = function() {
			ngDialog.close();
		};

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

		var adjustDates = function() {
			if (tzIndependentDate($scope.updateService.from_date) > tzIndependentDate($scope.updateService.to_date)) {
				$scope.updateService.to_date = $filter('date')(tzIndependentDate($scope.updateService.from_date), 'yyyy-MM-dd');
			}
			$scope.untilDateOptions.minDate = $filter('date')(tzIndependentDate($scope.updateService.from_date), $rootScope.dateFormat);
		};

		$scope.fromDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: adjustDates,
			beforeShowDay: $scope.setClass,
			onChangeMonthYear: function(year, month, instance) {
				$scope.updateCalendar(year, month);
			}
		}, datePickerCommon);

		$scope.untilDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: adjustDates,
			beforeShowDay: $scope.setClass,
			onChangeMonthYear: function(year, month, instance) {
				$scope.updateCalendar(year, month);
			}
		}, datePickerCommon);

		$scope.selectDateOptions = angular.extend({
			minDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(dateText, inst) {
				$scope.onViewDateChanged();
				if ($scope.serviceStatus[$filter('date')(new Date(dateText), "yyyy-MM-dd")]) {
					$scope.updateService.room_service_status_id = $scope.serviceStatus[$filter('date')(new Date(dateText), "yyyy-MM-dd")].id;
				}
				$(".room-actions").click();
			},
			beforeShowDay: $scope.setClass,
			onChangeMonthYear: function(year, month, instance) {
				$scope.updateCalendar(year, month);
			}
		}, datePickerCommon);

		/**
		 * @return {Boolean}
		 */
		$scope.shouldShowTimeSelector = function() {
			//as per CICO-11840 we will show this for hourly hotels only
			return $rootScope.isHourlyRateOn
		};

		/**
		 * @param  {Date}
		 * @return {String}
		 */
		var getApiFormattedDate = function(date) {
			return ($filter('date')(new tzIndependentDate(date), $rootScope.dateFormatForAPI));
		};

		/**
		 * CICO-11840
		 * when there is a third party api is in progress with reservation booking
		 * we need to show this popup
		 * @return undefined
		 */
		var showWebInProgressPopup = function() {
            ngDialog.open({
                template: '/assets/partials/housekeeping/popups/roomTab/rvRoomTabWebInProgressPopup.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
		};

		/**
		 * CICO-11840
		 * when there is some reservation attached to room & user tries to put into OOS/OOO
		 * we need to show this popup
		 * @return undefined
		 */
		var showAlreadyAssignedToReservationsPopup = function(reservationList) {
			var data = {
				reservations : reservationList
			};

            ngDialog.open({
                template: '/assets/partials/housekeeping/popups/roomTab/rvRoomTabReservationExist.html',
                className: '',
                scope: $scope,
                data: JSON.stringify(data),
                closeByDocument: false,
                closeByEscape: false
            });
		};

		/**
		 * @param  {[type]}
		 * @return {[type]}
		 */
		var successCallbackOfRoomStatusChangePossible = function(data) {
			var isWebInProgress = data.is_locked_room,
				alreadyAssignedToReservations = data.is_room_already_assigned;

			if (isWebInProgress) {
				showWebInProgressPopup ();
			}
			else if (alreadyAssignedToReservations) {
				showAlreadyAssignedToReservationsPopup (data.reservations);
			}
			else {
				$scope.update ();
			}
			
		};

		/**
		 * @param  {[type]}
		 * @return {[type]}
		 */
		var failureCallbackOfRoomStatusChangePossible = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};

		/**
		 * CICO-11840
		 * check whether the room status change possible
		 * when it is locked via web api interface or it is already assigned
		 */
		$scope.checkWhetherRoomStatusChangePossible = function() {
			//As per requirement initially we are restricting this feature to hourly hotels only
			if (!$rootScope.isHourlyRateOn) {
				$scope.update ();
				return;
			}

			//for hourly hotels as of now
			var params = {
				from_date	: 	getApiFormattedDate($scope.updateService.from_date),
				to_date		: 	getApiFormattedDate($scope.updateService.to_date),
				room_id 	: 	$scope.roomDetails.id,
				begin_time	: 	$scope.updateService.begin_time,
				end_time	: 	$scope.updateService.end_time
			};
			
			var options = {
				params : params,
				successCallBack: successCallbackOfRoomStatusChangePossible,
                failureCallBack: failureCallbackOfRoomStatusChangePossible
			};

			$scope.callAPI(RVHkRoomDetailsSrv.checkWhetherRoomStatusChangePossible, options);
		};

		/* ***** ***** ***** ***** ***** */

		/**
		 * when the user chooses for force fully put room oos/ooo from popup
		 * @return {[type]} [description]
		 */
		$scope.forcefullyPutRoomToOOSorOOO = function() {
			$scope.closeDialog ();
			$timeout(function(){
				$scope.update();
			}, 700);
		};

		$scope.update = function() {
			var _error = function(errorMessage) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
				$scope.updateService.room_service_status_id = $scope.prev_room_service_status_id;
				$scope.statusChange();
				if ($scope.$parent.myScroll['room-tab-scroll'] && $scope.$parent.myScroll['room-tab-scroll'].scrollTo) {
					$scope.$parent.myScroll['room-tab-scroll'].scrollTo(0, 0);
				}
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
				$scope.updateCalendar();
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
			$scope.refreshScroller('room-tab-scroll');	
		};

		$scope.showCalendar = function(controller) {
			var params = {
				year: tzIndependentDate($scope.updateService.selected_date).getFullYear(),
				month: tzIndependentDate($scope.updateService.selected_date).getMonth(),
				room_id: $scope.roomDetails.id
			};

			function onFetchSuccess(data) {

				$scope.serviceStatus = data.service_status;

				ngDialog.open({
					template: '/assets/partials/housekeeping/rvHkServiceStatusDateSelector.html',
					controller: controller,
					className: 'ngdialog-theme-default single-date-picker service-status-date',
					scope: $scope
				});

				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, params, onFetchSuccess, onFetchFailure);
		};

		$scope.updateCalendar = function(year, month) {
			function onFetchSuccess(data) {
				angular.extend($scope.serviceStatus, data.service_status);
				
				var isNotInService 		= $scope.updateService.room_service_status_id > 1,
					selectedServiceData = $scope.serviceStatus[getApiFormattedDate($scope.updateService.selected_date)],
					hourlyEnabledHotel 	= $rootScope.isHourlyRateOn;

				//CICO-11840
				if (isNotInService && hourlyEnabledHotel) {
					$scope.updateService.begin_time 	= selectedServiceData.from_time;
					$scope.updateService.end_time 		= selectedServiceData.to_time;
				}

				$('.ngmodal-uidate-wrap').datepicker('refresh');
				$scope.$emit('hideLoader');
			}

			function onFetchFailure() {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(RVHkRoomDetailsSrv.fetchRoomStatus, {
				year: year || tzIndependentDate($scope.updateService.selected_date).getFullYear(),
				month: month || tzIndependentDate($scope.updateService.selected_date).getMonth(),
				room_id: $scope.roomDetails.id
			}, onFetchSuccess, onFetchFailure);
		};

		$scope.$watch("updateService.selected_date", function() {
			if ($scope.updateService.room_service_status_id > 1) {
				$scope.showSaved = false;
				$scope.showForm = true;
			} else {
				$scope.showForm = false;
				$scope.showSaved = false;
			}
			$scope.refreshScroller('room-tab-scroll');
		});


		$scope.onViewDateChanged = function() {
			$scope.updateService.selected_date = $filter('date')(tzIndependentDate($scope.updateService.selected_date), 'yyyy-MM-dd');
			$scope.updateService.room_service_status_id = $scope.serviceStatus[$scope.updateService.selected_date].id;
			// The $_originalStatusId flag is used to make sure that the same change is not sent back to the server -- to many flags whew...
			$_originalStatusId = $scope.updateService.room_service_status_id;

			$scope.updateService.from_date = $scope.updateService.selected_date;
			$scope.updateService.to_date = $scope.updateService.selected_date;
			var item = _.find($scope.allServiceStatus, function(item) {
				return item.id === $scope.updateService.room_service_status_id;
			});
			$scope.ooOsTitle = item.description;

			if ($scope.updateService.room_service_status_id > 1) {
				$scope.updateService.reason_id = $scope.serviceStatus[$scope.updateService.selected_date].reason_id;
				$scope.updateService.comment = $scope.serviceStatus[$scope.updateService.selected_date].comments;
				/**
				 * https://stayntouch.atlassian.net/browse/CICO-12520?focusedCommentId=39411&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-39411
				 *When putting the room OOO or OOS for a date range, say 12 - 15 and going back to edit, each day shows separately,
				 *i.e. 12-12, 13 - 13, 14-14, 15 - 15. It should be possible to show the same date range for each selected date?
				 *
				 * TODO : If the neigbouring dates have the same status id reason and comment put them in the date range
				 */
				var oneDay = 86400000; // number of milliseconds in a day
				while ($scope.serviceStatus[$filter('date')(tzIndependentDate($scope.updateService.from_date).getTime() - oneDay, 'yyyy-MM-dd')]) {
					var prevDate = $filter('date')(tzIndependentDate($scope.updateService.from_date).getTime() - oneDay, 'yyyy-MM-dd');
					var prevDateStatus = $scope.serviceStatus[prevDate];
					if (prevDateStatus.id === $scope.updateService.room_service_status_id &&
						prevDateStatus.reason_id === $scope.updateService.reason_id &&
						prevDateStatus.comments === $scope.updateService.comment) {
						$scope.updateService.from_date = prevDate;
					} else {
						break;
					}
				}

				while ($scope.serviceStatus[$filter('date')(tzIndependentDate($scope.updateService.to_date).getTime() + oneDay, 'yyyy-MM-dd')]) {
					var nextDate = $filter('date')(tzIndependentDate($scope.updateService.to_date).getTime() + oneDay, 'yyyy-MM-dd');
					var nextDateStatus = $scope.serviceStatus[nextDate];
					if (nextDateStatus.id === $scope.updateService.room_service_status_id &&
						nextDateStatus.reason_id === $scope.updateService.reason_id &&
						nextDateStatus.comments === $scope.updateService.comment) {
						$scope.updateService.to_date = nextDate;
					} else {
						break;
					}
				}
			}
		};

		$scope.$on('reloadPage', function (data) {
			$scope.roomDetails = data;
		});

	}
]);