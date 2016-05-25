angular.module('sntRover').controller('rvGroupConfigurationSummaryTab', ['$scope', '$q', 'jsMappings', '$rootScope', 'rvGroupSrv', '$filter', '$stateParams', 'rvGroupConfigurationSrv', 'dateFilter', 'RVReservationSummarySrv', 'ngDialog', 'RVReservationAddonsSrv', 'RVReservationCardSrv', 'rvUtilSrv', '$state', 'rvPermissionSrv', '$timeout', 'rvGroupActionsSrv',
	function($scope, $q, jsMappings, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, dateFilter, RVReservationSummarySrv, ngDialog, RVReservationAddonsSrv, RVReservationCardSrv, util, $state, rvPermissionSrv, $timeout, rvGroupActionsSrv) {


		var summaryMemento, demographicsMemento;

		/**
		 * Whether our summary data has changed
		 * used to remove the unneccessary API calls
		 * @return {Boolean} [description]
		 */
		var whetherSummaryDataChanged = function() {
			// Some properties not in original defenition should be left out
			var currentSummaryData = $scope.groupConfigData.summary;
			summaryMemento = _.omit(summaryMemento, [
								'rooms_total',
								'selected_room_types_and_bookings',
								'selected_room_types_and_occupanies'
							]);
			for (var key in summaryMemento) {
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
		 * Use to reset calender date pickers to actual dates
		 * @return {undefined}
		 */
		var resetDatePickers = function() {
			//resetting the calendar date's to actual one
			$scope.groupConfigData.summary.block_from 	= new tzIndependentDate(summaryMemento.block_from);
			$scope.groupConfigData.summary.block_to  	= new tzIndependentDate(summaryMemento.block_to);

			//setting the min date for end Date
			$scope.toDateOptions.minDate = $scope.groupConfigData.summary.block_from;

			//setting max date of from date
			$scope.fromDateOptions.maxDate = $scope.groupConfigData.summary.block_to;
		};

		/**
		 * Our Move date, start date, end date change are defined in parent controller
		 * We need to share those actions with room block
		 * @return undefined
		 */
		var initializeChangeDateActions = function () {
			//things are defined in parent controller (getMoveDatesActions)
			$scope.changeDatesActions = $scope.getMoveDatesActions();

			//initially we will be in DEFAULT mode
			$scope.changeDatesActions.setToDefaultMode();
		};

		var successCallBackOfMoveButton = function() {
			$scope.reloadPage();
		};

		var failureCallBackOfMoveButton = function(errorMessage) {

		};

		/**
		 * when clicked on Save move button. this will triggr
		 * @return {undefined}
		 */
		$scope.clickedOnSaveMoveButton = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					fromDate 		: sumryData.block_from,
					toDate 			: sumryData.block_to,
					oldFromDate 	: oldSumryData.block_from,
					oldToDate 		: oldSumryData.block_to,
					successCallBack : successCallBackOfMoveButton,
					failureCallBack : failureCallBackOfMoveButton
				};
			$scope.changeDatesActions.clickedOnMoveSaveButton (options);
		};

		/**
		 * when clicked on move button. this will triggr
		 * @return {undefined}
		 */
		$scope.clickedOnMoveButton = function() {
			_.extend($scope.toDateOptions,
			{
				disabled: true
			});

			//resetting the calendar date's to actual one
			resetDatePickers();

			//setting max date of from date
			$scope.fromDateOptions.maxDate = '';

			$scope.changeDatesActions.clickedOnMoveButton ();

		};

		/**
		 * when clicked on cancel move button. this will triggr
		 * @return {undefined}
		 */
		$scope.clickedOnCancelMoveButton = function() {
			_.extend($scope.toDateOptions,
			{
				disabled: false
			});

			$scope.reloadPage();
		};

		var cancelCallBackofDateChange = function () {
			resetDatePickers();
		};

		var successCallBackOfEarlierArrivalDateChange = function() {
			$scope.reloadPage();
		};

		/**
		 * [failureCallBackOfEarlierArrivalDateChange description]
		 * @param  {[type]} error [description]
		 * @return {[type]}       [description]
		 */
		var failureCallBackOfEarlierArrivalDateChange = function(error) {
		};

		/**
		 * when clicked on Save move button. this will triggr
		 * @return {undefined}
		 */
		var triggerEarlierArrivalDateChange = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					fromDate 		: sumryData.block_from,
					oldFromDate 	: oldSumryData.block_from,
					successCallBack : successCallBackOfEarlierArrivalDateChange,
					failureCallBack : failureCallBackOfEarlierArrivalDateChange,
					cancelPopupCallBack	: cancelCallBackofDateChange
				};
			$scope.changeDatesActions.triggerdChangeDateActions();
			$scope.changeDatesActions.triggerEarlierArrDateChange (options);
		};

		var successCallBackOfLaterArrivalDateChange = function() {
			$scope.reloadPage();
		};

		var failureCallBackOfLaterArrivalDateChange = function(errorMessage) {

		};

		/**
		 * when clicked on Save move button. this will triggr
		 * @return {undefined}
		 */
		var triggerLaterArrivalDateChange = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					fromDate 		: sumryData.block_from,
					oldFromDate 	: oldSumryData.block_from,
					successCallBack : successCallBackOfLaterArrivalDateChange,
					failureCallBack : failureCallBackOfLaterArrivalDateChange,
					cancelPopupCallBack	: cancelCallBackofDateChange
				};
			$scope.changeDatesActions.triggerdChangeDateActions();
			$scope.changeDatesActions.triggerLaterArrDateChange (options);
		};

		/**
		 * DEPATURE CHANGE
		 */
		/**
		 * [successCallBackOfEarlierDepartureDateChange description]
		 * @return {[type]} [description]
		 */
		var successCallBackOfEarlierDepartureDateChange = function() {
			$scope.reloadPage();
		};

		/**
		 * [failureCallBackOfEarlierDepartureDateChange description]
		 * @param  {[type]} errorMessage [description]
		 * @return {[type]}              [description]
		 */
		var failureCallBackOfEarlierDepartureDateChange = function(errorMessage) {

		};

		/**
		 * when clicked on Save move button. this will triggr
		 * @return {undefined}
		 */
		var triggerEarlierDepartureDateChange = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					toDate 			: sumryData.block_to,
					oldToDate 		: oldSumryData.block_to,
					successCallBack : successCallBackOfEarlierDepartureDateChange,
					failureCallBack : failureCallBackOfEarlierDepartureDateChange,
					cancelPopupCallBack	: cancelCallBackofDateChange
				};
			$scope.changeDatesActions.triggerdChangeDateActions();
			$scope.changeDatesActions.triggerEarlierDepDateChange (options);
		};

		/**
		 * [successCallBackOfLaterDepartureDateChange description]
		 * @return {[type]} [description]
		 */
		var successCallBackOfLaterDepartureDateChange = function() {
			$scope.reloadPage();
		};

		/**
		 * [failureCallBackOfLaterDepartureDateChange description]
		 * @param  {[type]} errorMessage [description]
		 * @return {[type]}              [description]
		 */
		var failureCallBackOfLaterDepartureDateChange = function(errorMessage) {

		};

		/**
		 * when clicked on Save move button. this will triggr
		 * @return {undefined}
		 */
		var triggerLaterDepartureDateChange = function() {
			var sumryData = $scope.groupConfigData.summary,
				oldSumryData = summaryMemento,
				options = {
					toDate 			: sumryData.block_to,
					oldToDate 		: oldSumryData.block_to,
					successCallBack : successCallBackOfLaterDepartureDateChange,
					failureCallBack : failureCallBackOfLaterDepartureDateChange,
					cancelPopupCallBack	: cancelCallBackofDateChange
				};
			$scope.changeDatesActions.triggerdChangeDateActions();
			$scope.changeDatesActions.triggerLaterDepDateChange (options);
		};

		var triggerEarlierDepartureDateChangeInvalidError = function() {
			var options = {
				cancelPopupCallBack	: cancelCallBackofDateChange,
				message 			: "GROUP_EARLIER_DEP_DATE_CHANGE_WARNING"
			};
			$scope.changeDatesActions.triggerdChangeDateActions();
			$scope.changeDatesActions.showDateChangeInvalidWarning(options);
		};

		var triggerLaterArrivalDateChangeInvalidError = function() {
			var options = {
				cancelPopupCallBack	: cancelCallBackofDateChange,
				message 			: "GROUP_LATER_ARR_DATE_CHANGE_WARNING"
			};
			$scope.changeDatesActions.triggerdChangeDateActions();
			$scope.changeDatesActions.showDateChangeInvalidWarning(options);
		};

		/**
		 * [shouldShowMoveButton description]
		 * @return {[type]} [description]
		 */
		$scope.shouldShowMoveButton = function() {
			if ($scope.isInStaycardScreen()) {
				return false;
			}
			return ($scope.changeDatesActions && $scope.changeDatesActions.shouldShowMoveButton());
		};

		/**
		 * [shouldShowMoveButton description]
		 * @return {[type]} [description]
		 */
		$scope.shouldShowMoveCancelButton = function() {
			if ($scope.isInStaycardScreen()) {
				return false;
			}
			return ($scope.changeDatesActions && $scope.changeDatesActions.isInCompleteMoveMode());
		};

		/**
		 * [shouldShowMoveButton description]
		 * @return {[type]} [description]
		 */
		$scope.shouldShowMoveSaveButton = function() {
			if ($scope.isInStaycardScreen()) {
				return false;
			}
			return ($scope.changeDatesActions &&  $scope.changeDatesActions.isInCompleteMoveMode());
		};

		/**
		 * [shouldDisableHoldStatusChange description]
		 * @return {[type]} [description]
		 */
		$scope.shouldDisableHoldStatusChange = function() {
			return ($scope.groupConfigData.summary.is_cancelled || $scope.isInStaycardScreen());
		};

		/**
		 * Decide whether we need to disable rate change or not
		 * @return {Boolean} disalbe or not
		 */
		$scope.shouldDisableRateChange = function() {
			return ($scope.groupConfigData.summary.is_cancelled || $scope.isInStaycardScreen());
		};

		/**
		 * Logic to show/hide group actions button
		 * @return {Boolean} hide or not
		 */
		$scope.shouldShowGroupActionsButton = function () {
			return ($scope.isStandAlone && !$scope.isInStaycardScreen() && !$scope.isInAddMode())
		};

		/**
		 * we have to save when the user clicked outside of summary tab
		 * @param  {Object} event - Angular Event
		 * @param  {Object} data  - the clicked element
		 * @return undefined
		 */
		$scope.$on("OUTSIDECLICKED", function(event, targetElement) {
			if(typeof targetElement === 'undefined' || !(targetElement instanceof Element)){
				return;
			}

			if (!$scope.updateGroupSummary || //This is used in the res-cards and this method is not available there
                $scope.isInAddMode() || (targetElement.id === 'summary') ||
				targetElement.id === "cancel-action" || //TODO: Need to check with Dilip/Shiju PC for more about this
				whetherSummaryDataChanged() ||
				$scope.groupSummaryData.isDemographicsPopupOpen ||
				$scope.isUpdateInProgress ||
				$scope.changeDatesActions.isInCompleteMoveMode() ||
				$scope.changeDatesActions.isInChangeDatesMode() ) {

				return;
			}
			//yes, summary data update is in progress
			$scope.isUpdateInProgress = true;

			//call the updateGroupSummary method from the parent controller
			$scope.updateGroupSummary();
		});

		/**
		 * if there is any update triggered from some where else, we will get this
		 * event with latest data
		 * @param  {Object} event - Angular Event
		 * @param  {Object} data  - new Summary data
		 * @return undefined
		 */
		$scope.$on('UPDATED_GROUP_INFO', function(event, data) {
			//data has changed
			summaryMemento = angular.copy($scope.groupConfigData.summary);
			$scope.isUpdateInProgress = false;
		});

		/**
		 * when from date choosed, this function will fire
		 * @param  {Object} date
		 * @param  {Object} datePickerObj
		 * @return undefined
		 */
		var fromDateChoosed = function(date, datePickerObj) {
			$scope.groupConfigData.summary.block_from = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

			//referring data source
			var refData 		= $scope.groupConfigData.summary,
				newBlockFrom 	= refData.block_from,
				oldBlockFrom	= new tzIndependentDate(summaryMemento.block_from);

			if (refData.release_date.toString().trim() === '') {
				refData.release_date = refData.block_from;
			}

			if (!!$scope.groupConfigData.summary.block_from && !!$scope.groupConfigData.summary.block_to) {
				fetchApplicableRates();
			}

			//if it is is Move Date mode
			else if ($scope.changeDatesActions.isInCompleteMoveMode()) {
				var originalStayLength = (util.getDatesBetweenTwoDates (new tzIndependentDate(util.deepCopy(summaryMemento.block_from)), new tzIndependentDate(util.deepCopy(summaryMemento.block_to))).length - 1);
				refData.block_to = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
				refData.block_to.setDate(refData.block_to.getDate() + originalStayLength);
			}

			//arrival left date change
			else if(newBlockFrom < oldBlockFrom && $scope.changeDatesActions.arrDateLeftChangeAllowed()) {
				triggerEarlierArrivalDateChange();
			}

			//arrival right date change
			else if(newBlockFrom > oldBlockFrom && $scope.changeDatesActions.arrDateRightChangeAllowed()) {
				// check move validity
				if(new tzIndependentDate(refData.first_dep_date) < newBlockFrom) {
					triggerLaterArrivalDateChangeInvalidError();
				}
				else {
					triggerLaterArrivalDateChange();
				}
			}

			//setting the min date for end Date
			$scope.toDateOptions.minDate = refData.block_from;

			//we are in outside of angular world
			runDigestCycle();
		};


		/**
		 * [computeSegment description]
		 * @return {[type]} [description]
		 */
		$scope.computeSegment = function() {
			// CICO-15107 --
			var onFetchDemographicsSuccess = function(demographicsData) {
					$scope.groupSummaryData.demographics = demographicsData.demographics;
					updateSegment();
				},
				onFetchDemographicsFailure = function(errorMessage) {
				},
				updateSegment = function() {
					var aptSegment = ""; //Variable to store the suitable segment ID
					if (!!$scope.groupConfigData.summary.block_to && !!$scope.groupConfigData.summary.block_from) {
						var dayDiff = Math.floor((new tzIndependentDate($scope.groupConfigData.summary.block_to) - new tzIndependentDate($scope.groupConfigData.summary.block_from)) / 86400000);
						angular.forEach($scope.groupSummaryData.demographics.segments, function(segment) {
							if (dayDiff < segment.los) {
								if (!aptSegment) {
									aptSegment = segment.value;
								}
							}
						});
						$scope.groupSummaryData.computedSegment = !!aptSegment;
						$scope.groupConfigData.summary.demographics.segment_id = aptSegment;
					} else {
						return false;
					}
				};

			if ($scope.groupSummaryData.demographics === null) {
				$scope.callAPI(RVReservationSummarySrv.fetchInitialData, {
					successCallBack: onFetchDemographicsSuccess,
					failureCallBack: onFetchDemographicsFailure
				});
			} else {
				updateSegment();
			}
		};

		var updateRateAndSegment = function(){
			if(!!$scope.groupConfigData.summary.block_from && !!$scope.groupConfigData.summary.block_to) {
				fetchApplicableRates();
				$scope.computeSegment();
			}
		};

		/**
		 * when to date choosed, this function will fire
		 * @param  {Object} date
		 * @param  {Object} datePickerObj
		 * @return undefined
		 */
		var toDateChoosed = function(date, datePickerObj) {
			$scope.groupConfigData.summary.block_to = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));
			//referring data source
			var refData 	= $scope.groupConfigData.summary,
				newBlockTo 	= refData.block_to,
				oldBlockTo	= new tzIndependentDate(summaryMemento.block_to),
				chActions 	= $scope.changeDatesActions;

			if (!!$scope.groupConfigData.summary.block_from && !!$scope.groupConfigData.summary.block_to) {
				fetchApplicableRates();
			}
			// check move validity
			// departure left date change
			else if(newBlockTo < oldBlockTo && chActions.depDateLeftChangeAllowed()) {
				if(new tzIndependentDate(refData.last_arrival_date) > newBlockTo){
					triggerEarlierDepartureDateChangeInvalidError();
				}
				else{
					triggerEarlierDepartureDateChange();
				}
			}

			//departure right date change
			else if(newBlockTo > oldBlockTo && chActions.depDateRightChangeAllowed()) {
				triggerLaterDepartureDateChange();
			}

			// let the date update if it is future group as well is in edit mode
			else if (!$scope.isInAddMode() && !refData.is_a_past_group){
				$timeout(function() {
					$scope.updateGroupSummary();
				}, 100);
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
			$scope.groupConfigData.summary.release_date = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

			//we are in outside of angular world
			runDigestCycle();
		};

		/**
		 * every logic to disable the from date picker should be here
		 * @return {Boolean} [description]
		 */
		var shouldDisableFromDatePicker = function(){
			var sData 					= $scope.groupConfigData.summary,
				noOfInhouseIsNotZero 	= (sData.total_checked_in_reservations > 0),
				cancelledGroup 			= sData.is_cancelled,
				is_A_PastGroup 			= sData.is_a_past_group,
				inEditMode 				= !$scope.isInAddMode();

			return ($scope.isInStaycardScreen()) || ( inEditMode &&
				   	(
				   	  noOfInhouseIsNotZero 	||
					  cancelledGroup 		||
					  is_A_PastGroup
					)
				   );
		};

		/**
		 * every logic to disable the end date picker should be here
		 * @return {Boolean} [description]
		 */
		var shouldDisableEndDatePicker = function(){
			var sData 					= $scope.groupConfigData.summary,
				endDateHasPassed 		= new tzIndependentDate(sData.block_to) < new tzIndependentDate($rootScope.businessDate),
				cancelledGroup 			= sData.is_cancelled,
				toRightMoveNotAllowed 	= !sData.is_to_date_right_move_allowed,
				inEditMode 				= !$scope.isInAddMode();

			return ($scope.isInStaycardScreen()) || ( inEditMode &&
				   	(
				   	 endDateHasPassed 	||
					 cancelledGroup 	||
					 toRightMoveNotAllowed
					)
				   );
		};

		/**
		 * every logic to disable the release date picker should be here
		 * @return {Boolean} [description]
		 */
		var shouldDisableReleaseDatePicker = function(){
			return ($scope.isInStaycardScreen() || $scope.groupConfigData.summary.is_cancelled);
		};

		/**
		 * to set date picker option for summary view
		 * @return {undefined} [description]
		 */
		var setDatePickerOptions = function() {
			//date picker options - Common
			var commonDateOptions = {
				dateFormat: $rootScope.jqDateFormat,
				numberOfMonths: 1
			};

			var sumryData = $scope.groupConfigData.summary,
				changeDatesActions = $scope.changeDatesActions;

			//from Date options
			$scope.fromDateOptions = _.extend({
				onSelect: fromDateChoosed,
				disabled: shouldDisableFromDatePicker(),
				maxDate: $scope.groupConfigData.summary.block_to,
				minDate: tzIndependentDate($rootScope.businessDate)
			}, commonDateOptions);

			if (sumryData.block_from instanceof Date) {
				if (tzIndependentDate (sumryData.block_from) < tzIndependentDate($rootScope.businessDate)) {
					$scope.fromDateOptions = _.extend({
						minDate: tzIndependentDate(sumryData.block_from)
					}, $scope.fromDateOptions);
				}
			}

			//to date options
			$scope.toDateOptions = _.extend({
				onSelect: toDateChoosed,
				disabled: shouldDisableEndDatePicker()
			}, commonDateOptions);

			if ($scope.groupConfigData.summary.block_from !== '') {
				$scope.toDateOptions = _.extend({
					minDate: tzIndependentDate($scope.groupConfigData.summary.block_from)
				}, $scope.toDateOptions);
			}

			//release date options
			$scope.releaseDateOptions = _.extend({
				onSelect: releaseDateChoosed,
				disabled: shouldDisableReleaseDatePicker(),
				minDate: tzIndependentDate($rootScope.businessDate)
			}, commonDateOptions);

			//summary memento will change we attach date picker to controller
			summaryMemento = _.extend({}, $scope.groupConfigData.summary);
		};

		/**
		 * calculate class name for actions button on summary actions.
		 * @returns {string} action button class
		 */
		$scope.getActionsButtonClass = function () {
			var actionsCount = parseInt($scope.groupConfigData.summary.total_group_action_tasks_count),
				pendingCount = parseInt($scope.groupConfigData.summary.pending_group_action_tasks_count);

			if (pendingCount > 0) {
				return 'icon-new-actions';
			}
			if (actionsCount === 0) {
				return 'icon-no-actions';
			}

			return 'icon-actions';
		};

		var successCallBackForFetchGroupActions = function(data) {
			ngDialog.open({
				template: '/assets/partials/groups/summary/rvGroupActions.html',
				controller: 'rvGroupActionsCtrl',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false,
				data: JSON.stringify(data)
			});
		};

		var failuresCallBackForFetchGroupActions = function(error) {
			$scope.errorMessage = error;
		};

		var fetchGroupActions = function () {
			var deferred = $q.defer(),
				options = {};

			options.params = {
				id: $scope.groupConfigData.summary.group_id
			};
			options.successCallBack = deferred.resolve;
			options.failureCallBack = deferred.reject;
			$scope.callAPI(rvGroupActionsSrv.getActionsTasksList, options);
			return deferred.promise;
		};

		/**
		 * Fetch actions data and opens the group actions manager popup to display group actions.
		 * @return {undefined}
		 */
		$scope.openGroupActionsPopup = function () {
			fetchGroupActions()
				.then(successCallBackForFetchGroupActions, failuresCallBackForFetchGroupActions);
		};

		/**
		 * Place holder method for future implementation of mandatory demographic data
		 * @return {Boolean} Currently hardcoded to true
		 */
		$scope.isDemographicsFormValid = function() {
			return true;
		};

		/**
		 * Demographics Popup Handler
		 * @return undefined
		 */
		$scope.openDemographicsPopup = function() {
			if ($scope.isInAddMode()) {
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the group first"];
				return;
			}

			$scope.errorMessage = "";

			var showDemographicsPopup = function() {
					$scope.groupSummaryData.isDemographicsPopupOpen = true;


					demographicsMemento = angular.copy($scope.groupConfigData.summary.demographics);
					ngDialog.open({
						template: '/assets/partials/groups/summary/groupDemographicsPopup.html',
						className: '',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false,
						preCloseCallback: function() {
							$scope.groupSummaryData.isDemographicsPopupOpen = false;
						}
					});
				},
				onFetchDemographicsSuccess = function(demographicsData) {
					$scope.groupSummaryData.demographics = demographicsData.demographics;
					showDemographicsPopup();
				},
				onFetchDemographicsFailure = function(errorMessage) {
				};

			if ($scope.groupSummaryData.demographics === null) {
				$scope.callAPI(RVReservationSummarySrv.fetchInitialData, {
					successCallBack: onFetchDemographicsSuccess,
					failureCallBack: onFetchDemographicsFailure
				});

			} else {
				showDemographicsPopup();
			}

		};
		$scope.openBillingInformation = function() {
			if ($scope.isInAddMode()) {
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the group first"];
				return;
			}
			var summaryData = $scope.groupConfigData.summary;

			$scope.billingEntity = "GROUP_DEFAULT_BILLING";
			$scope.billingInfoModalOpened = true;
			$scope.attachedEntities = {};
			$scope.attachedEntities.posting_account = _.extend({}, {
				id: summaryData.group_id,
				name: $scope.accountConfigData.summary.posting_account_name,
				logo: "GROUP_DEFAULT"
			});
	    	$scope.$emit('showLoader');
           	jsMappings.fetchAssets(['addBillingInfo', 'directives'])
            .then(function(){
            	$scope.$emit('hideLoader');
			    ngDialog.open({
			        template: '/assets/partials/bill/rvBillingInformationPopup.html',
			        controller: 'rvBillingInformationPopupCtrl',
			        className: '',
			        scope: $scope
			    });
			});
		};

		/*
		 * Send Confirmation popup handler
		 * @return undefined 
		 */
		$scope.openSendConfirmationPopup = function () {

			if ($scope.isInAddMode()) {
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the group first"];
				return;
			}
			$scope.ngData = {};
			$scope.groupConfirmationData  = {
				contact_email: $scope.groupConfigData.summary.contact_email,
				is_salutation_enabled: false,
				is_include_rooming_list: false,
				personal_salutation: ""
			};
			ngDialog.open({
				template: '/assets/partials/groups/summary/groupSendConfirmationPopup.html',
				className: '',
				scope: $scope,
			});
		};

		/*
		 * Send Confirmation email API call
		 * @return undefined 
		 */
		$scope.sendGroupConfirmation = function() {

			var succesfullEmailCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.ngData.successMessage = data.message;
				$scope.ngData.failureMessage = '';
			};

			var failureEmailCallback = function(error) {
				$scope.$emit('hideLoader');
				$scope.ngData.failureMessage = error[0];
				$scope.ngData.successMessage = '';
			};
			var data = {
				postData: $scope.groupConfirmationData,
				groupId: $scope.groupSummaryMemento.group_id
			};
			$scope.invokeApi(rvGroupConfigurationSrv.sendGroupConfirmationEmail, data, succesfullEmailCallback, failureEmailCallback);
		};

		$scope.$on("BILLINGINFOADDED", function() {
			$scope.groupConfigData.summary.posting_account_billing_info = true;
		});

		$scope.saveDemographicsData = function() {
			if ($scope.isInAddMode()) {
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the group to save Demographics"];
				return;
			}
			$scope.updateGroupSummary();
			$scope.closeDialog();
		};

		var showRateChangeWarningPopup = function() {
			ngDialog.open({
				template: '/assets/partials/groups/summary/warnChangeRateNotPossible.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		var onRateChangeSuccessCallBack = function(response) {
			$scope.$emit('hideLoader');
			if (!response.is_changed && !response.is_room_rate_available) {
				showRateChangeWarningPopup();
				$scope.groupConfigData.summary.rate = summaryMemento.rate;
			}
			else{
			  summaryMemento.rate = $scope.groupConfigData.summary.rate;
			}
		};

		var onRateChangeFailureCallBack = function(errorMessage) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
			$scope.groupConfigData.summary.rate = summaryMemento.rate;
		};

		/**
		 * Triggered when user selects a rate from the rates list.
		 * @returns {undefined}
		 */
		$scope.onRateChange = function() {
			var summaryData = $scope.groupConfigData.summary;

			if (!summaryData.group_id) {
				return false;
			}

			var params = {
				group_id: summaryData.group_id,
				rate_id	: summaryData.rate
			};
			var options = {
				successCallBack: onRateChangeSuccessCallBack,
				failureCallBack: onRateChangeFailureCallBack,
				params: params
			};
			$scope.callAPI(rvGroupConfigurationSrv.updateRate, options);
		};

		$scope.cancelDemographicChanges = function() {
			$scope.groupConfigData.summary.demographics = demographicsMemento;
		};

		/**
		 * Warn release the rooms
		 * @return undefined
		 */
		$scope.warnReleaseRooms = function() {
			// Release Rooms NA for cancelled groups and groups that arent saved yet
			if (!$scope.groupConfigData.summary.is_cancelled && !$scope.isInAddMode()) {
				ngDialog.open({
					template: '/assets/partials/groups/summary/warnReleaseRoomsPopup.html',
					className: '',
					scope: $scope,
					closeByDocument: false,
					closeByEscape: false
				});
			}
		};

		/**
		 * [onReleaseRoomsSuccess description]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		var onReleaseRoomsSuccess = function(data) {
			//: Handle successful release
			$scope.closeDialog();
			$scope.$emit("FETCH_SUMMARY");
		};

		/**
		 * [onReleaseRoomsFailure description]
		 * @param  {[type]} errorMessage [description]
		 * @return {[type]}              [description]
		 */
		var onReleaseRoomsFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};

		/**
		 * Handle release rooms
		 * @return undefined
		 */
		$scope.releaseRooms = function() {
			var params = {
				groupId: $scope.groupConfigData.summary.group_id
			};

			var options = {
				params: params,
				successCallBack: onReleaseRoomsSuccess,
				failureCallBack: onReleaseRoomsFailure
			};
			$scope.callAPI(rvGroupConfigurationSrv.releaseRooms, options);
		};

		$scope.abortCancelGroup = function() {
			// Reset the hold status to the last saved status
			$scope.groupConfigData.summary.hold_status = $scope.groupSummaryData.existingHoldStatus;
			$scope.closeDialog();
		};

		/**
		 * [onCancelGroupSuccess description]
		 * @return {[type]} [description]
		 */
		var onCancelGroupSuccess = function(data) {
			// reload the groupSummary
			$scope.closeDialog();
			$scope.reloadPage();
		};

		/**
		 * [onCancelGroupFailure description]
		 * @param  {[type]} errorMessage [description]
		 * @return {[type]}              [description]
		 */
		var onCancelGroupFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
			$scope.abortCancelGroup();
		};

		/**
		 * [cancelGroup description]
		 * @param  {[type]} cancellationReason [description]
		 * @return {[type]}                    [description]
		 */
		$scope.cancelGroup = function(cancellationReason) {
			var params = {
				group_id: $scope.groupConfigData.summary.group_id,
				reason: cancellationReason
			};

			var options = {
				params: params,
				successCallBack: onCancelGroupSuccess,
				failureCallBack: onCancelGroupFailure
			};
			$scope.callAPI(rvGroupConfigurationSrv.cancelGroup, options);
		};

		$scope.onHoldStatusChange = function() {
			if (!$scope.isInAddMode()) {
				var selectedStatus = _.findWhere($scope.groupConfigData.holdStatusList, {
					id: parseInt($scope.groupConfigData.summary.hold_status)
				});
				if (selectedStatus && selectedStatus.name === 'Cancel' && !!selectedStatus.is_system) {
					ngDialog.open({
						template: '/assets/partials/groups/summary/warnCancelGroupPopup.html',
						className: '',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false
					});
				} else {
					$scope.updateGroupSummary();
					$scope.groupSummaryData.existingHoldStatus = parseInt($scope.groupConfigData.summary.hold_status);

				}
			}
		};

		/**
		 * Method to check if the cancel option be available in the hold status select options
		 * @return {Boolean}
		 */
		$scope.isCancellable = function() {
			var sData 					= $scope.groupConfigData.summary,
				hasPermissionToCancel 	= rvPermissionSrv.getPermissionValue('CANCEL_GROUP'),
				isCancelledGroup		= !!sData.is_cancelled,
				noOfInhouseIsZero       = (sData.total_checked_in_reservations === 0),
				balIsZero				= (parseFloat(sData.balance) === 0.0);

			return (hasPermissionToCancel &&
					isCancelledGroup ||
					(noOfInhouseIsZero && balIsZero));
		};

		/**
		 * [onFetchAddonSuccess description]
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		var onFetchAddonSuccess = function(data) {
			$scope.groupConfigData.selectedAddons = data;
			if ($scope.groupConfigData.selectedAddons.length > 0 || $scope.isInStaycardScreen ()) {
				$scope.openAddonsPopup();
			} else {
				$scope.manageAddons();
			}
		};

		/**
		 * [onFetchAddonFailure description]
		 * @param  {[type]} errorMessage [description]
		 * @return {[type]}              [description]
		 */
		var onFetchAddonFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};
		/**
		 * Method to show addons popup
		 * @return undefined
		 */
		$scope.viewAddons = function() {
			var params = {
				id: $scope.groupConfigData.summary.group_id
			};

			var options = {
				params: params,
				successCallBack: onFetchAddonSuccess,
				failureCallBack: onFetchAddonFailure
			};
			$scope.callAPI(rvGroupConfigurationSrv.getGroupEnhancements, options);
		};


		$scope.getRevenue = function() {
			var sData = $scope.groupConfigData.summary;
			if ($scope.isInAddMode()) {
				return "";
			}
			return $rootScope.currencySymbol + $filter('number')(sData.revenue_actual, 2) + '/ ' +
					$rootScope.currencySymbol + $filter('number')(sData.revenue_potential, 2);
		};


		/**
		 * Method used open the addons popup
		 * @return undefined
		 */
		$scope.openAddonsPopup = function() {
			ngDialog.open({
				template: '/assets/partials/groups/summary/groupAddonsPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		/**
		 * manage addons selection/ updates
		 * @return undefined
		 */
		$scope.manageAddons = function() {

			if ($scope.isInAddMode()) {
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the group to manage Add-ons"];
				return;
			}

			$scope.errorMessage = "";

			// ADD ONS button: pop up standard Add On screen - same functionality as on Stay Card, select new or show small window and indicator for existing Add Ons
			var onFetchAddonsSuccess = function(addonsData) {
					$scope.groupConfigData.addons = addonsData;
					$scope.openGroupAddonsScreen();
				},
				onFetchAddonsFailure = function(errorMessage) {
				};

			$scope.callAPI(RVReservationAddonsSrv.fetchAddonData, {
				successCallBack: onFetchAddonsSuccess,
				failureCallBack: onFetchAddonsFailure,
				params: {
					from_date: $scope.groupConfigData.summary.block_from,
					to_date: $scope.groupConfigData.summary.block_to,
					is_active: true,
					is_not_rate_only: true
				}
			});
		};

		$scope.removeAddon = function(addon) {
			var onRemoveAddonSuccess = function(data) {
					$scope.groupConfigData.selectedAddons = data;
					$scope.computeAddonsCount();
				},
				onRemoveAddonFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
				};

			$scope.callAPI(rvGroupConfigurationSrv.removeGroupEnhancement, {
				successCallBack: onRemoveAddonSuccess,
				failureCallBack: onRemoveAddonFailure,
				params: {
					"addon_id": addon.id,
					"id": $scope.groupConfigData.summary.group_id
				}
			});
		};


		/**
		 * Method to save a note
		 * @return undefined
		 */
		$scope.saveGroupNote = function() {
			if ($scope.isInAddMode()) {
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the group to Post Note"];
				return;
			}



			$scope.errorMessage = "";


			if ($scope.groupSummaryData.newNote) {
				var onSaveGroupNoteSuccess = function(data) {
						$scope.groupConfigData.summary.notes = data.notes;
						$scope.groupSummaryData.newNote = "";
						$scope.refreshScroller("groupSummaryScroller");
					},
					onSaveGroupNoteFailure = function(errorMessage) {
						$scope.errorMessage = errorMessage;
					};

				$scope.callAPI(rvGroupConfigurationSrv.saveGroupNote, {
					successCallBack: onSaveGroupNoteSuccess,
					failureCallBack: onSaveGroupNoteFailure,
					params: {
						"notes": $scope.groupSummaryData.newNote,
						"group_id": $scope.groupConfigData.summary.group_id
					}
				});
			} else {
			}
		};

		$scope.removeGroupNote = function(noteId) {
			var onRemoveGroupNoteSuccess = function(data, params) {
					$scope.groupConfigData.summary.notes = _.without($scope.groupConfigData.summary.notes, _.findWhere($scope.groupConfigData.summary.notes, {
						note_id: params.noteId
					}));
					$scope.refreshScroller("groupSummaryScroller");
				},
				onRemoveGroupNoteFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
				};

			$scope.callAPI(rvGroupConfigurationSrv.removeGroupNote, {
				successCallBack: onRemoveGroupNoteSuccess,
				failureCallBack: onRemoveGroupNoteFailure,
				params: {
					"note_id": noteId
				},
				successCallBackParameters: {
					"noteId": noteId
				}
			});
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

			if ($scope.billingInfoModalOpened) {
				var swipeOperationObj = new SwipeOperation();
				var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
				var tokenizeSuccessCallback = function(tokenValue) {
					$scope.$emit('hideLoader');
					swipedCardData.token = tokenValue;
					processSwipedData(swipedCardData);
                                        $scope.swippedCard = true;
				};
				$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
			}
		});

		var fetchApplicableRates = function() {
			var onFetchRatesSuccess = function(data) {
					var sumData = $scope.groupSummaryData;
						sumData.rateSelectDataObject = [];

					// add custom rate obect
					sumData.rateSelectDataObject.push({
						id: -1,
						name: "Custom Rate"
					});
					// group rates by contracted and group rates.
					_.each(data.results, function(rate) {
						if (rate.is_contracted) {
							rate.groupName = "Company/ Travel Agent Contract";
						}
						else {
							rate.groupName = "Group Rates";
						}
						sumData.rateSelectDataObject.push(rate)
					});

				},
				onFetchRatesFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
				};

			$scope.callAPI(rvGroupConfigurationSrv.getRates, {
				successCallBack: onFetchRatesSuccess,
				failureCallBack: onFetchRatesFailure,
				params: {
					from_date: $filter('date')(tzIndependentDate($scope.groupConfigData.summary.block_from), 'yyyy-MM-dd'),
					to_date: $filter('date')(tzIndependentDate($scope.groupConfigData.summary.block_to), 'yyyy-MM-dd'),
					company_id: ($scope.groupConfigData.summary.company && $scope.groupConfigData.summary.company.id) || null,
					travel_agent_id: ($scope.groupConfigData.summary.travel_agent && $scope.groupConfigData.summary.travel_agent.id) || null
				}
			});
		};

		/**
		 * when a tab switch is there, parant controller will propogate an event
		 * we will use this to fetch summary data
		 */
		$scope.$on("GROUP_TAB_SWITCHED", function(event, activeTab) {
			if (activeTab !== 'SUMMARY') {
				return;
			}

			$scope.$emit("FETCH_SUMMARY");

			//to date picker will be in disabled in move mode
			//in order to fix the issue of keeping that state even after coming back to this
			//tab after going to some other tab
			setDatePickerOptions();

			initializeChangeDateActions ();

			//we are resetting the API call in progress check variable
			$scope.isUpdateInProgress = false;

			//we have to refresh this data on tab siwtch
			$scope.computeSegment();
		});

		/**
		 * Since this is reusing from stayccard, we need to refresh the scrollers when the drawer icon clicked
		 * @param  {[type]} event       [description]
		 * @return {[type]}             [description]
		 */
		$scope.$on ('REFRESH_ALL_CARD_SCROLLERS', function(event){
			$timeout(function(){
				$scope.refreshScroller("groupSummaryScroller");
			}, 100);
		});

		/**
		 * We need to refresh the rates once company card info is changed
		 */
		$scope.$on("COMPANY_CARD_CHANGED", function(event) {
			fetchApplicableRates();
		});

		/**
		 * We need to refresh the rates once TA card info is changed
		 */
		$scope.$on("TA_CARD_CHANGED", function(event) {
			fetchApplicableRates();
		});


		/**
		 * [initializeVariables description]
		 * @param  {[type]} argument [description]
		 * @return {[type]}          [description]
		 */
		var initializeVariables = function(argument) {

			$scope.groupSummaryData = {
				releaseOnDate: $rootScope.businessDate,
				demographics: null,
				promptMandatoryDemographics: false,
				isDemographicsPopupOpen: false,
				newNote: "",

				//This is required to reset Cancel when selected in dropdown but not proceeded with in the popup
				existingHoldStatus: parseInt($scope.groupConfigData.summary.hold_status),
				computedSegment: false,
				rates: [],
				contractedRates: [],
				rateSelectDataObject: []
			};

			$scope.changeDatesActions = {};
			$scope.billingInfoModalOpened = false;

			//we use this to ensure that we will call the API only if there is any change in the data
			summaryMemento = _.extend({}, $scope.groupConfigData.summary);
			demographicsMemento = {};

			//since we are recieving two ouside click event on tapping outside, we wanted to check and act
			$scope.isUpdateInProgress = false;
		};
		//CICO-23143
		$scope.$on("SET_ACTIONS_COUNT", function(event, value){
			if(value === "new"){
				$scope.groupConfigData.summary.total_group_action_tasks_count = parseInt($scope.groupConfigData.summary.total_group_action_tasks_count) + parseInt(1);
				$scope.groupConfigData.summary.pending_group_action_tasks_count = parseInt($scope.groupConfigData.summary.pending_group_action_tasks_count) + parseInt(1);
			} else if(value === "complete"){
				$scope.groupConfigData.summary.pending_group_action_tasks_count = parseInt($scope.groupConfigData.summary.pending_group_action_tasks_count) - parseInt(1);
			}
		});

		/**
		 * [isInStaycardScreen description]
		 * @return {Boolean} [description]
		 */
		$scope.isInStaycardScreen = function() {
			var sumData = $scope.groupConfigData;
			return  ('activeScreen' in sumData && sumData.activeScreen === 'STAY_CARD');
		};

		/**
		 * Function used to initialize summary view
		 * @return undefined
		 */
		var initializeMe = function() {
			BaseCtrl.call(this, $scope);

			//summary scroller
			$scope.setScroller("groupSummaryScroller", {
				tap: true,
				preventDefault: false
			});

			//we have a list of scope varibales which we wanted to initialize
			initializeVariables();

			//IF you are looking for where the hell the API is CALLING
			//scroll above, and look for the event 'GROUP_TAB_SWITCHED'

			//date related setups and things
			//
			// Fetch rates to show in dropdown
			if (!!$scope.groupConfigData.summary.block_from && !!$scope.groupConfigData.summary.block_to) {
				fetchApplicableRates();
			}

			// Redo rates list while modifying attached cards to the group
			$scope.$on('CARDS_CHANGED', function() {
				// Fetch rates to show in dropdown
				if (!!$scope.groupConfigData.summary.block_from && !!$scope.groupConfigData.summary.block_to) {
					fetchApplicableRates();
				}
			});

			//start date change, end date change, move date actions
			initializeChangeDateActions();

			setDatePickerOptions();

			$scope.computeSegment();
		}();
	}

]);