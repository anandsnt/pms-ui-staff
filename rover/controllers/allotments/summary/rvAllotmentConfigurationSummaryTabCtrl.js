sntRover.controller('rvAllotmentConfigurationSummaryTabCtrl', [
	'$scope',
	'$rootScope',
	'rvAllotmentSrv',
	'$filter',
	'$stateParams',
	'rvAllotmentConfigurationSrv',
	'dateFilter',
	'RVReservationSummarySrv',
	'ngDialog',
	'RVReservationAddonsSrv',
	'RVReservationCardSrv',
	'rvUtilSrv',
	'$state',
	'rvPermissionSrv',
	function($scope, $rootScope, rvAllotmentSrv, $filter, $stateParams, rvAllotmentConfigurationSrv, dateFilter, RVReservationSummarySrv, ngDialog, RVReservationAddonsSrv, RVReservationCardSrv, util, $state, rvPermissionSrv) {


		var summaryMemento, demographicsMemento;

		/**
		 * Whether our summary data has changed
		 * used to remove the unneccessary API calls
		 * @return {Boolean} [description]
		 */
		var whetherSummaryDataChanged = function() {
			var currentSummaryData = $scope.allotmentConfigData.summary;
			for (key in summaryMemento) {
				if (!_.isEqual(currentSummaryData[key], summaryMemento[key])) {
					return false;
				}
			}
			return true;
		};

		/**
		 * to run angular digest loop,
		 * will check if it is not running
		 * return - None
		 */
		var runDigestCycle = function() {
			if (!$scope.$$phase) {
				$scope.$digest();
			}
		};
		/**
		 * we have to save when the user clicked outside of summary tab
		 * @param  {Object} event - Angular Event
		 * @param  {Object} data  - the clicked element
		 * @return undefined
		 */
		$scope.$on("OUTSIDECLICKED", function(event, targetElement) {
			if ($scope.isInAddMode() || (targetElement && (targetElement.id === 'summary' ||
				targetElement.id === "cancel-action" )) || //TODO: Need to check with Dilip/Shiju PC for more about this
				whetherSummaryDataChanged() ||
				$scope.allotmentSummaryData.isDemographicsPopupOpen || $scope.isUpdateInProgress) {

				return;
			}
			//yes, summary data update is in progress
			$scope.isUpdateInProgress = true;

			//call the updateAllotmentSummary method from the parent controller
			$scope.updateAllotmentSummary();
		});

		/**
		 * if there is any update triggered from some where else, we will get this
		 * event with latest data
		 * @param  {Object} event - Angular Event
		 * @param  {Object} data  - new Summary data
		 * @return undefined
		 */
		$scope.$on('UPDATED_ALLOTMENT_INFO', function(event, data) {
			//data has changed
			summaryMemento = angular.copy($scope.allotmentConfigData.summary);
			$scope.isUpdateInProgress = false;
		});

		/**
		 * when from date choosed, this function will fire
		 * @param  {Object} date
		 * @param  {Object} datePickerObj
		 * @return undefined
		 */
		var fromDateChoosed = function(date, datePickerObj) {
			$scope.allotmentConfigData.summary.block_from = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

			//referring data source
			var refData = $scope.allotmentConfigData.summary;

			// we will clear end date if chosen start date is greater than end date
			if (refData.block_from > refData.block_to) {
				$scope.allotmentConfigData.summary.block_to = '';
			}
			//setting the min date for end Date
			$scope.toDateOptions.minDate = refData.block_from;

			$scope.computeSegment();

			if (!!$scope.allotmentConfigData.summary.block_from && !!$scope.allotmentConfigData.summary.block_to) {
				fetchApplicableRates();
			}

			//we are in outside of angular world
			runDigestCycle();
		};

		var onFetchSegmentDataSuccess = function(demographicsData) {
				$scope.allotmentSummaryData.demographics = demographicsData.demographics;
				updateSegment();
		};

		var onFetchSegmentDataFailure = function(errorMessage) {

		};

		var updateSegment = function() {
			var configSummaryData 	= $scope.allotmentConfigData.summary,
				demographics 	= $scope.allotmentSummaryData.demographics,
				blockFromDate	= configSummaryData.block_from,
				blockToDate		= configSummaryData.block_to,
				aptSegment		= "" //Variable to store the suitable segment ID;

			// CICO-15107 --
			if (!!blockToDate && !!blockFromDate) {
				var dayDiff = Math.floor((new tzIndependentDate(blockToDate) - new tzIndependentDate(blockFromDate)) / 86400000);
				_.each(demographics.segments, function(segment) {
					if (dayDiff < segment.los) {
						if (!aptSegment) {
							aptSegment = segment.value;
						}
					}
				});
				$scope.allotmentSummaryData.computedSegment = !!aptSegment;
				configSummaryData.demographics.segment_id = aptSegment;
			} else {
				return false;
			}
		};
		/**
		 * [computeSegment description]
		 * @return {[type]} [description]
		 */
		$scope.computeSegment = function() {
			if ($scope.allotmentSummaryData.demographics === null) {
				var options = {
					successCallBack: onFetchSegmentDataSuccess,
					failureCallBack: onFetchSegmentDataFailure
				}
				$scope.callAPI(RVReservationSummarySrv.fetchInitialData, options);
			} else {
				updateSegment();
			}
		};

		/**
		 * when to date choosed, this function will fire
		 * @param  {Object} date
		 * @param  {Object} datePickerObj
		 * @return undefined
		 */
		var toDateChoosed = function(date, datePickerObj) {
			var summaryData = $scope.allotmentConfigData.summary;

			summaryData.block_to = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

			$scope.computeSegment();
			//we are in outside of angular world

			if (!!summaryData.block_from && !!summaryData.block_to) {
				fetchApplicableRates();
			}
			runDigestCycle();
		};

		/**
		 * when release date choosed, this function will fire
		 * @param  {Object} date
		 * @param  {Object} datePickerObj
		 * @return undefined
		 */
		var releaseDateChoosed = function(date, datePickerObj) {
			$scope.allotmentConfigData.summary.release_date = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

			//we are in outside of angular world
			runDigestCycle();
		};

		/**
		 * to set date picker option for summary view
		 * @return {undefined} [description]
		 */
		var setDatePickerOptions = function() {
			//date picker options - Common
			var commonDateOptions = {
				dateFormat: $rootScope.jqDateFormat,
				numberOfMonths: 1,
				yearRange: '-1:',
				disabled: $scope.allotmentConfigData.summary.is_cancelled,
				minDate: tzIndependentDate($rootScope.businessDate),
				beforeShow: function(input, inst) {
					$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
				},
				onClose: function(dateText, inst) {
					$('#ui-datepicker-overlay').remove();
				}
			};

			//from Date options
			$scope.fromDateOptions = _.extend({
				onSelect: fromDateChoosed
			}, commonDateOptions);

			//to date options
			$scope.toDateOptions = _.extend({
				onSelect: toDateChoosed
			}, commonDateOptions);

			//release date options
			$scope.releaseDateOptions = _.extend({
				onSelect: releaseDateChoosed
			}, commonDateOptions);
		};

		/**
		 * Place holder method for future implementation of mandatory demographic data
		 * @return {Boolean} Currently hardcoded to true
		 */
		$scope.isDemographicsFormValid = function() {
			return true;
		};

		/**
		 * Opens the dialog box
		 * @return {undefined}
		 */
		var showDemographicsPopup = function() {
			$scope.allotmentSummaryData.isDemographicsPopupOpen = true;
			demographicsMemento = angular.copy($scope.allotmentConfigData.summary.demographics);
			ngDialog.open({
				template: '/assets/partials/allotments/summary/allotmentDemographicsPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false,
				preCloseCallback: function() {
					$scope.allotmentSummaryData.isDemographicsPopupOpen = false;
				}
			});
		};

		var onFetchDemographicsSuccess = function(demographicsData) {
			$scope.allotmentSummaryData.demographics = demographicsData.demographics;
			showDemographicsPopup();
		};

		var onFetchDemographicsFailure = function(errorMessage) {

		};

		/**
		 * Demographics Popup Handler
		 * @return undefined
		 */
		$scope.openDemographicsPopup = function() {
			if ($scope.isInAddMode()) {
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the allotment first"];
				return;
			}
			$scope.errorMessage = "";

			var options = {
				successCallBack: onFetchDemographicsSuccess,
				failureCallBack: onFetchDemographicsFailure
			};

			if ($scope.allotmentSummaryData.demographics === null) {
				$scope.callAPI(RVReservationSummarySrv.fetchInitialData, options);
			} else {
				showDemographicsPopup();
			}

		};
		$scope.openBillingInformation = function() {
			if ($scope.isInAddMode()) {
				// If the allotment has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the allotment first"];
				return;
			}

			$scope.attachedEntities = {};
			$scope.attachedEntities.posting_account = {};
			$scope.attachedEntities.posting_account.id = $scope.allotmentConfigData.summary.allotment_id;
			$scope.attachedEntities.posting_account.name = $scope.accountConfigData.summary.posting_account_name;
			$scope.attachedEntities.posting_account.logo = "ALLOTMENT_DEFAULT";
			$scope.billingEntity = "ALLOTMENT_DEFAULT_BILLING";

			$scope.billingInfoModalOpened = true;

			ngDialog.open({
				template: '/assets/partials/bill/rvBillingInformationPopup.html',
				controller: 'rvBillingInformationPopupCtrl',
				className: '',
				closeByDocument: true,
				scope: $scope
			});

		};

		$scope.$on("BILLINGINFOADDED", function() {
			$scope.allotmentConfigData.summary.posting_account_billing_info = true;
		});

		$scope.saveDemographicsData = function() {
			if ($scope.isInAddMode()) {
				// If the allotment has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the allotment to save Demographics"];
				return;
			}
			$scope.updateAllotmentSummary();
			$scope.closeDialog();
		};

		var showChangeDateNotPossiblePopup = function() {
			ngDialog.open({
				template: '/assets/partials/allotments/summary/warnChangeRateNotPossible.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/**
		 * Success callback function for rate change
		 * @param {object} response of API
		 * @return {undefined}
		 */
		var onRateChangeSuccess = function(data) {
			$scope.$emit('hideLoader');

			if (!data.is_changed && !data.is_room_rate_available) {
				showChangeDateNotPossiblePopup();
				$scope.allotmentConfigData.summary.rate = summaryMemento.rate;
			} else{
			  summaryMemento.rate = $scope.allotmentConfigData.summary.rate;
			}
		};

		/**
		 * Failure callback function for rate change
		 * @param {string} response of API
		 * @return {undefined}
		 */
		var onRateChangeFailure = function(errorMessage) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
			$scope.allotmentConfigData.summary.rate = summaryMemento.rate;
		};

		/**
		 * [onRateChange description]
		 * @return {undefined}
		 */
		$scope.onRateChange = function() {
			var summaryData = $scope.allotmentConfigData.summary;
			if (!summaryData.allotment_id) {
				return false;
			}

			var params = {
				allotment_id: summaryData.allotment_id,
				rate_id: summaryData.rate
			};

			var options = {
				successCallBack: onReleaseRoomsSuccess,
				failureCallBack: onReleaseRoomsFailure,
				params: params
			};
			$scope.callAPI(rvAllotmentConfigurationSrv.updateRate, options);
		};


		$scope.cancelDemographicChanges = function() {
			$scope.allotmentConfigData.summary.demographics = demographicsMemento;
		};

		/**
		 * Warn release the rooms
		 * @return undefined
		 */
		$scope.warnReleaseRooms = function() {
			// Release Rooms NA for cancelled allotment and allotments that arent saved yet
			if (!$scope.allotmentConfigData.summary.is_cancelled && !$scope.isInAddMode()) {
				ngDialog.open({
					template: '/assets/partials/allotments/summary/warnReleaseRoomsPopup.html',
					className: '',
					scope: $scope,
					closeByDocument: false,
					closeByEscape: false
				});
			}
		};

		/**
		 * Handle successful release
		 */
		var onReleaseRoomsSuccess = function(data) {
			$scope.closeDialog();
			fetchSummaryData();
		};

		var onReleaseRoomsFailure = function(data) {
			$scope.errorMessage = data;
		};

		/**
		 * Handle release rooms
		 * @return undefined
		 */
		$scope.releaseRooms = function() {
			var params  = {
					allotmentId: $scope.allotmentConfigData.summary.allotment_id
				},
				options = {
					successCallBack: onReleaseRoomsSuccess,
					failureCallBack: onReleaseRoomsFailure,
					params: params
				};

			$scope.callAPI(rvAllotmentConfigurationSrv.releaseRooms, options);
		};

		$scope.abortCancelAllotment = function() {
			// Reset the hold status to the last saved status
			$scope.allotmentConfigData.summary.hold_status = $scope.allotmentSummaryData.existingHoldStatus;
			$scope.closeDialog();
		};

		var onCancelAllotmentSuccess = function() {
			// reload the allotmentSummary
			$scope.closeDialog();
			$state.go('rover.allotments.config', {
				id: $scope.allotmentConfigData.summary.allotment_id
			}, {
				reload: true
			});
		};

		var onCancelAllotmentFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
			$scope.abortCancelAllotment();
		};

		$scope.cancelAllotment = function(cancellationReason) {
			var params  = {
				allotment_id: $scope.allotmentConfigData.summary.allotment_id,
				reason: cancellationReason
			};
			var options = {
				successCallBack: onCancelAllotmentSuccess,
				failureCallBack: onCancelAllotmentFailure,
				params: params
			};
			$scope.callAPI(rvAllotmentConfigurationSrv.cancelAllotment, options);
		};

		$scope.onHoldStatusChange = function() {
			if (!$scope.isInAddMode()) {
				var selectedStatus = _.findWhere($scope.allotmentConfigData.holdStatusList, {
					id: parseInt($scope.allotmentConfigData.summary.hold_status)
				});
				if (selectedStatus && selectedStatus.name === 'Cancel' && !!selectedStatus.is_system) {
					ngDialog.open({
						template: '/assets/partials/allotments/summary/warnCancelAllotmentPopup.html',
						className: '',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false
					});
				} else {
					$scope.updateAllotmentSummary();
					$scope.allotmentSummaryData.existingHoldStatus = parseInt($scope.allotmentConfigData.summary.hold_status);

				}
			}
		};

		/**
		 * Method to check if the cancel option be available in the hold status select options
		 * @return {Boolean}
		 */
		$scope.isCancellable = function() {

			return (rvPermissionSrv.getPermissionValue('CANCEL_GROUP') && !!$scope.allotmentConfigData.summary.is_cancelled || ($scope.allotmentConfigData.summary.total_checked_in_reservations === 0 && parseFloat($scope.allotmentConfigData.summary.balance) === 0.0));
		};

		var onFetchAddonSuccess = function(data) {
			$scope.allotmentConfigData.selectedAddons = data;
			if ($scope.allotmentConfigData.selectedAddons.length > 0) {
				$scope.openAddonsPopup();
			} else {
				$scope.manageAddons();
			}
		};

		var onFetchAddonFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};

		/**
		 * Method to show addons popup
		 * @return undefined
		 */
		$scope.viewAddons = function() {
			var options = {
				successCallBack: onFetchAddonSuccess,
				failureCallBack: onFetchAddonFailure,
				params: {
					"id": $scope.allotmentConfigData.summary.allotment_id
				}
			};
			$scope.callAPI(rvAllotmentConfigurationSrv.getAllotmentEnhancements, options);
		};

		$scope.getRevenue = function() {
			if ($scope.isInAddMode()) {
				return "";
			}
			return $rootScope.currencySymbol + $filter('number')($scope.allotmentConfigData.summary.revenue_actual, 2) + '/ ' + $rootScope.currencySymbol + $filter('number')($scope.allotmentConfigData.summary.revenue_potential, 2);
		};

		/**
		 * Method used open the addons popup
		 * @return undefined
		 */
		$scope.openAddonsPopup = function() {
			ngDialog.open({
				template: '/assets/partials/allotments/summary/allotmentAddonsPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		var onFetchAddonsListSuccess = function(addonsData) {
			$scope.allotmentConfigData.addons = addonsData;
			$scope.openAllotmentAddonsScreen();
		};

		var onFetchAddonsListFailure = function(errorMessage) {

		};

		/**
		 * manage addons selection/ updates.
		 * Fetch addons list first and show manage screen.
		 * @return undefined
		 */
		$scope.manageAddons = function() {
			if ($scope.isInAddMode()) {
				// If the allotment has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the allotment to manage Add-ons"];
				return;
			}
			$scope.errorMessage = "";

			var params  = {
					from_date: $scope.allotmentConfigData.summary.block_from,
					to_date: $scope.allotmentConfigData.summary.block_to,
					is_active: true,
					is_not_rate_only: true
				},
				options = {
					successCallBack: onFetchAddonsListSuccess,
					failureCallBack: onFetchAddonsListFailure,
					params: params
				}
			$scope.callAPI(RVReservationAddonsSrv.fetchAddonData, options);
		};

		var onRemoveAddonSuccess = function(data) {
			$scope.allotmentConfigData.selectedAddons = data;
			$scope.computeAddonsCount();
		};

		var onRemoveAddonFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};

		/**
		 * Call to remove a specific addon from enhancements.
		 * @param {object} Addon object
		 */
		$scope.removeAddon = function(addon) {
			var params  = {
					"addon_id": addon.id,
					"id": $scope.allotmentConfigData.summary.allotment_id
				},
				options = {
					successCallBack: onRemoveAddonSuccess,
					failureCallBack: onRemoveAddonFailure,
					params: params
				};
			$scope.callAPI(rvAllotmentConfigurationSrv.removeAllotmentEnhancement, options);
		};

		var onSaveAllotmentNoteSuccess = function(data) {
			$scope.allotmentConfigData.summary.notes = data.notes;
			$scope.allotmentSummaryData.newNote = "";
			$scope.refreshScroller("allotmentSummaryScroller");
		};

		var onSaveAllotmentNoteFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};

		/**
		 * Method to save a note
		 * @return undefined
		 */
		$scope.saveAllotmentNote = function() {
			if ($scope.isInAddMode()) {
				// If the allotment has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the allotment to Post Note"];
				return;
			}
			$scope.errorMessage = "";

			var params  = {
					"notes": $scope.allotmentSummaryData.newNote,
					"allotment_id": $scope.allotmentConfigData.summary.allotment_id
				},
				options = {
					successCallBack: onSaveAllotmentNoteSuccess,
					failureCallBack: onSaveAllotmentNoteFailure,
					params: params
				};
			if ($scope.allotmentSummaryData.newNote) {
				$scope.callAPI(rvAllotmentConfigurationSrv.saveAllotmentNote, options);
			}
		};

		var onRemoveAllotmentNoteSuccess = function(data, params) {
			$scope.allotmentConfigData.summary.notes = _.without($scope.allotmentConfigData.summary.notes, _.findWhere($scope.allotmentConfigData.summary.notes, {
				note_id: params.noteId
			}));
			$scope.refreshScroller("allotmentSummaryScroller");
		};

		var onRemoveAllotmentNoteFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};

		/**
		 * deletes a specific note.
		 * @param {int} id of the note.
		 */
		$scope.removeAllotmentNote = function(noteId) {
			var options = {
				successCallBack: onRemoveAllotmentNoteSuccess,
				failureCallBack: onRemoveAllotmentNoteFailure,
				params: {
					"note_id": noteId
				},
				successCallBackParameters: {
					"noteId": noteId
				}
			};
			$scope.callAPI(rvAllotmentConfigurationSrv.removeAllotmentNote, options);
		};

		var getPassData = function() {
			var passData = {
				"is_swiped": false,
				"details": {
					"firstName": "",
					"lastName": ""
				}
			};
			return passData;
		};

		$scope.$on('HANDLE_MODAL_OPENED', function(event) {
			$scope.billingInfoModalOpened = false;
		});

		/*
		 *	MLI SWIPE actions
		 */
		var processSwipedData = function(swipedCardData) {

			var passData = getPassData();
			var swipeOperationObj = new SwipeOperation();
			var swipedCardDataToRender = swipeOperationObj.createSWipedDataToRender(swipedCardData);
			passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
			$scope.$broadcast('SHOW_SWIPED_DATA_ON_BILLING_SCREEN', swipedCardDataToRender);
		};

		/*
		 * Handle swipe action in billing info
		 */

		$scope.$on('SWIPE_ACTION', function(event, swipedCardData) {
                $scope.swippedCard = true;

			if ($scope.billingInfoModalOpened) {
				var swipeOperationObj = new SwipeOperation();
				var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
				var tokenizeSuccessCallback = function(tokenValue) {
					$scope.$emit('hideLoader');
					swipedCardData.token = tokenValue;
					processSwipedData(swipedCardData);
				};
				$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
			};
		});

		var onFetchRatesSuccess = function(data) {
			// split result to contracted vs others for enabling grouping on the dropdown
			$scope.allotmentSummaryData.rates = _.where(data.results, {
				is_contracted: false
			});

			$scope.allotmentSummaryData.contractedRates = _.where(data.results, {
				is_contracted: true
			});
		};
		var onFetchRatesFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};

		var fetchApplicableRates = function() {
			var params = {
				from_date: $filter('date')(tzIndependentDate($scope.allotmentConfigData.summary.block_from), 'yyyy-MM-dd'),
				to_date: $filter('date')(tzIndependentDate($scope.allotmentConfigData.summary.block_to), 'yyyy-MM-dd'),
				company_id: ($scope.allotmentConfigData.summary.company && $scope.allotmentConfigData.summary.company.id) || null,
				travel_agent_id: ($scope.allotmentConfigData.summary.travel_agent && $scope.allotmentConfigData.summary.travel_agent.id) || null
			};
			var options = {
				successCallBack: onFetchRatesSuccess,
				failureCallBack: onFetchRatesFailure,
				params: params
			};

			$scope.callAPI(rvAllotmentConfigurationSrv.getRates, options);
		};

		/**
		 * we will update the summary data, when we got this one
		 * @param  {Object} data
		 * @return undefined
		 */
		var fetchSuccessOfSummaryData = function(data) {
			$scope.allotmentConfigData.summary = _.extend($scope.allotmentConfigData.summary, data.allotmentSummary);

			summaryMemento = _.extend({}, $scope.allotmentConfigData.summary);
		};

		/**
		 * method to fetch summary data
		 * @return undefined
		 */
		var fetchSummaryData = function() {
			var params = {
				"allotmentId": $scope.allotmentConfigData.summary.allotment_id
			};
			var options = {
				successCallBack: fetchSuccessOfSummaryData,
				params: params
			};

			$scope.callAPI(rvAllotmentConfigurationSrv.getAllotmentSummary, options);
		};

		/**
		 * when a tab switch is there, parant controller will propogate an event
		 * we will use this to fetch summary data
		 */
		$scope.$on("ALLOTMENT_TAB_SWITCHED", function(event, activeTab) {
			if (activeTab !== 'SUMMARY') {
				return;
			}
			fetchSummaryData();

			//we are resetting the API call in progress check variable
			$scope.isUpdateInProgress = false;

			//we have to refresh this data on tab siwtch
			$scope.computeSegment();
		});

		/**
		 * [initializeVariables description]
		 * @param  {[type]} argument [description]
		 * @return {[type]}          [description]
		 */
		var initializeVariables = function(argument) {

			$scope.allotmentSummaryData = {
				releaseOnDate: $rootScope.businessDate,
				demographics: null,
				promptMandatoryDemographics: false,
				isDemographicsPopupOpen: false,
				newNote: "",

				//This is required to reset Cancel when selected in dropdown but not proceeded with in the popup
				existingHoldStatus: parseInt($scope.allotmentConfigData.summary.hold_status),
				computedSegment: false,
				rates: [],
				contractedRates: []
			};

			$scope.billingInfoModalOpened = false;

			//we use this to ensure that we will call the API only if there is any change in the data
			summaryMemento = _.extend({}, $scope.allotmentConfigData.summary);
			demographicsMemento = {};

			//since we are recieving two ouside click event on tapping outside, we wanted to check and act
			$scope.isUpdateInProgress = false;
		};

		/**
		 * to set the active left side menu
		 * @return {undefined}
		 */
		var setActiveLeftSideMenu = function () {
			var activeMenu = ($scope.isInAddMode()) ? "menuCreateAllotment": "menuManageAllotment";
			$scope.$emit("updateRoverLeftMenu", activeMenu);
		};

		/**
		 * Function used to initialize summary view
		 * @return undefined
		 */
		var initializeMe = function() {
			BaseCtrl.call(this, $scope);

			//summary scroller
			$scope.setScroller("allotmentSummaryScroller");

			//updating the left side menu
			setActiveLeftSideMenu();

			//we have a list of scope varibales which we wanted to initialize
			initializeVariables();

			//IF you are looking for where the hell the API is CALLING
			//scroll above, and look for the event 'ALLOTMENT_TAB_SWITCHED'

			//date related setups and things
			//
			// Fetch rates to show in dropdown
			if (!!$scope.allotmentConfigData.summary.block_from && !!$scope.allotmentConfigData.summary.block_to) {
				fetchApplicableRates();
			}

			// Redo rates list while modifying attached cards to the group
			$scope.$on('CARDS_CHANGED', function() {
				// Fetch rates to show in dropdown
				if (!!$scope.allotmentConfigData.summary.block_from && !!$scope.allotmentConfigData.summary.block_to) {
					fetchApplicableRates();
				}
			});

			setDatePickerOptions();

			$scope.computeSegment();
		}();
	}
]);