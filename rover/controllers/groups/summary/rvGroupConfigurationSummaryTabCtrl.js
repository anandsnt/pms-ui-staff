sntRover.controller('rvGroupConfigurationSummaryTab', ['$scope', '$rootScope', 'rvGroupSrv', '$filter', '$stateParams', 'rvGroupConfigurationSrv', 'dateFilter', 'RVReservationSummarySrv', 'ngDialog', 'RVReservationAddonsSrv',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, dateFilter, RVReservationSummarySrv, ngDialog, RVReservationAddonsSrv) {
		BaseCtrl.call(this, $scope);

		$scope.setScroller("groupSummaryScroller");

		$scope.groupSummaryData = {
			releaseOnDate: $rootScope.businessDate,
			demographics: null,
			promptMandatoryDemographics: false,
			isDemographicsPopupOpen: false,
			newNote: ""
		}

		var summaryMemento = {};

		var initGroupSummaryView = function() {
			// Have a handler to update the summary - IFF in edit mode
			if (!$scope.isInAddMode()) {
				$scope.$on("OUTSIDECLICKED", function(event, targetElement) {
					if (!angular.equals(summaryMemento, $scope.groupConfigData.summary) && !$scope.groupSummaryData.isDemographicsPopupOpen) {
						//data has changed
						summaryMemento = angular.copy($scope.groupConfigData.summary);
						//call the updateGroupSummary method from the parent controller
						$scope.updateGroupSummary();
					}
				});
			}
		}

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

		$scope.fromDateOptions = {
			showOn: 'button',
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			yearRange: '-1:',
			minDate: tzIndependentDate($rootScope.businessDate),
			beforeShow: function(input, inst) {
				$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
			},
			onClose: function(dateText, inst) {
				$('#ui-datepicker-overlay').remove();
			},
			onSelect: function(date, datePickerObj) {
				$scope.groupConfigData.summary.block_from = date;
				if ($scope.groupConfigData.summary.release_date.trim() == '') {
					$scope.groupConfigData.summary.release_date = $scope.groupConfigData.summary.block_from;
				}

				// we will clear end date if chosen start date is greater than end date
				if ($scope.groupConfigData.summary.block_from > $scope.groupConfigData.summary.block_to) {
					$scope.groupConfigData.summary.block_to = '';
				}
				//setting the min date for end Date
				$scope.toDateOptions.minDate = $scope.groupConfigData.summary.block_from;

				//we are in outside of angular world
				runDigestCycle();
			}
		};

		$scope.toDateOptions = {
			showOn: 'button',
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			yearRange: '-1:',
			minDate: tzIndependentDate($rootScope.businessDate),
			beforeShow: function(input, inst) {
				$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
			},
			onClose: function(dateText, inst) {
				$('#ui-datepicker-overlay').remove();
			},
			onSelect: function(date, datePickerObj) {
				$scope.groupConfigData.summary.block_to = date;

				//we are in outside of angular world
				runDigestCycle();
			}
		};

		$scope.releaseDateOptions = {
			showOn: 'button',
			dateFormat: $rootScope.jqDateFormat,
			numberOfMonths: 1,
			yearRange: '-1:',
			minDate: tzIndependentDate($rootScope.businessDate),
			beforeShow: function(input, inst) {
				$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
			},
			onClose: function(dateText, inst) {
				$('#ui-datepicker-overlay').remove();
			},
			onSelect: function(date, datePickerObj) {
				$scope.groupConfigData.summary.release_date = date;

				//we are in outside of angular world
				runDigestCycle();
			}
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
		var demographicsMemento = {};
		$scope.openDemographicsPopup = function() {
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

		}

		$scope.saveDemographicsData = function() {
			if ($scope.isInAddMode()) {
				// If the group has not been saved yet, prompt user for the same
				$scope.errorMessage = ["Please save the group to save Demographics"];
				return;
			}

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
			ngDialog.open({
				template: '/assets/partials/groups/summary/warnReleaseRoomsPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		}


		/**
		 * Handle release rooms
		 * @return undefined
		 */
		$scope.releaseRooms = function() {
			//TODO : HANDLE RELEASE ROOMS
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

		initGroupSummaryView();
	}
]);