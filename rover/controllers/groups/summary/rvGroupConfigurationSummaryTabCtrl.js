sntRover.controller('rvGroupConfigurationSummaryTab', ['$scope', '$rootScope', 'rvGroupSrv', '$filter', '$stateParams', 'rvGroupConfigurationSrv', 'dateFilter', 'RVReservationSummarySrv', 'ngDialog', 'RVReservationAddonsSrv', 'RVReservationCardSrv', 'rvUtilSrv', '$state', 'rvPermissionSrv',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, dateFilter, RVReservationSummarySrv, ngDialog, RVReservationAddonsSrv, RVReservationCardSrv, util, $state, rvPermissionSrv) {


		var summaryMemento, demographicsMemento;

		/**
		 * Whether our summary data has changed
		 * used to remove the unneccessary API calls
		 * @return {Boolean} [description]
		 */
		var whetherSummaryDataChanged = function() {
			var currentSummaryData = $scope.groupConfigData.summary;
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
			if ($scope.isInAddMode() || targetElement.id === 'summary' ||
				targetElement.id === "cancel-action" || //TODO: Need to check with Dilip/Shiju PC for more about this
				whetherSummaryDataChanged() ||
				$scope.groupSummaryData.isDemographicsPopupOpen || $scope.isUpdateInProgress) {

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
			var refData = $scope.groupConfigData.summary;
			if (refData.release_date.toString().trim() === '') {
				$scope.groupConfigData.summary.release_date = refData.block_from;
			}

			// we will clear end date if chosen start date is greater than end date
			if (refData.block_from > refData.block_to) {
				$scope.groupConfigData.summary.block_to = '';
			}
			//setting the min date for end Date
			$scope.toDateOptions.minDate = refData.block_from;

			$scope.computeSegment();

			if (!!$scope.groupConfigData.summary.block_from && !!$scope.groupConfigData.summary.block_to) {
				fetchApplicableRates();
			}

			//we are in outside of angular world
			runDigestCycle();
		}


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
					console.log(errorMessage);
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
		}

		/**
		 * when to date choosed, this function will fire
		 * @param  {Object} date
		 * @param  {Object} datePickerObj
		 * @return undefined
		 */
		var toDateChoosed = function(date, datePickerObj) {
			$scope.groupConfigData.summary.block_to = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

			$scope.computeSegment();
			//we are in outside of angular world

			if (!!$scope.groupConfigData.summary.block_from && !!$scope.groupConfigData.summary.block_to) {
				fetchApplicableRates();
			}
			runDigestCycle();
		}

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
		}

		/**
		 * to set date picker option for summary view
		 * @return {undefined} [description]
		 */
		var setDatePickerOptions = function() {
			//date picker options - Common
			var commonDateOptions = {
				showOn: 'button',
				dateFormat: $rootScope.jqDateFormat,
				numberOfMonths: 1,
				yearRange: '-1:',
				disabled: $scope.groupConfigData.summary.is_cancelled,
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
		}

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
					// $scope.computeSegment();

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
					console.log(errorMessage);
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
			console.log($scope.accountConfigData.summary.posting_account_name);
			$scope.attachedEntities = {};
			$scope.attachedEntities.posting_account = {};
			$scope.attachedEntities.posting_account.id = $scope.groupConfigData.summary.group_id;
			$scope.attachedEntities.posting_account.name = $scope.accountConfigData.summary.posting_account_name;
			$scope.attachedEntities.posting_account.logo = "GROUP_DEFAULT";
			$scope.billingEntity = "GROUP_DEFAULT_BILLING";

			$scope.billingInfoModalOpened = true;
			//$scope.isFromAccounts = true;
			ngDialog.open({
				template: '/assets/partials/bill/rvBillingInformationPopup.html',
				controller: 'rvBillingInformationPopupCtrl',
				className: '',
				closeByDocument: true,
				scope: $scope
			});

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
			console.log('save demographcis');
			$scope.updateGroupSummary();
			$scope.closeDialog();
		}



		$scope.cancelDemographicChanges = function() {
			$scope.groupConfigData.summary.demographics = demographicsMemento;
		}

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
		}

		/**
		 * Handle release rooms
		 * @return undefined
		 */
		$scope.releaseRooms = function() {
			var onReleaseRoomsSuccess = function(data) {
					//: Handle successful release
					// $scope.groupConfigData.summary.release_date = $rootScope.businessDate;
					$scope.closeDialog();
					fetchSummaryData();
				},
				onReleaseRoomsFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage
				}
			$scope.callAPI(rvGroupConfigurationSrv.releaseRooms, {
				successCallBack: onReleaseRoomsSuccess,
				failureCallBack: onReleaseRoomsFailure,
				params: {
					groupId: $scope.groupConfigData.summary.group_id
				}
			});
		}

		$scope.abortCancelGroup = function() {
			// Reset the hold status to the last saved status
			$scope.groupConfigData.summary.hold_status = $scope.groupSummaryData.existingHoldStatus;
			$scope.closeDialog();
		}

		$scope.cancelGroup = function(cancellationReason) {
			var onCancelGroupSuccess = function() {
					// reload the groupSummary
					$scope.closeDialog();
					$state.go('rover.groups.config', {
						id: $scope.groupConfigData.summary.group_id
					}, {
						reload: true
					});

				},
				onCancelGroupFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
					$scope.abortCancelGroup();
				}
			$scope.callAPI(rvGroupConfigurationSrv.cancelGroup, {
				successCallBack: onCancelGroupSuccess,
				failureCallBack: onCancelGroupFailure,
				params: {
					group_id: $scope.groupConfigData.summary.group_id,
					reason: cancellationReason
				}
			});
		}

		$scope.onHoldStatusChange = function() {
			if (!$scope.isInAddMode()) {
				var selectedStatus = _.findWhere($scope.groupConfigData.holdStatusList, {
					id: parseInt($scope.groupConfigData.summary.hold_status)
				})
				if (selectedStatus && selectedStatus.name === 'Cancel' && !!selectedStatus.is_system) {
					ngDialog.open({
						template: '/assets/partials/groups/summary/warnCancelGroupPopup.html',
						className: '',
						scope: $scope,
						closeByDocument: false,
						closeByEscape: false
					});
				} else {
					console.log('on hold status');
					$scope.updateGroupSummary();
					$scope.groupSummaryData.existingHoldStatus = parseInt($scope.groupConfigData.summary.hold_status);

				}
			}
		}

		/**
		 * Method to check if the cancel option be available in the hold status select options
		 * @return {Boolean}
		 */
		$scope.isCancellable = function() {

			return (rvPermissionSrv.getPermissionValue('CANCEL_GROUP') && !!$scope.groupConfigData.summary.is_cancelled || ($scope.groupConfigData.summary.total_checked_in_reservations === 0 && parseFloat($scope.groupConfigData.summary.balance) === 0.0));
		}

		/**
		 * Method to show addons popup
		 * @return undefined
		 */
		$scope.viewAddons = function() {
			var onFetchAddonSuccess = function(data) {
					$scope.groupConfigData.selectedAddons = data;
					if ($scope.groupConfigData.selectedAddons.length > 0) {
						$scope.openAddonsPopup();
					} else {
						$scope.manageAddons();
					}
				},
				onFetchAddonFailure = function(errorMessage) {
					$scope.errorMessage = errorMessage;
				}

			$scope.callAPI(rvGroupConfigurationSrv.getGroupEnhancements, {
				successCallBack: onFetchAddonSuccess,
				failureCallBack: onFetchAddonFailure,
				params: {
					"id": $scope.groupConfigData.summary.group_id
				}
			});
		}


		$scope.getRevenue = function() {
			if ($scope.isInAddMode()) {
				return "";
			}
			return $rootScope.currencySymbol + $filter('number')($scope.groupConfigData.summary.revenue_actual, 2) + '/ ' + $rootScope.currencySymbol + $filter('number')($scope.groupConfigData.summary.revenue_potential, 2);
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
		}

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
					console.log(errorMessage);
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
			})
		}

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
		}


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
				console.warn("Trying to save empty Note!");
			}
		}

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
					"note_id": noteId,
				},
				successCallBackParameters: {
					"noteId": noteId,
				}
			});
		}


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
				};
				$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
			};
		});

		/**
		 * we will update the summary data, when we got this one
		 * @param  {Object} data
		 * @return undefined
		 */
		var fetchSuccessOfSummaryData = function(data) {
			$scope.groupConfigData.summary = _.extend($scope.groupConfigData.summary, data.groupSummary);

			summaryMemento = _.extend({}, $scope.groupConfigData.summary);
		};

		var fetchApplicableRates = function() {
			var onFetchRatesSuccess = function(data) {
					// split result to contracted vs others for enabling grouping on the dropdown
					$scope.groupSummaryData.rates = _.where(data.results, {
						is_contracted: false
					});

					$scope.groupSummaryData.contractedRates = _.where(data.results, {
						is_contracted: true
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
		 * method to fetch summary data
		 * @return undefined
		 */
		var fetchSummaryData = function() {
			var params = {
				"groupId": $scope.groupConfigData.summary.group_id
			};
			var options = {
				successCallBack: fetchSuccessOfSummaryData,
				params: params
			};

			$scope.callAPI(rvGroupConfigurationSrv.getGroupSummary, options);
		};

		/**
		 * when a tab switch is there, parant controller will propogate an event
		 * we will use this to fetch summary data
		 */
		$scope.$on("GROUP_TAB_SWITCHED", function(event, activeTab) {
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
				contractedRates: []
			};

			$scope.billingInfoModalOpened = false;

			//we use this to ensure that we will call the API only if there is any change in the data
			summaryMemento = _.extend({}, $scope.groupConfigData.summary);
			demographicsMemento = {};

			//since we are recieving two ouside click event on tapping outside, we wanted to check and act
			$scope.isUpdateInProgress = false;
		};

		/**
		 * Function used to initialize summary view
		 * @return undefined
		 */
		var initializeMe = function() {
			BaseCtrl.call(this, $scope);

			//summary scroller
			$scope.setScroller("groupSummaryScroller");

			//updating the left side menu
			$scope.$emit("updateRoverLeftMenu", "menuCreateGroup");

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

			setDatePickerOptions();

			$scope.computeSegment();
		}();
	}
]);